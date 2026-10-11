import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };
const STATUSES = ["Requested", "Confirmed", "Declined", "Completed"];

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const booking = db.booking(id);
  if (!booking) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ booking, event: db.event(booking.eventId) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { status } = await req.json();
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "bad status" }, { status: 400 });
  const booking = db.patchBooking(id, { status });
  if (!booking) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(booking);
}
