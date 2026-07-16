import {
  cloneElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RequestSuccess from '../components/RequestSuccess';
import Section from '../components/Section';
import Turnstile from '../components/Turnstile';
import type { RequestType } from '../content/site';
import type { LeadRequest } from '../lib/leads';
import { submitLeadRequest } from '../lib/leads';
import { usePageAnimations } from '../lib/usePageAnimations';

type FormErrors = Partial<Record<keyof LeadRequest, string>>;

const requestTypes: Array<{ value: RequestType; label: string; description: string }> = [
  { value: 'acquisto', label: 'Acquistare', description: 'Cerco un immobile da comprare.' },
  { value: 'vendita', label: 'Vendere', description: 'Voglio vendere o valutare un immobile.' },
  { value: 'locazione', label: 'Locazione', description: 'Cerco o propongo un immobile in affitto.' },
];

const stepLabels = ['Obiettivo', 'Immobile', 'Contatti'];

const detailCopy: Record<
  RequestType,
  { location: string; locationPlaceholder: string; budget: string; features: string }
> = {
  acquisto: {
    location: 'Zona di ricerca',
    locationPlaceholder: 'Padova centro, Arcella, provincia…',
    budget: 'Budget massimo',
    features: 'Caratteristiche desiderate',
  },
  vendita: {
    location: 'Indirizzo o zona dell’immobile',
    locationPlaceholder: 'Comune, quartiere o indirizzo…',
    budget: 'Valore atteso',
    features: 'Obiettivi della vendita',
  },
  locazione: {
    location: 'Zona di interesse',
    locationPlaceholder: 'Comune o quartiere…',
    budget: 'Canone mensile indicativo',
    features: 'Esigenze della locazione',
  },
};

function getInitialType(type: string | null): RequestType {
  if (type === 'vendita' || type === 'locazione') return type;
  return 'acquisto';
}

function createEmptyForm(requestType: RequestType): LeadRequest {
  return {
    requestId: crypto.randomUUID(),
    requestType,
    propertyType: '',
    location: '',
    budget: '',
    timeframe: '',
    features: '',
    name: '',
    phone: '',
    email: '',
    contactPreference: 'telefono',
    notes: '',
    privacyAccepted: false,
    turnstileToken: '',
    website: '',
    startedAt: Date.now(),
    sourceUrl: '',
    referrer: '',
  };
}

function validateStep(form: LeadRequest, step: number): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!form.propertyType.trim()) errors.propertyType = 'Indica il tipo di immobile.';
    if (!form.location.trim()) errors.location = 'Indica la zona o la posizione.';
  }

  if (step === 2) {
    if (!form.name.trim()) errors.name = 'Inserisci nome e cognome.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Inserisci un’email valida.';
    if (form.phone && form.phone.replace(/\D/g, '').length < 7) errors.phone = 'Inserisci un numero valido.';
    if (!form.email.trim() && !form.phone.trim()) {
      errors.email = 'Inserisci almeno email o telefono.';
      errors.phone = 'Inserisci almeno telefono o email.';
    }
    if (form.contactPreference === 'email' && !form.email.trim()) errors.email = 'Email necessaria per questo contatto.';
    if ((form.contactPreference === 'telefono' || form.contactPreference === 'whatsapp') && !form.phone.trim()) {
      errors.phone = 'Telefono necessario per questo contatto.';
    }
    if (!form.privacyAccepted) errors.privacyAccepted = 'Conferma la lettura dell’informativa.';
    if (!form.turnstileToken) errors.turnstileToken = 'Completa la verifica antispam.';
  }

  return errors;
}

