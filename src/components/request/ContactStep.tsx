import { cloneElement, useEffect, useState, type KeyboardEvent, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Mail, MessageCircle, Phone, ShieldCheck, type LucideIcon } from 'lucide-react';
import Turnstile from '../Turnstile';
import type { ContactPreference, LeadRequest } from '../../lib/leads';

type FormErrors = Partial<Record<keyof LeadRequest, string>>;
type UpdateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => void;

export type ContactScreen = 'details' | 'consent';

interface Props {
  form: LeadRequest;
  errors: FormErrors;
  updateField: UpdateField;
  requestId: string;
  onTurnstileVerify: (token: string) => void;
  onTurnstileExpire: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  onScreenChange: (screen: ContactScreen) => void;
  initialScreen?: ContactScreen;
}

const contactPreferences: Array<{ value: ContactPreference; label: string; icon: LucideIcon }> = [
  { value: 'telefono', label: 'Telefono', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'email', label: 'Email', icon: Mail },
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
  onBack,
  isSubmitting,
  onScreenChange,
  initialScreen = 'details',
}: Props) {
  const [screen, setScreen] = useState<ContactScreen>(initialScreen);
  const [showSecondaryContact, setShowSecondaryContact] = useState(Boolean(form.email && form.phone));
  const emailIsPrimary = form.contactPreference === 'email';
  const secondaryValue = emailIsPrimary ? form.phone : form.email;
  const showSecondary = showSecondaryContact || Boolean(secondaryValue);

  useEffect(() => {
    onScreenChange(screen);
  }, [onScreenChange, screen]);

  const toggleSecondary = () => {
    if (showSecondary) {
      updateField(emailIsPrimary ? 'phone' : 'email', '');
      setShowSecondaryContact(false);
      return;
    }
    setShowSecondaryContact(true);
  };

  return (
    <fieldset className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-5">
      <legend
        id="request-step-heading"
        className="mx-auto flex max-w-2xl shrink-0 flex-col items-center gap-2 text-center font-display text-3xl leading-tight text-[var(--ink)] outline-none sm:text-5xl"
        tabIndex={-1}
      >
        {screen === 'details' ? 'Come possiamo ricontattarti?' : 'Un ultimo consenso'}
      </legend>
      <p className="shrink-0 text-center text-sm leading-5 text-[var(--graphite)] sm:text-lg sm:leading-6">
        {screen === 'details' ? 'Mostriamo solo il recapito necessario al canale che preferisci.' : 'Conferma la privacy e invia la richiesta.'}
      </p>

      {screen === 'details' && (
        <>
          <div className="request-screen-scroll flex min-h-0 flex-1 items-start overflow-y-auto sm:items-center">
            <div className="request-screen-center grid w-full gap-5">
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
                const PreferenceIcon = preference.icon;
                return (
                  <button
                    id={active ? 'contactPreference' : undefined}
                    key={preference.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    tabIndex={active ? 0 : -1}
                    className={`focus-ring flex min-h-11 items-center justify-center gap-2 rounded-md px-2 py-3 text-xs font-semibold sm:text-sm ${
                      active ? 'bg-[var(--brand-blue)] text-[var(--ink)]' : 'text-[var(--graphite)]'
                    }`}
                    onClick={() => updateField('contactPreference', preference.value)}
                    onKeyDown={moveRadioFocus}
                  >
                    <PreferenceIcon className="h-4 w-4 stroke-[1.9]" aria-hidden="true" />
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
                    <input id="phone" className={fieldClassName} value={form.phone} onChange={(event) => updateField('phone', event.target.value)} type="tel" autoComplete="tel" inputMode="tel" />
                  </ContactField>
                ) : (
                  <ContactField id="email" label="Email facoltativa" error={errors.email}>
                    <input id="email" className={fieldClassName} value={form.email} onChange={(event) => updateField('email', event.target.value)} type="email" autoComplete="email" inputMode="email" />
                  </ContactField>
                )}
              </div>
            )}
              </div>
            </div>
          </div>
          <ActionBar onBack={onBack} onNext={() => setScreen('consent')} />
        </>
      )}

      {screen === 'consent' && (
        <>
          <div className="request-screen-scroll flex min-h-0 flex-1 items-start overflow-y-auto sm:items-center">
            <div className="request-screen-center grid w-full gap-3">
              <label id="notes-panel" className="grid gap-2 text-sm font-semibold text-[var(--ink)]" htmlFor="notes">
                <span>Note <span className="ml-2 font-normal text-[var(--graphite)]">Facoltative</span></span>
                <textarea id="notes" className={`${fieldClassName} min-h-20`} value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={2} placeholder="Aggiungi informazioni utili per il ricontatto." aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? 'notes-error' : undefined} />
                {errors.notes && <span id="notes-error" className="text-sm font-medium text-red-700">{errors.notes}</span>}
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-[var(--line)] bg-white p-3" htmlFor="privacyAccepted">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 stroke-[1.8] text-[var(--ink)]" aria-hidden="true" />
                <input id="privacyAccepted" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--ink)]" type="checkbox" checked={form.privacyAccepted} onChange={(event) => updateField('privacyAccepted', event.target.checked)} required aria-required={true} aria-invalid={Boolean(errors.privacyAccepted)} aria-describedby={errors.privacyAccepted ? 'privacyAccepted-error' : undefined} />
                <span className="text-sm leading-6 text-[var(--graphite)]">
                  Confermo di aver letto l’<Link className="font-semibold text-[var(--ink)] underline decoration-[var(--brand-blue)] decoration-4 underline-offset-4" to="/privacy">informativa privacy</Link>{' '}e autorizzo il ricontatto.
                </span>
              </label>
              {errors.privacyAccepted && <p id="privacyAccepted-error" className="-mt-4 text-sm font-medium text-red-700">{errors.privacyAccepted}</p>}
              <div className="grid gap-2">
                <Turnstile requestId={requestId} onVerify={onTurnstileVerify} onExpire={onTurnstileExpire} />
                {errors.turnstileToken && <p id="turnstileToken" className="text-sm font-medium text-red-700" tabIndex={-1}>{errors.turnstileToken}</p>}
              </div>
            </div>
          </div>
          <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Sito web</label>
            <input id="website" value={form.website} onChange={(event) => updateField('website', event.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          <ActionBar onBack={() => setScreen('details')} submit isSubmitting={isSubmitting} />
        </>
      )}
    </fieldset>
  );
}

function ActionBar({ onBack, onNext, submit = false, isSubmitting = false }: { onBack: () => void; onNext?: () => void; submit?: boolean; isSubmitting?: boolean }) {
  return (
    <div className="mt-auto flex shrink-0 items-center justify-between gap-3 border-t border-[var(--line)] pt-3 sm:pt-4">
      <button type="button" className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--control-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 stroke-[2]" aria-hidden="true" /> Indietro
      </button>
      <button type={submit ? 'submit' : 'button'} disabled={isSubmitting} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-blue)] px-5 py-2 text-sm font-semibold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60" onClick={submit ? undefined : onNext}>
        {isSubmitting ? 'Salvataggio in corso…' : submit ? 'Invia richiesta' : 'Continua'}
        {!isSubmitting && <ArrowRight className="h-4 w-4 stroke-[2]" aria-hidden="true" />}
      </button>
    </div>
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
