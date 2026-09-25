import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireHost } from "./auth";

export const getMyHints = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    return await ctx.db
      .query("hintsSent")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .collect();
  },
});

export const sendHint = mutation({
  args: { password: v.string(), teamId: v.id("teams"), text: v.string() },
  handler: async (ctx, { password, teamId, text }) => {
    requireHost(password);
    const team = await ctx.db.get(teamId);
    if (!team) throw new ConvexError("Team not found");
    const clean = text.trim();
    if (!clean) throw new ConvexError("Hint text is empty");
    await ctx.db.insert("hintsSent", { teamId, text: clean, sentAt: Date.now() });
  },
});
