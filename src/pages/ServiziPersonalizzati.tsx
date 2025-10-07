import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { 
  ArrowLeft, 
  Settings, 
  Home, 
  Calculator, 
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
  Plane,
  Target,
  Lightbulb,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiziPersonalizzati: React.FC = () => {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/strada-verde.JPG)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      {/* Back Button */}
      <div className="relative z-10">
        <BackButton to="/" label="Home" />
      </div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5 text-lime-600" />
              <span className="font-medium text-lime-600">Torna alla Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-lime-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Servizi Personalizzati
          </h1>
          <p className="text-xl mb-8 text-lime-100 max-w-3xl mx-auto">
            Soluzioni su misura per le tue esigenze immobiliari specifiche. 
            Ogni situazione è unica e merita un approccio personalizzato e professionale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=personalizzato">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-lime-600 hover:bg-lime-50">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Consulenza Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">I Miei Servizi Personalizzati</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ogni cliente ha esigenze diverse. Ecco come posso aiutarti con soluzioni su misura
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-lime-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-lime-600" />
                </div>
                <CardTitle className="text-lg">Ricerca Mirata</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Ricerca di immobili con caratteristiche molto specifiche, anche fuori mercato o in zone particolari
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-emerald-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Analisi Investimenti</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Valutazione della redditività di investimenti immobiliari e analisi del mercato locale
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-teal-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Verifica Tetto con UAV</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Ispezioni aeree professionali con droni per verifiche strutturali e documentazione fotografica dettagliata
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-lime-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-lime-600" />
                </div>
                <CardTitle className="text-lg">Due Diligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Verifiche approfondite su immobili complessi, controlli legali e urbanistici dettagliati
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-emerald-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Strategie di Vendita</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Piani di marketing personalizzati per massimizzare il valore e ridurre i tempi di vendita
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-teal-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Consulenza Familiare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Soluzioni per situazioni familiari complesse: successioni, divisioni, passaggi generazionali
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Come Lavoro sui Progetti Personalizzati</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Un approccio metodico e su misura per ogni situazione
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-lime-500">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-lime-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold">Analisi Approfondita</h3>
              </div>
              <p className="text-gray-600">
                Studio dettagliato delle tue esigenze specifiche e del contesto di mercato.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-emerald-500">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold">Strategia Personalizzata</h3>
              </div>
              <p className="text-gray-600">
                Sviluppo di un piano d'azione specifico per raggiungere i tuoi obiettivi.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-teal-500">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold">Implementazione</h3>
              </div>
              <p className="text-gray-600">
                Esecuzione del piano con monitoraggio costante e aggiustamenti in corso d'opera.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-lime-500">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-lime-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <h3 className="text-lg font-semibold">Risultati</h3>
              </div>
              <p className="text-gray-600">
                Raggiungimento degli obiettivi con supporto post-vendita e follow-up.
              </p>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Perché Scegliere i Miei Servizi Personalizzati</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Esperienza, flessibilità e dedizione per soluzioni uniche
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-lime-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Soluzioni Creative</h3>
                <p className="text-gray-600">
                  Approccio innovativo per risolvere situazioni complesse che altri considerano impossibili.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tempi Rapidi</h3>
                <p className="text-gray-600">
                  Efficienza e velocità nell'esecuzione, senza compromettere la qualità del servizio.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Qualità Garantita</h3>
                <p className="text-gray-600">
                  Standard elevati in ogni progetto, con attenzione ai dettagli e cura per il cliente.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-lime-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Supporto Completo</h3>
                <p className="text-gray-600">
                  Assistenza a 360° dalla consulenza iniziale al follow-up post-progetto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-lime-600 to-emerald-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Hai un Progetto Particolare in Mente?</h2>
          <p className="text-xl mb-10 text-white font-medium max-w-2xl mx-auto drop-shadow-md">
            Contattami per discutere la tua situazione specifica e trovare la soluzione ideale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=personalizzato">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-lime-600 hover:bg-lime-50 font-bold text-lg py-4 px-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white">
                <FileText className="mr-3 h-6 w-6" />
                Descrivi il Tuo Progetto
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-8 px-4 relative z-10">
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

export default ServiziPersonalizzati;