import { useRef } from 'react';
import ButtonLink from '../components/ButtonLink';
import Icon from '../components/Icon';
import Section from '../components/Section';
import { company } from '../content/site';
import { usePageAnimations } from '../lib/usePageAnimations';

export default function BookingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  usePageAnimations(pageRef);

  return (
    <div ref={pageRef}>
      <Section className="section-line min-h-[70vh] bg-[var(--paper-soft)]">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div data-animate className="rounded-lg border border-[var(--line)] bg-white p-8">
            <Icon name="calendar" className="h-10 w-10 text-[var(--brand-blue-strong)]" />
            <p className="eyebrow mt-6">Prenotazione</p>
            <h1 className="font-display mt-3 text-5xl leading-tight text-[var(--ink)] sm:text-6xl">Prenota una consulenza</h1>
          </div>
          <div>
            <p data-animate className="max-w-2xl text-lg leading-8 text-[var(--graphite)]">
              Non c’e un calendario automatico: raccogliamo la richiesta e concordiamo direttamente il momento piu utile per il confronto.
            </p>
            <div data-animate className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/richieste" showArrow>
                Invia una richiesta
              </ButtonLink>
              <ButtonLink href={`tel:${company.phoneHref}`} variant="outline">
                Chiama {company.phone}
              </ButtonLink>
              <ButtonLink href={`mailto:${company.email}`} variant="outline">
                Email
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
