import { Property, SellerClient } from '@/components/Dashboard';

// Tipi per i portali
export interface PortalProperty {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city?: string;
    region?: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: string;
  operationType: 'sale' | 'rent';
  features: {
    rooms?: number;
    bathrooms?: number;
    surface?: number;
    floor?: number;
    energyClass?: string;
    furnished?: boolean;
    parking?: boolean;
    garden?: boolean;
    terrace?: boolean;
    elevator?: boolean;
  };
  images?: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
    agency?: string;
  };
  options: {
    showOnMap: boolean;
    highlight: boolean;
    autoRenew?: boolean;
  };
}

// Configurazione API per i portali
export interface PortalConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  endpoints: {
    publish: string;
    update: string;
    delete: string;
    status: string;
  };
  headers: Record<string, string>;
}

// Configurazioni dei portali
export const PORTAL_CONFIGS: Record<string, PortalConfig> = {
  immobiliare: {
    id: 'immobiliare',
    name: 'Immobiliare.it',
    baseUrl: 'https://api.immobiliare.it/v1',
    endpoints: {
      publish: '/listings',
      update: '/listings/{id}',
      delete: '/listings/{id}',
      status: '/listings/{id}/status'
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  idealista: {
    id: 'idealista',
    name: 'Idealista',
    baseUrl: 'https://api.idealista.com/3.5',
    endpoints: {
      publish: '/properties',
      update: '/properties/{id}',
      delete: '/properties/{id}',
      status: '/properties/{id}'
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

// Mapping dei tipi di proprietà
export const PROPERTY_TYPE_MAPPING = {
  immobiliare: {
    'Monolocale': 'monolocale',
    'Bilocale': 'bilocale',
    'Trilocale': 'trilocale',
    'Quadrilocale': 'quadrilocale',
    'Villa': 'villa',
    'Attico': 'attico',
    'Loft': 'loft',
    'Bifamiliare': 'bifamiliare',
    'Multi locale': 'multilocale',
    'Ufficio': 'ufficio',
    'Negozio': 'negozio',
    'Magazzino': 'magazzino'
  },
  idealista: {
    'Monolocale': 'flat',
    'Bilocale': 'flat',
    'Trilocale': 'flat',
    'Quadrilocale': 'flat',
    'Villa': 'chalet',
    'Attico': 'penthouse',
    'Loft': 'loft',
    'Bifamiliare': 'duplex',
    'Multi locale': 'flat',
    'Ufficio': 'office',
    'Negozio': 'premises',
    'Magazzino': 'storage'
  }
};

// Funzioni di utilità per il parsing delle caratteristiche
export const parseFeatures = (featuresString: string): Record<string, unknown> => {
  const features: Record<string, unknown> = {};
  
  if (!featuresString) return features;
  
  const featureList = featuresString.split(',').map(f => f.trim().toLowerCase());
  
  // Parsing intelligente delle caratteristiche
  featureList.forEach(feature => {
    // Numero di locali
    const roomsMatch = feature.match(/(\d+)\s*(?:locali?|camere?|stanze?)/);
    if (roomsMatch) {
      features.rooms = parseInt(roomsMatch[1]);
    }
    
    // Numero di bagni
    const bathroomsMatch = feature.match(/(\d+)\s*bagni?/);
    if (bathroomsMatch) {
      features.bathrooms = parseInt(bathroomsMatch[1]);
    }
    
    // Superficie
    const surfaceMatch = feature.match(/(\d+)\s*mq|(\d+)\s*m²|(\d+)\s*metri/);
    if (surfaceMatch) {
      features.surface = parseInt(surfaceMatch[1] || surfaceMatch[2] || surfaceMatch[3]);
    }
    
    // Piano
    const floorMatch = feature.match(/(\d+)°?\s*piano|piano\s*(\d+)/);
    if (floorMatch) {
      features.floor = parseInt(floorMatch[1] || floorMatch[2]);
    }
    
    // Classe energetica
    const energyMatch = feature.match(/classe\s*energetica\s*([a-g])/i);
    if (energyMatch) {
      features.energyClass = energyMatch[1].toUpperCase();
    }
    
    // Caratteristiche booleane
    if (feature.includes('arredato') || feature.includes('ammobiliato')) {
      features.furnished = true;
    }
    if (feature.includes('posto auto') || feature.includes('garage') || feature.includes('parcheggio')) {
      features.parking = true;
    }
    if (feature.includes('giardino')) {
      features.garden = true;
    }
    if (feature.includes('terrazzo') || feature.includes('terrazza') || feature.includes('balcone')) {
      features.terrace = true;
    }
    if (feature.includes('ascensore')) {
      features.elevator = true;
    }
  });
  
  return features;
};

// Funzione per convertire i dati interni nel formato del portale
export const convertToPortalFormat = (
  property: Property,
  seller: SellerClient,
  portalId: string,
  additionalData: {
    description?: string;
    contactPhone?: string;
    contactEmail?: string;
    showOnMap?: boolean;
    highlight?: boolean;
  } = {}
): PortalProperty => {
  const featuresString = Array.isArray(property.features) 
    ? property.features.join(', ') 
    : property.features || '';
  const features = parseFeatures(featuresString);
  
  // Parsing del prezzo
  const priceString = property.price?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0';
  const price = parseFloat(priceString);
  
  // Parsing della location
  const locationParts = property.location?.split(',').map(part => part.trim()) || [];
  const address = locationParts[0] || property.location || '';
  const city = locationParts[1] || '';
  
  const portalProperty: PortalProperty = {
    title: `${property.propertyType} - ${property.location}`,
    description: [
      property.notes || '',
      additionalData.description || ''
    ].filter(Boolean).join('\n\n'),
    price: price,
    currency: 'EUR',
    location: {
      address,
      city,
      region: 'Italia'
    },
    propertyType: PROPERTY_TYPE_MAPPING[portalId as keyof typeof PROPERTY_TYPE_MAPPING]?.[property.propertyType as keyof typeof PROPERTY_TYPE_MAPPING['immobiliare']] || 'flat',
    operationType: property.operationType === 'vendita' ? 'sale' : 'rent',
    features,
    contact: {
      name: seller.name,
      phone: additionalData.contactPhone || seller.phone || '',
      email: additionalData.contactEmail || seller.email || '',
      agency: 'Immobiliare Filippo Marcuzzo'
    },
    options: {
      showOnMap: additionalData.showOnMap ?? true,
      highlight: additionalData.highlight ?? false,
      autoRenew: true
    }
  };
  
  return portalProperty;
};

// Funzione per validare i dati prima della pubblicazione
export const validatePropertyData = (portalProperty: PortalProperty): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!portalProperty.title || portalProperty.title.trim().length < 10) {
    errors.push('Il titolo deve essere di almeno 10 caratteri');
  }
  
  if (!portalProperty.description || portalProperty.description.trim().length < 50) {
    errors.push('La descrizione deve essere di almeno 50 caratteri');
  }
  
  if (!portalProperty.price || portalProperty.price <= 0) {
    errors.push('Il prezzo deve essere maggiore di zero');
  }
  
  if (!portalProperty.location.address) {
    errors.push('L\'indirizzo è obbligatorio');
  }
  
  if (!portalProperty.contact.phone && !portalProperty.contact.email) {
    errors.push('Almeno un contatto (telefono o email) è obbligatorio');
  }
  
  if (portalProperty.contact.phone && !/^[+]?[0-9\s\-()]{8,}$/.test(portalProperty.contact.phone)) {
    errors.push('Il numero di telefono non è valido');
  }
  
  if (portalProperty.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portalProperty.contact.email)) {
    errors.push('L\'email non è valida');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Simulazione delle chiamate API (da sostituire con implementazioni reali)
export const publishToPortal = async (
  portalId: string,
  propertyData: PortalProperty
): Promise<{ success: boolean; id?: string; url?: string; error?: string }> => {
  // Validazione dati
  const validation = validatePropertyData(propertyData);
  if (!validation.valid) {
    return {
      success: false,
      error: `Errori di validazione: ${validation.errors.join(', ')}`
    };
  }
  
  try {
    // Simulazione chiamata API
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Simulazione risultato (85% successo)
    const success = Math.random() > 0.15;
    
    if (success) {
      const listingId = `${portalId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const baseUrls = {
        immobiliare: 'https://www.immobiliare.it/annunci/',
        idealista: 'https://www.idealista.it/immobile/'
      };
      
      return {
        success: true,
        id: listingId,
        url: `${baseUrls[portalId as keyof typeof baseUrls]}${listingId}`
      };
    } else {
      const errors = [
        'Errore di connessione al portale',
        'Dati mancanti o non validi',
        'Limite di pubblicazioni raggiunto',
        'Errore di autenticazione API',
        'Immobile già presente nel portale',
        'Categoria non supportata'
      ];
      
      return {
        success: false,
        error: errors[Math.floor(Math.random() * errors.length)]
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Errore di rete: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};

// Funzione per aggiornare un annuncio esistente
export const updatePortalListing = async (
  _portalId: string,
  _listingId: string,
  _propertyData: PortalProperty
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Simulazione chiamata API
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    const success = Math.random() > 0.1; // 90% successo per gli aggiornamenti
    
    if (success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Errore durante l\'aggiornamento dell\'annuncio'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Errore di rete: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};

// Funzione per eliminare un annuncio
export const deletePortalListing = async (
  _portalId: string,
  _listingId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Simulazione chiamata API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    const success = Math.random() > 0.05; // 95% successo per le eliminazioni
    
    if (success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Errore durante l\'eliminazione dell\'annuncio'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Errore di rete: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};

// Funzione per ottenere lo stato di un annuncio
export const getListingStatus = async (
  _portalId: string,
  _listingId: string
): Promise<{ success: boolean; status?: 'active' | 'inactive' | 'pending' | 'rejected'; error?: string }> => {
  try {
    // Simulazione chiamata API
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const statuses = ['active', 'inactive', 'pending', 'rejected'] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      success: true,
      status
    };
  } catch (error) {
    return {
      success: false,
      error: `Errore di rete: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};