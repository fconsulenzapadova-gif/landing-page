import { useRef } from 'react';
import ButtonLink from '../components/ButtonLink';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import { company, type SpecialistServiceContent } from '../content/site';
import { getWhatsAppUrl } from '../lib/whatsapp';
import { usePageAnimations } from '../lib/usePageAnimations';

interface SpecialistPageProps {
  service: SpecialistServiceContent;
}

export default function SpecialistPage({ service }: SpecialistPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  usePageAnimations(pageRef);

  return (
    <div ref={pageRef}>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        summary={service.summary}
        image={service.heroImage}
        icon={service.icon}
        primaryCta={{ label: service.cta, to: '/prenotazione' }}
        secondaryCta={{ label: 'WhatsApp', href: getWhatsAppUrl(company.phoneHref, `Ciao, vorrei informazioni su: ${service.title}.`) }}
      />

      <Section className="section-line">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p data-animate className="eyebrow">
              Output
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Cosa ottieni
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {service.benefits.map((benefit) => (
                <div key={benefit} data-animate className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                  <Icon name="check" className="h-6 w-6 rounded bg-[var(--brand-blue)] p-0.5 text-[var(--ink)]" />
                  <p className="mt-3 leading-7 text-[var(--graphite)]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <aside data-animate className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-6">
            <h2 className="font-display text-4xl leading-tight text-[var(--ink)]">Metodo</h2>
            <div className="mt-6 grid gap-0 border-t border-[var(--line)]">
              {service.steps.map((step, index) => (
                <div key={step} className="grid grid-cols-[3rem_1fr] border-b border-[var(--line)] py-4">
                  <span className="font-brand inline-flex h-8 w-10 items-center justify-center rounded bg-[var(--brand-blue)] text-lg text-[var(--ink)]">0{index + 1}</span>
                  <p className="text-[var(--graphite)]">{step}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Section>

      <Section className="section-line bg-[var(--brand-blue)] text-[var(--ink)]">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p data-animate className="text-xs font-bold uppercase text-[var(--ink)]/70">
              Consulenza
            </p>
            <h2 data-animate className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              Vuoi capire se questo servizio e adatto?
            </h2>
            <p data-animate className="mt-3 max-w-2xl text-[var(--ink)]/70">
              Raccontaci immobile, obiettivo e tempi. Ti indichiamo il percorso piu sensato.
            </p>
          </div>
          <div data-animate>
            <ButtonLink to="/prenotazione" variant="light" showArrow>
              {service.cta}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
