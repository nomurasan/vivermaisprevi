import {
  ConnectionReason,
  InterestGroup,
  NetworkEdge,
  NetworkNode,
  Participant,
  ParticipantExpandedProfile,
} from "../types";
import {
  CATALOG_INTERESTS,
  getExpandedProfile,
} from "../mock/interestsCatalog";
import { INTEREST_GROUPS } from "../mock/networkGroups";
import { PROFILES, SYNTHETIC_PARTICIPANTS } from "../mock/participants";

const SCORE_WEIGHTS = {
  mesma_unidade_profissional: 30,
  periodo_profissional_sobreposto: 20,
  interesse_em_comum: 15,
  quer_aprender_x_pode_ensinar: 25,
  quer_praticar_x_quer_praticar: 20,
  grupo_em_comum: 15,
  mesma_cidade: 10,
};

export interface RecommendedConnection {
  participant: Participant;
  reasons: ConnectionReason[];
  score: number;
  commonInterests: string[];
  commonGroups: InterestGroup[];
  professionalRelation?: string;
}

function getParticipants(): Participant[] {
  return SYNTHETIC_PARTICIPANTS.length > 0
    ? SYNTHETIC_PARTICIPANTS
    : Object.values(PROFILES);
}

function getInterestName(interestId: string): string {
  return CATALOG_INTERESTS.find((i) => i.id === interestId)?.name || interestId;
}

function getCommonInterests(
  profileA: ParticipantExpandedProfile,
  profileB: ParticipantExpandedProfile,
): string[] {
  const idsA = new Set(profileA.interests.map((i) => i.interestId));
  return profileB.interests
    .filter((i) => idsA.has(i.interestId))
    .map((i) => getInterestName(i.interestId));
}

function getCommonGroups(userAId: string, userBId: string): InterestGroup[] {
  return INTEREST_GROUPS.filter(
    (group) =>
      group.participantIds.includes(userAId) &&
      group.participantIds.includes(userBId),
  );
}

function getTrajectoryOverlaps(
  profileA: ParticipantExpandedProfile,
  profileB: ParticipantExpandedProfile,
): { unit: string; period: string; overlapYears: number }[] {
  const overlaps: { unit: string; period: string; overlapYears: number }[] = [];

  profileA.trajectory.forEach((a) => {
    profileB.trajectory.forEach((b) => {
      const sameUnit =
        a.unitName.toLowerCase().trim() === b.unitName.toLowerCase().trim() ||
        a.unitName.toLowerCase().includes(b.unitName.toLowerCase()) ||
        b.unitName.toLowerCase().includes(a.unitName.toLowerCase());

      if (!sameUnit) return;

      const start = Math.max(a.startYear, b.startYear);
      const end = Math.min(a.endYear, b.endYear);

      if (start <= end) {
        overlaps.push({
          unit: a.unitName,
          period: `${start}-${end}`,
          overlapYears: end - start + 1,
        });
      }
    });
  });

  return overlaps;
}

function hasLearnTeachComplement(
  profileA: ParticipantExpandedProfile,
  profileB: ParticipantExpandedProfile,
): string[] {
  const complementaryInterests: string[] = [];

  profileA.interests.forEach((a) => {
    const aWants =
      a.intents?.queroAprender || a.roles.includes("quero_aprender");
    if (!aWants) return;

    const b = profileB.interests.find((it) => it.interestId === a.interestId);
    const bTeaches =
      b?.intents?.possoEnsinar ||
      b?.roles.includes("posso_ensinar") ||
      b?.roles.includes("posso_compartilhar");

    if (b && bTeaches) {
      complementaryInterests.push(getInterestName(a.interestId));
    }
  });

  return complementaryInterests;
}

function hasPracticeMatch(
  profileA: ParticipantExpandedProfile,
  profileB: ParticipantExpandedProfile,
): string[] {
  const matches: string[] = [];

  profileA.interests.forEach((a) => {
    const aPractices =
      a.intents?.queroPraticar ||
      a.roles.includes("quero_praticar") ||
      a.roles.includes("praticar_com_outros");
    if (!aPractices) return;

    const b = profileB.interests.find((it) => it.interestId === a.interestId);
    const bPractices =
      b?.intents?.queroPraticar ||
      b?.roles.includes("quero_praticar") ||
      b?.roles.includes("praticar_com_outros");

    if (b && bPractices) {
      matches.push(getInterestName(a.interestId));
    }
  });

  return matches;
}

