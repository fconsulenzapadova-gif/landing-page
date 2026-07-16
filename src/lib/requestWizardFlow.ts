import type {
  LeadField,
  LeadFieldErrors,
  LeadRequest,
  LocationMode,
  LocationPolygon,
} from './leads.ts';
import {
  getDefaultLocationMode,
  isValidLocationPolygon,
  summarizePolygon,
  type RequestIntent,
  type RequestIntentValue,
} from './requestWizard.ts';

export type WizardStep = 0 | 1 | 2;
export type FormErrors = Partial<Record<keyof LeadRequest, string>>;

export interface RequestWizardDraft {
  intentValue: RequestIntentValue;
  locationText: string;
  locationPolygonDraft: LocationPolygon | null;
  form: LeadRequest;
  step: WizardStep;
}

interface RequestSeed {
  requestId?: string;
  startedAt?: number;
}

export function createRequestWizardDraft(
  intent: RequestIntent,
  seed: RequestSeed = {},
): RequestWizardDraft {
  return {
    intentValue: intent.value,
    locationText: '',
    locationPolygonDraft: null,
    step: 0,
    form: {
      requestId: seed.requestId ?? crypto.randomUUID(),
      requestType: intent.requestType,
      requestRole: intent.requestRole,
      locationMode: getDefaultLocationMode(intent.requestRole),
      propertyType: '',
      location: '',
      locationGeometry: null,
      budget: '',
      timeframe: '',
      features: '',
      name: '',
      phone: '',
      email: '',
      contactPreference: 'telefono',
      notes: '',
      privacyAccepted: false,
      turnstileToken: '',
      website: '',
      startedAt: seed.startedAt ?? Date.now(),
      sourceUrl: '',
      referrer: '',
    },
  };
}

export function resetRequestWizard(intent: RequestIntent, seed: RequestSeed = {}) {
  return createRequestWizardDraft(intent, seed);
}

export function selectRequestIntent(
  current: RequestWizardDraft,
  intent: RequestIntent,
): RequestWizardDraft {
  if (intent.value === current.intentValue) return current;

  return {
    ...current,
    intentValue: intent.value,
    locationText: '',
    locationPolygonDraft: null,
    form: {
      ...current.form,
      requestType: intent.requestType,
      requestRole: intent.requestRole,
      locationMode: getDefaultLocationMode(intent.requestRole),
      location: '',
      locationGeometry: null,
    },
  };
}

export function advanceRequestWizard(current: RequestWizardDraft): RequestWizardDraft {
  return { ...current, step: Math.min(current.step + 1, 2) as WizardStep };
}

export function retreatRequestWizard(current: RequestWizardDraft): RequestWizardDraft {
  return { ...current, step: Math.max(current.step - 1, 0) as WizardStep };
}

export function setRequestWizardStep(current: RequestWizardDraft, step: WizardStep) {
  return { ...current, step };
}

export function updateRequestField<FieldName extends keyof LeadRequest>(
  current: RequestWizardDraft,
  field: FieldName,
  value: LeadRequest[FieldName],
): RequestWizardDraft {
  return { ...current, form: { ...current.form, [field]: value } };
}

export function setRequestLocationText(current: RequestWizardDraft, value: string): RequestWizardDraft {
  return {
    ...current,
    locationText: value,
    form: {
      ...current.form,
      location: current.form.locationMode === 'text' ? value : current.form.location,
    },
  };
}

export function setRequestLocationMode(
  current: RequestWizardDraft,
  locationMode: LocationMode,
): RequestWizardDraft {
  return {
    ...current,
    form: {
      ...current.form,
      locationMode,
      location: locationMode === 'text'
        ? current.locationText
        : current.form.locationGeometry
          ? summarizePolygon(current.form.locationGeometry)
          : '',
    },
  };
}

export function setRequestPolygon(
  current: RequestWizardDraft,
  locationGeometry: LocationPolygon | null,
): RequestWizardDraft {
  return {
    ...current,
    locationPolygonDraft: locationGeometry ?? current.locationPolygonDraft,
    form: {
      ...current.form,
      locationGeometry,
      location: locationGeometry ? summarizePolygon(locationGeometry) : '',
    },
  };
}

