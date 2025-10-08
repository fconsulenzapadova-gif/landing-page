import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { 
  ArrowLeft, 
  TrendingUp, 
  Home, 
  Camera, 
  FileText, 
  Users, 
  CheckCircle, 
  Phone, 
  Mail,
  Building,
  Euro,
  Clock,
  MapPin,
  Star,
  Eye,
  Globe,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VenditaImmobili: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Back Button */}
      <BackButton to="/" label="Home" />
      
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-600">Torna alla Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight whitespace-nowrap">
            Vendita Immobili
          </h1>
          <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
            Massimizza il valore della tua proprietà con strategie di marketing innovative e un approccio 
            professionale che garantisce risultati concreti in tempi ottimali.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=vendita">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50">
                <BarChart3 className="mr-2 h-5 w-5" />
                Valutazione Gratuita
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Mail className="mr-2 h-5 w-5" />
              Contattami Ora
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Come Valorizzo il Tuo Immobile</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un approccio strategico e professionale per vendere al miglior prezzo nel minor tempo possibile
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Valutazione Gratuita</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Analisi approfondita del mercato per determinare il prezzo ottimale del tuo immobile
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Marketing Digitale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Promozione su tutti i principali portali immobiliari e social media per massima visibilità
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Fotografia Professionale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Servizio fotografico di alta qualità per valorizzare al meglio ogni ambiente
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Gestione Visite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Organizzazione e accompagnamento di tutte le visite con potenziali acquirenti qualificati
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Process */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Il Mio Processo di Vendita</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un metodo collaudato in 6 fasi per garantire il successo della vendita
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold">Valutazione Immobile</h3>
              </div>
              <p className="text-gray-600">
                Sopralluogo gratuito e analisi comparativa del mercato per stabilire il prezzo di vendita ottimale.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold">Preparazione Immobile</h3>
              </div>
              <p className="text-gray-600">
                Consigli per valorizzare l'immobile e servizio fotografico professionale per la promozione.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold">Marketing e Promozione</h3>
              </div>
              <p className="text-gray-600">
                Pubblicazione su tutti i portali immobiliari e promozione attraverso i miei canali digitali.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <h3 className="text-lg font-semibold">Selezione Acquirenti</h3>
              </div>
              <p className="text-gray-600">
                Qualificazione dei potenziali acquirenti e organizzazione delle visite in base alle loro esigenze.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <h3 className="text-lg font-semibold">Negoziazione</h3>
              </div>
              <p className="text-gray-600">
                Gestione delle trattative per ottenere le migliori condizioni di vendita e tempi di chiusura.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  6
                </div>
                <h3 className="text-lg font-semibold">Chiusura Vendita</h3>
              </div>
              <p className="text-gray-600">
                Assistenza completa fino al rogito, gestendo tutta la documentazione necessaria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Strategy */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">La Mia Strategia di Marketing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Utilizzo tutti i canali disponibili per garantire la massima visibilità al tuo immobile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Portali Immobiliari</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Pubblicazione su tutti i principali siti immobiliari italiani
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Immobiliare.it</li>
                  <li>• Casa.it</li>
                  <li>• Idealista</li>
                  <li>• Subito.it</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Contenuti Visual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Materiale fotografico e video di alta qualità
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Fotografie professionali</li>
                  <li>• Virtual tour 360°</li>
                  <li>• Video promozionali</li>
                  <li>• Planimetrie dettagliate</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Network Professionale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Sfrutto la mia rete di contatti per trovare acquirenti
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Database clienti</li>
                  <li>• Colleghi agenti</li>
                  <li>• Social media</li>
                  <li>• Passaparola</li>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perché Affidarti a Me</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La mia esperienza e dedizione per ottenere il miglior risultato dalla vendita del tuo immobile
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Valutazione Accurata</h3>
                <p className="text-gray-600">
                  Utilizzo analisi comparative di mercato per stabilire il prezzo giusto che garantisce una vendita rapida.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Marketing Professionale</h3>
                <p className="text-gray-600">
                  Servizio fotografico incluso e promozione su tutti i canali digitali per massima visibilità.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Gestione Completa</h3>
                <p className="text-gray-600">
                  Mi occupo di tutto: dalle visite alla documentazione, fino alla firma del contratto definitivo.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tempi Ottimizzati</h3>
                <p className="text-gray-600">
                  Strategia mirata per vendere nel minor tempo possibile, evitando lunghe attese sul mercato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto a Vendere al Miglior Prezzo?</h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Richiedi subito una valutazione gratuita del tuo immobile
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=vendita">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50">
                <BarChart3 className="mr-2 h-5 w-5" />
                Valutazione Gratuita
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
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
            © 2025 Filippo Marcuzzo - Consulente Immobiliare. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VenditaImmobili;