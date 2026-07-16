import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
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
}

function initialScreen(form: LeadRequest): DetailsScreen {
  if (!form.location.trim()) return 'location';
  if (!form.propertyType) return 'propertyType';
  if (!form.budget) return 'budget';
  if (!form.timeframe) return 'timeframe';
  return 'details';
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
}: Props) {
  const budgetOptions = form.requestType === 'locazione' ? rentBudgetOptions : purchaseBudgetOptions;
  const [screen, setScreen] = useState<DetailsScreen>(() => initialScreen(form));
  const [budgetMode, setBudgetMode] = useState<'preset' | 'custom'>(
    form.budget && !budgetOptions.includes(form.budget) ? 'custom' : 'preset',
  );
  const [timeframeMode, setTimeframeMode] = useState<'preset' | 'custom'>(
    form.timeframe && !timeframeOptions.some(([value]) => value === form.timeframe) ? 'custom' : 'preset',
  );
  const [customBudgetDraft, setCustomBudgetDraft] = useState(budgetOptions.includes(form.budget) ? '' : form.budget);
  const [customTimeframeDraft, setCustomTimeframeDraft] = useState(
    timeframeOptions.some(([value]) => value === form.timeframe) ? '' : form.timeframe,
  );
  const [showDetails, setShowDetails] = useState(Boolean(form.features));
  const budgetLabel = form.requestRole === 'proprietario'
    ? 'Valore o canone desiderato'
    : form.requestType === 'locazione'
      ? 'Canone mensile indicativo'
      : 'Budget massimo';
  const budgetPlaceholder = form.requestType === 'locazione' ? 'Es. 900–1.200 €/mese' : 'Es. 300.000–400.000 €';
  const locationCopy: [string, string] = form.requestRole === 'cerca'
    ? ['Dove ti piacerebbe abitare?', 'Disegna sulla mappa la zona ideale per te.']
    : ['Dove si trova l’immobile?', 'Inserisci via e numero civico, poi continua.'];
  const screenCopy: Record<DetailsScreen, [string, string]> = {
    location: locationCopy,
    propertyType: ['Che tipo di immobile?', 'Scegli la tipologia più vicina.'],
    budget: [budgetLabel, 'Puoi scegliere “Da definire”.'],
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
            <div className="grid w-full gap-3">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={budgetLabel}>
                {budgetOptions.map((option) => {
                  const active = budgetMode === 'preset' && form.budget === option;
                  return (
                    <button
                      key={option}
                      id={active ? 'budget' : undefined}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setBudgetMode('preset');
                        updateField('budget', option);
                        setScreen('timeframe');
                      }}
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
                  onClick={() => {
                    setBudgetMode('custom');
                    updateField('budget', customBudgetDraft);
                  }}
                  className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    budgetMode === 'custom' ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                  }`}
                >
                  Altro importo
                </button>
              </div>
              {budgetMode === 'custom' && (
                <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="budget-custom">
                  Budget personalizzato
                  <input
                    id="budget-custom"
                    type="text"
                    value={customBudgetDraft}
                    onChange={(event) => {
                      setCustomBudgetDraft(event.target.value);
                      updateField('budget', event.target.value);
                    }}
                    className="field-control min-h-11 rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal outline-none transition"
                    placeholder={budgetPlaceholder}
                  />
                </label>
              )}
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
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tempistica">
                {timeframeOptions.map(([value, label]) => {
                  const active = timeframeMode === 'preset' && form.timeframe === value;
                  return (
                    <button
                      key={value}
                      id={active ? 'timeframe' : undefined}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setTimeframeMode('preset');
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
                <button
                  id={timeframeMode === 'custom' ? 'timeframe' : undefined}
                  type="button"
                  role="radio"
                  aria-checked={timeframeMode === 'custom'}
                  onClick={() => {
                    setTimeframeMode('custom');
                    updateField('timeframe', customTimeframeDraft);
                  }}
                  className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    timeframeMode === 'custom' ? 'border-[var(--ink)] bg-[var(--brand-blue)]' : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                  }`}
                >
                  Altro periodo
                </button>
              </div>
              {timeframeMode === 'custom' && (
                <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="timeframe-custom">
                  Tempistica personalizzata
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
              )}
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
                    className="field-control min-h-24 rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal outline-none transition"
                    value={form.features}
                    onChange={(event) => updateField('features', event.target.value)}
                    rows={3}
                    placeholder="Spazi, condizioni, vincoli o risultati importanti…"
                  />
                </label>
              )}
            </div>
          </div>
          <ScreenActions onBack={goBack} onNext={onComplete} nextLabel="Vai ai contatti" />
        </>
      )}
    </fieldset>
  );
}
