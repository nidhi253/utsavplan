"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/data";
import { useApp } from "@/components/Providers";

type Slot = { date: string; guests: string };
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export default function PlanSetup() {
  const router = useRouter();
  const { addMyEvent, toast } = useApp();
  // Events are free text, in the order added. Each has its own date and guest count.
  const [names, setNames] = useState<string[]>([]);
  const [slots, setSlots] = useState<Record<string, Slot>>({});
  const [draft, setDraft] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [budget, setBudget] = useState("150000");
  const [busy, setBusy] = useState(false);

  function add() {
    // Commas let someone type several at once: "Mehendi, Sangeet, Wedding".
    const incoming = draft.split(",").map((x) => x.trim().replace(/\s+/g, " ").slice(0, 40)).filter(Boolean);
    if (!incoming.length) return;
    const nextNames = [...names];
    const nextSlots = { ...slots };
    for (const n of incoming) {
      if (nextNames.some((x) => same(x, n))) continue;
      const last = nextNames.length ? nextSlots[nextNames[nextNames.length - 1]] : undefined;
      nextNames.push(n);
      nextSlots[n] = { date: "", guests: last?.guests ?? "80" };
    }
    setNames(nextNames);
    setSlots(nextSlots);
    setDraft("");
  }
  const remove = (n: string) => setNames(names.filter((x) => x !== n));
  const setSlot = (n: string, patch: Partial<Slot>) => setSlots((s) => ({ ...s, [n]: { ...s[n], ...patch } }));

  async function create() {
    if (!names.length) return toast("Add at least one event");
    setBusy(true);
    try {
      const r = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          budget,
          functions: names.map((n) => ({ type: n, date: slots[n].date, guests: slots[n].guests })),
        }),
      });
      if (!r.ok) throw new Error();
      const e = await r.json();
      addMyEvent(e.id);
      router.push(`/events/${e.id}`);
    } catch {
      toast("Could not create the plan");
      setBusy(false);
    }
  }

  return (
    <>
      <h1>What are you planning?</h1>
      <p className="sub">Type any event: a haldi, a sangeet, a baby shower, a farewell. Add as many as you need.</p>

      <div className="row" style={{ alignItems: "flex-start" }}>
        <input
          type="text"
          value={draft}
          placeholder="Event name, e.g. Sangeet"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          style={{ flex: 1, margin: 0 }}
          autoFocus
        />
        <button type="button" className="btn ghost" style={{ flex: "none", width: "auto", padding: "12px 18px" }} onClick={add}>Add</button>
      </div>

      {names.length > 0 && (
        <>
          <h2>Your events</h2>
          {names.map((n) => (
            <div key={n} className="card">
              <div className="evhead"><b>{n}</b><span className="small" style={{ cursor: "pointer" }} onClick={() => remove(n)}>Remove</span></div>
              <div className="row">
                <div><label className="f">Date</label><input type="date" value={slots[n].date} onChange={(e) => setSlot(n, { date: e.target.value })} style={{ marginBottom: 0 }} /></div>
                <div><label className="f">Guests</label><input type="number" value={slots[n].guests} onChange={(e) => setSlot(n, { guests: e.target.value })} style={{ marginBottom: 0 }} /></div>
              </div>
            </div>
          ))}
        </>
      )}

      <h2>City and budget</h2>
      <div className="row">
        <div>
          <label className="f">City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <div><label className="f">Total budget (₹)</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
      </div>

      <button className="btn primary" disabled={busy || !names.length} onClick={create}>
        {busy ? "Building your list…" : names.length ? `See my list (${names.length} event${names.length > 1 ? "s" : ""}) →` : "Add an event to continue"}
      </button>
    </>
  );
}
