import { useState, type KeyboardEvent, type ReactNode } from 'react';
import type { LeadRequest } from '../../lib/leads';

const propertyTypes = [
  ['appartamento', 'Appartamento'], ['villa', 'Villa o casa'], ['commerciale', 'Ufficio o commerciale'],
  ['terreno', 'Terreno'], ['altro', 'Altro'],
] as const;
const budgetOptions = ['Da definire', 'Fino a 200.000 €', '200.000–350.000 €', '350.000–500.000 €', 'Oltre 500.000 €'] as const;
const timeframeOptions = [['subito', 'Il prima possibile'], ['entro-3-mesi', 'Entro 3 mesi'], ['entro-6-mesi', 'Entro 6 mesi'], ['oltre-6-mesi', 'Oltre 6 mesi'], ['da-definire', 'Da definire']] as const;

type FormErrors = Partial<Record<keyof LeadRequest, string>>;
type UpdateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => void;

interface Props {
  form: LeadRequest;
  errors: FormErrors;
  updateField: UpdateField;
  locationSlot: ReactNode;
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

function radioTabIndex(active: boolean, index: number, hasValue: boolean) {
  return active || (!hasValue && index === 0) ? 0 : -1;
}

export default function PropertyDetailsStep({ form, errors, updateField, locationSlot }: Props) {
  const [showDetails, setShowDetails] = useState(Boolean(form.features));
  const hasLocation = Boolean(form.location.trim());
  const budgetLabel = form.requestRole === 'proprietario'
    ? 'Valore o canone desiderato'
    : form.requestType === 'locazione'
      ? 'Canone mensile indicativo'
      : 'Budget massimo';

  return (
    <fieldset className="grid gap-6">
      <legend className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">Dettagli dell’immobile</legend>
      <p className="text-sm leading-6 text-[var(--graphite)]">
        Una risposta alla volta: puoi scegliere “Da definire” quando non hai ancora deciso.
      </p>

      {locationSlot}

      {hasLocation && (
        <fieldset className="grid gap-3">
          <legend id="propertyType-label" className="text-base font-semibold text-[var(--ink)]">Che tipo di immobile?</legend>
          <div
            className="grid grid-cols-2 gap-3 md:grid-cols-3"
            role="radiogroup"
            aria-labelledby="propertyType-label"
            aria-invalid={Boolean(errors.propertyType)}
            aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
          >
            {propertyTypes.map(([value, label], index) => {
              const active = form.propertyType === value;
              return (
                <button
                  key={value}
                  id={active || (!form.propertyType && index === 0) ? 'propertyType' : undefined}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={radioTabIndex(active, index, Boolean(form.propertyType))}
                  onClick={() => updateField('propertyType', value)}
                  onKeyDown={moveRadioFocus}
                  className={`focus-ring min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? 'border-[var(--ink)] bg-[var(--brand-blue)] shadow-[inset_0_0_0_1px_var(--ink)]'
                      : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.propertyType && <p id="propertyType-error" className="text-sm font-medium text-red-700">{errors.propertyType}</p>}
        </fieldset>
      )}

      {form.propertyType && (
        <fieldset className="grid gap-3">
          <legend id="budget-label" className="text-base font-semibold text-[var(--ink)]">{budgetLabel}</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="budget-label">
            {budgetOptions.map((option, index) => {
              const active = form.budget === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={radioTabIndex(active, index, Boolean(form.budget))}
                  onClick={() => updateField('budget', option)}
                  onKeyDown={moveRadioFocus}
                  className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {form.budget && (
        <fieldset className="grid gap-3">
          <legend id="timeframe-label" className="text-base font-semibold text-[var(--ink)]">Quando?</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="timeframe-label">
            {timeframeOptions.map(([value, label], index) => {
              const active = form.timeframe === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={radioTabIndex(active, index, Boolean(form.timeframe))}
                  onClick={() => updateField('timeframe', value)}
                  onKeyDown={moveRadioFocus}
                  className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {form.timeframe && (
        <div className="grid gap-3">
          <button
            type="button"
            className="focus-ring min-h-11 w-fit rounded-lg border border-[var(--control-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
            aria-expanded={showDetails}
            aria-controls="features-panel"
            onClick={() => setShowDetails((current) => !current)}
          >
            {showDetails ? 'Nascondi dettagli' : 'Aggiungi dettagli'}
          </button>
          {showDetails && (
            <label id="features-panel" className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="features">
              Dettagli facoltativi
              <textarea
                id="features"
                className="field-control min-h-28 rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal outline-none transition"
                value={form.features}
                onChange={(event) => updateField('features', event.target.value)}
                rows={4}
                placeholder="Spazi, condizioni, vincoli o risultati importanti…"
              />
            </label>
          )}
        </div>
      )}
    </fieldset>
  );
}
