import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireHost } from "./auth";
import { EVIDENCE_DROPS } from "./evidenceDrops";
import type { EvidenceDrop } from "./evidenceDrops";

// Participant: only the drops the host has released for THIS team's case.
export const getMyEvidence = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db.get(teamId);
    if (!team) return [];
    const row = await ctx.db
      .query("caseState")
      .withIndex("by_caseId", (q) => q.eq("caseId", team.caseId))
      .unique();
    const drops = EVIDENCE_DROPS[team.caseId] ?? [];
    const released = row?.releasedEvidenceIds ?? [];
    return released
      .map((id) => drops.find((d) => d.id === id))
      .filter((d): d is EvidenceDrop => d !== undefined);
  },
});

// Host: every case group, its drop list, and what's been released so far.
export const listCaseStates = query({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    requireHost(password);
    const rows = await ctx.db.query("caseState").collect();
    return Object.entries(EVIDENCE_DROPS).map(([caseId, drops]) => ({
      caseId,
      drops: drops.map((d) => ({ id: d.id, label: d.label })),
      released: rows.find((r) => r.caseId === caseId)?.releasedEvidenceIds ?? [],
    }));
  },
});

export const releaseEvidence = mutation({
  args: { password: v.string(), caseId: v.string(), evidenceId: v.string() },
  handler: async (ctx, { password, caseId, evidenceId }) => {
    requireHost(password);
    const drops = EVIDENCE_DROPS[caseId];
    if (!drops) throw new ConvexError(`Unknown case: ${caseId}`);
    if (!drops.some((d) => d.id === evidenceId)) throw new ConvexError(`Unknown evidence: ${evidenceId}`);
    const row = await ctx.db
      .query("caseState")
      .withIndex("by_caseId", (q) => q.eq("caseId", caseId))
      .unique();
    if (!row) {
      await ctx.db.insert("caseState", { caseId, releasedEvidenceIds: [evidenceId] });
      return;
    }
    if (row.releasedEvidenceIds.includes(evidenceId)) return;
    await ctx.db.patch(row._id, { releasedEvidenceIds: [...row.releasedEvidenceIds, evidenceId] });
  },
});

// Host: undo an accidental release.
export const retractEvidence = mutation({
  args: { password: v.string(), caseId: v.string(), evidenceId: v.string() },
  handler: async (ctx, { password, caseId, evidenceId }) => {
    requireHost(password);
    const row = await ctx.db
      .query("caseState")
      .withIndex("by_caseId", (q) => q.eq("caseId", caseId))
      .unique();
    if (!row) return;
    await ctx.db.patch(row._id, {
      releasedEvidenceIds: row.releasedEvidenceIds.filter((id) => id !== evidenceId),
    });
  },
});
