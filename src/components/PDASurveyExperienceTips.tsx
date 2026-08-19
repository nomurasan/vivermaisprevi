import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DIMENSIONS } from '../mock/dimensions';
import { EXPERIENCES } from '../mock/experiences';
import { Experience, DimensionId } from '../types';
import {
  Sparkles,
  Target,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  Heart,
  Activity,
  Users,
  Sun,
  ShieldCheck,
  Home,
  MessageSquare,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

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

interface PDASurveyExperienceTipsProps {
  onOpenExperienceModal?: (exp: Experience) => void;
  onOpenPDA?: () => void;
}

export const PDASurveyExperienceTips: React.FC<PDASurveyExperienceTipsProps> = ({
  onOpenExperienceModal,
  onOpenPDA,
}) => {
  const {
    currentParticipant,
    savedExperienceIds,
    toggleSaveExperience,
    setSelectedExperienceForDetail,
    setPrevixContextKey,
    setIsPrevixOpen,
  } = useApp();

  const scores = currentParticipant.scores;

  // Selected filter tab: 'priority', 'all', or a goal id from GOAL_OPTIONS
  const [selectedDimFilter, setSelectedDimFilter] = useState<string>('priority');

  // Categorize dimensions based on survey/radar score
  const sortedDimensions = DIMENSIONS.map((dim) => ({
    ...dim,
    score: scores[dim.id] ?? 70,
  })).sort((a, b) => a.score - b.score);

  // Lowest 2-3 are priorities to improve; Highest 2-3 are strengths
  const attentionDimensions = sortedDimensions.filter((d) => d.score < 68);
  const priorityList = attentionDimensions.length > 0 ? attentionDimensions : sortedDimensions.slice(0, 2);
  const strengthDimensions = sortedDimensions.filter((d) => d.score >= 78);

  // Intelligent dimension mapping for actionable tips & experiences
  const dimensionTipsMap: Record<
    DimensionId,
    {
      diagnostic: string;
      surveyInsight: string;
      actionTip: string;
      recommendedGoal: string;
    }
  > = {
    saude_emocional: {
      diagnostic: 'Pontuação de Atenção no Radar (Abaixo de 65)',
      surveyInsight: 'A pesquisa indicou momentos de sobrecarga mental ou adaptação à nova rotina.',
      actionTip: 'Reserve 20 minutos diários para práticas de respiração, escrita e rodas de escuta.',
      recommendedGoal: 'Cuidar mais de mim',
    },
    trabalho_proposito: {
      diagnostic: 'Oportunidade Central de Desaposentação',
      surveyInsight: 'Seu radar apontou desejo de ressignificar saberes e canalizar sua vasta experiência BB.',
      actionTip: 'Experimente mentorias voluntárias com jovens ou consultorias pontuais sem compromisso fixo.',
      recommendedGoal: 'Contribuir com minha experiência',
    },
    lazer: {
      diagnostic: 'Equilíbrio e Descompressão',
      surveyInsight: 'Tempo livre nem sempre é ocupado com atividades que trazem prazer e novas memórias.',
      actionTip: 'Participe de caravanas culturais, passeios gastronômicos e novos hobbies manuais.',
      recommendedGoal: 'Me divertir',
    },
    saude_fisica: {
      diagnostic: 'Manutenção de Vitalidade & Mobilidade',
      surveyInsight: 'Boa base funcional que se beneficia de regularidade em caminhadas e alongamentos.',
      actionTip: 'Integre circuitos leves ao ar livre em parques com colegas da associação.',
      recommendedGoal: 'Cuidar mais de mim',
    },
    relacionamentos: {
      diagnostic: 'Fortaleza Social e Laços Afetivos',
      surveyInsight: 'Rede de vínculos calorosa que pode ser canal para apoiar outros colegas em transição.',
      actionTip: 'Organize encontros mensais de cafezinho ou grupos temáticos de troca de experiências.',
      recommendedGoal: 'Conhecer pessoas',
    },
    espiritualidade: {
      diagnostic: 'Paz Interior e Transcendência',
      surveyInsight: 'Valores e momentos de introspecção proporcionam estabilidade emocional.',
      actionTip: 'Explore leituras reflexivas, contato com a natureza e práticas de gratidão.',
      recommendedGoal: 'Cuidar mais de mim',
    },
    recursos_financeiros: {
      diagnostic: 'Planejamento e Tranquilidade Econômica',
      surveyInsight: 'Organização patrimonial permite realizar projetos dos sonhos com segurança.',
      actionTip: 'Estruture um orçamento de experiências e viagens para os próximos 12 meses.',
      recommendedGoal: 'Planejar uma experiência',
    },
    moradia: {
      diagnostic: 'Conforto e Ambiente do Lar',
      surveyInsight: 'Espaço doméstico acolhedor para desfrutar o descanso merecido.',
      actionTip: 'Ajuste cantinhos de leitura, iluminação e acessibilidade preventiva na residência.',
      recommendedGoal: 'Cuidar mais de mim',
    },
  };

  // Filter experiences based on selected filter: 'priority', 'all', or goal tag
  const getFilteredExperiences = () => {
    if (selectedDimFilter === 'priority') {
      const priorityIds = priorityList.map((p) => p.id);
      return EXPERIENCES.filter(
        (exp) =>
          priorityIds.includes(exp.dimensionId) ||
          (exp.secondaryDimensionId && priorityIds.includes(exp.secondaryDimensionId))
      );
    }
    if (selectedDimFilter === 'all') {
      return EXPERIENCES;
    }
    // Filter by selected goal / intention
    return EXPERIENCES.filter((exp) => exp.goalTags?.includes(selectedDimFilter));
  };

  const currentExperiences = getFilteredExperiences();

  const handleCardClick = (exp: Experience) => {
    setSelectedExperienceForDetail(exp);
    if (onOpenExperienceModal) {
      onOpenExperienceModal(exp);
    }
  };

  const handleAskPrevixAboutTip = (dimName: string, dimId: string) => {
    setPrevixContextKey(dimId);
    setIsPrevixOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E4EE] shadow-xs space-y-6">
      {/* Title & Research Link Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EEF3F7] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E6F7F6] text-[#0A7D76] rounded-full text-xs font-black uppercase tracking-wider border border-[#B4EBE6]">
            <Sparkles className="w-3.5 h-3.5 text-[#12B8AE]" />
            <span>GDA • Gestão de Desempenho do Aposentado</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#163A63]">
            Experiências Recomendadas a Partir do seu Retrato
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6F82]">
            Com base no seu Retrato de Longevidade, o GDA identifica pontos de atenção, potencialidades e oportunidades para viver esta fase com mais qualidade.
          </p>
        </div>

        {/* CTA para o PDA + Priority badge summary */}
        <div className="flex flex-col items-start md:items-end gap-3 shrink-0 self-start md:self-auto">
          <div className="flex flex-col items-start md:items-end gap-1">
            <button
              onClick={onOpenPDA}
              className="px-4 py-2.5 bg-[#163A63] hover:bg-[#1E466F] text-white rounded-xl text-xs font-black uppercase tracking-wide transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Criar / Atualizar meu PDA</span>
              <ArrowRight className="w-4 h-4 text-[#12B8AE]" />
            </button>
            <span className="text-[10px] font-bold text-[#164E7A] uppercase tracking-wider">
              PDA • Plano de Desenvolvimento do Aposentado
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#F4F7FA] p-3 rounded-2xl border border-[#D9E4EE]">
            <Target className="w-5 h-5 text-[#12B8AE]" />
            <div className="text-xs">
              <span className="font-bold text-[#163A63] block">Foco Recomendado no PDA:</span>
              <span className="text-[#0A7D76] font-semibold">
                {priorityList.map((p) => p.name).join(' & ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Diagnostic Callout Cards: Priorities vs Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Prioridades para Desenvolver no PDA */}
        <div className="p-5 bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E6] rounded-2xl border border-[#FFE0B2] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#B25900] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E67E22]" />
              <span>Oportunidades Prioritárias (Menor Pontuação)</span>
            </span>
            <span className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full text-[#B25900] border border-[#FFE0B2]">
              Impulsione seu PDA
            </span>
          </div>

          <div className="space-y-2">
            {priorityList.map((dim) => {
              const tipInfo = dimensionTipsMap[dim.id];
              return (
                <div key={dim.id} className="p-3 bg-white/90 rounded-xl border border-[#FFE0B2] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#163A63] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E67E22]" />
                      {dim.name}
                    </span>
                    <span className="text-xs font-black text-[#E67E22] bg-[#FFF3E6] px-2 py-0.5 rounded-md">
                      {dim.score}/100 no Radar
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A6F82]">
                    <strong>Diagnóstico da Pesquisa:</strong> {tipInfo.surveyInsight}
                  </p>
                  <p className="text-[11px] text-[#163A63] font-semibold flex items-start gap-1 pt-0.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#E67E22] shrink-0 mt-0.5" />
                    <span><strong>Dica Prática:</strong> {tipInfo.actionTip}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Fortalezas que Alavancam seu PDA */}
        <div className="p-5 bg-gradient-to-br from-[#E6F7F6] to-[#D4F4F1] rounded-2xl border border-[#B4EBE6] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#0A7D76] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#12B8AE]" />
              <span>Suas Fortalezas no Gráfico (80+)</span>
            </span>
            <span className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full text-[#0A7D76] border border-[#B4EBE6]">
              Pilares Fortes
            </span>
          </div>

          <div className="space-y-2">
            {(strengthDimensions.length > 0 ? strengthDimensions.slice(0, 2) : sortedDimensions.slice(-2)).map((dim) => {
              const tipInfo = dimensionTipsMap[dim.id];
              return (
                <div key={dim.id} className="p-3 bg-white/90 rounded-xl border border-[#B4EBE6] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#163A63] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#12B8AE]" />
                      {dim.name}
                    </span>
                    <span className="text-xs font-black text-[#0A7D76] bg-[#E6F7F6] px-2 py-0.5 rounded-md">
                      {dim.score}/100 no Radar
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A6F82]">
                    <strong>Ponto de Apoio:</strong> Sua alta pontuação nesta área traz segurança e energia para experimentar novos rumos.
                  </p>
                  <p className="text-[11px] text-[#0A7D76] font-semibold flex items-start gap-1 pt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#12B8AE] shrink-0 mt-0.5" />
                    <span><strong>Como usar no PDA:</strong> {tipInfo.actionTip}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter: O que você gostaria de fazer neste momento? */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#164E7A] block">
              FILTRO DO SEU PDA • PROTAGONISMO & INTENÇÕES
            </span>
            <h4 className="text-lg sm:text-xl font-black text-[#163A63]">
              O que você gostaria de fazer neste momento?
            </h4>
          </div>

          {/* Quick toggle between Radar Priorities and All */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDimFilter('priority')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedDimFilter === 'priority'
                  ? 'bg-[#163A63] text-white shadow-xs'
                  : 'bg-[#F4F7FA] text-[#5A6F82] hover:bg-[#EEF3F7]'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-[#12B8AE]" />
              <span>Prioridades do Radar ({priorityList.length})</span>
            </button>

            <button
              onClick={() => setSelectedDimFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDimFilter === 'all'
                  ? 'bg-[#163A63] text-white shadow-xs'
                  : 'bg-[#F4F7FA] text-[#5A6F82] hover:bg-[#EEF3F7]'
              }`}
            >
              Todas as Experiências ({EXPERIENCES.length})
            </button>
          </div>
        </div>

        {/* Large Visual Selection Grid of Life Goals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {GOAL_OPTIONS.map((g) => {
            const isSelected = selectedDimFilter === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedDimFilter(g.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#163A63] text-white border-[#163A63] shadow-md ring-2 ring-[#12B8AE]'
                    : 'bg-[#F4F7FA] text-[#163A63] border-[#D9E4EE] hover:bg-[#EEF3F7] hover:border-[#CAD8E6]'
                }`}
              >
                <span className="text-2xl shrink-0">{g.emoji}</span>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold leading-snug block">{g.label}</span>
                  <span className={`text-[10px] block ${isSelected ? 'text-[#B4EBE6]' : 'text-[#5A6F82]'}`}>
                    {isSelected ? 'Filtro ativo' : 'Ver cursos & ações'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header showing active filter & count */}
      <div className="flex items-center justify-between pt-2">
        <h4 className="text-base font-extrabold text-[#163A63]">
          {selectedDimFilter === 'priority'
            ? `Cursos & Experiências Recomendados para suas Prioridades (${currentExperiences.length})`
            : selectedDimFilter === 'all'
            ? `Todas as Experiências do Catálogo (${currentExperiences.length})`
            : `Experiências para "${selectedDimFilter}" (${currentExperiences.length})`}
        </h4>
        {selectedDimFilter !== 'priority' && (
          <button
            onClick={() => setSelectedDimFilter('priority')}
            className="text-xs font-bold text-[#12B8AE] hover:underline"
          >
            Voltar para prioridades do radar
          </button>
        )}
      </div>

      {/* Recommended Experience Cards Grid with Large Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentExperiences.map((exp) => {
          const isSaved = savedExperienceIds.includes(exp.id);
          const dimObj = DIMENSIONS.find((d) => d.id === exp.dimensionId);
          const dimScore = scores[exp.dimensionId] ?? 70;

          return (
            <div
              key={exp.id}
              onClick={() => handleCardClick(exp)}
              className="bg-white hover:bg-[#FAFBFD] rounded-3xl border border-[#D9E4EE] hover:border-[#12B8AE] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              <div>
                {/* Large Cover Image */}
                <div className="relative h-44 w-full bg-[#EBF3FA] overflow-hidden">
                  {exp.imageUrl ? (
                    <img
                      src={exp.imageUrl}
                      alt={exp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#164E7A] bg-gradient-to-br from-[#EBF3FA] to-[#D9E4EE]">
                      <Sparkles className="w-12 h-12 text-[#12B8AE]/60" />
                    </div>
                  )}

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-[#163A63]/90 backdrop-blur-sm text-white rounded-full text-[10px] font-bold shadow-xs">
                      {exp.category}
                    </span>
                    {exp.badge && (
                      <span className="px-2 py-0.5 bg-[#12B8AE] text-[#163A63] rounded-full text-[10px] font-extrabold shadow-xs">
                        {exp.badge}
                      </span>
                    )}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs ${
                        exp.priceType === 'Benefício PREVI'
                          ? 'bg-[#12B8AE] text-[#163A63]'
                          : exp.priceType === 'Desconto Exclusivo'
                          ? 'bg-white text-[#164E7A] border border-[#D9E4EE]'
                          : 'bg-white/95 text-[#2C3E50]'
                      }`}
                    >
                      {exp.priceType}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3">
                  {/* Partner & Save Button */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#12B8AE]" />
                      <span className="font-bold text-[#164E7A]">{exp.partnerName}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveExperience(exp.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-[#12B8AE] text-[#163A63] border-[#12B8AE]'
                          : 'bg-white text-[#5A6F82] border-[#D9E4EE] hover:text-[#163A63]'
                      }`}
                      title={isSaved ? 'Salvo no Meu Plano' : 'Salvar no PDA'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title & Modality */}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-[#163A63] group-hover:text-[#12B8AE] transition-colors leading-snug line-clamp-2">
                      {exp.title}
                    </h4>
                    <span className="text-xs text-[#5A6F82] block">
                      {exp.modality} • {exp.location}
                    </span>
                  </div>

                  {/* Survey Radar Insight Box */}
                  <div className="p-3 bg-[#FAFBFD] rounded-xl border border-[#EEF3F7] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-[#164E7A]">Eixo do Radar: {dimObj?.name}</span>
                      <span className={dimScore < 68 ? 'text-[#E67E22]' : 'text-[#0A7D76]'}>
                        Score: {dimScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-[#5A6F82] line-clamp-2 leading-relaxed">
                      {exp.recommendationReason || exp.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-[#EEF3F7] flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAskPrevixAboutTip(dimObj?.name || 'Geral', exp.dimensionId);
                  }}
                  className="text-xs font-bold text-[#164E7A] hover:text-[#12B8AE] flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#12B8AE]" />
                  <span>Dica PREVIX</span>
                </button>

                <div className="flex items-center gap-1.5 font-black text-[#12B8AE] group-hover:translate-x-1 transition-transform text-xs">
                  <span>Ver Detalhes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Motivational Footer */}
      <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-[#163A63]">
          <Compass className="w-5 h-5 text-[#12B8AE] shrink-0" />
          <span>
            <strong>Lembrete PREVI:</strong> As experiências do PDA não possuem prazos ou obrigações. Você explora cada atividade no seu próprio tempo e ritmo!
          </span>
        </div>
        <button
          onClick={() => {
            setPrevixContextKey('pda');
            setIsPrevixOpen(true);
          }}
          className="px-4 py-2 bg-white hover:bg-[#E6F7F6] text-[#163A63] font-bold rounded-xl border border-[#D9E4EE] text-xs whitespace-nowrap shadow-2xs transition-colors self-start sm:self-auto"
        >
          Pedir Ajuda à PREVIX
        </button>
      </div>
    </div>
  );
};
