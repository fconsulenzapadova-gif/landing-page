import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { LeadRequest } from '../../lib/leads';

const propertyTypes = [
  ['appartamento', 'Appartamento'], ['villa', 'Villa o casa'], ['commerciale', 'Ufficio o commerciale'],
  ['terreno', 'Terreno'], ['altro', 'Altro'],
] as const;
const timeframeOptions = [['subito', 'Il prima possibile'], ['entro-3-mesi', 'Entro 3 mesi'], ['entro-6-mesi', 'Entro 6 mesi'], ['oltre-6-mesi', 'Oltre 6 mesi'], ['da-definire', 'Da definire']] as const;

type FormErrors = Partial<Record<keyof LeadRequest, string>>;
type UpdateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => void;
export type DetailsScreen = 'location' | 'propertyType' | 'budget' | 'timeframe' | 'details';

interface Props {
  form: LeadRequest;
  errors: FormErrors;
  updateField: UpdateField;
  locationSlot: ReactNode;
  onBack: () => void;
  onComplete: () => void;
  onLocationMissing: () => void;
  onScreenChange: (screen: DetailsScreen) => void;
  initialScreen?: DetailsScreen;
}

function getInitialScreen(form: LeadRequest): DetailsScreen {
  if (!form.location.trim()) return 'location';
  if (!form.propertyType) return 'propertyType';
  if (!form.budget) return 'budget';
  if (!form.timeframe) return 'timeframe';
  return 'details';
}

function parseBudgetBounds(value: string): [string, string] {
  if (!value || value === 'Da definire') return ['', ''];
  const amounts = value.match(/\d[\d.]*/g) ?? [];
  if (amounts.length >= 2) return [amounts[0], amounts[1]];
  if (value.startsWith('Fino a')) return ['', amounts[0] ?? ''];
  return [amounts[0] ?? '', ''];
}

function formatBudgetRange(minimum: string, maximum: string, unit: string) {
  const min = minimum.trim();
  const max = maximum.trim();
  if (min && max) return `${min}–${max} ${unit}`;
  if (min) return `Da ${min} ${unit}`;
  if (max) return `Fino a ${max} ${unit}`;
  return '';
}

function ScreenActions({ onBack, onNext, nextLabel = 'Continua' }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
      <button
        type="button"
        className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--control-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4 stroke-[2]" aria-hidden="true" />
        Indietro
      </button>
      <button
        type="button"
        className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--brand-blue)] px-5 py-2 text-sm font-semibold text-[var(--ink)]"
        onClick={onNext}
      >
        {nextLabel}
      </button>
    </div>
  );
}

