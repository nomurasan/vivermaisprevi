import {
  DimensionConfig,
  DimensionId,
  DimensionScore,
  Experience,
  ExperienceEvaluation,
  LifeMoment,
  Participant,
  Partner,
  PrototypeFeedback,
  CommunityBenchmark,
} from '../types';
import { DIMENSIONS, getStatusFromScore } from '../mock/dimensions';
import { LIFE_MOMENTS } from '../mock/moments';
import { PROFILES, SYNTHETIC_PARTICIPANTS } from '../mock/participants';
import { PARTNERS } from '../mock/partners';
import { EXPERIENCES } from '../mock/experiences';
import { STRATEGIC_INSIGHTS } from '../mock/insights';
import { ECOSYSTEM_RANKINGS, DEMAND_SUPPLY_DATA, FUNNEL_STAGES, COVERAGE_MATRIX } from '../mock/ecosystemMetrics';
import { CONTEXTUAL_PROMPTS, PREVIX_MENU_OPTIONS } from '../mock/previxDialogs';

/**
 * Camada de abstração de dados do Protótipo Viver Mais PREVI
 * Preparada para consumo futuro de APIs reais, Supabase e backend de regras
 */

export async function getDimensions(): Promise<DimensionConfig[]> {
  return [...DIMENSIONS];
}

export async function getParticipant(id: string): Promise<Participant> {
  const normalizedId = id.toLowerCase();
  const profile = PROFILES[normalizedId] || SYNTHETIC_PARTICIPANTS.find((p) => p.id === id) || PROFILES.carlos;
  return { ...profile };
}

export async function getAllParticipants(): Promise<Participant[]> {
  return [...SYNTHETIC_PARTICIPANTS];
}

export async function getParticipantScores(participantId: string): Promise<DimensionScore[]> {
  const p = await getParticipant(participantId);
  return DIMENSIONS.map((dim) => {
    const score = p.scores[dim.id] ?? 70;
    const status = getStatusFromScore(score);
    return {
      dimensionId: dim.id,
      name: dim.name,
      score,
      status,
      description: dim.description,
      highlightText:
        status === 'FORTALECIDA'
          ? `Seus vínculos e hábitos em ${dim.name} aparecem como uma de suas grandes fortalezas.`
          : status === 'ACOMPANHAR'
          ? `Dimensão com bom nível de estabilidade que você pode continuar acompanhando.`
          : `Talvez valha olhar com um pouco mais de carinho e atenção para ${dim.name} neste momento.`,
    };
  });
}

export async function getIBPL(participantId: string) {
  const p = await getParticipant(participantId);
  return {
    score: p.ibpl,
    status: p.ibplStatus,
    label: 'IBPL Demonstrativo',
    explanation: 'Índice do Bem-Estar PREVI para a Longevidade (valores sintéticos no protótipo).',
  };
}

export async function getLifeMoment(momentId: string): Promise<LifeMoment | undefined> {
  return LIFE_MOMENTS.find((m) => m.id === momentId) || LIFE_MOMENTS[0];
}

export async function getAllLifeMoments(): Promise<LifeMoment[]> {
  return [...LIFE_MOMENTS];
}

export async function getPartners(): Promise<Partner[]> {
  return [...PARTNERS];
}

export async function getPartnerById(partnerId: string): Promise<Partner | undefined> {
  return PARTNERS.find((p) => p.id === partnerId);
}

