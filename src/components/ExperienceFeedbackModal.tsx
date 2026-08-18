import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExperienceEvaluation } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Building,
  Heart,
} from 'lucide-react';

const FEELINGS = [
  { id: 'adorei', label: 'Adorei', emoji: '😍' },
  { id: 'gostei', label: 'Gostei', emoji: '🙂' },
  { id: 'razoavel', label: 'Foi razoável', emoji: '😐' },
  { id: 'nao_gostei', label: 'Não gostei', emoji: '🙁' },
];

const BENEFITS = [
  'Me diverti',
  'Conheci pessoas',
  'Aprendi algo novo',
  'Saí mais de casa',
  'Me senti mais ativo',
  'Ampliei possibilidades profissionais',
  'Passei tempo com minha família',
  'Não fez muita diferença',
];

export const ExperienceFeedbackModal: React.FC = () => {
  const {
    selectedPlanItemForEvaluation,
    setSelectedPlanItemForEvaluation,
    submitExperienceEvaluation,
    currentParticipant,
  } = useApp();

  const [feeling, setFeeling] = useState<'adorei' | 'gostei' | 'razoavel' | 'nao_gostei'>('adorei');
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(['Me diverti']);
  const [comment, setComment] = useState('');
  
  // Partner ratings
  const [quality, setQuality] = useState(5);
  const [easeOfUse, setEaseOfUse] = useState(5);
  const [metExpectations, setMetExpectations] = useState(5);
  const [recommendationMatch, setRecommendationMatch] = useState(5);
  const [wouldUseAgain, setWouldUseAgain] = useState<'Sim' | 'Talvez' | 'Não'>('Sim');
  const [wouldRecommend, setWouldRecommend] = useState<'Sim' | 'Talvez' | 'Não'>('Sim');

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!selectedPlanItemForEvaluation) return null;

  const item = selectedPlanItemForEvaluation;
  const exp = item.experience;

  const toggleBenefit = (b: string) => {
    if (selectedBenefits.includes(b)) {
      setSelectedBenefits(selectedBenefits.filter((x) => x !== b));
    } else {
      setSelectedBenefits([...selectedBenefits, b]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const evaluation: ExperienceEvaluation = {
      id: `eval_${Date.now()}`,
      experienceId: exp.id,
      participantId: currentParticipant.id,
      completedDate: new Date().toISOString().split('T')[0],
      feeling,
      benefitsGained: selectedBenefits,
      comment: comment.trim() || undefined,
      partnerRatings: {
        quality,
        easeOfUse,
        metExpectations,
        recommendationMatch,
        wouldUseAgain,
        wouldRecommend,
      },
    };

    submitExperienceEvaluation(evaluation);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#12B8AE', '#163A63', '#20C2B4'],
      });
    } catch (_) {}

    setTimeout(() => {
      setSelectedPlanItemForEvaluation(null);
      setIsSubmitted(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] shadow-2xl border border-[#D9E4EE] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#163A63] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#12B8AE] text-[#163A63] flex items-center justify-center font-black">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-sm">Avaliação da Experiência</h3>
              <p className="text-[11px] text-[#D9E4EE] truncate max-w-xs">{exp.title}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedPlanItemForEvaluation(null)}
            className="text-[#D9E4EE] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-[#E6F7F6] text-[#0A7D76] rounded-full flex items-center justify-center mx-auto text-2xl">
              ✨
            </div>
            <h3 className="text-lg font-bold text-[#163A63]">Muito obrigado pelo seu relato!</h3>
            <p className="text-xs text-[#5A6F82]">
              Sua avaliação ajuda a aprimorar as recomendações para você e para toda a comunidade PREVI.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
            {/* Step 1: Feeling */}
            <div className="space-y-3">
              <label className="font-bold text-[#163A63] text-sm block">
                1. Como foi sua experiência?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {FEELINGS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFeeling(f.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      feeling === f.id
                        ? 'bg-[#E6F7F6] border-[#12B8AE] shadow-sm'
                        : 'bg-[#F4F7FA] border-[#D9E4EE] hover:bg-[#EEF3F7]'
                    }`}
                  >
                    <span className="text-2xl">{f.emoji}</span>
                    <span className="font-bold text-[11px] text-[#163A63]">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Benefits Gained */}
            <div className="space-y-2.5">
              <label className="font-bold text-[#163A63] text-sm block">
                2. O que esta experiência trouxe para você?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BENEFITS.map((b) => {
                  const isSelected = selectedBenefits.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBenefit(b)}
                      className={`p-2.5 rounded-xl border text-left text-[11px] font-semibold transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#EBF3FA] border-[#164E7A] text-[#164E7A]'
                          : 'bg-white border-[#D9E4EE] text-[#5A6F82] hover:bg-[#F4F7FA]'
                      }`}
                    >
                      <span>{b}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#164E7A] shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional Comment */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#163A63] text-xs block">
                3. Quer contar algo sobre sua experiência? (Opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: Gostei muito da dinâmica do grupo e pretendo participar do próximo encontro..."
                rows={3}
                className="w-full p-3 rounded-xl border border-[#D9E4EE] focus:border-[#12B8AE] focus:outline-hidden text-xs text-[#163A63]"
              />
            </div>

            {/* Partner Evaluation Section */}
            <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#164E7A]" />
                <h4 className="font-bold text-[#163A63] text-xs">
                  Avaliação do Parceiro ({exp.partnerName})
                </h4>
              </div>

              <div className="space-y-3 text-[11px]">
                {/* Qualidade */}
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6F82]">Qualidade do serviço:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setQuality(star)}
                        className={`text-sm ${star <= quality ? 'text-amber-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Facilidade */}
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6F82]">Facilidade de acesso / uso:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEaseOfUse(star)}
                        className={`text-sm ${star <= easeOfUse ? 'text-amber-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aderência ao momento */}
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6F82]">A recomendação fez sentido para você?</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRecommendationMatch(star)}
                        className={`text-sm ${star <= recommendationMatch ? 'text-amber-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Utilizaria novamente */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#5A6F82]">Utilizaria novamente?</span>
                  <div className="flex gap-1.5">
                    {(['Sim', 'Talvez', 'Não'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWouldUseAgain(opt)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                          wouldUseAgain === opt
                            ? 'bg-[#163A63] text-white border-[#163A63]'
                            : 'bg-white text-[#5A6F82] border-[#D9E4EE]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanItemForEvaluation(null)}
                className="px-4 py-2 text-xs font-semibold text-[#5A6F82] hover:bg-[#F4F7FA] rounded-xl"
              >
                Pular por enquanto
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                Enviar Avaliação
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