export default function RequestsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const initialType = useMemo(() => getInitialType(searchParams.get('type')), [searchParams]);
  const [form, setForm] = useState<LeadRequest>(() => createEmptyForm(initialType));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  usePageAnimations(pageRef);

  const updateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  };

  const focusFirstError = (nextErrors: FormErrors) => {
    const firstField = Object.keys(nextErrors)[0];
    if (!firstField) return;
    window.requestAnimationFrame(() => document.getElementById(firstField)?.focus());
  };

  const goToNextStep = () => {
    const nextErrors = validateStep(form, step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
    setMessage('');
  };

  const goToPreviousStep = () => {
    setStep((current) => Math.max(current - 1, 0));
    setErrors({});
    setMessage('');
  };

  const onTurnstileVerify = useCallback((token: string) => {
    setForm((current) => ({ ...current, turnstileToken: token }));
    setErrors((current) => ({ ...current, turnstileToken: undefined }));
  }, []);

  const onTurnstileExpire = useCallback(() => {
    setForm((current) => ({ ...current, turnstileToken: '' }));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < stepLabels.length - 1) {
      goToNextStep();
      return;
    }

    const nextErrors = validateStep(form, step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setMessage('Controlla i campi evidenziati.');
      focusFirstError(nextErrors);
      return;
    }

    setStatus('submitting');
    setMessage('');
    const result = await submitLeadRequest({
      ...form,
      sourceUrl: window.location.href,
      referrer: document.referrer,
    });
    setStatus(result.ok ? 'success' : 'error');
    setMessage(result.message);
    if (result.fieldErrors) setErrors(result.fieldErrors);
  };

  const resetForm = () => {
    setForm(createEmptyForm(initialType));
    setStep(0);
    setErrors({});
    setStatus('idle');
    setMessage('');
  };

  if (status === 'success') {
    return (
      <div ref={pageRef}>
        <RequestSuccess onReset={resetForm} />
      </div>
    );
  }

  const copy = detailCopy[form.requestType];

  return (
    <div ref={pageRef}>
      <Section className="section-line">
        <form onSubmit={onSubmit} className="mx-auto max-w-5xl rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-5 sm:p-8" noValidate>
          <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Avanzamento richiesta">
            {stepLabels.map((label, index) => (
              <li key={label} className="grid gap-2" aria-current={index === step ? 'step' : undefined}>
                <span className={`h-1 rounded-full ${index <= step ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'}`} />
                <span className={`text-xs font-semibold ${index === step ? 'text-[var(--ink)]' : 'text-[var(--graphite)]'}`}>
                  {index + 1}. {label}
                </span>
              </li>
            ))}
          </ol>

          {step === 0 && (
            <fieldset className="grid gap-6">
              <legend className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">Qual è il tuo obiettivo?</legend>
              <p className="text-sm leading-6 text-[var(--graphite)]">Scegli il percorso: le domande successive si adatteranno alla tua richiesta.</p>
              <div className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Tipo richiesta">
                {requestTypes.map((type) => {
                  const active = form.requestType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`focus-ring min-h-32 rounded-lg border p-5 text-left transition ${
                        active
                          ? 'border-[var(--ink)] bg-[var(--brand-blue)] shadow-[inset_0_0_0_1px_var(--ink)]'
                          : 'border-[var(--control-border)] bg-white hover:border-[var(--ink)]'
                      }`}
                      onClick={() => updateField('requestType', type.value)}
                    >
                      <span className="block text-lg font-semibold text-[var(--ink)]">{type.label}</span>
                      <span className="mt-2 block text-sm leading-6 text-[var(--graphite)]">{type.description}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="grid gap-6">
              <legend className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">Dettagli dell’immobile</legend>
              <p className="text-sm leading-6 text-[var(--graphite)]">Bastano informazioni indicative: potrai approfondire tutto durante il ricontatto.</p>
              <div className="grid gap-5 md:grid-cols-2">
                <Field id="propertyType" label="Tipo immobile" error={errors.propertyType} required>
                  <select value={form.propertyType} onChange={(event) => updateField('propertyType', event.target.value)}>
                    <option value="">Seleziona</option>
                    <option value="appartamento">Appartamento</option>
                    <option value="villa">Villa o casa indipendente</option>
                    <option value="commerciale">Ufficio o commerciale</option>
                    <option value="terreno">Terreno</option>
                    <option value="altro">Altro</option>
                  </select>
                </Field>
                <Field id="location" label={copy.location} error={errors.location} required>
                  <input value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder={copy.locationPlaceholder} autoComplete="street-address" />
                </Field>
                <Field id="budget" label={copy.budget} hint="Facoltativo">
                  <input value={form.budget} onChange={(event) => updateField('budget', event.target.value)} placeholder="Es. 250.000 €" inputMode="decimal" />
                </Field>
                <Field id="timeframe" label="Tempistiche" hint="Facoltativo">
                  <select value={form.timeframe} onChange={(event) => updateField('timeframe', event.target.value)}>
                    <option value="">Seleziona</option>
                    <option value="subito">Il prima possibile</option>
                    <option value="entro-3-mesi">Entro 3 mesi</option>
                    <option value="entro-6-mesi">Entro 6 mesi</option>
                    <option value="oltre-6-mesi">Oltre 6 mesi</option>
                    <option value="da-definire">Da definire</option>
                  </select>
                </Field>
              </div>
              <Field id="features" label={copy.features} hint="Facoltativo">
                <textarea value={form.features} onChange={(event) => updateField('features', event.target.value)} rows={4} placeholder="Spazi, condizioni, vincoli o risultati importanti…" />
              </Field>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="grid gap-6">
              <legend className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">Come possiamo ricontattarti?</legend>
              <p className="text-sm leading-6 text-[var(--graphite)]">Inserisci almeno email o telefono e scegli il canale che preferisci.</p>
              <div className="grid gap-5 md:grid-cols-2">
                <Field id="name" label="Nome e cognome" error={errors.name} required>
                  <input value={form.name} onChange={(event) => updateField('name', event.target.value)} autoComplete="name" />
                </Field>
                <Field id="phone" label="Telefono" error={errors.phone}>
                  <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} type="tel" autoComplete="tel" inputMode="tel" />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input value={form.email} onChange={(event) => updateField('email', event.target.value)} type="email" autoComplete="email" inputMode="email" />
                </Field>
                <div className="grid gap-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">Contatto preferito</span>
                  <div className="grid grid-cols-3 gap-1 rounded-lg border border-[var(--control-border)] bg-white p-1" role="radiogroup" aria-label="Contatto preferito">
                    {(['telefono', 'email', 'whatsapp'] as const).map((preference) => (
                      <button
                        id={preference === form.contactPreference ? 'contactPreference' : undefined}
                        key={preference}
                        type="button"
                        role="radio"
                        aria-checked={form.contactPreference === preference}
                        className={`focus-ring rounded-md px-2 py-3 text-xs font-semibold capitalize sm:text-sm ${
                          form.contactPreference === preference ? 'bg-[var(--brand-blue)] text-[var(--ink)]' : 'text-[var(--graphite)]'
                        }`}
                        onClick={() => updateField('contactPreference', preference)}
                      >
                        {preference}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Field id="notes" label="Note aggiuntive" hint="Facoltativo">
                <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={4} />
              </Field>

              <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Sito web</label>
                <input id="website" value={form.website} onChange={(event) => updateField('website', event.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              <label className="flex items-start gap-3 rounded-lg border border-[var(--line)] bg-white p-4" htmlFor="privacyAccepted">
                <input
                  id="privacyAccepted"
                  className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]"
                  type="checkbox"
                  checked={form.privacyAccepted}
                  onChange={(event) => updateField('privacyAccepted', event.target.checked)}
                  aria-invalid={Boolean(errors.privacyAccepted)}
                  aria-describedby={errors.privacyAccepted ? 'privacyAccepted-error' : undefined}
                />
                <span className="text-sm leading-6 text-[var(--graphite)]">
                  Confermo di aver letto l’<Link className="font-semibold text-[var(--ink)] underline decoration-[var(--brand-blue)] decoration-4 underline-offset-4" to="/privacy">informativa privacy</Link> e autorizzo il ricontatto per questa richiesta.
                </span>
              </label>
              {errors.privacyAccepted && <p id="privacyAccepted-error" className="-mt-4 text-sm font-medium text-red-700">{errors.privacyAccepted}</p>}

              <div className="grid gap-2">
                <Turnstile requestId={form.requestId} onVerify={onTurnstileVerify} onExpire={onTurnstileExpire} />
                {errors.turnstileToken && <p id="turnstileToken" className="text-sm font-medium text-red-700" tabIndex={-1}>{errors.turnstileToken}</p>}
              </div>
            </fieldset>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button type="button" className="focus-ring rounded-lg border border-[var(--control-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)]" onClick={goToPreviousStep}>
                Indietro
              </button>
            ) : <span />}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="focus-ring rounded-lg bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:ring-2 hover:ring-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? 'Salvataggio in corso…' : step === stepLabels.length - 1 ? 'Invia richiesta' : 'Continua'}
            </button>
          </div>
          {message && <p className={`mt-4 text-sm font-semibold ${status === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{message}</p>}
        </form>
      </Section>
    </div>
  );
}

interface FieldProps {
  children: ReactElement<{ className?: string; id?: string; [key: string]: unknown }>;
  id: keyof LeadRequest;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Field({ children, id, label, error, hint, required = false }: FieldProps) {
  const className = 'field-control min-h-11 rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal text-[var(--ink)] outline-none transition';

  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor={id}>
      <span>
        {label}
        {required && <span className="text-red-600"> *</span>}
        {hint && <span className="ml-2 font-normal text-[var(--graphite)]">{hint}</span>}
      </span>
      {cloneElement(children, {
        id,
        className: `${className} ${children.props.className ?? ''}`,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? `${id}-error` : undefined,
      })}
      {error && <span id={`${id}-error`} className="text-sm font-medium text-red-700">{error}</span>}
    </label>
  );
}
