import { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LoadingState from './components/LoadingState';
import { primaryServices, specialistServices } from './content/site';

const HomePage = lazy(() => import('./pages/HomePage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const SpecialistPage = lazy(() => import('./pages/SpecialistPage'));
const RequestsPage = lazy(() => import('./pages/RequestsPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ListingPage = lazy(() => import('./pages/ListingPage'));
const ListingsPage = lazy(() => import('./pages/ListingsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function LandingApp() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="richieste" element={<RequestsPage />} />
            <Route path="prenotazione" element={<BookingPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="immobili" element={<ListingsPage />} />
            <Route path="immobili/:slug" element={<ListingPage />} />
            <Route path="servizi" element={<ServicesPage />} />

            <Route path="acquisto-casa" element={<ServicePage service={primaryServices.acquisto} />} />
            <Route path="vendita-immobili" element={<ServicePage service={primaryServices.vendita} />} />
            <Route path="locazioni" element={<ServicePage service={primaryServices.locazione} />} />

            <Route
              path="valutazione-patrimonio"
              element={<SpecialistPage service={specialistServices.valutazionePatrimonio} />}
            />
          </Route>

          <Route path="/accesso-clienti" element={<Navigate to="/richieste" replace />} />
          <Route path="/valorizzazione-book-fotografico" element={<Navigate to="/" replace />} />
          <Route path="/servizi-premium" element={<Navigate to="/" replace />} />
          <Route path="/dettaglio-valorizzazione-book" element={<Navigate to="/" replace />} />
          <Route path="/dettaglio-valutazione-patrimonio" element={<Navigate to="/valutazione-patrimonio" replace />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/crm/*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
