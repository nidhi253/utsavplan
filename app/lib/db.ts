import fs from "fs";
import path from "path";
import type { Booking, EventPlan } from "./types";

type DB = { events: EventPlan[]; bookings: Booking[] };
const FILE = path.join(process.cwd(), "data", "db.json");

function read(): DB {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { events: [], bookings: [] };
  }
}
function write(db: DB) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export const newId = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);

export const db = {
  events: (ids?: string[]) => read().events.filter((e) => !ids || ids.includes(e.id)),
  event: (id: string) => read().events.find((e) => e.id === id),
  bookingsFor: (eventId: string) => read().bookings.filter((b) => b.eventId === eventId),
  booking: (id: string) => read().bookings.find((b) => b.id === id),
  addEvent(e: EventPlan) {
    const d = read();
    d.events.push(e);
    write(d);
    return e;
  },
  patchEvent(id: string, patch: Partial<EventPlan>) {
    const d = read();
    const i = d.events.findIndex((e) => e.id === id);
    if (i < 0) return undefined;
    d.events[i] = { ...d.events[i], ...patch, id };
    write(d);
    return d.events[i];
  },
  addBooking(b: Booking) {
    const d = read();
    d.bookings.push(b);
    write(d);
    return b;
  },
  patchBooking(id: string, patch: Partial<Booking>) {
    const d = read();
    const i = d.bookings.findIndex((b) => b.id === id);
    if (i < 0) return undefined;
    d.bookings[i] = { ...d.bookings[i], ...patch, id };
    write(d);
    return d.bookings[i];
  },
};
