import { useEffect, useState } from "react";
import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import "./fcf.css";

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

export default function Host() {
  return (
    <ConvexProvider client={convexClient}>
      <div className="fcf">
        <HostInner />
      </div>
    </ConvexProvider>
  );
}

const CASE_IDS = ["novatech", "silentbleed", "revenuemanip"];
const CASE_NAMES: Record<string, string> = {
  novatech: "Group A — The Nova-Tech File",
  silentbleed: "Group B — The Silent Bleed (NexusTech)",
  revenuemanip: "Group C — The Revenue Manipulation Scheme (Greenleaf)",
};
type Run = (label: string, fn: () => Promise<unknown>) => Promise<void>;

function errMsg(e: unknown): string {
  if (e instanceof ConvexError) return String(e.data);
  return "Something went wrong — check your connection.";
}

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const box: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", padding: 20, marginBottom: 20 };


/* ---------- CSV export ---------- */
function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}
function downloadCSV(filename: string, rows: (string | number | null | undefined)[][]) {
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function HostInner() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("hostPassword") ?? "");
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("hostPassword"));
  const check = useQuery(api.auth.checkHostPassword, password ? { password } : "skip");

  useEffect(() => {
    if (authed && check === false) {
      sessionStorage.removeItem("hostPassword");
      setAuthed(false);
    }
  }, [authed, check]);

  if (!authed) {
    return (
      <div className="center-screen">
        <div>
          <div className="stamp gold" style={{ marginBottom: 8 }}>Restricted</div>
          <h1 className="display" style={{ fontSize: "2rem", marginBottom: 16 }}>The Professor</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 8, fontSize: 16 }} />
          <button className="btn btn-ghost btn-sm"
            onClick={() => {
              if (check) {
                sessionStorage.setItem("hostPassword", password);
                setAuthed(true);
              }
            }}
            style={{ marginLeft: 8, padding: 8 }}
          >
            Enter
          </button>
          {password && check === false && <p style={{ color: "red" }}>Wrong password</p>}
        </div>
      </div>
    );
  }
  return <Dashboard password={password} />;
}

function Dashboard({ password }: { password: string }) {
  const [msg, setMsg] = useState("");
  const run: Run = async (label, fn) => {
    try {
      await fn();
      setMsg(`✓ ${label}`);
    } catch (e) {
      setMsg(`✗ ${errMsg(e)}`);
    }
  };
  return (
    <div style={{ padding: 24, maxWidth: 1300, margin: "0 auto" }}>
      <div className="stamp gold" style={{ marginBottom: 6 }}>Host / admin mode</div>
      <h1 className="display" style={{ fontSize: "2rem", marginBottom: 16 }}>The Professor's Control Room</h1>
      {msg && <p className="mono small" style={{ position: "sticky", top: 0, zIndex: 5, background: "var(--surface2)", border: "1px solid var(--gold-dim)", padding: 10, marginBottom: 12 }}>{msg}</p>}
      <EventControls password={password} run={run} />
      <EvidencePanel password={password} run={run} />
      <TeamsPanel password={password} run={run} />
      <HintSender password={password} run={run} />
      <ExportPanel password={password} />
      <SubmissionsPanel password={password} />
      <JudgingPanel password={password} run={run} />
    </div>
  );
}


