import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { 
  BarChart3, 
  Calculator, 
  FileText, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  Phone, 
  Mail,
  PieChart,
  Building,
  Euro,
  Scale,
  Award,
  Clock,
  Users,
  Target,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DettaglioValutazionePatrimonio: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <BackButton to="/" />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/sfondo-patrimoni.jpg)' }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Valutazione per Patrimonio
          </h1>
          <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
            Analisi approfondita e certificata del valore del tuo patrimonio immobiliare. 
            Perizie tecniche professionali per decisioni di investimento consapevoli.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=valutazione-patrimonio">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Valutazione
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quando Serve una Valutazione */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quando Serve una Valutazione Professionale</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Una valutazione certificata è essenziale in molte situazioni legali, fiscali e di investimento
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Successioni Ereditarie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Valutazione ufficiale per dichiarazioni di successione, divisioni ereditarie e pratiche notarili.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Euro className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Separazioni e Divorzi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Perizie per la divisione dei beni coniugali e determinazione degli assegni di mantenimento.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Investimenti Immobiliari</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Analisi di redditività e potenziale di crescita per decisioni di acquisto o vendita strategiche.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Bilanci Aziendali</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Valutazione del patrimonio immobiliare aziendale per bilanci, fusioni e acquisizioni.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Assicurazioni</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Determinazione del valore assicurabile e gestione di sinistri e risarcimenti danni.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Espropri e CTU</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Perizie per espropri, contenziosi legali e consulenze tecniche d'ufficio presso i tribunali.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Metodologie di Valutazione */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Metodologie di Valutazione Utilizzate</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Approcci scientifici e riconosciuti internazionalmente per garantire valutazioni accurate e difendibili
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-green-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Metodo Comparativo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Analisi dei prezzi di mercato di immobili simili venduti di recente nella stessa zona.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Ricerca transazioni comparabili</li>
                  <li>• Analisi delle differenze qualitative</li>
                  <li>• Correzioni per caratteristiche specifiche</li>
                  <li>• Validazione statistica dei dati</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Metodo Reddituale</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Valutazione basata sulla capacità di generare reddito dell'immobile nel tempo.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Analisi dei canoni di locazione</li>
                  <li>• Calcolo del rendimento netto</li>
                  <li>• Determinazione del tasso di capitalizzazione</li>
                  <li>• Proiezioni future dei flussi di cassa</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Metodo del Costo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Stima basata sul costo di ricostruzione dell'immobile al netto del deprezzamento.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Calcolo costo di ricostruzione</li>
                  <li>• Valutazione del terreno</li>
                  <li>• Deprezzamento fisico e funzionale</li>
                  <li>• Obsolescenza economica</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cosa Include la Perizia */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cosa Include la Perizia di Valutazione</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Documentazione Tecnica
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Relazione tecnica dettagliata</li>
                  <li>• Planimetrie e rilievi dimensionali</li>
                  <li>• Documentazione fotografica completa</li>
                  <li>• Analisi dello stato di conservazione</li>
                  <li>• Verifica conformità urbanistica</li>
                  <li>• Certificazioni energetiche e impianti</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Analisi di Mercato
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Studio del mercato immobiliare locale</li>
                  <li>• Analisi delle transazioni comparabili</li>
                  <li>• Trend di mercato e previsioni</li>
                  <li>• Posizionamento competitivo</li>
                  <li>• Fattori di influenza del valore</li>
                  <li>• Raccomandazioni strategiche</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Certificazione Professionale</h3>
                    <p className="text-gray-600 text-sm">
                      Perizia firmata e timbrata da tecnico abilitato, valida per tutti gli usi legali e fiscali.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tempi di Consegna</h3>
                    <p className="text-gray-600 text-sm">
                      Perizia completa consegnata entro 7-10 giorni lavorativi dal sopralluogo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Supporto Post-Perizia</h3>
                    <p className="text-gray-600 text-sm">
                      Assistenza per chiarimenti, aggiornamenti e supporto in eventuali contenziosi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifiche e Competenze */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Qualifiche e Competenze</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Formazione specialistica e esperienza consolidata nel settore delle valutazioni immobiliari
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Formazione Specialistica</h3>
              <p className="text-gray-600 text-sm">
                Corsi di specializzazione in valutazione immobiliare e estimo presso enti riconosciuti.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Certificazioni</h3>
              <p className="text-gray-600 text-sm">
                Iscrizione all'albo professionale e certificazioni per perizie giudiziarie.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Esperienza Legale</h3>
              <p className="text-gray-600 text-sm">
                Consulente tecnico d'ufficio presso tribunali per contenziosi immobiliari.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Aggiornamento Continuo</h3>
              <p className="text-gray-600 text-sm">
                Formazione continua su normative, mercato e metodologie di valutazione.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Hai Bisogno di una Valutazione Professionale?</h2>
          <p className="text-xl mb-10 text-green-100 font-medium max-w-2xl mx-auto drop-shadow-md">
            Contattami per un preventivo personalizzato e scopri il valore reale del tuo patrimonio immobiliare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=valutazione-patrimonio">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50 font-bold text-lg py-4 px-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white">
                <BarChart3 className="mr-2 h-5 w-5" />
                Richiedi Valutazione
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 px-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <Mail className="mr-2 h-5 w-5" />
              Chiamami: 379 260 6775
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DettaglioValutazionePatrimonio;