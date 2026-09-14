"use client";

import { BarChart3, Bell, BookOpen, BriefcaseBusiness, ChevronRight, Compass, Heart, Home, Library, Menu, PenLine, Search, Settings2, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Library", href: "/library", icon: Library },
  { label: "Journal", href: "/journal", icon: PenLine },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Stats", href: "/stats", icon: BarChart3 },
  { label: "Circles", href: "/circles", icon: BookOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = navItems.find((item) => item.href === pathname);
  const activeLabel = active?.label ?? "Bookloom";

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/"><span className="brand-mark">B</span><span>bookloom</span></Link>
        <div className="sidebar-label">Your reading life</div>
        <nav className="nav-list">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link className={`nav-item ${pathname === href ? "is-active" : ""}`} href={href} key={label}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === "Library" && <span className="nav-count">12</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link className="nav-item" href="/settings"><Settings2 size={18} strokeWidth={1.8} /><span>Settings</span></Link>
          <Link className="nav-item" href="/professional"><BriefcaseBusiness size={18} strokeWidth={1.8} /><span>Professional</span></Link>
          <div className="mini-profile"><div className="avatar">MA</div><div><strong>Marta Albrici</strong><span>@marta_reads</span></div><Heart size={16} /></div>
        </div>
      </aside>
      <section className="content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Home</span><ChevronRight size={15} /><strong>{activeLabel}</strong></div>
          <div className="top-actions"><label className="search-box"><Search size={17} /><input placeholder="Search books, authors..." /></label><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><Link className="avatar avatar-button" href="/profile">MA</Link></div>
        </header>
        {children}
      </section>
      <nav className="mobile-nav">{navItems.map(({ label, href, icon: Icon }) => <Link className={pathname === href ? "is-active" : ""} href={href} key={label}><Icon size={19} /><span>{label}</span></Link>)}</nav>
    </main>
  );
}
