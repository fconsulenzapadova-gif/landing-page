import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Calculator, 
  FileText, 
  Shield, 
  CheckCircle, 
  Phone, 
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AcquistoCasa: React.FC = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const email = "info@gemutcapital.com";

  const handleContactClick = () => {
    setShowEmail(true);
    setTimeout(() => setShowEmail(false), 4000); // Torna al testo originale dopo 4 secondi
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 1500);
    } catch (err) {
      console.error('Errore nel copiare l\'email:', err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/foto-cortina.JPG")' }}
      >
        <div className="absolute inset-0 bg-slate-950/45" />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-white">
        <div className="container mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight whitespace-nowrap">
            Acquisto Casa
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Ti accompagno in ogni fase dell'acquisto della tua casa dei sogni, dalla ricerca alla firma del contratto, 
            garantendoti professionalità e trasparenza in ogni momento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/richieste?type=acquisto">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Consulenza Gratuita
              </Link>
            </Button>
            <div className="relative">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative"
                onClick={handleContactClick}
              >
                <div className="flex items-center justify-center relative">
                  <div className={`flex items-center transition-all duration-500 ${showEmail ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    Contattaci Ora
                  </div>
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${showEmail ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium truncate max-w-[180px]">{email}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyEmail();
                        }}
                        className="h-6 w-6 p-0 hover:bg-blue-500/20 ml-1"
                      >
                        {emailCopied ? (
                          <Check className="h-3 w-3 text-green-300" />
                        ) : (
                          <Copy className="h-3 w-3 text-white/80" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 bg-white/75 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg px-6 py-7 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Come Ti Aiuto nell'Acquisto</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un servizio completo e personalizzato per trovare e acquistare la casa perfetta per te
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Ricerca Personalizzata</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Analizzo le tue esigenze e cerco immobili che corrispondono perfettamente ai tuoi criteri
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Valutazione Immobili</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Verifichiamo il valore di mercato e ti aiutiamo a fare l'offerta giusta al momento giusto
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Supporto Legale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Controllo tutta la documentazione e ti assisto fino alla firma del contratto definitivo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </div>

      {/* Detailed Process */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Il Nostro Metodo di Lavoro</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un processo strutturato in 6 fasi per garantirti il miglior risultato
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold">Consulenza Iniziale</h3>
              </div>
              <p className="text-gray-600">
                Analizziamo insieme le tue esigenze, il budget disponibile e definiamo i criteri di ricerca ideali per te.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold">Ricerca Attiva</h3>
              </div>
              <p className="text-gray-600">
                Utilizziamo il nostro network e le migliori piattaforme per trovare immobili che corrispondono ai tuoi parametri.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold">Visite Guidate</h3>
              </div>
              <p className="text-gray-600">
                Ti accompagno nelle visite, evidenziando pregi e difetti di ogni immobile per aiutarti nella scelta.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <h3 className="text-lg font-semibold">Negoziazione</h3>
              </div>
              <p className="text-gray-600">
                Gestisco la trattativa per ottenere le migliori condizioni di prezzo e tempi di consegna.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <h3 className="text-lg font-semibold">Pratiche Burocratiche</h3>
              </div>
              <p className="text-gray-600">
                Mi occupo di tutta la documentazione necessaria, dai controlli catastali alle verifiche ipotecarie.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  6
                </div>
                <h3 className="text-lg font-semibold">Rogito</h3>
              </div>
              <p className="text-gray-600">
                Ti assisto fino alla firma del contratto definitivo, garantendo che tutto sia in regola.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perché Sceglierci</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La nostra esperienza e dedizione al tuo servizio per un acquisto senza stress
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Esperienza Consolidata</h3>
                <p className="text-gray-600">
                  Anni di esperienza nel mercato immobiliare di Padova e provincia, con centinaia di transazioni completate con successo.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Consulenza Gratuita</h3>
                <p className="text-gray-600">
                  La prima consulenza è sempre gratuita e senza impegno. Valutiamo insieme le tue esigenze e il budget disponibile.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Network Esclusivo</h3>
                <p className="text-gray-600">
                  Accesso a immobili non ancora sul mercato grazie alla nostra rete di contatti con proprietari e colleghi.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Assistenza Completa</h3>
                <p className="text-gray-600">
                  Ti seguo in ogni fase, dalla ricerca al rogito, garantendoti supporto costante e professionale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto a Trovare la Tua Casa Ideale?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Contattaci oggi stesso per una consulenza gratuita e personalizzata
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=acquisto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                <FileText className="mr-2 h-5 w-5" />
                Invia la Tua Richiesta
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Phone className="mr-2 h-5 w-5" />
              Chiamaci: 379 260 6775
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AcquistoCasa;
