import { useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ButtonLink from '../components/ButtonLink';
import Icon from '../components/Icon';
import Section from '../components/Section';
import { getFeaturedListing } from '../content/site';
import { usePageAnimations } from '../lib/usePageAnimations';

export default function ListingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { slug } = useParams();
  const listing = getFeaturedListing(slug);
  usePageAnimations(pageRef);

  if (!listing) return <Navigate to="/" replace />;

  return (
    <div ref={pageRef}>
      <header className="section-line bg-[var(--paper-soft)] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p data-animate className="eyebrow">
              {listing.status} - scheda placeholder
            </p>
            <h1 data-animate className="font-display mt-4 max-w-4xl text-5xl leading-[0.95] text-[var(--ink)] sm:text-7xl">
              {listing.title}
            </h1>
            <p data-animate className="mt-6 max-w-2xl text-base leading-7 text-[var(--graphite)] sm:text-lg sm:leading-8">
              {listing.summary}
            </p>
            <div data-animate className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to={`/richieste?type=${listing.requestType}`} showArrow>
                Richiedi informazioni
              </ButtonLink>
              <ButtonLink to="/" variant="outline">
                Torna alla home
              </ButtonLink>
            </div>
          </div>
          <div data-animate="image" className="media-frame h-[22rem] rounded-lg sm:h-[32rem]">
            <img src={listing.image} alt="" className="h-full w-full object-cover" data-parallax />
          </div>
        </div>
      </header>

      <Section className="section-line">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p data-animate className="eyebrow">
              Dettagli
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Dati dimostrativi, pronti per essere sostituiti con annunci reali.
            </h2>
          </div>
          <div className="grid gap-4">
            <div data-animate className="grid gap-0 rounded-lg border border-[var(--line)] bg-[var(--paper-soft)]">
              <div className="grid grid-cols-[8rem_1fr] border-b border-[var(--line)] p-4">
                <span className="text-sm font-semibold uppercase text-[var(--graphite)]">Zona</span>
                <span className="text-[var(--ink)]">{listing.location}</span>
              </div>
              <div className="grid grid-cols-[8rem_1fr] border-b border-[var(--line)] p-4">
                <span className="text-sm font-semibold uppercase text-[var(--graphite)]">Prezzo</span>
                <span className="text-[var(--ink)]">{listing.price}</span>
              </div>
              <div className="grid grid-cols-[8rem_1fr] p-4">
                <span className="text-sm font-semibold uppercase text-[var(--graphite)]">Tipo</span>
                <span className="text-[var(--ink)]">{listing.status}</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {listing.details.map((detail) => (
                <div key={detail} data-animate className="flex gap-3 rounded-lg border border-[var(--line)] bg-white p-4">
                  <Icon name="check" className="h-5 w-5 shrink-0 text-[var(--brand-blue-strong)]" />
                  <span className="text-[var(--graphite)]">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="section-line bg-[var(--ink)] text-white">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p data-animate className="text-xs font-bold uppercase text-white/60">
              Note placeholder
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight sm:text-6xl">
              Questa scheda serve solo a verificare UX e routing.
            </h2>
          </div>
          <div className="grid gap-3">
            {listing.highlights.map((item) => (
              <div key={item} data-animate className="rounded-lg border border-white/15 bg-white/[0.04] p-5">
                <p className="text-sm leading-6 text-white/70">{item}</p>
              </div>
            ))}
            <Link data-animate to={`/richieste?type=${listing.requestType}`} className="focus-ring mt-3 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)]">
              Apri form dedicato
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
