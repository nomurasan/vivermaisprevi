import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DimensionScore,
  Experience,
  ExperienceEvaluation,
  InteractionEvent,
  Participant,
  PlanItem,
  PrototypeFeedback,
} from '../types';
import {
  getParticipant,
  getParticipantScores,
  getExperiences,
} from '../services/api';
import { PROFILES } from '../mock/participants';
import { EXPERIENCES } from '../mock/experiences';

export type AppView =
  | 'home'
  | 'programa'
  | 'como_funciona'
  | 'onboarding'
  | 'meu_viver_mais'
  | 'explorar'
  | 'meu_plano'
  | 'inteligencia'
  | 'privacidade';

export type MeuViverMaisTab =
  | 'inicio'
  | 'retrato'
  | 'para_mim'
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
  dimensionScores: DimensionScore[];
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
  // Actions
  switchProfile: (profileId: string) => void;
  navigateTo: (view: AppView, tab?: MeuViverMaisTab, contextKey?: string) => void;
  toggleSaveExperience: (exp: Experience) => void;
  showInterestInExperience: (exp: Experience) => void;
  addToPlan: (exp: Experience) => void;
  removeFromPlan: (planItemId: string) => void;
  markPlanItemCompleted: (planItemId: string) => void;
  submitExperienceEvaluation: (evaluation: ExperienceEvaluation) => void;
  submitPrototypeFeedback: (feedback: PrototypeFeedback) => void;
  recordEvent: (type: InteractionEvent['type'], payload: Record<string, any>) => void;
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
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [meuViverMaisTab, setMeuViverMaisTab] = useState<MeuViverMaisTab>('inicio');
  const [activeProfileId, setActiveProfileId] = useState<string>('carlos');
  const [currentParticipant, setCurrentParticipant] = useState<Participant>(PROFILES.carlos);
  const [dimensionScores, setDimensionScores] = useState<DimensionScore[]>([]);
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

  // Load participant data when active profile changes
  useEffect(() => {
    async function loadData() {
      const p = await getParticipant(activeProfileId);
      const scores = await getParticipantScores(activeProfileId);
      setCurrentParticipant(p);
      setDimensionScores(scores);
    }
    loadData();
  }, [activeProfileId]);

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
        dimensionScores,
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
        switchProfile,
        navigateTo,
        toggleSaveExperience,
        showInterestInExperience,
        addToPlan,
        removeFromPlan,
        markPlanItemCompleted,
        submitExperienceEvaluation,
        submitPrototypeFeedback,
        recordEvent,
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
