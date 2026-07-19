import { useMemo, useRef, useState } from 'react';
import ListingCard from '../components/ListingCard';
import Section from '../components/Section';
import type { RequestType } from '../content/site';
import { useListings } from '../lib/useListings';
import { usePageAnimations } from '../lib/usePageAnimations';

type ListingFilter = 'tutti' | Extract<RequestType, 'vendita' | 'locazione'>;

const filters: Array<{ value: ListingFilter; label: string }> = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'vendita', label: 'In vendita' },
  { value: 'locazione', label: 'In locazione' },
];

export default function ListingsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<ListingFilter>('tutti');
  const { listings, isLoading } = useListings();
  usePageAnimations(pageRef, [listings.length]);

  const visibleListings = useMemo(
    () =>
      activeFilter === 'tutti'
        ? listings
        : listings.filter((listing) => listing.requestType === activeFilter),
    [activeFilter, listings],
  );

  return (
    <div ref={pageRef}>
      <Section className="bg-white">
        <div className="mb-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p data-animate className="eyebrow">
              Disponibilità
            </p>
            <h1 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Immobili disponibili
            </h1>
          </div>

          <div data-animate className="flex flex-wrap gap-2" aria-label="Filtra immobili">
            {filters.map((filter) => {
              const active = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`focus-ring min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                      : 'border-[var(--control-border)] bg-[var(--paper-soft)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--brand-blue)]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <p className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-6 text-[var(--graphite)]">
            Caricamento immobili…
          </p>
        ) : visibleListings.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleListings.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} animated />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-6 text-[var(--graphite)]">
            Nessun immobile disponibile per questo filtro.
          </p>
        )}
      </Section>
    </div>
  );
}
