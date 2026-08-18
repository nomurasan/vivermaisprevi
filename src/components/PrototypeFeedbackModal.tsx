import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PrototypeFeedback } from '../types';
import { X, MessageSquareQuote, CheckCircle2, Sparkles, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

const FEATURE_OPTIONS = [
  'Meu Retrato',
  '8 Áreas da Vida',
  'Momento de Vida',
  'Recomendações',
  'Experiências',
  'Meu Plano',
  'Comparação com a Comunidade',
  'PREVIX (Assistente)',
];

export const PrototypeFeedbackModal: React.FC = () => {
  const { isFeedbackModalOpen, setIsFeedbackModalOpen, submitPrototypeFeedback } = useApp();

  const [q1Utility, setQ1Utility] = useState<'Muito' | 'Sim' | 'Talvez' | 'Não'>('Muito');
  const [q2LikedMost, setQ2LikedMost] = useState<string[]>(['Meu Retrato', 'Experiências']);
  const [q3WishList, setQ3WishList] = useState('');
  const [q4WillUse, setQ4WillUse] = useState<'Certamente' | 'Provavelmente' | 'Talvez' | 'Provavelmente não'>('Certamente');
  const [q5ValuePerception, setQ5ValuePerception] = useState<'Muito' | 'Um pouco' | 'Não mudaria' | 'Reduziria'>('Muito');
  const [q6FutureTests, setQ6FutureTests] = useState<'Sim' | 'Talvez' | 'Não'>('Sim');

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isFeedbackModalOpen) return null;

  const toggleFeature = (feat: string) => {
    if (q2LikedMost.includes(feat)) {
      setQ2LikedMost(q2LikedMost.filter((f) => f !== feat));
    } else {
      setQ2LikedMost([...q2LikedMost, feat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fb: PrototypeFeedback = {
      id: `proto_fb_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      q1Utility,
      q2LikedMost,
      q3WishList: q3WishList.trim(),
      q4WillUse,
      q5ValuePerception,
      q6FutureTests,
    };

    submitPrototypeFeedback(fb);
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#12B8AE', '#163A63'],
      });
    } catch (_) {}

    setTimeout(() => {
      setIsFeedbackModalOpen(false);
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] shadow-2xl border border-[#D9E4EE] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#163A63] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#12B8AE] text-[#163A63] flex items-center justify-center font-bold">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ajude a construir o Viver Mais</h3>
              <p className="text-[11px] text-[#D9E4EE]">Pesquisa de Validação Conceitual V1</p>
            </div>
          </div>
          <button
            onClick={() => setIsFeedbackModalOpen(false)}
            className="text-[#D9E4EE] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-[#E6F7F6] text-[#0A7D76] rounded-full flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>
            <h3 className="text-lg font-bold text-[#163A63]">Contribuição registrada com sucesso!</h3>
            <p className="text-xs text-[#5A6F82]">
              Sua visão é essencial para calibrarmos a proposta de valor do Viver Mais PREVI.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
            {/* P1 */}
            <div className="space-y-2">
              <label className="font-bold text-[#163A63] block">
                1. Esta experiência seria útil para você?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Muito', 'Sim', 'Talvez', 'Não'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQ1Utility(opt)}
                    className={`py-2 rounded-xl border text-center font-semibold transition-all ${
                      q1Utility === opt
                        ? 'bg-[#163A63] text-white border-[#163A63]'
                        : 'bg-[#F4F7FA] text-[#5A6F82] border-[#D9E4EE] hover:bg-[#EEF3F7]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* P2 */}
            <div className="space-y-2">
              <label className="font-bold text-[#163A63] block">
                2. O que você mais gostou no protótipo?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {FEATURE_OPTIONS.map((feat) => {
                  const isSel = q2LikedMost.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`p-2 rounded-lg border text-left text-[11px] font-semibold transition-colors flex items-center justify-between ${
                        isSel
                          ? 'bg-[#E6F7F6] border-[#12B8AE] text-[#0A7D76]'
                          : 'bg-white border-[#D9E4EE] text-[#5A6F82] hover:bg-[#F4F7FA]'
                      }`}
                    >
                      <span>{feat}</span>
                      {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-[#0A7D76]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* P3 */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#163A63] block">
                3. O que você gostaria de encontrar no Viver Mais?
              </label>
              <textarea
                value={q3WishList}
                onChange={(e) => setQ3WishList(e.target.value)}
                placeholder="Ex: Parcerias para voluntariado presencial na minha cidade, cursos de línguas..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-[#D9E4EE] focus:border-[#12B8AE] focus:outline-hidden text-xs text-[#163A63]"
              />
            </div>

            {/* P4 */}
            <div className="space-y-2">
              <label className="font-bold text-[#163A63] block">
                4. Você utilizaria o Viver Mais se estivesse disponível?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Certamente', 'Provavelmente', 'Talvez', 'Provavelmente não'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQ4WillUse(opt)}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                      q4WillUse === opt
                        ? 'bg-[#163A63] text-white border-[#163A63]'
                        : 'bg-[#F4F7FA] text-[#5A6F82] border-[#D9E4EE] hover:bg-[#EEF3F7]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* P5 */}
            <div className="space-y-2">
              <label className="font-bold text-[#163A63] block">
                5. Uma iniciativa como esta aumentaria sua percepção de valor sobre a PREVI?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Muito', 'Um pouco', 'Não mudaria', 'Reduziria'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQ5ValuePerception(opt)}
                    className={`py-2 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                      q5ValuePerception === opt
                        ? 'bg-[#12B8AE] text-[#163A63] border-[#12B8AE] font-black'
                        : 'bg-[#F4F7FA] text-[#5A6F82] border-[#D9E4EE] hover:bg-[#EEF3F7]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* P6 */}
            <div className="space-y-2">
              <label className="font-bold text-[#163A63] block">
                6. Você participaria de novas etapas de teste com a PREVI?
              </label>
              <div className="flex gap-2">
                {(['Sim', 'Talvez', 'Não'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQ6FutureTests(opt)}
                    className={`flex-1 py-2 rounded-xl border text-center font-semibold transition-all ${
                      q6FutureTests === opt
                        ? 'bg-[#163A63] text-white border-[#163A63]'
                        : 'bg-[#F4F7FA] text-[#5A6F82] border-[#D9E4EE]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEF3F7]">
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5A6F82] hover:bg-[#F4F7FA] rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                Enviar Contribuição
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
