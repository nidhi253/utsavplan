"use client";
import { VENDORS } from "@/lib/data";
import { useApp } from "@/components/Providers";
import { VendorCard } from "@/components/VendorCard";

export default function Shortlist() {
  const { shortlist } = useApp();
  const list = VENDORS.filter((v) => shortlist.includes(v.id));
  return (
    <>
      <h1>My shortlist</h1>
      <p className="sub">Vendors you saved.</p>
      {list.map((v) => <VendorCard key={v.id} v={v} />)}
      {!list.length && <p className="sub">Nothing saved yet. Tap the heart on any vendor.</p>}
    </>
  );
}
