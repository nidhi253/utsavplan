"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { EventPlan } from "@/lib/types";
import { useApp } from "@/components/Providers";

export default function MyEvents() {
  const { myEvents } = useApp();
  const [events, setEvents] = useState<EventPlan[] | null>(null);

  useEffect(() => {
    if (!myEvents.length) { setEvents([]); return; }
    fetch(`/api/events?ids=${myEvents.join(",")}`).then((r) => r.json()).then(setEvents).catch(() => setEvents([]));
  }, [myEvents]);

  return (
    <>
      <h1>My events</h1>
      <p className="sub">Plans you created on this device.</p>
      {events?.map((e) => (
        <Link key={e.id} href={`/events/${e.id}`} className="card" style={{ display: "block" }}>
          <b>{e.types.join(" + ")}{e.date ? ` · ${e.date}` : ""}</b>
          <div className="small">{e.city} · {e.guests} guests</div>
        </Link>
      ))}
      {events && !events.length && <p className="sub">No events yet.</p>}
      <Link className="btn primary" href="/plan" style={{ marginTop: 8 }}>+ Plan an event</Link>
    </>
  );
}
