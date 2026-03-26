import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, Building, CheckCircle, Shield, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicRequests: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-white relative"
      style={{
        backgroundImage: 'url(/piazza-vicina.JPG)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay scuro per migliorare la leggibilità */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/client-access" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
              <LogIn className="h-4 w-4" />
              <span className="text-sm">Area Clienti</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section
        className="py-20 px-4 relative min-h-[400px] bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700"
        style={{
          backgroundImage: 'url(/padova-test.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto text-center relative z-10 bg-emerald-600/80 backdrop-blur-sm rounded-xl border border-emerald-400/30 py-12 px-8 mx-4 sm:mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4 animate-fade-in bg-white/90 text-emerald-700 border-emerald-200 font-medium">
            Richiesta Gratuita
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-6 animate-slide-up drop-shadow-lg">
            Invia la Tua Richiesta
          </h1>
          <p className="text-xl text-emerald-50 mb-8 max-w-3xl mx-auto animate-fade-in drop-shadow-md">
            Compila il questionario sottostante con le tue esigenze. Ti contatterò al più presto per offrirti
            una consulenza personalizzata.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2 text-sm text-emerald-700">
            <Shield className="h-4 w-4 text-lime-600" />
            <span>Dati Protetti via Google</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-emerald-700">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Consulenza Gratuita</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-emerald-700">
            <Phone className="h-4 w-4 text-teal-600" />
            <span>Risposta in 24h</span>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg border border-emerald-100 bg-white/95 backdrop-blur-sm overflow-hidden">
          <CardHeader className="text-center bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl text-emerald-900">
              <Send className="h-6 w-6 text-emerald-600" />
              <span>Questionario Conoscitivo</span>
            </CardTitle>
            <p className="text-emerald-600 mt-2">
              Rispondi ad alcune brevi domande per aiutarmi a capire come posso aiutarti al meglio.
            </p>
          </CardHeader>
          <CardContent className="p-0 sm:p-4 bg-white/50">
            <div className="w-full flex justify-center mt-4">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSfacSQW_0G2ehWjisIkiYiG8yip3MwHPa4fTrr2NqyjsRI5eg/viewform?embedded=true" 
                width="100%" 
                height="900" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0}
                className="w-full min-h-[900px] border-none rounded-lg"
                title="Google Form per le Richieste"
              >
                Caricamento del modulo...
              </iframe>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>Tel: 379 260 6775</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-emerald-600" />
              <span>P.IVA: 0555 8150 289</span>
            </div>
          </div>
          <div className="mt-4 mb-4">
            <a href="/privacy" className="text-sm text-gray-400 hover:text-emerald-700 transition-colors underline">
              Informativa Privacy
            </a>
          </div>
          <p className="text-sm text-gray-600">
            © 2025 Gemüt Capital - Consulente Immobiliare. I tuoi dati sono protetti e utilizzati solo per contattarti riguardo la tua richiesta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicRequests;