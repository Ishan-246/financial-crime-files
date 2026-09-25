import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { useLocalState } from "./ui";

// Round 2 evidence: a notification panel that can be minimised and reopened any time.
export function EvidencePopup({ teamId, forceOpenSignal }: { teamId: Id<"teams">; forceOpenSignal: number }) {
  const drops = useQuery(api.caseState.getMyEvidence, { teamId });
  const [open, setOpen] = useLocalState<boolean>(`fcf:evopen:${teamId}`, true);
  const [seen, setSeen] = useLocalState<number>(`fcf:evseen:${teamId}`, 0);
  const [active, setActive] = useState<string | null>(null);
  const firstLoad = useRef(true);

  const count = drops?.length ?? 0;
  const unread = Math.max(0, count - seen);

  // New evidence released by the host → pop open on the newest item.
  useEffect(() => {
    if (!drops) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      if (count > seen) {
        setOpen(true);
        setActive(drops[drops.length - 1]?.id ?? null);
      }
      return;
    }
    if (count > seen) {
      setOpen(true);
      setActive(drops[drops.length - 1]?.id ?? null);
    }
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (forceOpenSignal > 0) setOpen(true);
  }, [forceOpenSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open && count > seen) setSeen(count);
  }, [open, count]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) {
    return (
      <button className={`ev-pill ${unread ? "pulse" : ""}`} onClick={() => setOpen(true)}>
        ▲ INTEL DROPS ({count}){unread ? ` · ${unread} NEW` : ""}
      </button>
    );
  }

  const shown = drops?.find((d) => d.id === active) ?? drops?.[drops.length - 1];

  return (
    <div className="ev-pop rise">
      <div className="ev-head">
        <span className="stamp red">● Intel drop — Phase Two</span>
        <span className="mono dim xs">({count})</span>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => setOpen(false)}>MINIMISE ▼</button>
      </div>
      {count > 1 && (
        <div className="row" style={{ padding: ".6rem 1rem 0", gap: ".4rem" }}>
          {drops!.map((d) => (
            <button key={d.id} className={`chip ${shown?.id === d.id ? "on" : ""}`} style={{ padding: ".3rem .55rem" }} onClick={() => setActive(d.id)}>
              {d.label.length > 28 ? d.label.slice(0, 26) + "…" : d.label}
            </button>
          ))}
        </div>
      )}
      <div className="ev-body">
        {!shown && (
          <p className="dim small">
            No evidence has been released yet. Keep this panel handy — new evidence will appear here during Round 2.
          </p>
        )}
        {shown && (
          <div>
            <div className="display" style={{ fontSize: "1.2rem", marginBottom: ".75rem" }}>{shown.label}</div>
            {shown.intro && <p style={{ marginBottom: ".6rem" }}>{shown.intro}</p>}
            {shown.format === "table" && shown.rows && (
              <table className="tbl">
                <thead>
                  <tr><th>Particular</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {shown.rows.map((r) => (
                    <tr key={r.field}>
                      <td className="dim">{r.field}</td>
                      <td className="mono">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {shown.paragraphs?.map((p, i) => (
              <p key={i} style={{ lineHeight: 1.75, marginBottom: ".75rem" }}>{p}</p>
            ))}
            {shown.bullets && (
              <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.7, margin: 0 }}>
                {shown.bullets.map((b) => <li key={b} style={{ marginBottom: ".4rem" }}>{b}</li>)}
              </ul>
            )}
            {shown.lists?.map((l) => (
              <div key={l.title} style={{ marginTop: ".75rem" }}>
                <div className="gold small" style={{ fontWeight: 600 }}>{l.title}</div>
                <ol style={{ paddingLeft: "1.3rem", lineHeight: 1.8, margin: ".3rem 0 0" }}>
                  {l.items.map((it) => <li key={it}>{it}</li>)}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
