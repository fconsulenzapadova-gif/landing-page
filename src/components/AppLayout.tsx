import { Outlet } from 'react-router-dom';
import CookieConsent from './CookieConsent';
import Footer from './Footer';
import Navigation from './Navigation';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