function ExportPanel({ password }: { password: string }) {
  const teams = useQuery(api.teams.listTeams, { password });
  const r1 = useQuery(api.submissions.listSubmissions, { password, round: 1 });
  const r2 = useQuery(api.submissions.listSubmissions, { password, round: 2 });
  const scores = useQuery(api.scores.listScores, { password });
  const rubric = useQuery(api.scores.getRubric, {});
  const ready = teams && r1 && r2 && scores && rubric;
  const nameOf = (id: string) => teams?.find((t) => t._id === id)?.name ?? "Deleted team";
  const codeOf = (id: string) => teams?.find((t) => t._id === id)?.code ?? "";
  const caseOf = (id: string) => teams?.find((t) => t._id === id)?.caseId ?? "";
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");

  const exportResponses = () => {
    if (!ready) return;
    const rows: (string | number)[][] = [[
      "Team code", "Team", "Case", "Round", "Submitted at",
      "Crime occurred", "Crime type", "Responsible", "How it happened", "Amount", "Evidence", "Confidence",
      "Conclusion changed", "Money trail", "New evidence", "Now responsible",
    ]];
    for (const s of [...r1, ...r2]) {
      const d = s.data as Record<string, unknown>;
      const trail = d.moneyTrail as Record<string, string> | undefined;
      rows.push([
        codeOf(s.teamId), nameOf(s.teamId), caseOf(s.teamId), s.round, new Date(s.submittedAt).toLocaleString(),
        String(d.crimeOccurred ?? ""), String(d.crimeType ?? ""), String(d.responsible ?? ""),
        String(d.how ?? ""), String(d.amount ?? ""),
        Array.isArray(d.evidence) ? (d.evidence as string[]).filter(Boolean).join(" | ") : "",
        String(d.confidence ?? ""),
        String(d.conclusionChanged ?? ""),
        trail ? ["Person", "Action", "Document", "Payment", "Account", "Recipient"].map((k) => trail[k] || "?").join(" -> ") : "",
        String(d.newEvidence ?? ""), String(d.responsible ?? ""),
      ]);
    }
    downloadCSV(`responses-${stamp}.csv`, rows);
  };

  const exportScores = () => {
    if (!ready) return;
    const head = ["Team code", "Team", "Case", "Judge", ...rubric.map((r) => r.label), "Total", "Comment", "Updated"];
    const rows: (string | number)[][] = [head];
    for (const sc of scores) {
      rows.push([
        codeOf(sc.teamId), nameOf(sc.teamId), caseOf(sc.teamId), sc.judgeName,
        ...rubric.map((r) => sc.criteria.find((c) => c.key === r.key)?.score ?? ""),
        sc.total, sc.comment, new Date(sc.updatedAt).toLocaleString(),
      ]);
    }
    downloadCSV(`scores-${stamp}.csv`, rows);
  };

  const exportTeams = () => {
    if (!ready) return;
    const rows: (string | number)[][] = [["Team code", "Team", "Case", "Leader", "Members", "Leader PIN"]];
    for (const t of teams) rows.push([t.code, t.name, t.caseId, t.leaderName, t.members.join(" | "), t.leaderPin]);
    downloadCSV(`teams-${stamp}.csv`, rows);
  };

  return (
    <div style={box}>
      <h2 style={{ marginBottom: 8 }}>Export for judging</h2>
      <p className="dim small" style={{ marginBottom: 12 }}>
        Downloads open straight in Excel or Google Sheets. Safe to click at any time, including mid-event.
      </p>
      <div className="row">
        <button className="btn btn-gold btn-sm" disabled={!ready} onClick={exportResponses}>
          ⤓ ALL RESPONSES ({(r1?.length ?? 0) + (r2?.length ?? 0)})
        </button>
        <button className="btn btn-ghost btn-sm" disabled={!ready} onClick={exportScores}>⤓ JUDGE SCORES ({scores?.length ?? 0})</button>
        <button className="btn btn-ghost btn-sm" disabled={!ready} onClick={exportTeams}>⤓ TEAM LIST + PINS ({teams?.length ?? 0})</button>
      </div>
    </div>
  );
}

function HostCountdown({ endsAt, pausedMs }: { endsAt: number | null; pausedMs: number | null | undefined }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (pausedMs != null) return <span>{fmt(pausedMs)} (paused)</span>;
  if (!endsAt) return <span>--:--</span>;
  return <span>{fmt(endsAt - now)}</span>;
}

