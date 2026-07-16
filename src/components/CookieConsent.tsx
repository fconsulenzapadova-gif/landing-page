import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setIsVisible(true);
      return;
    }

    try {
      setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
    } catch {
      setIsVisible(true);
    }
  }, []);

  const save = (nextPreferences: CookiePreferences) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
    setPreferences(nextPreferences);
    setIsVisible(false);
    setIsPanelOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--line)] bg-[var(--paper-soft)] p-4 shadow-2xl">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-base font-bold text-[var(--ink)]">Preferenze cookie</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--graphite)]">
              Usiamo cookie tecnici necessari. Le preferenze analytics e marketing vengono salvate, ma in questa versione non caricano script esterni.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="focus-ring rounded-lg border border-[var(--control-border)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--brand-blue)]"
              onClick={() => setIsPanelOpen((open) => !open)}
            >
              Personalizza
            </button>
            <button
              type="button"
              className="focus-ring rounded-lg border border-[var(--control-border)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--brand-blue)]"
              onClick={() => save(defaultPreferences)}
            >
              Rifiuta
            </button>
            <button
              type="button"
              className="focus-ring rounded-lg bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:ring-2 hover:ring-[var(--ink)]"
              onClick={() => save({ necessary: true, analytics: true, marketing: true })}
            >
              Accetta
            </button>
          </div>
        </div>

        {isPanelOpen && (
          <div className="mt-4 grid gap-3 rounded-lg border border-[var(--line)] bg-white p-4 sm:grid-cols-3">
            <label className="flex items-center justify-between gap-3 rounded-lg bg-[var(--paper-soft)] p-3 text-sm">
              Necessari
              <input type="checkbox" checked disabled />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg bg-[var(--paper-soft)] p-3 text-sm">
              Analytics
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(event) => setPreferences((current) => ({ ...current, analytics: event.target.checked }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg bg-[var(--paper-soft)] p-3 text-sm">
              Marketing
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(event) => setPreferences((current) => ({ ...current, marketing: event.target.checked }))}
              />
            </label>
            <button
              type="button"
              className="focus-ring rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white sm:col-span-3"
              onClick={() => save(preferences)}
            >
              Salva preferenze
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
