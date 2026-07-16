import { useCallback, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import RequestSuccess from '../components/RequestSuccess';
import Section from '../components/Section';
import ContactStep from '../components/request/ContactStep';
import LocationSelector from '../components/request/LocationSelector';
import PropertyDetailsStep from '../components/request/PropertyDetailsStep';
import RequestIntentSelector from '../components/request/RequestIntentSelector';
import WizardProgress from '../components/request/WizardProgress';
import type { LeadRequest, LocationMode, LocationPolygon } from '../lib/leads';
import { submitLeadRequest } from '../lib/leads';
import {
  getDefaultLocationMode,
  getInitialIntent,
  isValidLocationPolygon,
  summarizePolygon,
  type RequestIntent,
} from '../lib/requestWizard';
import { usePageAnimations } from '../lib/usePageAnimations';

type FormErrors = Partial<Record<keyof LeadRequest, string>>;

const stepLabels = ['Obiettivo', 'Immobile', 'Contatti'] as const;

function createEmptyForm(intent: RequestIntent): LeadRequest {
  return {
    requestId: crypto.randomUUID(),
    requestType: intent.requestType,
    requestRole: intent.requestRole,
    locationMode: getDefaultLocationMode(intent.requestRole),
    propertyType: '',
    location: '',
    locationGeometry: null,
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

function validateStep(form: LeadRequest, locationText: string, step: number): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!form.propertyType.trim()) errors.propertyType = 'Indica il tipo di immobile.';
    const hasLocation = form.locationMode === 'text'
      ? Boolean(locationText.trim())
      : isValidLocationPolygon(form.locationGeometry);
    if (!hasLocation) errors.location = 'Indica la zona o la posizione.';
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
  const initialIntent = useMemo(() => getInitialIntent(searchParams.get('type')), [searchParams]);
  const [intentValue, setIntentValue] = useState(initialIntent.value);
  const [locationText, setLocationText] = useState('');
  const [form, setForm] = useState<LeadRequest>(() => createEmptyForm(initialIntent));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  usePageAnimations(pageRef);

  const clearErrorState = (field: keyof LeadRequest) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  };

  const updateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => {
    setForm((current) => ({ ...current, [field]: value }));
    clearErrorState(field);
  };

  const selectIntent = (intent: RequestIntent) => {
    const defaultMode = getDefaultLocationMode(intent.requestRole);
    setIntentValue(intent.value);
    setLocationText('');
    setForm((current) => ({
      ...current,
      requestType: intent.requestType,
      requestRole: intent.requestRole,
      locationMode: defaultMode,
      location: '',
      locationGeometry: null,
    }));
    setErrors({});
    setStatus('idle');
    setMessage('');
    window.requestAnimationFrame(() => setStep(1));
  };

  const selectLocationMode = (locationMode: LocationMode) => {
    setForm((current) => ({
      ...current,
      locationMode,
      location: locationMode === 'text'
        ? locationText
        : current.locationGeometry
          ? summarizePolygon(current.locationGeometry)
          : '',
    }));
    clearErrorState('location');
  };

  const setLocationTextValue = (value: string) => {
    setLocationText(value);
    setForm((current) => ({ ...current, location: value }));
    clearErrorState('location');
  };

  const setPolygon = (locationGeometry: LocationPolygon | null) => {
    setForm((current) => ({
      ...current,
      locationGeometry,
      location: locationGeometry ? summarizePolygon(locationGeometry) : '',
    }));
    clearErrorState('location');
  };

  const onMapUnavailable = (unavailableMessage: string) => {
    setForm((current) => ({
      ...current,
      locationMode: 'text',
      location: locationText,
      locationGeometry: null,
    }));
    setErrors((current) => ({ ...current, location: undefined }));
    setStatus('idle');
    setMessage(unavailableMessage);
  };

  const focusFirstError = (nextErrors: FormErrors) => {
    const firstField = Object.keys(nextErrors)[0];
    if (!firstField) return;
    window.requestAnimationFrame(() => {
      const control = document.getElementById(firstField)
        ?? document.querySelector<HTMLElement>('[aria-invalid="true"], [role="tab"][aria-selected="true"]');
      control?.focus();
    });
  };

  const goToNextStep = () => {
    const nextErrors = validateStep(form, locationText, step);
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

    const nextErrors = validateStep(form, locationText, step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setMessage('Controlla i campi evidenziati.');
      focusFirstError(nextErrors);
      return;
    }

    const request: LeadRequest = {
      ...form,
      location: form.locationMode === 'text'
        ? locationText.trim()
        : summarizePolygon(form.locationGeometry!),
      locationGeometry: form.locationMode === 'polygon' ? form.locationGeometry : null,
      sourceUrl: window.location.href,
      referrer: document.referrer,
    };

    setStatus('submitting');
    setMessage('');
    const result = await submitLeadRequest(request);
    setStatus(result.ok ? 'success' : 'error');
    setMessage(result.message);
    if (result.fieldErrors) setErrors(result.fieldErrors);
  };

  const resetForm = () => {
    setIntentValue(initialIntent.value);
    setLocationText('');
    setForm(createEmptyForm(initialIntent));
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

  const messageClassName = status === 'error'
    ? 'text-red-700'
    : status === 'idle'
      ? 'text-[var(--graphite)]'
      : 'text-emerald-700';

  return (
    <div ref={pageRef}>
      <Section className="section-line">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-5xl rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-5 sm:p-8"
          noValidate
        >
          <WizardProgress step={step} />

          {step === 0 && (
            <RequestIntentSelector value={intentValue} onChange={selectIntent} />
          )}

          {step === 1 && (
            <PropertyDetailsStep
              form={form}
              errors={errors}
              updateField={updateField}
              locationSlot={(
                <LocationSelector
                  key={intentValue}
                  requestRole={form.requestRole}
                  mode={form.locationMode}
                  textValue={locationText}
                  polygonValue={form.locationGeometry}
                  error={errors.location}
                  onModeChange={selectLocationMode}
                  onTextChange={setLocationTextValue}
                  onPolygonChange={setPolygon}
                  onMapUnavailable={onMapUnavailable}
                />
              )}
            />
          )}

          {step === 2 && (
            <ContactStep
              form={form}
              errors={errors}
              updateField={updateField}
              requestId={form.requestId}
              onTurnstileVerify={onTurnstileVerify}
              onTurnstileExpire={onTurnstileExpire}
            />
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                className="focus-ring rounded-lg border border-[var(--control-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)]"
                onClick={goToPreviousStep}
              >
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
          {message && <p className={`mt-4 text-sm font-semibold ${messageClassName}`} role="status">{message}</p>}
        </form>
      </Section>
    </div>
  );
}
