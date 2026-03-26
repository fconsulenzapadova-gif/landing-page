import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { 
  Camera, 
  Image, 
  Video, 
  Palette, 
  TrendingUp, 
  CheckCircle, 
  Phone, 
  Mail,
  Eye,
  Globe,
  Lightbulb,
  Monitor,
  Smartphone,
  Share2,
  Star,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DettaglioValorizzazioneBook: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <BackButton to="/" />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Camera className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Valorizzazione con Book Fotografico
          </h1>
          <p className="text-xl mb-8 text-purple-100 max-w-3xl mx-auto">
            Servizio fotografico professionale per massimizzare l'appeal del tuo immobile. 
            Immagini di qualità superiore che fanno la differenza nelle vendite e locazioni.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=book-fotografico">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Book Fotografico
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Perché è Importante */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perché le Foto Professionali Fanno la Differenza</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nel mercato immobiliare, la prima impressione è fondamentale. Le foto professionali aumentano significativamente l'interesse e il valore percepito
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">+40% Visualizzazioni</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Gli annunci con foto professionali ricevono fino al 40% di visualizzazioni in più rispetto a quelli con foto amatoriali.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Vendita più Rapida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Immobili con book fotografico professionale si vendono mediamente 30% più velocemente.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Valore Percepito</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Le foto professionali aumentano il valore percepito dell'immobile e giustificano prezzi più alti.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Prima Impressione</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Il 90% degli acquirenti decide se visitare un immobile basandosi esclusivamente sulle foto online.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle className="text-lg">Condivisione Social</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Foto di qualità vengono condivise 3 volte di più sui social media, ampliando la visibilità.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Portata Globale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Immagini professionali attirano anche acquirenti internazionali e investitori esteri.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Servizi Inclusi */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cosa Include il Servizio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un pacchetto completo per valorizzare ogni aspetto del tuo immobile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Fotografie HD</h3>
              <p className="text-gray-600 text-sm">
                20-40 foto professionali ad alta risoluzione di tutti gli ambienti interni ed esterni.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Video Tour</h3>
              <p className="text-gray-600 text-sm">
                Video walkthrough professionale per mostrare i flussi e le dimensioni reali.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Virtual Tour 360°</h3>
              <p className="text-gray-600 text-sm">
                Tour virtuale interattivo per esplorare l'immobile da remoto in modo immersivo.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Post-Produzione</h3>
              <p className="text-gray-600 text-sm">
                Editing professionale, correzione colori e ottimizzazione per web e stampa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologie e Attrezzature */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tecnologie e Attrezzature Professionali</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Attrezzatura Fotografica
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fotocamere full-frame ad alta risoluzione</li>
                  <li>• Obiettivi grandangolari professionali</li>
                  <li>• Sistema di illuminazione LED portatile</li>
                  <li>• Treppiedi e stabilizzatori professionali</li>
                  <li>• Droni per riprese aeree certificate</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Software e Tecniche
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• HDR (High Dynamic Range) per dettagli perfetti</li>
                  <li>• Bracketing per esposizioni multiple</li>
                  <li>• Focus stacking per nitidezza totale</li>
                  <li>• Correzione prospettica professionale</li>
                  <li>• Color grading cinematografico</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Illuminazione Perfetta</h3>
                    <p className="text-gray-600 text-sm">
                      Ogni ambiente viene illuminato per esaltare i punti di forza e minimizzare i difetti.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Monitor className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Ottimizzazione Multi-Device</h3>
                    <p className="text-gray-600 text-sm">
                      Immagini ottimizzate per desktop, tablet e smartphone per massima compatibilità.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Consegna Rapida</h3>
                    <p className="text-gray-600 text-sm">
                      Foto pronte in 24-48 ore, video e virtual tour entro 72 ore dal servizio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pacchetti Disponibili */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pacchetti Disponibili</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scegli il pacchetto più adatto alle tue esigenze e al tipo di immobile
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-2 bg-purple-100 text-purple-600">Essenziale</Badge>
                <CardTitle className="text-xl">Appartamento</CardTitle>
                <p className="text-gray-600">Fino a 80 mq</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                  <li>• 15-20 foto HD professionali</li>
                  <li>• Post-produzione inclusa</li>
                  <li>• Consegna in 24 ore</li>
                  <li>• Formati web e stampa</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Richiedi Preventivo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200 ring-2 ring-purple-200">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-2 bg-purple-600 text-white">Completo</Badge>
                <CardTitle className="text-xl">Villa/Casa</CardTitle>
                <p className="text-gray-600">Fino a 200 mq</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                  <li>• 25-35 foto HD + esterni</li>
                  <li>• Video walkthrough</li>
                  <li>• Riprese aeree con drone</li>
                  <li>• Virtual tour 360° base</li>
                  <li>• Consegna in 48 ore</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Richiedi Preventivo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">Premium</Badge>
                <CardTitle className="text-xl">Immobile di Lusso</CardTitle>
                <p className="text-gray-600">Oltre 200 mq</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                  <li>• 40+ foto HD professionali</li>
                  <li>• Video cinematografico</li>
                  <li>• Virtual tour 360° completo</li>
                  <li>• Riprese aeree avanzate</li>
                  <li>• Home staging digitale</li>
                  <li>• Consegna in 72 ore</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Richiedi Preventivo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Valorizza il Tuo Immobile con Foto Professionali</h2>
          <p className="text-xl mb-10 text-purple-100 font-medium max-w-2xl mx-auto drop-shadow-md">
            Contattami per un preventivo personalizzato e scopri come le foto professionali possono fare la differenza
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=book-fotografico">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50 font-bold text-lg py-4 px-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white">
                <Camera className="mr-2 h-5 w-5" />
                Richiedi Book Fotografico
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg py-4 px-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <Mail className="mr-2 h-5 w-5" />
              Chiamami: 379 260 6775
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DettaglioValorizzazioneBook;