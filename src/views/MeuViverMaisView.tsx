import React, { useState, useEffect } from 'react';
import { useApp, MeuViverMaisTab } from '../context/AppContext';
import { RadarChartComponent } from '../components/RadarChartComponent';
import { ExperienceCard } from '../components/ExperienceCard';
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

  const tabs: { id: MeuViverMaisTab; label: string }[] = [
    { id: 'inicio', label: 'Início' },
    { id: 'retrato', label: 'Meu Retrato' },
    { id: 'para_mim', label: 'Para Mim' },
    { id: 'momento', label: 'Meu Momento' },
    { id: 'comparacao', label: 'Comparação' },
    { id: 'evolucao', label: 'Minha Evolução' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* 1. Header Card: Greeting + Sub-Navigation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E4EE] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

          {/* Quick link to Meu Plano */}
          <button
            onClick={() => navigateTo('meu_plano')}
            className="px-4 py-2.5 bg-[#F4F7FA] hover:bg-[#EBF3FA] text-[#163A63] rounded-xl border border-[#D9E4EE] text-xs font-bold transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            <Bookmark className="w-4 h-4 text-[#12B8AE]" />
            <span>Acessar Meu Plano</span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#EEF3F7] pb-2 pt-2 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setMeuViverMaisTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                meuViverMaisTab === t.id
                  ? 'bg-[#163A63] text-white shadow-xs'
                  : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB: INÍCIO (Visão Principal do Meu Viver Mais) */}
      {/* ============================================================ */}
      {(meuViverMaisTab === 'inicio' || meuViverMaisTab === 'retrato') && (
        <div className="space-y-8">
          {/* Top Row: IBPL + Meu Mapa de Vida (Radar) */}
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
                <div className="p-3 bg-[#E6F7F6] rounded-xl border border-[#B4EBE6] text-[11px] text-[#0A7D76]">
                  💬 <strong>Dica PREVIX:</strong> Pequenas escolhas diárias em lazer e conexões elevam a qualidade de vida.
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
                * Faixas exclusivamente demonstrativas para navegação no protótipo.
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
                    Minhas Fortalezas
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#0A7D76] bg-[#E6F7F6] px-2.5 py-0.5 rounded-full border border-[#B4EBE6]">
                  {strengths.length} áreas
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
                    O que Merece Atenção
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#164E7A] bg-[#EBF3FA] px-2.5 py-0.5 rounded-full border border-[#CAD8E6]">
                  {attentions.length} áreas
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
                          onClick={() => navigateTo('explorar')}
                          className="text-[10px] font-bold text-[#12B8AE] hover:underline"
                        >
                          Possibilidades
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 24: O que você gostaria de fazer neste momento? (Protagonismo) */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#164E7A]">
                  SEU PROTAGONISMO • ESCOLHA DECLARADA
                </span>
                <h3 className="font-extrabold text-xl text-[#163A63] mt-1">
                  O que você gostaria de fazer neste momento?
                </h3>
                <p className="text-xs text-[#5A6F82] mt-0.5">
                  Selecione para calibrar as experiências em tempo real (DADOS + SUA ESCOLHA)
                </p>
              </div>
              {activeIntentionTag && (
                <button
                  onClick={() => setActiveIntentionTag(null)}
                  className="text-xs font-bold text-[#5A6F82] hover:text-[#163A63] underline self-start"
                >
                  Limpar filtro de intenção
                </button>
              )}
            </div>

            {/* Clickable 8 Intention Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {GOAL_OPTIONS.map((g) => {
                const isSelected = activeIntentionTag === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleGoalClick(g.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#163A63] text-white border-[#163A63] shadow-md ring-2 ring-[#12B8AE]'
                        : 'bg-[#F4F7FA] text-[#163A63] border-[#D9E4EE] hover:bg-[#EEF3F7] hover:border-[#CAD8E6]'
                    }`}
                  >
                    <span className="text-lg shrink-0">{g.emoji}</span>
                    <span className="text-xs font-bold leading-snug">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 25: EXPERIÊNCIAS PARA VOCÊ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#163A63]">
                  Talvez você goste destas experiências
                </h3>
                <p className="text-xs text-[#5A6F82]">
                  {activeIntentionTag
                    ? `Filtrando por: "${activeIntentionTag}"`
                    : 'Recomendações baseadas em seu retrato e momento de vida'}
                </p>
              </div>
              <button
                onClick={() => navigateTo('explorar')}
                className="text-xs font-bold text-[#164E7A] hover:text-[#0A988F] flex items-center gap-1"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Experience Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: PARA MIM (Recomendações e Catálogo Direto) */}
      {/* ============================================================ */}
      {meuViverMaisTab === 'para_mim' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#D9E4EE] shadow-xs">
            <h2 className="text-xl font-bold text-[#163A63]">Recomendações Selecionadas</h2>
            <p className="text-xs text-[#5A6F82] mt-1">
              Curadoria personalizada de parceiros como Maturi, Easy Live, Sesc e iniciativas PREVI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: MEU MOMENTO DE VIDA */}
      {/* ============================================================ */}
      {meuViverMaisTab === 'momento' && lifeMoment && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#164E7A]">
                SEU MOMENTO DE VIDA
              </span>
              <h2 className="text-2xl font-extrabold text-[#163A63]">{lifeMoment.name}</h2>
              <p className="text-xs text-[#12B8AE] font-bold">{lifeMoment.tagline}</p>
            </div>

            <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed">
              {lifeMoment.description}
            </p>

            {/* Acontecimentos Comuns */}
            <div className="p-5 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
                Possíveis acontecimentos relacionados a esta fase:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2C3E50]">
                {lifeMoment.commonEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12B8AE] shrink-0" />
                    <span>{evt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* O que pode ganhar relevância */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
                O que costuma ganhar relevância neste momento:
              </h4>
              <div className="flex flex-wrap gap-2">
                {lifeMoment.priorityDimensions.map((dimId) => {
                  const d = DIMENSIONS.find((x) => x.id === dimId);
                  return (
                    <span
                      key={dimId}
                      className="px-3 py-1.5 bg-[#EBF3FA] text-[#164E7A] rounded-xl text-xs font-bold border border-[#D9E4EE]"
                    >
                      {d?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: COMPARAÇÃO COM A COMUNIDADE */}
      {/* ============================================================ */}
      {meuViverMaisTab === 'comparacao' && (
        <div className="bg-white p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#164E7A]">
              BENCHMARK REFLEXIVO
            </span>
            <h2 className="text-2xl font-extrabold text-[#163A63]">
              Pessoas em momentos semelhantes ao seu
            </h2>
            <p className="text-xs text-[#5A6F82]">
              Comparar não significa competir. Esta visão ajuda a compreender como determinadas fortalezas e desafios aparecem entre pessoas que vivem contextos semelhantes.
            </p>
          </div>

          {/* Benchmark Bar Chart */}
          <div className="h-80 w-full pt-4">
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

          <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-xs text-[#5A6F82] text-center">
            * Dados agregados e fictícios de simulação. Sem rankings individuais pejorativos.
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: MINHA EVOLUÇÃO */}
      {/* ============================================================ */}
      {meuViverMaisTab === 'evolucao' && (
        <div className="bg-white p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#164E7A]">
              HISTÓRICO E PROJEÇÃO
            </span>
            <h2 className="text-2xl font-extrabold text-[#163A63]">Minha Evolução</h2>
            <p className="text-xs text-[#5A6F82]">
              O objetivo não é alcançar uma nota perfeita. É perceber mudanças importantes ao longo da vida.
            </p>
          </div>

          {/* Evolution Line Chart */}
          <div className="h-72 w-full pt-4">
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
    </div>
  );
};
