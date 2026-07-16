import { spawnSync } from 'node:child_process';

const apiBase = 'https://api.cloudflare.com/client/v4';
const widgetName = 'Gemut Capital lead form';
const domains = ['gemutcapital.com', 'www.gemutcapital.com'];

function wrangler(args, input) {
  const result = spawnSync('wrangler', args, {
    encoding: 'utf8',
    input,
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Wrangler failed: ${args.join(' ')}`);
  }
  return result.stdout;
}

async function cloudflare(path, token, init) {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.errors?.map((error) => error.message).join('; ') || 'Cloudflare API error');
  }
  return body.result;
}

const identity = JSON.parse(wrangler(['whoami', '--json']));
const accounts = identity.accounts || identity.memberships || [];
const requestedAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const account = requestedAccountId
  ? accounts.find((item) => item.id === requestedAccountId || item.account?.id === requestedAccountId)
  : accounts.length === 1
    ? accounts[0]
    : null;

if (!account) {
  throw new Error('Imposta CLOUDFLARE_ACCOUNT_ID: l’utente appartiene a zero o più account Cloudflare.');
}

const accountId = account.id || account.account?.id;
const accountName = account.name || account.account?.name || accountId;
const auth = JSON.parse(wrangler(['auth', 'token', '--json']));
const token = auth.token;

const widgets = await cloudflare(
  `/accounts/${accountId}/challenges/widgets?per_page=100&filter=name:${encodeURIComponent(widgetName)}`,
  token,
);
const existing = widgets.find((widget) => widget.name === widgetName);

let widget;
if (existing) {
  widget = await cloudflare(
    `/accounts/${accountId}/challenges/widgets/${existing.sitekey}/rotate_secret`,
    token,
    { method: 'POST', body: JSON.stringify({ invalidate_immediately: true }) },
  );
} else {
  widget = await cloudflare(`/accounts/${accountId}/challenges/widgets`, token, {
    method: 'POST',
    body: JSON.stringify({ name: widgetName, domains, mode: 'managed' }),
  });
}

wrangler(
  ['secret', 'put', 'TURNSTILE_SECRET_KEY', '--config', 'cloudflare/wrangler.jsonc'],
  `${widget.secret}\n`,
);

process.stdout.write(`${JSON.stringify({ account: accountName, sitekey: widget.sitekey })}\n`);
