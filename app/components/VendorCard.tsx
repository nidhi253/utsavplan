"use client";
import Link from "next/link";
import { useState } from "react";
import { type Vendor, WORK, imgUrl, inr } from "@/lib/data";
import { useApp } from "./Providers";
import { IconHeart } from "./Icons";

export function Tile({ v, i, label, style, href }: { v: Vendor; i: number; label: string; style?: React.CSSProperties; href?: string }) {
  const inner = (
    <div className="ph img" style={{ backgroundImage: `url('${imgUrl(v, i)}')`, ...style }}>
      <span className="lab">{label}</span>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function VendorCard({ v }: { v: Vendor }) {
  const { shortlist, toggleShortlist } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <div className="vcard">
        <Link href={`/vendors/${v.id}`} className="vlink">
          <Tile v={v} i={0} label={v.cat} />
          <div className="meta">
            <div className="vname">{v.name}</div>
            <div className="small">{v.cat} · {v.city}</div>
            <div className="price">from {inr(v.price)}{v.cat === "Caterer" ? " / plate" : ""}</div>
            <div className="rate"><b>{v.rating.toFixed(1)}</b> <span className="small">rating</span></div>
          </div>
        </Link>
        <button className="heart-btn" onClick={() => toggleShortlist(v.id)} aria-label="Shortlist">
          <IconHeart filled={shortlist.includes(v.id)} />
        </button>
      </div>
      <div className="vwork" onClick={() => setOpen(!open)}>
        {open ? "Hide work" : "View work"} <span>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="scroll" style={{ marginTop: 10 }}>
          {WORK[v.cat].slice(0, 4).map((e, i) => (
            <Tile key={e} v={v} i={i} label={e} href={`/vendors/${v.id}`} style={{ minWidth: 96, height: 110 }} />
          ))}
        </div>
      )}
    </div>
  );
}
