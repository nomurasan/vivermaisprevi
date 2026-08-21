import assert from 'node:assert/strict';
import { SURVEY_AXES, SURVEY_VERSION } from '../src/mock/surveyQuestions';
import { calculateAxisScore, calculateSurveyResult, canFinalizeAxis } from '../src/services/surveyScoring';
import { SurveyAnswer, SurveyDraft } from '../src/types';
import { getStatusFromScore } from '../src/mock/dimensions';

const answer = (axisId: SurveyAnswer['axisId'], n: number, score: number | null): SurveyAnswer => ({ questionId: `${axisId}-${n}`, axisId, score, optionLabel: String(score), answeredAt: new Date().toISOString() });
assert.equal(calculateAxisScore([answer('saude_fisica', 1, 20), answer('saude_fisica', 2, 40), answer('saude_fisica', 3, 60)]), 40);
assert.equal(calculateAxisScore([answer('saude_fisica', 1, 20), answer('saude_fisica', 2, null), answer('saude_fisica', 3, 60), answer('saude_fisica', 4, 80)]), 160 / 3);
assert.equal(calculateAxisScore([answer('saude_fisica', 1, 80), answer('saude_fisica', 2, 90)]), null);
assert.equal(getStatusFromScore(64), 'MERECE_ATENCAO'); assert.equal(getStatusFromScore(65), 'ACOMPANHAR'); assert.equal(getStatusFromScore(79), 'ACOMPANHAR'); assert.equal(getStatusFromScore(80), 'FORTALECIDA');
const answers = SURVEY_AXES.flatMap((axis) => axis.questions.map((q, i) => answer(axis.id, i, i === 4 ? null : 80)));
assert.equal(SURVEY_AXES.length, 8); assert.ok(answers.every((a) => canFinalizeAxis(a.axisId, answers)));
const draft: SurveyDraft = { surveyVersion: SURVEY_VERSION, profileId: 'check', displayName: 'Teste', startedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), answers: Object.fromEntries(answers.map((a) => [a.questionId, a])) };
const result = calculateSurveyResult(draft, answers);
assert.equal(result.axisResults.length, 8); assert.equal(result.ibplScore, 80); assert.equal(result.ibplStatus, 'FORTALECIDA');
console.log('check:survey passou: médias, nulos, mínimo, limites, 8 eixos, IBPL e resultado completo.');
