import {
  AxisSurveyResult,
  DimensionId,
  StatusScore,
  SurveyAnswer,
  SurveyDraft,
  SurveyQuestion,
  SurveyResult,
} from "../types";
import { getStatusFromScore } from "../mock/dimensions";
import {
  SURVEY_AXES,
  SURVEY_VERSION,
  getAllSurveyQuestions,
  getSurveyAxisById,
  getShortSurveyAxes,
} from "../mock/surveyQuestions";

/**
 * Quantidade mínima de respostas pontuáveis exigida em um eixo para que ele seja considerado válido.
 */
export const MIN_SCORED_ANSWERS_PER_AXIS = 1;

/**
 * Quantidade mínima de eixos válidos exigida para calcular a pontuação geral.
 */
export const MIN_VALID_AXES_FOR_OVERALL = 1;

/**
 * Calcula a pontuação de um eixo a partir das respostas.
 * Retorna null quando há menos de MIN_SCORED_ANSWERS_PER_AXIS respostas pontuáveis.
 */
export function calculateAxisScore(answers: SurveyAnswer[]): number | null {
  const scored = answers
    .map((a) => a.score)
    .filter((score): score is number => typeof score === "number");

  if (scored.length < MIN_SCORED_ANSWERS_PER_AXIS) {
    return null;
  }

  const sum = scored.reduce((acc, value) => acc + value, 0);
  return sum / scored.length;
}

/**
 * Calcula o resultado completo de um eixo, incluindo pontuação, status e contadores.
 */
export function calculateAxisResult(
  axisId: DimensionId,
  answers: SurveyAnswer[],
): AxisSurveyResult {
  const axis = getSurveyAxisById(axisId);
  const totalQuestions = getShortSurveyAxes().find((a) => a.id === axisId)?.questions.length ?? axis?.questions.length ?? 0;
  const scoredCount = answers.filter((a) => typeof a.score === "number").length;
  const skippedCount = answers.filter((a) => a.score === null).length;
  const answeredCount = answers.length;
  const score = calculateAxisScore(answers);
  const isValid = score !== null;
  const status: StatusScore | null = isValid ? getStatusFromScore(score) : null;

  return {
    axisId,
    score,
    scoredCount,
    skippedCount,
    answeredCount,
    totalQuestions,
    status,
    isValid,
  };
}

/**
 * Calcula a pontuação geral (IBPL Demonstrativo) a partir dos resultados por eixo.
 * Usa a média aritmética dos eixos válidos.
 * Retorna null quando não há eixos válidos suficientes.
 */
export function calculateOverallScore(
  axisResults: AxisSurveyResult[],
): number | null {
  const validScores = axisResults
    .filter((r) => r.isValid && typeof r.score === "number")
    .map((r) => r.score as number);

  if (validScores.length < MIN_VALID_AXES_FOR_OVERALL) {
    return null;
  }

  const sum = validScores.reduce((acc, value) => acc + value, 0);
  return sum / validScores.length;
}

/**
 * Calcula o status geral a partir da pontuação geral.
 */
export function calculateOverallStatus(
  overallScore: number | null,
): StatusScore | null {
  if (overallScore === null) return null;
  return getStatusFromScore(overallScore);
}

/**
 * Calcula o resultado completo do questionário a partir das respostas.
 */
export function calculateSurveyResult(
  draft: SurveyDraft,
  answers: SurveyAnswer[],
): SurveyResult {
  const axisResults: AxisSurveyResult[] = getShortSurveyAxes().map((axis) => {
    const axisAnswers = answers.filter((a) => a.axisId === axis.id);
    return calculateAxisResult(axis.id, axisAnswers);
  });

  const ibplScore = calculateOverallScore(axisResults);
  const ibplStatus = calculateOverallStatus(ibplScore);

  return {
    surveyVersion: draft.surveyVersion,
    profileId: draft.profileId,
    displayName: draft.displayName,
    startedAt: draft.startedAt,
    completedAt: new Date().toISOString(),
    answers,
    axisResults,
    ibplScore,
    ibplStatus,
  };
}

/**
 * Verifica se um eixo pode ser finalizado.
 * Exige ao menos MIN_SCORED_ANSWERS_PER_AXIS respostas pontuáveis.
 * A opção "Prefiro não responder" conta como respondida, mas não entra na média.
 */
export function canFinalizeAxis(
  axisId: DimensionId,
  answers: SurveyAnswer[],
): boolean {
  const scoredCount = answers.filter(
    (a) => a.axisId === axisId && typeof a.score === "number",
  ).length;
  return scoredCount >= MIN_SCORED_ANSWERS_PER_AXIS;
}

/**
 * Verifica se todos os eixos podem ser finalizados.
 */
export function canFinalizeSurvey(answers: SurveyAnswer[]): boolean {
  return getShortSurveyAxes().every((axis) => axis.questions.every((q) => answers.some((a) => a.questionId === q.id)) && canFinalizeAxis(axis.id, answers));
}

/**
 * Retorna os eixos que ainda não podem ser finalizados.
 */
export function getIncompleteAxes(answers: SurveyAnswer[]): DimensionId[] {
  return getShortSurveyAxes().filter((axis) => !canFinalizeAxis(axis.id, answers)).map(
    (axis) => axis.id,
  );
}

/**
 * Cria um rascunho inicial do questionário.
 */
export function createInitialDraft(
  profileId: string,
  displayName: string,
): SurveyDraft {
  const now = new Date().toISOString();
  return {
    surveyVersion: SURVEY_VERSION,
    profileId,
    displayName,
    startedAt: now,
    updatedAt: now,
    answers: {},
  };
}

/**
 * Converte uma resposta em SurveyAnswer, validando o score.
 */
export function buildAnswer(
  question: SurveyQuestion,
  optionLabel: string,
  score: number | null,
): SurveyAnswer {
  return {
    questionId: question.id,
    axisId: question.axisId,
    score,
    optionLabel,
    answeredAt: new Date().toISOString(),
  };
}

/**
 * Retorna o total de perguntas do questionário.
 */
export function getTotalQuestionsCount(): number {
  return getAllSurveyQuestions().length;
}

/**
 * Conta quantas perguntas foram respondidas (pontuáveis ou "Prefiro não responder").
 */
export function countAnsweredQuestions(answers: SurveyAnswer[]): number {
  return answers.length;
}

/**
 * Conta quantas perguntas foram respondidas com pontuação (excluindo "Prefiro não responder").
 */
export function countScoredQuestions(answers: SurveyAnswer[]): number {
  return answers.filter((a) => typeof a.score === "number").length;
}
