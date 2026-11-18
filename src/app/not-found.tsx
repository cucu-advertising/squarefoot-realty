import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page legal">
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">404</p>
          <h1 className="h1" data-split>This page isn’t <em>here.</em></h1>
          <p className="page-hero__text">The page you were looking for may have moved.</p>
          <Link href="/" className="btn btn--solid"><span>Back to The Square</span><span className="btn__icon btn__icon--ne" aria-hidden="true"><span>↗</span></span></Link>
        </div>
      </section>
    </div>
  );
}
