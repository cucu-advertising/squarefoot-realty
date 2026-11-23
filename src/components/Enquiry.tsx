import Link from "next/link";

/**
 * Every enquiry call-to-action on the site leads to the contact page, with the project
 * pre-selected in the form when one is known (/contact?project=<slug>).
 */
export function EnquireButton({
  children,
  className = "pill",
  project,
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  project?: string;
  /** Kept for call-site compatibility; every button now leads to the contact form. */
  source?: string;
  icon?: string;
}) {
  const href = project ? `/contact?project=${encodeURIComponent(project)}` : "/contact";
  const glyph = icon ?? "↗";
  return (
    <Link href={href} className={className}>
      {children} {glyph && <span className="arr" aria-hidden>{glyph}</span>}
    </Link>
  );
}
