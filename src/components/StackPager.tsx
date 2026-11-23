"use client";

/**
 * 01 / 02 / 03 on the stacked project cards. The cards are sticky, so the target is computed
 * from their place in the flow (not from where they are currently stuck).
 */
export default function StackPager({ names, current }: { names: string[]; current: number }) {
  const go = (j: number, el: HTMLElement) => {
    const stack = el.closest(".stackc");
    const cards = stack ? [...stack.querySelectorAll<HTMLElement>(".stackc__card")] : [];
    if (!stack || !cards[j]) return;
    const step = cards[0].offsetHeight + parseFloat(getComputedStyle(cards[0]).marginBottom || "0");
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;
    const top = stack.getBoundingClientRect().top + window.scrollY + j * step - (headerH + j * 14) + 1;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: "smooth" });
  };
  return (
    <nav className="stackc__pager" aria-label="Projects">
      {names.map((name, j) => (
        <button key={name} type="button" aria-current={j === current} aria-label={`${String(j + 1).padStart(2, "0")} ${name}`} onClick={(e) => go(j, e.currentTarget)}>
          {String(j + 1).padStart(2, "0")}
        </button>
      ))}
    </nav>
  );
}
