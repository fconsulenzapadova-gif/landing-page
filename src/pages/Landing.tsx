import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  ArrowRight,
  Key,
  Search,
  FileText,
  ChevronDown,
  ChevronUp,
  Plane,
  Camera,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const [showAboutSection, setShowAboutSection] = useState(false);
  const aboutTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAboutSection) return;

    const scrollTimer = window.setTimeout(() => {
      aboutTextRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);

    return () => window.clearTimeout(scrollTimer);
  }, [showAboutSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="relative z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900">Gemüt Capital</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-20 px-4 relative min-h-[500px]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/prato-padova.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-4 animate-fade-in">
            agenzia di mediazione immobiliare
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-6 animate-slide-up drop-shadow-lg sm:text-5xl">
            Il Tuo Partner Immobiliare di Fiducia
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto animate-fade-in drop-shadow-md">
            Esperienza, professionalità e tecnologia al servizio delle tue esigenze immobiliari.
            Trova la casa dei tuoi sogni o vendi al miglior prezzo con il supporto di un esperto.
          </p>

        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">I Nostri Servizi</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un servizio completo e personalizzato per ogni esigenza immobiliare
            </p>
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-sky-100 bg-sky-50/80 px-6 py-5 text-left text-sm leading-relaxed text-slate-700 shadow-sm backdrop-blur-sm sm:text-center">
              Il termine tedesco Gemüt indica l'animo, lo spirito o l'indole di una persona. Più
              nello specifico, rappresenta la sfera emotiva, il cuore o il temperamento intesi come
              sede dei sentimenti.
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/acquisto-casa" className="block">
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-blue-50/50 active:scale-100 active:bg-blue-100/30 translucent-button cursor-pointer h-full border-2 hover:border-blue-200 active:border-blue-300 flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 hover:bg-blue-200 transition-colors duration-200">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-center whitespace-nowrap">
                    Acquisto Casa
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 items-start justify-center text-center">
                  <p className="text-gray-600">
                    Ti aiuto a trovare la casa perfetta per le tue esigenze, gestendo ogni aspetto della trattativa.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/vendita-immobili" className="block">
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-green-50/50 active:scale-100 active:bg-green-100/30 translucent-button cursor-pointer h-full border-2 hover:border-green-200 active:border-green-300 flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 hover:bg-green-200 transition-colors duration-200">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-center">
                    Vendita Immobili
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 items-start justify-center text-center">
                  <p className="text-gray-600">
                    Massimizza il valore della tua proprietà con strategie di marketing innovative.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/locazioni" className="block">
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-purple-50/50 active:scale-100 active:bg-purple-100/30 translucent-button cursor-pointer h-full border-2 hover:border-purple-200 active:border-purple-300 flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 hover:bg-purple-200 transition-colors duration-200">
                    <Key className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-center">
                    Locazioni
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 items-start justify-center text-center">
                  <p className="text-gray-600">
                    Servizi completi per affitti, sia per proprietari che per inquilini.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Chi Sono Io Toggle Button */}
      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto text-center">
          <Button
            onClick={() => setShowAboutSection(!showAboutSection)}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Users className="mr-2 h-5 w-5" />
            {showAboutSection ? 'Nascondi Chi Sono Io' : 'Scopri Chi Sono Io'}
            {showAboutSection ? (
              <ChevronUp className="ml-2 h-5 w-5" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5" />
            )}
          </Button>
        </div>
      </section>

      {/* Chi Sono Io Section - Collapsible */}
      {showAboutSection && (
        <section className="py-20 px-4 bg-white animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Image and Stats */}
                <div className="relative">
                  <div className="relative">
                    <div className="w-full h-96 flex items-center justify-center">
                      <img 
                        src="/profile.jpg" 
                        alt="Filippo Marcuzzo" 
                        className="h-full w-auto max-w-full rounded-2xl shadow-lg object-contain transition-transform duration-500 hover:scale-105" 
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - About Content */}
                <div
                  ref={aboutTextRef}
                  className="space-y-6 scroll-mt-24 transition-all duration-700 ease-out"
                >
                  <div>
                    <Badge variant="secondary" className="mb-4">
                      Chi Sono Io
                    </Badge>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">
                      La Tua Guida nel Mondo
                      <span className="text-blue-600"> Immobiliare</span>
                    </h3>
                  </div>

                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p className="text-lg">
                      Sono <strong className="text-gray-900">Filippo Marcuzzo</strong>, mediatore immobiliare abilitato, specializzato in operazioni di investimento e valorizzazione patrimoniale nel mercato di Padova e provincia.
                    </p>
                    
                    <p>
                      La mia attività nasce da una visione chiara: trasformare ogni immobile in un'opportunità strategica, capace di generare rendimento, valore e crescita nel tempo.
                    </p>
                    
                    <p>
                      Collaboro con investitori privati, professionisti e società nella ricerca, acquisizione e gestione di asset immobiliari residenziali e commerciali, seguendo ogni fase del processo — dall'analisi preliminare fino alla rivendita o alla messa a reddito.
                    </p>
                    
                    <p>
                      Il mio approccio si basa su analisi di mercato accurate, strategie personalizzate e gestione trasparente delle trattative, con l'obiettivo di ottimizzare il ritorno sull'investimento e minimizzare i rischi operativi e fiscali.
                    </p>
                    
                    <p>
                      Grazie a una rete consolidata di professionisti qualificati — notai, tecnici, avvocati e consulenti fiscali — offro un servizio completo, integrato e strutturato, capace di adattarsi a ogni esigenza, dall'investitore privato fino alle realtà corporate.
                    </p>
                    
                    <p>
                      Credo che l'investimento immobiliare debba essere gestito con metodo, visione e competenza. Per questo accompagno i miei clienti in percorsi di crescita patrimoniale consapevoli, fondati su strategia, solidità e risultati misurabili.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link to="/richieste?type=acquisto">
                        <Phone className="mr-2 h-5 w-5" />
                        Parliamone Insieme
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Me Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Perché Sceglierci</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La mia esperienza e dedizione fanno la differenza nel tuo percorso immobiliare
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Esperienza Consolidata</h4>
              <p className="text-sm text-gray-600">Anni di esperienza nel settore immobiliare</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Massima Trasparenza</h4>
              <p className="text-sm text-gray-600">Comunicazione chiara e onesta in ogni fase</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Servizio Personalizzato</h4>
              <p className="text-sm text-gray-600">Ogni cliente è unico e merita attenzione dedicata</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="font-semibold mb-2">Rete Professionale Consolidata</h4>
              <p className="text-sm text-gray-600">Collaborazioni attive con studi notarili, legali e commercialisti di fiducia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servizi su Misura Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Servizi su Misura</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Soluzioni innovative e personalizzate per valorizzare al meglio il tuo patrimonio immobiliare
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* UAV Roof Inspection */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-indigo-200 bg-white/80 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-indigo-200 transition-colors duration-200">
                  <Plane className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Verifica Stato Tetto tramite UAV</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-col flex-1">
                <p className="text-gray-600 mb-6 flex-1">
                  Ispezione professionale del tetto utilizzando droni di ultima generazione per una valutazione accurata e sicura.
                </p>
                <Link to="/verifica-stato-tetto/" className="mt-auto">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Scopri di Più
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Property Valorization with Photo Book */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200 bg-white/80 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-purple-200 transition-colors duration-200">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Valorizzazione con Book Fotografico</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-col flex-1">
                <p className="text-gray-600 mb-6 flex-1">
                  Servizio fotografico professionale per valorizzare al massimo il tuo immobile e aumentarne l'appeal commerciale.
                </p>
                <Link to="/valorizzazione-book-fotografico/" className="mt-auto">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Scopri di Più
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Patrimony Evaluation */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-green-200 bg-white/80 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-green-200 transition-colors duration-200">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Valutazione per Patrimonio</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-col flex-1">
                <p className="text-gray-600 mb-6 flex-1">
                  Analisi approfondita del valore del tuo patrimonio immobiliare per decisioni di investimento consapevoli.
                </p>
                <Link to="/valutazione-patrimonio/" className="mt-auto">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Scopri di Più
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* CTA for Custom Services */}
          <div className="text-center mt-12">
            <Link to="/servizi-personalizzati" className="inline-flex max-w-full">
              <Button size="lg" className="h-auto max-w-full whitespace-normal bg-indigo-600 py-3 text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl">
                <FileText className="mr-2 h-5 w-5" />
                Richiedi un Servizio Personalizzato
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto a Iniziare?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Contattami oggi stesso per una consulenza gratuita e personalizzata
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=acquisto">
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 hover:text-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
              >
                <FileText className="mr-2 h-5 w-5" />
                Invia la Tua Richiesta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Contatti</h3>
            <p className="text-gray-600">Sono sempre disponibile per rispondere alle tue domande</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a 
              href="https://wa.me/393792606775" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center hover:scale-105 transition-all duration-300 cursor-pointer" 
              aria-label="Contattami su WhatsApp"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">WhatsApp</h4>
              <p className="text-gray-600">379 260 6775</p>
            </a>
            
            <a 
              href="mailto:info@gemutcapital.com"
              className="block text-center hover:scale-105 transition-all duration-300 cursor-pointer" 
              aria-label="Invia email a info@gemutcapital.com"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-gray-600">info@gemutcapital.com</p>
            </a>
            
            <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer" role="button" tabIndex={0} aria-label="Informazioni ufficio">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Ufficio</h4>
              <p className="text-gray-600">Indirizzo ufficio</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
