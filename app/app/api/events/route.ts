import { NextResponse } from "next/server";
import { db, newId } from "@/lib/db";
import { buildTemplate, canonicalEvent } from "@/lib/data";
import type { FunctionSlot } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const ids = new URL(req.url).searchParams.get("ids");
  if (!ids) return NextResponse.json([]);
  return NextResponse.json(db.events(ids.split(",")));
}

export async function POST(req: Request) {
  const b = await req.json();
  const functions: FunctionSlot[] = Array.isArray(b.functions)
    ? b.functions.map((f: FunctionSlot) => ({ type: canonicalEvent(String(f.type ?? "")), date: String(f.date || ""), guests: Number(f.guests) || 0 }))
        .filter((f: FunctionSlot, i: number, all: FunctionSlot[]) => f.type && all.findIndex((x) => x.type.toLowerCase() === f.type.toLowerCase()) === i)
        .slice(0, 12)
    : [];
  if (!functions.length) return NextResponse.json({ error: "pick at least one event" }, { status: 400 });
  // Chronological order; undated functions go last (sort is stable, so they keep the pick order).
  functions.sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  const types = functions.map((f) => f.type);
  const dates = functions.map((f) => f.date).filter(Boolean).sort();
  const tpl = buildTemplate(types);
  const event = db.addEvent({
    id: newId(),
    types,
    functions,
    date: dates[0] || "",
    city: String(b.city || ""),
    guests: Math.max(...functions.map((f) => f.guests)),
    budget: Number(b.budget) || 0,
    ...tpl,
    payments: [],
    created: Date.now(),
  });
  return NextResponse.json(event);
}
