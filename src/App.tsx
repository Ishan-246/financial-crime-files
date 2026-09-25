import { useCallback, useEffect, useRef, useState } from "react";
import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { getCaseData } from "./caseData";
import type { CaseData } from "./caseData/types";
import "./fcf.css";
import { CaseCover, EndedScreen, HowItWorks, Landing, Login, Mission } from "./screens";
import type { Role } from "./screens";
import { AuditTab, CaseTab, CommsTab, DocumentsTab, FinancialsTab, PeopleTab, TransactionsTab, VendorsTab } from "./tabs";
import type { Flag, Flags } from "./tabs";
import { EvidenceBoard } from "./EvidenceBoard";
import { CaseReport } from "./Reports";
import { EvidencePopup } from "./EvidencePopup";
import { fmtClock, useLocalState, useNow, useServerOffset } from "./ui";

function resolveConvexUrl(): string {
  if (typeof window !== "undefined") {
    const envUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
    const isRemote = envUrl && envUrl.startsWith("https://") && !envUrl.includes("127.0.0.1");
    if (isRemote && envUrl) return envUrl;
    return `${window.location.origin}/convex-url`;
  }
  return "http://127.0.0.1:3210";
}
const convexClient = new ConvexReactClient(resolveConvexUrl());

export default function App() {
  return (
    <ConvexProvider client={convexClient}>
      <div className="fcf">
        <AppInner />
      </div>
    </ConvexProvider>
  );
}

const KEY_TEAM = "teamId";
const KEY_ROLE = "teamRole";
const KEY_PIN = "leaderPin";

type PublicStage = "landing" | "how" | "login";
type TeamStage = "mission" | "cover" | "dash";

function AppInner() {
  const [teamId, setTeamId] = useState<Id<"teams"> | null>(() => localStorage.getItem(KEY_TEAM) as Id<"teams"> | null);
  const [role, setRole] = useState<Role>(() => (localStorage.getItem(KEY_ROLE) === "leader" ? "leader" : "member"));
  const [pin, setPin] = useState(() => localStorage.getItem(KEY_PIN) ?? "");
  const [publicStage, setPublicStage] = useState<PublicStage>("landing");

  const team = useQuery(api.teams.getById, teamId ? { teamId } : "skip");
  const heartbeat = useMutation(api.teams.heartbeat);

  const clearSession = useCallback(() => {
    localStorage.removeItem(KEY_TEAM);
    localStorage.removeItem(KEY_ROLE);
    localStorage.removeItem(KEY_PIN);
    setTeamId(null);
    setRole("member");
    setPin("");
    setPublicStage("landing");
  }, []);

  // Team deleted by the host, or a stale saved id → back to the start.
  useEffect(() => {
    if (teamId && team === null) clearSession();
  }, [teamId, team, clearSession]);

  useEffect(() => {
    if (!teamId) return;
    heartbeat({ teamId }).catch(() => {});
    const t = setInterval(() => heartbeat({ teamId }).catch(() => {}), 30000);
    return () => clearInterval(t);
  }, [teamId, heartbeat]);

  if (!teamId) {
    if (publicStage === "how") return <HowItWorks onBack={() => setPublicStage("landing")} onEnter={() => setPublicStage("login")} />;
    if (publicStage === "login")
      return (
        <Login
          onBack={() => setPublicStage("landing")}
          onLogin={(id, r, p) => {
            localStorage.setItem(KEY_TEAM, id);
            localStorage.setItem(KEY_ROLE, r);
            localStorage.setItem(KEY_PIN, p);
            setTeamId(id);
            setRole(r);
            setPin(p);
          }}
        />
      );
    return <Landing onEnter={() => setPublicStage("login")} onHow={() => setPublicStage("how")} />;
  }

  if (!team) return <div className="center-screen mono dim">RETRIEVING CASE FILE…</div>;
  const kase = getCaseData(team.caseId);
  if (!kase) return <div className="center-screen red">No case file found for "{team.caseId}". Ask the host to check your team.</div>;

  return <TeamFlow teamId={teamId} teamName={team.name} kase={kase} role={role} pin={pin} onLogout={clearSession} />;
}

function TeamFlow({ teamId, teamName, kase, role, pin, onLogout }: {
  teamId: Id<"teams">; teamName: string; kase: CaseData; role: Role; pin: string; onLogout: () => void;
}) {
  const event = useQuery(api.event.getEvent);
  const [stage, setStage] = useLocalState<TeamStage>(`fcf:stage:${teamId}`, "mission");
  const toCover = useCallback(() => setStage("cover"), [setStage]);

  if (event === undefined) return <div className="center-screen mono dim">CONNECTING…</div>;
  const status = event?.status ?? "lobby";

  if (status === "ended") return <EndedScreen onLogout={onLogout} />;
  if (stage === "mission") return <Mission onDone={toCover} />;
  if (stage === "cover" || status === "lobby") {
    return <CaseCover kase={kase} canOpen={status !== "lobby"} onOpen={() => setStage("dash")} />;
  }
  return <Dashboard teamId={teamId} teamName={teamName} kase={kase} role={role} pin={pin} onLogout={onLogout}
    status={status} roundEndsAt={event?.roundEndsAt ?? null} pausedMs={event?.pausedRemainingMs ?? null} />;
}

