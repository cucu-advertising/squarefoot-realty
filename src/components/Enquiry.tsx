"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import EnquiryForm, { type EnquirySuccess } from "./EnquiryForm";
import { Mark } from "./Logo";
import Image from "next/image";
import { getProject, projects } from "@/lib/projects";

const brochureProjects = projects.filter((p) => p.brochure);

type Mode = "enquire" | "brochure";
interface OpenArgs {
  mode?: Mode;
  project?: string;
  source?: string;
}

const Ctx = createContext<{ open: (a?: OpenArgs) => void }>({ open: () => {} });
export const useEnquiry = () => useContext(Ctx);

type View =
  | { kind: "pick" }
  | { kind: "loading" }
  | { kind: "form"; formKind: "brochure" | "contact" | "interest" }
  | { kind: "download"; url: string }
  | { kind: "thanks" };

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [args, setArgs] = useState<OpenArgs>({});
  const [view, setView] = useState<View>({ kind: "form", formKind: "contact" });
  const [formKey, setFormKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(async (a: OpenArgs = {}) => {
    lastFocus.current = document.activeElement as HTMLElement;
    const mode = a.mode ?? "enquire";
    setArgs({ ...a, mode });
    setFormKey((k) => k + 1);
    setOpen(true);
    if (mode === "brochure" && !a.project) {
      setView({ kind: "pick" });
      return;
    }
    if (mode !== "brochure" || !a.project) {
      setView({ kind: "form", formKind: "contact" });
      return;
    }
    setView({ kind: "loading" });
    try {
      const r = await fetch(`/api/brochure-status?project=${encodeURIComponent(a.project)}`, { cache: "no-store" });
      const s = await r.json();
      if (!s.available) setView({ kind: "form", formKind: "interest" });
      else if (s.unlocked) setView({ kind: "download", url: s.downloadUrl });
      else setView({ kind: "form", formKind: "brochure" });
    } catch {
      setView({ kind: "form", formKind: "brochure" });
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Scroll lock + focus management + Escape + focus trap.
  useEffect(() => {
    if (!isOpen) return;
    window.__lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input:not([tabindex='-1']), a[href], button:not(.modal__close)")?.focus();
    }, 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const f = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([tabindex='-1']), select, textarea")].filter(
          (el) => el.offsetParent !== null,
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [isOpen, close]);

  const project = args.project ? getProject(args.project) : undefined;
  // "the Challa Elite brochure" but "The Square brochure".
  const theName = project ? (project.name.startsWith("The ") ? project.name : `the ${project.name}`) : "the project";
  const onSuccess = (r: EnquirySuccess) => {
    if (r.downloadUrl) setView({ kind: "download", url: r.downloadUrl });
    else setView({ kind: "thanks" });
  };

  let title = "Let's find your place.";
  let intro = "Share a few details and our team will get back to you shortly.";
  if (view.kind === "form" && view.formKind === "brochure") {
    title = `Download ${theName} brochure`;
    intro = "Complete specifications, plans and more. Tell us where to reach you and the download unlocks instantly.";
  } else if (view.kind === "form" && view.formKind === "interest") {
    title = project ? `${project.name}: brochure coming soon` : "Brochure coming soon";
    intro = "The brochure isn't published yet. Leave your details and we will send it to you first.";
  } else if (view.kind === "form" && project) {
    title = `Enquire about ${project.name}`;
  }

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <div className={`modal ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen} inert={!isOpen}>
        <div className="modal__scrim" onClick={close} />
        <div ref={panelRef} className="modal__panel" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
          <div className="modal__top">
            <Mark className="success__mark" />
            <button type="button" className="modal__close" onClick={close} aria-label="Close">
              <svg viewBox="0 0 18 18" aria-hidden>
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          {view.kind === "pick" && (
            <div>
              <h2 id="enquiry-title" className="modal__title">Which brochure?</h2>
              <p className="modal__intro">Choose a project. Share your details on the next step and the download unlocks instantly.</p>
              <div className="pick">
                {brochureProjects.map((p) => {
                  const img = p.cover ?? p.hero;
                  return (
                    <button key={p.slug} type="button" onClick={() => open({ mode: "brochure", project: p.slug, source: args.source })}>
                      <span className="pick__img">{img && <Image src={img.src} alt="" fill sizes="88px" />}</span>
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.locationShort}</small>
                      </span>
                      <span aria-hidden>→</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view.kind === "loading" && (
            <div className="success" aria-live="polite">
              <h2 id="enquiry-title" className="modal__title">One moment…</h2>
              <span className="spinner" aria-hidden />
            </div>
          )}

          {view.kind === "form" && (
            <>
              {project && (project.cover ?? project.hero) && (
                <div className="modal__media">
                  <Image src={(project.cover ?? project.hero)!.src} alt="" fill sizes="580px" />
                </div>
              )}
              <h2 id="enquiry-title" className="modal__title">
                {title}
              </h2>
              <p className="modal__intro">{intro}</p>
              <EnquiryForm
                key={formKey}
                kind={view.formKind}
                project={args.project ?? ""}
                lockProject={view.formKind !== "contact" && Boolean(args.project)}
                showMessage={view.formKind === "contact"}
                source={args.source ?? (view.formKind === "brochure" ? "brochure-modal" : "enquiry-modal")}
                submitLabel={view.formKind === "brochure" ? "Unlock brochure" : view.formKind === "interest" ? "Notify me" : "Send enquiry"}
                onSuccess={onSuccess}
              />
            </>
          )}

          {view.kind === "download" && (
            <div className="success" aria-live="polite">
              <h2 id="enquiry-title" className="modal__title">
                Thank you for your interest.
              </h2>
              <p className="muted">
                {project ? `${theName.charAt(0).toUpperCase()}${theName.slice(1)} brochure is ready.` : "Your brochure is ready."} Our team will also be in touch soon.
              </p>
              <a className="pill pill--red pill--down" href={view.url} download>
                Download brochure <span className="arr" aria-hidden>↓</span>
              </a>
            </div>
          )}

          {view.kind === "thanks" && (
            <div className="success" aria-live="polite">
              <h2 id="enquiry-title" className="modal__title">
                Thank you.
              </h2>
              <p className="muted">We have received your enquiry and will be in touch soon.</p>
              <button type="button" className="pill pill--ghost" onClick={close}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </Ctx.Provider>
  );
}

/** Button that opens the enquiry drawer. Use mode="brochure" for gated downloads. */
export function EnquireButton({
  children,
  className = "pill",
  mode = "enquire",
  project,
  source,
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  mode?: Mode;
  project?: string;
  source?: string;
  icon?: string;
}) {
  const { open } = useEnquiry();
  const glyph = icon ?? (mode === "brochure" ? "↓" : "↗");
  return (
    <button type="button" className={`${className} ${mode === "brochure" ? "pill--down" : ""}`} onClick={() => open({ mode, project, source })}>
      {children} {glyph && <span className="arr" aria-hidden>{glyph}</span>}
    </button>
  );
}
