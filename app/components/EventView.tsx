"use client";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, fmtDate, fnsOf, inr, vendorById } from "@/lib/data";
import type { Booking, BuyItem, EventPlan, Payment, Task } from "@/lib/types";
import { useApp } from "./Providers";

export type EventData = { event: EventPlan; bookings: Booking[] };
const TABS = ["Overview", "Vendors", "Tasks", "Payments", "Shopping"];

const uid = () => Math.random().toString(36).slice(2, 8);

// Group items by the function they belong to, keeping first-seen order.
function groupByFn<T extends { fn?: string }>(items: T[]): [string, T[]][] {
  const m = new Map<string, T[]>();
  for (const it of items) {
    const k = it.fn || "General";
    m.set(k, [...(m.get(k) ?? []), it]);
  }
  return [...m];
}

export function EventView({
  data,
  readOnly,
  initialTab,
  onChange,
}: {
  data: EventData;
  readOnly?: boolean;
  initialTab?: string;
  onChange?: (d: EventData) => void;
}) {
  const { event: e, bookings } = data;
  const { toast } = useApp();
  const [tab, setTab] = useState(initialTab && TABS.includes(initialTab) ? initialTab : "Overview");
  const [newTask, setNewTask] = useState("");
  const [newBuy, setNewBuy] = useState("");
  const [payLabel, setPayLabel] = useState("");
  const [payAmt, setPayAmt] = useState("");

  async function patch(p: Partial<EventPlan>) {
    onChange?.({ event: { ...e, ...p }, bookings }); // optimistic
    const r = await fetch(`/api/events/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (!r.ok) toast("Could not save that change");
  }
  async function setStatus(id: string, status: string) {
    const r = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (r.ok) onChange?.({ event: e, bookings: bookings.map((b) => (b.id === id ? { ...b, status: status as Booking["status"] } : b)) });
  }
  async function share() {
    const url = `${location.origin}/family/${e.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Family link copied");
    } catch {
      toast(url);
    }
  }

  const confirmed = bookings.filter((b) => b.status === "Confirmed" || b.status === "Completed").length;
  const paid = e.payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const pending = e.payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0);
  const catOf = (b: Booking) => vendorById(b.vendorId).cat;
  const fns = fnsOf(e);
  const multi = fns.length > 1;

  return (
    <>
      <div className="banner">
        <b style={{ fontSize: 17 }}>{e.types.join(" + ")}</b>
        <div className="small">{e.city} · Budget {inr(e.budget)}</div>
        <div style={{ marginTop: 10 }}>
          {fns.map((f) => (
            <div key={f.type} className="item" style={{ padding: "6px 0" }}>
              <div className="grow">{f.type}</div>
              <span className="small">{fmtDate(f.date)} · {f.guests} guests</span>
            </div>
          ))}
        </div>
      </div>
      {!readOnly && <button className="btn gold" style={{ marginBottom: 6 }} onClick={share}>Share with family</button>}
      <div className="tabs">
        {TABS.map((t) => <div key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t}</div>)}
      </div>

      {tab === "Overview" && (
        <>
          <div className="row">
            <div className="card"><div className="small">Vendors confirmed</div><b>{confirmed} / {e.needs.length}</b></div>
            <div className="card"><div className="small">Tasks done</div><b>{e.tasks.filter((t) => t.d).length} / {e.tasks.length}</b></div>
          </div>
          <h2>Vendors needed</h2>
          <div className="card">
            {CATEGORIES.map((c) => {
              const on = e.needs.includes(c);
              const bk = bookings.find((b) => catOf(b) === c && b.status !== "Declined");
              if (readOnly && !on) return null;
              return (
                <div key={c} className="item">
                  <input type="checkbox" checked={on} disabled={readOnly} onChange={() => patch({ needs: on ? e.needs.filter((x) => x !== c) : [...e.needs, c] })} />
                  <div className="grow">{c}</div>
                  {bk ? <span className={`status st-${bk.status}`}>{bk.status}</span>
                    : !readOnly && on && <Link className="btn ghost small" href={`/vendors?cat=${encodeURIComponent(c)}`}>Find artists</Link>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "Vendors" && (
        <>
          {bookings.map((b) => {
            const v = vendorById(b.vendorId);
            return (
              <div key={b.id} className="card">
                <div className="item" style={{ borderBottom: "none", padding: 0 }}>
                  <div className="grow"><b>{v.name}</b><div className="small">{v.cat}{b.fn ? ` · for ${b.fn}` : ""}{b.date ? ` · ${fmtDate(b.date)}` : ""}</div></div>
                  <span className={`status st-${b.status}`}>{b.status}</span>
                </div>
                {!readOnly && b.status === "Requested" && (
                  <div className="note" style={{ margin: "10px 0 0" }}>
                    Demo: <Link href={`/artist/${b.id}`} target="_blank">open the artist's confirm page</Link> in another tab or phone.
                  </div>
                )}
                {!readOnly && b.status === "Confirmed" && (
                  <button className="btn ghost small" style={{ marginTop: 10 }} onClick={() => setStatus(b.id, "Completed")}>Mark completed</button>
                )}
              </div>
            );
          })}
          {!bookings.length && <p className="sub">No vendors booked yet.</p>}
          {!readOnly && <Link className="btn primary" href="/vendors">+ Find artists</Link>}
        </>
      )}

      {tab === "Tasks" && (
        <div className="card">
          {groupByFn(e.tasks).map(([fn, items]) => (
            <div key={fn}>
              {multi && <div className="fnhead">{fn}</div>}
              {items.map((t: Task) => (
                <div key={t.id} className="item">
                  <input type="checkbox" checked={t.d} disabled={readOnly} onChange={() => patch({ tasks: e.tasks.map((x) => (x.id === t.id ? { ...x, d: !x.d } : x)) })} />
                  <div className="grow"><span className={t.d ? "done" : ""}>{t.t}</span><div className="small">{t.w}</div></div>
                </div>
              ))}
            </div>
          ))}
          {!readOnly && (
            <div className="item">
              <input type="text" placeholder="+ Add your own task" value={newTask} onChange={(x) => setNewTask(x.target.value)} />
              <button className="btn small primary" onClick={() => { if (!newTask.trim()) return; patch({ tasks: [...e.tasks, { id: uid(), t: newTask.trim(), w: "custom", d: false }] }); setNewTask(""); }}>Add</button>
            </div>
          )}
        </div>
      )}

      {tab === "Payments" && (
        <>
          <div className="row">
            <div className="card"><div className="small">Paid</div><b>{inr(paid)}</b></div>
            <div className="card"><div className="small">Pending</div><b>{inr(pending)}</b></div>
          </div>
          <div className="card">
            {e.payments.map((p: Payment) => (
              <div key={p.id} className="item">
                <div className="grow">{p.label}<div className="small">{inr(p.amount)}</div></div>
                {readOnly ? <span className={`status ${p.paid ? "st-Confirmed" : "st-Requested"}`}>{p.paid ? "Paid" : "Pending"}</span>
                  : <button className="btn ghost small" onClick={() => patch({ payments: e.payments.map((x) => (x.id === p.id ? { ...x, paid: !x.paid } : x)) })}>{p.paid ? "Paid ✓" : "Mark paid"}</button>}
              </div>
            ))}
            {!e.payments.length && <p className="small" style={{ padding: "6px 0" }}>No payments tracked yet.</p>}
            {!readOnly && (
              <div className="item">
                <input type="text" placeholder="e.g. Priya · advance" value={payLabel} onChange={(x) => setPayLabel(x.target.value)} />
                <input className="qty" style={{ width: 90 }} type="number" placeholder="₹" value={payAmt} onChange={(x) => setPayAmt(x.target.value)} />
                <button className="btn small primary" onClick={() => { if (!payLabel.trim() || !Number(payAmt)) return; patch({ payments: [...e.payments, { id: uid(), label: payLabel.trim(), amount: Number(payAmt), paid: false }] }); setPayLabel(""); setPayAmt(""); }}>Add</button>
              </div>
            )}
          </div>
          <p className="small">Manual tracking only. No online payments in the MVP.</p>
        </>
      )}

      {tab === "Shopping" && (
        <div className="card">
          {groupByFn(e.buy).map(([fn, items]) => (
            <div key={fn}>
              {multi && <div className="fnhead">{fn}</div>}
              {items.map((b: BuyItem) => (
                <div key={b.id} className="item">
                  <input type="checkbox" checked={b.b} disabled={readOnly} onChange={() => patch({ buy: e.buy.map((x) => (x.id === b.id ? { ...x, b: !x.b } : x)) })} />
                  <div className="grow"><span className={b.b ? "done" : ""}>{b.t}</span></div>
                  {readOnly ? <span className="small">{b.q}</span>
                    : <input className="qty" type="text" value={b.q} onChange={(x) => patch({ buy: e.buy.map((y) => (y.id === b.id ? { ...y, q: x.target.value } : y)) })} />}
                </div>
              ))}
            </div>
          ))}
          {!readOnly && (
            <div className="item">
              <input type="text" placeholder="+ Add item to buy" value={newBuy} onChange={(x) => setNewBuy(x.target.value)} />
              <button className="btn small primary" onClick={() => { if (!newBuy.trim()) return; patch({ buy: [...e.buy, { id: uid(), t: newBuy.trim(), q: "1", b: false }] }); setNewBuy(""); }}>Add</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
