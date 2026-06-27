import Icon from './Icon';
import ButtonLink from './ButtonLink';
import type { IconName } from '../content/site';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  icon: IconName;
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; href: string };
}

export default function PageHero({
  eyebrow,
  title,
  summary,
  image,
  icon,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <header className="section-line bg-[var(--paper-soft)] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div data-animate className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--brand-blue-strong)]">
              <Icon name={icon} className="h-6 w-6" />
            </div>
            <p data-animate className="eyebrow">
              {eyebrow}
            </p>
            <h1 data-animate className="font-display mt-4 max-w-4xl text-5xl leading-[0.95] text-[var(--ink)] sm:text-7xl">
              {title}
            </h1>
            <p data-animate className="mt-6 max-w-2xl text-base leading-7 text-[var(--graphite)] sm:text-lg sm:leading-8">
              {summary}
            </p>
          </div>

          <div data-animate="image" className="media-frame h-[20rem] rounded-lg sm:h-[28rem]">
            <img src={image} alt="" className="h-full w-full object-cover" data-parallax />
          </div>
        </div>

        <div data-animate className="mt-8 flex flex-col gap-3 sm:flex-row">
          {(primaryCta || secondaryCta) && (
            <>
              {primaryCta && (
                <ButtonLink to={primaryCta.to} showArrow>
                  {primaryCta.label}
                </ButtonLink>
              )}
              {secondaryCta && (
                <ButtonLink href={secondaryCta.href} variant="outline">
                  {secondaryCta.label}
                </ButtonLink>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
