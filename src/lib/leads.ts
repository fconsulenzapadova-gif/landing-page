export type ContactPreference = 'telefono' | 'email' | 'whatsapp';
export type LeadRequestType = 'acquisto' | 'vendita' | 'locazione';
export type RequestRole = 'cerca' | 'proprietario';
export type LocationMode = 'text' | 'polygon';

export interface LocationPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

export interface LeadRequest {
  requestId: string;
  requestType: LeadRequestType;
  requestRole: RequestRole;
  locationMode: LocationMode;
  locationGeometry: LocationPolygon | null;
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
  privacyAccepted: boolean;
  turnstileToken: string;
  website: string;
  startedAt: number;
  sourceUrl: string;
  referrer: string;
}

export interface LeadResult {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof LeadRequest, string>>;
}

const localEndpoint = 'http://127.0.0.1:8787/api/leads';
const localHostnames = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function getEndpoint() {
  if (localHostnames.has(window.location.hostname)) return localEndpoint;
  const configuredEndpoint = import.meta.env.VITE_LEADS_API_URL?.trim();
  if (configuredEndpoint) return configuredEndpoint;
  return '';
}

export async function submitLeadRequest(request: LeadRequest): Promise<LeadResult> {
  const endpoint = getEndpoint();
  if (!endpoint) {
    return {
      ok: false,
      message: 'Il servizio richieste non è configurato. Contattaci telefonicamente o via email.',
    };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    const result = (await response.json().catch(() => null)) as LeadResult | null;

    if (!response.ok || !result?.ok) {
      return {
        ok: false,
        message: result?.message || 'Non siamo riusciti a salvare la richiesta. Riprova tra poco.',
        fieldErrors: result?.fieldErrors,
      };
    }

    return result;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof DOMException && error.name === 'AbortError'
          ? 'Il salvataggio sta richiedendo troppo tempo. Controlla la connessione e riprova.'
          : 'Connessione non disponibile. La richiesta non è stata inviata.',
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
