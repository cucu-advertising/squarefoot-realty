/** Small shared presentational pieces. */
export function Label({ children, sun, className = "" }: { children: React.ReactNode; sun?: boolean; className?: string }) {
  return (
    <span className={`label ${sun ? "label--sun" : ""} ${className}`} data-reveal="fade">
      {children}
    </span>
  );
}

export function Facts({ items, className }: { items: string[]; className: string }) {
  if (!items.length) return null;
  return (
    <ul role="list" className={className}>
      {items.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  );
}
