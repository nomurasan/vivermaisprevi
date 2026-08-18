import React from 'react';
import { useApp } from '../context/AppContext';
import { DIMENSIONS } from '../mock/dimensions';
import {
  BookmarkCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Sparkles,
  MessageSquare,
  Building,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const MeuPlanoView: React.FC = () => {
  const {
    myPlan,
    removeFromPlan,
    markPlanItemCompleted,
    setSelectedPlanItemForEvaluation,
    navigateTo,
    currentParticipant,
  } = useApp();

  const firstName = currentParticipant.name.split(' ')[0];

  const plannedItems = myPlan.filter((item) => item.status !== 'realizado');
  const completedItems = myPlan.filter((item) => item.status === 'realizado');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E4EE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
              SUAS ESCOLHAS
            </span>
            <span className="text-[10px] bg-[#E6F7F6] text-[#0A7D76] px-2 py-0.5 rounded-full font-bold border border-[#B4EBE6]">
              {myPlan.length} itens no plano
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163A63]">
            Meu Plano Viver Mais
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6F82] max-w-xl leading-relaxed">
            Estas são as possibilidades que você escolheu salvar e vivenciar. Sem pressões ou metas rígidas — um guia acolhedor para o seu tempo.
          </p>
        </div>

        <button
          onClick={() => navigateTo('explorar')}
          className="px-5 py-3 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>ADICIONAR NOVAS EXPERIÊNCIAS</span>
        </button>
      </div>

      {/* Main Grid: Atividades Planejadas & Realizadas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Experiências para Vivenciar (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#163A63] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#164E7A]" />
              <span>Experiências Salvas para Vivenciar</span>
            </h3>
            <span className="text-xs font-semibold text-[#5A6F82]">
              {plannedItems.length} planejadas
            </span>
          </div>

          {plannedItems.length > 0 ? (
            <div className="space-y-4">
              {plannedItems.map((item) => {
                const exp = item.experience;
                const dim = DIMENSIONS.find((d) => d.id === exp.dimensionId);
                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-[#D9E4EE] hover:border-[#12B8AE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-[#164E7A] flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-[#12B8AE]" />
                          {exp.partnerName}
                        </span>
                        {dim && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4F7FA] text-[#5A6F82] border border-[#D9E4EE]">
                            {dim.name}
                          </span>
                        )}
                        <span className="text-[10px] text-[#5A6F82]">
                          Adicionado em {item.addedAt}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#163A63] leading-snug">
                        {exp.title}
                      </h4>

                      <p className="text-xs text-[#5A6F82] line-clamp-2">
                        {exp.description}
                      </p>
                    </div>

                    {/* Actions on Item */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EEF3F7]">
                      <button
                        onClick={() => markPlanItemCompleted(item.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#E6F7F6] hover:bg-[#12B8AE] text-[#0A7D76] hover:text-[#163A63] rounded-xl text-xs font-bold border border-[#B4EBE6] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Marcar como Realizado</span>
                      </button>

                      <button
                        onClick={() => removeFromPlan(item.id)}
                        className="p-2 text-[#5A6F82] hover:text-red-600 hover:bg-[#FAFBFD] rounded-lg text-xs"
                        title="Remover do plano"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#D9E4EE] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EBF3FA] text-[#164E7A] flex items-center justify-center mx-auto text-xl">
                📂
              </div>
              <h4 className="font-bold text-base text-[#163A63]">Seu plano está vazio no momento</h4>
              <p className="text-xs text-[#5A6F82] max-w-sm mx-auto">
                Explore o catálogo de parceiros para salvar experiências que combinem com o seu ritmo de vida.
              </p>
              <button
                onClick={() => navigateTo('explorar')}
                className="px-5 py-2.5 bg-[#12B8AE] text-[#163A63] font-bold text-xs rounded-xl"
              >
                Explorar Catálogo
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Experiências Já Realizadas & Avaliadas (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#163A63] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0A7D76]" />
              <span>Já Realizadas</span>
            </h3>
            <span className="text-xs font-semibold text-[#5A6F82]">
              {completedItems.length} concluídas
            </span>
          </div>

          <div className="space-y-3">
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#E6F7F6]/60 p-4 rounded-2xl border border-[#B4EBE6] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0A7D76]">
                    {item.experience.partnerName}
                  </span>
                  <span className="text-[10px] text-[#0A7D76] font-semibold">
                    ✓ Concluído
                  </span>
                </div>
                <h5 className="font-bold text-xs text-[#163A63]">
                  {item.experience.title}
                </h5>
                {item.userNotes && (
                  <p className="text-[11px] text-[#5A6F82] italic bg-white p-2 rounded-lg border border-[#D9E4EE]">
                    "{item.userNotes}"
                  </p>
                )}
                <button
                  onClick={() => setSelectedPlanItemForEvaluation(item)}
                  className="text-[11px] font-bold text-[#164E7A] hover:underline flex items-center gap-1 pt-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Avaliar novamente ou ver relato</span>
                </button>
              </div>
            ))}
          </div>

          {/* Supportive Box */}
          <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] space-y-2">
            <h4 className="font-bold text-xs text-[#163A63] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#12B8AE]" />
              <span>Acompanhamento sem cobrança</span>
            </h4>
            <p className="text-xs text-[#5A6F82] leading-relaxed">
              O Viver Mais valoriza cada passo vivido, sem pontuações negativas ou pressão de cronograma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
