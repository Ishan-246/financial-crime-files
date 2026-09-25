// convex/evidenceDrops.ts
// Server-side only. Round 2 evidence lives here (not in src/caseData) so
// participants cannot read it early through DevTools. A team only receives
// a drop after the host releases it for that team's case group.
// Wording is copied from the case documents.

export interface EvidenceDrop {
  id: string;
  label: string;
  format: "table" | "paragraph" | "bullets";
  intro?: string;
  rows?: { field: string; value: string }[]; // format: "table"
  paragraphs?: string[]; // format: "paragraph"
  bullets?: string[]; // format: "bullets"
  lists?: { title: string; items: string[] }[]; // optional numbered lists
}

export const EVIDENCE_DROPS: Record<string, EvidenceDrop[]> = {
  // ---------- Nova-Tech: Round 2 Evidence Drop (document tables) ----------
  novatech: [
    {
      id: "drop1",
      label: "Document Drop 1",
      format: "table",
      rows: [
        { field: "PO Number", value: "PO-2814" },
        { field: "Receipt Date", value: "21 February 2026" },
        { field: "Material Received", value: "Packaging Material" },
        { field: "Quantity Ordered", value: "20,000 units" },
        { field: "Quantity Received", value: "20,000 units" },
      ],
    },
    {
      id: "drop2",
      label: "Document Drop 2",
      format: "table",
      rows: [
        { field: "PO Number", value: "PO-2694" },
        { field: "Payment Date", value: "20 January 2026" },
        { field: "Invoice Amount", value: "₹1,11,00,000" },
        { field: "Payment Requested", value: "₹1,11,00,000" },
        { field: "Verification Status", value: "Completed" },
        { field: "Approval Status", value: "Approved" },
        { field: "Payment Status", value: "Processed" },
      ],
    },
    {
      id: "drop3",
      label: "Document Drop 3",
      format: "table",
      rows: [
        { field: "PO Number", value: "PO-2571" },
        { field: "Record Date", value: "16 September 2025" },
        { field: "Quantity", value: "Previous: 2,000 | Updated: 2,400" },
        { field: "Unit Price", value: "₹1,850" },
        { field: "Total Value", value: "Previous: ₹37,00,000 | Updated: ₹44,40,000" },
        { field: "Reason Recorded", value: "Updated component requirement" },
        { field: "Approval Status", value: "Approved" },
      ],
    },
    {
      id: "drop4",
      label: "Document Drop 4",
      format: "table",
      rows: [
        { field: "PO Number", value: "PO-2618" },
        { field: "Service Period", value: "November 2025" },
        { field: "Service Status", value: "Completed" },
        { field: "Contracted Amount", value: "₹8,40,000" },
        { field: "Amount Certified", value: "₹8,40,000" },
      ],
    },
    {
      id: "drop5",
      label: "Document Drop 5",
      format: "table",
      rows: [
        { field: "PO Number", value: "PO-2720" },
        { field: "Record Date", value: "12 February 2026" },
        { field: "Quantity", value: "Previous: 800 | Updated: 900" },
        { field: "Unit Price", value: "₹1,900" },
        { field: "Total Value", value: "Previous: ₹15,20,000 | Updated: ₹17,10,000" },
        { field: "Approval Status", value: "Approved" },
      ],
    },
    {
      id: "drop6",
      label: "Document Drop 6",
      format: "table",
      rows: [
        { field: "PO Number", value: "PO-2731" },
        { field: "Delivery Date", value: "27 February 2026" },
        { field: "Material", value: "Power Control Boards" },
        { field: "Quantity Ordered", value: "480" },
        { field: "Quantity Delivered", value: "480" },
        { field: "Unit Price", value: "₹18,000" },
        { field: "Total Value", value: "₹86,40,000" },
        { field: "Inspection", value: "Accepted" },
      ],
    },
  ],

  // ---------- NexusTech (The Silent Bleed): paragraph, as in the document ----------
  silentbleed: [
    {
      id: "evidence",
      label: "The Evidence — Singapore Airlines Passenger Manifest & Wi-Fi Logs",
      format: "paragraph",
      paragraphs: [
        "Subpoenaed flight records confirm that Dev Kumar boarded Flight SQ421 to Singapore at 10:15 AM on September 3rd. In-flight connectivity logs prove his seat did not purchase or connect to the aircraft's Wi-Fi. Dev was completely offline over the Indian Ocean at 11:30 PM—the exact minute his portal account performed the System Edit on the server quantities, and the exact minute he supposedly sent the aggressive Slack message to Rohan (C08).",
      ],
    },
    {
      id: "board",
      label: "Evidence Board — Suspects & Vendors",
      format: "paragraph",
      lists: [
        { title: "Suspects", items: ["Dev Kumar", "Rohan Mehta", "Arvind Desai", "Ananya Sharma"] },
        {
          title: "Vendors",
          items: ["CloudScale Systems", "Vertex Electronics", "Prime Office Supplies", "Horizon Marketing"],
        },
      ],
    },
  ],

  // ---------- Greenleaf (Revenue Manipulation): Evidence F only ----------
  revenuemanip: [
    {
      id: "evF",
      label: "Evidence F — Vendor Overbilling",
      format: "bullets",
      intro: "A parallel review of vendor payments turns up a second pattern:",
      bullets: [
        "Three of Greenleaf's five vendors were invoiced above their authorizing purchase orders, with no revised PO or goods-received note on file",
        "Two of those three vendors — Fresh Farms Produce and Natural Packaging — were registered within the same period the aggressive revenue targets began",
        "Natural Packaging's incorporation agent matches the one used to set up all four fictitious customer accounts in Evidence B",
      ],
    },
  ],
};
