import { query, mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireHost } from "./auth";

async function getEventDoc(ctx: MutationCtx) {
  const ev = await ctx.db.query("event").unique();
  if (!ev) throw new ConvexError("Event row missing — add one in the Convex dashboard");
  return ev;
}

export const getEvent = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("event").unique(),
});

// Clients call this once to measure how far their laptop clock is off.
export const serverTime = mutation({
  args: {},
  handler: async () => Date.now(),
});

export const startRound1 = mutation({
  args: { password: v.string(), durationMs: v.number() },
  handler: async (ctx, { password, durationMs }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    await ctx.db.patch(ev._id, {
      status: "round1",
      roundEndsAt: Date.now() + durationMs,
      pausedRemainingMs: null,
    });
  },
});

export const goToBreak = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    await ctx.db.patch(ev._id, { status: "break", roundEndsAt: null, pausedRemainingMs: null });
  },
});

export const startRound2 = mutation({
  args: { password: v.string(), durationMs: v.number() },
  handler: async (ctx, { password, durationMs }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    await ctx.db.patch(ev._id, {
      status: "round2",
      roundEndsAt: Date.now() + durationMs,
      pausedRemainingMs: null,
    });
  },
});

export const extendRound = mutation({
  args: { password: v.string(), extraMs: v.number() },
  handler: async (ctx, { password, extraMs }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    if (ev.pausedRemainingMs != null) {
      await ctx.db.patch(ev._id, { pausedRemainingMs: Math.max(0, ev.pausedRemainingMs + extraMs) });
    } else if (ev.roundEndsAt != null) {
      await ctx.db.patch(ev._id, { roundEndsAt: ev.roundEndsAt + extraMs });
    } else {
      throw new ConvexError("No round is running");
    }
  },
});

export const pauseRound = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    if (ev.roundEndsAt == null) throw new ConvexError("Nothing to pause");
    await ctx.db.patch(ev._id, {
      pausedRemainingMs: Math.max(0, ev.roundEndsAt - Date.now()),
      roundEndsAt: null,
    });
  },
});

export const resumeRound = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    if (ev.pausedRemainingMs == null) throw new ConvexError("Round is not paused");
    await ctx.db.patch(ev._id, {
      roundEndsAt: Date.now() + ev.pausedRemainingMs,
      pausedRemainingMs: null,
    });
  },
});

export const endEvent = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    await ctx.db.patch(ev._id, { status: "ended", roundEndsAt: null, pausedRemainingMs: null });
  },
});

export const setLeaderboardRevealed = mutation({
  args: { password: v.string(), revealed: v.boolean() },
  handler: async (ctx, { password, revealed }) => {
    requireHost(password);
    const ev = await getEventDoc(ctx);
    await ctx.db.patch(ev._id, { leaderboardRevealed: revealed });
  },
});

// For dry runs only: wipes submissions, hints, scores and evidence releases.
// Teams are kept.
export const resetForDryRun = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    for (const d of await ctx.db.query("submissions").collect()) await ctx.db.delete(d._id);
    for (const d of await ctx.db.query("hintsSent").collect()) await ctx.db.delete(d._id);
    for (const d of await ctx.db.query("judgeScores").collect()) await ctx.db.delete(d._id);
    for (const d of await ctx.db.query("caseState").collect()) {
      await ctx.db.patch(d._id, { releasedEvidenceIds: [] });
    }
    const ev = await getEventDoc(ctx);
    await ctx.db.patch(ev._id, {
      status: "lobby",
      roundEndsAt: null,
      pausedRemainingMs: null,
      leaderboardRevealed: false,
    });
  },
});
