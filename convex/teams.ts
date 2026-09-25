import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { requireHost } from "./auth";

export const VALID_CASES = ["novatech", "silentbleed", "revenuemanip"];
const MIN_MEMBERS = 2;
const MAX_MEMBERS = 4;

// What participants are allowed to see about a team. leaderPin is left out on purpose.
function toPublic(t: Doc<"teams">) {
  return {
    _id: t._id,
    _creationTime: t._creationTime,
    code: t.code,
    name: t.name,
    leaderName: t.leaderName,
    members: t.members,
    caseId: t.caseId,
    lastSeenAt: t.lastSeenAt,
  };
}

function cleanMembers(leaderName: string, members: string[]) {
  const leader = leaderName.trim();
  if (!leader) throw new ConvexError("Leader name is required");
  const list = members.map((m) => m.trim()).filter(Boolean);
  if (!list.some((m) => m.toLowerCase() === leader.toLowerCase())) list.unshift(leader);
  const unique = Array.from(new Map(list.map((m) => [m.toLowerCase(), m])).values());
  if (unique.length < MIN_MEMBERS || unique.length > MAX_MEMBERS) {
    throw new ConvexError(
      `A team needs ${MIN_MEMBERS}–${MAX_MEMBERS} members including the leader (got ${unique.length})`,
    );
  }
  return { leader, members: unique };
}

function cleanPin(pin: string) {
  const p = pin.trim();
  if (!/^\d{4,6}$/.test(p)) throw new ConvexError("Leader PIN must be 4–6 digits");
  return p;
}

function cleanCase(caseId: string) {
  if (!VALID_CASES.includes(caseId)) {
    throw new ConvexError(`caseId must be one of: ${VALID_CASES.join(", ")}`);
  }
  return caseId;
}

// ---------- Participant functions ----------

export const login = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const team = await ctx.db
      .query("teams")
      .withIndex("by_code", (q) => q.eq("code", code.trim().toUpperCase()))
      .unique();
    return team ? toPublic(team) : null;
  },
});

export const getById = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db.get(teamId);
    return team ? toPublic(team) : null;
  },
});

export const verifyLeader = query({
  args: { teamId: v.id("teams"), pin: v.string() },
  handler: async (ctx, { teamId, pin }) => {
    const team = await ctx.db.get(teamId);
    return !!team && team.leaderPin === pin.trim();
  },
});

export const heartbeat = mutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db.get(teamId);
    if (!team) return;
    await ctx.db.patch(teamId, { lastSeenAt: Date.now() });
  },
});

// ---------- Host functions ----------

export const listTeams = query({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    const teams = await ctx.db.query("teams").collect();
    return teams.sort((a, b) => a.code.localeCompare(b.code));
  },
});

export const createTeam = mutation({
  args: {
    password: v.string(),
    code: v.string(),
    name: v.string(),
    leaderName: v.string(),
    members: v.array(v.string()),
    caseId: v.string(),
    leaderPin: v.string(),
  },
  handler: async (ctx, args) => {
    requireHost(args.password);
    const code = args.code.trim().toUpperCase();
    if (!/^[A-Z0-9]{3,12}$/.test(code)) {
      throw new ConvexError("Team code must be 3–12 letters/numbers, no spaces");
    }
    const existing = await ctx.db
      .query("teams")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    if (existing) throw new ConvexError(`Team code ${code} is already taken`);
    const name = args.name.trim();
    if (!name) throw new ConvexError("Team name is required");
    const { leader, members } = cleanMembers(args.leaderName, args.members);
    return await ctx.db.insert("teams", {
      code,
      name,
      leaderName: leader,
      members,
      caseId: cleanCase(args.caseId),
      leaderPin: cleanPin(args.leaderPin),
      lastSeenAt: 0,
    });
  },
});

export const updateTeam = mutation({
  args: {
    password: v.string(),
    teamId: v.id("teams"),
    name: v.string(),
    leaderName: v.string(),
    members: v.array(v.string()),
    caseId: v.string(),
    leaderPin: v.string(),
  },
  handler: async (ctx, args) => {
    requireHost(args.password);
    const team = await ctx.db.get(args.teamId);
    if (!team) throw new ConvexError("Team not found");
    const name = args.name.trim();
    if (!name) throw new ConvexError("Team name is required");
    const { leader, members } = cleanMembers(args.leaderName, args.members);
    await ctx.db.patch(args.teamId, {
      name,
      leaderName: leader,
      members,
      caseId: cleanCase(args.caseId),
      leaderPin: cleanPin(args.leaderPin),
    });
  },
});

export const deleteTeam = mutation({
  args: { password: v.string(), teamId: v.id("teams") },
  handler: async (ctx, { password, teamId }) => {
    requireHost(password);
    const subs = await ctx.db
      .query("submissions")
      .withIndex("by_team_round", (q) => q.eq("teamId", teamId))
      .collect();
    const hints = await ctx.db
      .query("hintsSent")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .collect();
    const scores = await ctx.db
      .query("judgeScores")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .collect();
    for (const d of [...subs, ...hints, ...scores]) await ctx.db.delete(d._id);
    await ctx.db.delete(teamId);
  },
});