function EventControls({ password, run }: { password: string; run: Run }) {
  const event = useQuery(api.event.getEvent);
  const startRound1 = useMutation(api.event.startRound1);
  const goToBreak = useMutation(api.event.goToBreak);
  const startRound2 = useMutation(api.event.startRound2);
  const extendRound = useMutation(api.event.extendRound);
  const pauseRound = useMutation(api.event.pauseRound);
  const resumeRound = useMutation(api.event.resumeRound);
  const endEvent = useMutation(api.event.endEvent);
  const setRevealed = useMutation(api.event.setLeaderboardRevealed);
  const reset = useMutation(api.event.resetForDryRun);
  const [r1, setR1] = useState(40);
  const [r2, setR2] = useState(20);

  const paused = event?.pausedRemainingMs != null;

  return (
    <div style={box}>
      <h2>Event</h2>
      <p>
        Status: <b>{event?.status ?? "no event row"}</b> · Time left:{" "}
        <b><HostCountdown endsAt={event?.roundEndsAt ?? null} pausedMs={event?.pausedRemainingMs} /></b>
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input type="number" value={r1} onChange={(e) => setR1(Number(e.target.value))} style={{ width: 70 }} /> min
        <button className="btn btn-ghost btn-sm" onClick={() => confirm(`Start Phase One for ${r1} minutes?`) && run("Round 1 started", () => startRound1({ password, durationMs: r1 * 60000 }))}>
          Start Phase One
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => confirm("Close Round 1 and go to break?") && run("Break started", () => goToBreak({ password }))}>
          Close Phase One → Break
        </button>
        <input type="number" value={r2} onChange={(e) => setR2(Number(e.target.value))} style={{ width: 70 }} /> min
        <button className="btn btn-ghost btn-sm" onClick={() => confirm(`Start Phase Two for ${r2} minutes?`) && run("Round 2 started", () => startRound2({ password, durationMs: r2 * 60000 }))}>
          Start Phase Two
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {paused ? (
          <button className="btn btn-ghost btn-sm" onClick={() => run("Resumed", () => resumeRound({ password }))}>Resume</button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => run("Paused", () => pauseRound({ password }))}>Pause</button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => run("+2 min added", () => extendRound({ password, extraMs: 120000 }))}>+2 min</button>
        <button className="btn btn-ghost btn-sm" onClick={() => run("-2 min removed", () => extendRound({ password, extraMs: -120000 }))}>-2 min</button>
        <button className="btn btn-ghost btn-sm" onClick={() => confirm("End the event?") && run("Event ended", () => endEvent({ password }))}>End Event</button>
        <button className="btn btn-ghost btn-sm" onClick={() => run("Leaderboard visibility changed", () => setRevealed({ password, revealed: !event?.leaderboardRevealed }))}>
          {event?.leaderboardRevealed ? "Hide leaderboard" : "Reveal leaderboard"}
        </button>
        <button className="btn btn-primary btn-sm"
          onClick={() =>
            confirm("DRY RUN RESET: delete ALL submissions, hints, scores and evidence releases? Teams are kept.") &&
            run("Reset done", () => reset({ password }))
          }
        >
          Reset for dry run
        </button>
      </div>
    </div>
  );
}

