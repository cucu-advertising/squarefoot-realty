"use client";

import { scrollToTrackItem } from "./HArrows";

/** 01 / 02 / 03 on each card of a horizontal row; each number brings that card into place. */
export default function RailPager({ names, current }: { names: string[]; current: number }) {
  return (
    <nav className="rail-pager" aria-label="Projects">
      {names.map((name, j) => (
        <button key={name} type="button" aria-current={j === current} aria-label={`${String(j + 1).padStart(2, "0")} ${name}`} onClick={(e) => scrollToTrackItem(e.currentTarget, j)}>
          {String(j + 1).padStart(2, "0")}
        </button>
      ))}
    </nav>
  );
}
