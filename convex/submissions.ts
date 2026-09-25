import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireHost } from "./auth";

export const getMySubmission = query({
  args: { teamId: v.id("teams"), round: v.number() },
  handler: async (ctx, { teamId, round }) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_team_round", (q) => q.eq("teamId", teamId).eq("round", round))
      .unique();
  },
});

export const submitRound = mutation({
  args: {
    teamId: v.id("teams"),
    round: v.number(),
    leaderPin: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    if (args.round !== 1 && args.round !== 2) throw new ConvexError("Invalid round");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new ConvexError("Team not found");
    if (team.leaderPin !== args.leaderPin.trim()) {
      throw new ConvexError("Only the team leader can submit");
    }

    const ev = await ctx.db.query("event").unique();
    const expected = args.round === 1 ? "round1" : "round2";
    if (!ev || ev.status !== expected) {
      throw new ConvexError(`Round ${args.round} is not open for submissions`);
    }

    const existing = await ctx.db
      .query("submissions")
      .withIndex("by_team_round", (q) => q.eq("teamId", args.teamId).eq("round", args.round))
      .unique();
    if (existing) throw new ConvexError(`Your team has already submitted Round ${args.round}`);

    await ctx.db.insert("submissions", {
      teamId: args.teamId,
      round: args.round,
      data: args.data,
      submittedAt: Date.now(),
    });
  },
});

export const listSubmissions = query({
  args: { password: v.string(), round: v.number() },
  handler: async (ctx, { password, round }) => {
    requireHost(password);
    const all = await ctx.db.query("submissions").collect();
    return all.filter((s) => s.round === round).sort((a, b) => a.submittedAt - b.submittedAt);
  },
});

export const getTeamSubmissions = query({
  args: { password: v.string(), teamId: v.id("teams") },
  handler: async (ctx, { password, teamId }) => {
    requireHost(password);
    return await ctx.db
      .query("submissions")
      .withIndex("by_team_round", (q) => q.eq("teamId", teamId))
      .collect();
  },
});
