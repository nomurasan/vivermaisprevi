/**
 * MOTOR DE AFINIDADE E RECOMENDAÇÃO — PROGRAMA VIVENDO MAIS PREVI
 * Regras de Negócio (RNs) desacopladas e parametrizáveis
 */

import {
  Participant,
  ParticipantExpandedProfile,
  AffinityMatch,
  DiscoveryRewardSummary,
  Experience,
} from '../types';
import { CATALOG_INTERESTS, getExpandedProfile } from '../mock/interestsCatalog';
import { SYNTHETIC_PARTICIPANTS, PROFILES } from '../mock/participants';
import { EXPERIENCES } from '../mock/experiences';

export interface AffinityWeightsConfig {
  weightTrajectoryOverlap: number; // Peso de trabalharam juntos no mesmo período/unidade
  weightCommonInterests: number; // Peso de interesses em comum
  weightComplementaryLearning: number; // Peso de complementaridade aprender/compartilhar
  weightLocationProximity: number; // Peso de mesma cidade ou raio geográfico
  weightAvailabilitySchedule: number; // Peso de mesma disponibilidade de dias/turnos
  weightSharedCommunities: number; // Peso de participação em comunidades comuns
}

export const DEFAULT_AFFINITY_WEIGHTS: AffinityWeightsConfig = {
  weightTrajectoryOverlap: 35,
  weightCommonInterests: 25,
  weightComplementaryLearning: 20,
  weightLocationProximity: 10,
  weightAvailabilitySchedule: 10,
  weightSharedCommunities: 10,
};

/**
 * RN-01: Afinidade por Interesses em Comum
 */
export function calculateCommonInterests(
  profileA: ParticipantExpandedProfile,
  profileB: ParticipantExpandedProfile
): string[] {
  const idsA = new Set(profileA.interests.map((i) => i.interestId));
  const commonIds = profileB.interests
    .filter((i) => idsA.has(i.interestId))
    .map((i) => i.interestId);

  return commonIds.map((id) => {
    const catalogItem = CATALOG_INTERESTS.find((c) => c.id === id);
    return catalogItem ? catalogItem.name : id;
  });
}

/**
 * RN-02: Complementaridade Aprender / Compartilhar
 * Identifica quando Pessoa A deseja aprender algo que Pessoa B pode compartilhar/ensinar
 */
export function calculateComplementaryKnowledge(
  profileA: ParticipantExpandedProfile,
  profileB: ParticipantExpandedProfile
): { learnerWant: string; sharerCan: string }[] {
  const matches: { learnerWant: string; sharerCan: string }[] = [];

  // Checar se A quer aprender o que B pode compartilhar
  profileA.interests.forEach((intA) => {
    const wantsToLearn = intA.roles.includes('quero_aprender') || intA.roles.includes('estou_aprendendo');
    if (wantsToLearn) {
      const intB = profileB.interests.find((b) => b.interestId === intA.interestId);
      if (intB && (intB.roles.includes('posso_compartilhar') || intB.roles.includes('posso_ensinar'))) {
        const cat = CATALOG_INTERESTS.find((c) => c.id === intA.interestId);
        matches.push({
          learnerWant: `Você deseja aprender ${cat?.name || intA.interestId}`,
          sharerCan: `${profileB.participantId} pode compartilhar sobre ${cat?.name || intA.interestId}`,
        });
      }
    }
  });

  // Checar se B quer aprender o que A pode compartilhar
  profileB.interests.forEach((intB) => {
    const wantsToLearn = intB.roles.includes('quero_aprender') || intB.roles.includes('estou_aprendendo');
    if (wantsToLearn) {
      const intA = profileA.interests.find((a) => a.interestId === intB.interestId);
      if (intA && (intA.roles.includes('posso_compartilhar') || intA.roles.includes('posso_ensinar'))) {
        const cat = CATALOG_INTERESTS.find((c) => c.id === intB.interestId);
        matches.push({
          learnerWant: `${profileB.participantId} deseja aprender ${cat?.name || intB.interestId}`,
          sharerCan: `Você pode compartilhar seus conhecimentos em ${cat?.name || intB.interestId}`,
        });
      }
    }
  });

  return matches;
}

/**
 * RN-03: Sobreposição Histórica de Trajetória Funcional
 */
export function calculateTrajectoryOverlap(
  profileA: ParticipantExpandedProfile,
  profileB: ParticipantExpandedProfile
): { unitName: string; period: string }[] {
  const overlaps: { unitName: string; period: string }[] = [];

  profileA.trajectory.forEach((trajA) => {
    profileB.trajectory.forEach((trajB) => {
      const isSameUnit =
        trajA.unitName.toLowerCase().trim() === trajB.unitName.toLowerCase().trim() ||
        trajA.unitName.toLowerCase().includes(trajB.unitName.toLowerCase()) ||
        trajB.unitName.toLowerCase().includes(trajA.unitName.toLowerCase());

      if (isSameUnit) {
        const startOverlap = Math.max(trajA.startYear, trajB.startYear);
        const endOverlap = Math.min(trajA.endYear, trajB.endYear);

        if (startOverlap <= endOverlap) {
          overlaps.push({
            unitName: trajA.unitName,
            period: startOverlap === endOverlap ? `${startOverlap}` : `${startOverlap} — ${endOverlap}`,
          });
        }
      }
    });
  });

  return overlaps;
}

/**
 * RN-04: Compatibilidade de Disponibilidade
 */
