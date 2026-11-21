import Link from "next/link";

export default function NotFound() {
  return (
    <section className="s-sand" data-head="light">
      <div className="container notfound">
        <span className="label label--dot">404</span>
        <h1 className="t-display">This square foot is still empty.</h1>
        <p className="t-lead muted">The page you were looking for doesn&apos;t exist or has moved.</p>
        <div className="btn-row">
          <Link href="/" className="pill">
            Back home <span className="arr" aria-hidden>↗</span>
          </Link>
          <Link href="/projects" className="pill pill--ghost">
            View projects
          </Link>
        </div>
      </div>
    </section>
  );
}
