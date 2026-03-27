import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Camera, BarChart3, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiziPremium: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Hero */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Servizi Premium su Misura</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Soluzioni tecnologiche e professionali avanzate per valorizzare e proteggere il tuo patrimonio immobiliare.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl space-y-16">
          
          {/* Service 1: UAV */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-2xl shadow-xl border border-indigo-50">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 md:self-start">
              <Plane className="h-12 w-12 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Verifica Stato Tetto tramite UAV</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Ispezione professionale e sicura del tuo tetto utilizzando droni di ultima generazione. Tecnologia avanzata per una valutazione accurata senza rischi per le persone.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Rilevamento danni e usura</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Immagini termiche HD</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Report dettagliato 24-48h</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Mappatura 3D del tetto</span></div>
              </div>
            </div>
          </div>

          {/* Service 2: Foto */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-2xl shadow-xl border border-purple-50">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 md:self-start">
              <Camera className="h-12 w-12 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Valorizzazione con Book Fotografico</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Servizio fotografico professionale e virtual tour per presentare il tuo immobile sul mercato nella sua veste migliore, massimizzandone le potenzialità commerciali.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Fotografie professionali HD</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Riprese aeree con drone</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Virtual tour 360° interattivi</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Home staging digitale</span></div>
              </div>
            </div>
          </div>

          {/* Service 3: Patrimonio */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-2xl shadow-xl border border-green-50">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 md:self-start">
              <BarChart3 className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Valutazione per Patrimonio</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Analisi approfondita del valore del tuo patrimonio immobiliare basata su dati di mercato reali, essenziale per prendere decisioni di investimento consapevoli.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Perizia tecnica certificata</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Analisi comparativa reale</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Consulenza di ottimizzazione</span></div>
                <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" /> <span className="text-gray-700">Studi di fattibilità e ROI</span></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-16 px-4 bg-gray-900 text-white mt-auto">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Interessato a questi servizi esclusivi?</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
            Prenota subito una consulenza gratuita o contattami direttamente per discutere del tuo progetto immobiliare.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/prenotazione">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-6 px-8 shadow-xl">
                <Phone className="mr-3 h-6 w-6" />
                Prenota un Appuntamento
              </Button>
            </Link>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 text-gray-200 hover:text-white hover:bg-gray-800 font-bold text-lg py-6 px-8 h-auto">
              <a href="mailto:info@gemutcapital.com">
                <Mail className="mr-3 h-5 w-5" />
                Contattami via Email
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiziPremium;
