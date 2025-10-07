import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  TrendingUp, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  ArrowRight,
  Building,
  Key,
  Search,
  FileText,
  Calculator,
  ChevronDown,
  ChevronUp,
  Plane,
  Camera,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const [showAboutSection, setShowAboutSection] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Filippo Marcuzzo</h1>
            </div>
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
            Consulente Immobiliare Professionale
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-6 animate-slide-up drop-shadow-lg">
            Il Tuo Partner Immobiliare
            <span className="text-blue-300"> di Fiducia</span>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">I Miei Servizi</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Offro un servizio completo e personalizzato per ogni tua esigenza immobiliare
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/acquisto-casa" className="block">
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-50/50 active:scale-100 active:bg-blue-100/30 translucent-button cursor-pointer h-full border-2 hover:border-blue-200 active:border-blue-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 hover:bg-blue-200 transition-colors duration-200">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    Acquisto<br />Casa
                    <ArrowRight className="h-4 w-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-1" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ti aiuto a trovare la casa perfetta per le tue esigenze, gestendo ogni aspetto della trattativa.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Ricerca personalizzata</li>
                    <li>• Valutazione immobili</li>
                    <li>• Assistenza mutui</li>
                    <li>• Supporto legale</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link to="/vendita-immobili" className="block">
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-50/50 active:scale-100 active:bg-green-100/30 translucent-button cursor-pointer h-full border-2 hover:border-green-200 active:border-green-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 hover:bg-green-200 transition-colors duration-200">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    Vendita Immobili
                    <ArrowRight className="h-4 w-4 text-green-600 transition-transform duration-200 group-hover:translate-x-1" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Massimizza il valore della tua proprietà con strategie di marketing innovative.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Valutazione gratuita</li>
                    <li>• Marketing digitale</li>
                    <li>• Fotografia professionale</li>
                    <li>• Gestione visite</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link to="/locazioni" className="block">
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-purple-50/50 active:scale-100 active:bg-purple-100/30 translucent-button cursor-pointer h-full border-2 hover:border-purple-200 active:border-purple-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 hover:bg-purple-200 transition-colors duration-200">
                    <Key className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    Locazioni
                    <ArrowRight className="h-4 w-4 text-purple-600 transition-transform duration-200 group-hover:translate-x-1" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Servizi completi per affitti, sia per proprietari che per inquilini.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Gestione contratti</li>
                    <li>• Selezione inquilini</li>
                    <li>• Amministrazione</li>
                    <li>• Consulenza fiscale</li>
                  </ul>
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
        <section className="py-20 px-4 bg-white animate-in slide-in-from-top duration-500">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Image and Stats */}
                <div className="relative">
                  <div className="relative">
                    <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Users className="h-16 w-16 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Filippo Marcuzzo</h4>
                        <p className="text-blue-600 font-semibold">Consulente Immobiliare</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - About Content */}
                <div className="space-y-6">
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
                      Sono <strong className="text-gray-900">Filippo Marcuzzo</strong>, consulente immobiliare con oltre 10 anni di esperienza nel settore. 
                      La mia passione per il real estate nasce dalla convinzione che ogni persona meriti di trovare la casa perfetta per le proprie esigenze.
                    </p>
                    
                    <p>
                      Nel corso della mia carriera ho accompagnato centinaia di famiglie e investitori nel loro percorso immobiliare, 
                      dalla ricerca della prima casa agli investimenti più complessi. La mia filosofia si basa su tre pilastri fondamentali: 
                      <strong className="text-gray-900">trasparenza, professionalità e risultati concreti</strong>.
                    </p>
                    
                    <p>
                      Grazie alla mia profonda conoscenza del mercato locale e alle partnership consolidate con i migliori professionisti del settore 
                      (notai, avvocati, commercialisti), posso offrirti un servizio completo e personalizzato per ogni tua esigenza immobiliare.
                    </p>
                  </div>

                  {/* Credentials */}
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Certificato</div>
                        <div className="text-sm text-gray-600">Agente Immobiliare</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Star className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Specializzato</div>
                        <div className="text-sm text-gray-600">Mercato Residenziale</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Esperto in</div>
                        <div className="text-sm text-gray-600">Valutazioni Immobiliari</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Membro</div>
                        <div className="text-sm text-gray-600">FIAIP Nazionale</div>
                      </div>
                    </div>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Perché Scegliermi</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La mia esperienza e dedizione fanno la differenza nel tuo percorso immobiliare
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Risultati Garantiti</h4>
              <p className="text-sm text-gray-600">Focus sui risultati e soddisfazione del cliente</p>
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
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-indigo-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-indigo-200 transition-colors duration-200">
                  <Plane className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Verifica Stato Tetto tramite UAV</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Ispezione professionale del tetto utilizzando droni di ultima generazione per una valutazione accurata e sicura.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Rilevamento danni e usura</li>
                  <li>• Documentazione fotografica HD</li>
                  <li>• Report dettagliato dello stato</li>
                  <li>• Preventivi per eventuali riparazioni</li>
                </ul>
              </CardContent>
            </Card>

            {/* Property Valorization with Photo Book */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-purple-200 transition-colors duration-200">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Valorizzazione con Book Fotografico</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Servizio fotografico professionale per valorizzare al massimo il tuo immobile e aumentarne l'appeal commerciale.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Fotografie professionali HD</li>
                  <li>• Riprese aeree con drone</li>
                  <li>• Virtual tour 360°</li>
                  <li>• Home staging digitale</li>
                </ul>
              </CardContent>
            </Card>

            {/* Patrimony Evaluation */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-green-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-green-200 transition-colors duration-200">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Valutazione per Patrimonio</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Analisi approfondita del valore del tuo patrimonio immobiliare per decisioni di investimento consapevoli.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Perizia tecnica certificata</li>
                  <li>• Analisi di mercato comparativa</li>
                  <li>• Consulenza fiscale specializzata</li>
                  <li>• Strategie di ottimizzazione</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA for Custom Services */}
          <div className="text-center mt-12">
            <Link to="/servizi-personalizzati">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
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
            <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Telefono</h4>
              <p className="text-gray-600">379 260 6775</p>
            </div>
            
            <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-gray-600">info@filippomarcuzzo.com</p>
            </div>
            
            <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Ufficio</h4>
              <p className="text-gray-600">Indirizzo ufficio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-6 w-6" />
            <span className="text-lg font-semibold">Filippo Marcuzzo</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Tel: 379 260 6775</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>P.IVA: 0555 8150 289</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Filippo Marcuzzo - Consulente Immobiliare. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;