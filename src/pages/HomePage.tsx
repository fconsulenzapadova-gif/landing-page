import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ButtonLink from '../components/ButtonLink';
import Icon from '../components/Icon';
import ListingCard from '../components/ListingCard';
import Section from '../components/Section';
import { specialistServices, valueProps } from '../content/site';
import { useListings } from '../lib/useListings';
import { usePageAnimations } from '../lib/usePageAnimations';

const specialists = Object.values(specialistServices);

const curveSwipePaths = {
  hidden: 'M 0 100 V 100 Q 50 100 100 100 V 100 Z',
  wave: 'M 0 100 V 44 Q 50 -10 100 44 V 100 Z',
  full: 'M 0 100 V -2 Q 50 -2 100 -2 V 100 Z',
};

const heroSwipeDistance = () => Math.max(window.innerHeight * 0.62, 380);
const galleryStartDelay = () => Math.round(Math.max(heroSwipeDistance() * 0.72, 300));
const galleryEndLead = () => Math.round(Math.min(window.innerHeight * 0.16, 140));

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const listingsRef = useRef<HTMLElement>(null);
  const { listings } = useListings();

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>('[data-hero-word]');
      const image = heroRef.current?.querySelector<HTMLElement>('[data-hero-image]');
      const media = gsap.matchMedia();

      media.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          motionOK: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          if (context.conditions?.reduceMotion) {
            gsap.set(words, { autoAlpha: 1, y: 0, clearProps: 'opacity,visibility,transform' });
            if (image) gsap.set(image, { scale: 1, clearProps: 'transform' });
            return;
          }

          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.06, force3D: true },
              {
                scale: 1,
                force3D: true,
                duration: 1.8,
                ease: 'power3.out',
              },
            );
          }

          gsap.fromTo(
            words,
            { autoAlpha: 0, y: 42, force3D: true },
            {
              autoAlpha: 1,
              y: 0,
              force3D: true,
              duration: 1,
              ease: 'power3.out',
              stagger: 0.14,
              overwrite: 'auto',
              onComplete: () => {
                gsap.set(words, { clearProps: 'opacity,visibility,transform' });
              },
            },
          );
        },
      );

      return () => media.revert();
    },
    { scope: heroRef },
  );

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;

      const image = hero.querySelector<HTMLElement>('[data-hero-image]');
      const tint = hero.querySelector<HTMLElement>('[data-hero-tint]');
      const curvePath = hero.querySelector<SVGPathElement>('[data-curve-path]');
      const listingsViewport = listingsRef.current?.querySelector<HTMLElement>('[data-listings-viewport]');
      const listingsBackdrop = listingsRef.current?.querySelector<HTMLElement>('[data-listings-backdrop]');
      const listingsRevealTarget = listingsViewport ? [listingsViewport] : [];
      const listingsBackdropTarget = listingsBackdrop ? [listingsBackdrop] : [];
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          motionOK: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const reduceMotion = context.conditions?.reduceMotion;

          if (reduceMotion) {
            if (image) gsap.set(image, { scale: 1, yPercent: 0, clearProps: 'transform' });
            if (listingsRevealTarget.length > 0) {
              gsap.set(listingsRevealTarget, { autoAlpha: 1, y: 0, clearProps: 'transform,visibility' });
            }
            if (listingsBackdropTarget.length > 0) gsap.set(listingsBackdropTarget, { autoAlpha: 1 });
            curvePath?.setAttribute('d', curveSwipePaths.hidden);
            return;
          }

          if (curvePath) gsap.set(curvePath, { attr: { d: curveSwipePaths.hidden } });
          if (listingsRevealTarget.length > 0) gsap.set(listingsRevealTarget, { autoAlpha: 0, y: 64, force3D: true });
          if (listingsBackdropTarget.length > 0) gsap.set(listingsBackdropTarget, { autoAlpha: 0 });

          const transition = gsap.timeline({
            scrollTrigger: {
              id: 'home-curve-swipe',
              trigger: hero,
              start: 'top top',
              end: () => `+=${heroSwipeDistance()}`,
              scrub: 0.75,
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: -10,
              onUpdate: (self) => {
                if (listingsBackdrop) {
                  listingsBackdrop.style.opacity = self.progress >= 0.98 ? '1' : '0';
                }
              },
            },
          });

          transition
            .to(curvePath, { attr: { d: curveSwipePaths.wave }, duration: 0.42, ease: 'power2.in' }, 0)
            .to(curvePath, { attr: { d: curveSwipePaths.full }, duration: 0.58, ease: 'power2.out' }, 0.42);

          if (image) transition.to(image, { scale: 1.12, yPercent: -4, force3D: true, duration: 1, ease: 'none' }, 0);
          if (tint) transition.to(tint, { opacity: 0.98, duration: 1, ease: 'none' }, 0);
          if (listingsRevealTarget.length > 0) {
            transition.to(listingsRevealTarget, { autoAlpha: 1, y: 0, force3D: true, duration: 0.28, ease: 'power2.out' }, 0.5);
          }
        },
      );

      return () => {
        mm.revert();
        listingsBackdrop?.style.removeProperty('opacity');
      };
    },
    { scope: heroRef, dependencies: [listings.length], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const section = listingsRef.current;
      if (!section) return;

      const viewport = section.querySelector<HTMLElement>('[data-listings-viewport]');
      const track = section.querySelector<HTMLElement>('[data-listings-track]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-listing-card]');
      const firstCard = cards[0];
      const mm = gsap.matchMedia();

      if (!viewport || !track || !firstCard) return;

      const getStartX = () => {
        const paddingLeft = Number.parseFloat(window.getComputedStyle(viewport).paddingLeft) || 0;
        return Math.max(0, (viewport.clientWidth - firstCard.offsetWidth) / 2 - paddingLeft);
      };
      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          touch: '(any-pointer: coarse)',
          motionOK: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const reduceMotion = context.conditions?.reduceMotion;
          const touch = context.conditions?.touch;

          if (reduceMotion || touch) {
            gsap.set(track, { x: getStartX() });
            gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: 'transform,visibility' });
            return;
          }

          gsap.fromTo(
            track,
            { x: () => getStartX(), force3D: true },
            {
              x: () => -getDistance(),
              force3D: true,
              ease: 'none',
              scrollTrigger: {
                id: 'featured-listings-gallery',
                trigger: section,
                start: () => `top+=${galleryStartDelay()} top`,
                end: () => `bottom-=${galleryEndLead()} bottom`,
                scrub: 0.35,
                invalidateOnRefresh: true,
                refreshPriority: -5,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: listingsRef, dependencies: [listings.length], revertOnUpdate: true },
  );

  usePageAnimations(pageRef);

  return (
    <div ref={pageRef}>
      <header ref={heroRef} className="relative isolate -mt-16 flex min-h-[100svh] overflow-hidden bg-[var(--ink)]">
        <picture className="contents">
          <source media="(max-width: 767px)" srcSet="/images/Home-mobile.jpg" />
          <img
            data-hero-image
            src="/images/Home.webp"
            alt=""
            className="motion-transform-layer absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div data-hero-tint className="motion-opacity-layer absolute inset-0 bg-black/45 opacity-[0.67]" aria-hidden />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-16 text-center sm:px-6">
          <h1 className="max-w-none text-balance text-4xl leading-[1.1] text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.35)] sm:whitespace-nowrap sm:text-[clamp(2.5rem,5.5vw,4.75rem)] sm:leading-[1.08]">
            <span data-hero-word className="motion-transform-layer font-display inline-block">
              Casa nuova, stesso
            </span>{' '}
            <span data-hero-word className="motion-transform-layer font-brand inline-block -mt-[0.1em] pt-[0.1em] text-[1.08em] font-light uppercase leading-[1.12] text-[var(--brand-blue)]">
              GEMÜT
            </span>
          </h1>
        </div>
        <svg
          data-curve-swipe
          className="pointer-events-none absolute inset-0 z-20 h-full w-full text-[var(--paper)]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path data-curve-path fill="currentColor" d={curveSwipePaths.hidden} />
        </svg>
      </header>

      {listings.length > 0 ? (
        <section ref={listingsRef} className="home-listings-section relative z-30 min-h-[260svh] bg-transparent [margin-top:-100svh]">
          <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden py-10 sm:py-14">
            <div data-listings-backdrop className="pointer-events-none absolute inset-0 bg-[var(--paper)] opacity-0" aria-hidden />
            <div data-listings-viewport className="motion-transform-layer motion-paint-boundary scrollbar-hidden relative z-10 w-full overflow-x-auto overflow-y-hidden px-4 py-6 sm:px-6" aria-label="Immobili disponibili">
              <div data-listings-track className="motion-transform-layer flex w-max items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
                {listings.map((listing) => (
                  <div
                    key={listing.slug}
                    data-listing-card
                    className="w-[78vw] max-w-[25rem] shrink-0"
                  >
                    <ListingCard listing={listing} loading="eager" />
                  </div>
                ))}
                <span aria-hidden="true" className="block w-[20vw] shrink-0" />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <Section className="bg-[var(--paper-soft)]">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div data-animate="image" className="media-frame mx-auto max-w-md rounded-lg">
            <img src="/images/profile.webp" alt="Filippo Marcuzzo" width="512" height="768" loading="lazy" decoding="async" />
          </div>
          <div>
            <p data-animate className="eyebrow">
              Chi siamo
            </p>
            <h2 data-animate className="font-display mt-4 max-w-3xl text-4xl leading-tight text-[var(--ink)] sm:text-6xl">
              Una regia unica per decisioni immobiliari complesse.
            </h2>
            <div data-animate className="mt-6 max-w-3xl space-y-4 text-base leading-8 text-[var(--graphite)]">
              <p>
                Gemüt Capital accompagna clienti, proprietari e investitori nelle decisioni immobiliari importanti, con attenzione al valore reale e alla sostenibilita dell’operazione.
              </p>
              <p>
                Filippo Marcuzzo coordina analisi preliminare, strategia, trattativa, documenti e professionisti coinvolti quando servono verifiche tecniche, fiscali o legali.
              </p>
            </div>
            <div data-animate className="mt-8">
              <ButtonLink to="/richieste" showArrow>
                Raccontaci la tua esigenza
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section className="section-line">
        <div className="grid gap-6 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p data-animate className="eyebrow">
              Metodo
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
              Cosa resta costante in ogni incarico.
            </h2>
          </div>
          <div className="grid border-t border-[var(--line)] sm:grid-cols-2">
            {valueProps.map((item) => (
              <article key={item.title} data-animate className="border-b border-[var(--line)] py-6 sm:px-6 sm:odd:border-r">
                <Icon name={item.icon} className="h-6 w-6 rounded bg-[var(--brand-blue)] p-0.5 text-[var(--ink)]" />
                <h3 className="mt-4 text-xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--graphite)]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="section-line bg-[var(--ink)] text-white">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p data-animate className="text-xs font-bold uppercase text-white/60">
              Valutazione patrimonio
            </p>
            <h2 data-animate className="font-display mt-4 text-4xl leading-tight sm:text-6xl">
              Quando servono dati migliori prima di decidere.
            </h2>
          </div>
          <div className="grid gap-4">
            {specialists.map((service) => (
              <Link
                key={service.id}
                to={service.route}
                data-animate
                className="interactive-lift rounded-lg border border-white/15 bg-white/[0.04] p-6 text-white hover:border-white/35"
              >
                <Icon name={service.icon} className="h-7 w-7 text-white" />
                <h3 className="mt-5 text-2xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{service.summary}</p>
                <span className="mt-6 inline-flex text-sm font-semibold uppercase text-white">Approfondisci</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section className="section-line bg-[var(--brand-blue)] text-[var(--ink)]">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p data-animate className="text-xs font-bold uppercase text-[var(--ink)]">
              Primo passo
            </p>
            <h2 data-animate className="font-display mt-3 max-w-4xl text-4xl leading-tight sm:text-6xl">
              Hai un obiettivo immobiliare concreto?
            </h2>
            <p data-animate className="mt-4 max-w-2xl text-base leading-7 text-[var(--ink)]">
              Invia i dati essenziali. Ti ricontattiamo per capire il percorso piu adatto prima di muovere il mercato.
            </p>
          </div>
          <div data-animate>
            <ButtonLink to="/richieste" variant="light" showArrow>
              Invia richiesta
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
