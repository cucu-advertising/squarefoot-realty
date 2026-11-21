"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoHorizontal, Mark } from "./Logo";
import { EnquireButton } from "./Enquiry";
import { Roll } from "./ui";
import { site } from "@/lib/site";
import { pageProjects } from "@/lib/projects";

/**
 * Minimal bar (wordmark left, navigation right). Its colour follows whatever is directly
 * beneath it — the nearest [data-head] under the bar's centre ("dark", "light" or "red") — so it
 * stays legible over imagery, brand panels and light sections, including inside pinned sequences.
 */
export default function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(true);
  const [onRed, setOnRed] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMenu(false);
    setDropOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      const x = window.innerWidth / 2;
      const y = 30;
      const stack = document.elementsFromPoint(x, y);
      let theme: string | null = null;
      for (const el of stack) {
        if (headerRef.current?.contains(el)) continue;
        const host = el.closest<HTMLElement>("[data-head]");
        if (host) {
          theme = host.dataset.head ?? null;
          break;
        }
      }
      // "red" panels take ink text like light ones, and the logo's red square switches to paper.
      setDark(theme !== "light" && theme !== "red");
      setOnRed(theme === "red");
    };
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 80);
      if (y > 500 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y < 500) setHidden(false);
      lastY.current = y;
      if (!raf) raf = requestAnimationFrame(sample);
    };
    onScroll();
    const t = window.setTimeout(sample, 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const onDark = menu || dark;

  return (
    <>
      <header ref={headerRef} className={`header ${onDark ? "on-dark" : ""} ${solid && !menu ? "is-solid" : ""} ${hidden && !menu ? "is-hidden" : ""}`}>
        <div className="container header__inner">
          <Link href="/" className="header__logo" aria-label="Squarefoot Realty home">
            <LogoHorizontal onRed={onRed && !menu} />
          </Link>

          <nav className="nav" aria-label="Main">
            {site.nav.map((item) =>
              item.href === "/projects" ? (
                <div
                  key={item.href}
                  className={`nav__drop ${dropOpen ? "is-open" : ""}`}
                  onMouseLeave={() => setDropOpen(false)}
                  onKeyDown={(e) => e.key === "Escape" && setDropOpen(false)}
                >
                  <Link href={item.href} className="nav__link" aria-current={isActive(item.href) ? "page" : undefined}>
                    <Roll>{item.label}</Roll>
                  </Link>
                  <button type="button" className="nav__chev" aria-expanded={dropOpen} aria-controls="nav-projects" aria-label="Show projects" onClick={() => setDropOpen((v) => !v)}>
                    <svg viewBox="0 0 10 6" aria-hidden>
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </button>
                  <div className="nav__panel" id="nav-projects">
                    {pageProjects.map((p) => {
                      const img = p.cover ?? p.hero;
                      const red = !img && p.status !== "upcoming";
                      return (
                        <Link key={p.slug} href={`/projects/${p.slug}`} aria-current={pathname === `/projects/${p.slug}` ? "page" : undefined}>
                          <span className={`nav__thumb ${red ? "nav__thumb--red" : !img ? "nav__thumb--ink" : ""}`}>
                            {img ? <Image src={img.src} alt="" fill sizes="72px" /> : <Mark onRed={red} />}
                          </span>
                          <span>
                            <strong>{p.name}</strong>
                            <small>
                              {p.locationShort} · {p.status === "delivered" ? "Delivered" : p.statusLabel}
                            </small>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="nav__link" aria-current={isActive(item.href) ? "page" : undefined}>
                  <Roll>{item.label}</Roll>
                </Link>
              ),
            )}
            <EnquireButton className="pill header__cta" source="header" icon="">
              <Roll>Enquire now</Roll>
            </EnquireButton>
          </nav>

          <button type="button" className="menu-btn" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
            {menu ? "Close" : "Menu"} <i aria-hidden />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${menu ? "is-open" : ""}`} aria-hidden={!menu} inert={!menu}>
        <nav aria-label="Mobile">
          <ul role="list" className="mobile-menu__links">
            {site.nav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setMenu(false)}>
                  <small>0{i + 1}</small>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__projects">
            {pageProjects.map((p) => {
              const img = p.cover ?? p.hero;
              return (
                <Link key={p.slug} href={`/projects/${p.slug}`} onClick={() => setMenu(false)} className={!img && p.status !== "upcoming" ? "is-red" : ""}>
                  {img ? <Image src={img.src} alt="" fill sizes="45vw" /> : <Mark onRed={p.status !== "upcoming"} className="mobile-menu__mark" />}
                  <span>{p.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="mobile-menu__foot">
          <EnquireButton className="pill pill--light pill--block" source="mobile-menu">
            Enquire now
          </EnquireButton>
        </div>
      </div>
    </>
  );
}