const KIND_NAMES: Record<string, string> = {
  money: "Transactions", documents: "Documents", vendors: "Vendors", communication: "Communications", events: "Audit log",
};

function RedFlagsMenu({ flags, toggleFlag, goToBoard }: { flags: Flags; toggleFlag: (f: Flag) => void; goToBoard: () => void }) {
  const [open, setOpen] = useState(false);
  const list = Object.values(flags);
  const groups = Object.keys(KIND_NAMES).map((k) => ({ k, items: list.filter((f) => f.kind === k) })).filter((g) => g.items.length);
  return (
    <div className="flags-wrap">
      <button className={`btn btn-ghost btn-sm ${list.length ? "" : ""}`} style={{ borderColor: "var(--red)", color: "var(--red-bright)" }} onClick={() => setOpen(!open)}>
        ⚑ RED FLAGS ({list.length}) {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="flags-drop rise">
          <div className="row" style={{ justifyContent: "space-between", padding: ".7rem .9rem", borderBottom: "1px solid var(--line)" }}>
            <span className="stamp red">Your red flags</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setOpen(false); goToBoard(); }}>OPEN EVIDENCE BOARD</button>
          </div>
          {list.length === 0 && <p className="dim small" style={{ padding: ".9rem" }}>Nothing flagged yet. Use ⚐ FLAG in any tab.</p>}
          {groups.map((g) => (
            <div key={g.k}>
              <div className="stamp gold" style={{ padding: ".6rem .9rem .2rem" }}>{KIND_NAMES[g.k]} ({g.items.length})</div>
              {g.items.map((f) => (
                <div key={f.id} className="item">
                  <span className="red">⚑</span>
                  <span style={{ flex: 1 }}>{f.label}</span>
                  <button className="flag-btn" title="Remove flag" onClick={() => toggleFlag(f)}>✕</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TABS = ["CASE", "PEOPLE", "FINANCIALS", "TRANSACTIONS", "DOCUMENTS", "VENDORS", "COMMUNICATIONS", "AUDIT LOG", "EVIDENCE BOARD", "CASE REPORT"] as const;
type Tab = (typeof TABS)[number];

function Dashboard({ teamId, teamName, kase, role, pin, onLogout, status, roundEndsAt, pausedMs }: {
  teamId: Id<"teams">; teamName: string; kase: CaseData; role: Role; pin: string; onLogout: () => void;
  status: string; roundEndsAt: number | null; pausedMs: number | null;
}) {
  const [tab, setTab] = useLocalState<Tab>(`fcf:tab:${teamId}`, "CASE");
  const [flags, setFlags] = useLocalState<Flags>(`fcf:flags:${teamId}`, {});
  const toggleFlag = (f: Flag) =>
    setFlags((prev) => {
      const next = { ...prev };
      if (next[f.id]) delete next[f.id];
      else next[f.id] = f;
      return next;
    });

  const offset = useServerOffset();
  const now = useNow();
  const remaining = pausedMs != null ? pausedMs : roundEndsAt != null ? roundEndsAt - (now + offset) : null;

  // "You missed something" flash — once, when the Round 1 report gets locked.
  const r1 = useQuery(api.submissions.getMySubmission, { teamId, round: 1 });
  const [r1Flashed, setR1Flashed] = useLocalState<boolean>(`fcf:r1flash:${teamId}`, false);
  const [showR1Flash, setShowR1Flash] = useState(false);
  useEffect(() => {
    if (r1 && !r1Flashed) {
      setShowR1Flash(true);
      setR1Flashed(true);
    }
  }, [r1, r1Flashed, setR1Flashed]);

  // "Incoming intel" countdown — once, when Round 2 starts.
  const [r2Intro, setR2Intro] = useLocalState<boolean>(`fcf:r2intro:${teamId}`, false);
  const [introLeft, setIntroLeft] = useState(0);
  const [popupSignal, setPopupSignal] = useState(0);
  const prevStatus = useRef(status);
  useEffect(() => {
    if (status === "round2" && !r2Intro) {
      setR2Intro(true);
      setIntroLeft(5);
    }
    if (status !== "round2" && prevStatus.current === "round2") setR2Intro(false);
    prevStatus.current = status;
  }, [status, r2Intro, setR2Intro]);
  useEffect(() => {
    if (introLeft <= 0) return;
    const t = setTimeout(() => {
      if (introLeft === 1) setPopupSignal((n) => n + 1);
      setIntroLeft((n) => n - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [introLeft]);

  const roundLabel = status === "round1" ? "PHASE ONE — THE JOB" : status === "round2" ? "PHASE TWO — THE RESISTANCE" : status === "break" ? "PHASE ONE CLOSED" : "";

  const body = (() => {
    switch (tab) {
      case "CASE": return <CaseTab kase={kase} />;
      case "PEOPLE": return <PeopleTab kase={kase} />;
      case "FINANCIALS": return <FinancialsTab kase={kase} />;
      case "TRANSACTIONS": return <TransactionsTab kase={kase} flags={flags} toggleFlag={toggleFlag} />;
      case "DOCUMENTS": return <DocumentsTab kase={kase} flags={flags} toggleFlag={toggleFlag} />;
      case "VENDORS": return <VendorsTab kase={kase} flags={flags} toggleFlag={toggleFlag} />;
      case "COMMUNICATIONS": return <CommsTab kase={kase} flags={flags} toggleFlag={toggleFlag} />;
      case "AUDIT LOG": return <AuditTab kase={kase} flags={flags} toggleFlag={toggleFlag} />;
      case "EVIDENCE BOARD": return <EvidenceBoard kase={kase} teamKey={teamId} flags={flags} />;
      case "CASE REPORT": return <CaseReport kase={kase} teamId={teamId} role={role} pin={pin} status={status} flags={flags} />;
    }
  })();

  return (
    <div className="dash">
      <aside className="sidebar">
        <div className="side-head">
          {kase.caseNumber && <div className="stamp red" style={{ marginBottom: ".4rem" }}>{kase.caseNumber}</div>}
          <div className="display" style={{ fontSize: "1.35rem", lineHeight: 1.2 }}>{kase.title}</div>
        </div>
        <nav style={{ overflowY: "auto" }}>
          {TABS.map((t) => (
            <button key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
        <div className="side-foot">
          <div className="small" style={{ fontWeight: 600 }}>{teamName}</div>
          <div className="stamp dim" style={{ margin: ".3rem 0 .6rem" }}>{role === "leader" ? "Team leader" : "Member"}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => confirm("Log out of this device?") && onLogout()}>LOG OUT</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <div className="stamp dim">Time on the clock</div>
            <div className={`clock ${remaining != null && remaining < 5 * 60000 ? "low" : ""}`}>
              {remaining != null ? fmtClock(remaining) : "--:--"}
              {pausedMs != null && <span className="stamp gold" style={{ marginLeft: ".6rem" }}>PAUSED</span>}
            </div>
          </div>
          <div>
            <div className="stamp dim">Phase</div>
            <div className="mono small" style={{ marginTop: ".35rem" }}>{roundLabel}</div>
          </div>
          <RedFlagsMenu flags={flags} toggleFlag={toggleFlag} goToBoard={() => setTab("EVIDENCE BOARD")} />
        </div>
        {status === "break" && (
          <div className="pad" style={{ background: "#1b0c0b", borderBottom: "1px solid var(--red)" }}>
            <span className="small">Round 1 is closed. Round 2 begins shortly — you can keep reviewing every tab.</span>
          </div>
        )}
        {status === "round1" && remaining != null && remaining <= 0 && pausedMs == null && (
          <div className="pad" style={{ background: "#1b0c0b", borderBottom: "1px solid var(--red)" }}>
            <span className="small">Time is up. Leaders: submit your Round 1 report now, before the host closes the round.</span>
          </div>
        )}
        <div className="content" key={tab}>
          <div className="rise">{body}</div>
        </div>
      </main>

      {status === "round2" && <EvidencePopup teamId={teamId} forceOpenSignal={popupSignal} />}

      {showR1Flash && (
        <div className="overlay flash-red" onClick={() => setShowR1Flash(false)}>
          <div className="stamp red" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>Plan filed</div>
          <div className="display" style={{ fontSize: "3rem", marginBottom: "1rem" }}>The Professor is watching. You may have missed something.</div>
          <p className="dim" style={{ marginBottom: "2rem" }}>Stand by, resistance. New intel drops in Phase Two.</p>
          <button className="btn btn-ghost" onClick={() => setShowR1Flash(false)}>CONTINUE</button>
        </div>
      )}

      {introLeft > 0 && (
        <div className="overlay flash-red">
          <div className="stamp red" style={{ fontSize: ".85rem", marginBottom: "1rem" }}>Phase Two</div>
          <div className="display" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Incoming intel</div>
          <div className="mono gold" style={{ fontSize: "3.5rem" }}>{introLeft}</div>
        </div>
      )}
    </div>
  );
}