export async function getExperiences(filters?: {
  dimensionId?: DimensionId;
  lifeMomentId?: string;
  goalTag?: string;
  modality?: string;
  priceType?: string;
  searchQuery?: string;
}): Promise<Experience[]> {
  let list = [...EXPERIENCES];

  if (!filters) return list;

  if (filters.dimensionId) {
    list = list.filter(
      (e) => e.dimensionId === filters.dimensionId || e.secondaryDimensionId === filters.dimensionId
    );
  }

  if (filters.lifeMomentId) {
    list = list.filter((e) => e.lifeMomentIds.includes(filters.lifeMomentId!));
  }

  if (filters.goalTag) {
    list = list.filter((e) => e.goalTags.some((t) => t.toLowerCase().includes(filters.goalTag!.toLowerCase())));
  }

  if (filters.modality && filters.modality !== 'Todos') {
    list = list.filter((e) => e.modality === filters.modality);
  }

  if (filters.priceType && filters.priceType !== 'Todos') {
    list = list.filter((e) => e.priceType === filters.priceType);
  }

  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.partnerName.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getRecommendations(participantId: string, intentionTag?: string): Promise<Experience[]> {
  const p = await getParticipant(participantId);
  const scores = await getParticipantScores(participantId);
  
  // Áreas com pontuação mais baixa (que merecem atenção) ganham peso na recomendação
  const attentionDims = scores.filter((s) => s.status === 'MERECE_ATENCAO' || s.status === 'ACOMPANHAR').map((s) => s.dimensionId);
  
  let list = [...EXPERIENCES];

  // Se o associado declarou intenção ativa (Protagonismo: DADO + ESCOLHA DECLARADA)
  if (intentionTag) {
    const matched = list.filter((e) => e.goalTags.some((g) => g.toLowerCase().includes(intentionTag.toLowerCase())));
    if (matched.length > 0) {
      // Prioritize matched then fill with related
      const remaining = list.filter((e) => !matched.some((m) => m.id === e.id));
      return [...matched, ...remaining].slice(0, 6);
    }
  }

  // Ordenar priorizando as dimensões de atenção + momento de vida
  list.sort((a, b) => {
    const aInAttention = attentionDims.includes(a.dimensionId) ? 2 : 0;
    const bInAttention = attentionDims.includes(b.dimensionId) ? 2 : 0;
    const aInMoment = a.lifeMomentIds.includes(p.lifeMomentId) ? 1 : 0;
    const bInMoment = b.lifeMomentIds.includes(p.lifeMomentId) ? 1 : 0;
    return bInAttention + bInMoment - (aInAttention + aInMoment);
  });

  return list.slice(0, 4);
}

export async function getCommunityBenchmark(participantId: string): Promise<CommunityBenchmark[]> {
  const p = await getParticipant(participantId);
  
  // Média de todos os sintéticos para a PREVI geral
  const total = SYNTHETIC_PARTICIPANTS.length;
  const previAverages: Record<DimensionId, number> = {} as any;
  const peerAverages: Record<DimensionId, number> = {} as any;

  // Grupo semelhante: mesma faixa etária (idade +/- 5 anos) ou mesmo momento de vida
  const peers = SYNTHETIC_PARTICIPANTS.filter(
    (other) => Math.abs(other.age - p.age) <= 5 || other.lifeMomentId === p.lifeMomentId
  );

  DIMENSIONS.forEach((dim) => {
    const previSum = SYNTHETIC_PARTICIPANTS.reduce((sum, curr) => sum + (curr.scores[dim.id] ?? 70), 0);
    previAverages[dim.id] = Math.round(previSum / total);

    const peerSum = peers.reduce((sum, curr) => sum + (curr.scores[dim.id] ?? 70), 0);
    peerAverages[dim.id] = Math.round(peerSum / Math.max(1, peers.length));
  });

  return DIMENSIONS.map((dim) => ({
    dimensionId: dim.id,
    userScore: p.scores[dim.id] ?? 70,
    peerGroupScore: peerAverages[dim.id] ?? 68,
    previCommunityScore: previAverages[dim.id] ?? 67,
  }));
}

export async function getStrategicInsights() {
  return [...STRATEGIC_INSIGHTS];
}

export async function getEcosystemMetrics() {
  return {
    rankings: [...ECOSYSTEM_RANKINGS],
    demandSupply: [...DEMAND_SUPPLY_DATA],
    funnel: [...FUNNEL_STAGES],
    coverageMatrix: [...COVERAGE_MATRIX],
  };
}

export async function getPrevixMenu() {
  return [...PREVIX_MENU_OPTIONS];
}

export async function getPrevixContext(contextKey: string) {
  return CONTEXTUAL_PROMPTS[contextKey] || null;
}
