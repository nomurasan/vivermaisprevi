export type DimensionId =
  | 'saude_fisica'
  | 'saude_emocional'
  | 'relacionamentos'
  | 'trabalho_proposito'
  | 'espiritualidade'
  | 'lazer'
  | 'recursos_financeiros'
  | 'moradia';

export type StatusScore = 'FORTALECIDA' | 'ACOMPANHAR' | 'MERECE_ATENCAO';

export interface DimensionConfig {
  id: DimensionId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  color: string;
  lightBg: string;
  borderColor: string;
  guidingQuestion: string;
  reflectionTip: string;
}

export interface DimensionScore {
  dimensionId: DimensionId;
  name: string;
  score: number;
  status: StatusScore;
  description: string;
  highlightText: string;
}

export interface LifeMoment {
  id: string;
  name: string;
  tagline: string;
  description: string;
  commonEvents: string[];
  priorityDimensions: DimensionId[];
  keyChallenges: string[];
  opportunities: string[];
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Outro';
  city: string;
  state: string;
  region: 'Sudeste' | 'Sul' | 'Nordeste' | 'Centro-Oeste' | 'Norte';
  planType: 'Plano 1' | 'PREVI Futuro' | 'PREVI Família';
  retirementStatus:
    | 'Aposentado'
    | 'Aposentada'
    | 'Pré-aposentado'
    | 'Pré-aposentada'
    | 'Pensionista'
    | 'Ativo'
    | 'Ativa';
  yearsRetired: number;
  persona: string;
  lifeMomentId: string;
  avatarUrl: string;
  ibpl: number;
  ibplStatus: 'Bem-estar elevado' | 'Bem-estar adequado' | 'Bem-estar em transição' | 'Atenção prioritária';
  scores: Record<DimensionId, number>;
  declaredInterests?: string[];
}

export interface Partner {
  id: string;
  name: string;
  isRealExample: boolean;
  category: string;
  description: string;
  website?: string;
  logoText: string;
  dimensions: DimensionId[];
  lifeMoments: string[];
  solutionCount: number;
  rating: number;
  perceivedImpact: number;
  activeUsers: number;
  adherenceRate: number;
  conversionRate: number;
  specialBadge?: string;
}

export interface Experience {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  dimensionId: DimensionId;
  secondaryDimensionId?: DimensionId;
  lifeMomentIds: string[];
  goalTags: string[];
  modality: 'Online' | 'Presencial' | 'Híbrido';
  location: string;
  priceType: 'Gratuito' | 'Benefício PREVI' | 'Desconto Exclusivo' | 'Pago';
  priceDetail?: string;
  recommendationReason: string;
  whyThisForYou: string;
  imageUrl?: string;
  views: number;
  interests: number;
  uses: number;
  rating: number;
  perceivedImpact: number;
  badge?: string;
}

export interface PlanItem {
  id: string;
  experienceId: string;
  experience: Experience;
  addedAt: string;
  status: 'planejado' | 'em_andamento' | 'realizado';
  completedAt?: string;
  userNotes?: string;
}

export interface ExperienceEvaluation {
  id: string;
  experienceId: string;
  participantId: string;
  completedDate: string;
  feeling: 'adorei' | 'gostei' | 'razoavel' | 'nao_gostei';
  benefitsGained: string[];
  comment?: string;
  partnerRatings: {
    quality: number;
    easeOfUse: number;
    metExpectations: number;
    recommendationMatch: number;
    wouldUseAgain: 'Sim' | 'Talvez' | 'Não';
    wouldRecommend: 'Sim' | 'Talvez' | 'Não';
  };
}

export interface PrototypeFeedback {
  id: string;
  createdAt: string;
  q1Utility: 'Muito' | 'Sim' | 'Talvez' | 'Não';
  q2LikedMost: string[];
  q3WishList: string;
  q4WillUse: 'Certamente' | 'Provavelmente' | 'Talvez' | 'Provavelmente não';
  q5ValuePerception: 'Muito' | 'Um pouco' | 'Não mudaria' | 'Reduziria';
  q6FutureTests: 'Sim' | 'Talvez' | 'Não';
}

export interface InteractionEvent {
  id: string;
  type:
    | 'VIEW_EXPERIENCE'
    | 'SAVE_EXPERIENCE'
    | 'SHOW_INTEREST'
    | 'MARK_AS_COMPLETED'
    | 'RATE_EXPERIENCE'
    | 'RATE_PARTNER'
    | 'OPEN_PREVIX'
    | 'PREVIX_INTERACTION'
    | 'SELECT_LIFE_GOAL'
    | 'PROTOTYPE_FEEDBACK'
    | 'CHANGE_PROFILE';
  timestamp: string;
  payload: Record<string, any>;
}

export interface CommunityBenchmark {
  dimensionId: DimensionId;
  userScore: number;
  peerGroupScore: number;
  previCommunityScore: number;
}

export interface InstitutionalFilters {
  ageGroup: string;
  gender: string;
  region: string;
  planStatus: string;
  retirementDuration: string;
  lifeMoment: string;
  dimension: string;
  period: string;
}