export function getConnectionReasons(
  userA: Participant,
  userB: Participant,
): ConnectionReason[] {
  const profileA = getExpandedProfile(userA.id);
  const profileB = getExpandedProfile(userB.id);

  const reasons: ConnectionReason[] = [];

  const overlaps = getTrajectoryOverlaps(profileA, profileB);
  if (overlaps.length > 0) {
    reasons.push({
      code: "trajetoria_profissional",
      message: `Voces trabalharam na mesma unidade: ${overlaps[0].unit}.`,
      weight: SCORE_WEIGHTS.mesma_unidade_profissional,
    });
    reasons.push({
      code: "sobreposicao_de_unidade",
      message: `Periodo em comum: ${overlaps[0].period}.`,
      weight: SCORE_WEIGHTS.periodo_profissional_sobreposto,
    });
  }

  const commonInterests = getCommonInterests(profileA, profileB);
  if (commonInterests.length > 0) {
    reasons.push({
      code: "interesse_em_comum",
      message: `Voces possuem ${commonInterests.length} interesse(s) em comum: ${commonInterests.slice(0, 3).join(", ")}.`,
      weight: SCORE_WEIGHTS.interesse_em_comum,
    });
  }

  const learnTeach = hasLearnTeachComplement(profileA, profileB);
  if (learnTeach.length > 0) {
    reasons.push({
      code: "interesse_complementar",
      message: `Voce quer aprender ${learnTeach[0]} e esta pessoa pode compartilhar esse conhecimento.`,
      weight: SCORE_WEIGHTS.quer_aprender_x_pode_ensinar,
    });
  }

  const practiceMatches = hasPracticeMatch(profileA, profileB);
  if (practiceMatches.length > 0) {
    reasons.push({
      code: "interesse_complementar",
      message: `Ambos querem praticar ${practiceMatches[0]} juntos.`,
      weight: SCORE_WEIGHTS.quer_praticar_x_quer_praticar,
    });
  }

  const commonGroups = getCommonGroups(userA.id, userB.id);
  if (commonGroups.length > 0) {
    reasons.push({
      code: "grupo_em_comum",
      message: `Voces participam do grupo ${commonGroups[0].name}.`,
      weight: SCORE_WEIGHTS.grupo_em_comum,
    });
  }

  if (userA.city.toLowerCase() === userB.city.toLowerCase()) {
    reasons.push({
      code: "mesma_localidade",
      message: `Ambos moram em ${userA.city}.`,
      weight: SCORE_WEIGHTS.mesma_cidade,
    });
  }

  return reasons;
}

