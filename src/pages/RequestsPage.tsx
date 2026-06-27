import { cloneElement, useMemo, useRef, useState, type FormEvent, type ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ButtonLink from '../components/ButtonLink';
import Icon from '../components/Icon';
import Section from '../components/Section';
import type { RequestType } from '../content/site';
import type { LeadRequest } from '../lib/leads';
import { submitLeadRequest } from '../lib/leads';
import { usePageAnimations } from '../lib/usePageAnimations';

const emptyForm: LeadRequest = {
  name: '',
  phone: '',
  email: '',
  requestType: 'acquisto',
  propertyType: '',
  location: '',
  budget: '',
  timeframe: '',
  features: '',
  notes: '',
};

const requestTypes: Array<{ value: RequestType; label: string }> = [
  { value: 'acquisto', label: 'Acquisto' },
  { value: 'vendita', label: 'Vendita' },
  { value: 'locazione', label: 'Locazione' },
];

function getInitialType(type: string | null): RequestType {
  if (type === 'vendita' || type === 'locazione') return type;
  return 'acquisto';
}

function validate(form: LeadRequest) {
  const errors: Partial<Record<keyof LeadRequest, string>> = {};
  if (!form.name.trim()) errors.name = 'Inserisci nome e cognome.';
  if (!form.phone.trim()) errors.phone = 'Inserisci un numero di telefono.';
  if (!form.email.trim()) errors.email = 'Inserisci una email.';
  if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Inserisci una email valida.';
  if (!form.location.trim()) errors.location = 'Inserisci la zona di interesse.';
  return errors;
}

export default function RequestsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const initialType = useMemo(() => getInitialType(searchParams.get('type')), [searchParams]);
  const [form, setForm] = useState<LeadRequest>({ ...emptyForm, requestType: initialType });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadRequest, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  usePageAnimations(pageRef);

  const updateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setMessage('Controlla i campi obbligatori.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    const result = await submitLeadRequest(form);
    setStatus(result.ok ? 'success' : 'error');
    setMessage(result.message);

    if (result.ok) {
      setForm({ ...emptyForm, requestType: initialType });
    }
  };

  if (status === 'success') {
    return (
      <div ref={pageRef}>
        <Section className="section-line min-h-[70vh] bg-[var(--paper-soft)]">
          <div data-animate className="mx-auto max-w-xl rounded-lg border border-[var(--line)] bg-white p-8 text-center">
            <Icon name="check" className="mx-auto h-12 w-12 text-[var(--brand-blue-strong)]" />
            <h1 className="font-display mt-5 text-4xl leading-tight text-[var(--ink)]">Richiesta inviata</h1>
            <p className="mt-3 text-[var(--graphite)]">{message}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink to="/" variant="outline">
                Torna alla home
              </ButtonLink>
              <button
                type="button"
                className="focus-ring rounded-lg bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
                onClick={() => {
                  setStatus('idle');
                  setMessage('');
                }}
              >
                Nuova richiesta
              </button>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div ref={pageRef}>
      <header className="section-line bg-[var(--paper-soft)] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p data-animate className="eyebrow">
              Richiesta gratuita
            </p>
            <h1 data-animate className="font-display mt-4 max-w-4xl text-5xl leading-[0.95] text-[var(--ink)] sm:text-7xl">
              Raccontaci cosa ti serve.
            </h1>
            <p data-animate className="mt-6 max-w-2xl text-base leading-7 text-[var(--graphite)] sm:text-lg sm:leading-8">
              Un unico form per acquisto, vendita, locazione e consulenze su misura. I campi essenziali aiutano a ricontattarti con le informazioni giuste.
            </p>
          </div>
          <div data-animate="image" className="media-frame h-[18rem] rounded-lg sm:h-[26rem]">
            <img src="/images/prato-padova.webp" alt="" className="h-full w-full object-cover" data-parallax />
          </div>
        </div>
      </header>

      <Section className="section-line">
        <form onSubmit={onSubmit} data-animate className="mx-auto grid max-w-5xl gap-8 rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-5 sm:p-8">
          <div className="grid gap-3">
            <span className="text-sm font-semibold text-[var(--ink)]">Tipo richiesta *</span>
            <div className="grid gap-2 rounded-lg border border-[var(--line)] bg-white p-1 sm:grid-cols-3" role="radiogroup" aria-label="Tipo richiesta">
              {requestTypes.map((type) => {
                const active = form.requestType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`focus-ring rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-[var(--brand-blue)] text-[var(--ink)]'
                        : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                    }`}
                    onClick={() => updateField('requestType', type.value)}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nome e cognome" error={errors.name} required>
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} autoComplete="name" />
            </Field>
            <Field label="Telefono" error={errors.phone} required>
              <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} type="tel" autoComplete="tel" />
            </Field>
            <Field label="Email" error={errors.email} required>
              <input value={form.email} onChange={(event) => updateField('email', event.target.value)} type="email" autoComplete="email" />
            </Field>
            <Field label="Zona di interesse" error={errors.location} required>
              <input value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Padova centro, provincia..." />
            </Field>
            <Field label="Tipo immobile">
              <input value={form.propertyType} onChange={(event) => updateField('propertyType', event.target.value)} placeholder="Appartamento, villa, ufficio..." />
            </Field>
            <Field label="Budget o valore indicativo">
              <input value={form.budget} onChange={(event) => updateField('budget', event.target.value)} placeholder="Es. 250.000 euro" />
            </Field>
            <Field label="Tempistiche">
              <input value={form.timeframe} onChange={(event) => updateField('timeframe', event.target.value)} placeholder="Subito, 3 mesi, 6 mesi..." />
            </Field>
          </div>

          <Field label="Caratteristiche o obiettivi">
            <textarea value={form.features} onChange={(event) => updateField('features', event.target.value)} rows={4} />
          </Field>
          <Field label="Note">
            <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={4} />
          </Field>

          <p className="text-sm leading-6 text-[var(--graphite)]">
            Inviando il form accetti di essere ricontattato per la tua richiesta. Consulta la{' '}
            <Link className="font-semibold text-[var(--brand-blue-strong)] hover:underline" to="/privacy">
              privacy
            </Link>
            .
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="focus-ring rounded-lg bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--brand-blue-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? 'Invio in corso...' : 'Invia richiesta'}
            </button>
            {message && (
              <p className={`text-sm font-semibold ${status === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">
                {message}
              </p>
            )}
          </div>
        </form>
      </Section>
    </div>
  );
}

interface FieldProps {
  children: ReactElement<{ className?: string; id?: string }>;
  label: string;
  error?: string;
  required?: boolean;
}

function Field({ children, label, error, required = false }: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const className =
    'min-h-11 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-base font-normal text-[var(--ink)] outline-none transition focus:border-[var(--brand-blue)] focus:ring-4 focus:ring-[#b3e5fc]/60';

  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor={id}>
      <span>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {cloneElement(children, {
        id,
        className: `${className} ${children.props.className ?? ''}`,
      })}
      {error && <span className="text-sm font-medium text-red-700">{error}</span>}
    </label>
  );
}
