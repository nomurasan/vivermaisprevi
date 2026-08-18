import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { DesaposenteMessenger } from '../components/DesaposenteMessenger';
import {
  CATALOG_INTERESTS,
  INTEREST_ROLE_LABELS,
} from '../mock/interestsCatalog';
import {
  CatalogInterest,
  InterestRole,
  ParticipantInterestItem,
  KnowledgeItem,
  LearningWishItem,
  ResumeActivityWishItem,
  ExperimentWishItem,
  ConnectionPreference,
} from '../types';
import {
  getDiscoveryRewardSummary,
  getTopAffinityMatches,
} from '../services/affinityEngine';
import {
  Sparkles,
  HeartHandshake,
  Users,
  Compass,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Clock,
  MapPin,
  Flame,
  HelpCircle,
  Eye,
  ArrowRight,
  Smile,
  GraduationCap,
  BookOpen,
  Briefcase,
  Layers,
  MessageSquare,
  Send,
} from 'lucide-react';

export const DesaposenteRedeView: React.FC = () => {
  const {
    currentParticipant,
    expandedProfile,
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
    navigateTo,
    setIsPrevixOpen,
    setPrevixContextKey,
    peerConversations,
    activePeerConversationId,
    setActivePeerConversationId,
    reconnectionStatusMap,
    sendReconnectionRequest,
    acceptReconnectionRequest,
  } = useApp();

  // Navigation steps inside "Desaposente sua Rede"
  // 'landing' | 'wizard' | 'reward' | 'connections' | 'messenger'
  const [currentStep, setCurrentStep] = useState<
    'landing' | 'wizard' | 'reward' | 'connections' | 'messenger'
  >('landing');

  const totalUnreadMessages = peerConversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  // Wizard active sub-step: 1 to 8
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Selected interest for deep configuring roles modal/drawer
  const [editingInterest, setEditingInterest] = useState<CatalogInterest | null>(
    null
  );
  const [tempRoles, setTempRoles] = useState<InterestRole[]>([]);

  // Input states for knowledge, learning, resume, experiment
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState('');
  const [newKnowledgeCategory, setNewKnowledgeCategory] = useState('Geral');
  const [newLearningText, setNewLearningText] = useState('');
  const [newResumeText, setNewResumeText] = useState('');
  const [newExperimentText, setNewExperimentText] = useState('');
  const [customInterestName, setCustomInterestName] = useState('');
  const [isAddingCustomInterest, setIsAddingCustomInterest] = useState(false);

  // Computed summary and matches
  const rewardSummary = getDiscoveryRewardSummary(currentParticipant.id);
  const topMatches = getTopAffinityMatches(currentParticipant.id);

  // Helper for opening role modal
  const handleOpenInterestConfig = (interest: CatalogInterest) => {
    const existing = expandedProfile.interests.find(
      (i) => i.interestId === interest.id
    );
    setTempRoles(existing ? [...existing.roles] : ['quero_praticar']);
    setEditingInterest(interest);
  };

  const handleSaveInterestRoles = () => {
    if (!editingInterest) return;
    saveInterestItem({
      interestId: editingInterest.id,
      roles: tempRoles.length > 0 ? tempRoles : ['quero_praticar'],
      customName: editingInterest.name,
    });
    setEditingInterest(null);
  };

  const handleAddCustomInterest = () => {
    if (!customInterestName.trim()) return;
    const newId = `custom_${Date.now()}`;
    saveInterestItem({
      interestId: newId,
      roles: ['quero_praticar', 'conversar'],
      customName: customInterestName.trim(),
    });
    setCustomInterestName('');
    setIsAddingCustomInterest(false);
  };

  const handleToggleConnectionPreference = (pref: ConnectionPreference) => {
    const current = expandedProfile.connectionPreferences;
    if (current.includes(pref)) {
      setConnectionPreferences(current.filter((p) => p !== pref));
    } else {
      setConnectionPreferences([...current, pref]);
    }
  };

  const connectionPreferenceLabels: { id: ConnectionPreference; label: string; icon: string }[] = [
    { id: 'colegas', label: 'Antigos colegas de trabalho no BB/PREVI', icon: '🏛️' },
    { id: 'mesmos_hobbies', label: 'Pessoas com os mesmos hobbies e gostos', icon: '🎸' },
    { id: 'aprender_com_outros', label: 'Pessoas que possam me ensinar algo novo', icon: '🎓' },
    { id: 'ensinar', label: 'Pessoas interessadas no que eu sei', icon: '💡' },
    { id: 'proximos', label: 'Pessoas próximas de onde moro', icon: '📍' },
    { id: 'presencial', label: 'Pessoas para atividades presenciais', icon: '☕' },
    { id: 'online', label: 'Pessoas para conversas e encontros on-line', icon: '💻' },
    { id: 'grupos_pratica', label: 'Pessoas para formar grupos de prática', icon: '🤝' },
    { id: 'voluntariado', label: 'Pessoas interessadas em voluntariado e impacto social', icon: '🌱' },
    { id: 'intergeracional', label: 'Pessoas de outras gerações (jovens e adultos)', icon: '✨' },
    { id: 'novas_amizades', label: 'Fazer novas amizades sem pressa', icon: '😊' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Barra Superior de Navegação Rápida do Desaposente sua Rede */}
      <div className="bg-white p-2 rounded-2xl border border-[#D9E4EE] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setCurrentStep('landing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentStep === 'landing' || currentStep === 'reward'
                ? 'bg-[#163A63] text-white shadow-xs'
                : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Descobrir & Afinidades</span>
          </button>

          <button
            onClick={() => setCurrentStep('connections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentStep === 'connections'
                ? 'bg-[#163A63] text-white shadow-xs'
                : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pessoas Recomendadas</span>
          </button>

          <button
            onClick={() => setCurrentStep('messenger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              currentStep === 'messenger'
                ? 'bg-[#163A63] text-white shadow-xs'
                : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#12B8AE]" />
            <span>Conversar & Conexões (Messenger)</span>
            {totalUnreadMessages > 0 && (
              <span className="px-1.5 py-0.2 bg-[#12B8AE] text-white text-[10px] font-black rounded-full">
                {totalUnreadMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentStep('wizard');
              setWizardStep(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentStep === 'wizard'
                ? 'bg-[#163A63] text-white shadow-xs'
                : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#12B8AE]" />
            <span>Meu Eu de Agora (LGPD)</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-[#5A6F82] pr-2">
          <Shield className="w-3.5 h-3.5 text-[#12B8AE]" />
          <span>Duplo consentimento ativo</span>
        </div>
      </div>

      {/* ============================================================
          1. TELA INICIAL / LANDING DA EXPERIÊNCIA
         ============================================================ */}
      {currentStep === 'landing' && (
        <div className="space-y-8">
          {/* Hero Banner Convidativo */}
          <div className="bg-gradient-to-br from-[#163A63] via-[#1E466F] to-[#164E7A] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#12B8AE]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#B4EBE6]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              {/* Concept Tag: Solidão, aqui não! (Comunicação positiva) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4 text-[#12B8AE]" />
                <span>Solidão, aqui não! • Vínculos & Vitalidade</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                DESAPOSENTE SUA REDE
              </h1>

              <p className="text-lg sm:text-xl text-[#D9E4EE] font-medium leading-relaxed">
                "Pessoas, histórias, interesses e novas experiências esperando para se conectar com você."
              </p>

              <p className="text-sm text-[#D9E4EE]/90 leading-relaxed max-w-2xl">
                Conte um pouco mais sobre quem você é hoje. O PREVIX e a comunidade Vivendo Mais vão ajudar você a encontrar antigos colegas de trajetória, novas amizades, grupos de prática e experiências sob medida para o seu momento.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setCurrentStep('wizard');
                    setWizardStep(1);
                  }}
                  className="px-8 py-4 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-black text-sm tracking-wider uppercase rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Quero ampliar minha rede</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setPrevixContextKey('desaposente_rede');
                    setIsPrevixOpen(true);
                  }}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Smile className="w-4 h-4 text-[#12B8AE]" />
                  <span>Conversar com o PREVIX</span>
                </button>
              </div>
            </div>
          </div>

          {/* Os 7 Pilares do "Meu Eu de Agora" (Visão Geral de Descoberta) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-3 hover:border-[#12B8AE] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#0A988F] flex items-center justify-center text-xl font-bold">
                🎸
              </div>
              <h3 className="font-extrabold text-[#163A63] text-base">
                Do que você gosta hoje?
              </h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                Música, marcenaria, caminhadas, tecnologia, viagens, gastronomia ou artesanato. Escolha o que faz seus olhos brilharem.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-3 hover:border-[#12B8AE] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#0A988F] flex items-center justify-center text-xl font-bold">
                💡
              </div>
              <h3 className="font-extrabold text-[#163A63] text-base">
                O que você sabe & quer aprender?
              </h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                Todo mundo tem algo valioso para compartilhar e algo novo para experimentar. Conecte-se pela troca mútua de saberes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-3 hover:border-[#12B8AE] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#0A988F] flex items-center justify-center text-xl font-bold">
                🛡️
              </div>
              <h3 className="font-extrabold text-[#163A63] text-base">
                Privacidade & Ritmo Próprio
              </h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                Você define exatamente como e para quem deseja aparecer. Nenhum telefone ou endereço é exposto sem sua autorização explícita.
              </p>
            </div>
          </div>

          {/* Quick Preview of What the User Already Configured */}
          {expandedProfile.interests.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF3F7] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#164E7A] uppercase tracking-wider">
                    SEU PERFIL ATUAL
                  </span>
                  <h2 className="text-xl font-extrabold text-[#163A63]">
                    Meu Eu de Agora
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentStep('wizard');
                      setWizardStep(1);
                    }}
                    className="px-4 py-2 bg-[#F4F7FA] hover:bg-[#E6F7F6] text-[#163A63] font-bold text-xs rounded-xl border border-[#D9E4EE] transition-colors"
                  >
                    Editar Informações
                  </button>
                  <button
                    onClick={() => setCurrentStep('reward')}
                    className="px-4 py-2 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Ver Oportunidades Descobertas</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Interesses */}
                <div className="space-y-2">
                  <span className="font-bold text-[#5A6F82] block">Interesses Selecionados:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {expandedProfile.interests.map((item) => {
                      const cat = CATALOG_INTERESTS.find((c) => c.id === item.interestId);
                      return (
                        <span
                          key={item.interestId}
                          className="px-2.5 py-1 bg-[#E6F7F6] text-[#163A63] font-bold rounded-lg border border-[#B4EBE6]"
                        >
                          {cat ? `${cat.icon} ${cat.name}` : item.customName || item.interestId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* O que pode compartilhar */}
                <div className="space-y-2">
                  <span className="font-bold text-[#5A6F82] block">Posso Compartilhar:</span>
                  {expandedProfile.knowledgeItems.length > 0 ? (
                    <ul className="space-y-1 text-[#2C3E50]">
                      {expandedProfile.knowledgeItems.map((k) => (
                        <li key={k.id} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#12B8AE] shrink-0" />
                          <span>{k.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[#5A6F82] italic">Nenhum saber cadastrado ainda.</span>
                  )}
                </div>

                {/* O que quer aprender */}
                <div className="space-y-2">
                  <span className="font-bold text-[#5A6F82] block">Quero Aprender:</span>
                  {expandedProfile.learningWishes.length > 0 ? (
                    <ul className="space-y-1 text-[#2C3E50]">
                      {expandedProfile.learningWishes.map((w) => (
                        <li key={w.id} className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#12B8AE] shrink-0" />
                          <span>{w.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[#5A6F82] italic">Nenhum desejo cadastrado ainda.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          2. EXPERIÊNCIA PROGRESSIVA DO "MEU EU DE AGORA" (WIZARD)
         ============================================================ */}
      {currentStep === 'wizard' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9E4EE] shadow-sm space-y-8">
          {/* Top Wizard Navigation Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF3F7] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#164E7A] uppercase tracking-wider mb-1">
                <span>Meu Eu de Agora</span>
                <span>•</span>
                <span>Etapa {wizardStep} de 8</span>
              </div>
              <h2 className="text-2xl font-black text-[#163A63]">
                {wizardStep === 1 && 'Quem Fui Profissionalmente & Quem Sou Hoje'}
                {wizardStep === 2 && 'Do que você mais gosta? (Seus Interesses)'}
                {wizardStep === 3 && 'O que você aprendeu e pode compartilhar?'}
                {wizardStep === 4 && 'O que você sempre quis aprender?'}
                {wizardStep === 5 && 'O que gostaria de voltar a fazer ou experimentar?'}
                {wizardStep === 6 && 'Com quem você gostaria de se conectar?'}
                {wizardStep === 7 && 'Sua Disponibilidade & Deslocamento'}
                {wizardStep === 8 && 'Como você quer aparecer (Privacidade & LGPD)'}
              </h2>
            </div>

            {/* Step Progress Pills */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setWizardStep(s)}
                  title={`Ir para etapa ${s}`}
                  className={`w-7 h-2 rounded-full transition-all ${
                    s === wizardStep
                      ? 'bg-[#12B8AE] w-10'
                      : s < wizardStep
                      ? 'bg-[#163A63]'
                      : 'bg-[#D9E4EE]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ============================================================
              ETAPA 1: QUEM FUI PROFISSIONALMENTE & QUEM SOU HOJE
             ============================================================ */}
          {wizardStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-xs text-[#2C3E50] leading-relaxed flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-[#164E7A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#163A63]">
                    Sua história profissional no Banco do Brasil e PREVI é parte de quem você é.
                  </p>
                  <p className="mt-1">
                    Esses registros conectam você a colegas de dependências históricas no Aposentadograma.
                  </p>
                </div>
              </div>

              {/* Trajetória Funcional Cadastrada */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#5A6F82] uppercase tracking-wider block">
                  Sua Trajetória Profissional
                </span>
                <div className="space-y-3">
                  {expandedProfile.trajectory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-2xl border border-[#D9E4EE] flex items-center justify-between shadow-2xs"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#12B8AE] uppercase tracking-wide">
                          {item.organization}
                        </span>
                        <h4 className="text-sm font-bold text-[#163A63]">
                          {item.unitName}
                        </h4>
                        <p className="text-xs text-[#5A6F82]">
                          {item.role} • {item.city}/{item.state}
                        </p>
                      </div>
                      <div className="text-xs font-extrabold text-[#164E7A] bg-[#EEF3F7] px-3 py-1.5 rounded-xl border border-[#D9E4EE]">
                        {item.startYear} — {item.endYear}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#E6F7F6] rounded-2xl border border-[#B4EBE6] text-xs text-[#163A63]">
                <p className="font-bold">Agora vamos para a melhor parte:</p>
                <p className="mt-1">
                  Descobrir o que você gosta de fazer <strong>hoje</strong>, seus hobbies e novos projetos de vida!
                </p>
              </div>
            </div>
          )}

          {/* ============================================================
              ETAPA 2: MEUS INTERESSES (CATÁLOGO DINÂMICO & PAPÉIS)
             ============================================================ */}
          {wizardStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <p className="text-xs text-[#5A6F82]">
                Clique nos assuntos que despertam sua curiosidade. Para cada um, você poderá definir se deseja aprender, praticar, ensinar ou encontrar parceiros.
              </p>

              {/* Grid de Interesses do Catálogo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATALOG_INTERESTS.map((cat) => {
                  const isSelected = expandedProfile.interests.some(
                    (i) => i.interestId === cat.id
                  );
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleOpenInterestConfig(cat)}
                      className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#E6F7F6] border-[#12B8AE] text-[#163A63] shadow-xs'
                          : 'bg-[#F4F7FA] border-[#D9E4EE] text-[#5A6F82] hover:bg-white hover:border-[#B4EBE6]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{cat.icon}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#12B8AE]" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-[#163A63]">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-[#5A6F82] block truncate">
                          {cat.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botão + Outro Interesse */}
              <div className="pt-2">
                {!isAddingCustomInterest ? (
                  <button
                    onClick={() => setIsAddingCustomInterest(true)}
                    className="px-4 py-2.5 bg-[#F4F7FA] hover:bg-[#E6F7F6] text-[#163A63] rounded-xl border border-[#D9E4EE] text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#12B8AE]" />
                    <span>+ Adicionar outro interesse</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      value={customInterestName}
                      onChange={(e) => setCustomInterestName(e.target.value)}
                      placeholder="Ex: Astrologia, Modelismo, Canoagem..."
                      className="flex-1 px-3 py-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-xl text-xs text-[#163A63] focus:border-[#12B8AE] focus:outline-hidden"
                    />
                    <button
                      onClick={handleAddCustomInterest}
                      className="px-4 py-2 bg-[#12B8AE] text-[#163A63] font-bold text-xs rounded-xl hover:bg-[#0A988F] transition-colors"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => setIsAddingCustomInterest(false)}
                      className="px-3 py-2 text-[#5A6F82] text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              {/* Modal / Gaveta de Configuração do Papel no Interesse */}
              {editingInterest && (
                <div className="fixed inset-0 bg-[#163A63]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#D9E4EE] space-y-6 animate-in zoom-in-95">
                    <div className="flex items-center gap-3 border-b border-[#EEF3F7] pb-4">
                      <span className="text-3xl">{editingInterest.icon}</span>
                      <div>
                        <h3 className="text-lg font-extrabold text-[#163A63]">
                          {editingInterest.name}
                        </h3>
                        <p className="text-xs text-[#5A6F82]">
                          O que você gostaria de fazer com esse interesse?
                        </p>
                      </div>
                    </div>

                    {/* Multi-escolhas de Papel */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {(Object.keys(INTEREST_ROLE_LABELS) as InterestRole[]).map(
                        (roleKey) => {
                          const isChecked = tempRoles.includes(roleKey);
                          return (
                            <label
                              key={roleKey}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-[#E6F7F6] border-[#12B8AE] text-[#163A63]'
                                  : 'bg-[#F4F7FA] border-[#D9E4EE] text-[#5A6F82] hover:bg-white'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setTempRoles([...tempRoles, roleKey]);
                                  } else {
                                    setTempRoles(tempRoles.filter((r) => r !== roleKey));
                                  }
                                }}
                                className="w-4 h-4 text-[#12B8AE] rounded-sm focus:ring-[#12B8AE]"
                              />
                              <span>{INTEREST_ROLE_LABELS[roleKey]}</span>
                            </label>
                          );
                        }
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EEF3F7]">
                      <button
                        onClick={() => {
                          removeInterestItem(editingInterest.id);
                          setEditingInterest(null);
                        }}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Remover interesse
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingInterest(null)}
                          className="px-4 py-2 text-xs font-bold text-[#5A6F82] hover:bg-[#F4F7FA] rounded-xl"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveInterestRoles}
                          className="px-5 py-2 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Salvar Escolhas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              ETAPA 3: O QUE VOCÊ SABE? (COMPARTILHAMENTO DE SABERES)
             ============================================================ */}
          {wizardStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-[#E6F7F6] rounded-2xl border border-[#B4EBE6] text-xs text-[#163A63] leading-relaxed flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-[#0A988F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-sm text-[#163A63]">
                    "Todo mundo tem algo para compartilhar."
                  </p>
                  <p className="mt-1 text-[#2C3E50]">
                    O que você aprendeu pela vida que teria prazer em compartilhar com outras pessoas? Não precisa ser uma aula formal — pode ser uma conversa, uma dica prática ou uma troca de experiências.
                  </p>
                </div>
              </div>

              {/* Lista de Saberes Cadastrados */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#5A6F82] uppercase tracking-wider block">
                  Meus Conhecimentos Compartilháveis
                </span>
                {expandedProfile.knowledgeItems.length > 0 ? (
                  <div className="space-y-2">
                    {expandedProfile.knowledgeItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#12B8AE]" />
                          <span className="text-xs font-bold text-[#163A63]">
                            {item.title}
                          </span>
                        </div>
                        <button
                          onClick={() => removeKnowledgeItem(item.id)}
                          className="p-1.5 text-[#5A6F82] hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#5A6F82] italic">
                    Nenhum conhecimento adicionado ainda. Adicione um no campo abaixo!
                  </p>
                )}
              </div>

              {/* Input para adicionar novo conhecimento */}
              <div className="p-4 bg-white rounded-2xl border border-[#D9E4EE] space-y-3">
                <span className="text-xs font-bold text-[#163A63] block">
                  Adicionar conhecimento:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newKnowledgeTitle}
                    onChange={(e) => setNewKnowledgeTitle(e.target.value)}
                    placeholder="Ex: Técnicas de marcenaria, violão popular, culinária italiana, finanças..."
                    className="flex-1 px-3 py-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-xl text-xs text-[#163A63] focus:border-[#12B8AE] focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      if (!newKnowledgeTitle.trim()) return;
                      addKnowledgeItem({
                        id: `k_${Date.now()}`,
                        title: newKnowledgeTitle.trim(),
                        category: newKnowledgeCategory,
                        canShare: true,
                      });
                      setNewKnowledgeTitle('');
                    }}
                    className="px-4 py-2 bg-[#163A63] hover:bg-[#1E466F] text-[#12B8AE] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              ETAPA 4: O QUE VOCÊ GOSTARIA DE APRENDER?
             ============================================================ */}
          {wizardStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-xs text-[#2C3E50] leading-relaxed flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#164E7A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-sm text-[#163A63]">
                    "Tem alguma coisa que você sempre quis aprender?"
                  </p>
                  <p className="mt-1 text-[#5A6F82]">
                    Nunca é tarde para novos acordes, novas ferramentas ou novas línguas. O sistema cruzará seus desejos com pessoas dispostas a compartilhar!
                  </p>
                </div>
              </div>

              {/* Lista de Desejos de Aprendizagem */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#5A6F82] uppercase tracking-wider block">
                  O Que Desejo Aprender
                </span>
                {expandedProfile.learningWishes.length > 0 ? (
                  <div className="space-y-2">
                    {expandedProfile.learningWishes.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-[#12B8AE]" />
                          <span className="text-xs font-bold text-[#163A63]">
                            {item.text}
                          </span>
                        </div>
                        <button
                          onClick={() => removeLearningWish(item.id)}
                          className="p-1.5 text-[#5A6F82] hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#5A6F82] italic">
                    Nenhum desejo de aprendizagem cadastrado ainda.
                  </p>
                )}
              </div>

              {/* Input Adicionar Desejo */}
              <div className="p-4 bg-white rounded-2xl border border-[#D9E4EE] space-y-3">
                <span className="text-xs font-bold text-[#163A63] block">
                  Adicionar desejo de aprender:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newLearningText}
                    onChange={(e) => setNewLearningText(e.target.value)}
                    placeholder="Ex: Quero aprender guitarra, marcenaria fina, fotografia com smartphone..."
                    className="flex-1 px-3 py-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-xl text-xs text-[#163A63] focus:border-[#12B8AE] focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      if (!newLearningText.trim()) return;
                      addLearningWish({
                        id: `lw_${Date.now()}`,
                        text: newLearningText.trim(),
                      });
                      setNewLearningText('');
                    }}
                    className="px-4 py-2 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              ETAPA 5: VOLTAR A FAZER & EXPERIMENTAR
             ============================================================ */}
          {wizardStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Bloco 1: Voltar a fazer */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#163A63]">
                  <Flame className="w-4 h-4 text-[#12B8AE]" />
                  <span>Existe alguma atividade que você gostava de fazer e gostaria de retomar?</span>
                </div>

                {expandedProfile.resumeActivities.length > 0 && (
                  <div className="space-y-2">
                    {expandedProfile.resumeActivities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 bg-[#F4F7FA] rounded-xl border border-[#D9E4EE] flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#163A63]">{act.text}</span>
                        <button
                          onClick={() => removeResumeActivity(act.id)}
                          className="text-[#5A6F82] hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResumeText}
                    onChange={(e) => setNewResumeText(e.target.value)}
                    placeholder="Ex: Voltar a pescar, voltar a tocar violão, voltar a jogar tênis..."
                    className="flex-1 px-3 py-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-xl text-xs text-[#163A63]"
                  />
                  <button
                    onClick={() => {
                      if (!newResumeText.trim()) return;
                      addResumeActivity({
                        id: `rw_${Date.now()}`,
                        text: newResumeText.trim(),
                      });
                      setNewResumeText('');
                    }}
                    className="px-4 py-2 bg-[#163A63] text-[#12B8AE] font-bold text-xs rounded-xl"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Bloco 2: O que quer experimentar */}
              <div className="space-y-3 pt-4 border-t border-[#EEF3F7]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#163A63]">
                  <Compass className="w-4 h-4 text-[#12B8AE]" />
                  <span>Tem alguma coisa que você sempre quis fazer e ainda não teve oportunidade?</span>
                </div>

                {expandedProfile.experimentWishes.length > 0 && (
                  <div className="space-y-2">
                    {expandedProfile.experimentWishes.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-3 bg-[#F4F7FA] rounded-xl border border-[#D9E4EE] flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#163A63]">{exp.text}</span>
                        <button
                          onClick={() => removeExperimentWish(exp.id)}
                          className="text-[#5A6F82] hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExperimentText}
                    onChange={(e) => setNewExperimentText(e.target.value)}
                    placeholder="Ex: Viagem cultural em grupo, aula de cerâmica, aprender astronomia..."
                    className="flex-1 px-3 py-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-xl text-xs text-[#163A63]"
                  />
                  <button
                    onClick={() => {
                      if (!newExperimentText.trim()) return;
                      addExperimentWish({
                        id: `ew_${Date.now()}`,
                        text: newExperimentText.trim(),
                      });
                      setNewExperimentText('');
                    }}
                    className="px-4 py-2 bg-[#12B8AE] text-[#163A63] font-bold text-xs rounded-xl"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              ETAPA 6: COM QUEM QUER SE CONECTAR?
             ============================================================ */}
          {wizardStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <p className="text-xs text-[#5A6F82]">
                Selecione os tipos de conexões que você está aberto a cultivar na comunidade Vivendo Mais:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connectionPreferenceLabels.map((item) => {
                  const isChecked = expandedProfile.connectionPreferences.includes(
                    item.id
                  );
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleConnectionPreference(item.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#E6F7F6] border-[#12B8AE] text-[#163A63] shadow-xs'
                          : 'bg-[#F4F7FA] border-[#D9E4EE] text-[#5A6F82] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      {isChecked && (
                        <CheckCircle2 className="w-4 h-4 text-[#12B8AE] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================
              ETAPA 7: DISPONIBILIDADE & DESLOCAMENTO
             ============================================================ */}
          {wizardStep === 7 && (
            <div className="space-y-6 animate-in fade-in">
              <p className="text-xs text-[#5A6F82]">
                Defina seus horários e preferências de encontro para que o PREVIX e os grupos de prática sugiram momentos convenientes:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Período do Dia */}
                <div className="space-y-2 p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE]">
                  <span className="font-bold text-[#163A63] block">Período preferido:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'manha', label: 'Manhã' },
                      { id: 'tarde', label: 'Tarde' },
                      { id: 'noite', label: 'Noite' },
                    ].map((p) => {
                      const isSel = expandedProfile.availability.periods.includes(
                        p.id as any
                      );
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            const current = expandedProfile.availability.periods;
                            const next = isSel
                              ? current.filter((x) => x !== p.id)
                              : [...current, p.id as any];
                            setAvailabilitySchedule({
                              ...expandedProfile.availability,
                              periods: next.length > 0 ? next : ['tarde'],
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                            isSel
                              ? 'bg-[#12B8AE] text-[#163A63] border-[#12B8AE]'
                              : 'bg-white text-[#5A6F82] border-[#D9E4EE]'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dias da Semana */}
                <div className="space-y-2 p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE]">
                  <span className="font-bold text-[#163A63] block">Dias preferidos:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'dias_uteis', label: 'Dias úteis (Segunda a Sexta)' },
                      { id: 'finais_semana', label: 'Finais de semana' },
                    ].map((d) => {
                      const isSel = expandedProfile.availability.days.includes(
                        d.id as any
                      );
                      return (
                        <button
                          key={d.id}
                          onClick={() => {
                            const current = expandedProfile.availability.days;
                            const next = isSel
                              ? current.filter((x) => x !== d.id)
                              : [...current, d.id as any];
                            setAvailabilitySchedule({
                              ...expandedProfile.availability,
                              days: next.length > 0 ? next : ['dias_uteis'],
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                            isSel
                              ? 'bg-[#12B8AE] text-[#163A63] border-[#12B8AE]'
                              : 'bg-white text-[#5A6F82] border-[#D9E4EE]'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Modalidade */}
                <div className="space-y-2 p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE]">
                  <span className="font-bold text-[#163A63] block">Modalidade:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'presencial', label: 'Presencial' },
                      { id: 'online', label: 'On-line' },
                      { id: 'ambos', label: 'Ambos' },
                    ].map((m) => {
                      const isSel = expandedProfile.availability.modality === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() =>
                            setAvailabilitySchedule({
                              ...expandedProfile.availability,
                              modality: m.id as any,
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                            isSel
                              ? 'bg-[#12B8AE] text-[#163A63] border-[#12B8AE]'
                              : 'bg-white text-[#5A6F82] border-[#D9E4EE]'
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Raio de Deslocamento */}
                <div className="space-y-2 p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE]">
                  <span className="font-bold text-[#163A63] block">
                    Raio de deslocamento aproximado:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[3, 5, 10, 20, 50].map((r) => {
                      const isSel =
                        expandedProfile.availability.displacementRadiusKm === r;
                      return (
                        <button
                          key={r}
                          onClick={() =>
                            setAvailabilitySchedule({
                              ...expandedProfile.availability,
                              displacementRadiusKm: r,
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                            isSel
                              ? 'bg-[#12B8AE] text-[#163A63] border-[#12B8AE]'
                              : 'bg-white text-[#5A6F82] border-[#D9E4EE]'
                          }`}
                        >
                          {r} km
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              ETAPA 8: PRIVACIDADE & LGPD ("COMO QUERO APARECER")
             ============================================================ */}
          {wizardStep === 8 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-xs text-[#2C3E50] leading-relaxed flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#12B8AE] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-sm text-[#163A63]">
                    Central de Privacidade & Visibilidade (LGPD)
                  </p>
                  <p className="mt-1 text-[#5A6F82]">
                    Você tem total controle sobre suas informações. Seu telefone, e-mail e endereço nunca são expostos publicamente.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  {
                    key: 'showName',
                    title: 'Mostrar meu nome para outros associados',
                    desc: 'Exibe seu primeiro nome nas conexões sugeridas.',
                  },
                  {
                    key: 'showPhoto',
                    title: 'Mostrar minha foto de perfil',
                    desc: 'Permite que amigos reconheçam você visualmente.',
                  },
                  {
                    key: 'showCity',
                    title: 'Mostrar minha cidade de residência',
                    desc: 'Facilita encontrar encontros locais e regionais.',
                  },
                  {
                    key: 'showInterests',
                    title: 'Mostrar meus interesses',
                    desc: 'Aparece em comunidades de práticas afins.',
                  },
                  {
                    key: 'showCareerHistory',
                    title: 'Permitir que antigos colegas me encontrem',
                    desc: 'Utiliza seu histórico no BB/PREVI para reconexões.',
                  },
                  {
                    key: 'allowInterestSuggestions',
                    title: 'Receber sugestões do PREVIX por afinidade',
                    desc: 'Avisa quando surgirem pessoas com mesmos gostos.',
                  },
                  {
                    key: 'receiveInvites',
                    title: 'Receber convites para grupos de prática',
                    desc: 'Permite ser convidado para rodas de conversa e práticas.',
                  },
                  {
                    key: 'shareContactAfterConnection',
                    title: 'Compartilhar contatos somente após aceite mútuo',
                    desc: 'Garante duplo consentimento antes de trocar contatos.',
                  },
                ].map((item) => {
                  const val = (expandedProfile.privacy as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-bold text-[#163A63] block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-[#5A6F82] block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...expandedProfile.privacy,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#D9E4EE] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12B8AE]" />
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Prévia em tempo real de como os outros verão seu perfil */}
              <div className="p-5 bg-gradient-to-r from-[#F4F7FA] to-[#E6F7F6] rounded-2xl border border-[#D9E4EE] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#164E7A] block">
                  Prévia em Tempo Real da sua Apresentação:
                </span>
                <div className="bg-white p-4 rounded-2xl border border-[#D9E4EE] flex items-center gap-3 shadow-2xs max-w-md">
                  <Avatar
                    src={expandedProfile.privacy.showPhoto ? currentParticipant.avatarUrl : undefined}
                    name={expandedProfile.privacy.showName ? currentParticipant.name : 'Colega Associado'}
                    size="lg"
                  />
                  <div>
                    <h4 className="font-extrabold text-[#163A63] text-sm">
                      {expandedProfile.privacy.showName
                        ? currentParticipant.name
                        : 'Associado(a) PREVI'}
                    </h4>
                    <p className="text-xs text-[#5A6F82]">
                      {expandedProfile.privacy.showCity
                        ? `${currentParticipant.city}/${currentParticipant.state}`
                        : 'Localização Protegida'}{' '}
                      • {currentParticipant.retirementStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Wizard Actions Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-[#EEF3F7]">
            {wizardStep > 1 ? (
              <button
                onClick={() => setWizardStep(wizardStep - 1)}
                className="px-5 py-2.5 rounded-xl border border-[#D9E4EE] text-xs font-bold text-[#163A63] hover:bg-[#F4F7FA] flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar etapa</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep('landing')}
                className="px-5 py-2.5 rounded-xl border border-[#D9E4EE] text-xs font-bold text-[#5A6F82] hover:bg-[#F4F7FA] transition-colors"
              >
                Cancelar
              </button>
            )}

            {wizardStep < 8 ? (
              <button
                onClick={() => setWizardStep(wizardStep + 1)}
                className="px-6 py-2.5 bg-[#163A63] hover:bg-[#1E466F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep('reward')}
                className="px-8 py-3 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Concluir e Descobrir Minhas Conexões</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          3. TELA DE RECOMPENSA & DESCOBERTA
         ============================================================ */}
      {currentStep === 'reward' && (
        <div className="space-y-8 animate-in zoom-in-95">
          {/* Header de Celebração */}
          <div className="bg-gradient-to-br from-[#163A63] via-[#1E466F] to-[#164E7A] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#12B8AE]" />
                <span>Perfil Atualizado com Sucesso</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                OLHA O QUE SUAS HISTÓRIAS E INTERESSES PODEM ABRIR PARA VOCÊ
              </h2>

              <p className="text-sm sm:text-base text-[#D9E4EE] leading-relaxed">
                Com base no que você compartilhou, o motor de afinidade do Vivendo Mais encontrou oportunidades reais no ecossistema PREVI:
              </p>
            </div>
          </div>

          {/* Cards de Recompensa Baseados em Dados Reais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Trajetória */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">👥</span>
                <span className="text-2xl font-black text-[#163A63]">
                  {rewardSummary.trajectoryCount}
                </span>
              </div>
              <h3 className="font-extrabold text-[#163A63] text-sm">
                Pessoas da sua trajetória profissional
              </h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                Colegas que trabalharam nas mesmas dependências que você no BB/PREVI nos mesmos períodos.
              </p>
            </div>

            {/* 2. Interesses em Comum */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🎸</span>
                <span className="text-2xl font-black text-[#12B8AE]">
                  {rewardSummary.commonInterestsCount}
                </span>
              </div>
              <h3 className="font-extrabold text-[#163A63] text-sm">
                Pessoas com interesses em comum
              </h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                Associados apaixonados pelas mesmas áreas que você escolheu cultivar hoje.
              </p>
            </div>

            {/* 3. Complementaridade */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🪵</span>
                <span className="text-2xl font-black text-[#0A988F]">
                  {rewardSummary.complementaryKnowledgeCount}
                </span>
              </div>
              <h3 className="font-extrabold text-[#163A63] text-sm">
                Oportunidades de troca & aprendizagem
              </h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                Pessoas interessadas em aprender o que você sabe ou ensinar o que você deseja descobrir.
              </p>
            </div>
          </div>

          {/* Call to Action: Explorar Conexões */}
          <div className="bg-white p-8 rounded-3xl border border-[#D9E4EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl font-extrabold text-[#163A63]">
                Pronto para ver as pessoas compatíveis?
              </h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                Reconecte-se com colegas ou conheça pessoas afins com total proteção e duplo consentimento.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentStep('connections')}
                className="px-6 py-3.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Explorar minhas conexões</span>
              </button>

              <button
                onClick={() => navigateTo('meu_viver_mais')}
                className="px-5 py-3.5 bg-[#F4F7FA] hover:bg-[#EEF3F7] text-[#163A63] font-bold text-xs rounded-xl border border-[#D9E4EE] transition-colors"
              >
                Voltar ao Meu Viver Mais
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          4. TELA DE CONEXÕES POR AFINIDADE (EXPLORAÇÃO REAL)
         ============================================================ */}
      {currentStep === 'connections' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E4EE] pb-4">
            <div>
              <span className="text-xs font-bold text-[#164E7A] uppercase tracking-wider">
                REDE DE AFINIDADES VIVENDO MAIS
              </span>
              <h2 className="text-2xl font-black text-[#163A63]">
                Pessoas e Reencontros Recomendados
              </h2>
            </div>

            <button
              onClick={() => setCurrentStep('reward')}
              className="text-xs font-bold text-[#164E7A] hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar ao resumo</span>
            </button>
          </div>

          {/* Cards de Afinidade Composta */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMatches.map((match) => (
              <div
                key={match.participant.id}
                className="bg-white rounded-3xl p-6 border border-[#D9E4EE] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#12B8AE] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={match.participant.avatarUrl}
                      name={match.participant.name}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-extrabold text-[#163A63] text-sm">
                        {match.participant.name}
                      </h3>
                      <p className="text-xs text-[#5A6F82]">
                        {match.participant.city}/{match.participant.state} • {match.participant.retirementStatus}
                      </p>
                    </div>
                  </div>

                  {/* Motivos da Recomendação */}
                  <div className="space-y-1.5 pt-2 border-t border-[#EEF3F7]">
                    {match.reasons.map((r, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-[#2C3E50] flex items-start gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#12B8AE] shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags de Interesses em Comum */}
                  {match.commonInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {match.commonInterests.map((ci) => (
                        <span
                          key={ci}
                          className="text-[10px] font-bold px-2 py-0.5 bg-[#E6F7F6] text-[#0A988F] rounded-md border border-[#B4EBE6]"
                        >
                          {ci}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botão de Reconectar / Conectar com Consentimento */}
                {reconnectionStatusMap[match.participant.id] === 'connected' ? (
                  <button
                    onClick={() => {
                      setActivePeerConversationId(`conv_${match.participant.id}`);
                      setCurrentStep('messenger');
                    }}
                    className="w-full py-2.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-[#163A63]" />
                    <span>Conversar no Messenger</span>
                  </button>
                ) : reconnectionStatusMap[match.participant.id] === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      className="flex-1 py-2.5 bg-[#E6F7F6] text-[#0A988F] font-bold text-xs rounded-xl border border-[#B4EBE6] flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>✓ Solicitação Enviada</span>
                    </button>
                    <button
                      onClick={() => {
                        setActivePeerConversationId(`conv_${match.participant.id}`);
                        setCurrentStep('messenger');
                      }}
                      className="p-2.5 bg-[#F4F7FA] hover:bg-[#12B8AE] text-[#163A63] font-bold text-xs rounded-xl border border-[#D9E4EE] transition-colors"
                      title="Ver conversa / histórico"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sendReconnectionRequest(
                        match.participant,
                        match.commonTrajectory?.[0]?.unitName,
                        match.commonInterests
                      );
                    }}
                    className="w-full py-2.5 bg-[#F4F7FA] hover:bg-[#12B8AE] text-[#163A63] hover:text-white font-bold text-xs rounded-xl border border-[#D9E4EE] hover:border-[#12B8AE] transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-4 h-4 text-[#12B8AE]" />
                    <span>Solicitar Reconexão Segura</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          5. TELA DE MENSAGENS E CHAT COM AS CONEXÕES (MESSENGER)
         ============================================================ */}
      {currentStep === 'messenger' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E4EE] pb-4">
            <div>
              <span className="text-xs font-bold text-[#164E7A] uppercase tracking-wider">
                MESSENGER VIVENDO MAIS
              </span>
              <h2 className="text-2xl font-black text-[#163A63]">
                Área de Conversar com Minhas Conexões
              </h2>
              <p className="text-xs text-[#5A6F82] mt-0.5">
                Troque mensagens seguras, convide para experiências e compartilhe afinidades com seus colegas.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('connections')}
              className="text-xs font-bold text-[#164E7A] hover:underline flex items-center gap-1"
            >
              <Users className="w-4 h-4 text-[#12B8AE]" />
              <span>Ver mais colegas recomendados</span>
            </button>
          </div>

          <DesaposenteMessenger onBackToDiscovery={() => setCurrentStep('connections')} />
        </div>
      )}
    </div>
  );
};

