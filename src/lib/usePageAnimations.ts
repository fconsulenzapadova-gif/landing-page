import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { DependencyList, RefObject } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

gsap.defaults({
  duration: 0.9,
  ease: 'power3.out',
});

export function usePageAnimations(scope: RefObject<HTMLElement | null>, dependencies: DependencyList = []) {
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const revealItems = gsap.utils.toArray<HTMLElement>('[data-animate]');
      const parallaxItems = gsap.utils.toArray<HTMLElement>('[data-parallax]');
      const media = gsap.matchMedia();

      if (reduceMotion) {
        gsap.set([...revealItems, ...parallaxItems], { opacity: 1, clearProps: 'transform,clipPath,willChange' });
        return;
      }

      revealItems.forEach((item) => {
        const mode = item.dataset.animate;
        const isImage = mode === 'image';
        const isLine = mode === 'line';
        const fromVars = {
          opacity: isLine ? 1 : 0,
          y: isLine ? 0 : 28,
          scale: isImage ? 0.98 : 1,
          scaleX: isLine ? 0 : 1,
          transformOrigin: isLine ? 'left center' : undefined,
          force3D: true,
        };

        gsap.fromTo(
          item,
          fromVars,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scaleX: 1,
            force3D: true,
            duration: isImage ? 1 : 0.8,
            immediateRender: false,
            onStart: () => gsap.set(item, { willChange: 'transform, opacity' }),
            onComplete: () => gsap.set(item, { willChange: 'auto' }),
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      media.add('(hover: hover) and (pointer: fine)', () => {
        parallaxItems.forEach((item) => {
          gsap.fromTo(
            item,
            { yPercent: -4, force3D: true },
            {
              yPercent: 4,
              force3D: true,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
                onToggle: ({ isActive }) => {
                  gsap.set(item, { willChange: isActive ? 'transform' : 'auto' });
                },
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { scope, dependencies: [...dependencies], revertOnUpdate: dependencies.length > 0 },
  );
}
