import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Cookie } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      try {
        setPreferences(JSON.parse(savedConsent));
      } catch (e) {
        console.error('Error parsing cookie consent', e);
      }
    }
  }, []);

  const savePreferences = (newPrefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    setShowBanner(false);
    setIsOpen(false);
    
    // Logica per attivare/disattivare script in base alle preferenze
    if (newPrefs.analytics) {
      console.log('Analytics cookies enabled');
      // Qui attiveresti Google Analytics, ecc.
    }
    if (newPrefs.marketing) {
      console.log('Marketing cookies enabled');
      // Qui attiveresti Pixel Facebook, ecc.
    }
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  // Se il banner non deve essere mostrato e il dialog è chiuso, non renderizzare nulla
  if (!showBanner && !isOpen) return null;

  return (
    <>
      {/* Banner Sticky */}
      {showBanner && !isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                <Cookie className="h-5 w-5 text-blue-600" />
                Informativa sui Cookie
              </h3>
              <p className="text-sm text-gray-600 max-w-3xl">
                Utilizziamo cookie tecnici essenziali e, previo tuo consenso, cookie di profilazione e analitici per migliorare la tua esperienza di navigazione. 
                Il rifiuto del consenso potrebbe rendere non disponibili le relative funzioni.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end min-w-fit">
              <Button variant="outline" onClick={() => setIsOpen(true)} className="border-gray-300">
                Personalizza
              </Button>
              <Button variant="secondary" onClick={handleRejectAll} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                Rifiuta Tutti
              </Button>
              <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                Accetta Tutti
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Preferenze */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        // Se chiude il dialog senza salvare e non aveva già dato consenso, riapri banner?
        // In realtà UX standard è che se chiudi, torni al banner.
        // Ma Dialog di shadcn ha una X o clicca fuori.
        // Gestiamo che se chiude, il banner rimane visibile se non c'è consenso salvato.
      }}>
        <DialogContent className="sm:max-w-md z-[110]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-6 w-6 text-blue-600" />
              Preferenze Cookie
            </DialogTitle>
            <DialogDescription className="pt-2">
              Gestisci le tue preferenze sui cookie. Puoi modificare queste impostazioni in qualsiasi momento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-between space-x-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="space-y-1">
                <Label htmlFor="necessary" className="font-semibold text-base">Necessari</Label>
                <p className="text-sm text-gray-500">Essenziali per il funzionamento sicuro e corretto del sito.</p>
              </div>
              <Switch id="necessary" checked={true} disabled aria-label="Cookie necessari (sempre attivi)" />
            </div>
            
            <div className="flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="space-y-1">
                <Label htmlFor="analytics" className="font-semibold text-base cursor-pointer">Analitici</Label>
                <p className="text-sm text-gray-500">Ci aiutano a capire come interagisci con il sito per migliorarlo.</p>
              </div>
              <Switch 
                id="analytics" 
                checked={preferences.analytics} 
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                aria-label="Cookie analitici" 
              />
            </div>
            
            <div className="flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="space-y-1">
                <Label htmlFor="marketing" className="font-semibold text-base cursor-pointer">Marketing</Label>
                <p className="text-sm text-gray-500">Utilizzati per mostrati contenuti e annunci pertinenti.</p>
              </div>
              <Switch 
                id="marketing" 
                checked={preferences.marketing} 
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                aria-label="Cookie marketing" 
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 sm:justify-between">
            <Button variant="outline" onClick={handleRejectAll} className="w-full sm:w-auto text-gray-600">
              Rifiuta Tutti
            </Button>
            <Button onClick={handleSavePreferences} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Salva Preferenze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
