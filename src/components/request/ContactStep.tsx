import { cloneElement, useState, type KeyboardEvent, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import Turnstile from '../Turnstile';
import type { ContactPreference, LeadRequest } from '../../lib/leads';

type FormErrors = Partial<Record<keyof LeadRequest, string>>;
type UpdateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => void;

interface Props {
  form: LeadRequest;
  errors: FormErrors;
  updateField: UpdateField;
  requestId: string;
  onTurnstileVerify: (token: string) => void;
  onTurnstileExpire: () => void;
}

const contactPreferences: Array<{ value: ContactPreference; label: string }> = [
  { value: 'telefono', label: 'Telefono' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
];

const fieldClassName = 'field-control min-h-11 rounded-lg border border-[var(--control-border)] bg-white px-3 py-2 text-base font-normal text-[var(--ink)] outline-none transition';

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

export default function ContactStep({
  form,
  errors,
  updateField,
  requestId,
  onTurnstileVerify,
  onTurnstileExpire,
}: Props) {
  const [showSecondaryContact, setShowSecondaryContact] = useState(Boolean(form.email && form.phone));
  const emailIsPrimary = form.contactPreference === 'email';
  const secondaryValue = emailIsPrimary ? form.phone : form.email;
  const showSecondary = showSecondaryContact || Boolean(secondaryValue);

  const toggleSecondary = () => {
    if (showSecondary) {
      updateField(emailIsPrimary ? 'phone' : 'email', '');
      setShowSecondaryContact(false);
      return;
    }
    setShowSecondaryContact(true);
  };

  return (
    <fieldset className="grid gap-6">
      <legend className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">Come possiamo ricontattarti?</legend>
      <p className="text-sm leading-6 text-[var(--graphite)]">Mostriamo solo il recapito necessario al canale che preferisci.</p>

      <ContactField id="name" label="Nome e cognome" error={errors.name} required>
        <input
          id="name"
          className={fieldClassName}
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          autoComplete="name"
        />
      </ContactField>

      <fieldset className="grid gap-2">
        <legend id="contactPreference-label" className="text-sm font-semibold text-[var(--ink)]">Come preferisci essere contattato?</legend>
        <div
          className="grid grid-cols-3 gap-1 rounded-lg border border-[var(--control-border)] bg-white p-1"
          role="radiogroup"
          aria-labelledby="contactPreference-label"
        >
          {contactPreferences.map((preference) => {
            const active = form.contactPreference === preference.value;
            return (
              <button
                id={active ? 'contactPreference' : undefined}
                key={preference.value}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                className={`focus-ring min-h-11 rounded-md px-2 py-3 text-xs font-semibold sm:text-sm ${
                  active ? 'bg-[var(--brand-blue)] text-[var(--ink)]' : 'text-[var(--graphite)]'
                }`}
                onClick={() => updateField('contactPreference', preference.value)}
                onKeyDown={moveRadioFocus}
              >
                {preference.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {form.contactPreference === 'email' ? (
        <ContactField id="email" label="Email" error={errors.email} required>
          <input
            id="email"
            className={fieldClassName}
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            type="email"
            autoComplete="email"
            inputMode="email"
          />
        </ContactField>
      ) : (
        <ContactField id="phone" label={form.contactPreference === 'whatsapp' ? 'Numero WhatsApp' : 'Telefono'} error={errors.phone} required>
          <input
            id="phone"
            className={fieldClassName}
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
          />
        </ContactField>
      )}

      <div className="grid gap-3">
        <button
          type="button"
          className="focus-ring min-h-11 w-fit rounded-lg border border-[var(--control-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
          aria-expanded={showSecondary}
          aria-controls="secondary-contact"
          onClick={toggleSecondary}
        >
          {showSecondary
            ? `Rimuovi ${emailIsPrimary ? 'telefono' : 'email'} aggiuntiv${emailIsPrimary ? 'o' : 'a'}`
            : `Aggiungi anche ${emailIsPrimary ? 'il telefono' : "l’email"}`}
        </button>
        {showSecondary && (
          <div id="secondary-contact">
            {emailIsPrimary ? (
              <ContactField id="phone" label="Telefono facoltativo" error={errors.phone}>
                <input
                  id="phone"
                  className={fieldClassName}
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </ContactField>
            ) : (
              <ContactField id="email" label="Email facoltativa" error={errors.email}>
                <input
                  id="email"
                  className={fieldClassName}
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                />
              </ContactField>
            )}
          </div>
        )}
      </div>

      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Sito web</label>
        <input
          id="website"
          value={form.website}
          onChange={(event) => updateField('website', event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-[var(--line)] bg-white p-4" htmlFor="privacyAccepted">
        <input
          id="privacyAccepted"
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]"
          type="checkbox"
          checked={form.privacyAccepted}
          onChange={(event) => updateField('privacyAccepted', event.target.checked)}
          required
          aria-required={true}
          aria-invalid={Boolean(errors.privacyAccepted)}
          aria-describedby={errors.privacyAccepted ? 'privacyAccepted-error' : undefined}
        />
        <span className="text-sm leading-6 text-[var(--graphite)]">
          Confermo di aver letto l’
          <Link className="font-semibold text-[var(--ink)] underline decoration-[var(--brand-blue)] decoration-4 underline-offset-4" to="/privacy">
            informativa privacy
          </Link>{' '}
          e autorizzo il ricontatto per questa richiesta.
        </span>
      </label>
      {errors.privacyAccepted && <p id="privacyAccepted-error" className="-mt-4 text-sm font-medium text-red-700">{errors.privacyAccepted}</p>}

      <div className="grid gap-2">
        <Turnstile requestId={requestId} onVerify={onTurnstileVerify} onExpire={onTurnstileExpire} />
        {errors.turnstileToken && (
          <p id="turnstileToken" className="text-sm font-medium text-red-700" tabIndex={-1}>{errors.turnstileToken}</p>
        )}
      </div>
    </fieldset>
  );
}

interface ContactFieldProps {
  children: ReactElement<{
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    required?: boolean;
  }>;
  id: 'name' | 'phone' | 'email';
  label: string;
  error?: string;
  required?: boolean;
}

function ContactField({ children, id, label, error, required = false }: ContactFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor={id}>
      <span>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {cloneElement(children, {
        required: required,
        'aria-required': required,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? `${id}-error` : undefined,
      })}
      {error && <span id={`${id}-error`} className="text-sm font-medium text-red-700">{error}</span>}
    </label>
  );
}
