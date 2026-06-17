import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { Home, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Acquisto Casa', to: '/acquisto-casa' },
  { label: 'Vendita Immobili', to: '/vendita-immobili' },
  { label: 'Locazioni', to: '/locazioni' },
  { label: 'Verifica Stato Tetto tramite UAV', to: '/verifica-stato-tetto/' },
  { label: 'Valutazione per Patrimonio', to: '/valutazione-patrimonio/' },
] as const;

export default function GlobalNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lastActivationPointerType = useRef<string | null>(null);

  const openMenu = () => setIsOpen(true);

  const handleMenuButtonPointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') return;
    openMenu();
  };

  const handleMenuButtonMouseEnter = () => {
    openMenu();
  };

  const handleMenuButtonPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    lastActivationPointerType.current = event.pointerType;
  };

  const handleMenuButtonFocus = () => {
    if (lastActivationPointerType.current) return;
    openMenu();
  };

  const handleMenuButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (lastActivationPointerType.current === 'touch') {
      openMenu();
      lastActivationPointerType.current = null;
      return;
    }

    lastActivationPointerType.current = null;
    setIsOpen(false);
    navigate('/');
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Apri menu di navigazione; su desktop clicca per tornare alla home"
        aria-expanded={isOpen}
        aria-controls="global-navigation-panel"
        onPointerEnter={handleMenuButtonPointerEnter}
        onPointerDown={handleMenuButtonPointerDown}
        onMouseEnter={handleMenuButtonMouseEnter}
        onFocus={handleMenuButtonFocus}
        onClick={handleMenuButtonClick}
        className="group fixed left-4 top-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-900 shadow-lg backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
      >
        <Menu
          className="h-6 w-6 transition-all duration-300 group-hover:scale-75 group-hover:opacity-0"
          aria-hidden="true"
        />
        <Home
          className="absolute h-6 w-6 scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
          aria-hidden="true"
        />
      </button>

      <div
        className={`fixed inset-0 z-[100] bg-slate-950/45 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
      />

      <aside
        id="global-navigation-panel"
        className={`fixed inset-y-0 left-0 z-[105] flex w-[min(88vw,24rem)] flex-col bg-white px-6 pb-8 pt-24 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigazione principale"
        aria-hidden={!isOpen}
      >
        <div className="mb-7 border-b border-slate-200 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Mediazione immobiliare
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-950">Gemüt Capital</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {navigationItems.map((item) => {
            const isCurrent =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname.replace(/\/$/, '') === item.to.replace(/\/$/, '');

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isCurrent ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                  isCurrent
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/prenotazione"
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3.5 text-center font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
        >
          Prenota una consulenza
        </Link>
      </aside>
    </>
  );
}
