import { useMemo, useState } from "react";
import type { CaseData, DocumentSet } from "./caseData/types";
import { KV, Label, humanize, inr } from "./ui";

/* ---------- red flags (shared with the evidence board) ---------- */
export type FlagKind = "money" | "documents" | "communication" | "events" | "vendors";
export interface Flag {
  id: string;
  kind: FlagKind;
  label: string;
}
export type Flags = Record<string, Flag>;
export interface FlagProps {
  flags: Flags;
  toggleFlag: (f: Flag) => void;
}

function FlagButton({ flag, flags, toggleFlag }: { flag: Flag } & FlagProps) {
  const on = !!flags[flag.id];
  return (
    <button className={`flag-btn ${on ? "on" : ""}`} onClick={() => toggleFlag(flag)} title="Mark as a red flag">
      {on ? "⚑ FLAGGED" : "⚐ FLAG"}
    </button>
  );
}

/* ------------------------------ CASE ------------------------------ */
export function CaseTab({ kase }: { kase: CaseData }) {
  return (
    <div className="stack">
      <Label>Case overview — {kase.caseNumber ? `${kase.caseNumber} · ` : ""}{kase.title}</Label>
      <div className="card pad-lg">
        <div className="grid2" style={{ marginBottom: "1.25rem" }}>
          <KV k="Company" v={kase.company} />
          <KV k="Industry" v={kase.industry} />
          {kase.location && <KV k="Location" v={kase.location} />}
          <KV k="Investigation period" v={kase.investigationPeriod} />
        </div>
        <p style={{ lineHeight: 1.75, whiteSpace: "pre-line" }}>{kase.briefing}</p>
      </div>
      <div className="card pad">
        <Label>How to investigate</Label>
        <p className="dim small" style={{ lineHeight: 1.7 }}>
          Work through the tabs on the left. Use <span className="red">⚐ FLAG</span> on anything suspicious — every flag appears
          on your Evidence Board. Connect people, money and documents there, then your team leader files the Case Report.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ PEOPLE ------------------------------ */
export function PeopleTab({ kase }: { kase: CaseData }) {
  return (
    <div>
      <Label>Persons of interest</Label>
      <div className="cards">
        {kase.suspects.map((s) => (
          <div key={s.id} className="card pad">
            <div className="stamp dim">{s.id}</div>
            <div className="display" style={{ fontSize: "1.3rem", margin: ".3rem 0" }}>{s.name}</div>
            <div className="gold small" style={{ marginBottom: ".8rem" }}>{s.position}</div>
            {s.responsibilities.length > 0 && (
              <>
                <div className="label">Responsibilities</div>
                <div className="tags" style={{ marginBottom: ".8rem" }}>
                  {s.responsibilities.map((r) => (
                    <span key={r} className="tag">{r}</span>
                  ))}
                </div>
              </>
            )}
            {s.redFlag && (
              <div className="redflag-box">
                <div className="stamp red" style={{ marginBottom: ".3rem" }}>Notes</div>
                {s.redFlag}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ FINANCIALS ------------------------------ */
export function FinancialsTab({ kase }: { kase: CaseData }) {
  const [a, b] = kase.financialLabels ?? ["Last Year", "This Year"];
  const [learn, setLearn] = useState(false);
  const spend = kase.financials.vendorSpend;
  const hasLastYear = spend.some((r) => r.lastYear);
  return (
    <div className="stack">
      <Label>Financial overview — {kase.company}</Label>
      <div className="card pad scroll-x">
        <table className="tbl">
          <thead>
            <tr><th>Metric</th><th>{a}</th><th>{b}</th></tr>
          </thead>
          <tbody>
            {kase.financials.overview.map((r) => (
              <tr key={r.metric}>
                <td style={{ fontWeight: 600 }}>{r.metric}</td>
                <td className="num dim">{r.lastYear}</td>
                <td className="num">{r.thisYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {spend.length > 0 && (
        <>
          <Label>{hasLastYear ? "Selected vendor spend" : "Annual vendor payments"}</Label>
          <div className="card pad scroll-x">
            <table className="tbl">
              <thead>
                <tr><th>Vendor</th>{hasLastYear && <th>{a}</th>}<th>{hasLastYear ? b : "Annual payments"}</th></tr>
              </thead>
              <tbody>
                {spend.map((r) => (
                  <tr key={r.vendor}>
                    <td>{r.vendor}</td>
                    {hasLastYear && <td className="num dim">{r.lastYear}</td>}
                    <td className="num">{r.thisYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {kase.glossary && (
        <div>
          <button className="btn btn-gold" onClick={() => setLearn(!learn)}>
            {learn ? "HIDE" : "LEARN"} — MEANINGS OF THE TERMS
          </button>
          {learn && (
            <div className="card pad" style={{ marginTop: "1rem" }}>
              <table className="tbl">
                <tbody>
                  {kase.glossary.map((g) => (
                    <tr key={g.term}>
                      <td className="gold" style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{g.term}</td>
                      <td className="dim">{g.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ TRANSACTIONS ------------------------------ */
export function TransactionsTab({ kase, flags, toggleFlag }: { kase: CaseData } & FlagProps) {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [sort, setSort] = useState<"order" | "amountDesc" | "amountAsc">("order");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = kase.transactions.filter(
      (t) => !needle || [t.id, t.date, t.vendor, t.description, t.amount].join(" ").toLowerCase().includes(needle),
    );
    if (sort !== "order") {
      list = [...list].sort((x, y) => (Number(x.amount) - Number(y.amount)) * (sort === "amountAsc" ? 1 : -1));
    }
    return list;
  }, [kase, q, sort]);

  return (
    <div className="stack">
      <Label>Transaction terminal — {kase.transactions.length} records</Label>
      <div className="row">
        <div style={{ flex: 1, minWidth: 220 }}>
          <input type="text" placeholder="Search ID, party, amount, description…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className={`chip ${sort === "order" ? "on" : ""}`} onClick={() => setSort("order")}>BY DATE</button>
        <button className={`chip ${sort === "amountDesc" ? "on" : ""}`} onClick={() => setSort("amountDesc")}>AMOUNT ↓</button>
        <button className={`chip ${sort === "amountAsc" ? "on" : ""}`} onClick={() => setSort("amountAsc")}>AMOUNT ↑</button>
      </div>
      <div className="card scroll-x">
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Date</th><th>Party</th><th style={{ textAlign: "right" }}>Amount</th><th>Details</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const flag: Flag = { id: `txn:${t.id}`, kind: "money", label: `${t.id} — ${inr(t.amount)} · ${t.vendor}` };
              return (
                <tr key={t.id} className={`clickable ${flags[flag.id] ? "flagged" : ""}`} onClick={() => setOpenId(t.id)}>
                  <td className="num gold">{t.id}</td>
                  <td className="num dim">{t.date}</td>
                  <td className="mono">{t.vendor}</td>
                  <td className="num" style={{ textAlign: "right" }}>{inr(t.amount)}</td>
                  <td className="dim small">{t.description}</td>
                  <td onClick={(e) => e.stopPropagation()}><FlagButton flag={flag} flags={flags} toggleFlag={toggleFlag} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="dim small pad">No transactions match.</p>}
      </div>
      <p className="dim xs">Click any row to open the full transaction record.</p>
      {openId && <TransactionModal kase={kase} id={openId} onClose={() => setOpenId(null)} onOpen={setOpenId} flags={flags} toggleFlag={toggleFlag} />}
    </div>
  );
}

function TransactionModal({ kase, id, onClose, onOpen, flags, toggleFlag }: {
  kase: CaseData; id: string; onClose: () => void; onOpen: (id: string) => void;
} & FlagProps) {
  const t = kase.transactions.find((x) => x.id === id);
  if (!t) return null;
  const flag: Flag = { id: `txn:${t.id}`, kind: "money", label: `${t.id} — ${inr(t.amount)} · ${t.vendor}` };
  const index = kase.transactions.findIndex((x) => x.id === id);
  const related = kase.transactions.filter((x) => x.vendor === t.vendor && x.id !== t.id);
  const total = kase.transactions.filter((x) => x.vendor === t.vendor).reduce((a, x) => a + Number(x.amount), 0);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal rise" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="stamp gold">Transaction record</span>
          <span className="mono small">{t.id}</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={onClose}>CLOSE ✕</button>
        </div>
        <div className="modal-body">
          <div className="row" style={{ justifyContent: "space-between", marginBottom: "1rem" }}>
            <div className="mono" style={{ fontSize: "1.8rem", color: "var(--gold)" }}>{inr(t.amount)}</div>
            <FlagButton flag={flag} flags={flags} toggleFlag={toggleFlag} />
          </div>
          <KV k="Transaction ID" v={t.id} />
          <KV k="Row" v={`${index + 1} of ${kase.transactions.length}`} />
          <KV k="Date" v={t.date} />
          <KV k="Party" v={t.vendor} />
          <KV k="Amount" v={inr(t.amount)} />
          <KV k="Details" v={t.description} />
          <div style={{ marginTop: "1.25rem" }}>
            <div className="label">Other transactions with {t.vendor} ({related.length}) · total {inr(total)}</div>
            {related.length === 0 ? (
              <p className="dim small">No other transactions with this party.</p>
            ) : (
              <table className="tbl">
                <tbody>
                  {related.map((r) => (
                    <tr key={r.id} className="clickable" onClick={() => onOpen(r.id)}>
                      <td className="num gold">{r.id}</td>
                      <td className="num dim">{r.date}</td>
                      <td className="num" style={{ textAlign: "right" }}>{inr(r.amount)}</td>
                      <td className="dim small">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ DOCUMENTS ------------------------------ */
const MONEY_KEYS = /price|total|amount|billed/i;
function fmtField(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return MONEY_KEYS.test(key) ? inr(value) : value.toLocaleString("en-IN");
  return String(value);
}
function DocCard({ title, doc }: { title: string; doc: Record<string, unknown> }) {
  return (
    <div className="card pad" style={{ flex: 1, minWidth: 240 }}>
      <div className="stamp gold" style={{ marginBottom: ".6rem" }}>{title}</div>
      {Object.entries(doc).map(([k, v]) => (
        <KV key={k} k={humanize(k)} v={fmtField(k, v)} />
      ))}
    </div>
  );
}

export function DocumentsTab({ kase, flags, toggleFlag }: { kase: CaseData } & FlagProps) {
  const [sel, setSel] = useState(kase.documents[0]?.id ?? "");
  const doc: DocumentSet | undefined = kase.documents.find((d) => d.id === sel) ?? kase.documents[0];
  if (!doc) return <p className="dim">No documents in this case.</p>;
  const poNo = String(doc.po.number ?? doc.id);
  const flag: Flag = { id: `doc:${doc.id}`, kind: "documents", label: `${poNo} — ${doc.vendor}` };
  return (
    <div className="stack">
      <Label>Document room — purchase order → invoice</Label>
      <div className="row">
        {kase.documents.map((d) => (
          <button key={d.id} className={`chip ${d.id === doc.id ? "on" : ""}`} onClick={() => setSel(d.id)}>
            {flags[`doc:${d.id}`] ? "⚑ " : ""}{String(d.po.number ?? d.id)}
          </button>
        ))}
      </div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="small">
          <span className="dim">{doc.id} · </span>{doc.vendor}
        </div>
        <FlagButton flag={flag} flags={flags} toggleFlag={toggleFlag} />
      </div>
      <div className="row" style={{ alignItems: "stretch" }}>
        <DocCard title="Purchase order" doc={doc.po} />
        {doc.invoice && <DocCard title="Invoice" doc={doc.invoice} />}
        {doc.invoices?.map((inv, i) => (
          <DocCard key={i} title={`Invoice ${i + 1}`} doc={inv} />
        ))}
      </div>
      {doc.totalBilled !== undefined && (
        <p className="small"><span className="dim">Total billed: </span><span className="mono">{inr(doc.totalBilled)}</span></p>
      )}
      <p className="dim small">Compare the documents carefully. Quantities, prices and totals should match across the chain.</p>
    </div>
  );
}

/* ------------------------------ VENDORS ------------------------------ */
export function VendorsTab({ kase, flags, toggleFlag }: { kase: CaseData } & FlagProps) {
  return (
    <div>
      <Label>Vendor database — {kase.vendors.length} registered suppliers</Label>
      <div className="cards">
        {kase.vendors.map((v) => {
          const flag: Flag = { id: `vendor:${v.id}`, kind: "vendors", label: `${v.id} — ${v.name}` };
          return (
            <div key={v.id} className="card pad">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="stamp dim">{v.id}</span>
                <FlagButton flag={flag} flags={flags} toggleFlag={toggleFlag} />
              </div>
              <div className="display" style={{ fontSize: "1.25rem", margin: ".4rem 0 .8rem" }}>{v.name}</div>
              {v.contact && <KV k="Contact / Owner" v={v.contact} />}
              {v.location && <KV k="Location" v={v.location} />}
              {v.established && <KV k="Established / Registered" v={v.established} />}
              {v.business && <KV k="Business" v={v.business} />}
              {v.bank && <KV k="Bank" v={v.bank} />}
              {v.spendByYear && (
                <div style={{ margin: ".8rem 0" }}>
                  <div className="label">Vendor spend history</div>
                  <table className="tbl">
                    <tbody>
                      {Object.entries(v.spendByYear).map(([year, amt]) => (
                        <tr key={year}>
                          <td className="num dim">{year}</td>
                          <td className="num" style={{ textAlign: "right" }}>{amt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {v.relationshipSince && <KV k="Relationship since" v={v.relationshipSince} />}
              {v.typicalOrderValue && <KV k="Typical order value" v={v.typicalOrderValue.replace(/(\d+) lakh/g, "₹$1 lakh")} />}
              {v.poRevisions && <KV k="PO revisions" v={v.poRevisions} />}
              {v.bankAccountChanges && <KV k="Bank account changes" v={v.bankAccountChanges} />}
              {v.paymentDisputes && <KV k="Payment disputes" v={v.paymentDisputes} />}
              {v.notes && (
                <p className="dim small" style={{ marginTop: ".8rem", lineHeight: 1.6 }}>{v.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ COMMUNICATIONS ------------------------------ */
export function CommsTab({ kase, flags, toggleFlag }: { kase: CaseData } & FlagProps) {
  return (
    <div className="stack">
      <Label>Intercepted communications — {kase.communications.length} messages</Label>
      {kase.communications.map((c) => {
        const flag: Flag = { id: `com:${c.id}`, kind: "communication", label: `${c.id} — ${c.from} → ${c.to}` };
        return (
          <div key={c.id} className="card pad" style={flags[flag.id] ? { borderColor: "var(--red)" } : undefined}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: ".5rem" }}>
              <span className="mono small">
                <span className="gold">{c.id}</span> <span className="dim">· {c.date}</span>
              </span>
              <FlagButton flag={flag} flags={flags} toggleFlag={toggleFlag} />
            </div>
            <div className="small" style={{ marginBottom: ".5rem" }}>
              <span className="dim">From </span>{c.from} <span className="dim">to </span>{c.to}
            </div>
            <p style={{ lineHeight: 1.6 }}>"{c.message}"</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ AUDIT LOG ------------------------------ */
export function AuditTab({ kase, flags, toggleFlag }: { kase: CaseData } & FlagProps) {
  return (
    <div className="stack">
      <Label>System audit log</Label>
      <div className="card scroll-x">
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Date &amp; time</th><th>User</th><th>Action</th><th></th></tr>
          </thead>
          <tbody>
            {kase.auditLog.map((a) => {
              const flag: Flag = { id: `audit:${a.id}`, kind: "events", label: `${a.datetime} — ${a.user}: ${a.action}` };
              return (
                <tr key={a.id} className={flags[flag.id] ? "flagged" : ""}>
                  <td className="num dim">{a.id}</td>
                  <td className="num">{a.datetime}</td>
                  <td className="mono gold">{a.user}</td>
                  <td className="mono">{a.action}</td>
                  <td><FlagButton flag={flag} flags={flags} toggleFlag={toggleFlag} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
