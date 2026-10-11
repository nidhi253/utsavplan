"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, CITIES, EVENT_TYPES, PRICE_RANGES, VENDORS } from "@/lib/data";
import { VendorCard } from "@/components/VendorCard";

type FK = "cat" | "ev" | "city" | "price";
type F = { cat: string[]; ev: string[]; city: string[]; price: string[]; rating: number; av: boolean };
const EMPTY: F = { cat: [], ev: [], city: [], price: [], rating: 0, av: false };
const SORTS = ["Relevance", "Price: low to high", "Price: high to low", "Rating"];

export default function VendorsPage() {
  return (
    <Suspense fallback={null}>
      <Vendors />
    </Suspense>
  );
}

function Vendors() {
  const initialCat = useSearchParams().get("cat");
  const [f, setF] = useState<F>({ ...EMPTY, cat: initialCat ? [initialCat] : [] });
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("Relevance");
  const [drawer, setDrawer] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ sort: true, cat: true, price: true });

  const list = useMemo(() => {
    const l = VENDORS.filter(
      (v) =>
        v.name.toLowerCase().includes(q.toLowerCase()) &&
        (!f.cat.length || f.cat.includes(v.cat)) &&
        (!f.city.length || f.city.includes(v.city)) &&
        (!f.ev.length || f.ev.some((e) => v.ev.includes(e))) &&
        (!f.price.length || f.price.some((r) => v.price >= PRICE_RANGES[r][0] && v.price < PRICE_RANGES[r][1])) &&
        (!f.rating || v.rating >= f.rating) &&
        (!f.av || v.av)
    );
    if (sort === "Price: low to high") l.sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") l.sort((a, b) => b.price - a.price);
    if (sort === "Rating") l.sort((a, b) => b.rating - a.rating);
    return l;
  }, [f, q, sort]);

  const n = f.cat.length + f.ev.length + f.city.length + f.price.length + (f.rating ? 1 : 0) + (f.av ? 1 : 0);
  const tick = (k: FK, v: string) =>
    setF((cur) => ({ ...cur, [k]: cur[k].includes(v) ? cur[k].filter((x) => x !== v) : [...cur[k], v] }));

  const applied: [string, string][] = [
    ...f.cat.map((x): [string, string] => ["cat", x]),
    ...f.ev.map((x): [string, string] => ["ev", x]),
    ...f.city.map((x): [string, string] => ["city", x]),
    ...f.price.map((x): [string, string] => ["price", x]),
    ...(f.rating ? [["rating", `${f.rating}+ rating`] as [string, string]] : []),
    ...(f.av ? [["av", "Available on my date"] as [string, string]] : []),
  ];
  const remove = (k: string, v: string) => {
    if (k === "rating") setF({ ...f, rating: 0 });
    else if (k === "av") setF({ ...f, av: false });
    else tick(k as FK, v);
  };

  const cnt = (k: "cat" | "ev" | "city", val: string) =>
    VENDORS.filter((v) => (k === "cat" ? v.cat === val : k === "city" ? v.city === val : v.ev.includes(val))).length;

  const section = (id: string, title: string, children: React.ReactNode) => (
    <div className="fsec">
      <div className="fhead" onClick={() => setOpen({ ...open, [id]: !open[id] })}><span>{title}</span><span>{open[id] ? "−" : "+"}</span></div>
      {open[id] && <div className="fbody">{children}</div>}
    </div>
  );
  const check = (k: FK, v: string, count?: number) => (
    <label key={v} className="fopt">
      <input type="checkbox" checked={f[k].includes(v)} onChange={() => tick(k, v)} />
      <span>{v}</span>
      {count !== undefined && <span className="small">{count}</span>}
    </label>
  );

  return (
    <>
      <h1>Find vendors</h1>
      <div className="row" style={{ marginBottom: 12, alignItems: "flex-start" }}>
        <input type="text" placeholder="Search artists…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, margin: 0 }} />
        <button className="btn ghost" style={{ flex: "none", width: "auto", padding: "12px 16px" }} onClick={() => setDrawer(true)}>
          Filters{n ? ` (${n})` : ""}
        </button>
      </div>
      {applied.length > 0 && (
        <div className="chips" style={{ marginTop: 0 }}>
          {applied.map(([k, v]) => <div key={k + v} className="chip on" onClick={() => remove(k, v)}>{v} ×</div>)}
          <div className="chip" onClick={() => setF(EMPTY)}>Clear all</div>
        </div>
      )}
      <div className="small" style={{ marginBottom: 10 }}>{list.length} vendor{list.length === 1 ? "" : "s"}</div>
      {list.map((v) => <VendorCard key={v.id} v={v} />)}
      {!list.length && <p className="sub">No vendors match. Try removing a filter.</p>}

      {drawer && (
        <>
          <div className="scrim" onClick={() => setDrawer(false)} />
          <div className="sheet enter">
            <div className="shead"><b>Filters</b><span onClick={() => setDrawer(false)} style={{ cursor: "pointer", fontSize: 22 }}>×</span></div>
            <div className="sbody">
              {section("sort", "Sort by", SORTS.map((o) => (
                <label key={o} className="fopt"><input type="radio" name="so" checked={sort === o} onChange={() => setSort(o)} /><span>{o}</span></label>
              )))}
              {section("cat", "Category", CATEGORIES.map((c) => check("cat", c, cnt("cat", c))))}
              {section("ev", "Event type", EVENT_TYPES.map((c) => check("ev", c, cnt("ev", c))))}
              {section("city", "City", CITIES.map((c) => check("city", c, cnt("city", c))))}
              {section("price", "Price", Object.keys(PRICE_RANGES).map((c) => check("price", c)))}
              {section("rating", "Rating", [0, 4, 4.5].map((r) => (
                <label key={r} className="fopt"><input type="radio" name="rt" checked={f.rating === r} onChange={() => setF({ ...f, rating: r })} /><span>{r ? `${r} and above` : "Any"}</span></label>
              )))}
              {section("av", "Availability", (
                <label className="fopt"><input type="checkbox" checked={f.av} onChange={(e) => setF({ ...f, av: e.target.checked })} /><span>Available on my event date</span></label>
              ))}
            </div>
            <div className="sfoot">
              <button className="btn ghost" style={{ flex: 1 }} onClick={() => setF(EMPTY)}>Clear all</button>
              <button className="btn primary" style={{ flex: 2 }} onClick={() => setDrawer(false)}>Show {list.length} results</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
