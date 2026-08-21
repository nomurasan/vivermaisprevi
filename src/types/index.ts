export type DimensionId =
  | "saude_fisica"
  | "saude_emocional"
  | "relacionamentos"
  | "trabalho_proposito"
  | "espiritualidade"
  | "lazer"
  | "recursos_financeiros"
  | "moradia";

// ==========================================
// QUESTIONÁRIO DEMONSTRATIVO DE LONGEVIDADE
// ==========================================

export type SurveyScaleType =
  | "frequencia"
  | "concordancia"
  | "satisfacao"
  | "avaliacao"
  | "preparo"
  | "quantidade_fisica"
  | "reserva_financeira"
  | "reflexao_futuro"
  | "compreensao_beneficio";

export interface SurveyOption {
  label: string;
  /** Pontuação normalizada entre 0 e 100. Use null para "Prefiro não responder". */
  score: number | null;
}

export interface SurveyQuestion {
  id: string;
  /** Código de origem na planilha piloto (Qxxx) ou "demonstrativa" quando criada para o protótipo. */
  sourceCode: string;
  axisId: DimensionId;
  text: string;
  scaleType: SurveyScaleType;
  options: SurveyOption[];
  required: boolean;
  isDemonstrative: boolean;
  sourceNote?: string;
}

export interface SurveyAnswer {
  questionId: string;
  axisId: DimensionId;
  /** Pontuação normalizada entre 0 e 100, ou null quando o respondente optou por "Prefiro não responder". */
  score: number | null;
  /** Rótulo da opção escolhida, para fins de revisão e auditoria. */
  optionLabel: string;
  answeredAt: string;
}

export interface SurveyDraft {
  surveyVersion: string;
  profileId: string;
  displayName: string;
  startedAt: string;
  updatedAt: string;
  answers: Record<string, SurveyAnswer>;
  currentQuestionIndex?: number;
}

export interface AxisSurveyResult {
  axisId: DimensionId;
  /** Pontuação média (0-100) das respostas pontuáveis. null quando há menos de 3 respostas pontuáveis. */
  score: number | null;
  /** Quantidade de respostas pontuáveis utilizadas no cálculo. */
  scoredCount: number;
  /** Quantidade de respostas "Prefiro não responder" no eixo. */
  skippedCount: number;
  /** Total de perguntas respondidas no eixo (pontuáveis + "Prefiro não responder"). */
  answeredCount: number;
  /** Total de perguntas do eixo. */
  totalQuestions: number;
  /** Status calculado a partir da pontuação. */
  status: StatusScore | null;
  /** Indica se o eixo é válido (>= 3 respostas pontuáveis). */
  isValid: boolean;
}

export interface SurveyResult {
  surveyVersion: string;
  profileId: string;
  displayName: string;
  startedAt: string;
  completedAt: string;
  answers: SurveyAnswer[];
  axisResults: AxisSurveyResult[];
  /** Pontuação geral (média dos eixos válidos). null quando não há eixos válidos suficientes. */
  ibplScore: number | null;
  /** Status geral calculado a partir de ibplScore. */
  ibplStatus: StatusScore | null;
}

export type StatusScore = "FORTALECIDA" | "ACOMPANHAR" | "MERECE_ATENCAO";

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
  gender: "M" | "F" | "Outro";
  city: string;
  state: string;
  region: "Sudeste" | "Sul" | "Nordeste" | "Centro-Oeste" | "Norte";
  planType: "Plano 1" | "PREVI Futuro" | "PREVI Família";
  retirementStatus:
    | "Aposentado"
    | "Aposentada"
    | "Pré-aposentado"
    | "Pré-aposentada"
    | "Pensionista"
    | "Ativo"
    | "Ativa";
  yearsRetired: number;
  persona: string;
  lifeMomentId: string;
  avatarUrl: string;
  ibpl: number;
  ibplStatus:
    | "Bem-estar elevado"
    | "Bem-estar adequado"
    | "Bem-estar em transição"
    | "Atenção prioritária";
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
  featuredServiceTitle?: string;
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
  modality: "Online" | "Presencial" | "Híbrido";
  location: string;
  priceType: "Gratuito" | "Benefício PREVI" | "Desconto Exclusivo" | "Pago";
  priceDetail?: string;
  recommendationReason: string;
  whyThisForYou: string;
  imageUrl?: string;
  videoEmbedUrl?: string;
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
  status: "planejado" | "em_andamento" | "realizado";
  completedAt?: string;
  userNotes?: string;
}

