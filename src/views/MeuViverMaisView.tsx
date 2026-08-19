import React, { useState, useEffect } from 'react';
import { useApp, MeuViverMaisTab } from '../context/AppContext';
import { RadarChartComponent } from '../components/RadarChartComponent';
import { ExperienceCard } from '../components/ExperienceCard';
import { PDASurveyExperienceTips } from '../components/PDASurveyExperienceTips';
import { LongevityRetireeRankingGadget } from '../components/LongevityRetireeRankingGadget';
import { Avatar } from '../components/Avatar';
import { UserScheduleEventsModal } from '../components/UserScheduleEventsModal';
import { DIMENSIONS, getStatusColorClass, getStatusLabel } from '../mock/dimensions';
import { getRecommendations, getCommunityBenchmark, getLifeMoment } from '../services/api';
import { DimensionId, Experience, CommunityBenchmark, LifeMoment } from '../types';
import {
  Sparkles,
  HelpCircle,
  ArrowRight,
  Bookmark,
  Heart,
  Compass,
  Users,
  Activity,
  ShieldCheck,
  TrendingUp,
  Info,
  Calendar,
  CheckCircle2,
  Filter,
  BarChart3,
  Target,
  Award,
  Smile,
  Shield,
  Ticket,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const GOAL_OPTIONS = [
  { id: 'Cuidar mais de mim', emoji: '❤️', label: 'Cuidar mais de mim' },
  { id: 'Me divertir', emoji: '🎭', label: 'Me divertir' },
  { id: 'Conhecer pessoas', emoji: '👥', label: 'Conhecer pessoas' },
  { id: 'Aprender algo novo', emoji: '📚', label: 'Aprender algo novo' },
  { id: 'Explorar novas oportunidades', emoji: '💼', label: 'Explorar novas oportunidades' },
  { id: 'Contribuir com minha experiência', emoji: '🌱', label: 'Contribuir com minha experiência' },
  { id: 'Planejar uma experiência', emoji: '✈️', label: 'Planejar uma experiência' },
  { id: 'Organizar minha vida financeira', emoji: '💰', label: 'Organizar minha vida financeira' },
];

export const MeuViverMaisView: React.FC = () => {
  const {
    currentParticipant,
    dimensionScores,
    activeIntentionTag,
    setActiveIntentionTag,
    navigateTo,
    meuViverMaisTab,
    setMeuViverMaisTab,
    setPrevixContextKey,
    setIsPrevixOpen,
  } = useApp();

  const [recommendations, setRecommendations] = useState<Experience[]>([]);
  const [benchmarks, setBenchmarks] = useState<CommunityBenchmark[]>([]);
  const [lifeMoment, setLifeMoment] = useState<LifeMoment | null>(null);
  const [showIbplModal, setShowIbplModal] = useState(false);
  const [selectedDimensionDetail, setSelectedDimensionDetail] = useState<DimensionId | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const firstName = currentParticipant.name.split(' ')[0];

  // Load recommendations, benchmark and life moment
  useEffect(() => {
    async function load() {
      const recs = await getRecommendations(currentParticipant.id, activeIntentionTag || undefined);
      const bench = await getCommunityBenchmark(currentParticipant.id);
      const moment = await getLifeMoment(currentParticipant.lifeMomentId);
      setRecommendations(recs);
      setBenchmarks(bench);
      if (moment) setLifeMoment(moment);
    }
    load();
  }, [currentParticipant.id, activeIntentionTag, currentParticipant.lifeMomentId]);

  const strengths = dimensionScores
    .filter((s) => s.score >= 80)
    .sort((a, b) => b.score - a.score);

  const attentions = dimensionScores
    .filter((s) => s.score < 80)
    .sort((a, b) => a.score - b.score);

  // Evolution data
  const evolutionData = [
    { period: 'Ago/2026', ibpl: currentParticipant.ibpl, emocional: currentParticipant.scores.saude_emocional, proposito: currentParticipant.scores.trabalho_proposito, vinculos: currentParticipant.scores.relacionamentos },
    { period: 'Fev/2027', ibpl: Math.min(100, currentParticipant.ibpl + 3), emocional: Math.min(100, currentParticipant.scores.saude_emocional + 8), proposito: Math.min(100, currentParticipant.scores.trabalho_proposito + 7), vinculos: currentParticipant.scores.relacionamentos },
    { period: 'Ago/2027', ibpl: Math.min(100, currentParticipant.ibpl + 6), emocional: Math.min(100, currentParticipant.scores.saude_emocional + 12), proposito: Math.min(100, currentParticipant.scores.trabalho_proposito + 11), vinculos: currentParticipant.scores.relacionamentos },
  ];

  const handleGoalClick = (goalId: string) => {
    if (activeIntentionTag === goalId) {
      setActiveIntentionTag(null);
    } else {
      setActiveIntentionTag(goalId);
    }
  };

  const handleOpenDimensionDetail = (dimId: DimensionId) => {
    setSelectedDimensionDetail(dimId);
    setPrevixContextKey(dimId);
  };

  const tabs: { id: MeuViverMaisTab; label: string; badge?: string }[] = [
    { id: 'gda', label: 'GDA (Gestão de Desempenho do Aposentado)' },
    { id: 'pda', label: 'PDA (Plano de Desenvolvimento do Aposentado)' },
    { id: 'hall_mestres', label: 'Hall de Mestres da Longevidade', badge: 'DESTAQUES' },
  ];

  // Helper to check if a tab is currently active
  const isTabActive = (tabId: MeuViverMaisTab) => {
    if (tabId === meuViverMaisTab) return true;
    if (
      tabId === 'gda' &&
      (meuViverMaisTab === 'retrato' ||
        meuViverMaisTab === 'gdp_aposentado' ||
        meuViverMaisTab === 'momento' ||
        meuViverMaisTab === 'comparacao')
    ) {
      return true;
    }
    if (
      tabId === 'pda' &&
      (meuViverMaisTab === 'novas_experiencias' ||
        meuViverMaisTab === 'para_mim')
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* 1. Header Card: Greeting + Sub-Navigation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E4EE] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={currentParticipant.avatarUrl}
              name={currentParticipant.name}
              size="xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
                  Área do Associado
                </span>
                <span className="text-[10px] bg-[#E6F7F6] text-[#0A7D76] px-2 py-0.5 rounded-full font-bold border border-[#B4EBE6]">
                  {currentParticipant.retirementStatus} ({currentParticipant.planType})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163A63] mt-1">
                Bom dia, {firstName}. 👋
              </h1>
              <p className="text-xs sm:text-sm text-[#5A6F82] mt-0.5">
                Como você quer viver mais hoje?
              </p>
            </div>
          </div>

          {/* Quick link to Ingressos & Agendamentos / Meu Plano */}
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2.5 bg-[#E6F7F6] hover:bg-[#D0F2EF] text-[#0A7D76] rounded-xl border border-[#B4EBE6] text-xs font-black transition-all flex items-center gap-2 self-start md:self-auto shadow-2xs group"
          >
            <Ticket className="w-4 h-4 text-[#12B8AE] group-hover:scale-110 transition-transform" />
            <span>Meus Ingressos & Agendamentos</span>
            <span className="bg-[#12B8AE] text-[#163A63] text-[10px] font-black px-1.5 py-0.5 rounded-full">
              3
            </span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#EEF3F7] pb-2 pt-2 scrollbar-none">
          {tabs.map((t) => {
            const active = isTabActive(t.id);
            return (
              <button
                key={t.id}
                onClick={() => setMeuViverMaisTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#163A63] text-white shadow-xs'
                    : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA]'
                }`}
              >
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                      active
                        ? 'bg-[#12B8AE] text-[#163A63]'
                        : 'bg-[#E6F7F6] text-[#0A988F] border border-[#B4EBE6]'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: GDA (Gestão de Desempenho do Aposentado) */}
      {/* Incorpora Meu Retrato + Momento de Vida + Benchmark Reflexivo com humor */}
      {/* ============================================================ */}
      {isTabActive('gda') && (
        <div className="space-y-8 animate-in fade-in">
          {/* Header Banner Divertido e Libertador do GDA */}
          <div className="bg-gradient-to-r from-[#163A63] via-[#1E466F] to-[#164E7A] text-white p-7 sm:p-9 rounded-3xl shadow-sm relative overflow-hidden space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#12B8AE]" />
              <span>GDA • GESTÃO DE DESEMPENHO DO APOSENTADO (ADEUS ANTIGO GDP!)</span>
            </div>

            <div className="max-w-3xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Seu GDA: Gestão de Desempenho do Aposentado
              </h2>
              <p className="text-xs sm:text-sm text-[#B4EBE6] leading-relaxed">
                Quem trabalhou no Banco do Brasil se lembra bem da tensão dos ciclos de GDP, metas de captação e comitês de avaliação... No <strong>Vivendo Mais PREVI</strong>, o <strong>GDA</strong> virou a chave: aqui <strong>não há metas de produtos bancários nem cobrança de chefe</strong>! Sua única meta é o seu próprio bem-estar, autonomia e qualidade de vida nas 8 dimensões da longevidade.
              </p>
            </div>

            {/* Quadro de "Metas" bem-humorado */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-[#B4EBE6] block">Meta de Produtos</span>
                <span className="text-xl font-black text-white">0</span>
                <span className="text-[9px] text-[#B4EBE6] block mt-0.5">Aposentado com louvor! 🎉</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-[#B4EBE6] block">Índice IBPL Geral</span>
                <span className="text-xl font-black text-[#12B8AE]">{currentParticipant.ibpl} / 100</span>
                <span className="text-[9px] text-[#B4EBE6] block mt-0.5">{currentParticipant.ibplStatus}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-[#B4EBE6] block">Avaliação da Chefia</span>
                <span className="text-sm font-black text-white block mt-1">100% Autonomia</span>
                <span className="text-[9px] text-[#B4EBE6] block mt-0.5">Você é seu próprio chefe</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-[#B4EBE6] block">Fortalezas Ativas</span>
                <span className="text-xl font-black text-[#12B8AE]">{strengths.length} de 8</span>
                <span className="text-[9px] text-[#B4EBE6] block mt-0.5">Dimensões fortalecidas</span>
              </div>
            </div>
          </div>

          {/* PARTE 1 DO GDA: RETRATO DAS 8 DIMENSÕES (IBPL + RADAR) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#12B8AE]" />
              <h3 className="text-lg font-black text-[#163A63] uppercase tracking-wide">
                1. Seu Retrato de Longevidade (8 Dimensões)
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* IBPL Card */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#D9E4EE] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#164E7A] uppercase tracking-wider">
                      Seu Retrato de Bem-Estar
                    </span>
                    <button
                      onClick={() => setShowIbplModal(true)}
                      className="text-[#5A6F82] hover:text-[#164E7A]"
                      title="Entenda o IBPL"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-lg text-[#163A63]">
                    IBPL Demonstrativo
                  </h3>

                  <div className="py-3 text-center bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE]">
                    <span className="text-4xl sm:text-5xl font-black text-[#163A63]">
                      {currentParticipant.ibpl}
                    </span>
                    <span className="text-sm font-bold text-[#5A6F82]"> / 100</span>
                    <p className="text-xs font-bold text-[#0A7D76] mt-1">
                      {currentParticipant.ibplStatus}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-xs text-[#5A6F82] leading-relaxed">
                    O IBPL sintetiza o equilíbrio geral das 8 dimensões sem ser uma nota punitiva ou definitiva.
                  </p>
                  <div className="p-3 bg-[#E6F7F6] rounded-xl border border-[#B4EBE6] text-[11px] text-[#0A7D76] flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white border border-[#12B8AE]/40 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-xs">
                      <img
                        src="/icone_previx_maior.png"
                        alt="Assistente virtual PREVIX"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <strong>Dica PREVIX:</strong> Pequenas escolhas diárias em lazer, conexões e autocuidado elevam sua longevidade ativa.
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart: Meu Mapa de Vida */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-[#D9E4EE] shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-[#163A63]">
                      Meu Mapa de Vida (8 Dimensões)
                    </h3>
                    <p className="text-xs text-[#5A6F82]">
                      Visão integrada de forças e oportunidades de autocuidado
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-[#0A7D76]">
                      <span className="w-2 h-2 rounded-full bg-[#12B8AE]" />
                      Fortalecida (80+)
                    </span>
                    <span className="flex items-center gap-1 text-[#164E7A]">
                      <span className="w-2 h-2 rounded-full bg-[#1F5B89]" />
                      Acompanhar (65-79)
                    </span>
                    <span className="flex items-center gap-1 text-[#2C3E50]">
                      <span className="w-2 h-2 rounded-full bg-[#5A6F82]" />
                      Merece Atenção (&lt;65)
                    </span>
                  </div>
                </div>

                {/* Responsive Radar */}
                <RadarChartComponent
                  scores={currentParticipant.scores}
                  onDimensionClick={handleOpenDimensionDetail}
                />

                <div className="text-[11px] text-[#5A6F82] text-center border-t border-[#EEF3F7] pt-2">
                  * Clique em qualquer vértice para ver detalhes e orientações PREVIX da dimensão.
                </div>
              </div>
            </div>
          </div>

          {/* Fortalezas vs O que Merece Atenção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fortalezas Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E6F7F6] text-[#0A7D76] flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                  <h3 className="font-extrabold text-base text-[#163A63]">
                    Minhas Fortalezas no GDA
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#0A7D76] bg-[#E6F7F6] px-2.5 py-0.5 rounded-full border border-[#B4EBE6]">
                  {strengths.length} áreas fortalecidas
                </span>
              </div>

              <div className="space-y-3">
                {strengths.map((item) => (
                  <div
                    key={item.dimensionId}
                    className="p-3.5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#163A63]">{item.name}</h4>
                      <p className="text-[11px] text-[#5A6F82] mt-0.5">{item.highlightText}</p>
                    </div>
                    <div className="text-right pl-3 shrink-0">
                      <span className="text-base font-black text-[#0A7D76]">{item.score}</span>
                      <button
                        onClick={() => handleOpenDimensionDetail(item.dimensionId)}
                        className="text-[10px] font-bold text-[#164E7A] block hover:underline"
                      >
                        Entender melhor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* O que Merece Atenção Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EBF3FA] text-[#164E7A] flex items-center justify-center font-bold text-xs">
                    🌱
                  </div>
                  <h3 className="font-extrabold text-base text-[#163A63]">
                    Oportunidades de Autocuidado
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#164E7A] bg-[#EBF3FA] px-2.5 py-0.5 rounded-full border border-[#CAD8E6]">
                  {attentions.length} áreas para cuidar
                </span>
              </div>

              <div className="space-y-3">
                {attentions.map((item) => (
                  <div
                    key={item.dimensionId}
                    className="p-3.5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#163A63]">{item.name}</h4>
                      <p className="text-[11px] text-[#5A6F82] mt-0.5">{item.highlightText}</p>
                    </div>
                    <div className="text-right pl-3 shrink-0 space-y-1">
                      <span className="text-base font-bold text-[#163A63] block">{item.score}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenDimensionDetail(item.dimensionId)}
                          className="text-[10px] font-bold text-[#164E7A] hover:underline"
                        >
                          Entender
                        </button>
                        <span className="text-[#CAD8E6]">•</span>
                        <button
                          onClick={() => setMeuViverMaisTab('pda')}
                          className="text-[10px] font-bold text-[#12B8AE] hover:underline"
                        >
                          Ir ao PDA
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PARTE 2 DO GDA: MINHA EVOLUÇÃO (HISTÓRICO E PROJEÇÃO) */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
            <div className="space-y-2 border-b border-[#EEF3F7] pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#164E7A] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#12B8AE]" />
                <span>2. MINHA EVOLUÇÃO (HISTÓRICO E PROJEÇÃO)</span>
              </span>
              <h3 className="text-xl font-extrabold text-[#163A63]">
                Acompanhamento Contínuo do seu IBPL
              </h3>
              <p className="text-xs text-[#5A6F82]">
                O objetivo não é alcançar uma nota perfeita. É perceber mudanças importantes ao longo da vida.
              </p>
            </div>

            {/* Evolution Line Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F7" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#163A63', fontWeight: 700 }} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#5A6F82' }} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ibpl" name="IBPL Médio" stroke="#12B8AE" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="emocional" name="Saúde Emocional" stroke="#164E7A" strokeWidth={2} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="proposito" name="Trabalho e Propósito" stroke="#5A6F82" strokeWidth={2} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PARTE 3 DO GDA: SEU MOMENTO DE VIDA ATUAL */}
          {lifeMoment && (
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#164E7A] flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#12B8AE]" />
                    <span>3. SEU MOMENTO DE VIDA & CONTEXTO</span>
                  </span>
                  <h3 className="text-xl font-extrabold text-[#163A63] mt-1">
                    {lifeMoment.name}
                  </h3>
                </div>
                <span className="px-3 py-1 bg-[#E6F7F6] text-[#0A988F] rounded-full text-xs font-bold border border-[#B4EBE6] self-start sm:self-auto">
                  {lifeMoment.tagline}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed">
                {lifeMoment.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Acontecimentos Comuns */}
                <div className="p-5 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
                    Possíveis acontecimentos relacionados a esta fase:
                  </h4>
                  <div className="space-y-2 text-xs text-[#2C3E50]">
                    {lifeMoment.commonEvents.map((evt, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#12B8AE] shrink-0 mt-0.5" />
                        <span>{evt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* O que ganha relevância */}
                <div className="p-5 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
                    Dimensões com maior relevância neste momento:
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lifeMoment.priorityDimensions.map((dimId) => {
                      const d = DIMENSIONS.find((x) => x.id === dimId);
                      return (
                        <span
                          key={dimId}
                          className="px-3 py-1.5 bg-white text-[#163A63] rounded-xl text-xs font-bold border border-[#D9E4EE] shadow-2xs flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#12B8AE]" />
                          <span>{d?.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PARTE 4 DO GDA: BENCHMARK REFLEXIVO E COMPARAÇÃO COM O GRUPO */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
            <div className="space-y-2 border-b border-[#EEF3F7] pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#164E7A] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#12B8AE]" />
                <span>4. BENCHMARK REFLEXIVO & COMUNIDADE PREVI</span>
              </span>
              <h3 className="text-xl font-extrabold text-[#163A63]">
                Pessoas em momentos e contextos semelhantes ao seu
              </h3>
              <p className="text-xs text-[#5A6F82]">
                Aqui o comparativo não é para ranquear nem cobrar meta! É para apoiar o autoconhecimento e mostrar que você não está só nos desafios e alegrias da aposentadoria.
              </p>
            </div>

            {/* Benchmark Bar Chart */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={benchmarks.map((b) => {
                    const dim = DIMENSIONS.find((d) => d.id === b.dimensionId);
                    return {
                      name: dim?.shortName || b.dimensionId,
                      'Você': b.userScore,
                      'Grupo Semelhante': b.peerGroupScore,
                      'Comunidade PREVI': b.previCommunityScore,
                    };
                  })}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#163A63', fontWeight: 700 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#5A6F82' }} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="Você" fill="#12B8AE" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Grupo Semelhante" fill="#164E7A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Comunidade PREVI" fill="#CAD8E6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-xs text-[#5A6F82] flex items-center gap-2 justify-center">
              <Shield className="w-4 h-4 text-[#12B8AE] shrink-0" />
              <span>* Dados agregados e anonimizados. Sem cobranças, sem metas financeiras e sem ranqueamento pejorativo.</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PDA (PLANO DE DESENVOLVIMENTO DO APOSENTADO) */}
      {/* Satiriza PDI / PDL com foco no protagonismo e intenções de vida */}
      {/* ============================================================ */}
      {isTabActive('pda') && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Banner Divertido do PDA */}
          <div id="pda-planejamento" className="bg-gradient-to-r from-[#163A63] via-[#1E466F] to-[#164E7A] text-white p-7 sm:p-8 rounded-3xl shadow-sm space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#12B8AE]" />
              <span>PDA • PLANO DE DESENVOLVIMENTO DO APOSENTADO (ADEUS PDI & PDL!)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Seu PDA: Plano de Desenvolvimento do Aposentado
            </h2>
            <p className="text-xs sm:text-sm text-[#B4EBE6] max-w-3xl leading-relaxed">
              Esqueça matrizes 9-box de competências, reuniões tensas de feedback e metas corporativas! No seu <strong>PDA</strong>, o desenvolvimento é todo voltado para o que você realmente quer viver: novos hobbies, viagens, música, gastronomia, atividade física ou simplesmente o nobre direito de descansar sem hora marcada.
            </p>
          </div>

          {/* Dicas e Catálogo Unificado de Experiências Baseadas no Radar e Intenções */}
          <PDASurveyExperienceTips
            onOpenPDA={() => {
              setMeuViverMaisTab('pda');
              document
                .getElementById('pda-planejamento')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: HALL DE MESTRES DA LONGEVIDADE */}
      {/* ============================================================ */}
      {isTabActive('hall_mestres') && (
        <div className="space-y-6 animate-in fade-in">
          <LongevityRetireeRankingGadget />
        </div>
      )}

      {/* IBPL Explanation Modal */}
      {showIbplModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D9E4EE] shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#163A63]">
                Sobre o IBPL Demonstrativo
              </h3>
              <button
                onClick={() => setShowIbplModal(false)}
                className="text-[#5A6F82] font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#5A6F82] leading-relaxed">
              Os valores apresentados neste protótipo são fictícios e não representam resultados, fórmulas, pesos ou regras oficiais do IBPL da PREVI.
            </p>
            <p className="text-xs text-[#163A63] leading-relaxed">
              O IBPL é um facilitador de diálogo e reflexão que apoia escolhas conscientes de bem-estar.
            </p>
            <button
              onClick={() => setShowIbplModal(false)}
              className="w-full py-2.5 bg-[#12B8AE] text-[#163A63] font-bold text-xs rounded-xl"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* User Schedule & Events / Tickets Modal */}
      <UserScheduleEventsModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
};
