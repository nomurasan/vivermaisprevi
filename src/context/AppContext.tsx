import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DimensionScore,
  Experience,
  ExperienceEvaluation,
  InteractionEvent,
  Participant,
  PlanItem,
  PrototypeFeedback,
  ParticipantExpandedProfile,
  ParticipantInterestItem,
  KnowledgeItem,
  LearningWishItem,
  ResumeActivityWishItem,
  ExperimentWishItem,
  ConnectionPreference,
  AvailabilitySchedule,
  ParticipantPrivacySettings,
  PeerConversation,
  PeerChatMessage,
  SurveyDraft,
  SurveyResult,
} from '../types';
import {
  getParticipant,
  getParticipantScores,
  getExperiences,
} from '../services/api';
import { PROFILES } from '../mock/participants';
import { EXPERIENCES } from '../mock/experiences';
import { getExpandedProfile } from '../mock/interestsCatalog';
import { INITIAL_CONVERSATIONS, SMART_RESPONSES_BY_INTEREST } from '../mock/peerConversations';
import { calculateSurveyResult, createInitialDraft } from '../services/surveyScoring';
import { loadSurveyDraft, saveSurveyDraft, loadSurveyResult as readSurveyResult, saveSurveyResult, clearSurveyDraft, clearSurveyResult } from '../services/surveyStorage';
import { DIMENSIONS, getStatusLabel } from '../mock/dimensions';

export type AppView =
  | 'home'
  | 'programa'
  | 'como_funciona'
  | 'onboarding'
  | 'meu_viver_mais'
  | 'desaposente_rede'
  | 'explorar'
  | 'meu_plano'
  | 'inteligencia'
  | 'privacidade'
  | 'questionario_intro'
  | 'questionario';

export type MeuViverMaisTab =
  | 'gda'
  | 'retrato'
  | 'desaposente_rede'
  | 'pda'
  | 'hall_mestres'
  | 'novas_experiencias'
  | 'para_mim'
  | 'gdp_aposentado'
  | 'momento'
  | 'comparacao'
  | 'evolucao';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  meuViverMaisTab: MeuViverMaisTab;
  setMeuViverMaisTab: (tab: MeuViverMaisTab) => void;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  currentParticipant: Participant;
  expandedProfile: ParticipantExpandedProfile;
  dimensionScores: DimensionScore[];
  surveyDraft: SurveyDraft | null;
  surveyResult: SurveyResult | null;
  ibplScore: number | null;
  ibplStatus: string | null;
  myPlan: PlanItem[];
  savedExperienceIds: string[];
  interestedExperienceIds: string[];
  activeIntentionTag: string | null;
  setActiveIntentionTag: (tag: string | null) => void;
  fontSizeLarge: boolean;
  setFontSizeLarge: (val: boolean | ((prev: boolean) => boolean)) => void;
  isPrevixOpen: boolean;
  setIsPrevixOpen: (open: boolean) => void;
  previxContextKey: string;
  setPrevixContextKey: (key: string) => void;
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (open: boolean) => void;
  selectedExperienceForDetail: Experience | null;
  setSelectedExperienceForDetail: (exp: Experience | null) => void;
  selectedPlanItemForEvaluation: PlanItem | null;
  setSelectedPlanItemForEvaluation: (item: PlanItem | null) => void;
  evaluationHistory: ExperienceEvaluation[];
  prototypeFeedbacks: PrototypeFeedback[];
  events: InteractionEvent[];
  // Mensagens e Conexões
  peerConversations: PeerConversation[];
  activePeerConversationId: string | null;
  setActivePeerConversationId: (id: string | null) => void;
  reconnectionStatusMap: Record<string, 'none' | 'pending' | 'connected'>;
  toastMessage: { title: string; description: string; type?: 'success' | 'info' | 'connection'; actionLabel?: string; onAction?: () => void } | null;
  setToastMessage: (msg: { title: string; description: string; type?: 'success' | 'info' | 'connection'; actionLabel?: string; onAction?: () => void } | null) => void;
  sendReconnectionRequest: (participant: Participant, mutualTrajectory?: string, sharedInterests?: string[]) => void;
  acceptReconnectionRequest: (conversationId: string) => void;
  sendPeerMessage: (conversationId: string, text: string, attachedExp?: { id: string; title: string }) => void;
  restartPeerConversation: (conversationId: string) => void;
  // Actions
  switchProfile: (profileId: string) => void;
  navigateTo: (view: AppView, tab?: MeuViverMaisTab, contextKey?: string) => void;
  updateExpandedProfile: (updater: (prev: ParticipantExpandedProfile) => ParticipantExpandedProfile) => void;
  saveInterestItem: (item: ParticipantInterestItem) => void;
  removeInterestItem: (interestId: string) => void;
  addKnowledgeItem: (item: KnowledgeItem) => void;
  removeKnowledgeItem: (id: string) => void;
  addLearningWish: (wish: LearningWishItem) => void;
  removeLearningWish: (id: string) => void;
  addResumeActivity: (act: ResumeActivityWishItem) => void;
  removeResumeActivity: (id: string) => void;
  addExperimentWish: (exp: ExperimentWishItem) => void;
  removeExperimentWish: (id: string) => void;
  setConnectionPreferences: (prefs: ConnectionPreference[]) => void;
  setAvailabilitySchedule: (schedule: AvailabilitySchedule) => void;
  setPrivacySettings: (privacy: ParticipantPrivacySettings) => void;
  toggleSaveExperience: (exp: Experience) => void;
  showInterestInExperience: (exp: Experience) => void;
  addToPlan: (exp: Experience) => void;
  removeFromPlan: (planItemId: string) => void;
  markPlanItemCompleted: (planItemId: string) => void;
  submitExperienceEvaluation: (evaluation: ExperienceEvaluation) => void;
  submitPrototypeFeedback: (feedback: PrototypeFeedback) => void;
  recordEvent: (type: InteractionEvent['type'], payload: Record<string, any>) => void;
  saveSurveyAnswer: (questionId: string, axisId: any, optionLabel: string, score: number | null, currentQuestionIndex?: number) => void;
  startSurvey: (displayName: string) => void;
  completeSurvey: () => SurveyResult | null;
  restartSurvey: () => void;
  loadSurveyResult: (profileId?: string) => SurveyResult | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial initial sample plan for Carlos
