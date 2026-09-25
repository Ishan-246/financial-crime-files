import type { CaseData } from "./types";

const revenuemanip: CaseData = {
  caseId: "revenuemanip",
  caseNumber: "Case #049",
  title: "The Revenue Manipulation Scheme",
  company: "Greenleaf Organics Ltd.",
  location: "",
  industry: "Organic Food Products",
  investigationPeriod: "Jan 2026 - Dec 2026",
  investigationTime: "",
  briefing:
    "Greenleaf Organics has been a market darling, growing revenue by 60% this year. " +
    "But forensic accountants have noticed something troubling: revenue growth doesn't " +
    "match cash collections, and there are unexplained adjustments to revenue accounts.",
  vendorsUnlockRound: 1,

  suspects: [
  { id: 'S01', name: 'Meera Reddy', position: 'CEO', responsibilities: [], redFlag: 'Pushed aggressive revenue targets' },
  { id: 'S02', name: 'Karan Joshi', position: 'CFO', responsibilities: [], redFlag: 'Approved unusual revenue adjustments' },
  { id: 'S03', name: 'Sanjay Gupta', position: 'Sales Head', responsibilities: [], redFlag: 'Reported fictitious sales' },
  { id: 'S04', name: 'Anita Desai', position: 'Accounts Receivable', responsibilities: [], redFlag: 'Manipulated aging reports' },
  { id: 'S05', name: 'Rajesh Pillai', position: 'Sales Manager', responsibilities: [], redFlag: 'Created fake customer accounts' },
  { id: 'S06', name: 'Priya Malhotra', position: 'External Auditor', responsibilities: [], redFlag: 'Allegedly looked the other way' }
  ],

  vendors: [
  { id: 'V01', name: 'Fresh Farms Produce', contact: 'Sunita Sharma', established: '12 Feb 2023', bank: 'HDFC ****6721', location: '', business: 'Produce Supply', notes: 'Annual payments ₹36,50,000. Flagged Suspicious. Newest vendor, incorporated weeks before the aggressive revenue push in C01. No business filings prior to registration. Registered office is a shared co-working address also listed for two other Greenleaf vendors. TXN-0218 invoiced at a higher quantity than PO-1265 authorized.' },
  { id: 'V02', name: 'Organic Express', contact: 'Vikram Reddy', established: '05 Jun 2022', bank: 'ICICI ****3380', location: '', business: 'Cold-Chain Transport', notes: 'Annual payments ₹28,40,000. Flagged Suspicious. Vikram Reddy is a distant cousin of Sanjay Gupta (Sales Head) — never disclosed on the vendor onboarding form. Operates with only one listed employee despite this payment volume. INV-2246 billed ₹5,35,000 against PO-1145 authorized for ₹4,10,000, no revised PO on file.' },
  { id: 'V03', name: 'Premium Harvest', contact: 'Amit Singh', established: '18 Mar 2020', bank: 'SBI ****4491', location: '', business: 'Bulk Organic Grain Supply', notes: "Annual payments ₹52,80,000. Not flagged. Greenleaf's longest-standing bulk-grain supplier, four-year track record, no discrepancies. Every PO, invoice, and GRN matches exactly. Bank account unchanged since onboarding. Treated as a clean baseline vendor." },
  { id: 'V04', name: 'Green Logistics', contact: 'Pooja Mehta', established: '22 Nov 2019', bank: 'Axis ****8823', location: '', business: 'Freight', notes: 'Annual payments ₹22,60,000. Not flagged. Original freight partner, predates current management. Flat monthly freight contract, never the subject of an aging or quantity discrepancy. Legitimate reference point.' },
  { id: 'V05', name: 'Natural Packaging', contact: 'Suresh Kumar', established: '09 Sep 2021', bank: 'HDFC ****5519', location: '', business: 'Packaging', notes: "Annual payments ₹18,40,000. Flagged Suspicious. Registrar cross-check found the same incorporation agent used to set up all four fictitious customer accounts. Suresh Kumar's registered mobile number partially matches a contact number on one fictitious customer application (unconfirmed link). INV-2320 and INV-2410 show quantities/prices above their POs, no GRN filed for the excess." }
  ],

  financials: {
    overview: [
      { metric: "Revenue", lastYear: "₹8.2 Cr", thisYear: "₹13.1 Cr" },
      { metric: "Expenses", lastYear: "₹6.1 Cr", thisYear: "₹9.8 Cr" },
      { metric: "Profit", lastYear: "₹2.1 Cr", thisYear: "₹3.3 Cr" },
      { metric: "Cash", lastYear: "₹1.8 Cr", thisYear: "₹0.5 Cr" },
    ],
    vendorSpend: [
      { vendor: "Fresh Farms Produce", lastYear: "", thisYear: "₹36,50,000" },
      { vendor: "Organic Express", lastYear: "", thisYear: "₹28,40,000" },
      { vendor: "Premium Harvest", lastYear: "", thisYear: "₹52,80,000" },
      { vendor: "Green Logistics", lastYear: "", thisYear: "₹22,60,000" },
      { vendor: "Natural Packaging", lastYear: "", thisYear: "₹18,40,000" },
    ],
  },

  documents: [
  {"id": "PO-1101", "vendor": "Fresh Farms Produce", "po": {"number": "PO-1101", "product": "Organic Vegetable Crates", "quantity": 800, "unitPrice": 625, "total": 500000}, "invoice": {"number": "INV-2201", "matchedPO": "PO-1101", "quantityBilled": 800, "unitPrice": 625, "totalBilled": 500000, "matchStatus": "Clean match"}},
  {"id": "PO-1145", "vendor": "Organic Express", "po": {"number": "PO-1145", "product": "Cold-Chain Transport Contract", "quantity": 1, "unitPrice": 410000, "total": 410000}, "invoice": {"number": "INV-2246", "matchedPO": "PO-1145", "quantityBilled": 1, "unitPrice": 535000, "totalBilled": 535000, "matchStatus": "Discrepancy \u2014 price exceeds PO, no revision on file"}},
  {"id": "PO-1190", "vendor": "Premium Harvest", "po": {"number": "PO-1190", "product": "Bulk Organic Grain Supply", "quantity": 1400, "unitPrice": 800, "total": 1120000}, "invoice": {"number": "INV-2290", "matchedPO": "PO-1190", "quantityBilled": 1400, "unitPrice": 800, "totalBilled": 1120000, "matchStatus": "Clean match"}},
  {"id": "PO-1220", "vendor": "Natural Packaging", "po": {"number": "PO-1220", "product": "Recyclable Packaging Rolls", "quantity": 2000, "unitPrice": 210, "total": 420000}, "invoice": {"number": "INV-2320", "matchedPO": "PO-1220", "quantityBilled": 3200, "unitPrice": 210, "totalBilled": 672000, "matchStatus": "Discrepancy \u2014 quantity exceeds PO, no GRN for excess"}},
  {"id": "PO-1265", "vendor": "Fresh Farms Produce", "po": {"number": "PO-1265", "product": "Organic Vegetable Crates (Repeat Order)", "quantity": 1000, "unitPrice": 625, "total": 625000}, "invoice": {"number": "INV-2365", "matchedPO": "PO-1265", "quantityBilled": 1328, "unitPrice": 625, "totalBilled": 830000, "matchStatus": "Discrepancy \u2014 quantity exceeds PO by 328 units"}},
  {"id": "PO-1288", "vendor": "Green Logistics", "po": {"number": "PO-1288", "product": "Monthly Freight Contract", "quantity": 1, "unitPrice": 390000, "total": 390000}, "invoice": {"number": "INV-2388", "matchedPO": "PO-1288", "quantityBilled": 1, "unitPrice": 390000, "totalBilled": 390000, "matchStatus": "Clean match"}},
  {"id": "PO-1310", "vendor": "Natural Packaging", "po": {"number": "PO-1310", "product": "Compostable Pouches", "quantity": 1800, "unitPrice": 275, "total": 495000}, "invoice": {"number": "INV-2410", "matchedPO": "PO-1310", "quantityBilled": 1800, "unitPrice": 289, "totalBilled": 520200, "matchStatus": "Discrepancy \u2014 unit price above PO rate"}}
  ],

  transactions: [
    { id: 'TXN-0201', date: '2026-02-10', vendor: 'Customer A', amount: '840000', description: 'Revenue — approved Sanjay Gupta' },
    { id: 'TXN-0202', date: '2026-02-25', vendor: 'Fresh Farms Produce', amount: '680000', description: 'Inventory — approved Karan Joshi' },
    { id: 'TXN-0203', date: '2026-03-05', vendor: 'Customer B', amount: '420000', description: 'Revenue — approved Sanjay Gupta' },
    { id: 'TXN-0204', date: '2026-03-18', vendor: 'Organic Express', amount: '560000', description: 'Inventory — approved Anita Desai' },
    { id: 'TXN-0205', date: '2026-04-01', vendor: 'Customer C', amount: '1240000', description: 'Revenue — approved Sanjay Gupta' },
    { id: 'TXN-0206', date: '2026-04-15', vendor: 'Premium Harvest', amount: '980000', description: 'Inventory — approved Karan Joshi' },
    { id: 'TXN-0207', date: '2026-05-02', vendor: 'Customer D', amount: '380000', description: 'Revenue — approved Rajesh Pillai' },
    { id: 'TXN-0208', date: '2026-05-20', vendor: 'Green Logistics', amount: '420000', description: 'Freight — approved Karan Joshi' },
    { id: 'TXN-0209', date: '2026-06-08', vendor: 'Customer E', amount: '660000', description: 'Revenue — approved Sanjay Gupta' },
    { id: 'TXN-0210', date: '2026-06-22', vendor: 'Natural Packaging', amount: '340000', description: 'Packaging — approved Anita Desai' },
    { id: 'TXN-0211', date: '2026-07-05', vendor: 'Customer F', amount: '920000', description: 'Revenue — approved Rajesh Pillai' },
    { id: 'TXN-0212', date: '2026-07-18', vendor: 'Fresh Farms Produce', amount: '740000', description: 'Inventory — approved Karan Joshi' },
    { id: 'TXN-0213', date: '2026-08-02', vendor: 'Fresh Farms Produce', amount: '500000', description: 'Inventory — approved Karan Joshi' },
    { id: 'TXN-0214', date: '2026-08-15', vendor: 'Organic Express', amount: '535000', description: 'Inventory — approved Anita Desai' },
    { id: 'TXN-0215', date: '2026-09-01', vendor: 'Premium Harvest', amount: '1120000', description: 'Inventory — approved Karan Joshi' },
    { id: 'TXN-0216', date: '2026-09-20', vendor: 'Natural Packaging', amount: '672000', description: 'Packaging — approved Karan Joshi' },
    { id: 'TXN-0217', date: '2026-10-05', vendor: 'Customer G', amount: '710000', description: 'Revenue — approved Sanjay Gupta' },
    { id: 'TXN-0218', date: '2026-10-18', vendor: 'Fresh Farms Produce', amount: '830000', description: 'Inventory — approved Karan Joshi' },
    { id: 'TXN-0219', date: '2026-11-02', vendor: 'Green Logistics', amount: '390000', description: 'Freight — approved Karan Joshi' },
    { id: 'TXN-0220', date: '2026-11-25', vendor: 'Natural Packaging', amount: '520000', description: 'Packaging — approved Anita Desai' },
  ],

  communications: [
    { id: 'C01', date: '2026-01-20', from: 'Meera Reddy', to: 'Sanjay Gupta', message: 'We need to hit ₹50 Cr this year. Find a way to make it happen. (Email)' },
    { id: 'C02', date: '2026-02-01', from: 'Sanjay Gupta', to: 'Rajesh Pillai', message: 'Create a few new accounts. We need to show early momentum. (WhatsApp)' },
    { id: 'C03', date: '2026-02-15', from: 'Rajesh Pillai', to: 'Anita Desai', message: 'Can you hold the aging report? Need to adjust some entries. (Email)' },
    { id: 'C04', date: '2026-03-10', from: 'Anita Desai', to: 'Sanjay Gupta', message: "The auditors are asking about Customer B. What's the status? (Email)" },
    { id: 'C05', date: '2026-03-10', from: 'Sanjay Gupta', to: 'Anita Desai', message: 'Customer B is legitimate. We have signed contracts. (Email)' },
    { id: 'C06', date: '2026-04-05', from: 'Rajesh Pillai', to: 'Sanjay Gupta', message: 'Customer C paid in full. Keep the cash flow moving. (WhatsApp)' },
    { id: 'C07', date: '2026-05-15', from: 'Karan Joshi', to: 'Meera Reddy', message: 'Revenue is up 45%, but collections are lagging by 60 days. (Email)' },
    { id: 'C08', date: '2026-05-15', from: 'Meera Reddy', to: 'Karan Joshi', message: "Focus on the revenue number. We'll worry about collections later. (Email)" },
    { id: 'C09', date: '2026-06-20', from: 'Priya Malhotra', to: 'Karan Joshi', message: 'We need to discuss the revenue recognition practices. (Email)' },
    { id: 'C10', date: '2026-06-20', from: 'Karan Joshi', to: 'Priya Malhotra', message: "Everything is in order. I'll send you the documentation. (Email)" },
  ],

  auditLog: [
    { id: 'AL-01', datetime: '2026-02-01, 09:30 AM', user: 'Sanjay Gupta', action: 'New Customer Created — Desktop, Office' },
    { id: 'AL-02', datetime: '2026-02-10, 03:45 PM', user: 'Rajesh Pillai', action: 'Sales Entry Recorded — Desktop, Office' },
    { id: 'AL-03', datetime: '2026-02-28, 06:20 PM', user: 'Anita Desai', action: 'Receivable Adjustment — Laptop, Home' },
    { id: 'AL-04', datetime: '2026-03-05, 10:15 AM', user: 'Sanjay Gupta', action: 'Customer Profile Created — Desktop, Office' },
    { id: 'AL-05', datetime: '2026-03-18, 04:30 PM', user: 'Rajesh Pillai', action: 'Sales Contract Uploaded — Desktop, Office' },
    { id: 'AL-06', datetime: '2026-04-01, 11:45 PM', user: 'Anita Desai', action: 'Aging Report Modified — Laptop, Unknown Location' },
    { id: 'AL-07', datetime: '2026-05-01, 09:00 AM', user: 'Karan Joshi', action: 'Revenue Adjustment — Desktop, Office' },
    { id: 'AL-08', datetime: '2026-05-15, 02:20 PM', user: 'Sanjay Gupta', action: 'Customer Account Updated — Mobile, Off-site' },
    { id: 'AL-09', datetime: '2026-06-01, 10:30 AM', user: 'Rajesh Pillai', action: 'Payment Posting — Desktop, Office' },
    { id: 'AL-10', datetime: '2026-06-30, 05:15 PM', user: 'Anita Desai', action: 'Receivable Write-off — Desktop, Office' },
  ],

  evidenceBoardPeople: ["Meera Reddy", "Karan Joshi", "Sanjay Gupta", "Anita Desai", "Rajesh Pillai", "Priya Malhotra"],

};

export default revenuemanip;
