import { Link } from 'react-router-dom';
import type { FeaturedListing } from '../content/site';

interface ListingCardProps {
  listing: FeaturedListing;
  animated?: boolean;
  loading?: 'eager' | 'lazy';
}

export default function ListingCard({ listing, animated = false, loading = 'lazy' }: ListingCardProps) {
  return (
    <Link
      to={`/immobili/${listing.slug}`}
      data-animate={animated ? '' : undefined}
      className="group block overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] transition hover:-translate-y-1 hover:border-[var(--brand-blue)] focus-ring"
    >
      <span className="media-frame block aspect-[4/3] border-0">
        <picture className="contents">
          <source media="(max-width: 767px)" srcSet={listing.mobileImage} />
          <img
            src={listing.image}
            alt={listing.imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading={loading}
            decoding="async"
          />
        </picture>
      </span>
      <span className="block p-5">
        <span className="flex items-center justify-between gap-3 text-xs font-bold uppercase">
          <span className="text-[var(--brand-blue-strong)]">{listing.status}</span>
          <span className="text-[var(--graphite)]">{listing.propertyType || listing.code}</span>
        </span>
        <span className="mt-4 block text-2xl font-semibold leading-tight text-[var(--ink)]">{listing.title}</span>
        <span className="mt-2 block text-sm text-[var(--graphite)]">{listing.location}</span>
        <span className="mt-5 flex items-end justify-between gap-4">
          <span className="font-display text-2xl leading-none text-[var(--ink)]">{listing.price}</span>
          <span className="text-sm font-semibold uppercase text-[var(--brand-blue-strong)]">Dettaglio</span>
        </span>
      </span>
    </Link>
  );
}
