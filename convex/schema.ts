import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  event: defineTable({
    status: v.union(
      v.literal("lobby"),
      v.literal("round1"),
      v.literal("break"),
      v.literal("round2"),
      v.literal("ended"),
    ),
    roundEndsAt: v.union(v.number(), v.null()),
    pausedRemainingMs: v.optional(v.union(v.number(), v.null())),
    leaderboardRevealed: v.optional(v.boolean()),
  }),

  teams: defineTable({
    code: v.string(),
    name: v.string(),
    leaderName: v.string(),
    members: v.array(v.string()), // 2–4 names, leader included
    caseId: v.string(), // "novatech" | "silentbleed" | "revenuemanip"
    leaderPin: v.string(), // secret, never sent to participants
    lastSeenAt: v.number(),
  }).index("by_code", ["code"]),

  submissions: defineTable({
    teamId: v.id("teams"),
    round: v.number(), // 1 or 2
    data: v.any(),
    submittedAt: v.number(),
  }).index("by_team_round", ["teamId", "round"]),

  hintsSent: defineTable({
    teamId: v.id("teams"),
    text: v.string(),
    sentAt: v.number(),
  }).index("by_team", ["teamId"]),

  caseState: defineTable({
    caseId: v.string(),
    releasedEvidenceIds: v.array(v.string()),
  }).index("by_caseId", ["caseId"]),

  judgeScores: defineTable({
    teamId: v.id("teams"),
    judgeName: v.string(),
    criteria: v.array(v.object({ key: v.string(), score: v.number() })),
    total: v.number(),
    comment: v.string(),
    updatedAt: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_team_judge", ["teamId", "judgeName"]),
});
