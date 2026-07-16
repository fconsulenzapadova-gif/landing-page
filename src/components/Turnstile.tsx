import { useEffect, useRef, useState } from 'react';

const scriptId = 'cloudflare-turnstile-script';
const scriptUrl = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const localTestSitekey = '1x00000000000000000000BB';
const localHostnames = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      cData: string;
      theme: 'light';
      size: 'flexible';
      appearance: 'interaction-only';
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileProps {
  requestId: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
}

function loadScript() {
  const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (existing) {
    if (window.turnstile) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Turnstile non disponibile')), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile non disponibile')), { once: true });
    document.head.appendChild(script);
  });
}

export default function Turnstile({ requestId, onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const isLocal = localHostnames.has(window.location.hostname);
  const sitekey = isLocal ? localTestSitekey : import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || '';

  useEffect(() => {
    let active = true;
    let widgetId = '';

    if (!sitekey) {
      setLoadError(true);
      return undefined;
    }

    loadScript()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey,
          action: 'lead_form',
          cData: requestId.replace(/-/g, '').slice(0, 32),
          theme: 'light',
          size: 'flexible',
          appearance: 'interaction-only',
          callback: onVerify,
          'expired-callback': onExpire,
          'error-callback': () => {
            onExpire();
            setLoadError(true);
          },
        });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onExpire, onVerify, requestId, sitekey]);

  if (loadError) {
    return (
      <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">
        Verifica antispam non disponibile. Ricarica la pagina o contattaci direttamente.
      </p>
    );
  }

  return <div ref={containerRef} aria-label="Verifica antispam" />;
}
