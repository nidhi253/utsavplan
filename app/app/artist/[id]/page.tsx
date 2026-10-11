"use client";
import { use, useState } from "react";
import { usePoll } from "@/lib/usePoll";
import { fnsOf, vendorById } from "@/lib/data";
import type { Booking, EventPlan } from "@/lib/types";

type Data = { booking: Booking; event: EventPlan };

export default function ArtistConfirm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, refresh } = usePoll<Data>(`/api/bookings/${id}`, 4000);
  const [busy, setBusy] = useState(false);

  async function respond(status: "Confirmed" | "Declined") {
    setBusy(true);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
    setBusy(false);
  }

  if (error && !data) return <p className="sub">This booking link isn't valid.</p>;
  if (!data) return <p className="sub">Loading…</p>;
  const { booking: b, event: e } = data;
  const v = vendorById(b.vendorId);
  const decided = b.status !== "Requested";
  const slot = fnsOf(e).find((f) => f.type === b.fn);

  return (
    <>
      <div className="note">This is what the artist sees on their phone.</div>
      <div className="card">
        <div className="small">New booking request for {v.name}</div>
        <h1 style={{ marginTop: 6 }}>{b.fn || e.types.join(" + ")}{b.date ? ` · ${b.date}` : ""}</h1>
        <p className="sub">{e.city} · {slot?.guests ?? e.guests} guests{b.note ? <><br />Note: {b.note}</> : null}</p>
        {decided ? (
          <p><span className={`status st-${b.status}`}>{b.status}</span></p>
        ) : (
          <div className="row">
            <button className="btn primary" disabled={busy} onClick={() => respond("Confirmed")}>Confirm</button>
            <button className="btn ghost" disabled={busy} onClick={() => respond("Declined")}>Decline</button>
          </div>
        )}
      </div>
    </>
  );
}
