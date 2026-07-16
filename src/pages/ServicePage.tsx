import { useRef } from 'react';
import ButtonLink from '../components/ButtonLink';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import { company, type ServiceContent } from '../content/site';
import { getWhatsAppUrl } from '../lib/whatsapp';
import { usePageAnimations } from '../lib/usePageAnimations';

interface ServicePageProps {
  service: ServiceContent;
}

export default function ServicePage({ service }: ServicePageProps) {
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
        primaryCta={{ label: 'Richiedi consulenza', to: service.requestPath }}
        secondaryCta={{ label: 'WhatsApp', href: getWhatsAppUrl(company.phoneHref, service.whatsappMessage) }}
      />

      <Section className="section-line">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p data-animate className="eyebrow">
              Approccio
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              {service.promise}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {service.highlights.map((item) => (
              <div key={item.title} data-animate className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                <Icon name={item.icon} className="h-7 w-7 rounded bg-[var(--brand-blue)] p-1 text-[var(--ink)]" />
                <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--graphite)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="section-line bg-[var(--paper-soft)]">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p data-animate className="eyebrow">
              Processo
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Metodo di lavoro
            </h2>
            <div className="mt-7 grid gap-0 border-t border-[var(--line)]">
              {service.steps.map((step, index) => (
                <div key={step} data-animate className="grid grid-cols-[3.5rem_1fr] border-b border-[var(--line)] py-4">
                  <span className="font-brand inline-flex h-8 w-10 items-center justify-center rounded bg-[var(--brand-blue)] text-lg text-[var(--ink)]">0{index + 1}</span>
                  <p className="text-[var(--graphite)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p data-animate className="eyebrow">
              Benefici
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Perche e utile
            </h2>
            <div className="mt-7 grid gap-3">
              {service.benefits.map((benefit) => (
                <div key={benefit} data-animate className="flex gap-3 rounded-lg border border-[var(--line)] bg-white p-4">
                  <Icon name="check" className="h-5 w-5 shrink-0 rounded bg-[var(--brand-blue)] p-0.5 text-[var(--ink)]" />
                  <p className="text-[var(--graphite)]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="section-line bg-[var(--ink)] text-white">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p data-animate className="text-xs font-bold uppercase text-white/60">
              Contatto
            </p>
            <h2 data-animate className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              Parliamo del tuo caso.
            </h2>
            <p data-animate className="mt-3 max-w-2xl text-white/65">
              Compila il form o scrivici su WhatsApp con le informazioni principali.
            </p>
          </div>
          <div data-animate className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink to={service.requestPath} variant="light" showArrow>
              Invia richiesta
            </ButtonLink>
            <ButtonLink href={getWhatsAppUrl(company.phoneHref, service.whatsappMessage)} variant="outline" className="border-white/30 text-white hover:border-white hover:text-white">
              WhatsApp
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
