import { useState, type KeyboardEvent, type ReactNode } from 'react';
import type { LeadRequest } from '../../lib/leads';

const propertyTypes = [
  ['appartamento', 'Appartamento'], ['villa', 'Villa o casa'], ['commerciale', 'Ufficio o commerciale'],
  ['terreno', 'Terreno'], ['altro', 'Altro'],
] as const;
const purchaseBudgetOptions = ['Da definire', 'Fino a 200.000 €', '200.000–350.000 €', '350.000–500.000 €', 'Oltre 500.000 €'] as const;
const rentBudgetOptions = ['Da definire', 'Fino a 800 €/mese', '800–1.200 €/mese', '1.200–1.800 €/mese', 'Oltre 1.800 €/mese'] as const;
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

function includesOption(options: readonly string[], value: string) {
  return options.includes(value);
}

export default function PropertyDetailsStep({ form, errors, updateField, locationSlot }: Props) {
  const budgetOptions = form.requestType === 'locazione' ? rentBudgetOptions : purchaseBudgetOptions;
  const hasPresetBudget = includesOption(budgetOptions, form.budget);
  const hasPresetTimeframe = timeframeOptions.some(([value]) => value === form.timeframe);
  const [showDetails, setShowDetails] = useState(Boolean(form.features));
  const [budgetMode, setBudgetMode] = useState<'preset' | 'custom'>(
    form.budget && !hasPresetBudget ? 'custom' : 'preset',
  );
  const [timeframeMode, setTimeframeMode] = useState<'preset' | 'custom'>(
    form.timeframe && !hasPresetTimeframe ? 'custom' : 'preset',
  );
  const [customBudgetDraft, setCustomBudgetDraft] = useState(hasPresetBudget ? '' : form.budget);
  const [customTimeframeDraft, setCustomTimeframeDraft] = useState(hasPresetTimeframe ? '' : form.timeframe);
  const hasLocation = Boolean(form.location.trim());
  const hasBudgetSelection = budgetMode === 'custom' || Boolean(form.budget);
  const hasTimeframeSelection = timeframeMode === 'custom' || Boolean(form.timeframe);
  const budgetLabel = form.requestRole === 'proprietario'
    ? 'Valore o canone desiderato'
    : form.requestType === 'locazione'
      ? 'Canone mensile indicativo'
      : 'Budget massimo';

  return (
    <fieldset className="grid gap-6">
      <legend
        id="request-step-heading"
        className="font-display text-3xl leading-tight text-[var(--ink)] outline-none sm:text-4xl"
        tabIndex={-1}
      >
        Dettagli dell’immobile
      </legend>
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
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="budget-label"
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? 'budget-error' : undefined}
          >
            {budgetOptions.map((option, index) => {
              const active = budgetMode === 'preset' && form.budget === option;
              return (
                <button
                  key={option}
                  id={active || (!hasBudgetSelection && index === 0) ? 'budget' : undefined}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={radioTabIndex(active, index, hasBudgetSelection)}
                  onClick={() => {
                    setBudgetMode('preset');
                    updateField('budget', option);
                  }}
                  onKeyDown={moveRadioFocus}
                  className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
            <button
              id={budgetMode === 'custom' ? 'budget' : undefined}
              type="button"
              role="radio"
              aria-checked={budgetMode === 'custom'}
              tabIndex={budgetMode === 'custom' ? 0 : -1}
              onClick={() => {
                setBudgetMode('custom');
                updateField('budget', customBudgetDraft);
              }}
              onKeyDown={moveRadioFocus}
              className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                budgetMode === 'custom' ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
              }`}
            >
              Altro importo
            </button>
          </div>
          {budgetMode === 'custom' && (
            <label className="grid max-w-xl gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="budget-custom">
              Budget personalizzato
              <input
                id="budget-custom"
                type="text"
                value={customBudgetDraft}
                onChange={(event) => {
                  setCustomBudgetDraft(event.target.value);
                  updateField('budget', event.target.value);
                }}
                aria-label="Budget personalizzato"
                aria-invalid={Boolean(errors.budget)}
                aria-describedby={errors.budget ? 'budget-error' : undefined}
                className="field-control min-h-11 w-full rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal outline-none transition"
                placeholder="Es. 300.000–400.000 €"
              />
            </label>
          )}
          {errors.budget && <p id="budget-error" className="text-sm font-medium text-red-700" role="alert">{errors.budget}</p>}
        </fieldset>
      )}

      {form.budget && (
        <fieldset className="grid gap-3">
          <legend id="timeframe-label" className="text-base font-semibold text-[var(--ink)]">Quando?</legend>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="timeframe-label"
            aria-invalid={Boolean(errors.timeframe)}
            aria-describedby={errors.timeframe ? 'timeframe-error' : undefined}
          >
            {timeframeOptions.map(([value, label], index) => {
              const active = timeframeMode === 'preset' && form.timeframe === value;
              return (
                <button
                  key={value}
                  id={active || (!hasTimeframeSelection && index === 0) ? 'timeframe' : undefined}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={radioTabIndex(active, index, hasTimeframeSelection)}
                  onClick={() => {
                    setTimeframeMode('preset');
                    updateField('timeframe', value);
                  }}
                  onKeyDown={moveRadioFocus}
                  className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              id={timeframeMode === 'custom' ? 'timeframe' : undefined}
              type="button"
              role="radio"
              aria-checked={timeframeMode === 'custom'}
              tabIndex={timeframeMode === 'custom' ? 0 : -1}
              onClick={() => {
                setTimeframeMode('custom');
                updateField('timeframe', customTimeframeDraft);
              }}
              onKeyDown={moveRadioFocus}
              className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                timeframeMode === 'custom' ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
              }`}
            >
              Altro periodo
            </button>
          </div>
          {timeframeMode === 'custom' && (
            <label className="grid max-w-xl gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="timeframe-custom">
              Tempistica personalizzata
              <input
                id="timeframe-custom"
                type="text"
                value={customTimeframeDraft}
                onChange={(event) => {
                  setCustomTimeframeDraft(event.target.value);
                  updateField('timeframe', event.target.value);
                }}
                aria-label="Tempistica personalizzata"
                aria-invalid={Boolean(errors.timeframe)}
                aria-describedby={errors.timeframe ? 'timeframe-error' : undefined}
                className="field-control min-h-11 w-full rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal outline-none transition"
                placeholder="Es. Entro settembre 2027"
              />
            </label>
          )}
          {errors.timeframe && <p id="timeframe-error" className="text-sm font-medium text-red-700" role="alert">{errors.timeframe}</p>}
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
