import { DimensionId } from '../types';

export interface GdpHistoryPoint {
  id: string;
  year: number;
  date: string;
  personal: number;
  median: number;
  p25: number;
  p75: number;
  pillarScores: Partial<Record<DimensionId, number>>;
  strengths: string[];
  opportunities: string[];
  actionsStarted: string[];
  actionsCompleted: string[];
  programs: string[];
  lifeMoments: string[];
  notes: string;
}

export interface GdpReferenceGroup {
  ageRange: string;
  retirementStage: string;
  employmentStatus: string;
  householdProfile: string;
  autonomyLevel: string;
  region: string;
  participantCount: number;
  period: string;
  updatedAt: string;
}

export interface FinancialCompositionRow {
  category: string;
  participant: number;
  cohort: number;
  community: number;
}

export interface HealthIndicator {
  label: string;
  participant: number;
  median: number;
  p25: number;
  p75: number;
  unit: string;
}

export const MIN_COHORT_SIZE = 30;

export const DEMO_REFERENCE_GROUP: GdpReferenceGroup = {
  ageRange: '60 a 64 anos',
  retirementStage: 'Aposentadoria semelhante',
  employmentStatus: 'Aposentados ou em fase equivalente',
  householdProfile: 'Características disponíveis próximas',
  autonomyLevel: 'Autonomia preservada',
  region: 'Brasil',
  participantCount: 128,
  period: '2022–2026',
  updatedAt: '25/08/2026',
};

const pillarSets: Array<Partial<Record<DimensionId, number>>> = [
  { saude_fisica: 72, saude_emocional: 52, relacionamentos: 76, trabalho_proposito: 51, espiritualidade: 68, lazer: 60, recursos_financeiros: 65, moradia: 70 },
  { saude_fisica: 74, saude_emocional: 55, relacionamentos: 79, trabalho_proposito: 54, espiritualidade: 70, lazer: 63, recursos_financeiros: 68, moradia: 72 },
  { saude_fisica: 77, saude_emocional: 58, relacionamentos: 82, trabalho_proposito: 57, espiritualidade: 71, lazer: 66, recursos_financeiros: 70, moradia: 74 },
  { saude_fisica: 79, saude_emocional: 61, relacionamentos: 85, trabalho_proposito: 60, espiritualidade: 73, lazer: 70, recursos_financeiros: 73, moradia: 77 },
  { saude_fisica: 82, saude_emocional: 64, relacionamentos: 88, trabalho_proposito: 64, espiritualidade: 75, lazer: 73, recursos_financeiros: 76, moradia: 80 },
];

export const DEMO_GDP_HISTORY: GdpHistoryPoint[] = [
  { id: 'demo-2022', year: 2022, date: '2022-08-25', personal: 48, median: 54, p25: 46, p75: 63, pillarScores: pillarSets[0], strengths: ['Relacionamentos'], opportunities: ['Saúde emocional', 'Planejamento financeiro'], actionsStarted: ['Organização do orçamento'], actionsCompleted: [], programs: [], lifeMoments: ['Primeira avaliação'], notes: 'Registrou Planejamento Financeiro como prioridade.' },
  { id: 'demo-2023', year: 2023, date: '2023-08-25', personal: 51, median: 55, p25: 47, p75: 64, pillarScores: pillarSets[1], strengths: ['Relacionamentos', 'Saúde física'], opportunities: ['Saúde emocional'], actionsStarted: ['Acompanhamento de gastos mensais', 'Caminhada três vezes por semana'], actionsCompleted: ['Cuidados preventivos'], programs: [], lifeMoments: ['Nova rotina de movimento'], notes: 'Passou a acompanhar gastos mensais e iniciou uma rotina de caminhada.' },
  { id: 'demo-2024', year: 2024, date: '2024-08-25', personal: 54, median: 56, p25: 48, p75: 65, pillarScores: pillarSets[2], strengths: ['Relacionamentos', 'Saúde física'], opportunities: ['Trabalho e propósito'], actionsStarted: ['Curso de atualização'], actionsCompleted: ['Preparação para aposentadoria'], programs: ['Preparação para aposentadoria'], lifeMoments: ['Redescoberta de interesses'], notes: 'Participou de atividade de preparação para aposentadoria e ingressou em um grupo de interesse.' },
  { id: 'demo-2025', year: 2025, date: '2025-08-25', personal: 57, median: 57, p25: 49, p75: 66, pillarScores: pillarSets[3], strengths: ['Relacionamentos', 'Saúde física'], opportunities: ['Saúde emocional'], actionsStarted: ['Ampliação da rede de apoio'], actionsCompleted: ['Revisão do planejamento financeiro'], programs: ['Atividade comunitária'], lifeMoments: ['Participação comunitária'], notes: 'Revisou seu planejamento financeiro e ampliou sua rede de apoio.' },
  { id: 'demo-2026', year: 2026, date: '2026-08-25', personal: 60, median: 58, p25: 50, p75: 67, pillarScores: pillarSets[4], strengths: ['Relacionamentos', 'Saúde física'], opportunities: ['Saúde emocional', 'Trabalho e propósito'], actionsStarted: ['Ação de Saúde Emocional no PDP', 'Novo objetivo relacionado a Propósito'], actionsCompleted: ['Nova avaliação do GDP'], programs: [], lifeMoments: ['Novo ciclo de projetos'], notes: 'Concluiu nova avaliação do GDP e definiu um novo objetivo relacionado a Propósito.' },
];

export const DEMO_FINANCIAL_COMPOSITION: FinancialCompositionRow[] = [
  { category: 'Moradia', participant: 24, cohort: 28, community: 26 }, { category: 'Alimentação', participant: 16, cohort: 15, community: 16 }, { category: 'Saúde', participant: 21, cohort: 14, community: 12 }, { category: 'Transporte', participant: 7, cohort: 9, community: 10 }, { category: 'Lazer e cultura', participant: 8, cohort: 8, community: 9 }, { category: 'Apoio à família', participant: 6, cohort: 7, community: 6 }, { category: 'Compromissos financeiros', participant: 5, cohort: 6, community: 7 }, { category: 'Reservas e investimentos', participant: 9, cohort: 10, community: 11 }, { category: 'Outros', participant: 4, cohort: 3, community: 3 },
];

export const DEMO_HEALTH_INDICATORS: HealthIndicator[] = [
  { label: 'Atividade física', participant: 3, median: 3, p25: 2, p75: 5, unit: 'dias/semana' }, { label: 'Qualidade percebida do sono', participant: 68, median: 72, p25: 60, p75: 82, unit: '%' }, { label: 'Cuidados preventivos acompanhados', participant: 75, median: 78, p25: 65, p75: 90, unit: '%' }, { label: 'Bem-estar emocional percebido', participant: 64, median: 70, p25: 55, p75: 82, unit: '%' }, { label: 'Autonomia percebida', participant: 88, median: 86, p25: 78, p75: 94, unit: '%' }, { label: 'Acompanhamento de saúde', participant: 80, median: 76, p25: 65, p75: 88, unit: '%' },
];