function EvidencePanel({ password, run }: { password: string; run: Run }) {
  const states = useQuery(api.caseState.listCaseStates, { password });
  const release = useMutation(api.caseState.releaseEvidence);
  const retract = useMutation(api.caseState.retractEvidence);
  return (
    <div style={box}>
      <h2 style={{ marginBottom: 8 }}>Round 2 evidence drops (per case group)</h2>
      <p className="dim small" style={{ marginBottom: 8 }}>Released evidence pops up on every team screen in that group and stays there until the event ends.</p>
      {(states ?? []).map((s) => (
        <div key={s.caseId} style={{ marginBottom: 12 }}>
          <h3 className="gold" style={{ margin: "8px 0" }}>{CASE_NAMES[s.caseId] ?? s.caseId}</h3>
          {s.drops.map((d) => {
            const done = s.released.includes(d.id);
            return (
              <div key={d.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ flex: 1, opacity: done ? 0.5 : 1 }}>{done ? "✓ " : ""}{d.label}</span>
                {done ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => confirm(`Retract "${d.label}"?`) && run("Retracted", () => retract({ password, caseId: s.caseId, evidenceId: d.id }))}>
                    Undo
                  </button>
                ) : (
                  <button className="btn btn-ghost btn-sm" onClick={() => confirm(`Release "${d.label}" to every team in ${CASE_NAMES[s.caseId] ?? s.caseId}?`) && run("Released", () => release({ password, caseId: s.caseId, evidenceId: d.id }))}>
                    Release
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function TeamsPanel({ password, run }: { password: string; run: Run }) {
  const teams = useQuery(api.teams.listTeams, { password });
  const event = useQuery(api.event.getEvent);
  const round = event?.status === "round2" ? 2 : 1;
  const subs = useQuery(api.submissions.listSubmissions, { password, round });
  const createTeam = useMutation(api.teams.createTeam);
  const deleteTeam = useMutation(api.teams.deleteTeam);
  const [form, setForm] = useState({ code: "", name: "", leaderName: "", members: "", caseId: "novatech", leaderPin: "" });
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 15000);
    return () => clearInterval(t);
  }, []);

  const submitted = new Set((subs ?? []).map((s) => s.teamId));
  const counts = CASE_IDS.map((c) => `${c}: ${(teams ?? []).filter((t) => t.caseId === c).length}`).join(" · ");

  return (
    <div style={box}>
      <h2>Teams ({teams?.length ?? 0})</h2>
      <p style={{ opacity: 0.7 }}>{counts}</p>
      <table className="tbl">
        <thead>
          <tr>
            <th>Code</th><th>Team</th><th>Case</th><th>Members</th><th>Leader PIN</th><th>Online</th><th>R{round} submitted</th><th></th>
          </tr>
        </thead>
        <tbody>
          {(teams ?? []).map((t) => (
            <tr key={t._id}>
              <td>{t.code}</td>
              <td>{t.name}</td>
              <td>{t.caseId}</td>
              <td>{t.members.join(", ")} ({t.members.length})</td>
              <td>{t.leaderPin}</td>
              <td>{Date.now() - t.lastSeenAt < 75000 ? "🟢" : "⚪"}</td>
              <td>{submitted.has(t._id) ? "✅" : "—"}</td>
              <td>
                <button className="btn btn-ghost btn-sm" onClick={() => confirm(`Delete ${t.name} and all its submissions/scores?`) && run("Team deleted", () => deleteTeam({ password, teamId: t._id }))}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 16 }}>Add team</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input type="text" placeholder="Code (e.g. BERLIN)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <input type="text" placeholder="Team name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="Leader name" value={form.leaderName} onChange={(e) => setForm({ ...form, leaderName: e.target.value })} />
        <input type="text" placeholder="Other members, comma separated" value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} style={{ width: 260 }} />
        <select value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}>
          {CASE_IDS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input type="text" placeholder="Leader PIN (4–6 digits)" value={form.leaderPin} onChange={(e) => setForm({ ...form, leaderPin: e.target.value })} />
        <button className="btn btn-ghost btn-sm"
          onClick={() =>
            run(`Team ${form.code} created`, async () => {
              await createTeam({ password, ...form, members: form.members.split(",") });
              setForm({ code: "", name: "", leaderName: "", members: "", caseId: form.caseId, leaderPin: "" });
            })
          }
        >
          Create
        </button>
      </div>
    </div>
  );
}

function HintSender({ password, run }: { password: string; run: Run }) {
  const teams = useQuery(api.teams.listTeams, { password });
  const sendHint = useMutation(api.hints.sendHint);
  const [text, setText] = useState("");
  const [target, setTarget] = useState<Id<"teams"> | "">("");
  return (
    <div style={box}>
      <h2>Message one team (optional)</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <select value={target} onChange={(e) => setTarget(e.target.value as Id<"teams">)}>
          <option value="">Choose team…</option>
          {(teams ?? []).map((t) => (
            <option key={t._id} value={t._id}>{t.name} ({t.caseId})</option>
          ))}
        </select>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" style={{ flex: 1, padding: 6 }} />
        <button className="btn btn-ghost btn-sm"
          disabled={!target || !text.trim()}
          onClick={() =>
            run("Message sent", async () => {
              await sendHint({ password, teamId: target as Id<"teams">, text });
              setText("");
            })
          }
        >
          Send
        </button>
      </div>
    </div>
  );
}

function SubmissionsPanel({ password }: { password: string }) {
  const [round, setRound] = useState(1);
  const teams = useQuery(api.teams.listTeams, { password });
  const subs = useQuery(api.submissions.listSubmissions, { password, round });
  return (
    <div style={box}>
      <h2>
        Submissions{" "}
        <select value={round} onChange={(e) => setRound(Number(e.target.value))}>
          <option value={1}>Round 1</option>
          <option value={2}>Round 2</option>
        </select>{" "}
        ({subs?.length ?? 0})
      </h2>
      {(subs ?? []).map((s) => (
        <div key={s._id} style={{ border: "1px solid var(--line)", padding: 10, marginBottom: 8 }}>
          <b>{teams?.find((t) => t._id === s.teamId)?.name ?? "Deleted team"}</b>{" "}
          <span style={{ opacity: 0.6 }}>{new Date(s.submittedAt).toLocaleTimeString()}</span>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(s.data, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}

function JudgingPanel({ password, run }: { password: string; run: Run }) {
  const rubric = useQuery(api.scores.getRubric);
  const teams = useQuery(api.teams.listTeams, { password });
  const scores = useQuery(api.scores.listScores, { password });
  const board = useQuery(api.scores.leaderboard, { password });
  const upsert = useMutation(api.scores.upsertScore);
  const [judge, setJudge] = useState(() => localStorage.getItem("judgeName") ?? "");
  const [teamId, setTeamId] = useState<Id<"teams"> | "">("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");

  const team = teams?.find((t) => t._id === teamId);
  const teamSubs = useQuery(api.submissions.getTeamSubmissions, teamId ? { password, teamId } : "skip");
  const answerKey = useQuery(api.answerKeys.getAnswerKey, team ? { password, caseId: team.caseId } : "skip");

  // Load this judge's existing marks for the chosen team.
  useEffect(() => {
    const mine = scores?.find((s) => s.teamId === teamId && s.judgeName === judge.trim());
    setMarks(mine ? Object.fromEntries(mine.criteria.map((c) => [c.key, String(c.score)])) : {});
    setComment(mine?.comment ?? "");
  }, [teamId, judge, scores]);

  return (
    <div style={box}>
      <h2>Judging</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Your judge name"
          value={judge}
          onChange={(e) => {
            setJudge(e.target.value);
            localStorage.setItem("judgeName", e.target.value);
          }}
        />
        <select value={teamId} onChange={(e) => setTeamId(e.target.value as Id<"teams">)}>
          <option value="">Choose team to judge…</option>
          {(teams ?? []).map((t) => (
            <option key={t._id} value={t._id}>{t.name} ({t.caseId})</option>
          ))}
        </select>
      </div>

      {team && (
        <>
          <h3>{team.name} — reports</h3>
          {(teamSubs ?? []).length === 0 && <p style={{ opacity: 0.6 }}>No submissions yet.</p>}
          {(teamSubs ?? [])
            .slice()
            .sort((a, b) => a.round - b.round)
            .map((s) => (
              <div key={s._id} style={{ border: "1px solid var(--line)", padding: 8, marginBottom: 8 }}>
                <b>Round {s.round}</b>
                <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(s.data, null, 2)}</pre>
              </div>
            ))}

          <details style={{ marginBottom: 12 }}>
            <summary>Answer key for {team.caseId} (judges only)</summary>
            {answerKey?.culprit ? (
              <div>
                <p><b>Culprit:</b> {answerKey.culprit}</p>
                <p><b>Crime type:</b> {answerKey.crimeType}</p>
                <p><b>Money trail:</b> {answerKey.moneyTrail}</p>
                <p><b>Total loss:</b> {answerKey.totalLoss}</p>
                <ul>{answerKey.missedRedFlags.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            ) : (
              <p style={{ color: "orange" }}>No confirmed answer key for this case yet.</p>
            )}
          </details>

          <h3>Your marks</h3>
          {(rubric ?? []).map((r) => (
            <div key={r.key} style={{ marginBottom: 4 }}>
              {r.label} (0–{r.max}):{" "}
              <input
                type="number"
                min={0}
                max={r.max}
                value={marks[r.key] ?? ""}
                onChange={(e) => setMarks({ ...marks, [r.key]: e.target.value })}
                style={{ width: 70 }}
              />
            </div>
          ))}
          <textarea placeholder="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} rows={2} style={{ width: "100%", maxWidth: 500 }} />
          <br />
          <button className="btn btn-ghost btn-sm"
            onClick={() =>
              run("Score saved", () =>
                upsert({
                  password,
                  teamId: team._id,
                  judgeName: judge,
                  criteria: (rubric ?? []).map((r) => ({ key: r.key, score: Number(marks[r.key]) })),
                  comment,
                }),
              )
            }
          >
            Save score
          </button>
        </>
      )}

      <h3 style={{ marginTop: 16 }}>Leaderboard (average of judges)</h3>
      <ol>
        {(board ?? []).map((r) => (
          <li key={r.teamId}>
            {r.name} ({r.caseId}) — {r.average ?? "not scored"} {r.judges ? `· ${r.judges} judge(s)` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
