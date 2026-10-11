"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES, WORK, fnsOf, inr, VENDORS } from "@/lib/data";
import type { EventPlan } from "@/lib/types";
import { useApp } from "@/components/Providers";
import { IconHeart } from "@/components/Icons";
import { Tile } from "@/components/VendorCard";

const TABS = ["Work", "Services & prices", "Reviews"];
const HEIGHTS = [130, 170, 150, 120, 160, 140];

export default function VendorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const v = VENDORS.find((x) => x.id === Number(id));
  const router = useRouter();
  const { shortlist, toggleShortlist, myEvents, toast } = useApp();
  const [tab, setTab] = useState("Work");
  const [booking, setBooking] = useState(false);
  const [events, setEvents] = useState<EventPlan[]>([]);
  const [eventId, setEventId] = useState("");
  const [fn, setFn] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!booking || !myEvents.length) return;
    fetch(`/api/events?ids=${myEvents.join(",")}`)
      .then((r) => r.json())
      .then((l: EventPlan[]) => {
        setEvents(l);
        if (l[0]) pickEvent(l[0]);
      })
      .catch(() => {});
  }, [booking, myEvents]);

  function pickEvent(ev: EventPlan) {
    const first = fnsOf(ev)[0];
    setEventId(ev.id);
    setFn(first?.type ?? "");
    setDate(first?.date ?? "");
  }
  const chosen = events.find((x) => x.id === eventId);

  if (!v) return <p className="sub">Vendor not found. <Link href="/vendors">Back to vendors</Link></p>;

  async function send() {
    const r = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, vendorId: v!.id, fn, date, note }),
    });
    if (!r.ok) return toast("Could not send the request");
    toast(`Request sent to ${v!.name}`);
    router.push(`/events/${eventId}?tab=Vendors`);
  }

  if (booking)
    return (
      <>
        <button className="back" onClick={() => setBooking(false)}>← Back</button>
        <h1>Request {v.name}</h1>
        <p className="sub">Attach this booking to an event.</p>
        {events.length === 0 ? (
          <div className="card">
            <p className="sub" style={{ marginBottom: 12 }}>You don't have an event yet. Create one first and we'll attach this vendor.</p>
            <Link className="btn primary" href="/plan">Plan an event</Link>
          </div>
        ) : (
          <>
            <label className="f">Event</label>
            <select value={eventId} onChange={(e) => { const ev = events.find((x) => x.id === e.target.value); if (ev) pickEvent(ev); }}>
              {events.map((e) => <option key={e.id} value={e.id}>{e.types.join(" + ")} · {e.city}</option>)}
            </select>
            {chosen && fnsOf(chosen).length > 1 && (
              <>
                <label className="f">Which function is this for?</label>
                <select value={fn} onChange={(e) => { setFn(e.target.value); setDate(fnsOf(chosen).find((f) => f.type === e.target.value)?.date ?? ""); }}>
                  {fnsOf(chosen).map((f) => <option key={f.type} value={f.type}>{f.type}{f.date ? ` · ${f.date}` : ""}</option>)}
                </select>
              </>
            )}
            <label className="f">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <label className="f">Note to artist</label>
            <textarea rows={3} placeholder="Timing, location, anything else…" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn primary" onClick={send}>Send request</button>
          </>
        )}
      </>
    );

  return (
    <>
      <Link href="/vendors" className="back" style={{ display: "inline-block" }}>← Back</Link>
      <Tile v={v} i={0} label={v.cat} style={{ height: 190, fontSize: 14 }} />
      <h1 style={{ marginTop: 12 }}>{v.name}</h1>
      <p className="sub" style={{ marginBottom: 6 }}>{v.cat} · {v.city} · {v.rating.toFixed(1)} rating · from {inr(v.price)}</p>
      <p style={{ fontSize: 14, marginBottom: 12 }}>{v.about}</p>
      <div className="row">
        <button className="btn ghost" onClick={() => toggleShortlist(v.id)} style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
          <IconHeart filled={shortlist.includes(v.id)} /> {shortlist.includes(v.id) ? "Shortlisted" : "Shortlist"}
        </button>
        <button className="btn primary" onClick={() => setBooking(true)}>Request booking</button>
      </div>
      <div className="tabs">{TABS.map((t) => <div key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t}</div>)}</div>
      {tab === "Work" && (
        <div className="grid">
          {WORK[v.cat].map((e, i) => <Tile key={e} v={v} i={i} label={e} style={{ height: HEIGHTS[i] }} />)}
        </div>
      )}
      {tab === "Services & prices" && (
        <>
          <div className="card">
            {SERVICES[v.cat].map(([n, m]) => (
              <div key={n} className="item"><div className="grow">{n}</div><b>{inr(Math.round((v.price * m) / 50) * 50)}</b></div>
            ))}
          </div>
          <p className="small">{v.name} only offers {v.cat.toLowerCase()} services.</p>
        </>
      )}
      {tab === "Reviews" && (
        <>
          <div className="note">Verified-booking reviews arrive after a completed booking (coming soon).</div>
          <div className="card"><b>5.0</b> <span className="tag">Verified booking</span><p className="small" style={{ marginTop: 6 }}>"Arrived on time, family loved it." (sample)</p></div>
        </>
      )}
    </>
  );
}
