"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { FloorPlan } from "@/lib/projects";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

export default function FloorPlans({ plans }: { plans: FloorPlan[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const plan = plans[active];
  // Portrait sheets (one floor per sheet) sit beside their room list instead of filling the width.
  const tall = plan.image.height > plan.image.width;
  return (
    <div>
      {plans.length > 1 && (
        <div className="plans__tabs" role="tablist" aria-label="Floor plans">
          {plans.map((p, i) => (
            <button
              key={p.label}
              type="button"
              role="tab"
              id={`plan-tab-${i}`}
              aria-selected={i === active}
              aria-controls="plan-panel"
              className="chip"
              onClick={() => setActive(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className={`plans__stage ${tall ? "plans__stage--tall" : ""}`} role={plans.length > 1 ? "tabpanel" : undefined} id="plan-panel" aria-labelledby={plans.length > 1 ? `plan-tab-${active}` : undefined}>
        <button type="button" className="plans__img" onClick={() => setOpen(true)} aria-label={`Open ${plan.label} plan full screen`}>
          <Image key={plan.image.src} src={plan.image.src} alt={plan.image.alt} width={plan.image.width} height={plan.image.height} sizes={tall ? "(min-width: 900px) 640px, 100vw" : "(max-width: 1560px) 100vw, 1560px"} quality={80} />
        </button>
        <div className="plans__bar">
          {tall && (
            <div className="plans__head">
              <span className="label">
                {String(active + 1).padStart(2, "0")} / {String(plans.length).padStart(2, "0")}
              </span>
              <h3 className="t-h2">{plan.label}</h3>
            </div>
          )}
          <ul role="list" className="plans__facts">
            {(plan.facts ?? []).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button type="button" className="plans__zoom" onClick={() => setOpen(true)}>
            Expand plan
            <svg viewBox="0 0 16 16" width="14" aria-hidden>
              <path d="M9 1h6v6M15 1L9 7M7 15H1V9M1 15l6-6" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <Lightbox images={plans.map((p) => ({ ...p.image, caption: p.label }))} index={active} onClose={() => setOpen(false)} label="Floor plan viewer" zoomable />
      )}
    </div>
  );
}
