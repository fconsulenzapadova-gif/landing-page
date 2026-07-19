import type { KeyboardEvent } from 'react';
import { BadgeCheck, Home, KeyRound, Tag, type LucideIcon } from 'lucide-react';
import {
  requestIntents,
  type RequestIntent,
  type RequestIntentValue,
} from '../../lib/requestWizard';
import { getNextIntentIndex } from '../../lib/requestWizardFlow';

interface Props {
  value: RequestIntentValue;
  onChange: (intent: RequestIntent) => void;
  onSelect: (intent: RequestIntent) => void;
  error?: string;
}

const intentIcons: Record<RequestIntentValue, LucideIcon> = {
  acquisto: Home,
  vendita: Tag,
  'locazione-cerca': KeyRound,
  'locazione-proprietario': BadgeCheck,
};

function moveRadioFocus(
  event: KeyboardEvent<HTMLButtonElement>,
  onChange: (intent: RequestIntent) => void,
) {
  const radios = Array.from(
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
  );
  const currentIndex = radios.indexOf(event.currentTarget);
  if (currentIndex < 0) return;

  const nextIndex = getNextIntentIndex(event.key, currentIndex, radios.length);
  if (nextIndex === null) return;

  event.preventDefault();
  radios[nextIndex]?.focus();
  onChange(requestIntents[nextIndex]);
}

export default function RequestIntentSelector({ value, onChange, onSelect, error }: Props) {
  return (
    <fieldset className="request-intent-screen flex min-h-0 flex-1 flex-col">
      <legend
        id="request-step-heading"
        className="request-intent-heading mx-auto flex max-w-2xl flex-col items-center gap-3 text-center font-display text-4xl leading-tight text-[var(--ink)] outline-none sm:text-5xl"
        tabIndex={-1}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'request-intent-error' : undefined}
      >
        Qual è il tuo obiettivo?
      </legend>
      <p className="request-intent-description text-center text-base leading-7 text-[var(--graphite)] sm:text-lg">
        Scegli il percorso: le domande successive si adatteranno alla tua richiesta.
      </p>
      <div className="request-screen-scroll flex min-h-0 flex-1 items-start overflow-y-auto overscroll-contain">
        <div className="request-screen-center grid w-full grid-cols-2 gap-3 lg:grid-cols-4" role="radiogroup" aria-label="Obiettivo richiesta">
          {requestIntents.map((intent, index) => {
            const active = value === intent.value;
            const IntentIcon = intentIcons[intent.value];
            return (
              <button
                key={intent.value}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active || (!value && index === 0) ? 0 : -1}
                onClick={() => onSelect(intent)}
                onKeyDown={(event) => moveRadioFocus(event, onChange)}
                className={`request-intent-card focus-ring flex min-h-36 flex-col items-center justify-center rounded-lg border px-5 py-6 text-center transition ${
                  active
                    ? 'border-[var(--ink)] bg-[var(--brand-blue)] shadow-[inset_0_0_0_1px_var(--ink)]'
                    : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)] hover:bg-[var(--paper-soft)]'
                }`}
              >
                <IntentIcon className="request-intent-icon mb-4 h-8 w-8 stroke-[1.8] text-[var(--ink)]" aria-hidden="true" />
                <span className="request-intent-label text-sm font-bold uppercase tracking-[0.02em] text-[var(--ink)]">{intent.label}</span>
                <span className="request-intent-card-description mt-2 text-xs leading-5 text-[var(--graphite)]">{intent.description}</span>
              </button>
            );
          })}
        </div>
      </div>
      {error && (
        <p id="request-intent-error" className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
