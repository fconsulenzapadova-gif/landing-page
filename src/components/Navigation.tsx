import { ChevronDown, Menu, X } from 'lucide-react';
import { type MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { company, navigationLinks, serviceNavigationLinks } from '../content/site';

const navLinks: Array<{ label: string; to: string }> = [...navigationLinks];

function isCurrentPath(pathname: string, to: string) {
  if (to === '/') return pathname === '/';
  const currentPath = pathname.replace(/\/$/, '');
  const targetPath = to.replace(/\/$/, '');
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function isNavigationLinkCurrent(pathname: string, to: string) {
  if (to !== '/servizi') return isCurrentPath(pathname, to);
  return (
    isCurrentPath(pathname, to) ||
    serviceNavigationLinks.some((serviceLink) => isCurrentPath(pathname, serviceLink.to))
  );
}

const NAV_COLLISION_GAP = 24;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
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
    const compact = window.matchMedia('(max-width: 639px)').matches || navWidth + reservedSide * 2 > barWidth;

    setShouldCollapse((current) => (current === compact ? current : compact));
    setHasMeasured(true);
  }, []);

  const closeServiceNavigation = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.blur();
    setIsMobileServicesOpen(false);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!shouldCollapse) {
      setIsOpen(false);
      setIsMobileServicesOpen(false);
    }
  }, [shouldCollapse]);

  useEffect(() => {
    if (!isOpen) setIsMobileServicesOpen(false);
  }, [isOpen]);

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
          ? 'sticky top-0 z-50 border-b border-white/30 bg-[rgba(236,233,226,0.82)] backdrop-blur-md'
          : 'sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(236,233,226,0.9)] backdrop-blur-md'
      }
    >
      <div
        ref={barRef}
        className="relative mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 sm:px-6"
      >
        <div ref={logoRef} className="min-w-0 justify-self-start">
          <Link to="/" className="focus-ring flex min-w-0 items-center rounded-lg" aria-label={company.brand}>
            <span className="font-brand inline-flex pt-[0.08em] text-[1.45rem] font-light uppercase leading-[1.1] text-[var(--ink)] sm:text-[1.65rem]" aria-hidden="true">
              GEMÜT
            </span>
          </Link>
        </div>

        <div className="min-w-0 justify-self-center">
          {shouldCollapse ? (
            <button
              type="button"
              className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--control-border)] bg-[var(--paper-soft)] text-[var(--ink)] shadow-sm transition ${
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
                const current = isNavigationLinkCurrent(location.pathname, link.to);
                const isServicesLink = link.to === '/servizi';

                if (isServicesLink) {
                  return (
                    <div key={link.to} className="group relative">
                      <Link
                        to={link.to}
                        aria-current={isCurrentPath(location.pathname, link.to) ? 'page' : undefined}
                        aria-haspopup="true"
                        onClick={closeServiceNavigation}
                        className={`focus-ring relative block rounded-lg px-2 py-2 text-xs uppercase transition ${
                          current
                            ? 'bg-[var(--brand-blue)] font-semibold text-[var(--ink)]'
                            : 'font-semibold text-[var(--ink)] hover:bg-[var(--brand-blue)]'
                        }`}
                      >
                        {link.label}
                      </Link>
                      <div className="invisible absolute left-1/2 top-full z-[80] w-64 -translate-x-1/2 -translate-y-1 pt-3 opacity-0 transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <nav
                          aria-label="Dettaglio servizi"
                          className="grid overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-2 shadow-[0_18px_40px_rgba(18,19,15,0.14)]"
                        >
                          {serviceNavigationLinks.map((serviceLink) => {
                            const serviceCurrent = isCurrentPath(location.pathname, serviceLink.to);
                            return (
                              <Link
                                key={serviceLink.to}
                                to={serviceLink.to}
                                aria-current={serviceCurrent ? 'page' : undefined}
                                onClick={closeServiceNavigation}
                                className={`focus-ring rounded-md px-3 py-2.5 text-sm font-medium normal-case transition ${
                                  serviceCurrent
                                    ? 'bg-[var(--brand-blue)] text-[var(--ink)]'
                                    : 'text-[var(--ink)] hover:bg-[var(--brand-blue)]'
                                }`}
                              >
                                {serviceLink.label}
                              </Link>
                            );
                          })}
                        </nav>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={current ? 'page' : undefined}
                    className={`focus-ring relative rounded-lg px-2 py-2 text-xs uppercase transition ${
                      current
                        ? 'bg-[var(--brand-blue)] font-semibold text-[var(--ink)]'
                        : 'font-semibold text-[var(--ink)] hover:bg-[var(--brand-blue)]'
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
            className="focus-ring inline-flex whitespace-nowrap rounded-lg bg-[var(--brand-blue)] px-3 py-2 text-sm font-semibold text-[var(--ink)] transition hover:ring-2 hover:ring-[var(--ink)] sm:px-4"
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
              <span key={link.to} className="px-2 py-2">
                {link.label}
              </span>
            ))}
          </div>
        </nav>
      </div>

      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 top-16 z-[70] max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-[var(--line)] bg-[var(--paper-soft)] shadow-[0_18px_40px_rgba(18,19,15,0.14)] transition-[opacity,transform,visibility] duration-200 ease-out ${
          shouldCollapse && isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-2 opacity-0'
        }`}
        aria-hidden={!isOpen || !shouldCollapse}
      >
        <nav
          className="mx-auto grid max-w-5xl gap-1 px-5 py-6 sm:grid-cols-[repeat(3,1fr)_auto] sm:items-center sm:gap-x-8 sm:px-6 sm:py-8"
          aria-label="Navigazione mobile"
        >
          {navLinks.map((link) => {
            const current = isNavigationLinkCurrent(location.pathname, link.to);
            const isServicesLink = link.to === '/servizi';

            if (isServicesLink) {
              return (
                <div key={link.to} className="min-w-0">
                  <div className="flex items-center">
                    <Link
                      to={link.to}
                      data-mobile-nav-link
                      aria-current={isCurrentPath(location.pathname, link.to) ? 'page' : undefined}
                      onClick={closeServiceNavigation}
                      className={`block min-w-0 flex-1 rounded px-2 py-2 text-[1.05rem] leading-snug transition-colors outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 ${
                        current
                          ? 'bg-[var(--brand-blue)] font-semibold text-[var(--ink)]'
                          : 'font-semibold text-[var(--ink)] hover:bg-[var(--brand-blue)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--ink)] hover:bg-[var(--brand-blue)]"
                      aria-label={isMobileServicesOpen ? 'Chiudi servizi' : 'Apri servizi'}
                      aria-expanded={isMobileServicesOpen}
                      aria-controls="mobile-service-navigation"
                      onClick={() => setIsMobileServicesOpen((open) => !open)}
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                  </div>
                  <div
                    id="mobile-service-navigation"
                    className={`grid overflow-hidden border-l border-[var(--line)] pl-4 transition-[max-height,opacity,margin] duration-200 ${
                      isMobileServicesOpen ? 'mt-1 max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    aria-hidden={!isMobileServicesOpen}
                    hidden={!isMobileServicesOpen}
                  >
                    {serviceNavigationLinks.map((serviceLink) => {
                      const serviceCurrent = isCurrentPath(location.pathname, serviceLink.to);
                      return (
                        <Link
                          key={serviceLink.to}
                          to={serviceLink.to}
                          data-mobile-nav-link
                          aria-current={serviceCurrent ? 'page' : undefined}
                          onClick={closeServiceNavigation}
                          className={`rounded px-2 py-2 text-sm transition-colors outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 ${
                            serviceCurrent
                              ? 'bg-[var(--brand-blue)] font-semibold text-[var(--ink)]'
                              : 'font-medium text-[var(--graphite)] hover:bg-[var(--brand-blue)] hover:text-[var(--ink)]'
                          }`}
                        >
                          {serviceLink.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.to}
                to={link.to}
                data-mobile-nav-link
                aria-current={current ? 'page' : undefined}
                className={`block rounded px-2 py-2 text-[1.05rem] leading-snug transition-colors outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 ${
                  current
                    ? 'bg-[var(--brand-blue)] font-semibold text-[var(--ink)]'
                    : 'font-semibold text-[var(--ink)] hover:bg-[var(--brand-blue)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/richieste"
            data-mobile-nav-link
            className="mt-3 block rounded bg-[var(--brand-blue)] px-3 py-3 text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-[var(--ink)] outline-none hover:ring-2 hover:ring-[var(--ink)] focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 sm:mt-0 sm:border-l sm:border-[var(--line)] sm:py-2 sm:pl-8"
          >
            Invia richiesta
          </Link>
        </nav>
      </div>
    </header>
  );
}
