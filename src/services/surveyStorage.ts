import { SurveyDraft, SurveyResult } from "../types";
import { SURVEY_VERSION } from "../mock/surveyQuestions";

/**
 * Persistência local do questionário demonstrativo.
 * Usa chaves versionadas no localStorage.
 *
 * Não implementa backend nesta demonstração.
 */

const DRAFT_KEY_PREFIX = "vivermais:survey:draft:v1";
const RESULT_KEY_PREFIX = "vivermais:survey:result:v1";

function draftKey(profileId: string): string {
  return `${DRAFT_KEY_PREFIX}:${profileId}`;
}

function resultKey(profileId: string): string {
  return `${RESULT_KEY_PREFIX}:${profileId}`;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch (_) {
    return null;
  }
}

export function loadSurveyDraft(profileId: string): SurveyDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(draftKey(profileId));
  const parsed = safeParse<SurveyDraft>(raw);
  if (!parsed) return null;
  if (parsed.surveyVersion !== SURVEY_VERSION) return null;
  if (parsed.profileId !== profileId) return null;
  return parsed;
}

export function saveSurveyDraft(draft: SurveyDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      draftKey(draft.profileId),
      JSON.stringify(draft),
    );
  } catch (_) {
    // Silencia erros de quota ou indisponibilidade do localStorage.
  }
}

export function clearSurveyDraft(profileId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(draftKey(profileId));
  } catch (_) {
    // noop
  }
}

export function loadSurveyResult(profileId: string): SurveyResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(resultKey(profileId));
  const parsed = safeParse<SurveyResult>(raw);
  if (!parsed) return null;
  if (parsed.surveyVersion !== SURVEY_VERSION) return null;
  if (parsed.profileId !== profileId) return null;
  return parsed;
}

export function saveSurveyResult(result: SurveyResult): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      resultKey(result.profileId),
      JSON.stringify(result),
    );
  } catch (_) {
    // noop
  }
}

export function clearSurveyResult(profileId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(resultKey(profileId));
  } catch (_) {
    // noop
  }
}
