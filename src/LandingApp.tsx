import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Toaster } from './components/ui/toaster';
import CookieConsent from './components/CookieConsent';
import { AuthProvider } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load public pages only
const Landing = lazy(() => import('./pages/Landing'));
const PublicRequests = lazy(() => import('./pages/PublicRequests'));
const AcquistoCasa = lazy(() => import('./pages/AcquistoCasa'));
const VenditaImmobili = lazy(() => import('./pages/VenditaImmobili'));
const Locazioni = lazy(() => import('./pages/Locazioni'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ServiziPersonalizzati = lazy(() => import('./pages/ServiziPersonalizzati'));
const ClientAccess = lazy(() => import('./pages/ClientAccess'));
const Prenotazione = lazy(() => import('./pages/Prenotazione'));

// Lazy load service detail pages
const ServiziPremium = lazy(() => import('./pages/ServiziPremium'));

const queryClient = new QueryClient();

function LandingApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<LoadingSpinner size="lg" text="Caricamento pagina..." />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/richieste" element={<PublicRequests />} />
                <Route path="/accesso-clienti" element={<ClientAccess />} />
                
                {/* Service pages */}
                <Route path="/acquisto-casa" element={<AcquistoCasa />} />
                <Route path="/vendita-immobili" element={<VenditaImmobili />} />
                <Route path="/locazioni" element={<Locazioni />} />
                <Route path="/servizi-personalizzati" element={<ServiziPersonalizzati />} />
                <Route path="/prenotazione" element={<Prenotazione />} />
                
                {/* Service detail pages */}
                <Route path="/servizi-premium" element={<ServiziPremium />} />
                <Route path="/dettaglio-verifica-tetto" element={<Navigate to="/servizi-premium" replace />} />
                <Route path="/dettaglio-valorizzazione-book" element={<Navigate to="/servizi-premium" replace />} />
                <Route path="/dettaglio-valutazione-patrimonio" element={<Navigate to="/servizi-premium" replace />} />
                
                {/* Redirect any CRM routes to external CRM */}
                <Route path="/dashboard" element={<Navigate to="http://localhost:8081" replace />} />
                <Route path="/crm/*" element={<Navigate to="http://localhost:8081" replace />} />
                <Route path="/login" element={<Navigate to="http://localhost:8081/auth" replace />} />
                <Route path="/auth" element={<Navigate to="http://localhost:8081/auth" replace />} />
                
                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
          <Toaster />
          <CookieConsent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default LandingApp;