export default function PropertyDetailsStep({
  form,
  errors,
  updateField,
  locationSlot,
  onBack,
  onComplete,
  onLocationMissing,
  onScreenChange,
  initialScreen,
}: Props) {
  const [screen, setScreen] = useState<DetailsScreen>(() => initialScreen ?? getInitialScreen(form));
  const initialBudgetBounds = parseBudgetBounds(form.budget);
  const [budgetMinimum, setBudgetMinimum] = useState(initialBudgetBounds[0]);
  const [budgetMaximum, setBudgetMaximum] = useState(initialBudgetBounds[1]);
  const [customTimeframeDraft, setCustomTimeframeDraft] = useState(
    timeframeOptions.some(([value]) => value === form.timeframe) ? '' : form.timeframe,
  );
  const budgetUnit = form.requestType === 'locazione' ? '€/mese' : '€';
  const budgetPlaceholder = form.requestType === 'locazione' ? 'Es. 800' : 'Es. 200.000';
  const locationCopy: [string, string] = form.requestRole === 'cerca'
    ? ['Disegna la zona', 'Dove ti piacerebbe abitare?']
    : ['Dove si trova l’immobile?', 'Inserisci via e numero civico, poi continua.'];
  const screenCopy: Record<DetailsScreen, [string, string]> = {
    location: locationCopy,
    propertyType: ['Che tipo di immobile?', 'Scegli la tipologia più vicina.'],
    budget: ['Budget', 'Inserisci minimo e massimo oppure scegli “Da definire”.'],
    timeframe: ['Quando?', 'Indica la tempistica ideale.'],
    details: ['Ultimi dettagli', 'Facoltativi: puoi aggiungerli o inviare la richiesta.'],
  };
  const [title, description] = screenCopy[screen];

  useEffect(() => {
    onScreenChange(screen);
  }, [onScreenChange, screen]);

  const goBack = () => {
    if (screen === 'location') return onBack();
    if (screen === 'propertyType') return setScreen('location');
    if (screen === 'budget') return setScreen('propertyType');
    if (screen === 'timeframe') return setScreen('budget');
    setScreen('timeframe');
  };

  const updateBudgetBounds = (minimum: string, maximum: string) => {
    updateField('budget', formatBudgetRange(minimum, maximum, budgetUnit));
  };

  return (
    <fieldset className="flex min-h-0 flex-1 flex-col gap-5">
      <legend
        id="request-step-heading"
        className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center font-display text-3xl leading-tight text-[var(--ink)] outline-none sm:text-5xl"
        tabIndex={-1}
      >
        {title}
      </legend>
      <p className="text-center text-sm leading-6 text-[var(--graphite)] sm:text-lg">{description}</p>

      {screen === 'location' && (
        <>
          {form.locationMode === 'text' ? (
            <div className={`flex min-h-0 flex-1 ${form.requestRole === 'proprietario' ? '' : 'items-center'}`}>
              <div className={form.requestRole === 'proprietario' ? 'flex min-h-0 flex-1' : 'w-full'}>{locationSlot}</div>
            </div>
          ) : locationSlot}
          <ScreenActions
            onBack={goBack}
            onNext={() => {
              if (!form.location.trim()) return onLocationMissing();
              setScreen('propertyType');
            }}
          />
        </>
      )}

      {screen === 'propertyType' && (
        <>
          <div className="flex flex-1 items-center">
            <div className="grid w-full grid-cols-2 gap-3" role="radiogroup" aria-label="Tipo immobile" aria-invalid={Boolean(errors.propertyType)}>
              {propertyTypes.map(([value, label]) => {
                const active = form.propertyType === value;
                return (
                  <button
                    key={value}
                    id={active ? 'propertyType' : undefined}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      updateField('propertyType', value);
                      setScreen('budget');
                    }}
                    className={`focus-ring min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                      active ? 'border-[var(--ink)] bg-[var(--brand-blue)] shadow-[inset_0_0_0_1px_var(--ink)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <ScreenActions onBack={goBack} onNext={() => setScreen('budget')} />
        </>
      )}

      {screen === 'budget' && (
        <>
          <div className="flex flex-1 items-center">
            <div className="grid w-full gap-4">
              <div className="grid grid-cols-2 gap-3" role="group" aria-label="Intervallo budget">
                <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="budget-minimum">
                  Minimo
                  <div className="relative">
                    <input
                      id="budget-minimum"
                      type="text"
                      inputMode="numeric"
                      value={budgetMinimum}
                      onChange={(event) => {
                        const value = event.target.value;
                        setBudgetMinimum(value);
                        updateBudgetBounds(value, budgetMaximum);
                      }}
                      className="field-control min-h-12 rounded-lg border border-[var(--control-border)] bg-white py-2 pl-3 pr-9 text-base font-normal outline-none transition"
                      placeholder={budgetPlaceholder}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--graphite)]">{budgetUnit}</span>
                  </div>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="budget-maximum">
                  Massimo
                  <div className="relative">
                    <input
                      id="budget-maximum"
                      type="text"
                      inputMode="numeric"
                      value={budgetMaximum}
                      onChange={(event) => {
                        const value = event.target.value;
                        setBudgetMaximum(value);
                        updateBudgetBounds(budgetMinimum, value);
                      }}
                      className="field-control min-h-12 rounded-lg border border-[var(--control-border)] bg-white py-2 pl-3 pr-9 text-base font-normal outline-none transition"
                      placeholder={budgetPlaceholder}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--graphite)]">{budgetUnit}</span>
                  </div>
                </label>
              </div>
              <button
                id={form.budget === 'Da definire' ? 'budget' : undefined}
                type="button"
                aria-pressed={form.budget === 'Da definire'}
                onClick={() => {
                  setBudgetMinimum('');
                  setBudgetMaximum('');
                  updateField('budget', 'Da definire');
                  setScreen('timeframe');
                }}
                className={`focus-ring min-h-11 w-fit rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  form.budget === 'Da definire' ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                }`}
              >
                Da definire
              </button>
            </div>
          </div>
          <ScreenActions
            onBack={goBack}
            onNext={() => {
              if (form.budget.trim()) setScreen('timeframe');
            }}
          />
        </>
      )}

      {screen === 'timeframe' && (
        <>
          <div className="flex flex-1 items-center">
            <div className="grid w-full gap-3">
              <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Tempistica">
                {timeframeOptions.map(([value, label]) => {
                  const active = form.timeframe === value;
                  return (
                    <button
                      key={value}
                      id={active ? 'timeframe' : undefined}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        updateField('timeframe', value);
                        setScreen('details');
                      }}
                      className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        active ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="timeframe-custom">
                Altro periodo
                <input
                  id="timeframe-custom"
                  type="text"
                  value={customTimeframeDraft}
                  onChange={(event) => {
                    setCustomTimeframeDraft(event.target.value);
                    updateField('timeframe', event.target.value);
                  }}
                  className="field-control min-h-11 rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal outline-none transition"
                  placeholder="Es. Entro settembre 2027"
                />
              </label>
            </div>
          </div>
          <ScreenActions
            onBack={goBack}
            onNext={() => {
              if (form.timeframe.trim()) setScreen('details');
            }}
          />
        </>
      )}

      {screen === 'details' && (
        <>
          <div className="flex flex-1 items-center">
            <div className="grid w-full gap-3">
              <label id="features-panel" className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="features">
                Dettagli facoltativi
                <textarea
                  id="features"
                  className="field-control min-h-24 rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal outline-none transition"
                  value={form.features}
                  onChange={(event) => updateField('features', event.target.value)}
                  rows={3}
                  placeholder="Spazi, condizioni, vincoli o risultati importanti…"
                />
              </label>
            </div>
          </div>
          <ScreenActions onBack={goBack} onNext={onComplete} nextLabel="Vai ai contatti" />
        </>
      )}
    </fieldset>
  );
}