const INITIAL_PLAN: PlanItem[] = [
  {
    id: 'plan_1',
    experienceId: 'maturi_reconexao_prof',
    experience: EXPERIENCES[0],
    addedAt: '2026-08-10',
    status: 'em_andamento',
  },
  {
    id: 'plan_2',
    experienceId: 'easylive_cultura_exp',
    experience: EXPERIENCES[1],
    addedAt: '2026-08-12',
    status: 'planejado',
  },
  {
    id: 'plan_3',
    experienceId: 'easylive_movimento_lazer',
    experience: EXPERIENCES[2],
    addedAt: '2026-08-01',
    status: 'realizado',
    completedAt: '2026-08-15',
    userNotes: 'Caminhada matinal no parque com grupo de novos amigos.',
  },
];

const INITIAL_PROTOTYPE_FEEDBACKS: PrototypeFeedback[] = [
  {
    id: 'fb_1',
    createdAt: '2026-08-16',
    q1Utility: 'Muito',
    q2LikedMost: ['Meu Retrato', '8 Áreas da Vida', 'Experiências'],
    q3WishList: 'Gostaria de mais opções de viagens em grupo com associados do meu estado.',
    q4WillUse: 'Certamente',
    q5ValuePerception: 'Muito',
    q6FutureTests: 'Sim',
  },
  {
    id: 'fb_2',
    createdAt: '2026-08-17',
    q1Utility: 'Sim',
    q2LikedMost: ['Meu Retrato', 'PREVIX', 'Meu Plano'],
    q3WishList: 'Integrar lembretes com a agenda do celular.',
    q4WillUse: 'Provavelmente',
    q5ValuePerception: 'Muito',
    q6FutureTests: 'Sim',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('meu_viver_mais');
  const [meuViverMaisTab, setMeuViverMaisTab] = useState<MeuViverMaisTab>('gda');
  const [activeProfileId, setActiveProfileId] = useState<string>('carlos');
  const [currentParticipant, setCurrentParticipant] = useState<Participant>(PROFILES.carlos);
  const [expandedProfile, setExpandedProfile] = useState<ParticipantExpandedProfile>(
    getExpandedProfile('carlos')
  );
  const [dimensionScores, setDimensionScores] = useState<DimensionScore[]>([]);
  const [surveyDraft, setSurveyDraft] = useState<SurveyDraft | null>(null);
  const [surveyResult, setSurveyResult] = useState<SurveyResult | null>(null);
  const [myPlan, setMyPlan] = useState<PlanItem[]>(INITIAL_PLAN);
  const [savedExperienceIds, setSavedExperienceIds] = useState<string[]>([
    'maturi_reconexao_prof',
    'easylive_cultura_exp',
    'easylive_movimento_lazer',
  ]);
  const [interestedExperienceIds, setInterestedExperienceIds] = useState<string[]>(['maturi_reconexao_prof']);
  const [activeIntentionTag, setActiveIntentionTag] = useState<string | null>(null);
  const [fontSizeLarge, setFontSizeLarge] = useState<boolean>(false);
  const [isPrevixOpen, setIsPrevixOpen] = useState<boolean>(false);
  const [previxContextKey, setPrevixContextKey] = useState<string>('home');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [selectedExperienceForDetail, setSelectedExperienceForDetail] = useState<Experience | null>(null);
  const [selectedPlanItemForEvaluation, setSelectedPlanItemForEvaluation] = useState<PlanItem | null>(null);
  const [evaluationHistory, setEvaluationHistory] = useState<ExperienceEvaluation[]>([]);
  const [prototypeFeedbacks, setPrototypeFeedbacks] = useState<PrototypeFeedback[]>(INITIAL_PROTOTYPE_FEEDBACKS);
  const [events, setEvents] = useState<InteractionEvent[]>([]);

  // Mensagens e Conexões (Desaposente sua Rede)
  const [peerConversations, setPeerConversations] = useState<PeerConversation[]>(INITIAL_CONVERSATIONS);
  const [activePeerConversationId, setActivePeerConversationId] = useState<string | null>('tereza_martins');
  const [reconnectionStatusMap, setReconnectionStatusMap] = useState<Record<string, 'none' | 'pending' | 'connected'>>({
    synth_1_tereza: 'connected',
    synth_2_luiz: 'connected',
    synth_3_helena: 'pending',
  });
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    type?: 'success' | 'info' | 'connection';
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load participant data when active profile changes
  useEffect(() => {
    async function loadData() {
      const p = await getParticipant(activeProfileId);
      const scores = await getParticipantScores(activeProfileId);
      const expProfile = getExpandedProfile(activeProfileId);
      setCurrentParticipant(p);
      const result = readSurveyResult(activeProfileId);
      const draft = loadSurveyDraft(activeProfileId);
      setSurveyResult(result);
      setSurveyDraft(draft);
      setDimensionScores(result ? result.axisResults.filter((a) => a.score !== null).map((a) => {
        const dim = DIMENSIONS.find((d) => d.id === a.axisId)!;
        return { dimensionId: a.axisId, name: dim.name, score: a.score as number, status: a.status!, description: dim.description, highlightText: dim.reflectionTip };
      }) : scores);
      setExpandedProfile(expProfile);
      setCurrentView('meu_viver_mais');
      setMeuViverMaisTab('gda');
    }
    loadData();
  }, [activeProfileId]);

  const saveSurveyAnswer = (questionId: string, axisId: any, optionLabel: string, score: number | null, currentQuestionIndex?: number) => {
    setSurveyDraft((previous) => {
      const draft = previous || createInitialDraft(activeProfileId, currentParticipant.name);
      const updated = { ...draft, updatedAt: new Date().toISOString(), currentQuestionIndex, answers: { ...draft.answers, [questionId]: { questionId, axisId, optionLabel, score, answeredAt: new Date().toISOString() } } };
      saveSurveyDraft(updated);
      return updated;
    });
  };

  const startSurvey = (displayName: string) => {
    const existing = loadSurveyDraft(activeProfileId);
    const draft = existing ? { ...existing, displayName } : createInitialDraft(activeProfileId, displayName);
    setSurveyDraft(draft); saveSurveyDraft(draft); setCurrentView('questionario');
  };

  const completeSurvey = () => {
    if (!surveyDraft) return null;
    const result = calculateSurveyResult(surveyDraft, Object.values(surveyDraft.answers));
    saveSurveyResult(result); clearSurveyDraft(activeProfileId); setSurveyResult(result); setSurveyDraft(null);
    const scores = result.axisResults.filter((a) => a.score !== null).map((a) => { const dim = DIMENSIONS.find((d) => d.id === a.axisId)!; return { dimensionId: a.axisId, name: dim.name, score: a.score as number, status: a.status!, description: dim.description, highlightText: dim.reflectionTip }; });
    setDimensionScores(scores); setMeuViverMaisTab('gda'); setCurrentView('meu_viver_mais');
    return result;
  };

  const restartSurvey = () => { clearSurveyDraft(activeProfileId); clearSurveyResult(activeProfileId); setSurveyDraft(null); setSurveyResult(null); setDimensionScores([]); setCurrentView('questionario_intro'); };

  const recordEvent = (type: InteractionEvent['type'], payload: Record<string, any>) => {
    const newEvent: InteractionEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: new Date().toISOString(),
      payload,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const switchProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    recordEvent('CHANGE_PROFILE', { newProfileId: profileId });
  };

  const updateExpandedProfile = (updater: (prev: ParticipantExpandedProfile) => ParticipantExpandedProfile) => {
    setExpandedProfile((prev) => {
      const updated = updater(prev);
      recordEvent('PROTOTYPE_FEEDBACK', { action: 'UPDATE_EXPANDED_PROFILE', participantId: updated.participantId });
      return updated;
    });
  };

  const saveInterestItem = (item: ParticipantInterestItem) => {
    updateExpandedProfile((prev) => {
      const filtered = prev.interests.filter((i) => i.interestId !== item.interestId);
      return {
        ...prev,
        interests: [...filtered, item],
      };
    });
  };

  const removeInterestItem = (interestId: string) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i.interestId !== interestId),
    }));
  };

  const addKnowledgeItem = (item: KnowledgeItem) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      knowledgeItems: [...prev.knowledgeItems.filter((k) => k.id !== item.id), item],
    }));
  };

  const removeKnowledgeItem = (id: string) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      knowledgeItems: prev.knowledgeItems.filter((k) => k.id !== id),
    }));
  };

  const addLearningWish = (wish: LearningWishItem) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      learningWishes: [...prev.learningWishes.filter((w) => w.id !== wish.id), wish],
    }));
  };

  const removeLearningWish = (id: string) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      learningWishes: prev.learningWishes.filter((w) => w.id !== id),
    }));
  };

  const addResumeActivity = (act: ResumeActivityWishItem) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      resumeActivities: [...prev.resumeActivities.filter((a) => a.id !== act.id), act],
    }));
  };

  const removeResumeActivity = (id: string) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      resumeActivities: prev.resumeActivities.filter((a) => a.id !== id),
    }));
  };

  const addExperimentWish = (exp: ExperimentWishItem) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      experimentWishes: [...prev.experimentWishes.filter((e) => e.id !== exp.id), exp],
    }));
  };

  const removeExperimentWish = (id: string) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      experimentWishes: prev.experimentWishes.filter((e) => e.id !== id),
    }));
  };

  const setConnectionPreferences = (prefs: ConnectionPreference[]) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      connectionPreferences: prefs,
    }));
  };

  const setAvailabilitySchedule = (schedule: AvailabilitySchedule) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      availability: schedule,
    }));
  };

  const setPrivacySettings = (privacy: ParticipantPrivacySettings) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      privacy,
    }));
  };

  const navigateTo = (view: AppView, tab?: MeuViverMaisTab, contextKey?: string) => {
    setCurrentView(view);
    if (tab) {
      setMeuViverMaisTab(tab);
    }
    if (contextKey) {
      setPrevixContextKey(contextKey);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const addToPlan = (exp: Experience) => {
    if (myPlan.some((item) => item.experienceId === exp.id)) return;
    const newItem: PlanItem = {
      id: `plan_${Date.now()}`,
      experienceId: exp.id,
      experience: exp,
      addedAt: new Date().toISOString().split('T')[0],
      status: 'planejado',
    };
    setMyPlan((prev) => [newItem, ...prev]);
    if (!savedExperienceIds.includes(exp.id)) {
      setSavedExperienceIds((prev) => [...prev, exp.id]);
    }
    recordEvent('SAVE_EXPERIENCE', { experienceId: exp.id, title: exp.title });
  };

  const toggleSaveExperience = (exp: Experience) => {
    if (savedExperienceIds.includes(exp.id)) {
      setSavedExperienceIds((prev) => prev.filter((id) => id !== exp.id));
      setMyPlan((prev) => prev.filter((item) => item.experienceId !== exp.id));
    } else {
      addToPlan(exp);
    }
  };

  const showInterestInExperience = (exp: Experience) => {
    if (!interestedExperienceIds.includes(exp.id)) {
      setInterestedExperienceIds((prev) => [...prev, exp.id]);
      recordEvent('SHOW_INTEREST', { experienceId: exp.id, title: exp.title });
    }
  };

  const removeFromPlan = (planItemId: string) => {
    const item = myPlan.find((i) => i.id === planItemId);
    if (item) {
      setSavedExperienceIds((prev) => prev.filter((id) => id !== item.experienceId));
      setMyPlan((prev) => prev.filter((i) => i.id !== planItemId));
    }
  };

  const markPlanItemCompleted = (planItemId: string) => {
    const item = myPlan.find((i) => i.id === planItemId);
    if (item) {
      setMyPlan((prev) =>
        prev.map((i) =>
          i.id === planItemId
            ? { ...i, status: 'realizado', completedAt: new Date().toISOString().split('T')[0] }
            : i
        )
      );
      recordEvent('MARK_AS_COMPLETED', { planItemId, experienceTitle: item.experience.title });
      setSelectedPlanItemForEvaluation(item);
    }
  };

  const sendReconnectionRequest = (
    peer: Participant,
    mutualTrajectory?: string,
    sharedInterests?: string[]
  ) => {
    const convId = `conv_${peer.id}`;
    setReconnectionStatusMap((prev) => ({
      ...prev,
      [peer.id]: 'pending',
    }));

    setPeerConversations((prev) => {
      const existing = prev.find((c) => c.id === convId || c.peer.id === peer.id);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id ? { ...c, status: 'pending_sent' } : c
        );
      }
      const newConv: PeerConversation = {
        id: convId,
        peer,
        status: 'pending_sent',
        lastMessage: 'Solicitação de reconexão segura enviada.',
        lastMessageTime: 'Agora',
        unreadCount: 0,
        sharedInterests: sharedInterests || peer.declaredInterests || ['Afinidades PREVI'],
        trajectoryOverlap: mutualTrajectory || 'Colega de Trajetória PREVI / BB',
        isOnline: true,
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            senderId: 'user',
            senderName: currentParticipant.name,
            senderAvatar: currentParticipant.avatarUrl,
            text: `Olá ${peer.name.split(' ')[0]}! Enviei uma solicitação de reconexão segura pelo Programa Vivendo Mais PREVI.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          },
        ],
      };
      return [newConv, ...prev];
    });

    recordEvent('PROTOTYPE_FEEDBACK', { action: 'SEND_RECONNECTION', peerId: peer.id, peerName: peer.name });

    setToastMessage({
      title: 'Solicitação de Reconexão Enviada!',
      description: `Apresentação segura enviada para ${peer.name}. Para proteger sua privacidade (LGPD), a conversa privada será liberada com o duplo consentimento.`,
      type: 'connection',
      actionLabel: 'Simular Aceite & Conversar 💬',
      onAction: () => {
        acceptReconnectionRequest(convId, peer.id);
        setActivePeerConversationId(convId);
        setCurrentView('desaposente_rede');
      },
    });
  };

  const acceptReconnectionRequest = (conversationId: string, peerId?: string) => {
    setPeerConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId || (peerId && c.peer.id === peerId)) {
          const targetPeerId = peerId || c.peer.id;
          setReconnectionStatusMap((map) => ({ ...map, [targetPeerId]: 'connected' }));
          const welcomeMsg: PeerChatMessage = {
            id: `msg_acc_${Date.now()}`,
            senderId: c.peer.id,
            senderName: c.peer.name,
            senderAvatar: c.peer.avatarUrl,
            text: `Que ótima surpresa reencontrar você por aqui! Aceitei seu convite de reconexão. Como você está?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
          };
          return {
            ...c,
            status: 'connected',
            lastMessage: welcomeMsg.text,
            lastMessageTime: welcomeMsg.timestamp,
            unreadCount: c.unreadCount + 1,
            messages: [...c.messages, welcomeMsg],
          };
        }
        return c;
      })
    );

    setToastMessage({
      title: 'Conexão Confirmada!',
      description: 'Reconexão aceita com sucesso! Você agora pode trocar mensagens com total segurança.',
      type: 'success',
    });
  };

  const sendPeerMessage = (
    conversationId: string,
    text: string,
    attachedExp?: { id: string; title: string }
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: PeerChatMessage = {
      id: `msg_u_${Date.now()}`,
      senderId: 'user',
      senderName: currentParticipant.name,
      senderAvatar: currentParticipant.avatarUrl,
      text,
      timestamp: timeStr,
      isRead: true,
      attachedExperienceId: attachedExp?.id,
      attachedExperienceTitle: attachedExp?.title,
    };

    setPeerConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text || (attachedExp ? `Convite: ${attachedExp.title}` : ''),
            lastMessageTime: timeStr,
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    recordEvent('PROTOTYPE_FEEDBACK', { action: 'SEND_PEER_MESSAGE', conversationId });

    // Simulated friendly automatic reply
    setTimeout(() => {
      setPeerConversations((prev) => {
        const conv = prev.find((c) => c.id === conversationId);
        if (!conv) return prev;

        const defaultReplies = SMART_RESPONSES_BY_INTEREST.default;
        const randomReply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];

        const replyMsg: PeerChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: conv.peer.id,
          senderName: conv.peer.name,
          senderAvatar: conv.peer.avatarUrl,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };

        return prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: replyMsg.text,
                lastMessageTime: replyMsg.timestamp,
                unreadCount: c.unreadCount + 1,
                messages: [...c.messages, replyMsg],
              }
            : c
        );
      });
    }, 1200);
  };

  const restartPeerConversation = (conversationId: string) => {
    setPeerConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const initialTemplate = INITIAL_CONVERSATIONS.find((init) => init.id === conversationId);
          const initialMessages = initialTemplate?.messages
            ? [...initialTemplate.messages]
            : [
                {
                  id: `msg_init_${Date.now()}`,
                  senderId: c.peer.id,
                  senderName: c.peer.name,
                  senderAvatar: c.peer.avatarUrl,
                  text: `Olá ${currentParticipant.name.split(' ')[0]}! Que ótimo nos conectarmos por afinidade no Vivendo Mais PREVI. Como posso ajudar ou o que gostaria de compartilhar hoje?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isRead: true,
                },
              ];

          return {
            ...c,
            unreadCount: 0,
            lastMessage: initialMessages[initialMessages.length - 1]?.text || 'Conversa iniciada',
            lastMessageTime: initialMessages[initialMessages.length - 1]?.timestamp || 'Agora',
            messages: initialMessages,
          };
        }
        return c;
      })
    );
  };

  const submitExperienceEvaluation = (evalData: ExperienceEvaluation) => {
    setEvaluationHistory((prev) => [evalData, ...prev]);
    recordEvent('RATE_EXPERIENCE', { evaluation: evalData });
  };

  const submitPrototypeFeedback = (fb: PrototypeFeedback) => {
    setPrototypeFeedbacks((prev) => [fb, ...prev]);
    recordEvent('PROTOTYPE_FEEDBACK', { feedback: fb });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        meuViverMaisTab,
        setMeuViverMaisTab,
        activeProfileId,
        setActiveProfileId,
        currentParticipant,
        expandedProfile,
        dimensionScores,
        surveyDraft,
        surveyResult,
        ibplScore: surveyResult?.ibplScore ?? null,
        ibplStatus: surveyResult?.ibplStatus ? getStatusLabel(surveyResult.ibplStatus) : null,
        myPlan,
        savedExperienceIds,
        interestedExperienceIds,
        activeIntentionTag,
        setActiveIntentionTag,
        fontSizeLarge,
        setFontSizeLarge,
        isPrevixOpen,
        setIsPrevixOpen,
        previxContextKey,
        setPrevixContextKey,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        selectedExperienceForDetail,
        setSelectedExperienceForDetail,
        selectedPlanItemForEvaluation,
        setSelectedPlanItemForEvaluation,
        evaluationHistory,
        prototypeFeedbacks,
        events,
        // Conexões e Mensagens
        peerConversations,
        activePeerConversationId,
        setActivePeerConversationId,
        reconnectionStatusMap,
        toastMessage,
        setToastMessage,
        sendReconnectionRequest,
        acceptReconnectionRequest,
        sendPeerMessage,
        restartPeerConversation,
        switchProfile,
        navigateTo,
        updateExpandedProfile,
        saveInterestItem,
        removeInterestItem,
        addKnowledgeItem,
        removeKnowledgeItem,
        addLearningWish,
        removeLearningWish,
        addResumeActivity,
        removeResumeActivity,
        addExperimentWish,
        removeExperimentWish,
        setConnectionPreferences,
        setAvailabilitySchedule,
        setPrivacySettings,
        toggleSaveExperience,
        showInterestInExperience,
        addToPlan,
        removeFromPlan,
        markPlanItemCompleted,
        submitExperienceEvaluation,
        submitPrototypeFeedback,
        recordEvent,
        saveSurveyAnswer,
        startSurvey,
        completeSurvey,
        restartSurvey,
        loadSurveyResult: (profileId = activeProfileId) => readSurveyResult(profileId),
      }}
    >
      <div className={fontSizeLarge ? 'text-lg leading-relaxed' : 'text-base'}>
        {children}
      </div>
    </AppContext.Provider>
  );

}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