export interface ExperienceEvaluation {
  id: string;
  experienceId: string;
  participantId: string;
  completedDate: string;
  feeling: "adorei" | "gostei" | "razoavel" | "nao_gostei";
  benefitsGained: string[];
  comment?: string;
  partnerRatings: {
    quality: number;
    easeOfUse: number;
    metExpectations: number;
    recommendationMatch: number;
    wouldUseAgain: "Sim" | "Talvez" | "Não";
    wouldRecommend: "Sim" | "Talvez" | "Não";
  };
}

export interface PrototypeFeedback {
  id: string;
  createdAt: string;
  q1Utility: "Muito" | "Sim" | "Talvez" | "Não";
  q2LikedMost: string[];
  q3WishList: string;
  q4WillUse: "Certamente" | "Provavelmente" | "Talvez" | "Provavelmente não";
  q5ValuePerception: "Muito" | "Um pouco" | "Não mudaria" | "Reduziria";
  q6FutureTests: "Sim" | "Talvez" | "Não";
}

export interface InteractionEvent {
  id: string;
  type:
    | "VIEW_EXPERIENCE"
    | "SAVE_EXPERIENCE"
    | "SHOW_INTEREST"
    | "MARK_AS_COMPLETED"
    | "RATE_EXPERIENCE"
    | "RATE_PARTNER"
    | "OPEN_PREVIX"
    | "PREVIX_INTERACTION"
    | "SELECT_LIFE_GOAL"
    | "PROTOTYPE_FEEDBACK"
    | "CHANGE_PROFILE";
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

// ==========================================
// DESAPOSENTE SUA REDE - TIPOS & ESTRUTURAS
// ==========================================

export type InterestRole =
  | "quero_aprender"
  | "estou_aprendendo"
  | "quero_praticar"
  | "praticar_com_outros"
  | "posso_compartilhar"
  | "posso_ensinar"
  | "conversar"
  | "participar_experiencias"
  | "encontrar_pessoas";

export interface CatalogInterest {
  id: string;
  name: string;
  category: string;
  icon: string;
  active: boolean;
  description?: string;
}

export interface ParticipantInterestItem {
  interestId: string;
  roles: InterestRole[];
  customName?: string;
  intents?: {
    queroAprender: boolean;
    queroPraticar: boolean;
    possoEnsinar: boolean;
    apenasInteresse: boolean;
  };
  experienceLevel?: "iniciante" | "intermediario" | "avancado";
  visibility?: VisibilityLevel;
}

export type VisibilityLevel = "private" | "connections" | "community";

export interface ProfileNowInfo {
  shortBio: string;
  currentCity: string;
  region: string;
  inPersonAvailability: boolean;
  onlineAvailability: boolean;
  travelAvailability: boolean;
  openToMeetPeople: boolean;
}

export interface ProfileFieldVisibility {
  about: VisibilityLevel;
  trajectory: VisibilityLevel;
  interests: VisibilityLevel;
  knowledge: VisibilityLevel;
  learning: VisibilityLevel;
  availability: VisibilityLevel;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  canShare: boolean;
}

export interface LearningWishItem {
  id: string;
  text: string;
  interestId?: string;
}

export interface ResumeActivityWishItem {
  id: string;
  text: string;
  interestId?: string;
}

export interface ExperimentWishItem {
  id: string;
  text: string;
}

export type ConnectionPreference =
  | "colegas"
  | "mesmos_hobbies"
  | "ensinar"
  | "aprender_com_outros"
  | "proximos"
  | "presencial"
  | "online"
  | "grupos_pratica"
  | "voluntariado"
  | "intergeracional"
  | "novas_amizades";

export interface AvailabilitySchedule {
  periods: ("manha" | "tarde" | "noite")[];
  days: ("dias_uteis" | "finais_semana")[];
  modality: "presencial" | "online" | "ambos";
  displacementRadiusKm: number;
}

export interface ParticipantPrivacySettings {
  showName: boolean;
  showPhoto: boolean;
  showCity: boolean;
  showInterests: boolean;
  showLearningWishes: boolean;
  showShareKnowledge: boolean;
  showCareerHistory: boolean;
  allowColleaguesFind: boolean;
  allowInterestSuggestions: boolean;
  receiveInvites: boolean;
  joinGroups: boolean;
  shareContactAfterConnection: boolean;
}

export interface FunctionalTrajectoryItem {
  id: string;
  participantId: string;
  organization: string;
  unitName: string;
  role: string;
  city: string;
  state: string;
  startYear: number;
  endYear: number;
  isCurrent?: boolean;
  projectHighlights?: string;
}

export interface ParticipantExpandedProfile {
  participantId: string;
  isCompleted: boolean;
  profileNow?: ProfileNowInfo;
  fieldVisibility?: ProfileFieldVisibility;
  interests: ParticipantInterestItem[];
  knowledgeItems: KnowledgeItem[];
  learningWishes: LearningWishItem[];
  resumeActivities: ResumeActivityWishItem[];
  experimentWishes: ExperimentWishItem[];
  connectionPreferences: ConnectionPreference[];
  availability: AvailabilitySchedule;
  privacy: ParticipantPrivacySettings;
  trajectory: FunctionalTrajectoryItem[];
  completedAt?: string;
}

export interface DiscoveryRewardSummary {
  trajectoryCount: number;
  commonInterestsCount: number;
  complementaryKnowledgeCount: number;
  communitiesCount: number;
  nearbyExperiencesCount: number;
}

export interface AffinityMatch {
  participant: Participant;
  expandedProfile?: ParticipantExpandedProfile;
  commonInterests: string[];
  complementaryInterests: { learnerWant: string; sharerCan: string }[];
  commonTrajectory?: { unitName: string; period: string }[];
  distanceKm?: number;
  compositeScore: number;
  reasons: string[];
}

export interface InterestGroup {
  id: string;
  name: string;
  interestIds: string[];
  category: string;
  cityScope: "local" | "regional" | "national";
  modality: "presencial" | "online" | "ambos";
  participantIds: string[];
  description: string;
}

export type GroupVisibility = "community" | "connections";

export type GroupMemberRole = "member" | "moderator" | "admin";

export type GroupMembershipStatus = "not_member" | "pending" | "member";

export interface GroupMember {
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  status: GroupMembershipStatus;
  joinedAt: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  message: string;
  createdAt: string;
  editedAt?: string;
}

export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  format: "presencial" | "online" | "ambos";
  createdBy: string;
  interestedUserIds: string[];
}

