import type { CaseData } from "./types";

const novatech: CaseData = {
  caseId: "novatech",
  caseNumber: "Case 07",
  title: "The Nova-Tech File",
  company: "Asteron Consumer Electronics Pvt. Ltd.",
  location: "Pune, Maharashtra",
  industry: "Consumer Electronics Manufacturing",
  investigationPeriod: "April 2025 - March 2026",
  investigationTime: "40 Minutes",
  briefing:
    "Asteron Consumer Electronics Pvt. Ltd. is a Pune-based consumer electronics " +
    "manufacturer. During FY 2025-26, the company's procurement expenditure increased " +
    "compared with the previous financial year. Revenue also increased during the same " +
    "period. Asteron works with several established suppliers across packaging, " +
    "electronic components, consulting, and electrical products. The company has " +
    "initiated an internal investigation after identifying transactions and procurement " +
    "records that require further review.\n\n" +
    "Procurement rules: Purchases above ₹5 lakh require additional approval. " +
    "Purchases above ₹25 lakh require CFO approval. Any change to an approved PO must " +
    "be documented and approved. Supplier bank-account changes require independent " +
    "verification. Procurement records must accurately reflect the approved business " +
    "requirement.",
  vendorsUnlockRound: 1,
  financialLabels: ["FY 2024–25", "FY 2025–26"],
  glossary: [
    { term: "Procurement", meaning: "The process of purchasing goods or services for a company." },
    { term: "Procurement Spend", meaning: "The total amount of money a company spends on purchases." },
    { term: "PO Amendment", meaning: "An official change made to an already-approved Purchase Order." },
    { term: "Audit Log", meaning: "A record showing who made a change, what was changed, and when." },
    { term: "Reconciliation", meaning: "Comparing financial records to check whether the amounts match." },
    { term: "Internal Controls", meaning: "Company rules and checks designed to prevent errors, fraud, or unauthorized actions." },
    { term: "Financial Impact", meaning: "The amount of money potentially affected by an irregular activity." },
  ],

  suspects: [
  { id: 'P01', name: 'Arjun Rao', position: 'Chief Financial Officer', responsibilities: ['Major financial approvals', 'Budget oversight', 'Banking and payment controls', 'High-value procurement approvals'] },
  { id: 'P02', name: 'Meera Kapoor', position: 'Head of Procurement', responsibilities: ['Supplier selection', 'Purchase approvals', 'Procurement policy', 'Purchase Order authorization'] },
  { id: 'P03', name: 'Vikram Joshi', position: 'Accounts Payable Manager', responsibilities: ['Invoice processing', 'Payment processing', 'Payment review', 'Accounts Payable controls'] },
  { id: 'P04', name: 'Sahil Mehta', position: 'Procurement Executive', responsibilities: ['Creating Purchase Orders', 'Updating procurement records', 'Supplier communication', 'Maintaining procurement documentation'] },
  { id: 'P05', name: 'Neha Sharma', position: 'Finance Controller', responsibilities: ['Financial review', 'Reconciliation', 'Internal control monitoring', 'Identifying unusual financial activity'] },
  { id: 'P06', name: 'Rohan Malhotra', position: 'Operations Manager', responsibilities: ['Production planning', 'Material requirements', 'Coordination between operations and procurement'] }
  ],

  vendors: [
  { id: 'V001', name: 'Precision Packaging Solutions', contact: 'Farah Khan', location: 'Pune', established: '2018', business: 'Packaging Manufacturer', bank: 'HDFC ****4821',
    spendByYear: { "2022": '₹14.8 Cr', "2023": '₹16.2 Cr', "2024": '₹17.1 Cr', "2025": '₹18.4 Cr', "2026": '₹19.2 Cr' },
    relationshipSince: '2019', typicalOrderValue: '5 lakh - 12 lakh', poRevisions: 'Rare',
    bankAccountChanges: 'None', paymentDisputes: 'No significant disputes', notes: 'Stable supplier relationship' },
  { id: 'V002', name: 'Nova-Tech Components', contact: 'Karan Bhatia', location: 'Pune', established: '2022', business: 'Electronic Components', bank: 'ICICI ****6714',
    spendByYear: { "2022": '₹1.9 Cr', "2023": '₹2.3 Cr', "2024": '₹2.8 Cr', "2025": '₹3.8 Cr', "2026": '₹6.9 Cr' },
    relationshipSince: '2022', typicalOrderValue: '5 lakh - 20 lakh', poRevisions: 'Limited prior to the investigation period',
    bankAccountChanges: 'None', paymentDisputes: 'No formal disputes', notes: '' },
  { id: 'V003', name: 'Zenith Advisory Services', contact: 'Amit Sethi', location: 'Mumbai', established: '2022', business: 'Procurement & Technical Consulting', bank: 'SBI ****1938',
    spendByYear: { "2022": '₹3.2 Cr', "2023": '₹4.4 Cr', "2024": '₹5.0 Cr', "2025": '₹5.1 Cr', "2026": '₹5.7 Cr' },
    relationshipSince: '2023', typicalOrderValue: '3 lakh - 9 lakh', poRevisions: 'No significant revisions',
    bankAccountChanges: 'None', paymentDisputes: 'No major disputes', notes: 'Staged payments allowed under certain POs' },
  { id: 'V004', name: 'Brightline Trading', contact: 'Suresh Patil', location: 'Nashik', established: '2020', business: 'Electrical & Power Components', bank: 'Axis ****5206',
    spendByYear: { "2022": '₹9.8 Cr', "2023": '₹10.6 Cr', "2024": '₹11.1 Cr', "2025": '₹11.7 Cr', "2026": '₹12.6 Cr' },
    relationshipSince: '2021', typicalOrderValue: '7 lakh - 20 lakh+', poRevisions: 'Occasional operational revisions',
    bankAccountChanges: 'None', paymentDisputes: 'No significant disputes', notes: 'Spending increased gradually' }
  ],

  financials: {
    overview: [
      { metric: "Revenue", lastYear: "₹248.0 Cr", thisYear: "₹271.5 Cr" },
      { metric: "Cost of Materials", lastYear: "₹128.4 Cr", thisYear: "₹151.7 Cr" },
      { metric: "Operating Expenses", lastYear: "₹51.6 Cr", thisYear: "₹55.2 Cr" },
      { metric: "Operating Profit", lastYear: "₹68.0 Cr", thisYear: "₹64.6 Cr" },
      { metric: "Procurement Spend", lastYear: "₹119.8 Cr", thisYear: "₹143.9 Cr" },
    ],
    vendorSpend: [
      { vendor: "Precision Packaging Solutions", lastYear: "₹18.4 Cr", thisYear: "₹19.2 Cr" },
      { vendor: "Nova-Tech Components", lastYear: "₹5.7 Cr", thisYear: "₹6.9 Cr" },
      { vendor: "Zenith Advisory Services", lastYear: "₹5.1 Cr", thisYear: "₹5.7 Cr" },
      { vendor: "Brightline Trading", lastYear: "₹11.7 Cr", thisYear: "₹12.6 Cr" },
    ],
  },

  documents: [
  {"id": "SET-A", "vendor": "Precision Packaging Solutions", "po": {"number": "PO-2417", "date": "12 August 2025", "item": "Packaging Boxes", "quantity": 20000, "unitPrice": 48, "total": 960000, "approval": "Meera Kapoor"}, "invoice": {"number": "INV-PS-8821", "date": "21 August 2025", "item": "Packaging Boxes", "quantity": 20000, "unitPrice": 48, "total": 960000}},
  {"id": "SET-B", "vendor": "Precision Packaging Solutions", "po": {"number": "PO-2672", "date": "5 January 2026", "item": "Packaging Boxes", "quantity": 21000, "unitPrice": 51, "total": 1071000}, "invoice": {"number": "INV-PS-9014", "date": "17 January 2026", "item": "Packaging Boxes", "quantity": 21000, "unitPrice": 51, "total": 1071000}},
  {"id": "SET-C", "vendor": "Nova-Tech Components", "po": {"number": "PO-2571", "date": "15 September 2025", "item": "PCB Connector Modules", "quantity": 2000, "unitPrice": 1850, "total": 3700000, "approval": "Meera Kapoor + Arjun Rao"}, "invoice": {"number": "INV-NT-1048", "date": "25 September 2025", "item": "PCB Connector Modules", "quantity": 2400, "unitPrice": 1850, "total": 4440000}},
  {"id": "SET-D", "vendor": "Nova-Tech Components", "po": {"number": "PO-2720", "date": "9 February 2026", "item": "Sensor Interface Modules", "quantity": 800, "unitPrice": 1900, "total": 1520000}, "invoice": {"number": "INV-NT-1167", "date": "19 February 2026", "item": "Sensor Interface Modules", "quantity": 900, "unitPrice": 1900, "total": 1710000}},
  {"id": "SET-E", "vendor": "Zenith Advisory Services", "po": {"number": "PO-2618", "service": "Technical Sourcing Consultation", "total": 840000}, "invoices": [{"number": "ZAS-2618-01", "installment": "1 of 2", "amount": 420000}, {"number": "ZAS-2618-02", "installment": "2 of 2", "amount": 420000}], "totalBilled": 840000},
  {"id": "SET-F", "vendor": "Zenith Advisory Services", "po": {"number": "PO-2759", "service": "Consulting", "total": 590000}, "invoices": [{"number": "ZAS-2759-01", "installment": "1 of 2", "amount": 295000}, {"number": "ZAS-2759-02", "installment": "2 of 2", "amount": 295000}], "totalBilled": 590000},
  {"id": "SET-G", "vendor": "Brightline Trading", "po": {"number": "PO-2694", "item": "Power Control Boards", "quantity": 600, "unitPrice": 18500, "total": 11100000}, "invoice": {"item": "Power Control Boards", "quantity": 600, "unitPrice": 18500, "total": 11100000}},
  {"id": "SET-H", "vendor": "Brightline Trading", "po": {"number": "PO-2731", "item": "Power Control Boards", "quantity": 480, "unitPrice": 18000, "total": 8640000}, "invoice": {"item": "Power Control Boards", "quantity": 480, "unitPrice": 18000, "total": 8640000}}
  ],

  transactions: [
    { id: 'TX-001', date: '18 Apr 2025', vendor: 'Precision Packaging', amount: '960000', description: 'Packaging — PO-2417' },
    { id: 'TX-002', date: '29 Apr 2025', vendor: 'Brightline Trading', amount: '740000', description: 'Electrical Components' },
    { id: 'TX-003', date: '6 May 2025', vendor: 'Zenith Advisory', amount: '420000', description: 'Consulting' },
    { id: 'TX-004', date: '15 May 2025', vendor: 'Precision Packaging', amount: '880000', description: 'Packaging' },
    { id: 'TX-005', date: '24 May 2025', vendor: 'Brightline Trading', amount: '690000', description: 'Electrical Components' },
    { id: 'TX-006', date: '3 Jun 2025', vendor: 'Nova-Tech', amount: '1240000', description: 'Electronic Components' },
    { id: 'TX-007', date: '14 Jun 2025', vendor: 'Zenith Advisory', amount: '380000', description: 'Consulting' },
    { id: 'TX-008', date: '26 Jun 2025', vendor: 'Brightline Trading', amount: '820000', description: 'Electrical Components' },
    { id: 'TX-009', date: '5 Jul 2025', vendor: 'Precision Packaging', amount: '1020000', description: 'Packaging' },
    { id: 'TX-010', date: '17 Jul 2025', vendor: 'Nova-Tech', amount: '1180000', description: 'Electronic Components' },
    { id: 'TX-011', date: '29 Jul 2025', vendor: 'Zenith Advisory', amount: '460000', description: 'Consulting' },
    { id: 'TX-012', date: '8 Aug 2025', vendor: 'Brightline Trading', amount: '910000', description: 'Electrical Components' },
    { id: 'TX-013', date: '21 Aug 2025', vendor: 'Precision Packaging', amount: '960000', description: 'Packaging — PO-2417' },
    { id: 'TX-014', date: '3 Sep 2025', vendor: 'Brightline Trading', amount: '780000', description: 'Electrical Components' },
    { id: 'TX-015', date: '18 Sep 2025', vendor: 'Nova-Tech', amount: '3700000', description: 'PCB Connector Modules — PO-2571' },
    { id: 'TX-016', date: '25 Sep 2025', vendor: 'Zenith Advisory', amount: '410000', description: 'Consulting' },
    { id: 'TX-017', date: '1 Oct 2025', vendor: 'Nova-Tech', amount: '740000', description: 'Electronic Components' },
    { id: 'TX-018', date: '12 Oct 2025', vendor: 'Brightline Trading', amount: '860000', description: 'Electrical Components' },
    { id: 'TX-019', date: '27 Oct 2025', vendor: 'Precision Packaging', amount: '895000', description: 'Packaging' },
    { id: 'TX-020', date: '14 Nov 2025', vendor: 'Zenith Advisory', amount: '420000', description: 'PO-2618' },
    { id: 'TX-021', date: '28 Nov 2025', vendor: 'Zenith Advisory', amount: '420000', description: 'PO-2618' },
    { id: 'TX-022', date: '9 Dec 2025', vendor: 'Brightline Trading', amount: '930000', description: 'Electrical Components' },
    { id: 'TX-023', date: '18 Dec 2025', vendor: 'Nova-Tech', amount: '1320000', description: 'Electronic Components' },
    { id: 'TX-024', date: '5 Jan 2026', vendor: 'Precision Packaging', amount: '1071000', description: 'PO-2672' },
    { id: 'TX-025', date: '17 Jan 2026', vendor: 'Precision Packaging', amount: '1071000', description: 'PO-2672' },
    { id: 'TX-026', date: '20 Jan 2026', vendor: 'Brightline Trading', amount: '1110000', description: 'PO-2694' },
    { id: 'TX-027', date: '29 Jan 2026', vendor: 'Nova-Tech', amount: '680000', description: 'Electronic Components' },
    { id: 'TX-028', date: '5 Feb 2026', vendor: 'Zenith Advisory', amount: '470000', description: 'Consulting' },
    { id: 'TX-029', date: '19 Feb 2026', vendor: 'Nova-Tech', amount: '1520000', description: 'PO-2720' },
    { id: 'TX-030', date: '21 Feb 2026', vendor: 'Nova-Tech', amount: '190000', description: 'PO-2720' },
    { id: 'TX-031', date: '27 Feb 2026', vendor: 'Brightline Trading', amount: '864000', description: 'PO-2731' },
    { id: 'TX-032', date: '7 Mar 2026', vendor: 'Zenith Advisory', amount: '295000', description: 'PO-2759' },
    { id: 'TX-033', date: '18 Mar 2026', vendor: 'Zenith Advisory', amount: '295000', description: 'PO-2759' },
    { id: 'TX-034', date: '20 Mar 2026', vendor: 'Nova-Tech', amount: '920000', description: 'Electronic Components' },
    { id: 'TX-035', date: '22 Mar 2026', vendor: 'Precision Packaging', amount: '840000', description: 'Packaging' },
    { id: 'TX-036', date: '24 Mar 2026', vendor: 'Brightline Trading', amount: '795000', description: 'Electrical Components' },
    { id: 'TX-037', date: '26 Mar 2026', vendor: 'Nova-Tech', amount: '560000', description: 'Electronic Components' },
    { id: 'TX-038', date: '27 Mar 2026', vendor: 'Precision Packaging', amount: '810000', description: 'Packaging' },
    { id: 'TX-039', date: '28 Mar 2026', vendor: 'Brightline Trading', amount: '825000', description: 'Electrical Components' },
    { id: 'TX-040', date: '30 Mar 2026', vendor: 'Nova-Tech', amount: '480000', description: 'Electronic Components' },
  ],

  communications: [
    { id: 'COM-01', date: '10 September 2025', from: 'Sahil Mehta', to: 'Karan Bhatia', message: 'Please send the updated component requirement sheet before the PO is finalised.' },
    { id: 'COM-02', date: '11 September 2025', from: 'Karan Bhatia', to: 'Sahil Mehta', message: 'Attached the revised quantity sheet. Please confirm once updated.' },
    { id: 'COM-03', date: '15 September 2025', from: 'Sahil Mehta', to: 'Meera Kapoor', message: 'Nova-Tech has confirmed availability for the additional quantity. I have updated the requirement in the system for your review.' },
    { id: 'COM-04', date: '16 September 2025', from: 'Karan Bhatia', to: 'Sahil Mehta', message: 'The additional quantity is confirmed from our side. Please update the order accordingly.' },
    { id: 'COM-05', date: '17 September 2025', from: 'Vikram Joshi', to: 'Sahil Mehta', message: 'The invoice amount is higher than the original PO value. Please confirm the revised approval reference.' },
    { id: 'COM-06', date: '17 September 2025', from: 'Sahil Mehta', to: 'Vikram Joshi', message: 'The quantity was revised after confirmation of additional requirement. The updated approval is available in the system.' },
    { id: 'COM-07', date: '6 February 2026', from: 'Karan Bhatia', to: 'Sahil Mehta', message: 'We can accommodate the additional modules. Let me know once the order quantity has been updated.' },
    { id: 'COM-08', date: '10 February 2026', from: 'Sahil Mehta', to: 'Karan Bhatia', message: 'Working on it. I will confirm once the revised order is reflected.' },
    { id: 'COM-09', date: '12 February 2026', from: 'Sahil Mehta', to: 'Meera Kapoor', message: 'Nova-Tech has requested a small quantity adjustment due to production scheduling. Revised PO is ready for review.' },
    { id: 'COM-10', date: '13 February 2026', from: 'Neha Sharma', to: 'Vikram Joshi', message: 'Please hold the additional amount until the revised approval is visible.' },
    { id: 'COM-11', date: '14 February 2026', from: 'Sahil Mehta', to: 'Vikram Joshi', message: 'The revised approval has been updated. You may proceed with the balance.' },
    { id: 'COM-12', date: '15 February 2026', from: 'Karan Bhatia', to: 'Sahil Mehta', message: 'Thanks. We will keep the invoice aligned with the revised quantity.' },
  ],

  auditLog: [
    { id: 'AL-001', datetime: '10 Sep 2025, 10:14', user: 'SM029', action: 'Opened V002 supplier record' },
    { id: 'AL-002', datetime: '11 Sep 2025, 16:42', user: 'SM029', action: 'Uploaded requirement file to V002 record' },
    { id: 'AL-003', datetime: '15 Sep 2025, 09:18', user: 'SM029', action: 'Created PO-2571' },
    { id: 'AL-004', datetime: '16 Sep 2025, 11:07', user: 'SM029', action: 'Changed quantity on an existing procurement record' },
    { id: 'AL-005', datetime: '16 Sep 2025, 11:11', user: 'SM029', action: 'Submitted revised procurement record' },
    { id: 'AL-006', datetime: '16 Sep 2025, 14:36', user: 'MK014', action: 'Approved revised procurement record' },
    { id: 'AL-007', datetime: '17 Sep 2025, 09:05', user: 'VJ018', action: 'Reviewed TX-015' },
    { id: 'AL-008', datetime: '25 Sep 2025, 15:22', user: 'SM029', action: 'Uploaded INV-NT-1048' },
    { id: 'AL-009', datetime: '6 Feb 2026, 13:26', user: 'SM029', action: 'Opened PO-2720' },
    { id: 'AL-010', datetime: '10 Feb 2026, 17:41', user: 'SM029', action: 'Edited quantity on procurement record' },
    { id: 'AL-011', datetime: '12 Feb 2026, 10:52', user: 'SM029', action: 'Changed quantity on procurement record' },
    { id: 'AL-012', datetime: '12 Feb 2026, 10:56', user: 'SM029', action: 'Submitted revised procurement record' },
    { id: 'AL-013', datetime: '13 Feb 2026, 12:20', user: 'NS021', action: 'Reviewed revised amount' },
    { id: 'AL-014', datetime: '19 Feb 2026, 14:18', user: 'VJ018', action: 'Processed TX-029' },
    { id: 'AL-015', datetime: '21 Feb 2026, 10:04', user: 'VJ018', action: 'Processed TX-030' },
  ],

  evidenceBoardPeople: [
    "Arjun Rao", "Meera Kapoor", "Vikram Joshi", "Sahil Mehta", "Neha Sharma",
    "Rohan Malhotra", "Farah Khan", "Karan Bhatia", "Amit Sethi", "Suresh Patil",
  ],


};

export default novatech;
