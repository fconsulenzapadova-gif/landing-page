import assert from 'node:assert/strict';
import test from 'node:test';
import { Window } from 'happy-dom';
import { createServer } from 'vite';

const domWindow = new Window({ url: 'http://localhost/richieste?type=acquisto' });
const exposedGlobals = [
  'Node', 'Element', 'HTMLElement', 'HTMLInputElement', 'HTMLButtonElement',
  'SVGElement', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent',
  'MutationObserver', 'DOMException', 'CustomEvent',
];

globalThis.window = domWindow;
globalThis.document = domWindow.document;
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: domWindow.navigator,
});
globalThis.getComputedStyle = domWindow.getComputedStyle.bind(domWindow);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
for (const name of exposedGlobals) globalThis[name] = domWindow[name];

domWindow.matchMedia = () => ({
  matches: true,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() { return true; },
});
domWindow.scrollTo = () => {};
globalThis.matchMedia = domWindow.matchMedia;
globalThis.requestAnimationFrame = domWindow.requestAnimationFrame.bind(domWindow);
globalThis.cancelAnimationFrame = domWindow.cancelAnimationFrame.bind(domWindow);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

const script = document.createElement('script');
script.id = 'cloudflare-turnstile-script';
document.head.appendChild(script);
domWindow.turnstile = {
  render(_container, options) {
    options.callback('test-turnstile-token');
    return 'widget-1';
  },
  remove() {},
};

let React;
let act;
let createRoot;
let MemoryRouter;
let RequestsPage;
let vite;

test.before(async () => {
  React = await import('react');
  ({ act } = React);
  ({ createRoot } = await import('react-dom/client'));
  ({ MemoryRouter } = await import('react-router-dom'));
  vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    logLevel: 'silent',
    plugins: [{
      name: 'test-page-animations',
      enforce: 'pre',
      resolveId(source) {
        if (source === '../lib/usePageAnimations') return '\0test-page-animations';
        if (source === '../components/RequestSuccess') return '\0test-request-success';
      },
      load(id) {
        if (id === '\0test-page-animations') return 'export function usePageAnimations() {}';
        if (id === '\0test-request-success') {
          return `
            import React from 'react';
            export default function RequestSuccess({ onReset }) {
              return React.createElement(
                'section',
                null,
                React.createElement('h1', null, 'Grazie!'),
                React.createElement('button', { type: 'button', onClick: onReset }, 'Nuova richiesta'),
              );
            }
          `;
        }
      },
    }],
  });
  ({ default: RequestsPage } = await vite.ssrLoadModule('/src/pages/RequestsPage.tsx'));
});

test.after(async () => {
  await domWindow.happyDOM.close();
  await vite?.close();
});

async function flush() {
  await act(async () => {
    await new Promise((resolve) => domWindow.setTimeout(resolve, 20));
  });
}

async function renderWizard(submitRequest = async () => ({ ok: true, message: 'Richiesta salvata.' })) {
  document.body.innerHTML = '<div id="root"></div>';
  const container = document.getElementById('root');
  const root = createRoot(container);

  await act(async () => {
    root.render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/richieste?type=acquisto'] },
        React.createElement(RequestsPage, { submitRequest }),
      ),
    );
  });
  await flush();

  return {
    container,
    async unmount() {
      await act(async () => root.unmount());
    },
  };
}

function button(label, container = document) {
  const match = [...container.querySelectorAll('button')]
    .find((candidate) => candidate.textContent.trim().startsWith(label));
  assert.ok(match, `button "${label}" must exist; body: ${document.body.textContent.trim()}`);
  return match;
}

async function click(element) {
  element.focus();
  await act(async () => {
    element.dispatchEvent(new domWindow.MouseEvent('click', { bubbles: true }));
  });
  await flush();
}

async function keyDown(element, key) {
  await act(async () => {
    element.dispatchEvent(new domWindow.KeyboardEvent('keydown', { key, bubbles: true }));
  });
  await flush();
}

async function change(element, value) {
  await act(async () => {
    if (element.type === 'checkbox') {
      if (element.checked !== value) element.click();
      return;
    }
    const setter = Object.getOwnPropertyDescriptor(element.constructor.prototype, 'value')?.set;
    assert.ok(setter, 'value setter must exist');
    setter.call(element, value);
    element.dispatchEvent(new domWindow.Event('input', { bubbles: true }));
    element.dispatchEvent(new domWindow.Event('change', { bubbles: true }));
  });
  await flush();
}

function stepHeading(expectedText) {
  const heading = document.getElementById('request-step-heading');
  assert.ok(heading, 'current step heading must expose a stable focus target');
  assert.equal(heading.textContent.trim(), expectedText);
  return heading;
}

async function reachContactStep() {
  await click(button('Vendo casa'));
  await click(button('Continua'));
  const location = document.querySelector('input[autocomplete="street-address"]');
  assert.ok(location);
  await change(location, 'Padova Centro');
  await click(button('Appartamento'));
  await click(button('Continua'));
  await change(document.getElementById('name'), 'Ada Lovelace');
  await change(document.getElementById('phone'), '3331234567');
  await change(document.getElementById('privacyAccepted'), true);
}

test('wizard keyboard selection stays reachable and every forward/back step focuses its heading', async () => {
  const rendered = await renderWizard();
  const firstIntent = button('Compro casa');
  firstIntent.focus();

  await keyDown(firstIntent, 'ArrowRight');
  assert.equal(stepHeading('Qual è il tuo obiettivo?').contains(document.activeElement), false);
  assert.equal(document.activeElement.textContent.trim().startsWith('Vendo casa'), true);

  await click(button('Continua'));
  assert.strictEqual(document.activeElement, stepHeading('Dettagli dell’immobile'));

  await click(button('Indietro'));
  assert.strictEqual(document.activeElement, stepHeading('Qual è il tuo obiettivo?'));
  await rendered.unmount();
});

test('successful submit uses injected API and reset focuses the first step heading', async () => {
  const requests = [];
  const rendered = await renderWizard(async (request) => {
    requests.push(request);
    return { ok: true, message: 'Richiesta salvata.' };
  });

  await reachContactStep();
  await click(button('Invia richiesta'));
  assert.equal(requests.length, 1, document.body.textContent.trim());
  assert.equal(document.body.textContent.includes('Grazie!'), true);

  await click(button('Nuova richiesta'));
  assert.strictEqual(document.activeElement, stepHeading('Qual è il tuo obiettivo?'));
  await rendered.unmount();
});

test('API intent errors return to step zero, expose description and focus the intent target', async () => {
  const rendered = await renderWizard(async () => ({
    ok: false,
    message: 'Controlla i dati inseriti.',
    fieldErrors: {
      requestType: 'Tipo richiesta non valido.',
      requestRole: 'Ruolo richiesta non valido.',
    },
  }));

  await reachContactStep();
  await click(button('Invia richiesta'));

  const heading = stepHeading('Qual è il tuo obiettivo?');
  assert.strictEqual(document.activeElement, heading);
  assert.equal(heading.getAttribute('aria-invalid'), 'true');
  assert.equal(heading.getAttribute('aria-describedby'), 'request-intent-error');
  assert.equal(document.getElementById('request-intent-error').textContent, 'Tipo richiesta non valido.');
  await rendered.unmount();
});
