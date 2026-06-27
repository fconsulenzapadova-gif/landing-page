import { isSupabaseConfigured, supabase } from './supabase';

export interface LeadRequest {
  name: string;
  phone: string;
  email: string;
  requestType: 'acquisto' | 'vendita' | 'locazione';
  propertyType: string;
  location: string;
  budget: string;
  timeframe: string;
  features: string;
  notes: string;
}

export interface LeadResult {
  ok: boolean;
  message: string;
}

const crmEndpoint = 'https://crm-pro-five.vercel.app/api/submit-lead';

async function sendToExternalCrm(request: LeadRequest) {
  const response = await fetch(crmEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: request.name,
      email: request.email,
      phone: request.phone,
      landing_page_url: 'www.gemutcapital.com',
    }),
  });

  if (!response.ok) {
    throw new Error(`CRM error ${response.status}`);
  }
}

export async function submitLeadRequest(request: LeadRequest): Promise<LeadResult> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message: 'Supabase non e configurato. Imposta le variabili ambiente prima di usare il form in produzione.',
    };
  }

  const { error } = await supabase.from('lead_submissions').insert({
    name: request.name,
    phone: request.phone,
    email: request.email,
    request_type: request.requestType,
    property_type: request.propertyType || null,
    location: request.location,
    budget: request.budget || null,
    timeframe: request.timeframe || null,
    features: request.features || null,
    notes: request.notes || null,
    source: 'gemutcapital.com',
  });

  if (error) {
    return {
      ok: false,
      message: 'Non siamo riusciti a salvare la richiesta. Riprova piu tardi.',
    };
  }

  sendToExternalCrm(request).catch((crmError) => {
    console.error('External CRM submission failed', crmError);
  });

  return {
    ok: true,
    message: 'Richiesta inviata. Ti ricontatteremo entro 24 ore.',
  };
}
