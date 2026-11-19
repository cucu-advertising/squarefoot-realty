import Link from "next/link";

/** Label that rolls to a duplicate on hover (observed on the reference's navigation). */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll" aria-hidden={false}>
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}

/** Underlined text link with arrow — the hero CTA style. */
export function TLink({ href, children, className = "", ...rest }: { href: string; children: string; className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={`tlink ${className}`} {...rest}>
      <span className="tlink__t">{children}</span>
      <span className="tlink__a" aria-hidden>
        →
      </span>
    </Link>
  );
}
