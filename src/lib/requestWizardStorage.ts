import { getDefaultLocationMode, isValidLocationPolygon, requestIntents, type RequestIntent } from './requestWizard.ts';
import { createRequestWizardDraft, type RequestWizardDraft, type WizardStep } from './requestWizardFlow.ts';

export const REQUEST_WIZARD_STORAGE_KEY = 'gemut-request-wizard-v1';
const STORAGE_VERSION = 1;
const MAX_DRAFT_AGE_MS = 24 * 60 * 60 * 1000;

export interface PersistedRequestWizardState {
  wizard: RequestWizardDraft;
  progressScreen: number;
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function safeString(value: unknown, maxLength = 5_000) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function normalizeProgressScreen(step: WizardStep, value: unknown) {
  const progress = typeof value === 'number' && Number.isInteger(value) ? value : -1;
  if (step === 0) return 0;
  if (step === 1) return progress >= 1 && progress <= 5 ? progress : 1;
  return progress >= 6 && progress <= 7 ? progress : 6;
}

function hasMeaningfulDraft(wizard: RequestWizardDraft) {
  const { form } = wizard;
  return wizard.step > 0
    || Boolean(wizard.locationText.trim())
    || Boolean(wizard.locationPolygonDraft)
    || Boolean(form.propertyType || form.budget || form.timeframe || form.features)
    || Boolean(form.name || form.phone || form.email || form.notes || form.privacyAccepted);
}

export function loadPersistedRequestWizard(
  storage: StorageLike,
  fallbackIntent: RequestIntent,
  now = Date.now(),
): PersistedRequestWizardState | null {
  try {
    const rawValue = storage.getItem(REQUEST_WIZARD_STORAGE_KEY);
    if (!rawValue) return null;
    const stored = JSON.parse(rawValue) as unknown;
    if (!isRecord(stored) || stored.version !== STORAGE_VERSION || typeof stored.savedAt !== 'number') {
      storage.removeItem(REQUEST_WIZARD_STORAGE_KEY);
      return null;
    }
    if (now - stored.savedAt > MAX_DRAFT_AGE_MS || !isRecord(stored.wizard)) {
      storage.removeItem(REQUEST_WIZARD_STORAGE_KEY);
      return null;
    }

    const storedWizard = stored.wizard;
    const intent = requestIntents.find(({ value }) => value === storedWizard.intentValue) ?? fallbackIntent;
    const storedForm = isRecord(storedWizard.form) ? storedWizard.form : {};
    const requestId = safeString(storedForm.requestId, 200);
    const startedAt = typeof storedForm.startedAt === 'number' && Number.isFinite(storedForm.startedAt)
      ? storedForm.startedAt
      : now;
    const base = createRequestWizardDraft(intent, {
      requestId: requestId || undefined,
      startedAt,
    });
    const step = storedWizard.step === 1 || storedWizard.step === 2 ? storedWizard.step : 0;
    const locationMode = storedForm.locationMode === 'text' || storedForm.locationMode === 'polygon'
      ? storedForm.locationMode
      : getDefaultLocationMode(intent.requestRole);
    const locationGeometry = isValidLocationPolygon(storedForm.locationGeometry) ? storedForm.locationGeometry : null;
    const locationPolygonDraft = isValidLocationPolygon(storedWizard.locationPolygonDraft)
      ? storedWizard.locationPolygonDraft
      : null;

    return {
      progressScreen: normalizeProgressScreen(step, stored.progressScreen),
      wizard: {
        ...base,
        intentValue: intent.value,
        step,
        locationText: safeString(storedWizard.locationText, 1_000),
        locationPolygonDraft,
        form: {
          ...base.form,
          requestType: intent.requestType,
          requestRole: intent.requestRole,
          locationMode,
          locationGeometry,
          location: safeString(storedForm.location, 1_000),
          propertyType: safeString(storedForm.propertyType, 200),
          budget: safeString(storedForm.budget, 200),
          timeframe: safeString(storedForm.timeframe, 200),
          features: safeString(storedForm.features),
          name: safeString(storedForm.name, 300),
          phone: safeString(storedForm.phone, 100),
          email: safeString(storedForm.email, 320),
          contactPreference: storedForm.contactPreference === 'email' || storedForm.contactPreference === 'whatsapp'
            ? storedForm.contactPreference
            : 'telefono',
          notes: safeString(storedForm.notes),
          privacyAccepted: storedForm.privacyAccepted === true,
          turnstileToken: '',
          website: '',
          sourceUrl: '',
          referrer: '',
        },
      },
    };
  } catch {
    try {
      storage.removeItem(REQUEST_WIZARD_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
    return null;
  }
}

export function savePersistedRequestWizard(
  storage: StorageLike,
  state: PersistedRequestWizardState,
  now = Date.now(),
) {
  try {
    if (!hasMeaningfulDraft(state.wizard)) {
      storage.removeItem(REQUEST_WIZARD_STORAGE_KEY);
      return;
    }
    storage.setItem(REQUEST_WIZARD_STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      savedAt: now,
      progressScreen: state.progressScreen,
      wizard: {
        ...state.wizard,
        form: {
          ...state.wizard.form,
          turnstileToken: '',
          website: '',
          sourceUrl: '',
          referrer: '',
        },
      },
    }));
  } catch {
    // The form remains usable when storage is unavailable or full.
  }
}

export function clearPersistedRequestWizard(storage: StorageLike) {
  try {
    storage.removeItem(REQUEST_WIZARD_STORAGE_KEY);
  } catch {
    // Nothing else is required when storage is unavailable.
  }
}
