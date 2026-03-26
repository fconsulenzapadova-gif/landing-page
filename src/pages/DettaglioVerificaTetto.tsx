import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { 
  Plane, 
  Camera, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  Phone, 
  Mail,
  AlertTriangle,
  Eye,
  Download,
  MapPin,
  Zap,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DettaglioVerificaTetto: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <BackButton to="/" />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Verifica Stato Tetto tramite UAV
          </h1>
          <p className="text-xl mb-8 text-indigo-100 max-w-3xl mx-auto">
            Ispezione professionale e sicura del tuo tetto utilizzando droni di ultima generazione. 
            Tecnologia avanzata per una valutazione accurata senza rischi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=verifica-tetto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Ispezione
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vantaggi del Servizio */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perché Scegliere l'Ispezione con Drone</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La tecnologia UAV offre vantaggi unici per l'ispezione dei tetti, garantendo sicurezza, precisione e completezza
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Sicurezza Totale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Nessun rischio per persone. L'ispezione avviene senza salire sul tetto, eliminando pericoli di cadute o danni strutturali.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Precisione Millimetrica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Fotocamere ad alta risoluzione e sensori termici rilevano anche i più piccoli difetti invisibili ad occhio nudo.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Rapidità di Esecuzione</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Ispezione completa in 30-60 minuti. Report dettagliato disponibile entro 24-48 ore dalla rilevazione.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Documentazione HD</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Foto e video in 4K, immagini termiche e mappe 3D per una documentazione completa e professionale.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Rilevamento Problemi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Identificazione di infiltrazioni, tegole danneggiate, problemi strutturali e punti critici per la manutenzione.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Report Professionale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Relazione tecnica dettagliata con raccomandazioni, preventivi e priorità di intervento per ogni problema rilevato.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Processo di Ispezione */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Come Funziona l'Ispezione</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un processo strutturato e professionale per garantire risultati accurati e completi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Sopralluogo Preliminare</h3>
              <p className="text-gray-600 text-sm">
                Valutazione del sito, condizioni meteo e pianificazione del volo in sicurezza.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Volo di Ispezione</h3>
              <p className="text-gray-600 text-sm">
                Acquisizione di immagini HD, termiche e video da diverse angolazioni e altezze.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Analisi Dati</h3>
              <p className="text-gray-600 text-sm">
                Elaborazione delle immagini, identificazione problemi e creazione della mappatura 3D.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Report Finale</h3>
              <p className="text-gray-600 text-sm">
                Consegna del report completo con raccomandazioni e preventivi per gli interventi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cosa Include il Servizio */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cosa Include il Servizio</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Documentazione Tecnica
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fotografie ad alta risoluzione (4K)</li>
                  <li>• Immagini termiche per rilevamento infiltrazioni</li>
                  <li>• Video panoramico dell'intera copertura</li>
                  <li>• Mappa 3D del tetto con misurazioni</li>
                  <li>• Ortofoto georeferenziata</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Analisi e Report
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Relazione tecnica dettagliata</li>
                  <li>• Identificazione di tutti i problemi rilevati</li>
                  <li>• Classificazione per priorità di intervento</li>
                  <li>• Preventivi indicativi per le riparazioni</li>
                  <li>• Raccomandazioni per la manutenzione</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Download className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Consegna Digitale</h3>
                  <p className="text-gray-600">
                    Tutti i materiali vengono consegnati in formato digitale tramite piattaforma cloud sicura, 
                    accessibile 24/7 con possibilità di download e condivisione.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Hai Bisogno di un'Ispezione del Tetto?</h2>
          <p className="text-xl mb-10 text-indigo-100 font-medium max-w-2xl mx-auto drop-shadow-md">
            Contattami per un preventivo gratuito e scopri le condizioni reali del tuo tetto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=verifica-tetto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-lg py-4 px-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Preventivo Gratuito
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-4 px-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <Mail className="mr-2 h-5 w-5" />
              Chiamami: 379 260 6775
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DettaglioVerificaTetto;