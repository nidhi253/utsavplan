"use client";
import { use } from "react";
import { usePoll } from "@/lib/usePoll";
import { EventView, type EventData } from "@/components/EventView";

export default function FamilyView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error } = usePoll<EventData>(`/api/events/${id}`, 2000);

  if (error && !data) return <p className="sub">This plan link isn't valid.</p>;
  if (!data) return <p className="sub">Loading…</p>;
  return (
    <>
      <div className="note">Family view: read-only, updates live. No login needed.</div>
      <EventView data={data} readOnly />
    </>
  );
}
