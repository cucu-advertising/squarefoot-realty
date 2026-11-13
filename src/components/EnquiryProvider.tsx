"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import EnquiryForm from "./EnquiryForm";
import type { EnquirySource } from "@/lib/validation";

type Intent = "enquiry" | "brochure";
interface OpenOptions {
  intent?: Intent;
  source?: EnquirySource;
  configuration?: string;
}

interface Ctx {
  openEnquiry: (o?: OpenOptions) => void;
  requestBrochure: (source?: EnquirySource) => void;
  brochureUnlocked: boolean;
  markUnlocked: () => void;
}

const EnquiryContext = createContext<Ctx | null>(null);
export const useEnquiry = () => {
  const c = useContext(EnquiryContext);
  if (!c) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return c;
};

const SESSION_KEY = "tsq_brochure_unlocked";

export function triggerBrochureDownload() {
  const a = document.createElement("a");
  a.href = "/api/brochure";
  a.rel = "nofollow";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [opts, setOpts] = useState<OpenOptions | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [brochureUnlocked, setUnlocked] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {}
  }, []);

  const markUnlocked = useCallback(() => {
    setUnlocked(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
  }, []);

  const openEnquiry = useCallback((o: OpenOptions = {}) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpts({ intent: "enquiry", source: "Home Page", ...o });
    setFormKey((k) => k + 1);
    requestAnimationFrame(() => {
      const d = dialogRef.current;
      if (d && !d.open) d.showModal();
      document.documentElement.classList.add("is-locked");
    });
  }, []);

  const requestBrochure = useCallback(
    async (source: EnquirySource = "Brochure Request") => {
      // Avoid asking for details twice in one session: if the signed cookie is
      // still valid, download straight away.
      if (brochureUnlocked) {
        try {
          const r = await fetch("/api/brochure", { method: "HEAD", credentials: "same-origin" });
          if (r.ok) return triggerBrochureDownload();
        } catch {}
      }
      openEnquiry({ intent: "brochure", source });
    },
    [brochureUnlocked, openEnquiry],
  );

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      document.documentElement.classList.remove("is-locked");
      setOpts(null);
      lastFocus.current?.focus?.();
    };
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close(); // click on backdrop
    };
    d.addEventListener("close", onClose);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onClick);
    };
  }, []);

  const isBrochure = opts?.intent === "brochure";

  return (
    <EnquiryContext.Provider value={{ openEnquiry, requestBrochure, brochureUnlocked, markUnlocked }}>
      {children}
      <dialog ref={dialogRef} className="modal" data-lenis-prevent aria-labelledby="modal-title">
        {opts && (
          <div className="modal__panel">
            <button type="button" className="modal__close" onClick={close} aria-label="Close">
              <span aria-hidden="true" />
            </button>
            <div className="modal__aside" aria-hidden="true">
              <div className="modal__aside-img" />
              <p className="modal__aside-text">
                The Square
                <span>Kongara Kalan Road, Adibatla</span>
              </p>
            </div>
            <div className="modal__body">
              <p className="eyebrow">{isBrochure ? "Project brochure" : "Enquire"}</p>
              <h2 id="modal-title" className="modal__title">
                {isBrochure ? (
                  <>
                    Receive the <em>brochure</em>
                  </>
                ) : (
                  <>
                    Let’s find <em>your place</em>
                  </>
                )}
              </h2>
              <p className="modal__lede">
                {isBrochure
                  ? "Please share your contact details to download the brochure. Our team may get in touch to help with your enquiry."
                  : "Share a few details and our team will get back to you shortly."}
              </p>
              <EnquiryForm
                key={formKey}
                compact
                source={opts.source ?? "Home Page"}
                defaultConfiguration={opts.configuration}
                intent={opts.intent ?? "enquiry"}
                idPrefix="modal"
              />
            </div>
          </div>
        )}
      </dialog>
    </EnquiryContext.Provider>
  );
}

/* ───────── Buttons used throughout the site ───────── */

export function EnquireButton({
  children = "Enquire Now",
  className = "btn btn--solid",
  source = "Home Page",
  configuration,
}: {
  children?: React.ReactNode;
  className?: string;
  source?: EnquirySource;
  configuration?: string;
}) {
  const { openEnquiry } = useEnquiry();
  return (
    <button type="button" className={className} onClick={() => openEnquiry({ source, configuration })}>
      <span>{children}</span>
      <span className="btn__icon btn__icon--ne" aria-hidden="true"><span>↗</span></span>
    </button>
  );
}

export function BrochureButton({
  children = "Download Brochure",
  className = "btn btn--ghost",
  source = "Brochure Request",
}: {
  children?: React.ReactNode;
  className?: string;
  source?: EnquirySource;
}) {
  const { requestBrochure } = useEnquiry();
  return (
    <button type="button" className={`${className} btn--brochure`} onClick={() => requestBrochure(source)}>
      <span>{children}</span>
      <span className="btn__icon btn__icon--down" aria-hidden="true">
        <span>↓</span>
      </span>
    </button>
  );
}
