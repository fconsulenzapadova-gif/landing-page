import type { KeyboardEvent } from 'react';
import {
  requestIntents,
  type RequestIntent,
  type RequestIntentValue,
} from '../../lib/requestWizard';

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

  let nextIndex: number | undefined;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % radios.length;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + radios.length) % radios.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = radios.length - 1;
  if (nextIndex === undefined) return;

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
      {/* requestIntents renders: Compro casa, Vendo casa, Cerco in affitto, Metto in affitto. */}
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
