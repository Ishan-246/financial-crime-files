import { useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import type { CaseData } from "./caseData/types";
import type { Flags } from "./tabs";
import type { Role } from "./screens";
import { Label, errMsg, useLocalState } from "./ui";

const CRIME_TYPES = ["Asset Misappropriation", "Corruption", "Financial Statement Fraud", "Other"];
const TRAIL = ["Person", "Action", "Document", "Payment", "Account", "Recipient"] as const;

interface R1 {
  crimeOccurred: string;
  crimeType: string;
  responsible: string;
  how: string;
  amount: string;
  evidence: string[];
  confidence: number;
}
interface R2 {
  conclusionChanged: string;
  moneyTrail: Record<string, string>;
  newEvidence: string;
  responsible: string;
}
const EMPTY_R1: R1 = { crimeOccurred: "", crimeType: "", responsible: "", how: "", amount: "", evidence: ["", "", "", "", ""], confidence: 50 };
const EMPTY_R2: R2 = { conclusionChanged: "", moneyTrail: {}, newEvidence: "", responsible: "" };

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function Q({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="card pad">
      <div style={{ fontWeight: 600, marginBottom: ".75rem" }}>
        {n}. {title} {hint && <span className="dim small" style={{ fontWeight: 400 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Choice({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="row">
      {options.map((o) => (
        <button key={o} className={`chip ${value === o ? "on" : ""}`} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function LockedReport({ round, data }: { round: number; data: Record<string, unknown> }) {
  const d = data as Partial<R1 & R2>;
  return (
    <div className="card pad" style={{ borderColor: "var(--moss)" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: ".75rem" }}>
        <span className="stamp moss">PLAN {round} · FILED</span>
      </div>
      <div className="small stack-sm dim">
        {round === 1 ? (
          <>
            <div><span className="bone">Crime occurred:</span> {d.crimeOccurred || "—"}</div>
            <div><span className="bone">Type:</span> {d.crimeType || "—"}</div>
            <div><span className="bone">Primarily responsible:</span> {d.responsible || "—"}</div>
            <div><span className="bone">How:</span> {d.how || "—"}</div>
            <div><span className="bone">Amount affected:</span> {d.amount || "—"}</div>
            <div><span className="bone">Evidence:</span> {(d.evidence ?? []).filter(Boolean).join(" · ") || "—"}</div>
            <div><span className="bone">Confidence:</span> {d.confidence ?? "—"}%</div>
          </>
        ) : (
          <>
            <div><span className="bone">Conclusion changed:</span> {d.conclusionChanged || "—"}</div>
            <div>
              <span className="bone">Money trail:</span>{" "}
              {TRAIL.map((t) => d.moneyTrail?.[t] || "?").join(" → ")}
            </div>
            <div><span className="bone">New evidence that changed our thinking:</span> {d.newEvidence || "—"}</div>
            <div><span className="bone">Now responsible:</span> {d.responsible || "—"}</div>
          </>
        )}
      </div>
    </div>
  );
}

export function CaseReport({
  kase, teamId, role, pin, status, flags,
}: {
  kase: CaseData;
  teamId: Id<"teams">;
  role: Role;
  pin: string;
  status: string;
  flags: Flags;
}) {
  const r1Sub = useQuery(api.submissions.getMySubmission, { teamId, round: 1 });
  const r2Sub = useQuery(api.submissions.getMySubmission, { teamId, round: 2 });
  const submit = useMutation(api.submissions.submitRound);
  const [r1, setR1] = useLocalState<R1>(`fcf:r1:${teamId}`, EMPTY_R1);
  const [r2, setR2] = useLocalState<R2>(`fcf:r2:${teamId}`, EMPTY_R2);
  const [confirming, setConfirming] = useState<0 | 1 | 2>(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (r1Sub === undefined || r2Sub === undefined) return <p className="dim">Loading…</p>;

  const suspects = kase.suspects.map((s) => `${s.name} — ${s.position}`);
  const suggestions = Object.values(flags).map((f) => f.label);
  const isLeader = role === "leader";

  const send = async (round: 1 | 2) => {
    setError("");
    setBusy(true);
    try {
      await submit({ teamId, round, leaderPin: pin, data: round === 1 ? r1 : r2 });
      setConfirming(0);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const confirmBox = (round: 1 | 2, text: string, button: string) => (
    <div className="card pad" style={{ borderColor: "var(--red)" }}>
      <p className="small" style={{ marginBottom: ".9rem" }}>{text}</p>
      <div className="row">
        <button className="btn btn-primary" disabled={busy} onClick={() => send(round)}>{busy ? "SUBMITTING…" : button}</button>
        <button className="btn btn-ghost" onClick={() => setConfirming(0)}>GO BACK</button>
      </div>
      {error && <p className="red small" style={{ marginTop: ".75rem" }}>{error}</p>}
    </div>
  );

  const memberNote = (round: number) => (
    <div className="card pad dim small">Only your team leader can submit the Round {round} report. You can still investigate every tab.</div>
  );

  /* ---------- Round 1 ---------- */
  const round1 = (() => {
    if (r1Sub) return <LockedReport round={1} data={r1Sub.data} />;
    if (status !== "round1") return <div className="card pad dim small">Round 1 is closed. Your team did not submit a Round 1 report.</div>;
    if (!isLeader) return memberNote(1);
    const howWords = words(r1.how);
    const ready = r1.crimeOccurred && r1.how.trim() && howWords <= 100;
    return (
      <div className="stack">
        <Q n={1} title="Did financial crime occur?">
          <Choice options={["Yes", "No", "Insufficient evidence"]} value={r1.crimeOccurred} onChange={(v) => setR1({ ...r1, crimeOccurred: v })} />
        </Q>
        <Q n={2} title="What type of crime?">
          <Choice options={CRIME_TYPES} value={r1.crimeType} onChange={(v) => setR1({ ...r1, crimeType: v })} />
        </Q>
        <Q n={3} title="Who is primarily responsible?">
          <select value={r1.responsible} onChange={(e) => setR1({ ...r1, responsible: e.target.value })}>
            <option value="">Select a person…</option>
            {suspects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Q>
        <Q n={4} title="How did the crime happen?" hint="(max 100 words)">
          <textarea rows={4} value={r1.how} onChange={(e) => setR1({ ...r1, how: e.target.value })} />
          <div className={`xs mono ${howWords > 100 ? "red" : "dim"}`} style={{ marginTop: ".3rem" }}>{howWords}/100 words</div>
        </Q>
        <Q n={5} title="How much money was affected?">
          <input type="text" placeholder="₹" value={r1.amount} onChange={(e) => setR1({ ...r1, amount: e.target.value })} />
        </Q>
        <Q n={6} title="Your five strongest pieces of evidence" hint="(type, or pick from your red flags)">
          <datalist id="fcf-evidence">{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
          <div className="stack-sm">
            {r1.evidence.map((ev, i) => (
              <input key={i} type="text" list="fcf-evidence" placeholder={`Evidence ${i + 1}`} value={ev}
                onChange={(e) => setR1({ ...r1, evidence: r1.evidence.map((x, j) => (j === i ? e.target.value : x)) })} />
            ))}
          </div>
        </Q>
        <Q n={7} title={`How confident are you? ${r1.confidence}%`}>
          <input type="range" min={0} max={100} value={r1.confidence} onChange={(e) => setR1({ ...r1, confidence: Number(e.target.value) })} />
        </Q>
        {confirming === 1
          ? confirmBox(1, "Once sent, your Phase One conclusion cannot be changed.", "CONFIRM SUBMISSION")
          : (
            <div>
              <button className="btn btn-primary" disabled={!ready} onClick={() => setConfirming(1)}>SEND PLAN TO THE PROFESSOR</button>
              {!ready && <p className="dim xs" style={{ marginTop: ".5rem" }}>Answer question 1 and write how it happened (max 100 words) to submit.</p>}
            </div>
          )}
      </div>
    );
  })();

  /* ---------- Round 2 (final report) ---------- */
  const round2 = (() => {
    if (status !== "round2" && status !== "ended" && !r2Sub) return null;
    if (r2Sub) return <LockedReport round={2} data={r2Sub.data} />;
    if (status !== "round2") return <div className="card pad dim small">Round 2 is closed. Your team did not lock a final answer.</div>;
    if (!isLeader) return memberNote(2);
    const ready = r2.conclusionChanged && r2.responsible;
    return (
      <div className="stack">
        <Q n={1} title="Has your original conclusion changed?">
          <Choice options={["Yes", "No"]} value={r2.conclusionChanged} onChange={(v) => setR2({ ...r2, conclusionChanged: v })} />
        </Q>
        <Q n={2} title="Complete the money trail">
          <div className="trail">
            {TRAIL.map((t, i) => (
              <div key={t} className="step">
                <div className="label">{t}{i < TRAIL.length - 1 ? " →" : ""}</div>
                <input type="text" value={r2.moneyTrail[t] ?? ""} onChange={(e) => setR2({ ...r2, moneyTrail: { ...r2.moneyTrail, [t]: e.target.value } })} />
              </div>
            ))}
          </div>
        </Q>
        <Q n={3} title="What new evidence changed your thinking?">
          <textarea rows={4} value={r2.newEvidence} onChange={(e) => setR2({ ...r2, newEvidence: e.target.value })} />
        </Q>
        <Q n={4} title="Who is now responsible?">
          <select value={r2.responsible} onChange={(e) => setR2({ ...r2, responsible: e.target.value })}>
            <option value="">Select a person…</option>
            {suspects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Q>
        {confirming === 2
          ? confirmBox(2, "This is your FINAL plan. Once executed it cannot be changed.", "LOCK FINAL ANSWER")
          : (
            <div>
              <button className="btn btn-primary" style={{ width: "100%", padding: "1rem" }} disabled={!ready} onClick={() => setConfirming(2)}>
                🔒 EXECUTE THE PLAN
              </button>
              {!ready && <p className="dim xs" style={{ marginTop: ".5rem" }}>Answer questions 1 and 4 to lock your final answer.</p>}
            </div>
          )}
      </div>
    );
  })();

  return (
    <div className="stack">
      <Label>Phase One — the plan</Label>
      {round1}
      {round2 && (
        <>
          <Label>Phase Two — final plan</Label>
          {round2}
        </>
      )}
    </div>
  );
}
