import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Camera, CheckCircle, FileText, Phone, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

type ServiceSlug = 'verifica-stato-tetto' | 'valorizzazione-book-fotografico' | 'valutazione-patrimonio';

const serviceData = {
  'verifica-stato-tetto': {
    icon: Plane,
    accent: 'indigo',
    badge: 'Ispezione UAV',
    title: 'Verifica Stato Tetto tramite UAV',
    description:
      'Ispezione professionale e sicura del tuo tetto utilizzando droni di ultima generazione. Tecnologia avanzata per una valutazione accurata senza rischi.',
    cta: 'Richiedi Ispezione',
    sectionTitle: "I vantaggi dell'ispezione con drone",
    image: '/dji_fly_20250917_193124_297_1758130816590_photo.JPG',
    benefits: [
      'Rilevamento visivo di danni, usura e punti critici',
      'Documentazione fotografica in alta definizione',
      'Report ordinato per manutenzione, vendita o due diligence',
      'Riduzione dei rischi rispetto a sopralluoghi tradizionali',
    ],
    process: [
      'Analisi preliminare dell’immobile e delle aree da verificare',
      'Sopralluogo con drone e raccolta immagini',
      'Selezione delle evidenze principali',
      'Consegna del report e confronto operativo',
    ],
  },
  'valorizzazione-book-fotografico': {
    icon: Camera,
    accent: 'purple',
    badge: 'Immagine professionale',
    title: 'Valorizzazione con Book Fotografico',
    description:
      "Servizio fotografico professionale per massimizzare l'appeal del tuo immobile. Immagini di qualità superiore che fanno la differenza nelle vendite e locazioni.",
    cta: 'Richiedi Book Fotografico',
    sectionTitle: 'Perché le foto professionali fanno la differenza',
    image: '/piazza-vicina.JPG',
    benefits: [
      'Fotografie professionali degli ambienti principali',
      'Riprese aeree e dettagli di contesto quando utili',
      'Materiale pronto per portali, social e presentazioni',
      'Supporto alla strategia di posizionamento dell’annuncio',
    ],
    process: [
      'Preparazione degli ambienti e definizione degli scatti',
      'Servizio fotografico in loco',
      'Selezione e ottimizzazione delle immagini',
      'Consegna del book per la promozione commerciale',
    ],
  },
  'valutazione-patrimonio': {
    icon: BarChart3,
    accent: 'green',
    badge: 'Analisi patrimoniale',
    title: 'Valutazione per Patrimonio',
    description:
      'Analisi approfondita e certificata del valore del tuo patrimonio immobiliare. Perizie tecniche professionali per decisioni di investimento consapevoli.',
    cta: 'Richiedi Valutazione',
    sectionTitle: 'Quando serve una valutazione professionale',
    image: '/sfondo-patrimoni.jpg',
    benefits: [
      'Compravendite e decisioni di investimento',
      'Successioni, divisioni e passaggi generazionali',
      'Riorganizzazione o valorizzazione del patrimonio',
      'Scelte di vendita, gestione o messa a reddito',
    ],
    process: [
      'Raccolta documentale e obiettivi del cliente',
      'Analisi dell’immobile e del mercato di riferimento',
      'Valutazione dei possibili scenari',
      'Restituzione strategica con raccomandazioni chiare',
    ],
  },
} satisfies Record<ServiceSlug, {
  icon: React.ComponentType<{ className?: string }>;
  accent: 'indigo' | 'purple' | 'green';
  badge: string;
  title: string;
  description: string;
  cta: string;
  sectionTitle: string;
  image: string;
  benefits: string[];
  process: string[];
}>;

const colorClasses = {
  indigo: {
    hero: 'from-indigo-700 to-indigo-900',
    icon: 'bg-indigo-100 text-indigo-700',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    text: 'text-indigo-700',
  },
  purple: {
    hero: 'from-purple-700 to-purple-900',
    icon: 'bg-purple-100 text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700',
    text: 'text-purple-700',
  },
  green: {
    hero: 'from-green-700 to-green-900',
    icon: 'bg-green-100 text-green-700',
    button: 'bg-green-600 hover:bg-green-700',
    text: 'text-green-700',
  },
};

interface ServiceDetailProps {
  service: ServiceSlug;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const detail = serviceData[service];
  const Icon = detail.icon;
  const colors = colorClasses[detail.accent];

  return (
    <div className="min-h-screen bg-white">
      <section className={`relative overflow-hidden bg-gradient-to-r ${colors.hero} text-white`}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${detail.image})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-5 bg-white/90 text-gray-900">
              {detail.badge}
            </Badge>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{detail.title}</h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed">{detail.description}</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{detail.sectionTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {detail.benefits.map((benefit) => (
                <Card key={benefit} className="border-gray-200">
                  <CardContent className="p-5 flex gap-3">
                    <CheckCircle className={`h-5 w-5 mt-1 flex-shrink-0 ${colors.text}`} />
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <aside className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Metodo di lavoro</h2>
            <div className="space-y-4">
              {detail.process.map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${colors.icon}`}>
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-16 bg-gray-900 text-white rounded-lg p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Vuoi valutare questo servizio?</h2>
            <p className="text-gray-300">Raccontami l’immobile e l’obiettivo: ti indico il percorso più adatto.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className={`${colors.button} text-white`}>
              <Link to="/prenotazione">
                <FileText className="mr-2 h-5 w-5" />
                {detail.cta}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="https://wa.me/393792606775" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceDetail;
