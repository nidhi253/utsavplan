"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES, VENDORS } from "@/lib/data";
import type { EventPlan } from "@/lib/types";
import { useApp } from "@/components/Providers";
import { Tile } from "@/components/VendorCard";

export default function Home() {
  const { myEvents } = useApp();
  const [events, setEvents] = useState<EventPlan[]>([]);
  useEffect(() => {
    if (!myEvents.length) return;
    fetch(`/api/events?ids=${myEvents.join(",")}`).then((r) => r.json()).then(setEvents).catch(() => {});
  }, [myEvents]);

  return (
    <>
      <h1>Plan your function.<br />Pull it off.</h1>
      <p className="sub">Find independent artists, see their work, book, and coordinate with the whole family.</p>
      <div className="row">
        <Link className="btn primary" href="/plan">Plan an event</Link>
        <Link className="btn ghost" href="/vendors">Browse vendors</Link>
      </div>
      <h2>Featured artists</h2>
      <div className="scroll">
        {VENDORS.map((v) => <Tile key={v.id} v={v} i={1} label={v.name} href={`/vendors/${v.id}`} />)}
      </div>
      <h2>Popular categories</h2>
      <div className="chips">
        {CATEGORIES.map((c) => <Link key={c} className="chip" href={`/vendors?cat=${encodeURIComponent(c)}`}>{c}</Link>)}
      </div>
      {events.length > 0 && (
        <>
          <h2>Your events</h2>
          {events.map((e) => (
            <Link key={e.id} href={`/events/${e.id}`} className="card" style={{ display: "block" }}>
              <b>{e.types.join(" + ")} · {e.date}</b>
              <div className="small">{e.city} · {e.guests} guests</div>
            </Link>
          ))}
        </>
      )}
    </>
  );
}
