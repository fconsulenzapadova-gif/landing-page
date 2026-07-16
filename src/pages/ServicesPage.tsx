import { useRef } from 'react';
import ButtonLink from '../components/ButtonLink';
import Icon from '../components/Icon';
import Section from '../components/Section';
import { primaryServices, specialistServices, type IconName } from '../content/site';
import { usePageAnimations } from '../lib/usePageAnimations';

interface ServiceSectionProps {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  icon: IconName;
  detailPath: string;
  detailLabel: string;
  reverse?: boolean;
}

function ServiceSection({
  eyebrow,
  title,
  summary,
  image,
  icon,
  detailPath,
  detailLabel,
  reverse = false,
}: ServiceSectionProps) {
  return (
    <Section className="section-line bg-white">
      <div className={`grid gap-10 lg:grid-cols-2 lg:items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div data-animate="image" className="media-frame h-[22rem] rounded-lg sm:h-[30rem]">
          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" data-parallax />
        </div>
        <div>
          <div data-animate className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-blue)] text-[var(--ink)]">
            <Icon name={icon} className="h-5 w-5" />
          </div>
          <p data-animate className="eyebrow mt-6">
            {eyebrow}
          </p>
          <h2 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-6xl">
            {title}
          </h2>
          <p data-animate className="mt-5 max-w-2xl text-base leading-7 text-[var(--graphite)]">
            {summary}
          </p>

          <div data-animate className="mt-8">
            <ButtonLink to={detailPath} showArrow>
              {detailLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function ServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const sale = primaryServices.vendita;
  const rental = primaryServices.locazione;
  const valuation = specialistServices.valutazionePatrimonio;
  usePageAnimations(pageRef);

  return (
    <div ref={pageRef}>
      <h1 className="sr-only">Servizi</h1>

      <ServiceSection
        eyebrow="Vendita"
        title="Come vendiamo gli immobili"
        summary={sale.summary}
        image={sale.heroImage}
        icon={sale.icon}
        detailPath={sale.route}
        detailLabel="Scopri il servizio vendita"
      />

      <ServiceSection
        eyebrow="Locazione"
        title="Come diamo in locazione gli immobili"
        summary={rental.summary}
        image={rental.heroImage}
        icon={rental.icon}
        detailPath={rental.route}
        detailLabel="Scopri il servizio locazione"
        reverse
      />

      <ServiceSection
        eyebrow="Patrimonio"
        title="Valutazione del patrimonio immobiliare"
        summary={valuation.summary}
        image={valuation.heroImage}
        icon={valuation.icon}
        detailPath={valuation.route}
        detailLabel="Scopri la valutazione"
      />
    </div>
  );
}
