import { useRef, useState } from "react";
import type { PointerEvent as RPointerEvent } from "react";
import type { CaseData } from "./caseData/types";
import type { Flags, FlagKind } from "./tabs";
import { useLocalState } from "./ui";

type PinKind = "person" | "money" | "documents" | "communication" | "events" | "flag";
interface Pin {
  id: string;
  kind: PinKind;
  title: string;
  subtitle: string;
  note: string;
  x: number;
  y: number;
}
interface Link {
  a: string;
  b: string;
}
interface BoardState {
  pins: Pin[];
  links: Link[];
}

const SECTIONS: { kind: Exclude<PinKind, "person" | "flag">; label: string }[] = [
  { kind: "money", label: "Money" },
  { kind: "documents", label: "Documents" },
  { kind: "communication", label: "Communication" },
  { kind: "events", label: "Events" },
];
const KIND_LABEL: Record<PinKind, string> = {
  person: "People", money: "Money", documents: "Documents", communication: "Communication", events: "Events", flag: "Red flag",
};
const FLAG_TO_KIND: Record<FlagKind, PinKind> = {
  money: "money", documents: "documents", communication: "communication", events: "events", vendors: "flag",
};
const PIN_W = 210;
const PIN_CENTER_Y = 55;

// Who is this person? Suspects first, then vendor contacts.
function describePerson(kase: CaseData, name: string): string {
  const s = kase.suspects.find((x) => x.name === name);
  if (s) return s.position;
  const v = kase.vendors.find((x) => x.contact === name);
  if (v) return `Contact — ${v.name}`;
  return "";
}

