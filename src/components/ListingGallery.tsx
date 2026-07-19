import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';

interface ListingGalleryProps {
  images: string[];
  imageAlt: string;
  onBack?: () => void;
}

const wrapIndex = (index: number, length: number) => (index + length) % length;

export default function ListingGallery({ images, imageAlt, onBack }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);
  const imageCount = images.length;
  const activeImage = images[activeIndex];

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => wrapIndex(current - 1, imageCount));
  }, [imageCount]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => wrapIndex(current + 1, imageCount));
  }, [imageCount]);

  const openLightbox = () => {
    lightboxTriggerRef.current = document.activeElement as HTMLElement;
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
        return;
      }
      if (event.key === 'ArrowLeft') {
        showPrevious();
        return;
      }
      if (event.key === 'ArrowRight') {
        showNext();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? [],
      );
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      lightboxTriggerRef.current?.focus();
    };
  }, [closeLightbox, isLightboxOpen, showNext, showPrevious]);

  if (!activeImage) return null;

  const activeAlt = `${imageAlt} — foto ${activeIndex + 1} di ${imageCount}`;

  return (
    <>
      <div data-listing-carousel data-animate="image" className="min-w-0">
        <div className="media-frame relative aspect-[4/3] w-full sm:aspect-[16/9] lg:mx-auto lg:max-w-[90rem] lg:aspect-[21/9] lg:rounded-lg">
          <button
            type="button"
            onClick={openLightbox}
            className="focus-ring group h-full w-full cursor-zoom-in"
            aria-label={`Apri foto ${activeIndex + 1} di ${imageCount} a schermo intero`}
          >
            <img src={activeImage} alt={activeAlt} className="h-full w-full object-cover" data-parallax />
            <span className="pointer-events-none absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ink)]/75 text-white transition-colors group-hover:bg-[var(--ink)]">
              <Icon name="expand" className="h-5 w-5" />
            </span>
          </button>

          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              data-listing-back
              className="focus-ring absolute left-4 top-4 z-10 inline-flex min-h-11 items-center gap-1 rounded-lg bg-[var(--paper-soft)]/95 px-3 text-sm font-semibold text-[var(--ink)] shadow-sm transition-colors hover:bg-white"
              aria-label="Torna alla pagina precedente"
            >
              <Icon name="chevron-left" className="h-5 w-5" />
              Indietro
            </button>
          ) : null}

          {imageCount > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="focus-ring absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--paper-soft)]/90 text-[var(--ink)] shadow-sm transition-colors hover:bg-white"
                aria-label="Foto precedente"
              >
                <Icon name="chevron-left" className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="focus-ring absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--paper-soft)]/90 text-[var(--ink)] shadow-sm transition-colors hover:bg-white"
                aria-label="Foto successiva"
              >
                <Icon name="chevron-right" className="h-6 w-6" />
              </button>
              <span
                aria-live="polite"
                className="absolute bottom-4 right-4 rounded-full bg-[var(--ink)]/75 px-3 py-1 text-xs font-semibold text-white"
              >
                {activeIndex + 1} / {imageCount}
              </span>
            </>
          ) : null}
        </div>

        {imageCount > 1 ? (
          <div
            className="scrollbar-hidden mx-auto mt-3 hidden max-w-7xl gap-3 overflow-x-auto p-1 px-4 sm:flex sm:px-6"
            aria-label="Seleziona una foto"
          >
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`focus-ring h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity sm:h-20 sm:w-28 ${
                  index === activeIndex
                    ? 'border-[var(--brand-blue)] opacity-100 ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--paper)]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`Mostra foto ${index + 1} di ${imageCount}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div
          ref={dialogRef}
          data-listing-lightbox
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery fotografica: ${imageAlt}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white sm:left-8 sm:top-8">
            {activeIndex + 1} / {imageCount}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            className="focus-ring absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8 sm:top-8"
            aria-label="Chiudi gallery"
          >
            <Icon name="close" className="h-6 w-6" />
          </button>

          {imageCount > 1 ? (
            <button
              type="button"
              onClick={showPrevious}
              className="focus-ring absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-8"
              aria-label="Foto precedente"
            >
              <Icon name="chevron-left" className="h-7 w-7" />
            </button>
          ) : null}

          <img
            src={activeImage}
            alt={activeAlt}
            className="max-h-[calc(100svh-8rem)] max-w-[calc(100vw-6rem)] object-contain sm:max-w-[calc(100vw-10rem)]"
          />

          {imageCount > 1 ? (
            <button
              type="button"
              onClick={showNext}
              className="focus-ring absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8"
              aria-label="Foto successiva"
            >
              <Icon name="chevron-right" className="h-7 w-7" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
