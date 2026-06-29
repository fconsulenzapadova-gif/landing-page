export type RequestType = 'acquisto' | 'vendita' | 'locazione';

export type IconName =
  | 'award'
  | 'bar-chart'
  | 'building'
  | 'calendar'
  | 'camera'
  | 'check'
  | 'file'
  | 'home'
  | 'key'
  | 'mail'
  | 'map'
  | 'phone'
  | 'search'
  | 'shield'
  | 'target'
  | 'users';

export interface ServiceContent {
  id: RequestType;
  title: string;
  eyebrow: string;
  route: string;
  requestPath: string;
  heroImage: string;
  icon: IconName;
  accent: 'blue' | 'emerald' | 'violet';
  summary: string;
  promise: string;
  highlights: Array<{ title: string; text: string; icon: IconName }>;
  steps: string[];
  benefits: string[];
  whatsappMessage: string;
}

export interface SpecialistServiceContent {
  id: 'valutazione-patrimonio';
  title: string;
  eyebrow: string;
  route: string;
  heroImage: string;
  icon: IconName;
  accent: 'green';
  summary: string;
  benefits: string[];
  steps: string[];
  cta: string;
}

export interface FeaturedListing {
  code: string;
  slug: string;
  title: string;
  status: 'In vendita' | 'In locazione';
  requestType: Extract<RequestType, 'vendita' | 'locazione'>;
  propertyType: string;
  municipality: string;
  zone: string;
  address: string;
  postalCode: string;
  location: string;
  price: string;
  priceValue?: number;
  surface?: string;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  floor?: string;
  elevator?: string;
  condition?: string;
  energyClass?: string;
  availableFrom?: string;
  image: string;
  mobileImage: string;
  images: string[];
  imageFolderUrl: string;
  imageAlt: string;
  summary: string;
  description: string;
  details: string[];
  highlights: string[];
}

export const company = {
  brand: 'Gemüt Capital',
  legalName: 'Gemüt Capital SRL',
  descriptor: 'Mediazione immobiliare',
  phone: '379 260 6775',
  phoneHref: '+393792606775',
  email: 'info@gemutcapital.com',
  pec: 'gemutcapital@pec.it',
  vat: '05791060287',
  rea: 'PD - 492863',
  location: 'Padova e provincia',
  whatsappUrl: 'https://wa.me/393792606775',
} as const;

export const navSections = [
  {
    title: 'Principale',
    links: [{ label: 'Home', to: '/' }],
  },
  {
    title: 'Servizi immobiliari',
    links: [
      { label: 'Acquisto casa', to: '/acquisto-casa' },
      { label: 'Vendita immobili', to: '/vendita-immobili' },
      { label: 'Locazioni', to: '/locazioni' },
    ],
  },
  {
    title: 'Patrimonio',
    links: [{ label: 'Valutazione patrimonio', to: '/valutazione-patrimonio' }],
  },
] as const;

