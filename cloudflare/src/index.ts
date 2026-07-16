import { validateLeadPayload, type ValidLead } from './validation';
import { sendLeadNotification } from './notification';

interface D1Result {
  success: boolean;
  meta?: { changes?: number };
}

interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<D1Result>;
}

interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
}

interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
  NOTIFICATION_FROM_EMAIL: string;
  NOTIFICATION_TO_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
}

interface ExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void;
}

interface TurnstileResult {
  success: boolean;
  action?: string;
  hostname?: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function allowedOrigin(request: Request, env: Env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : '';
}

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin = '') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...(origin ? corsHeaders(origin) : {}) },
  });
}

async function verifyTurnstile(lead: ValidLead, request: Request, env: Env) {
  if (!env.TURNSTILE_SECRET_KEY) return false;

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: lead.turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP') || undefined,
      idempotency_key: lead.requestId,
    }),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as TurnstileResult;
  return result.success && (!result.action || result.action === 'lead_form');
}

async function storeLead(lead: ValidLead, env: Env) {
  return env.DB.prepare(`
    INSERT OR IGNORE INTO lead_submissions (
      id, request_type, property_type, location, budget, timeframe, features,
      name, phone, email, contact_preference, notes, source_url, referrer,
      privacy_policy_version, privacy_accepted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      lead.requestId,
      lead.requestType,
      lead.propertyType,
      lead.location,
      lead.budget || null,
      lead.timeframe || null,
      lead.features || null,
      lead.name,
      lead.phone || null,
      lead.email || null,
      lead.contactPreference,
      lead.notes || null,
      lead.sourceUrl || null,
      lead.referrer || null,
      '2026-07-16',
      new Date().toISOString(),
    )
    .run();
}

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true, service: 'gemut-leads' }, 200);
    }

    if (url.pathname !== '/api/leads') return json({ ok: false, message: 'Risorsa non trovata.' }, 404);

    const origin = allowedOrigin(request, env);
    if (!origin) return json({ ok: false, message: 'Origine non autorizzata.' }, 403);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== 'POST') return json({ ok: false, message: 'Metodo non consentito.' }, 405, origin);

    const contentType = request.headers.get('Content-Type') || '';
    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (!contentType.includes('application/json') || contentLength > 24_000) {
      return json({ ok: false, message: 'Richiesta non valida.' }, 415, origin);
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, message: 'Richiesta non valida.' }, 400, origin);
    }

    const validation = validateLeadPayload(payload);
    if (!validation.ok || !validation.value) {
      return json(
        { ok: false, message: 'Controlla i dati inseriti.', fieldErrors: validation.fieldErrors },
        422,
        origin,
      );
    }

    try {
      const verified = await verifyTurnstile(validation.value, request, env);
      if (!verified) {
        return json({ ok: false, message: 'Verifica antispam non riuscita. Riprova.' }, 400, origin);
      }

      const receivedAt = new Date().toISOString();
      const result = await storeLead(validation.value, env);
      if (!result.success) throw new Error('D1 insert failed');

      if (result.meta?.changes !== 0) {
        context.waitUntil(
          sendLeadNotification(
            validation.value,
            {
              from: env.NOTIFICATION_FROM_EMAIL,
              to: env.NOTIFICATION_TO_EMAIL,
              receivedAt,
            },
            {
              clientId: env.GMAIL_CLIENT_ID,
              clientSecret: env.GMAIL_CLIENT_SECRET,
              refreshToken: env.GMAIL_REFRESH_TOKEN,
            },
          ).catch((error: unknown) => {
            const message = error instanceof Error ? error.message : 'Unknown notification error';
            console.error('Lead notification failed', { requestId: validation.value?.requestId, message });
          }),
        );
      }

      return json({ ok: true, message: 'Richiesta salvata. Ti ricontatteremo entro un giorno lavorativo.' }, 201, origin);
    } catch {
      return json({ ok: false, message: 'Servizio momentaneamente non disponibile. Riprova tra poco.' }, 503, origin);
    }
  },
};
