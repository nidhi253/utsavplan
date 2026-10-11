"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./Providers";
import { IconEvent, IconHeart, IconHome, IconPlan, IconSearch } from "./Icons";

const NAV = [
  { href: "/", label: "Home", icon: <IconHome />, match: (p: string) => p === "/" },
  { href: "/plan", label: "Plan", icon: <IconPlan />, match: (p: string) => p.startsWith("/plan") },
  { href: "/vendors", label: "Vendors", icon: <IconSearch />, match: (p: string) => p.startsWith("/vendors") || p.startsWith("/shortlist") },
  { href: "/events", label: "My events", icon: <IconEvent />, match: (p: string) => p.startsWith("/events") },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { shortlist } = useApp();
  // The artist confirm page and the family link are standalone views: no app chrome.
  const bare = path.startsWith("/artist") || path.startsWith("/family");
  return (
    <div id="app">
      <header>
        <Link href="/" className="logo">Utsav<span>Plan</span></Link>
        {!bare && (
          <Link href="/shortlist" className="heart-btn" aria-label="Shortlist">
            <IconHeart />
            <span className="badge">{shortlist.length}</span>
          </Link>
        )}
      </header>
      <main>{children}</main>
      {!bare && (
        <nav>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={n.match(path) ? "on" : ""}>
              {n.icon}
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
