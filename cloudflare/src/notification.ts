import type { ValidLead } from './validation';

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailMessage {
  to: string | EmailAddress;
  from: string | EmailAddress;
  subject: string;
  text: string;
  html: string;
  replyTo?: string | EmailAddress;
}

export interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

const requestTypeLabels = {
  acquisto: 'Acquisto',
  vendita: 'Vendita',
  locazione: 'Locazione',
} as const;

const requestRoleLabels = {
  cerca: 'Ricerca immobile',
  proprietario: 'Bene proprio',
} as const;

const locationModeLabels = {
  text: 'Zona o indirizzo scritto',
  polygon: 'Area disegnata sulla mappa',
} as const;

const contactPreferenceLabels = {
  telefono: 'Telefono',
  email: 'Email',
  whatsapp: 'WhatsApp',
} as const;

function display(value: string) {
  return value || 'Non indicato';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function withoutHeaderBreaks(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function base64Utf8(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

function base64Url(value: string) {
  return base64Utf8(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function mimeBase64(value: string) {
  return base64Utf8(value).match(/.{1,76}/g)?.join('\r\n') || '';
}

function encodedHeader(value: string) {
  const safe = withoutHeaderBreaks(value);
  return /^[\x20-\x7e]*$/.test(safe) ? safe : `=?UTF-8?B?${base64Utf8(safe)}?=`;
}

function addressHeader(address: string | EmailAddress) {
  if (typeof address === 'string') return withoutHeaderBreaks(address);
  const email = withoutHeaderBreaks(address.email);
  return address.name ? `${encodedHeader(address.name)} <${email}>` : email;
}

export function buildLeadNotification(
  lead: ValidLead,
  options: { from: string; to: string; receivedAt: string },
): EmailMessage {
  const requestType = requestTypeLabels[lead.requestType];
  const contactPreference = contactPreferenceLabels[lead.contactPreference];
  const polygonVertices = lead.locationGeometry
    ? String(lead.locationGeometry.coordinates[0].length - 1)
    : 'Non applicabile';
  const fields = [
    ['Tipo richiesta', requestType],
    ['Ruolo', requestRoleLabels[lead.requestRole]],
    ['Nome', lead.name],
    ['Email', display(lead.email)],
    ['Telefono', display(lead.phone)],
    ['Contatto preferito', contactPreference],
    ['Tipo immobile', lead.propertyType],
    ['Modalità posizione', locationModeLabels[lead.locationMode]],
    ['Zona', lead.location],
    ['Vertici area', polygonVertices],
    ['Budget / valore', display(lead.budget)],
    ['Tempistiche', display(lead.timeframe)],
    ['Caratteristiche', display(lead.features)],
    ['Note', display(lead.notes)],
    ['Pagina di provenienza', display(lead.sourceUrl)],
    ['Referrer', display(lead.referrer)],
    ['Consenso privacy', 'Accettato'],
    ['Ricevuta il', options.receivedAt],
    ['ID richiesta', lead.requestId],
  ] as const;

  const text = [
    `Nuova richiesta ${requestType.toLowerCase()} dal sito Gemüt Capital`,
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
  ].join('\n');

  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;border-bottom:1px solid #ddd">${escapeHtml(label)}</th>` +
        `<td style="padding:8px 12px;white-space:pre-wrap;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  return {
    to: options.to,
    from: { email: options.from, name: 'Gemüt Capital' },
    replyTo: lead.email || undefined,
    subject: `Nuova richiesta ${requestType.toLowerCase()} — Gemüt Capital`,
    text,
    html:
      '<!doctype html><html lang="it"><body style="font-family:Arial,sans-serif;color:#15293a">' +
      `<h1 style="font-size:22px">Nuova richiesta ${escapeHtml(requestType.toLowerCase())}</h1>` +
      '<table style="width:100%;max-width:720px;border-collapse:collapse">' +
      rows +
      '</table></body></html>',
  };
}

export function buildGmailRawMessage(message: EmailMessage) {
  const boundary = 'gemut-lead-notification-boundary';
  const headers = [
    `From: ${addressHeader(message.from)}`,
    `To: ${addressHeader(message.to)}`,
    ...(message.replyTo ? [`Reply-To: ${addressHeader(message.replyTo)}`] : []),
    `Subject: ${encodedHeader(message.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];
  const mime = [
    ...headers,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    mimeBase64(message.text),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    mimeBase64(message.html),
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return base64Url(mime);
}

export async function sendGmailMessage(
  message: EmailMessage,
  credentials: GmailCredentials,
  fetcher: typeof fetch = fetch,
) {
  const tokenResponse = await fetcher('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const token = (await tokenResponse.json()) as { access_token?: string };

  if (!tokenResponse.ok || !token.access_token) {
    throw new Error(`Gmail OAuth failed (${tokenResponse.status})`);
  }

  const sendResponse = await fetcher('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: buildGmailRawMessage(message) }),
  });
  const result = (await sendResponse.json()) as { id?: string };

  if (!sendResponse.ok || !result.id) {
    throw new Error(`Gmail send failed (${sendResponse.status})`);
  }

  return { messageId: result.id };
}

export async function sendLeadNotification(
  lead: ValidLead,
  options: { from: string; to: string; receivedAt: string },
  credentials: GmailCredentials,
) {
  return sendGmailMessage(buildLeadNotification(lead, options), credentials);
}
