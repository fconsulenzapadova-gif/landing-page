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
import { getInitialIntent, type RequestIntent } from '../lib/requestWizard';
import {
  advanceRequestWizard,
  buildLeadRequestPayload,
  createRequestWizardDraft,
  normalizeLeadFieldErrors,
  resetRequestWizard,
  retreatRequestWizard,
  selectRequestIntent,
  setRequestLocationMode,
  setRequestLocationText,
  setRequestPolygon,
  setRequestPolygonDraft,
  setRequestWizardStep,
  updateRequestField,
  validateRequestStep,
  type FormErrors,
} from '../lib/requestWizardFlow';
import { usePageAnimations } from '../lib/usePageAnimations';

const stepLabels = ['Obiettivo', 'Immobile', 'Contatti'] as const;
const stepHeadingId = 'request-step-heading';
const intentErrorFields = new Set<keyof LeadRequest>(['requestType', 'requestRole']);

interface RequestsPageProps {
  submitRequest?: typeof submitLeadRequest;
}

export default function RequestsPage({ submitRequest = submitLeadRequest }: RequestsPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const initialIntent = useMemo(() => getInitialIntent(searchParams.get('type')), [searchParams]);
  const [wizard, setWizard] = useState(() => createRequestWizardDraft(initialIntent));
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiErrorSummary, setApiErrorSummary] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { form, intentValue, locationText, step } = wizard;
  usePageAnimations(pageRef);

  const clearErrorState = (field: keyof LeadRequest) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiErrorSummary([]);
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  };

  const updateField = <FieldName extends keyof LeadRequest>(field: FieldName, value: LeadRequest[FieldName]) => {
    setWizard((current) => updateRequestField(current, field, value));
    clearErrorState(field);
  };

  const selectIntent = (intent: RequestIntent) => {
    if (intent.value === intentValue) return;
    setWizard((current) => selectRequestIntent(current, intent));
    setErrors({});
    setApiErrorSummary([]);
    setStatus('idle');
    setMessage('');
  };

  const selectLocationMode = (locationMode: LocationMode) => {
    setWizard((current) => setRequestLocationMode(current, locationMode));
    clearErrorState('location');
  };

  const setLocationTextValue = (value: string) => {
    setWizard((current) => setRequestLocationText(current, value));
    clearErrorState('location');
  };

  const setPolygon = (locationGeometry: LocationPolygon | null) => {
    setWizard((current) => setRequestPolygon(current, locationGeometry));
    clearErrorState('location');
  };

  const setPolygonDraft = (locationGeometry: LocationPolygon | null) => {
    setWizard((current) => setRequestPolygonDraft(current, locationGeometry));
  };

  const onMapUnavailable = (unavailableMessage: string) => {
    setWizard((current) => ({
      ...current,
      locationPolygonDraft: null,
      form: {
        ...current.form,
        locationMode: 'text',
        location: current.locationText,
        locationGeometry: null,
      },
    }));
    setErrors((current) => ({ ...current, location: undefined }));
    setApiErrorSummary([]);
    setStatus('idle');
    setMessage(unavailableMessage);
  };

  const focusStepHeading = () => {
    window.requestAnimationFrame(() => {
      document.getElementById(stepHeadingId)?.focus();
    });
  };

  const focusError = (field?: keyof LeadRequest, focusHeadingFirst = false) => {
    window.requestAnimationFrame(() => {
      const heading = document.getElementById(stepHeadingId);
      if (focusHeadingFirst) heading?.focus();
      if (!field) return;
      const control = intentErrorFields.has(field)
        ? heading
        : document.getElementById(field)
        ?? document.querySelector<HTMLElement>('[aria-invalid="true"], [role="tab"][aria-selected="true"]');
      control?.focus();
    });
  };

  const goToNextStep = () => {
    const nextErrors = validateRequestStep(form, locationText, step);
    setErrors(nextErrors);
    setApiErrorSummary([]);
    if (Object.keys(nextErrors).length > 0) {
      focusError(Object.keys(nextErrors)[0] as keyof LeadRequest);
      return;
    }
    setWizard(advanceRequestWizard);
    setStatus('idle');
    setMessage('');
    focusStepHeading();
  };

  const goToPreviousStep = () => {
    setWizard(retreatRequestWizard);
    setErrors({});
    setApiErrorSummary([]);
    setStatus('idle');
    setMessage('');
    focusStepHeading();
  };

  const onTurnstileVerify = useCallback((token: string) => {
    setWizard((current) => updateRequestField(current, 'turnstileToken', token));
    setErrors((current) => ({ ...current, turnstileToken: undefined }));
    setApiErrorSummary([]);
  }, []);

  const onTurnstileExpire = useCallback(() => {
    setWizard((current) => updateRequestField(current, 'turnstileToken', ''));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < stepLabels.length - 1) {
      goToNextStep();
      return;
    }

    const nextErrors = validateRequestStep(form, locationText, step);
    setErrors(nextErrors);
    setApiErrorSummary([]);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setMessage('Controlla i campi evidenziati.');
      focusError(Object.keys(nextErrors)[0] as keyof LeadRequest);
      return;
    }

    const request = buildLeadRequestPayload(
      wizard,
      window.location.href,
      document.referrer,
    );

    setStatus('submitting');
    setMessage('');
    const result = await submitRequest(request);
    setStatus(result.ok ? 'success' : 'error');
    setMessage(result.message);

    if (result.fieldErrors) {
      const normalized = normalizeLeadFieldErrors(result.fieldErrors);
      setErrors(normalized.formErrors);
      setApiErrorSummary(normalized.summary);
      const changesStep = normalized.earliestStep !== step;
      setWizard((current) => setRequestWizardStep(current, normalized.earliestStep));
      focusError(normalized.firstField, changesStep);
    }
  };

  const resetForm = () => {
    setWizard(resetRequestWizard(initialIntent));
    setErrors({});
    setApiErrorSummary([]);
    setStatus('idle');
    setMessage('');
    focusStepHeading();
  };

  if (status === 'success') {
    return (
      <div ref={pageRef}>
        <RequestSuccess onReset={resetForm} />
      </div>
    );
  }

  const messageClassName = status === 'error'
    ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-[var(--line)] bg-white text-[var(--graphite)]';

  return (
    <div ref={pageRef}>
      <Section className="section-line">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-5xl rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-5 sm:p-8"
          noValidate
        >
          {message && (
            <div
              className={`mb-6 rounded-lg border p-4 text-sm font-semibold ${messageClassName}`}
              role={status === 'error' ? 'alert' : 'status'}
              aria-live={status === 'error' ? 'assertive' : 'polite'}
              aria-atomic="true"
            >
              <p>{message}</p>
              {apiErrorSummary.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 font-medium">
                  {apiErrorSummary.map((errorMessage) => <li key={errorMessage}>{errorMessage}</li>)}
                </ul>
              )}
            </div>
          )}

          <WizardProgress step={step} />

          {step === 0 && (
            <RequestIntentSelector
              value={intentValue}
              error={errors.requestType ?? errors.requestRole}
              onChange={selectIntent}
            />
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
                  polygonDraftValue={wizard.locationPolygonDraft}
                  error={errors.location}
                  onModeChange={selectLocationMode}
                  onTextChange={setLocationTextValue}
                  onPolygonChange={setPolygon}
                  onPolygonDraftChange={setPolygonDraft}
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
        </form>
      </Section>
    </div>
  );
}
