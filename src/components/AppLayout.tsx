import { Outlet, useLocation } from 'react-router-dom';
import CookieConsent from './CookieConsent';
import Footer from './Footer';
import Navigation from './Navigation';

export default function AppLayout() {
  const location = useLocation();
  const isRequestWizard = location.pathname === '/richieste';

  return (
    <div className={`${isRequestWizard ? 'min-h-svh' : 'min-h-screen'} bg-[var(--paper)] text-[var(--ink)]`}>
      <Navigation />
      <main className={isRequestWizard ? 'min-h-[calc(100svh-4rem-1px)]' : undefined}>
        <Outlet />
      </main>
      {!isRequestWizard && <Footer />}
      <CookieConsent />
    </div>
  );
}
