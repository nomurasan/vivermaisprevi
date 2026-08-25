import { AssessmentRecord, SurveyDraft, SurveyResult } from "../types";
import { SURVEY_VERSION } from "../mock/surveyQuestions";

/**
 * Persistência local do questionário demonstrativo.
 * Usa chaves versionadas no localStorage.
 *
 * Não implementa backend nesta demonstração.
 */

const DRAFT_KEY_PREFIX = "vivermais:survey:draft:v1";
const RESULT_KEY_PREFIX = "vivermais:survey:result:v1";
const HISTORY_KEY_PREFIX = "vivermais:survey:history:v1";

function draftKey(profileId: string): string {
  return `${DRAFT_KEY_PREFIX}:${profileId}`;
}

function resultKey(profileId: string): string {
  return `${RESULT_KEY_PREFIX}:${profileId}`;
}

function historyKey(profileId: string): string {
  return `${HISTORY_KEY_PREFIX}:${profileId}`;
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
    const record = toAssessmentRecord(result);
    const history = loadSurveyHistory(result.profileId);
    const nextHistory = [...history.filter((item) => item.id !== record.id), record];
    window.localStorage.setItem(historyKey(result.profileId), JSON.stringify(nextHistory));
    window.localStorage.setItem(
      resultKey(result.profileId),
      JSON.stringify(result),
    );
  } catch (_) {
    // noop
  }
}

export function loadSurveyHistory(profileId: string): AssessmentRecord[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<AssessmentRecord[]>(window.localStorage.getItem(historyKey(profileId)));
  if (parsed?.length) return parsed.sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate));
  const latest = loadSurveyResult(profileId);
  return latest ? [toAssessmentRecord(latest)] : [];
}

function toAssessmentRecord(result: SurveyResult): AssessmentRecord {
  const scored = result.axisResults
    .filter((axis) => typeof axis.score === 'number')
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  return {
    ...result,
    id: `assessment_${result.completedAt}`,
    participantId: result.profileId,
    assessmentDate: result.completedAt,
    questionnaireVersion: result.surveyVersion,
    strengths: scored.slice(0, 2).map((axis) => axis.axisId),
    priorityOpportunities: [...scored].reverse().slice(0, 2).map((axis) => axis.axisId),
    lifeStage: 'Acompanhamento da aposentadoria',
    lifeMoments: [],
    context: 'Registro criado a partir do questionário do participante.',
    recommendations: [],
    dataSource: 'questionario_participante',
    createdAt: result.completedAt,
  };
}

export function clearSurveyResult(profileId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(resultKey(profileId));
  } catch (_) {
    // noop
  }
}
