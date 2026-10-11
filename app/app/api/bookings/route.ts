import { NextResponse } from "next/server";
import { db, newId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const b = await req.json();
  if (!db.event(String(b.eventId))) return NextResponse.json({ error: "event not found" }, { status: 404 });
  const dup = db.bookingsFor(String(b.eventId)).find((x) => x.vendorId === Number(b.vendorId) && x.status !== "Declined");
  if (dup) return NextResponse.json(dup);
  const booking = db.addBooking({
    id: newId(),
    eventId: String(b.eventId),
    vendorId: Number(b.vendorId),
    fn: b.fn ? String(b.fn) : undefined,
    status: "Requested",
    note: String(b.note || ""),
    date: String(b.date || ""),
    created: Date.now(),
  });
  return NextResponse.json(booking);
}
