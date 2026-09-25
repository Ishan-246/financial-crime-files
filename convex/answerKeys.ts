// convex/answerKeys.ts
// Server-side only. This file NEVER reaches the browser — only imported by
// Convex functions, which run on Convex's servers. Reachable exclusively
// through a password-gated query, same pattern as every other host action.
import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireHost } from "./auth";

const ANSWER_KEYS: Record<string, {
  culprit: string | null;
  crimeType: string | null;
  moneyTrail: string | null;
  totalLoss: string | null;
  missedRedFlags: string[];
}> = {
  // Source document never states an explicit culprit for Nova-Tech.
  // Confirm the intended answer with the case team before judging.
  novatech: {
    culprit: null,
    crimeType: null,
    moneyTrail: null,
    totalLoss: null,
    missedRedFlags: [],
  },

  silentbleed: {
    culprit: "Rohan Mehta — Accounts Manager",
    crimeType: "Asset Misappropriation / Kickback Scheme, disguised as a frame-job on Dev Kumar",
    moneyTrail:
      "Rohan Mehta used the master Department Head password list (given to him by the " +
      "CEO in C02) to log into Dev Kumar's account. He inflated PO-442 and PO-489 after " +
      "Dev's legitimate daytime entries, routing the overbilled amounts through Vertex " +
      "Electronics: TXN-4013 (Rs 31,00,000) and TXN-4019 (Rs 36,00,000), plus TXN-4026 " +
      "(Rs 10,00,000). Dev's real entries came from a Windows PC during office hours; " +
      "the tampered edits and inflated invoices were processed from a MacBook at night " +
      "— the same device used for Rohan's own 'Perfect 2-Way Match' payment approvals.",
    totalLoss: "Approximately Rs 77,00,000 in inflated IT hardware billing via Vertex Electronics",
    missedRedFlags: [
      "CEO handed one person (Rohan) the master password list for every department head",
      "Two PO edits made at 11:45 PM and 11:30 PM, both from a Home IP MacBook, both immediately after Dev's legitimate Windows-PC daytime entry",
      "Dev was verifiably offline on a transpacific flight at the exact minute one of the edits and the framing message were sent",
      "Rohan objected on paper (C04) then processed the same inflated payments himself with a 'Perfect 2-Way Match' he could only get by editing the PO to fit the invoice",
      "Unit price on HD monitors (Rs 25,000) roughly double the market rate (Rs 12,000) flagged by HR but never investigated",
    ],
  },

  revenuemanip: {
    culprit: "Sanjay Gupta — Sales Head",
    crimeType: "Fictitious revenue recognition (fake-customer scheme)",
    moneyTrail:
      "Fake Sales -> Revenue Recognition -> Uncollected Receivables -> Aging Report " +
      "Manipulation -> Hidden Bad Debt -> Bonus Payment to Sanjay Gupta",
    totalLoss: "Approximately Rs 72,00,000 in overstated revenue and unrecoverable receivables",
    missedRedFlags: [
      "Revenue growth of 60% with cash collections lagging",
      "Multiple new customers incorporated in the same month",
      "11:45 PM access to AR system",
      "Aging reports consistently modified",
      "Three vendors invoiced above their purchase orders with no revised PO on file",
    ],
  },
};

export const getAnswerKey = query({
  args: { password: v.string(), caseId: v.string() },
  handler: async (_ctx, args) => {
    requireHost(args.password);
    return ANSWER_KEYS[args.caseId] ?? null;
  },
});