export const primaryServices: Record<RequestType, ServiceContent> = {
  acquisto: {
    id: 'acquisto',
    title: 'Acquisto casa',
    eyebrow: 'Ricerca e trattativa',
    route: '/acquisto-casa',
    requestPath: '/richieste?type=acquisto',
    heroImage: '/images/piazza-vicina.webp',
    icon: 'search',
    accent: 'blue',
    summary:
      'Ti accompagniamo nella ricerca dell’immobile giusto, dalla definizione dei criteri fino alla trattativa e al rogito.',
    promise:
      'Un processo ordinato per ridurre dispersione, visite inutili e rischi documentali.',
    highlights: [
      {
        title: 'Ricerca mirata',
        text: 'Partiamo da esigenze, budget, zona e vincoli reali per selezionare solo opportunita coerenti.',
        icon: 'target',
      },
      {
        title: 'Valutazione oggettiva',
        text: 'Leggiamo prezzo, stato, posizione e margini di trattativa prima di formulare offerte.',
        icon: 'bar-chart',
      },
      {
        title: 'Controlli prima della firma',
        text: 'Coordiniamo verifiche tecniche e documentali con professionisti qualificati.',
        icon: 'shield',
      },
    ],
    steps: [
      'Analisi iniziale di esigenze, budget e tempi',
      'Ricerca attiva e preselezione degli immobili',
      'Visite guidate e confronto tecnico-commerciale',
      'Offerta e negoziazione',
      'Verifiche documentali e supporto al preliminare',
      'Assistenza fino al rogito',
    ],
    benefits: [
      'Meno tempo perso su immobili non adatti',
      'Maggiore controllo sui rischi prima della proposta',
      'Trattativa gestita con metodo',
      'Supporto coordinato fino alla chiusura',
    ],
    whatsappMessage: 'Ciao, vorrei ricevere maggiori informazioni per acquistare un immobile.',
  },
  vendita: {
    id: 'vendita',
    title: 'Vendita immobili',
    eyebrow: 'Valore, mercato e promozione',
    route: '/vendita-immobili',
    requestPath: '/richieste?type=vendita',
    heroImage: '/images/sfondo-patrimoni.webp',
    icon: 'bar-chart',
    accent: 'emerald',
    summary:
      'Costruiamo una strategia di vendita basata su prezzo, presentazione, canali e gestione dei contatti qualificati.',
    promise:
      'L’obiettivo e vendere meglio, con una posizione chiara sul mercato e una trattativa controllata.',
    highlights: [
      {
        title: 'Valutazione iniziale',
        text: 'Analisi comparativa del mercato e posizionamento del prezzo rispetto alla domanda reale.',
        icon: 'bar-chart',
      },
      {
        title: 'Materiale di vendita',
        text: 'Preparazione del racconto dell’immobile, fotografie e contenuti utili alla promozione.',
        icon: 'camera',
      },
      {
        title: 'Gestione acquirenti',
        text: 'Qualificazione dei contatti, visite organizzate e negoziazione fino alla chiusura.',
        icon: 'users',
      },
    ],
    steps: [
      'Sopralluogo e raccolta informazioni',
      'Analisi di mercato e proposta strategica',
      'Preparazione immobile e materiali',
      'Promozione e gestione richieste',
      'Visite, feedback e negoziazione',
      'Preliminare, documenti e rogito',
    ],
    benefits: [
      'Prezzo coerente con mercato e obiettivi',
      'Presentazione piu forte dell’immobile',
      'Contatti filtrati prima delle visite',
      'Trattativa condotta con criteri chiari',
    ],
    whatsappMessage: 'Ciao, vorrei ricevere maggiori informazioni per vendere il mio immobile.',
  },
  locazione: {
    id: 'locazione',
    title: 'Locazioni',
    eyebrow: 'Affitti per proprietari e inquilini',
    route: '/locazioni',
    requestPath: '/richieste?type=locazione',
    heroImage: '/images/prato-padova.webp',
    icon: 'key',
    accent: 'violet',
    summary:
      'Gestiamo ricerca, selezione, contratto e relazione tra proprietario e inquilino con un processo chiaro.',
    promise:
      'Una locazione funziona quando canone, garanzie, documenti e aspettative sono allineati prima della firma.',
    highlights: [
      {
        title: 'Canone e posizionamento',
        text: 'Valutiamo il canone sostenibile e competitivo per la zona e il tipo di immobile.',
        icon: 'home',
      },
      {
        title: 'Selezione inquilini',
        text: 'Raccogliamo informazioni e documenti utili a valutare affidabilita e compatibilita.',
        icon: 'check',
      },
      {
        title: 'Contratto e consegna',
        text: 'Supportiamo le fasi operative fino alla firma e alla consegna dell’immobile.',
        icon: 'file',
      },
    ],
    steps: [
      'Analisi dell’immobile o della richiesta',
      'Definizione canone, budget o requisiti',
      'Promozione o ricerca attiva',
      'Selezione e visite',
      'Preparazione documentale',
      'Firma e consegna',
    ],
    benefits: [
      'Migliore compatibilita tra immobile e conduttore',
      'Meno incertezza su garanzie e documenti',
      'Processo piu rapido e ordinato',
      'Supporto anche dopo la prima consulenza',
    ],
    whatsappMessage: 'Ciao, vorrei informazioni sui servizi di locazione.',
  },
};

export const specialistServices = {
  valutazionePatrimonio: {
    id: 'valutazione-patrimonio',
    title: 'Valutazione del patrimonio immobiliare',
    eyebrow: 'Analisi patrimoniale',
    route: '/valutazione-patrimonio',
    heroImage: '/images/sfondo-patrimoni.webp',
    icon: 'bar-chart',
    accent: 'green',
    summary:
      'Analisi del valore e delle opzioni di gestione di uno o piu immobili per decisioni di vendita, investimento, successione o messa a reddito.',
    benefits: [
      'Quadro chiaro del valore degli immobili',
      'Supporto a successioni e passaggi generazionali',
      'Valutazione di scenari vendita, gestione o reddito',
      'Priorita operative basate su obiettivi concreti',
    ],
    steps: [
      'Raccolta documentale e obiettivi',
      'Analisi degli immobili e del mercato',
      'Confronto sugli scenari possibili',
      'Restituzione con raccomandazioni',
    ],
    cta: 'Richiedi valutazione',
  },
} satisfies Record<string, SpecialistServiceContent>;

export const valueProps = [
  {
    title: 'Metodo',
    text: 'Ogni incarico parte da obiettivi, vincoli e dati verificabili.',
    icon: 'target',
  },
  {
    title: 'Trasparenza',
    text: 'Costi, tempi, rischi e prossimi passi vengono chiariti prima delle decisioni.',
    icon: 'shield',
  },
  {
    title: 'Rete professionale',
    text: 'Quando serve, coordiniamo tecnici, notai, consulenti fiscali e legali.',
    icon: 'users',
  },
  {
    title: 'Focus locale',
    text: 'Il lavoro e concentrato sul mercato di Padova e provincia.',
    icon: 'map',
  },
] as const;
