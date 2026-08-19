import {
  GroupCommunityConfig,
  GroupEvent,
  GroupMessage,
  GroupMembershipStatus,
} from "../types";

export const GROUP_COMMUNITY_CONFIGS: Record<string, GroupCommunityConfig> = {
  grp_violao_sem_pressa: {
    groupId: "grp_violao_sem_pressa",
    visibility: "community",
    createdAt: "2026-01-17",
    joinMode: "open",
    unreadCount: 2,
  },
  grp_clube_fotografia_previ: {
    groupId: "grp_clube_fotografia_previ",
    visibility: "community",
    createdAt: "2025-11-09",
    joinMode: "open",
    unreadCount: 1,
  },
  grp_churrasco_convivencia: {
    groupId: "grp_churrasco_convivencia",
    visibility: "community",
    createdAt: "2026-03-02",
    joinMode: "open",
    unreadCount: 0,
  },
  grp_marcenaria_criativa: {
    groupId: "grp_marcenaria_criativa",
    visibility: "community",
    createdAt: "2026-02-14",
    joinMode: "approval",
    unreadCount: 0,
  },
  grp_tecnologia_sem_medo: {
    groupId: "grp_tecnologia_sem_medo",
    visibility: "community",
    createdAt: "2025-12-21",
    joinMode: "open",
    unreadCount: 0,
  },
  grp_rede_voluntariado_previ: {
    groupId: "grp_rede_voluntariado_previ",
    visibility: "community",
    createdAt: "2025-10-30",
    joinMode: "open",
    unreadCount: 0,
  },
};

export const INITIAL_GROUP_MEMBERSHIP_BY_USER: Record<
  string,
  Record<string, GroupMembershipStatus>
> = {
  carlos: {
    grp_violao_sem_pressa: "member",
    grp_clube_fotografia_previ: "member",
    grp_marcenaria_criativa: "member",
  },
  marina: {
    grp_violao_sem_pressa: "member",
    grp_clube_fotografia_previ: "member",
  },
  roberto: {
    grp_marcenaria_criativa: "member",
  },
};

export const INITIAL_GROUP_MESSAGES: GroupMessage[] = [
  {
    id: "gmsg_1",
    groupId: "grp_violao_sem_pressa",
    userId: "participant_2",
    message:
      "Comecei a praticar aquela musica que comentamos. Alguem gostaria de praticar junto esta semana?",
    createdAt: "10:15",
  },
  {
    id: "gmsg_2",
    groupId: "grp_violao_sem_pressa",
    userId: "carlos",
    message:
      "Eu topo! Ainda estou comecando, mas seria otimo praticarmos juntos.",
    createdAt: "10:22",
  },
  {
    id: "gmsg_3",
    groupId: "grp_violao_sem_pressa",
    userId: "participant_5",
    message: "Posso ajudar voces. Toco ha alguns anos.",
    createdAt: "10:25",
  },
  {
    id: "gmsg_4",
    groupId: "grp_clube_fotografia_previ",
    userId: "participant_11",
    message:
      "Pessoal, domingo teremos passeio fotografico no parque. Quem anima?",
    createdAt: "09:35",
  },
];

export const INITIAL_GROUP_EVENTS: GroupEvent[] = [
  {
    id: "gevt_violao_1",
    groupId: "grp_violao_sem_pressa",
    title: "Roda de Violao",
    description:
      "Encontro para praticar repertorio iniciante e troca de dicas.",
    date: "Sabado, 15h",
    location: "Clube / Brasilia",
    format: "presencial",
    createdBy: "participant_5",
    interestedUserIds: [
      "participant_2",
      "participant_5",
      "carlos",
      "participant_17",
      "participant_29",
      "participant_8",
      "participant_13",
      "participant_34",
    ],
  },
];
