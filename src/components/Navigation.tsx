import { Menu, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { company, navSections } from '../content/site';

const navLinks: Array<{ label: string; to: string }> = navSections.flatMap((section) =>
  section.links.map((link) => ({ label: link.label, to: link.to })),
);

function isCurrentPath(pathname: string, to: string) {
  if (to === '/') return pathname === '/';
  return pathname.replace(/\/$/, '') === to.replace(/\/$/, '');
}

const NAV_COLLISION_GAP = 24;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const navMeasureRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const updateNavigationMode = useCallback(() => {
    const bar = barRef.current;
    const logo = logoRef.current;
    const action = actionRef.current;
    const nav = navMeasureRef.current;

    if (!bar || !logo || !action || !nav) return;

    const barWidth = bar.getBoundingClientRect().width;
    const logoWidth = logo.getBoundingClientRect().width;
    const actionWidth = action.getBoundingClientRect().width;
    const navWidth = nav.scrollWidth;
    const reservedSide = Math.max(logoWidth, actionWidth) + NAV_COLLISION_GAP;
    const compact = navWidth + reservedSide * 2 > barWidth;

    setShouldCollapse((current) => (current === compact ? current : compact));
    setHasMeasured(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!shouldCollapse) setIsOpen(false);
  }, [shouldCollapse]);

  useLayoutEffect(() => {
    updateNavigationMode();

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateNavigationMode);
    const observed = [barRef.current, logoRef.current, actionRef.current, navMeasureRef.current].filter(Boolean);

    observed.forEach((element) => observer?.observe(element as Element));
    window.addEventListener('resize', updateNavigationMode);
    void document.fonts?.ready.then(updateNavigationMode);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateNavigationMode);
    };
  }, [updateNavigationMode]);

  useEffect(() => {
    if (!isOpen || !shouldCollapse) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, shouldCollapse]);

  return (
    <header
      data-site-navigation
      className={
        isHome
          ? 'sticky top-0 z-50 border-b border-white/30 bg-[rgba(251,250,246,0.88)]'
          : 'sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(251,250,246,0.96)]'
      }
    >
      <div
        ref={barRef}
        className="relative mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 sm:px-6"
      >
        <div ref={logoRef} className="min-w-0 justify-self-start">
          <Link to="/" className="focus-ring flex min-w-0 items-center rounded-lg">
            <img src="/design-system/logo/logo-blue.svg" alt={company.brand} className="h-7 w-auto sm:h-8" />
          </Link>
        </div>

        <div className="min-w-0 justify-self-center">
          {shouldCollapse ? (
            <button
              type="button"
              className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--ink)]/20 bg-[var(--paper-soft)] text-[var(--ink)] shadow-sm transition ${
                hasMeasured ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen((open) => !open)}
            >
              {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          ) : (
            <nav
              className={`flex max-w-full items-center justify-center gap-5 whitespace-nowrap transition ${
                hasMeasured ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-label="Navigazione principale"
            >
              {navLinks.map((link) => {
                const current = isCurrentPath(location.pathname, link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={current ? 'page' : undefined}
                    className={`focus-ring relative rounded-lg py-2 text-xs font-semibold uppercase transition ${
                      current
                        ? 'text-[var(--brand-blue-strong)] after:absolute after:inset-x-0 after:bottom-1 after:h-px after:bg-[var(--brand-blue-strong)]'
                        : 'text-[var(--ink)] hover:text-[var(--brand-blue-strong)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div ref={actionRef} className="flex items-center justify-end justify-self-end">
          <Link
            to="/richieste"
            className="focus-ring inline-flex whitespace-nowrap rounded-lg bg-[var(--brand-blue)] px-3 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--brand-blue-hover)] sm:px-4"
          >
            Richiesta
          </Link>
        </div>

        <nav
          ref={navMeasureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex whitespace-nowrap text-xs font-semibold uppercase"
        >
          <div className="flex items-center gap-5">
            {navLinks.map((link) => (
              <span key={link.to} className="py-2">
                {link.label}
              </span>
            ))}
          </div>
        </nav>
      </div>

      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 top-16 z-[70] max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-[var(--line)] bg-[#fbfaf6] shadow-[0_18px_40px_rgba(18,19,15,0.14)] transition-[opacity,transform,visibility] duration-200 ease-out ${
          shouldCollapse && isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-2 opacity-0'
        }`}
        aria-hidden={!isOpen || !shouldCollapse}
      >
        <nav
          className="mx-auto grid max-w-5xl gap-6 px-5 py-6 sm:grid-cols-3 sm:gap-x-10 sm:px-6 sm:py-8"
          aria-label="Navigazione mobile"
        >
          {navSections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--brand-blue-strong)]">
                {section.title}
              </h2>
              <div className="grid gap-0.5">
                {section.links.map((link) => {
                  const current = isCurrentPath(location.pathname, link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      data-mobile-nav-link
                      aria-current={current ? 'page' : undefined}
                      className={`block py-1.5 text-[1.05rem] leading-snug transition-colors outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 ${
                        current
                          ? 'font-semibold text-[var(--brand-blue-strong)]'
                          : 'font-medium text-[var(--ink)] hover:text-[var(--brand-blue-strong)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
          <Link
            to="/richieste"
            data-mobile-nav-link
            className="mt-1 block border-t border-[var(--line)] pt-5 text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-[var(--brand-blue-strong)] outline-none hover:text-[var(--ink)] focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 sm:col-span-3"
          >
            Invia richiesta
          </Link>
        </nav>
      </div>
    </header>
  );
}
