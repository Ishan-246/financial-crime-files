import { query, mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireHost } from "./auth";

// DRAFT rubric (100% manual judging). Confirm criteria and marks with the club.
export const RUBRIC = [
  { key: "logic", label: "Logic of the explanation", max: 30 },
  { key: "moneyTrail", label: "Money trail accuracy", max: 25 },
  { key: "evidence", label: "Quality of evidence used", max: 25 },
  { key: "diverts", label: "Handled distractions and diverts", max: 20 },
];

export const getRubric = query({
  args: {},
  handler: async () => RUBRIC,
});

export const upsertScore = mutation({
  args: {
    password: v.string(),
    teamId: v.id("teams"),
    judgeName: v.string(),
    criteria: v.array(v.object({ key: v.string(), score: v.number() })),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    requireHost(args.password);
    const team = await ctx.db.get(args.teamId);
    if (!team) throw new ConvexError("Team not found");
    const judgeName = args.judgeName.trim();
    if (!judgeName) throw new ConvexError("Enter your judge name first");

    for (const c of args.criteria) {
      if (!RUBRIC.some((r) => r.key === c.key)) throw new ConvexError(`Unknown criterion: ${c.key}`);
    }
    let total = 0;
    const criteria: { key: string; score: number }[] = [];
    for (const r of RUBRIC) {
      const s = args.criteria.find((c) => c.key === r.key)?.score;
      if (s === undefined || !Number.isFinite(s) || s < 0 || s > r.max) {
        throw new ConvexError(`${r.label} must be between 0 and ${r.max}`);
      }
      total += s;
      criteria.push({ key: r.key, score: s });
    }

    const existing = await ctx.db
      .query("judgeScores")
      .withIndex("by_team_judge", (q) => q.eq("teamId", args.teamId).eq("judgeName", judgeName))
      .unique();
    const doc = { criteria, total, comment: args.comment.trim(), updatedAt: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, doc);
    } else {
      await ctx.db.insert("judgeScores", { teamId: args.teamId, judgeName, ...doc });
    }
  },
});

export const listScores = query({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    return await ctx.db.query("judgeScores").collect();
  },
});

async function buildLeaderboard(ctx: QueryCtx) {
  const teams = await ctx.db.query("teams").collect();
  const scores = await ctx.db.query("judgeScores").collect();
  return teams
    .map((t) => {
      const mine = scores.filter((s) => s.teamId === t._id);
      const avg = mine.length ? mine.reduce((a, s) => a + s.total, 0) / mine.length : null;
      return {
        teamId: t._id,
        name: t.name,
        caseId: t.caseId,
        judges: mine.length,
        average: avg === null ? null : Math.round(avg * 10) / 10,
      };
    })
    .sort((a, b) => (b.average ?? -1) - (a.average ?? -1));
}

export const leaderboard = query({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    return await buildLeaderboard(ctx);
  },
});

// What participants see — null until the host reveals it.
export const publicLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const ev = await ctx.db.query("event").unique();
    if (!ev?.leaderboardRevealed) return null;
    const board = await buildLeaderboard(ctx);
    return board
      .filter((r) => r.average !== null)
      .map((r, i) => ({ rank: i + 1, name: r.name, score: r.average as number }));
  },
});
