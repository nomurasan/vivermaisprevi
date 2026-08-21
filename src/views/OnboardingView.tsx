import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPercentage } from '../utils/formatters';
import { DIMENSIONS, getStatusFromScore } from '../mock/dimensions';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Heart,
  Compass,
  Activity,
  Users,
  Home,
  ShieldCheck,
  Sun,
  Smile,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingView: React.FC = () => {
  const { currentParticipant, dimensionScores, navigateTo } = useApp();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const firstName = currentParticipant.name.split(' ')[0];

  // Separate scores into Strengths (>=80) and Attention points (<80, especially <65)
  const strengths = dimensionScores
    .filter((s) => s.score >= 80)
    .sort((a, b) => b.score - a.score);

  const attentions = dimensionScores
    .filter((s) => s.score < 80)
    .sort((a, b) => a.score - b.score);

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#12B8AE', '#163A63'],
        });
      } catch (_) {}
    } else {
      navigateTo('meu_viver_mais', 'inicio');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#D9E4EE] shadow-xl overflow-hidden p-8 sm:p-12 relative animate-in fade-in zoom-in-95">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                step === s
                  ? 'w-8 bg-[#12B8AE]'
                  : step > s
                  ? 'w-3 bg-[#163A63]'
                  : 'w-2 bg-[#D9E4EE]'
              }`}
            />
          ))}
        </div>

        {/* STEP 0: Welcome & Framing */}
        {step === 0 && (
          <div className="text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#E6F7F6] text-[#0A7D76] flex items-center justify-center mx-auto text-2xl font-black">
              👋
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#164E7A] font-extrabold">
                PRIMEIRO ACESSO
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163A63]">
                Olá, {firstName}.<br />
                Que bom ter você no Viver Mais.
              </h2>
            </div>

            <p className="text-sm text-[#5A6F82] leading-relaxed max-w-lg mx-auto">
              A partir das informações fictícias da Pesquisa Vivendo Mais, preparamos um retrato demonstrativo do seu momento atual.
            </p>

            <div className="p-4 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-xs text-[#163A63] text-left max-w-lg mx-auto space-y-1.5">
              <p className="font-semibold text-[#164E7A]">🌱 Um convite para reflexão:</p>
              <p className="text-[11px] text-[#5A6F82] leading-relaxed">
                Este retrato não define quem você é. Ele é um convite para reconhecer fortalezas, perceber aspectos que podem merecer atenção e descobrir possibilidades que façam sentido para você.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto"
              >
                <span>CONHECER MEU VIVER MAIS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Fortalezas */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#0A7D76] font-extrabold bg-[#E6F7F6] px-3 py-1 rounded-full border border-[#B4EBE6]">
                SUAS POTÊNCIAS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163A63]">
                Veja algumas das suas fortalezas.
              </h2>
              <p className="text-xs text-[#5A6F82]">
                Áreas com alta estabilidade e recursos internos bem consolidados.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {strengths.slice(0, 3).map((item) => (
                <div
                  key={item.dimensionId}
                  className="p-4 bg-[#E6F7F6] rounded-2xl border border-[#B4EBE6] flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#0A7D76] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5 text-[#12B8AE]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#163A63]">{item.name}</h4>
                      <p className="text-[11px] text-[#0A7D76] font-medium">{item.highlightText}</p>
                    </div>
                  </div>
                  <div className="text-right pl-3 shrink-0">
                    <span className="text-xl font-black text-[#0A7D76]">{formatPercentage(item.score)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="px-7 py-3 bg-[#163A63] hover:bg-[#1E466F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <span>CONTINUAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Pontos de Atenção */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#164E7A] font-extrabold bg-[#EBF3FA] px-3 py-1 rounded-full border border-[#D9E4EE]">
                OPORTUNIDADES DE CUIDADO
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163A63]">
                Talvez valha olhar com um pouco mais de atenção para...
              </h2>
              <p className="text-xs text-[#5A6F82]">
                Aspectos que podem ser nutridos para trazer maior harmonia e vitalidade.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {attentions.slice(0, 3).map((item) => (
                <div
                  key={item.dimensionId}
                  className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF3F7] text-[#164E7A] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5 text-[#164E7A]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#163A63]">{item.name}</h4>
                      <p className="text-[11px] text-[#5A6F82]">{item.highlightText}</p>
                    </div>
                  </div>
                  <div className="text-right pl-3 shrink-0">
                    <span className="text-xl font-bold text-[#163A63]">{formatPercentage(item.score)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="px-7 py-3 bg-[#163A63] hover:bg-[#1E466F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <span>CONTINUAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: E o que podemos fazer a partir daqui? */}
        {step === 3 && (
          <div className="text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#12B8AE] text-[#163A63] flex items-center justify-center mx-auto text-2xl font-black">
              ✨
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#12B8AE] font-extrabold">
                PRÓXIMOS PASSOS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163A63]">
                E o que podemos fazer a partir daqui?
              </h2>
            </div>

            <p className="text-sm text-[#5A6F82] leading-relaxed max-w-lg mx-auto">
              O Viver Mais pode apresentar conteúdos, experiências e oportunidades que façam sentido para seu momento atual.
            </p>

            <div className="p-4 bg-[#EBF3FA] rounded-2xl border border-[#CAD8E6] text-xs text-[#164E7A] text-left max-w-lg mx-auto">
              <p className="font-bold mb-1">🎯 Protagonismo do associado:</p>
              <p className="text-[11px] text-[#2C3E50] leading-relaxed">
                Você escolhe o que quer experimentar, sem obrigações. Estaremos ao seu lado com parceiros selecionados como Maturi e Easy Live.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <span>IR PARA MEU VIVER MAIS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
