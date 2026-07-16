import { execFileSync, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { sendGmailMessage } from '../cloudflare/src/notification.ts';

const keychainAccount = 'codex-gemut-gmail-oauth';
const clientIdService = 'codex-gemut-gmail-client-id';
const clientSecretService = 'codex-gemut-gmail-client-secret';
const scope = 'https://www.googleapis.com/auth/gmail.send';

function keychainValue(service) {
  return execFileSync('security', [
    'find-generic-password',
    '-a',
    keychainAccount,
    '-s',
    service,
    '-w',
  ], { encoding: 'utf8' }).trim();
}

function removeKeychainValue(service) {
  try {
    execFileSync('security', ['delete-generic-password', '-a', keychainAccount, '-s', service], {
      stdio: 'ignore',
    });
  } catch {
    // The temporary item may already have been removed.
  }
}

const clientId = keychainValue(clientIdService);
const clientSecret = keychainValue(clientSecretService);
const state = randomBytes(24).toString('hex');

const result = await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    server.close();
    reject(new Error('Google OAuth authorization timed out'));
  }, 5 * 60 * 1000);

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', 'http://127.0.0.1');
      if (url.pathname !== '/oauth2callback') {
        response.writeHead(404).end('Not found');
        return;
      }
      if (url.searchParams.get('state') !== state) throw new Error('Invalid OAuth state');
      if (url.searchParams.get('error')) throw new Error(`Google OAuth: ${url.searchParams.get('error')}`);

      const code = url.searchParams.get('code');
      if (!code) throw new Error('Missing authorization code');

      const redirectUri = `http://127.0.0.1:${server.address().port}/oauth2callback`;
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });
      const token = await tokenResponse.json();
      if (!tokenResponse.ok || !token.refresh_token) {
        throw new Error(`Google token exchange failed (${tokenResponse.status})`);
      }

      const wrangler = spawnSync(
        process.execPath,
        [
          'node_modules/wrangler/bin/wrangler.js',
          'secret',
          'put',
          'GMAIL_REFRESH_TOKEN',
          '--config',
          'cloudflare/wrangler.jsonc',
        ],
        { cwd: process.cwd(), encoding: 'utf8', input: token.refresh_token },
      );
      if (wrangler.status !== 0) throw new Error('Unable to store Gmail refresh token in Cloudflare');

      await sendGmailMessage(
        {
          from: 'filippo@gemutcapital.com',
          to: 'filippo@gemutcapital.com',
          subject: 'Test notifiche sito — Gemüt Capital',
          text: 'Configurazione completata. Le nuove richieste dal sito genereranno questa notifica.',
          html: '<p><strong>Configurazione completata.</strong></p><p>Le nuove richieste dal sito genereranno questa notifica.</p>',
        },
        { clientId, clientSecret, refreshToken: token.refresh_token },
      );

      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Autorizzazione completata. Puoi chiudere questa scheda.');
      resolve({ secretStored: true, testSent: true });
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Autorizzazione non completata. Torna a Codex.');
      reject(error);
    } finally {
      clearTimeout(timeout);
      server.close();
    }
  });

  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
    const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authorizationUrl.search = new URLSearchParams({
      access_type: 'offline',
      client_id: clientId,
      include_granted_scopes: 'false',
      login_hint: 'filippo@gemutcapital.com',
      prompt: 'consent',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      state,
    }).toString();

    console.log(`AUTH_URL=${authorizationUrl}`);
  });
});

removeKeychainValue(clientIdService);
removeKeychainValue(clientSecretService);
console.log(`OAuth complete: secret=${result.secretStored}, test_email=${result.testSent}`);
