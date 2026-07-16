import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import ButtonLink from './ButtonLink';
import Section from './Section';

gsap.registerPlugin(useGSAP);

interface RequestSuccessProps {
  onReset: () => void;
}

export default function RequestSuccess({ onReset }: RequestSuccessProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animatedItems = gsap.utils.toArray<HTMLElement>('[data-success-item]');
      const checkPath = sceneRef.current?.querySelector<SVGPathElement>('[data-success-check]');

      if (reduceMotion) {
        gsap.set(animatedItems, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: 'transform,visibility' });
        if (checkPath) gsap.set(checkPath, { strokeDashoffset: 0 });
        headingRef.current?.focus();
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo('[data-success-scene]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
        .fromTo(
          '[data-success-circle]',
          { autoAlpha: 0, scale: 0.45 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        )
        .fromTo(
          '[data-success-check]',
          { strokeDashoffset: 52 },
          { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' },
          '-=0.22',
        )
        .fromTo(
          '[data-success-copy]',
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            onComplete: () => headingRef.current?.focus(),
          },
          '-=0.18',
        )
        .fromTo(
          '[data-success-actions]',
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          '-=0.2',
        );
    },
    { scope: sceneRef },
  );

  return (
    <div ref={sceneRef} role="status" aria-live="polite">
      <Section className="section-line flex min-h-[70vh] items-center bg-[var(--paper-soft)]">
        <div
          data-success-scene
          className="mx-auto w-full max-w-xl rounded-lg border border-[var(--line)] bg-white px-6 py-10 text-center shadow-[0_20px_60px_rgba(18,19,15,0.08)] sm:px-10 sm:py-12"
        >
          <div
            data-success-circle
            data-success-item
            className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[var(--brand-blue)] text-[var(--ink)]"
          >
            <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path
                data-success-check
                d="M13 24.5 21 32l15-17"
                pathLength="52"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="52"
                strokeDashoffset="52"
              />
            </svg>
          </div>
          <h1
            ref={headingRef}
            data-success-copy
            data-success-item
            tabIndex={-1}
            className="font-display mt-7 text-5xl leading-none text-[var(--ink)] sm:text-6xl"
          >
            Grazie!
          </h1>
          <p
            data-success-copy
            data-success-item
            className="mx-auto mt-4 max-w-md text-base leading-7 text-[var(--graphite)] sm:text-lg"
          >
            Richiesta ricevuta. Ti contatteremo entro un giorno lavorativo.
          </p>
          <div
            data-success-actions
            data-success-item
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <ButtonLink to="/" variant="outline">Torna alla home</ButtonLink>
            <button
              type="button"
              className="focus-ring rounded-lg bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
              onClick={onReset}
            >
              Nuova richiesta
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
