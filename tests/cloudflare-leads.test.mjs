import assert from 'node:assert/strict';
import test from 'node:test';
import { buildGmailRawMessage, buildLeadNotification, sendGmailMessage } from '../cloudflare/src/notification.ts';
import { validateLeadPayload } from '../cloudflare/src/validation.ts';

const now = 1_800_000_000_000;

function validPayload(overrides = {}) {
  return {
    requestId: '019f6a61-ba86-4b41-9c93-acbfd8bed42a',
    requestType: 'acquisto',
    propertyType: 'appartamento',
    location: 'Padova centro',
    budget: '250.000 €',
    timeframe: 'entro-3-mesi',
    features: 'Tre camere',
    name: 'Mario Rossi',
    phone: '+39 333 1234567',
    email: 'Mario@example.com',
    contactPreference: 'telefono',
    notes: '',
    privacyAccepted: true,
    turnstileToken: 'valid-test-token',
    website: '',
    startedAt: now - 10_000,
    sourceUrl: 'https://www.gemutcapital.com/richieste?type=acquisto',
    referrer: 'https://www.gemutcapital.com/immobili/casa-centro',
    ...overrides,
  };
}

test('Cloudflare lead validation accepts and normalizes a complete request', () => {
  const result = validateLeadPayload(validPayload(), now);

  assert.equal(result.ok, true);
  assert.equal(result.value.email, 'mario@example.com');
  assert.equal(result.value.requestType, 'acquisto');
});

test('Cloudflare lead validation requires a usable contact channel', () => {
  const result = validateLeadPayload(validPayload({ phone: '', email: '', contactPreference: 'email' }), now);

  assert.equal(result.ok, false);
  assert.match(result.fieldErrors.email, /Email|email/);
  assert.match(result.fieldErrors.phone, /telefono|Telefono/);
});

test('Cloudflare lead validation rejects honeypot and too-fast submissions', () => {
  const bot = validateLeadPayload(validPayload({ website: 'https://spam.test' }), now);
  const tooFast = validateLeadPayload(validPayload({ startedAt: now - 100 }), now);

  assert.equal(bot.ok, false);
  assert.equal(tooFast.ok, false);
  assert.equal(bot.fieldErrors.form, 'Invio non valido.');
  assert.equal(tooFast.fieldErrors.form, 'Invio non valido.');
});

test('Cloudflare lead validation enforces request types and privacy confirmation', () => {
  const result = validateLeadPayload(validPayload({ requestType: 'stima', privacyAccepted: false }), now);

  assert.equal(result.ok, false);
  assert.match(result.fieldErrors.requestType, /non valido/);
  assert.match(result.fieldErrors.privacyAccepted, /richiesto/);
});

test('lead notification contains normalized form data and a safe reply-to', () => {
  const validation = validateLeadPayload(validPayload({ notes: '<b>Richiamare & verificare</b>' }), now);
  const message = buildLeadNotification(validation.value, {
    from: 'filippo@gemutcapital.com',
    to: 'filippo@gemutcapital.com',
    receivedAt: '2026-07-16T12:00:00.000Z',
  });

  assert.equal(message.to, 'filippo@gemutcapital.com');
  assert.equal(message.replyTo, 'mario@example.com');
  assert.match(message.subject, /Nuova richiesta acquisto/);
  assert.match(message.text, /Mario Rossi/);
  assert.match(message.text, /250\.000 €/);
  assert.match(message.html, /&lt;b&gt;Richiamare &amp; verificare&lt;\/b&gt;/);
  assert.doesNotMatch(message.text, /valid-test-token/);
});

test('lead notification omits reply-to when customer provides only a phone number', () => {
  const validation = validateLeadPayload(validPayload({ email: '', contactPreference: 'telefono' }), now);
  const message = buildLeadNotification(validation.value, {
    from: 'filippo@gemutcapital.com',
    to: 'filippo@gemutcapital.com',
    receivedAt: '2026-07-16T12:00:00.000Z',
  });

  assert.equal(message.replyTo, undefined);
  assert.match(message.text, /Email: Non indicato/);
});

test('Gmail MIME payload preserves reply-to and UTF-8 content', () => {
  const validation = validateLeadPayload(validPayload(), now);
  const message = buildLeadNotification(validation.value, {
    from: 'filippo@gemutcapital.com',
    to: 'filippo@gemutcapital.com',
    receivedAt: '2026-07-16T12:00:00.000Z',
  });
  const raw = buildGmailRawMessage(message);
  const mime = Buffer.from(raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');

  assert.match(mime, /From: =\?UTF-8\?B\?.+\?= <filippo@gemutcapital\.com>/);
  assert.match(mime, /Reply-To: mario@example\.com/);
  assert.match(mime, /Content-Type: multipart\/alternative/);
  assert.doesNotMatch(mime, /valid-test-token/);
});

test('Gmail transport exchanges refresh token and sends encoded message', async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    if (url.includes('oauth2.googleapis.com')) {
      return Response.json({ access_token: 'access-token' });
    }
    return Response.json({ id: 'gmail-message-id' });
  };
  const result = await sendGmailMessage(
    {
      from: 'filippo@gemutcapital.com',
      to: 'filippo@gemutcapital.com',
      subject: 'Test',
      text: 'Testo',
      html: '<p>Testo</p>',
    },
    { clientId: 'client-id', clientSecret: 'client-secret', refreshToken: 'refresh-token' },
    fetcher,
  );

  assert.equal(result.messageId, 'gmail-message-id');
  assert.equal(calls.length, 2);
  assert.match(String(calls[0].options.body), /grant_type=refresh_token/);
  assert.equal(calls[1].options.headers.Authorization, 'Bearer access-token');
  assert.ok(JSON.parse(calls[1].options.body).raw);
});
