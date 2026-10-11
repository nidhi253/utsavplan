"use client";
import { Suspense, use, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePoll } from "@/lib/usePoll";
import { EventView, type EventData } from "@/components/EventView";
import { useApp } from "@/components/Providers";

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <Inner params={params} />
    </Suspense>
  );
}

function Inner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tab = useSearchParams().get("tab") || undefined;
  const { addMyEvent } = useApp();
  const { data, error, setData } = usePoll<EventData>(`/api/events/${id}`, 2000);

  useEffect(() => { addMyEvent(id); }, [id, addMyEvent]);

  if (error && !data) return <p className="sub">Event not found. <Link href="/plan">Plan a new one</Link></p>;
  if (!data) return <p className="sub">Loading…</p>;
  return (
    <>
      <h1>My event</h1>
      <EventView data={data} initialTab={tab} onChange={setData} />
    </>
  );
}