export interface GroupCommunityConfig {
  groupId: string;
  visibility: GroupVisibility;
  createdAt: string;
  joinMode: "open" | "approval";
  unreadCount: number;
}

export type ConnectionReasonCode =
  | "interesse_em_comum"
  | "trajetoria_profissional"
  | "sobreposicao_de_unidade"
  | "mesma_localidade"
  | "interesse_complementar"
  | "grupo_em_comum";

export interface ConnectionReason {
  code: ConnectionReasonCode;
  message: string;
  weight: number;
}

export type NetworkNodeType =
  | "pessoa"
  | "interesse"
  | "grupo"
  | "unidade"
  | "localizacao";

export interface NetworkNode {
  id: string;
  type: NetworkNodeType;
  label: string;
  roleTag?: "aprender" | "praticar" | "ensinar";
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  relation:
    | "trabalhou_com"
    | "trabalhou_em"
    | "gosta_de"
    | "quer_aprender"
    | "pode_ensinar"
    | "participa_de"
    | "mora_em"
    | "relacionado_a";
}

export interface PeerChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
  attachedExperienceId?: string;
  attachedExperienceTitle?: string;
  isVoiceNote?: boolean;
  voiceDurationSeconds?: number;
}

export interface PeerConversation {
  id: string;
  peer: Participant;
  status: "connected" | "pending_sent" | "pending_received";
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  sharedInterests: string[];
  trajectoryOverlap?: string;
  isOnline: boolean;
  messages: PeerChatMessage[];
}
