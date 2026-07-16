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

async function renderWizard(
  submitRequest = async () => ({ ok: true, message: 'Richiesta salvata.' }),
  { preserveDraft = false } = {},
) {
  if (!preserveDraft) domWindow.localStorage.removeItem('gemut-request-wizard-v1');
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

function progressScreen() {
  const progress = document.querySelector('[role="progressbar"]');
  assert.ok(progress, 'wizard progress must exist');
  return Number(progress.getAttribute('aria-valuenow'));
}

async function reachContactStep() {
  await click(button('Vendo casa'));
  const location = document.querySelector('input[autocomplete="street-address"]');
  assert.ok(location);
  await change(location, 'Padova Centro');
  await click(button('Continua'));
  await click(button('Appartamento'));
  await click(button('Da definire'));
  await click(button('Da definire'));
  await click(button('Vai ai contatti'));
  await change(document.getElementById('name'), 'Ada Lovelace');
  await change(document.getElementById('phone'), '3331234567');
  await click(button('Continua'));
  await change(document.getElementById('privacyAccepted'), true);
}

async function reachPropertyChoices(intentLabel) {
  await click(button(intentLabel));
  const location = document.querySelector('input[autocomplete="street-address"]');
  assert.ok(location, 'text location input must exist');
  await change(location, 'Padova Centro');
  await click(button('Continua'));
  await click(button('Appartamento'));
}

test('wizard intent cards use a mobile grid and advance immediately when activated', async () => {
  const rendered = await renderWizard();
  const firstIntent = button('Compro casa');
  const intentGrid = document.querySelector('[role="radiogroup"]');
  assert.ok(intentGrid);
  assert.equal(intentGrid.querySelectorAll('[role="radio"]').length, 4);
  assert.equal([...document.querySelectorAll('button')].some((candidate) => candidate.textContent.trim() === 'Continua'), false);
  assert.equal(firstIntent.textContent.includes('Voglio comprare casa'), true);
  firstIntent.focus();

  await keyDown(firstIntent, 'ArrowRight');
  assert.equal(stepHeading('Qual è il tuo obiettivo?').contains(document.activeElement), false);
  assert.equal(document.activeElement.textContent.trim().startsWith('Vendo casa'), true);
  assert.equal(document.activeElement.getAttribute('aria-checked'), 'true');

  await click(document.activeElement);
  assert.strictEqual(document.activeElement, stepHeading('Dove si trova l’immobile?'));

  await click(button('Indietro'));
  assert.strictEqual(document.activeElement, stepHeading('Qual è il tuo obiettivo?'));
  await click(button('Compro casa'));
  assert.strictEqual(document.activeElement, stepHeading('Disegna la zona'));
  await rendered.unmount();
});

test('wizard progress advances through every visible sub-screen', async () => {
  const rendered = await renderWizard();
  assert.equal(progressScreen(), 1);

  await click(button('Vendo casa'));
  assert.equal(progressScreen(), 2);
  const location = document.querySelector('input[autocomplete="street-address"]');
  assert.ok(location);
  await change(location, 'Padova Centro');
  await click(button('Continua'));
  assert.equal(progressScreen(), 3);
  await click(button('Appartamento'));
  assert.equal(progressScreen(), 4);
  await click(button('Da definire'));
  assert.equal(progressScreen(), 5);
  await click(button('Da definire'));
  assert.equal(progressScreen(), 6);
  await click(button('Vai ai contatti'));
  assert.equal(progressScreen(), 7);
  await change(document.getElementById('name'), 'Ada Lovelace');
  await change(document.getElementById('phone'), '3331234567');
  await click(button('Continua'));
  assert.equal(progressScreen(), 8);

  await rendered.unmount();
});

test('refresh restores the current sub-screen and entered form data', async () => {
  const firstRender = await renderWizard();
  await click(button('Vendo casa'));
  const location = document.querySelector('input[autocomplete="street-address"]');
  assert.ok(location);
  await change(location, 'Via Roma 10, Padova');
  await click(button('Continua'));
  await click(button('Appartamento'));
  await change(document.getElementById('budget-minimum'), '300.000');
  await change(document.getElementById('budget-maximum'), '400.000');
  await click(button('Continua'));
  await change(document.getElementById('timeframe-custom'), 'Entro settembre 2027');
  assert.equal(stepHeading('Quando?').textContent, 'Quando?');
  await firstRender.unmount();

  const restoredRender = await renderWizard(undefined, { preserveDraft: true });
  assert.equal(stepHeading('Quando?').textContent, 'Quando?');
  assert.equal(document.getElementById('timeframe-custom').value, 'Entro settembre 2027');
  await click(button('Indietro'));
  assert.equal(stepHeading('Budget').textContent, 'Budget');
  assert.equal(document.getElementById('budget-minimum').value, '300.000');
  assert.equal(document.getElementById('budget-maximum').value, '400.000');
  await click(button('Indietro'));
  assert.equal(document.querySelector('[role="radio"][aria-checked="true"]').textContent.trim(), 'Appartamento');
  await click(button('Indietro'));
  assert.equal(document.querySelector('input[autocomplete="street-address"]').value, 'Via Roma 10, Padova');
  await restoredRender.unmount();
});

test('owner intents accept only a street address, without map or suggested zones', async () => {
  const rendered = await renderWizard();
  await click(button('Vendo casa'));

  assert.equal(document.querySelector('[role="tablist"]'), null);
  assert.equal(document.querySelector('[aria-label="Zone suggerite"]'), null);
  const address = document.querySelector('input[autocomplete="street-address"]');
  assert.ok(address, 'street address input must exist');
  assert.equal(address.getAttribute('placeholder'), 'Es. via Roma 10, Padova');
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

test('budget uses minimum and maximum fields with the correct unit', async () => {
  const purchase = await renderWizard();
  await reachPropertyChoices('Vendo casa');

  assert.equal(stepHeading('Budget').textContent, 'Budget');
  assert.equal(document.getElementById('budget-minimum').placeholder, 'Es. 200.000');
  assert.equal(document.getElementById('budget-maximum').placeholder, 'Es. 200.000');
  assert.ok(button('Da definire'));
  assert.equal(document.body.textContent.includes('Fino a 200.000 €'), false);
  assert.equal(document.body.textContent.includes('€/mese'), false);
  await purchase.unmount();

  const rent = await renderWizard();
  await reachPropertyChoices('Metto in affitto');

  assert.equal(stepHeading('Budget').textContent, 'Budget');
  assert.equal(document.getElementById('budget-minimum').placeholder, 'Es. 800');
  assert.equal(document.getElementById('budget-maximum').placeholder, 'Es. 800');
  assert.equal(document.body.textContent.includes('€/mese'), true);
  assert.equal(document.body.textContent.includes('Altro importo'), false);
  await rent.unmount();
});

test('budget range and always-visible custom timeframe reach the existing payload fields', async () => {
  const requests = [];
  const rendered = await renderWizard(async (request) => {
    requests.push(request);
    return { ok: true, message: 'Richiesta salvata.' };
  });
  await reachPropertyChoices('Vendo casa');

  const budgetMinimum = document.getElementById('budget-minimum');
  const budgetMaximum = document.getElementById('budget-maximum');
  assert.ok(budgetMinimum, 'minimum budget input must exist');
  assert.ok(budgetMaximum, 'maximum budget input must exist');
  await change(budgetMinimum, '300.000');
  await change(budgetMaximum, '400.000');
  await click(button('Continua'));

  const customTimeframe = document.getElementById('timeframe-custom');
  assert.ok(customTimeframe, 'custom timeframe input must always exist');
  assert.equal(customTimeframe.labels[0].textContent.trim().startsWith('Altro periodo'), true);
  await change(customTimeframe, 'Entro settembre 2027');
  await click(button('Continua'));
  assert.ok(document.getElementById('features'), 'optional details must always be visible');
  assert.equal([...document.querySelectorAll('button')].some((candidate) => candidate.textContent.trim() === 'Aggiungi dettagli'), false);
  await click(button('Vai ai contatti'));
  await change(document.getElementById('name'), 'Ada Lovelace');
  await change(document.getElementById('phone'), '3331234567');
  await click(button('Continua'));
  await change(document.getElementById('privacyAccepted'), true);
  await click(button('Invia richiesta'));

  assert.equal(requests.length, 1);
  assert.equal(requests[0].budget, '300.000–400.000 €');
  assert.equal(requests[0].timeframe, 'Entro settembre 2027');
  await rendered.unmount();
});
