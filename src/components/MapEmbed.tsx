"use client";

import { useState } from "react";

/**
 * Click-to-load Google Map (no third-party requests or cookies until the visitor asks for it).
 * The query is an area/locality from the brochures; exact site pins should be supplied by the client.
 */
export default function MapEmbed({ query, label }: { query: string; label: string }) {
  const [on, setOn] = useState(false);
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return (
    <div>
      <div className="map">
        {on ? (
          <iframe src={src} title={`Map: ${label}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        ) : (
          <div className="map__placeholder">
            <div className="map__grid" aria-hidden />
            <span className="map__pin" aria-hidden />
            <p className="small">{label}</p>
            <button type="button" className="pill pill--ghost" onClick={() => setOn(true)}>
              Load map
            </button>
          </div>
        )}
      </div>
      <p className="map__note">
        <span>Area map; exact site pin to follow.</span>
        <a href={link} target="_blank" rel="noopener noreferrer" className="tlink">Open in Google Maps</a>
      </p>
    </div>
  );
}
