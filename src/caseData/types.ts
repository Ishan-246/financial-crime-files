export interface Suspect {
  id: string;
  name: string;
  position: string;
  responsibilities: string[];
  redFlag?: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  established: string;
  business: string;
  notes: string;
  contact?: string;
  bank?: string;
  spendByYear?: Record<string, string>;
  relationshipSince?: string;
  typicalOrderValue?: string;
  poRevisions?: string;
  bankAccountChanges?: string;
  paymentDisputes?: string;
}

export interface DocumentSet {
  id: string;
  vendor: string;
  po: Record<string, any>;
  invoice?: Record<string, any>;
  invoices?: Record<string, any>[];
  totalBilled?: number;
}

export interface Transaction {
  id: string;
  date: string;
  vendor: string;
  amount: string;
  description: string;
}

export interface Communication {
  id: string;
  date: string;
  from: string;
  to: string;
  message: string;
}

export interface AuditEntry {
  id: string;
  datetime: string;
  user: string;
  action: string;
}

// NOTE: this file (and every file in src/caseData/) gets bundled into the
// JavaScript sent to every participant's browser. NEVER put an answer key,
// culprit name, judging rubric, or Round 2 evidence in here — that belongs in Convex only
// (see convex/answerKeys.ts and convex/evidenceDrops.ts), reachable exclusively through a
// password-gated query so participants can never read it via DevTools.
export interface CaseData {
  caseId: string;
  caseNumber: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  investigationPeriod: string;
  investigationTime: string;
  briefing: string;
  vendorsUnlockRound: 1 | 2;
  financialLabels?: [string, string];
  glossary?: { term: string; meaning: string }[];
  suspects: Suspect[];
  vendors: Vendor[];
  financials: {
    overview: { metric: string; lastYear: string; thisYear: string }[];
    vendorSpend: { vendor: string; lastYear: string; thisYear: string }[];
  };
  documents: DocumentSet[];
  transactions: Transaction[];
  communications: Communication[];
  auditLog: AuditEntry[];
  evidenceBoardPeople: string[];
}
