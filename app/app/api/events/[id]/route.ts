import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const event = db.event(id);
  if (!event) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ event, bookings: db.bookingsFor(id) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const b = await req.json();
  const allowed = ["needs", "tasks", "buy", "payments", "date", "city", "guests", "budget"];
  const patch = Object.fromEntries(Object.entries(b).filter(([k]) => allowed.includes(k)));
  const event = db.patchEvent(id, patch);
  if (!event) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(event);
}
