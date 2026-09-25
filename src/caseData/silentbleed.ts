import type { CaseData } from "./types";

const silentbleed: CaseData = {
  caseId: "silentbleed",
  caseNumber: "",
  title: "The Silent Bleed: Inside NexusTech's Expense Crisis",
  company: "NexusTech Solutions",
  location: "", // not stated in source document — confirm with case team
  industry: "IT Consulting & Services",
  investigationPeriod: "June 2026 - November 2026",
  investigationTime: "", // not stated in source document — confirm with case team
  briefing:
    "NexusTech is growing rapidly, but its cash reserves are draining at an alarming " +
    "rate. Total operating expenses have surged despite a company-wide freeze on new " +
    "budgets. The executive team cannot isolate which specific department is causing " +
    "the financial bleed.",
  vendorsUnlockRound: 1,

  suspects: [
  { id: 'S01', name: 'Dev Kumar', position: 'Head of IT', responsibilities: ['Hardware procurement', 'Vendor relations', 'IT infrastructure'], redFlag: 'System Access: IT Procurement Portal, Variance Approval Authority. Frequently clashes with Accounts over payment delays.' },
  { id: 'S02', name: 'Rohan Mehta', position: 'Accounts Manager', responsibilities: ['Invoice matching (2-Way Match)', 'Payment processing', 'Maintaining financial controls'], redFlag: "Holds the master list of all Department Head passwords. Constantly complains about IT's spending — acts as office whistleblower." },
  { id: 'S03', name: 'Arvind Desai', position: 'CEO & Founder', responsibilities: ['Executive oversight', 'Company strategy'], redFlag: 'System Access: Master Admin, Global Override. Views accounting controls as bureaucratic red tape.' },
  { id: 'S04', name: 'Ananya Sharma', position: 'Head of Operations & Facilities', responsibilities: ['Managing office leases', 'Marketing vendor coordination', 'Internal events'], redFlag: "System Access: Ops & Marketing Procurement Portal. Fiercely protective of her own department's budget." }
  ],

  vendors: [
  { id: 'V01', name: 'CloudScale Systems', location: '', established: '12 Jan 2021', business: 'IT Infrastructure', notes: 'Massive, publicly traded global cloud provider. Rigid pricing, poor customer service, but Dev Kumar insists on them for the 99.99% uptime guarantee.' },
  { id: 'V02', name: 'Vertex Electronics', location: '', established: '14 Sep 2024', business: 'IT Hardware', notes: 'Mid-sized hardware distributor that undercuts major brands. Onboarded last year to replace a legacy supplier during a hiring surge.' },
  { id: 'V03', name: 'Prime Office Supplies', location: '', established: '05 Mar 2023', business: 'Facilities', notes: 'Standard routine B2B wholesale supplier — desks, printer ink, general office goods.' },
  { id: 'V04', name: 'Horizon Marketing', location: 'Mumbai', established: '22 Aug 2022', business: 'Advertising', notes: 'High-end digital ad agency out of a luxury Mumbai office. Slick campaigns, premium retainer fees.' }
  ],

  financials: {
    overview: [
      { metric: "Revenue", lastYear: "₹22.0 Cr", thisYear: "₹28.5 Cr" },
      { metric: "Expenses", lastYear: "₹17.5 Cr", thisYear: "₹26.8 Cr" },
      { metric: "Profit", lastYear: "₹4.5 Cr", thisYear: "₹1.7 Cr" },
      { metric: "Cash on Hand", lastYear: "₹5.1 Cr", thisYear: "₹92 Lakh" },
    ],
    vendorSpend: [],
  },

  documents: [
  {"id": "SET-1", "vendor": "Prime Office Supplies", "po": {"number": "PO-101", "date": "01-Jul", "item": "Office Chairs", "quantity": 10, "unitPrice": 12500, "total": 125000, "approval": "Ananya Sharma"}, "invoice": {"number": "INV-PR-44", "date": "02-Jul", "item": "Office Chairs", "quantity": 10, "unitPrice": 12500, "total": 125000}},
  {"id": "SET-2", "vendor": "Vertex Electronics", "po": {"number": "PO-401", "date": "10-Jul", "item": "Dev Laptops", "quantity": 20, "unitPrice": 45000, "total": 900000, "approval": "Dev Kumar"}, "invoice": {"number": "INV-VE-881", "date": "11-Jul", "item": "Dev Laptops", "quantity": 20, "unitPrice": 45000, "total": 900000}},
  {"id": "SET-3", "vendor": "Horizon Marketing", "po": {"number": "PO-602", "date": "02-Aug", "item": "Monthly Ad Retainer", "quantity": 1, "unitPrice": null, "total": 300000, "approval": "Ananya Sharma"}, "invoice": {"number": "INV-HM-09", "date": "04-Aug", "item": "Monthly Ad Retainer", "quantity": 1, "total": 300000}},
  {"id": "SET-4", "vendor": "Vertex Electronics", "po": {"number": "PO-442", "date": "08-Aug", "item": "Dev Laptops", "quantity": 50, "unitPrice": 62000, "total": 3100000, "approval": "Dev Kumar"}, "invoice": {"number": "INV-VE-895", "date": "09-Aug", "item": "Dev Laptops", "quantity": 50, "unitPrice": 62000, "total": 3100000}},
  {"id": "SET-5", "vendor": "CloudScale Systems", "po": {"number": "PO-903", "date": "27-Sep", "item": "Server Instances", "quantity": 5, "unitPrice": 90000, "total": 450000, "approval": "Dev Kumar"}, "invoice": {"number": "INV-CS-112", "date": "28-Sep", "item": "Server Instances", "quantity": 5, "unitPrice": 90000, "total": 450000}},
  {"id": "SET-6", "vendor": "Vertex Electronics", "po": {"number": "PO-489", "date": "03-Sep", "item": "Local Servers", "quantity": 18, "unitPrice": 200000, "total": 3600000, "approval": "Dev Kumar"}, "invoice": {"number": "INV-VE-912", "date": "04-Sep", "item": "Local Servers", "quantity": 18, "unitPrice": 200000, "total": 3600000}},
  {"id": "SET-7", "vendor": "Prime Office Supplies", "po": {"number": "PO-105", "date": "01-Oct", "item": "Standing Desks", "quantity": 5, "unitPrice": 22000, "total": 110000, "approval": "Ananya Sharma"}, "invoice": {"number": "INV-PR-61", "date": "02-Oct", "item": "Standing Desks", "quantity": 5, "unitPrice": 22000, "total": 110000}},
  {"id": "SET-8", "vendor": "Vertex Electronics", "po": {"number": "PO-510", "date": "04-Oct", "item": "HD Monitors", "quantity": 40, "unitPrice": 25000, "total": 1000000, "approval": "Dev Kumar"}, "invoice": {"number": "INV-VE-940", "date": "05-Oct", "item": "HD Monitors", "quantity": 40, "unitPrice": 25000, "total": 1000000}}
  ],

  transactions: [
    { id: 'TXN-4001', date: '2026-06-28', vendor: 'CloudScale Systems', amount: '450000', description: 'Infrastructure — approved Dev Kumar' },
    { id: 'TXN-4002', date: '2026-06-30', vendor: 'Staff Payroll', amount: '4200000', description: 'Payroll — approved Rohan Mehta' },
    { id: 'TXN-4003', date: '2026-07-02', vendor: 'Prime Office Supplies', amount: '125000', description: 'Facilities — PO-101 / INV-44' },
    { id: 'TXN-4004', date: '2026-07-05', vendor: 'Horizon Marketing', amount: '300000', description: 'Advertising — approved Ananya Sharma' },
    { id: 'TXN-4005', date: '2026-07-08', vendor: 'City Municipal Corp', amount: '645000', description: 'Statutory Tax — approved Rohan Mehta' },
    { id: 'TXN-4006', date: '2026-07-12', vendor: 'Vertex Electronics', amount: '900000', description: 'IT Hardware — PO-401 / INV-881' },
    { id: 'TXN-4007', date: '2026-07-15', vendor: 'City Municipal Corp', amount: '115000', description: 'Utilities/Tax — approved Rohan Mehta' },
    { id: 'TXN-4008', date: '2026-07-22', vendor: 'Legal Advisory', amount: '85000', description: 'Legal Fees — approved Arvind Desai' },
    { id: 'TXN-4009', date: '2026-07-28', vendor: 'CloudScale Systems', amount: '450000', description: 'Infrastructure — approved Dev Kumar' },
    { id: 'TXN-4010', date: '2026-07-31', vendor: 'Staff Payroll', amount: '4350000', description: 'Payroll — approved Rohan Mehta' },
    { id: 'TXN-4011', date: '2026-08-02', vendor: 'Prime Office Supplies', amount: '180000', description: 'Facilities — approved Ananya Sharma' },
    { id: 'TXN-4012', date: '2026-08-04', vendor: 'Horizon Marketing', amount: '300000', description: 'Advertising — PO-602 / INV-09' },
    { id: 'TXN-4013', date: '2026-08-10', vendor: 'Vertex Electronics', amount: '3100000', description: 'IT Hardware — PO-442 / INV-895' },
    { id: 'TXN-4014', date: '2026-08-15', vendor: 'Zenith Health Ins.', amount: '410000', description: 'Employee Benefits — approved Ananya Sharma' },
    { id: 'TXN-4015', date: '2026-08-20', vendor: 'GitHub Enterprise', amount: '112000', description: 'Software Subs — approved Dev Kumar' },
    { id: 'TXN-4016', date: '2026-08-28', vendor: 'CloudScale Systems', amount: '450000', description: 'Infrastructure — approved Dev Kumar' },
    { id: 'TXN-4017', date: '2026-08-31', vendor: 'Staff Payroll', amount: '4350000', description: 'Payroll — approved Rohan Mehta' },
    { id: 'TXN-4018', date: '2026-09-02', vendor: 'Prime Office Supplies', amount: '85000', description: 'Facilities — approved Ananya Sharma' },
    { id: 'TXN-4019', date: '2026-09-05', vendor: 'Vertex Electronics', amount: '3600000', description: 'IT Hardware — PO-489 / INV-912' },
    { id: 'TXN-4020', date: '2026-09-10', vendor: 'Slack Technologies', amount: '68000', description: 'Software Subs — approved Dev Kumar' },
    { id: 'TXN-4021', date: '2026-09-15', vendor: 'Horizon Marketing', amount: '300000', description: 'Advertising — approved Ananya Sharma' },
    { id: 'TXN-4022', date: '2026-09-20', vendor: 'Offsite Catering', amount: '215000', description: 'Culture/Events — approved Ananya Sharma' },
    { id: 'TXN-4023', date: '2026-09-28', vendor: 'CloudScale Systems', amount: '450000', description: 'Infrastructure — approved Dev Kumar' },
    { id: 'TXN-4024', date: '2026-09-31', vendor: 'Staff Payroll', amount: '4400000', description: 'Payroll — approved Rohan Mehta' },
    { id: 'TXN-4025', date: '2026-10-02', vendor: 'Prime Office Supplies', amount: '110000', description: 'Facilities — PO-105 / INV-61' },
    { id: 'TXN-4026', date: '2026-10-06', vendor: 'Vertex Electronics', amount: '1000000', description: 'IT Hardware — PO-510 / INV-940' },
    { id: 'TXN-4027', date: '2026-10-15', vendor: 'Horizon Marketing', amount: '300000', description: 'Advertising — approved Ananya Sharma' },
    { id: 'TXN-4028', date: '2026-10-28', vendor: 'CloudScale Systems', amount: '450000', description: 'Infrastructure — approved Dev Kumar' },
    { id: 'TXN-4029', date: '2026-10-31', vendor: 'Staff Payroll', amount: '4400000', description: 'Payroll — approved Rohan Mehta' },
    { id: 'TXN-4030', date: '2026-11-05', vendor: 'Horizon Marketing', amount: '300000', description: 'Advertising — approved Ananya Sharma' },
  ],

  communications: [
    { id: 'C01', date: '2026-07-28', from: 'Ananya Sharma', to: 'Horizon Marketing', message: 'If you want us to renew the Q3 advertising contract, I need a 15% cut on my desk by Friday.' },
    { id: 'C02', date: '2026-08-01', from: 'Arvind Desai', to: 'All Department Heads', message: 'I am tired of vendors threatening to pause services because a Department Head is out of office. A master list of all Department Head portal passwords will be kept in the Finance safe. Rohan, you manage the list.' },
    { id: 'C03', date: '2026-08-08, 09:15 AM', from: 'Dev Kumar', to: 'Rohan Mehta', message: 'Rohan, I just generated PO-442 in the system for the 50 new laptops. Kept them at our standard ₹45k bulk rate. Process it quickly, we need them by Monday.' },
    { id: 'C04', date: '2026-08-09', from: 'Rohan Mehta', to: 'Arvind Desai', message: "Arvind, I am formally objecting to Vertex's billing. Dev is authorizing ₹62k per laptop now. The system cleared it because the PO matches the invoice, but it's a massive overspend." },
    { id: 'C05', date: '2026-08-09', from: 'Arvind Desai', to: 'Rohan Mehta', message: "Rohan, stop playing auditor. Dev said he needs the gear. If the system clears it, you cut the check immediately. Don't slow us down." },
    { id: 'C06', date: '2026-09-03, 10:00 AM', from: 'Dev Kumar', to: 'Rohan Mehta', message: 'PO-489 is in the system for the 10 servers. Boarding my 14-hour flight to Singapore now. Zero Wi-Fi until tomorrow.' },
    { id: 'C07', date: '2026-09-04, 10:15 AM', from: 'Rohan Mehta', to: 'Dev Kumar', message: 'Dev, Vertex billed us for 18 servers today. This is out of control.' },
    { id: 'C08', date: '2026-09-04, 11:30 PM', from: 'Dev Kumar', to: 'Rohan Mehta', message: 'Vertex had to bundle the extra server units due to supply chain shortages. Stop questioning my vendor relationships, Rohan. I just updated the PO to match. Force clear the payment.' },
    { id: 'C09', date: '2026-10-06', from: 'HR Director', to: 'Dev Kumar', message: 'Dev, why is your department spending ₹25k on standard desk monitors? My team just ordered the exact same models on Amazon for ₹12k.' },
    { id: 'C10', date: '2026-10-05', from: 'Rohan Mehta', to: 'Personal Email', message: "I can't take this company anymore. Dev is completely out of control with the hardware budget and Arvind just lets him do it. I'm updating my resume this weekend." },
    { id: 'C11', date: '2026-10-06, 09:00 AM', from: 'Dev Kumar', to: 'IT Security Team', message: 'Guys, why are there login alerts on my portal account from a MacBook? I exclusively use a Lenovo ThinkPad Windows machine. Check the logs when you have a minute.' },
  ],

  auditLog: [
    { id: 'AL-01', datetime: '2026-07-10, 09:14 AM', user: 'Dev Kumar', action: 'Created PO-401 (Total: ₹9,00,000) — Office IP (Windows PC)' },
    { id: 'AL-02', datetime: '2026-08-08, 09:12 AM', user: 'Dev Kumar', action: 'Created PO-442 (Total: ₹22,50,000) — Office IP (Windows PC)' },
    { id: 'AL-03', datetime: '2026-08-08, 11:45 PM', user: 'Dev Kumar (account)', action: 'Edited PO-442 — Home IP (MacBook)' },
    { id: 'AL-04', datetime: '2026-08-10, 09:30 AM', user: 'Rohan Mehta', action: 'Processed Payment TXN-4013 - Perfect 2-Way Match — Office IP (MacBook)' },
    { id: 'AL-05', datetime: '2026-09-03, 09:55 AM', user: 'Dev Kumar', action: 'Created PO-489 (Total: ₹20,00,000) — Office IP (Windows PC)' },
    { id: 'AL-06', datetime: '2026-09-03, 11:30 PM', user: 'Dev Kumar (account)', action: 'Edited PO-489 — Home IP (MacBook)' },
    { id: 'AL-07', datetime: '2026-09-05, 10:05 AM', user: 'Rohan Mehta', action: 'Processed Payment TXN-4019 - Perfect 2-Way Match — Office IP (MacBook)' },
  ],

  evidenceBoardPeople: ["Dev Kumar", "Rohan Mehta", "Arvind Desai", "Ananya Sharma"],


};

export default silentbleed;
