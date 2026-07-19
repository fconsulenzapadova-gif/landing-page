import { useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import ListingGallery from '../components/ListingGallery';
import LoadingState from '../components/LoadingState';
import type { FeaturedListing } from '../content/site';
import { useListings } from '../lib/useListings';
import { usePageAnimations } from '../lib/usePageAnimations';

interface ListingFact {
  label: string;
  value: string;
}

const compactFacts = (listing: FeaturedListing): ListingFact[] =>
  [
    listing.surface ? { label: 'Superficie', value: `${listing.surface} m²` } : null,
    listing.rooms ? { label: 'Locali', value: listing.rooms } : null,
    listing.bedrooms ? { label: 'Camere', value: listing.bedrooms } : null,
    listing.bathrooms ? { label: 'Bagni', value: listing.bathrooms } : null,
    listing.floor ? { label: 'Piano', value: listing.floor } : null,
  ].filter((fact): fact is ListingFact => fact !== null);

const characteristicRows = (listing: FeaturedListing): ListingFact[] =>
  [
    listing.propertyType ? { label: 'Tipologia', value: listing.propertyType } : null,
    listing.floor ? { label: 'Piano', value: listing.floor } : null,
    listing.elevator ? { label: 'Ascensore', value: listing.elevator } : null,
    listing.condition ? { label: 'Stato immobile', value: listing.condition } : null,
    listing.energyClass ? { label: 'Classe energetica', value: listing.energyClass } : null,
    listing.availableFrom ? { label: 'Disponibilità', value: listing.availableFrom } : null,
  ].filter((row): row is ListingFact => row !== null);

function ListingDetails({ listing }: { listing: FeaturedListing }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const facts = compactFacts(listing);
  const characteristics = characteristicRows(listing);
  usePageAnimations(pageRef);

  return (
    <div ref={pageRef} className="bg-[var(--paper)]">
      <section className="section-line bg-[var(--paper-soft)] lg:px-6 lg:py-6">
        <ListingGallery
          key={listing.slug}
          images={listing.images}
          imageAlt={listing.imageAlt}
          onBack={() => navigate(-1)}
        />
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:py-16">
        <div className="min-w-0 space-y-12">
          <header data-animate className="space-y-5">
            <div className="space-y-2">
              <p className="font-display text-4xl leading-none tracking-tight text-[var(--ink)] sm:text-5xl">
                {listing.price}
              </p>
              <p className="text-base font-medium text-[var(--graphite)] sm:text-lg">{listing.location}</p>
            </div>

            <div className="space-y-2">
              <h1 className="font-display max-w-3xl text-[1.875rem] leading-[1.12] tracking-tight text-[var(--ink)] sm:text-4xl">
                {listing.title}
              </h1>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--graphite)]">
                {listing.status} · Rif. {listing.code}
              </p>
            </div>

            {facts.length ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-[var(--line)] py-5 sm:grid-cols-3 lg:grid-cols-5">
                {facts.map((fact) => (
                  <div key={fact.label} className="min-w-0">
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--graphite)]">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 truncate text-base font-semibold text-[var(--ink)]">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </header>

          <section data-animate className="border-t border-[var(--line)] pt-8 sm:pt-10">
            <h2 className="font-display text-3xl leading-tight text-[var(--ink)]">Descrizione</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-7 text-[var(--graphite)] sm:text-lg sm:leading-8">
              {listing.description || listing.summary}
            </p>
          </section>

          {characteristics.length || listing.details.length ? (
            <section data-animate className="border-t border-[var(--line)] pt-8 sm:pt-10">
              <h2 className="font-display text-3xl leading-tight text-[var(--ink)]">Caratteristiche</h2>

              {characteristics.length ? (
                <dl className="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  {characteristics.map((item) => (
                    <div key={item.label} className="grid grid-cols-[minmax(7rem,0.75fr)_1.25fr] gap-4 py-3.5 text-sm sm:text-base">
                      <dt className="font-medium text-[var(--graphite)]">{item.label}</dt>
                      <dd className="text-right font-semibold text-[var(--ink)]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {listing.details.length ? (
                <ul className="mt-5 grid gap-2 sm:grid-cols-2" aria-label="Altri dettagli">
                  {listing.details.map((detail) => (
                    <li key={detail} className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3 text-sm text-[var(--graphite)]">
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {listing.highlights.length ? (
            <section data-animate className="border-t border-[var(--line)] pt-8 sm:pt-10">
              <h2 className="font-display text-3xl leading-tight text-[var(--ink)]">Punti di forza</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {listing.highlights.map((item) => (
                  <li key={item} className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-4 text-sm font-semibold text-[var(--ink)]">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div data-animate className="sticky top-24 rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-6">
            <p className="font-display text-3xl leading-none text-[var(--ink)]">{listing.price}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--graphite)]">
              Rif. {listing.code}
            </p>
            <Link
              to={`/richieste?type=${listing.requestType}`}
              className="focus-ring mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--brand-blue)] px-5 py-3 text-center text-sm font-semibold text-[var(--ink)] transition hover:ring-2 hover:ring-[var(--ink)]"
            >
              Richiedi informazioni
            </Link>
          </div>
        </aside>
      </div>

      <div
        className="sticky bottom-0 z-40 border-t border-[var(--line)] bg-[var(--paper-soft)] px-4 pt-3 lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <Link
          to={`/richieste?type=${listing.requestType}`}
          className="focus-ring flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
        >
          Richiedi informazioni
        </Link>
      </div>
    </div>
  );
}

export default function ListingPage() {
  const { slug } = useParams();
  const { listings, isLoading } = useListings();
  const listing = listings.find((item) => item.slug === slug);

  if (!listing && isLoading) return <LoadingState />;
  if (!listing) return <Navigate to="/" replace />;

  return <ListingDetails listing={listing} />;
}