export function calculateScheduleCompatibility(
  schedA: ParticipantExpandedProfile['availability'],
  schedB: ParticipantExpandedProfile['availability']
): boolean {
  if (!schedA || !schedB) return true;

  const hasCommonPeriod = schedA.periods.some((p) => schedB.periods.includes(p));
  const hasCommonDays = schedA.days.some((d) => schedB.days.includes(d));
  const hasCompatibleModality =
    schedA.modality === 'ambos' ||
    schedB.modality === 'ambos' ||
    schedA.modality === schedB.modality;

  return hasCommonPeriod && hasCommonDays && hasCompatibleModality;
}

/**
 * RN-05: Afinidade Composta com Pesos Parametrizáveis
 */
export function calculateAffinityMatch(
  currentParticipant: Participant,
  targetParticipant: Participant,
  customWeights: Partial<AffinityWeightsConfig> = {}
): AffinityMatch | null {
  if (currentParticipant.id === targetParticipant.id) return null;

  const weights = { ...DEFAULT_AFFINITY_WEIGHTS, ...customWeights };
  const profileA = getExpandedProfile(currentParticipant.id);
  const profileB = getExpandedProfile(targetParticipant.id);

  // RN-06: Visibilidade e LGPD Check
  if (!profileB.privacy.allowInterestSuggestions && !profileB.privacy.allowColleaguesFind) {
    return null;
  }

  const commonInterests = calculateCommonInterests(profileA, profileB);
  const complementary = calculateComplementaryKnowledge(profileA, profileB);
  const trajectoryOverlap = calculateTrajectoryOverlap(profileA, profileB);
  const isSameCity =
    currentParticipant.city.toLowerCase() === targetParticipant.city.toLowerCase();
  const scheduleMatch = calculateScheduleCompatibility(
    profileA.availability,
    profileB.availability
  );

  let score = 0;
  const reasons: string[] = [];

  // Trajetória profissional compartilhada
  if (trajectoryOverlap.length > 0) {
    score += weights.weightTrajectoryOverlap;
    const item = trajectoryOverlap[0];
    reasons.push(
      `Vocês trabalharam juntos na ${item.unitName} (${item.period})`
    );
  }

  // Interesses em comum
  if (commonInterests.length > 0) {
    score += Math.min(weights.weightCommonInterests, commonInterests.length * 10);
    reasons.push(
      `Vocês compartilham interesse por ${commonInterests.slice(0, 3).join(', ')}`
    );
  }

  // Complementaridade de conhecimento
  if (complementary.length > 0) {
    score += weights.weightComplementaryLearning;
    reasons.push(`Existe oportunidade de troca e aprendizagem mútua`);
  }

  // Localização
  if (isSameCity) {
    score += weights.weightLocationProximity;
    reasons.push(`Mora na mesma cidade (${currentParticipant.city})`);
  }

  // Disponibilidade
  if (scheduleMatch) {
    score += weights.weightAvailabilitySchedule;
  }

  if (score < 15) return null;

  return {
    participant: targetParticipant,
    expandedProfile: profileB,
    commonInterests,
    complementaryInterests: complementary,
    commonTrajectory: trajectoryOverlap,
    distanceKm: isSameCity ? 5 : 45,
    compositeScore: Math.min(100, score),
    reasons,
  };
}

/**
 * Gera o resumo real de recompensas e conexões descobertas após completar o perfil
 */
export function getDiscoveryRewardSummary(
  participantId: string
): DiscoveryRewardSummary {
  const current =
    PROFILES[participantId] ||
    SYNTHETIC_PARTICIPANTS.find((p) => p.id === participantId) ||
    PROFILES.carlos;

  const currentProfile = getExpandedProfile(participantId);
  const allOtherParticipants = SYNTHETIC_PARTICIPANTS.filter(
    (p) => p.id !== current.id
  );

  let trajectoryCount = 0;
  let commonInterestsCount = 0;
  let complementaryCount = 0;

  allOtherParticipants.forEach((other) => {
    const otherProfile = getExpandedProfile(other.id);
    const overlap = calculateTrajectoryOverlap(currentProfile, otherProfile);
    if (overlap.length > 0) trajectoryCount++;

    const common = calculateCommonInterests(currentProfile, otherProfile);
    if (common.length > 0) commonInterestsCount++;

    const comp = calculateComplementaryKnowledge(currentProfile, otherProfile);
    if (comp.length > 0) complementaryCount++;
  });

  // Comunidades relacionadas aos interesses selecionados
  const userInterestIds = currentProfile.interests.map((i) => i.interestId);
  const communitiesCount = Math.max(2, userInterestIds.length);

  // Experiências próximas
  const nearbyExperiencesCount = EXPERIENCES.filter((e) =>
    e.location.includes('cidade') || e.modality === 'Presencial'
  ).length;

  return {
    trajectoryCount,
    commonInterestsCount,
    complementaryKnowledgeCount: complementaryCount,
    communitiesCount,
    nearbyExperiencesCount,
  };
}

/**
 * Retorna as melhores conexões sugeridas para o participante
 */
export function getTopAffinityMatches(
  participantId: string,
  limit = 6
): AffinityMatch[] {
  const current =
    PROFILES[participantId] ||
    SYNTHETIC_PARTICIPANTS.find((p) => p.id === participantId) ||
    PROFILES.carlos;

  const matches: AffinityMatch[] = [];

  SYNTHETIC_PARTICIPANTS.forEach((other) => {
    const match = calculateAffinityMatch(current, other);
    if (match) {
      matches.push(match);
    }
  });

  // Ordenar por maior score de afinidade composta
  matches.sort((a, b) => b.compositeScore - a.compositeScore);

  return matches.slice(0, limit);
}
