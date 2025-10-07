import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { 
  ArrowLeft, 
  Key, 
  FileText, 
  Shield, 
  Users, 
  CheckCircle, 
  Phone, 
  Mail,
  Building,
  Euro,
  Clock,
  MapPin,
  Star,
  Calculator,
  Home,
  Search,
  UserCheck,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Locazioni: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Back Button */}
      <BackButton to="/" label="Home" />
      
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-600">Torna alla Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Servizi di Locazione
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Trova l'inquilino perfetto per la tua proprietà o la casa ideale in affitto. 
            Gestisco ogni aspetto della locazione con professionalità e trasparenza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                <Search className="mr-2 h-5 w-5" />
                Cerca Casa in Affitto
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="mr-2 h-5 w-5" />
              Affitta la Tua Casa
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">I Miei Servizi di Locazione</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Supporto completo sia per proprietari che per inquilini, con gestione professionale di ogni fase
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Ricerca Immobili</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Aiuto gli inquilini a trovare la casa perfetta in base alle loro esigenze e budget
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Selezione Inquilini</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Verifica accurata dei potenziali inquilini per garantire affidabilità e solvibilità
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Contratti e Documenti</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Redazione di contratti conformi alla legge e gestione di tutta la documentazione
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Gestione Rapporti</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Mediazione tra proprietario e inquilino per una locazione serena e duratura
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Owners */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Per Proprietari</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Massimizza il rendimento della tua proprietà con inquilini selezionati e affidabili
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold">Valutazione Canone</h3>
              </div>
              <p className="text-gray-600">
                Analisi del mercato locale per stabilire il canone di locazione ottimale che garantisce competitività e redditività.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold">Marketing Immobile</h3>
              </div>
              <p className="text-gray-600">
                Promozione dell'immobile sui principali portali e attraverso la mia rete professionale per trovare inquilini qualificati.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold">Screening Inquilini</h3>
              </div>
              <p className="text-gray-600">
                Verifica approfondita di reddito, referenze e storico creditizio per selezionare solo inquilini affidabili.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <h3 className="text-lg font-semibold">Contratto di Locazione</h3>
              </div>
              <p className="text-gray-600">
                Redazione di contratti conformi alla normativa vigente con tutte le clausole necessarie per tutelare i tuoi interessi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <h3 className="text-lg font-semibold">Gestione Rapporti</h3>
              </div>
              <p className="text-gray-600">
                Supporto continuo nella gestione del rapporto locativo, dalla consegna delle chiavi alle eventuali problematiche.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  6
                </div>
                <h3 className="text-lg font-semibold">Assistenza Legale</h3>
              </div>
              <p className="text-gray-600">
                Consulenza per questioni legali, rinnovi contrattuali e gestione di eventuali controversie con gli inquilini.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Tenants */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Per Inquilini</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trova la casa perfetta per le tue esigenze con un servizio personalizzato e professionale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Ricerca Personalizzata</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ascolto le tue esigenze specifiche per trovare immobili che corrispondano perfettamente alle tue necessità
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Analisi del budget disponibile</li>
                  <li>• Ricerca per zona preferita</li>
                  <li>• Selezione per caratteristiche</li>
                  <li>• Visite organizzate</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Supporto Documentale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ti aiuto nella preparazione di tutta la documentazione necessaria per la locazione
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Preparazione dossier inquilino</li>
                  <li>• Verifica contratto di locazione</li>
                  <li>• Assistenza per deposito cauzionale</li>
                  <li>• Gestione pratiche burocratiche</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Negoziazione</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Mediazione con il proprietario per ottenere le migliori condizioni contrattuali
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Negoziazione canone di locazione</li>
                  <li>• Discussione clausole contrattuali</li>
                  <li>• Accordi su spese condominiali</li>
                  <li>• Tempistiche di consegna</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Tutela Inquilino</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Protezione dei tuoi diritti durante tutto il periodo di locazione
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Verifica conformità immobile</li>
                  <li>• Controllo clausole contrattuali</li>
                  <li>• Assistenza per problematiche</li>
                  <li>• Supporto per rinnovi</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perché Scegliere i Miei Servizi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Esperienza e professionalità per una locazione senza stress e problemi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Esperienza Consolidata</h3>
                <p className="text-gray-600">
                  Anni di esperienza nel settore delle locazioni con centinaia di contratti gestiti con successo.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Selezione Accurata</h3>
                <p className="text-gray-600">
                  Processo di screening rigoroso per garantire inquilini affidabili e solvibili ai proprietari.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contratti Sicuri</h3>
                <p className="text-gray-600">
                  Redazione di contratti conformi alla normativa vigente per tutelare entrambe le parti.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Supporto Continuo</h3>
                <p className="text-gray-600">
                  Assistenza durante tutto il periodo di locazione per risolvere qualsiasi problematica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Hai Bisogno di Servizi di Locazione?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Contattami per una consulenza gratuita sui tuoi progetti di locazione
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                <Search className="mr-2 h-5 w-5" />
                Cerca Casa in Affitto
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
              <Phone className="mr-2 h-5 w-5" />
              Chiamami: 379 260 6775
            </Button>
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
            © 2024 Filippo Marcuzzo - Consulente Immobiliare. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Locazioni;