export function EvidenceBoard({ kase, teamKey, flags }: { kase: CaseData; teamKey: string; flags: Flags }) {
  const [board, setBoard] = useLocalState<BoardState>(`fcf:board:${teamKey}`, { pins: [], links: [] });
  const [linking, setLinking] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const nextPos = () => {
    const n = board.pins.length;
    return { x: 30 + (n % 4) * 230, y: 30 + Math.floor(n / 4) * 190 };
  };
  const addPin = (kind: PinKind, title: string, subtitle = "") => {
    const id = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setBoard((b) => ({ ...b, pins: [...b.pins, { id, kind, title, subtitle, note: "", ...nextPos() }] }));
  };
  const updatePin = (id: string, patch: Partial<Pin>) =>
    setBoard((b) => ({ ...b, pins: b.pins.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  const removePin = (id: string) => {
    setBoard((b) => ({ pins: b.pins.filter((p) => p.id !== id), links: b.links.filter((l) => l.a !== id && l.b !== id) }));
    if (linking === id) setLinking(null);
  };
  const clickLink = (id: string) => {
    if (!linking) return setLinking(id);
    if (linking === id) return setLinking(null);
    const exists = board.links.some((l) => (l.a === linking && l.b === id) || (l.a === id && l.b === linking));
    setBoard((b) => ({
      ...b,
      links: exists
        ? b.links.filter((l) => !((l.a === linking && l.b === id) || (l.a === id && l.b === linking)))
        : [...b.links, { a: linking, b: id }],
    }));
    setLinking(null);
  };

  const onPointerDown = (e: RPointerEvent, pin: Pin) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = { id: pin.id, dx: e.clientX - rect.left - pin.x, dy: e.clientY - rect.top - pin.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: RPointerEvent) => {
    const d = drag.current;
    const rect = boardRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    const x = Math.max(0, Math.min(rect.width - PIN_W, e.clientX - rect.left - d.dx));
    const y = Math.max(0, Math.min(rect.height - 60, e.clientY - rect.top - d.dy));
    updatePin(d.id, { x, y });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const flagList = Object.values(flags);
  const byId = new Map(board.pins.map((p) => [p.id, p]));

  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: ".75rem" }}>
        <div className="label" style={{ margin: 0 }}>Evidence board — connect the case</div>
        <div className="row">
          {linking && <span className="gold xs mono">Click LINK on another card to connect (or the same card to cancel)</span>}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => confirm("Clear every card and link from your board?") && setBoard({ pins: [], links: [] })}
          >
            CLEAR BOARD
          </button>
        </div>
      </div>
      <div className="board-wrap">
        <div className="card catalog">
          <div className="label">Evidence catalog</div>
          <div className="gold small" style={{ fontWeight: 600, margin: ".4rem 0" }}>PEOPLE</div>
          {kase.evidenceBoardPeople.map((name) => {
            const role = describePerson(kase, name);
            return (
              <button key={name} className="cat-item" onClick={() => addPin("person", name, role)}>
                + {name}{role ? <span className="dim"> — {role}</span> : null}
              </button>
            );
          })}
          {SECTIONS.map((s) => (
            <div key={s.kind}>
              <div className="gold small" style={{ fontWeight: 600, margin: "1rem 0 .4rem" }}>{s.label.toUpperCase()}</div>
              <button className="cat-item" onClick={() => addPin(s.kind, `${s.label} note`)}>+ Add note</button>
            </div>
          ))}
          <div className="red small" style={{ fontWeight: 600, margin: "1.25rem 0 .4rem" }}>
            YOUR RED FLAGS ({flagList.length})
          </div>
          {flagList.length === 0 && <p className="dim xs">Flag items in the other tabs — they appear here.</p>}
          {flagList.map((f) => (
            <button key={f.id} className="cat-item" style={{ borderColor: "var(--red)" }} onClick={() => addPin(FLAG_TO_KIND[f.kind], f.label, "Red flag")}>
              + ⚑ {f.label}
            </button>
          ))}
        </div>

        <div className="board" ref={boardRef} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {board.links.map((l) => {
              const a = byId.get(l.a);
              const b = byId.get(l.b);
              if (!a || !b) return null;
              return (
                <line key={`${l.a}-${l.b}`} x1={a.x + PIN_W / 2} y1={a.y + PIN_CENTER_Y} x2={b.x + PIN_W / 2} y2={b.y + PIN_CENTER_Y}
                  stroke="#b6903f" strokeWidth={2} strokeDasharray="6 4" />
              );
            })}
          </svg>
          {board.pins.length === 0 && (
            <div className="dim" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", padding: "2rem" }}>
              Add people and notes from the catalog, then press LINK on two cards to connect them.
            </div>
          )}
          {board.pins.map((p) => (
            <div key={p.id} className={`pin k-${p.kind} ${linking === p.id ? "linking" : ""}`} style={{ left: p.x, top: p.y }}>
              <div className="pin-head" onPointerDown={(e) => onPointerDown(e, p)}>
                <span className="stamp dim">{KIND_LABEL[p.kind]}</span>
                <button className="flag-btn" style={{ padding: "0 .35rem" }} onPointerDown={(e) => e.stopPropagation()} onClick={() => removePin(p.id)}>✕</button>
              </div>
              {p.kind === "person" || p.subtitle === "Red flag" ? (
                <div className="small" style={{ fontWeight: 600, marginBottom: ".35rem" }}>
                  {p.title}
                  {p.subtitle && p.subtitle !== "Red flag" && <div className="dim xs" style={{ fontWeight: 400 }}>{p.subtitle}</div>}
                </div>
              ) : (
                <input type="text" value={p.title} onChange={(e) => updatePin(p.id, { title: e.target.value })} style={{ marginBottom: ".35rem", fontSize: ".8rem", padding: ".3rem" }} />
              )}
              <textarea placeholder="note…" value={p.note} onChange={(e) => updatePin(p.id, { note: e.target.value })} />
              <div className="pin-actions">
                <button className={`flag-btn ${linking === p.id ? "on" : ""}`} onClick={() => clickLink(p.id)}>LINK</button>
                <span className="dim xs mono" style={{ alignSelf: "center" }}>
                  {board.links.filter((l) => l.a === p.id || l.b === p.id).length} link(s)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
