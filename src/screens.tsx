import { useEffect, useMemo, useState } from "react";
import { useConvex, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import type { CaseData } from "./caseData/types";
import { Badge, errMsg } from "./ui";

export type Role = "leader" | "member";

// Press Enter to move to the next screen.
function useEnterKey(action: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
      if (e.key === "Enter" && !typing) {
        e.preventDefault();
        action();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [action]);
}

/* ------------------------------ LANDING ------------------------------ */
function TickerColumn({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const words = ["TXN-4471", "₹18,40,220", "REDACTED", "EVIDENCE-07", "ACCT ****3391", "₹6,20,000", "CLASSIFIED", "TXN-0091",
      "SCANNING...", "₹2,90,000", "GRN MISMATCH", "ACCT ****4471", "TXN-2291", "₹14,40,000", "FLAGGED"];
    const arr: string[] = [];
    for (let i = 0; i < 24; i++) arr.push(words[(i + seed) % words.length]);
    return [...arr, ...arr];
  }, [seed]);
  return (
    <div className="ticker-col">
      {items.map((w, i) => (
        <div key={i}>{w}</div>
      ))}
    </div>
  );
}

export function Landing({ onEnter, onHow }: { onEnter: () => void; onHow: () => void }) {
  useEnterKey(onEnter);
  return (
    <div className="center-screen vignette">
      <div className="heist-vault" style={{ width: 520, height: 520, top: -160, right: -160 }} />
      <div className="heist-vault" style={{ width: 320, height: 320, bottom: -100, left: -100 }} />
      <div className="heist-alarm" />
      <div className="ticker">
        {Array.from({ length: 8 }).map((_, i) => (
          <TickerColumn key={i} seed={i * 3} />
        ))}
      </div>
      <div className="fade-cover" />
      <div className="rise" style={{ position: "relative", zIndex: 2, maxWidth: 760 }}>
        <div className="stamp gold" style={{ letterSpacing: ".35em", marginBottom: "1.25rem" }}>
          A Finance Club Heist Simulation
        </div>
        <h1 className="hero-title" style={{ marginBottom: "1rem" }}>
          Financial
          <br />
          Crime Files
        </h1>
        <p className="mono red" style={{ letterSpacing: ".2em", marginBottom: "2rem" }}>
          "THE HEIST IS DONE. NOW FIND THE MASTERMIND."<span className="cursor">_</span>
        </p>
        <p className="dim" style={{ marginBottom: "2.5rem" }}>A financial investigation simulation by the Finance Club.</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={onEnter}>JOIN THE RESISTANCE</button>
          <button className="btn btn-ghost" onClick={onHow}>HOW IT WORKS</button>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks({ onBack, onEnter }: { onBack: () => void; onEnter: () => void }) {
  useEnterKey(onEnter);
  const steps: [string, string][] = [
    ["Meet the case", "A company's numbers don't add up. You'll get its financial statements, records and correspondence."],
    ["Investigate", "Dig through transactions, documents, vendors and messages. Flag anything suspicious. Most evidence is a dead end. Some of it isn't."],
    ["Build your theory", "Use the evidence board to connect people, money and documents into a story that holds up."],
    ["Submit, then reassess", "Your team leader locks in a first theory. New evidence will arrive in Round 2 that may change everything."],
    ["Present your case", "Name the person responsible and trace exactly where the money went."],
  ];
  return (
    <div className="center-screen" style={{ textAlign: "left" }}>
      <div className="narrow rise">
        <div className="stamp gold" style={{ marginBottom: ".75rem" }}>The Plan</div>
        <h2 className="display" style={{ fontSize: "2.4rem", marginBottom: "2rem" }}>How it works</h2>
        <div className="stack" style={{ marginBottom: "2.5rem" }}>
          {steps.map(([t, d], i) => (
            <div key={t} style={{ display: "flex", gap: "1rem", borderLeft: "1px solid var(--line)", paddingLeft: "1.25rem" }}>
              <div className="mono red small">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: ".25rem" }}>{t}</div>
                <div className="dim small">{d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <button className="btn btn-primary" onClick={onEnter}>JOIN THE RESISTANCE</button>
          <button className="btn btn-ghost" onClick={onBack}>BACK</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ LOGIN ------------------------------ */
export function Login({ onLogin, onBack }: { onLogin: (id: Id<"teams">, role: Role, pin: string) => void; onBack: () => void }) {
  const convex = useConvex();
  const [code, setCode] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      const team = await convex.query(api.teams.login, { code: code.trim() });
      if (!team) {
        setError("Invalid team code");
        return;
      }
      if (role === "leader") {
        const ok = await convex.query(api.teams.verifyLeader, { teamId: team._id, pin: pin.trim() });
        if (!ok) {
          setError("Wrong leader PIN");
          return;
        }
      }
      onLogin(team._id, role, role === "leader" ? pin.trim() : "");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center-screen">
      <div className="card pad-lg rise" style={{ width: "100%", maxWidth: 420, textAlign: "left" }}
        onKeyDown={(e) => { if (e.key === "Enter" && !busy && code.trim() && (role === "member" || pin.trim())) void submit(); }}>
        <div className="stamp gold" style={{ marginBottom: ".75rem" }}>Identify your cell</div>
        <h2 className="display" style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>Team login</h2>
        <div className="stack">
          <div>
            <div className="label">Team code</div>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. BERLIN" />
          </div>
          <div>
            <div className="label">I am the</div>
            <div className="row">
              <button className={`chip ${role === "member" ? "on" : ""}`} onClick={() => setRole("member")}>MEMBER</button>
              <button className={`chip ${role === "leader" ? "on" : ""}`} onClick={() => setRole("leader")}>TEAM LEADER</button>
            </div>
            <p className="dim xs" style={{ marginTop: ".5rem" }}>
              Only the team leader can submit reports. Members can view everything.
            </p>
          </div>
          {role === "leader" && (
            <div>
              <div className="label">Leader PIN</div>
              <input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="4–6 digits" />
            </div>
          )}
          {error && <p className="red small">{error}</p>}
          <div className="row">
            <button className="btn btn-primary" onClick={submit} disabled={busy || !code.trim() || (role === "leader" && !pin.trim())}>
              {busy ? "CHECKING…" : "CONTINUE"}
            </button>
            <button className="btn btn-ghost" onClick={onBack}>BACK</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ MISSION ------------------------------ */
export function Mission({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(30);
  useEnterKey(onDone);
  useEffect(() => {
    if (count <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onDone]);
  const objectives = [
    "Identify whether a financial crime occurred.",
    "Identify the type of crime.",
    "Identify the person responsible.",
    "Reconstruct how the crime happened.",
    "Trace the money.",
    "Estimate the financial loss.",
    "Present the strongest evidence.",
  ];
  return (
    <div className="center-screen">
      <div className="stamp red" style={{ marginBottom: "1rem" }}>The Job</div>
      <p className="display" style={{ fontSize: "1.8rem", maxWidth: 680, lineHeight: 1.35, marginBottom: "2.5rem" }}>
        "A company has reported strong growth and rising profits. Yet millions of rupees have vanished from its expected cash position. Somewhere inside, someone is running their own heist."
      </p>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "left", marginBottom: "2.5rem" }}>
        <div className="stamp gold" style={{ marginBottom: ".75rem" }}>Your objectives</div>
        <div className="stack-sm">
          {objectives.map((o, i) => (
            <div key={o} className="dim small" style={{ display: "flex", gap: ".75rem" }}>
              <span className="mono red">{i + 1}.</span>
              <span>{o}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mono dim small">
        THE JOB BEGINS IN <span className="gold" style={{ fontSize: "1.2rem" }}>{String(count).padStart(2, "0")}</span>
      </div>
      <button className="btn btn-ghost btn-sm" style={{ marginTop: "1.5rem" }} onClick={onDone}>SKIP</button>
    </div>
  );
}

/* ------------------------------ CASE COVER ------------------------------ */
export function CaseCover({ kase, canOpen, onOpen }: { kase: CaseData; canOpen: boolean; onOpen: () => void }) {
  useEnterKey(() => canOpen && onOpen());
  return (
    <div className="center-screen">
      <div className="narrow rise" style={{ textAlign: "left" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <Badge tone="red">{kase.caseNumber || "Case File"}</Badge>
          <Badge tone="gold">Active Investigation</Badge>
        </div>
        <h2 className="display" style={{ fontSize: "2.6rem", marginBottom: "2rem" }}>{kase.title}</h2>
        <div className="card pad-lg" style={{ marginBottom: "1.25rem" }}>
          <div className="grid2" style={{ marginBottom: "1.5rem" }}>
            <div>
              <div className="label">Company</div>
              <div style={{ fontWeight: 600 }}>{kase.company}</div>
            </div>
            <div>
              <div className="label">Industry</div>
              <div style={{ fontWeight: 600 }}>{kase.industry}</div>
            </div>
            <div>
              <div className="label">Investigation period</div>
              <div style={{ fontWeight: 600 }}>{kase.investigationPeriod}</div>
            </div>
            <div>
              <div className="label">Status</div>
              <div className="red" style={{ fontWeight: 600 }}>Active Investigation</div>
            </div>
          </div>
          <p className="dim small" style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>{kase.briefing.split("\n\n")[0]}</p>
        </div>
        <div className="grid2" style={{ marginBottom: "2rem" }}>
          <div className="card stat">
            <div className="label">Investigation time</div>
            <div className="v">{(kase.investigationTime || "40 Minutes").toUpperCase().replace("MINUTES", "MIN")}</div>
          </div>
          <div className="card stat">
            <div className="label">Team size</div>
            <div className="v">2–4</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={onOpen} disabled={!canOpen}>
          {canOpen ? "ENTER THE VAULT" : "WAITING FOR THE PROFESSOR TO GIVE THE SIGNAL…"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ ENDED ------------------------------ */
export function EndedScreen({ onLogout }: { onLogout: () => void }) {
  const board = useQuery(api.scores.publicLeaderboard);
  return (
    <div className="center-screen">
      <div className="narrow rise">
        <div className="stamp red" style={{ marginBottom: "1rem" }}>Case closed</div>
        <h2 className="display" style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>The heist is over</h2>
        <p className="dim" style={{ marginBottom: "2rem" }}>Thank you for taking part. Your plan has been sent to the Professor.</p>
        {board ? (
          <div className="card pad-lg" style={{ textAlign: "left", marginBottom: "2rem" }}>
            <div className="label">Leaderboard</div>
            <table className="tbl">
              <tbody>
                {board.map((r) => (
                  <tr key={r.rank}>
                    <td className="num gold">#{r.rank}</td>
                    <td>{r.name}</td>
                    <td className="num" style={{ textAlign: "right" }}>{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mono dim small" style={{ marginBottom: "2rem" }}>RESULTS WILL BE ANNOUNCED SOON</p>
        )}
        <button className="btn btn-ghost btn-sm" onClick={onLogout}>LOG OUT</button>
      </div>
    </div>
  );
}
