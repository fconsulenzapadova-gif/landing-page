import type { KeyboardEvent } from 'react';
import {
  requestIntents,
  type RequestIntent,
  type RequestIntentValue,
} from '../../lib/requestWizard';
import { getNextIntentIndex } from '../../lib/requestWizardFlow';

interface Props {
  value: RequestIntentValue;
  onChange: (intent: RequestIntent) => void;
}

function moveRadioFocus(event: KeyboardEvent<HTMLButtonElement>) {
  const radios = Array.from(
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
  );
  const currentIndex = radios.indexOf(event.currentTarget);
  if (currentIndex < 0) return;

  const nextIndex = getNextIntentIndex(event.key, currentIndex, radios.length);
  if (nextIndex === null) return;

  event.preventDefault();
  radios[nextIndex]?.focus();
  radios[nextIndex]?.click();
}

export default function RequestIntentSelector({ value, onChange }: Props) {
  return (
    <fieldset className="grid gap-5">
      <legend className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        Qual è il tuo obiettivo?
      </legend>
      <p className="text-sm leading-6 text-[var(--graphite)]">
        Scegli il percorso: le domande successive si adatteranno alla tua richiesta.
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4" role="radiogroup" aria-label="Obiettivo richiesta">
        {requestIntents.map((intent, index) => {
          const active = value === intent.value;
          return (
            <button
              key={intent.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active || (!value && index === 0) ? 0 : -1}
              onClick={() => onChange(intent)}
              onKeyDown={moveRadioFocus}
              className={`focus-ring min-h-28 rounded-lg border p-4 text-left transition ${
                active
                  ? 'border-[var(--ink)] bg-[var(--brand-blue)] shadow-[inset_0_0_0_1px_var(--ink)]'
                  : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
              }`}
            >
              <span className="block font-semibold text-[var(--ink)]">{intent.label}</span>
              <span className="mt-2 block text-sm leading-6 text-[var(--graphite)]">{intent.description}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