export function getRecommendedPeople(
  userId: string,
  limit = 12,
): RecommendedConnection[] {
  const current =
    getParticipants().find((p) => p.id === userId) || PROFILES.carlos;

  return getParticipants()
    .filter((p) => p.id !== current.id)
    .map((person) => {
      const reasons = getConnectionReasons(current, person);
      const profileA = getExpandedProfile(current.id);
      const profileB = getExpandedProfile(person.id);
      const commonInterests = getCommonInterests(profileA, profileB);
      const commonGroups = getCommonGroups(current.id, person.id);
      const overlaps = getTrajectoryOverlaps(profileA, profileB);
      const professionalRelation = overlaps[0]
        ? `${overlaps[0].unit} (${overlaps[0].period})`
        : undefined;
      const score = reasons.reduce((acc, reason) => acc + reason.weight, 0);
      return {
        participant: person,
        reasons,
        score,
        commonInterests,
        commonGroups,
        professionalRelation,
      };
    })
    .filter((entry) => entry.reasons.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export interface InterestCluster {
  interestId: string;
  interestName: string;
  category: string;
  total: number;
  learnCount: number;
  practiceCount: number;
  teachCount: number;
  relatedGroup?: InterestGroup;
}

export function getInterestClusters(userId: string): InterestCluster[] {
  const participants = getParticipants();
  const groups = INTEREST_GROUPS;

  return CATALOG_INTERESTS.map((interest) => {
    let total = 0;
    let learnCount = 0;
    let practiceCount = 0;
    let teachCount = 0;

    participants.forEach((participant) => {
      const profile = getExpandedProfile(participant.id);
      const item = profile.interests.find(
        (it) => it.interestId === interest.id,
      );
      if (!item) return;

      total += 1;
      if (item.intents?.queroAprender || item.roles.includes("quero_aprender"))
        learnCount += 1;
      if (
        item.intents?.queroPraticar ||
        item.roles.includes("quero_praticar") ||
        item.roles.includes("praticar_com_outros")
      )
        practiceCount += 1;
      if (
        item.intents?.possoEnsinar ||
        item.roles.includes("posso_ensinar") ||
        item.roles.includes("posso_compartilhar")
      )
        teachCount += 1;
    });

    const relatedGroup = groups.find((group) =>
      group.interestIds.includes(interest.id),
    );

    return {
      interestId: interest.id,
      interestName: interest.name,
      category: interest.category,
      total,
      learnCount,
      practiceCount,
      teachCount,
      relatedGroup,
    };
  })
    .filter((cluster) => cluster.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 30);
}

export function getGroupSuggestionsWithoutGroup(
  minPeople = 8,
): InterestCluster[] {
  return getInterestClusters("carlos").filter(
    (cluster) => !cluster.relatedGroup && cluster.total >= minPeople,
  );
}

export function buildConstellationData(
  userId: string,
  depth: 1 | 2 | 3 = 1,
): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const me = getParticipants().find((p) => p.id === userId) || PROFILES.carlos;
  const recommendations = getRecommendedPeople(
    userId,
    depth === 1 ? 8 : depth === 2 ? 14 : 24,
  );
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];
  const dedupeNode = new Set<string>();
  const dedupeEdge = new Set<string>();

  const addNode = (node: NetworkNode) => {
    if (dedupeNode.has(node.id)) return;
    dedupeNode.add(node.id);
    nodes.push(node);
  };

  const addEdge = (edge: NetworkEdge) => {
    if (dedupeEdge.has(edge.id)) return;
    dedupeEdge.add(edge.id);
    edges.push(edge);
  };

  addNode({ id: `p_${me.id}`, type: "pessoa", label: me.name });
  addNode({ id: `c_${me.city}`, type: "localizacao", label: me.city });
  addEdge({
    id: `mora_${me.id}_${me.city}`,
    source: `p_${me.id}`,
    target: `c_${me.city}`,
    relation: "mora_em",
  });

  const myProfile = getExpandedProfile(me.id);
  myProfile.trajectory.slice(0, 4).forEach((t) => {
    addNode({ id: `u_${t.unitName}`, type: "unidade", label: t.unitName });
    addEdge({
      id: `te_${me.id}_${t.id}`,
      source: `p_${me.id}`,
      target: `u_${t.unitName}`,
      relation: "trabalhou_em",
    });
  });

  recommendations.forEach((rec) => {
    const person = rec.participant;
    addNode({ id: `p_${person.id}`, type: "pessoa", label: person.name });
    addEdge({
      id: `pc_${me.id}_${person.id}`,
      source: `p_${me.id}`,
      target: `p_${person.id}`,
      relation: "trabalhou_com",
    });

    addNode({
      id: `c_${person.city}`,
      type: "localizacao",
      label: person.city,
    });
    addEdge({
      id: `mora_${person.id}_${person.city}`,
      source: `p_${person.id}`,
      target: `c_${person.city}`,
      relation: "mora_em",
    });

    const profile = getExpandedProfile(person.id);
    profile.trajectory.slice(0, 2).forEach((t) => {
      addNode({ id: `u_${t.unitName}`, type: "unidade", label: t.unitName });
      addEdge({
        id: `te_${person.id}_${t.id}`,
        source: `p_${person.id}`,
        target: `u_${t.unitName}`,
        relation: "trabalhou_em",
      });
    });

    profile.interests.slice(0, 3).forEach((interest) => {
      const name = getInterestName(interest.interestId);
      const roleTag = interest.intents?.queroAprender
        ? "aprender"
        : interest.intents?.possoEnsinar
          ? "ensinar"
          : "praticar";
      addNode({
        id: `i_${interest.interestId}`,
        type: "interesse",
        label: name,
        roleTag,
      });
      addEdge({
        id: `gi_${person.id}_${interest.interestId}`,
        source: `p_${person.id}`,
        target: `i_${interest.interestId}`,
        relation:
          roleTag === "ensinar"
            ? "pode_ensinar"
            : roleTag === "aprender"
              ? "quer_aprender"
              : "gosta_de",
      });

      const group = INTEREST_GROUPS.find((g) =>
        g.interestIds.includes(interest.interestId),
      );
      if (group) {
        addNode({ id: `g_${group.id}`, type: "grupo", label: group.name });
        addEdge({
          id: `pg_${person.id}_${group.id}`,
          source: `p_${person.id}`,
          target: `g_${group.id}`,
          relation: "participa_de",
        });
        addEdge({
          id: `gi_${group.id}_${interest.interestId}`,
          source: `g_${group.id}`,
          target: `i_${interest.interestId}`,
          relation: "relacionado_a",
        });
      }
    });
  });

  return { nodes, edges };
}

export const NETWORK_GROUPS = INTEREST_GROUPS;