export function setRequestPolygonDraft(
  current: RequestWizardDraft,
  locationPolygonDraft: LocationPolygon | null,
): RequestWizardDraft {
  return { ...current, locationPolygonDraft };
}

export function buildLeadRequestPayload(
  current: RequestWizardDraft,
  sourceUrl: string,
  referrer: string,
): LeadRequest {
  if (current.form.locationMode === 'polygon' && !isValidLocationPolygon(current.form.locationGeometry)) {
    throw new Error('La modalità mappa richiede un poligono valido.');
  }
  const polygon = current.form.locationMode === 'polygon' ? current.form.locationGeometry : null;

  return {
    ...current.form,
    location: polygon ? summarizePolygon(polygon) : current.locationText.trim(),
    locationGeometry: polygon,
    sourceUrl,
    referrer,
  };
}

export function validateRequestStep(
  form: LeadRequest,
  locationText: string,
  step: WizardStep,
): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!form.propertyType.trim()) errors.propertyType = 'Indica il tipo di immobile.';
    const hasLocation = form.locationMode === 'text'
      ? Boolean(locationText.trim())
      : isValidLocationPolygon(form.locationGeometry);
    if (!hasLocation) errors.location = 'Indica la zona o la posizione.';
  }

  if (step === 2) {
    if (!form.name.trim()) errors.name = 'Inserisci nome e cognome.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Inserisci un’email valida.';
    if (form.phone && form.phone.replace(/\D/g, '').length < 7) errors.phone = 'Inserisci un numero valido.';
    if (!form.email.trim() && !form.phone.trim()) {
      errors.email = 'Inserisci almeno email o telefono.';
      errors.phone = 'Inserisci almeno telefono o email.';
    }
    if (form.contactPreference === 'email' && !form.email.trim()) errors.email = 'Email necessaria per questo contatto.';
    if ((form.contactPreference === 'telefono' || form.contactPreference === 'whatsapp') && !form.phone.trim()) {
      errors.phone = 'Telefono necessario per questo contatto.';
    }
    if (!form.privacyAccepted) errors.privacyAccepted = 'Conferma la lettura dell’informativa.';
    if (!form.turnstileToken) errors.turnstileToken = 'Completa la verifica antispam.';
  }

  return errors;
}

const intentFields = new Set<LeadField>(['requestType', 'requestRole']);
const propertyFields = new Set<LeadField>([
  'locationMode',
  'location',
  'locationGeometry',
  'propertyType',
  'budget',
  'timeframe',
  'features',
]);

function stepForField(field: LeadField): WizardStep {
  if (intentFields.has(field)) return 0;
  if (propertyFields.has(field)) return 1;
  return 2;
}

export interface NormalizedLeadErrors {
  formErrors: FormErrors;
  summary: string[];
  earliestStep: WizardStep;
  firstField?: keyof LeadRequest;
}

export function normalizeLeadFieldErrors(fieldErrors: LeadFieldErrors): NormalizedLeadErrors {
  const entries = Object.entries(fieldErrors)
    .filter((entry): entry is [LeadField, string] => Boolean(entry[1]))
    .map(([field, message], index) => ({
      field,
      formField: field === 'locationGeometry' ? 'location' : field,
      message,
      index,
      step: stepForField(field),
    }))
    .sort((left, right) => left.step - right.step || left.index - right.index);
  const formErrors: FormErrors = {};

  for (const entry of entries) {
    if (entry.formField !== 'form' && !formErrors[entry.formField]) {
      formErrors[entry.formField] = entry.message;
    }
  }

  const firstField = entries.find((entry) => entry.formField !== 'form')?.formField as keyof LeadRequest | undefined;

  return {
    formErrors,
    summary: [...new Set(entries.map(({ message }) => message))],
    earliestStep: entries[0]?.step ?? 2,
    firstField,
  };
}

export function getNextIntentIndex(
  key: string,
  currentIndex: number,
  length: number,
): number | null {
  if (length <= 0 || currentIndex < 0) return null;
  if (key === 'ArrowRight' || key === 'ArrowDown') return (currentIndex + 1) % length;
  if (key === 'ArrowLeft' || key === 'ArrowUp') return (currentIndex - 1 + length) % length;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  return null;
}
