"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, contact, rera } from "@/content/site";
import { TheSquareLogo, SquarefootLogo } from "./Brand";
import { BrochureButton, EnquireButton } from "./EnquiryProvider";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overHero = pathname === "/";
  // Developer-level pages carry the Squarefoot Realty logo instead of The Square's
  const sfBrand = pathname.startsWith("/about") || pathname.startsWith("/urban-ranch");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only)
  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname);
      return;
    }
    const ids = ["project", "residences", "amenities", "location"];
    const els = ids.map((i) => document.getElementById(i)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`/#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Mobile menu: lock scroll, Esc to close, keep focus inside
  useEffect(() => {
    document.documentElement.classList.toggle("is-menu-open", open);
    if (!open) return;
    const panel = menuRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const f = Array.from(panel.querySelectorAll<HTMLElement>("a,button")).concat(toggleRef.current!);
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !overHero || open;

  return (
    <header className={`header ${solid ? "header--solid" : "header--clear"} ${hidden && !open ? "header--hidden" : ""} ${open ? "header--open" : ""}`}>
      <div className="header__inner wrap">
        {sfBrand ? (
          <Link href="/" className="header__brand header__brand--sf" aria-label="Squarefoot Realty — home">
            {open ? (
              <SquarefootLogo variant="mark" sizes="40px" className="header__mark header__mark--lg" />
            ) : (
              <SquarefootLogo variant="horizontal" sizes="180px" className="header__sf" />
            )}
          </Link>
        ) : (
          <Link href="/" className="header__brand" aria-label="The Square by Squarefoot Realty — home">
            <TheSquareLogo tone={solid && !open ? "color" : "light"} priority />
            <span className="header__by">
              <span className="header__by-label">by</span>
              <SquarefootLogo variant="mark" sizes="28px" className="header__mark" />
            </span>
          </Link>
        )}

        <nav className="header__nav" aria-label="Primary">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={active === n.href ? "is-active" : undefined} aria-current={active === n.href && !n.href.includes("#") ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <BrochureButton className="header__brochure">Brochure</BrochureButton>
          <EnquireButton className="btn btn--solid btn--sm header__cta" source="Home Page" />
          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={menuRef} className="menu" data-lenis-prevent hidden={!open}>
        <div className="menu__inner wrap">
          <nav aria-label="Mobile">
            <ol className="menu__list">
              <li style={{ ["--i" as string]: 0 }}>
                <Link href="/" onClick={() => setOpen(false)}>
                  <span className="menu__num">00</span>Home
                </Link>
              </li>
              {nav.map((n, i) => (
                <li key={n.href} style={{ ["--i" as string]: i + 1 }}>
                  <Link href={n.href} onClick={() => setOpen(false)}>
                    <span className="menu__num">{String(i + 1).padStart(2, "0")}</span>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="menu__foot">
            <div className="menu__ctas">
              <EnquireButton className="btn btn--light" source="Home Page" />
              <BrochureButton className="btn btn--outline-light" />
            </div>
            <p>
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
              <br />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <p className="menu__rera">TS RERA No. {rera.number}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
