export const requestTypes = ['acquisto', 'vendita', 'locazione'] as const;
export const contactPreferences = ['telefono', 'email', 'whatsapp'] as const;

export type RequestType = (typeof requestTypes)[number];
export type ContactPreference = (typeof contactPreferences)[number];

export interface ValidLead {
  requestId: string;
  requestType: RequestType;
  propertyType: string;
  location: string;
  budget: string;
  timeframe: string;
  features: string;
  name: string;
  phone: string;
  email: string;
  contactPreference: ContactPreference;
  notes: string;
  privacyAccepted: true;
  turnstileToken: string;
  website: '';
  startedAt: number;
  sourceUrl: string;
  referrer: string;
}

export interface ValidationResult {
  ok: boolean;
  value?: ValidLead;
  fieldErrors?: Record<string, string>;
}

const limits = {
  requestId: 36,
  propertyType: 80,
  location: 180,
  budget: 80,
  timeframe: 80,
  features: 1500,
  name: 120,
  phone: 40,
  email: 254,
  notes: 2000,
  turnstileToken: 2048,
  website: 200,
  sourceUrl: 500,
  referrer: 500,
} as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\0/g, '').slice(0, maxLength);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function validateLeadPayload(payload: unknown, now = Date.now()): ValidationResult {
  if (!isObject(payload)) return { ok: false, fieldErrors: { form: 'Payload non valido.' } };

  const requestId = text(payload.requestId, limits.requestId);
  const requestType = text(payload.requestType, 20);
  const propertyType = text(payload.propertyType, limits.propertyType);
  const location = text(payload.location, limits.location);
  const budget = text(payload.budget, limits.budget);
  const timeframe = text(payload.timeframe, limits.timeframe);
  const features = text(payload.features, limits.features);
  const name = text(payload.name, limits.name);
  const phone = text(payload.phone, limits.phone);
  const email = text(payload.email, limits.email).toLowerCase();
  const contactPreference = text(payload.contactPreference, 20);
  const notes = text(payload.notes, limits.notes);
  const turnstileToken = text(payload.turnstileToken, limits.turnstileToken);
  const website = text(payload.website, limits.website);
  const sourceUrl = text(payload.sourceUrl, limits.sourceUrl);
  const referrer = text(payload.referrer, limits.referrer);
  const startedAt = typeof payload.startedAt === 'number' ? payload.startedAt : 0;
  const errors: Record<string, string> = {};

  if (!isUuid(requestId)) errors.requestId = 'Identificativo richiesta non valido.';
  if (!requestTypes.includes(requestType as RequestType)) errors.requestType = 'Tipo richiesta non valido.';
  if (!propertyType) errors.propertyType = 'Indica il tipo di immobile.';
  if (!location) errors.location = 'Indica la zona o la posizione.';
  if (!name) errors.name = 'Inserisci nome e cognome.';
  if (!email && !phone) {
    errors.email = 'Inserisci almeno email o telefono.';
    errors.phone = 'Inserisci almeno telefono o email.';
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email non valida.';
  if (phone && phone.replace(/\D/g, '').length < 7) errors.phone = 'Telefono non valido.';
  if (!contactPreferences.includes(contactPreference as ContactPreference)) errors.contactPreference = 'Canale non valido.';
  if (contactPreference === 'email' && !email) errors.email = 'Email necessaria per il canale scelto.';
  if ((contactPreference === 'telefono' || contactPreference === 'whatsapp') && !phone) {
    errors.phone = 'Telefono necessario per il canale scelto.';
  }
  if (payload.privacyAccepted !== true) errors.privacyAccepted = 'Consenso richiesto.';
  if (!turnstileToken) errors.turnstileToken = 'Verifica antispam mancante.';
  if (website) errors.form = 'Invio non valido.';
  if (!startedAt || now - startedAt < 1_500 || startedAt > now) errors.form = 'Invio non valido.';

  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  return {
    ok: true,
    value: {
      requestId,
      requestType: requestType as RequestType,
      propertyType,
      location,
      budget,
      timeframe,
      features,
      name,
      phone,
      email,
      contactPreference: contactPreference as ContactPreference,
      notes,
      privacyAccepted: true,
      turnstileToken,
      website: '',
      startedAt,
      sourceUrl,
      referrer,
    },
  };
}
