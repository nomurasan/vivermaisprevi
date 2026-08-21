import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getShortSurveyAxes } from '../mock/surveyQuestions';
import { canFinalizeSurvey } from '../services/surveyScoring';
import { SurveyAnswer } from '../types';

const AXES = getShortSurveyAxes();
const ENCOURAGEMENTS: Record<number, string> = { 2: 'Ótimo começo! Já concluímos o primeiro eixo. 🌟', 4: 'Você já percorreu 25% do caminho. Estamos construindo um retrato cada vez mais pessoal.', 6: 'Seus vínculos também fazem parte da longevidade. Obrigado por compartilhar.', 8: 'Já chegamos à metade! 🎉 Vamos lá, faltam apenas mais oito perguntas.', 10: 'Muito bem! Agora vamos falar sobre aquilo que traz leveza e prazer para sua rotina.', 12: 'Você já concluiu 75%! Seu Retrato de Longevidade está quase pronto. 🚀', 14: 'Falta muito pouco. Vamos olhar agora para o ambiente que acolhe a sua vida.', 15: 'Última pergunta! Depois dela, vou preparar seu Retrato. ✨' };

export const QuestionnaireView: React.FC = () => {
  const { surveyDraft, saveSurveyAnswer, completeSurvey, navigateTo } = useApp();
  const [index, setIndex] = useState(surveyDraft?.currentQuestionIndex || 0);
  const [typing, setTyping] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('Olá! 👋 Eu sou o PREVIX. Vamos conversar um pouco sobre como você está vivendo este momento?');
  const questionRef = useRef<HTMLHeadingElement>(null);
  const questions = useMemo(() => AXES.flatMap((axis) => axis.questions), []);
  const answers = Object.values(surveyDraft?.answers || {}) as SurveyAnswer[];
  const question = questions[index];
  const answered = answers.length;
  const selected = surveyDraft?.answers[question?.id];

  useEffect(() => {
    const element = questionRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [index]);

  if (!surveyDraft || !question) return null;
  const choose = (label: string, score: number | null) => {
    if (selected) return;
    const next = index + 1;
    saveSurveyAnswer(question.id, question.axisId, label, score, next);
    setMessage(''); setTyping(true);
    setTimeout(() => { setTyping(false); setMessage(ENCOURAGEMENTS[next] || 'Obrigado por compartilhar. Vamos seguir juntos.'); if (next < questions.length) setTimeout(() => setIndex(next), 300); }, 500);
  };
  const finish = () => { setProcessing(true); setMessage('Preparando seu Retrato…'); setTimeout(() => completeSurvey(), 800); };
  const progress = Math.round(answered / 16 * 100);
  const axisIndex = AXES.findIndex((axis) => axis.id === question.axisId);

  return <main className="px-4 py-6"><div className="max-w-2xl mx-auto flex flex-col gap-4">
    <header className="bg-white rounded-3xl border border-[#D9E4EE] p-5"><div className="flex items-center gap-3"><img src="/icone_previx_maior.png" alt="PREVIX" className="w-12 h-12 object-contain" /><div><h1 className="font-black text-[#163A63]">Construindo seu Retrato de Longevidade</h1><p className="text-xs text-[#5A6F82]">Aproximadamente 4 minutos</p></div></div><div className="mt-4 flex justify-between text-xs font-bold text-[#5A6F82]"><span>Pergunta {Math.min(answered + 1, 16)} de 16</span><span>{AXES[axisIndex].name} — eixo {axisIndex + 1} de 8</span></div><div role="progressbar" aria-valuemin={0} aria-valuemax={16} aria-valuenow={answered} aria-label={`${progress}% concluído`} className="mt-2 h-2 rounded-full bg-[#E6EEF4]"><div className="h-full rounded-full bg-[#12B8AE] transition-all" style={{ width: `${progress}%` }} /></div><p className="sr-only">{progress}% concluído</p></header>
    <section className="bg-[#F4F7FA] rounded-3xl p-5 mt-7 flex flex-col gap-5"><div className="flex justify-start"><div className="max-w-[88%] bg-white border border-[#D9E4EE] rounded-2xl rounded-tl-sm p-4 text-sm text-[#163A63]">{message || 'Vamos para a próxima pergunta.'}</div></div>{selected && <div className="flex justify-end"><div className="max-w-[78%] bg-[#163A63] text-white rounded-2xl rounded-tr-sm p-4 text-sm">{selected.optionLabel}</div></div>}{typing && <div className="text-xs text-[#5A6F82] italic">PREVIX está digitando…</div>}{!selected && !processing && <div className="flex flex-col gap-3"><h2 ref={questionRef} className="font-bold text-[#163A63]">{question.text}</h2><div className="grid gap-2">{question.options.map((option) => <button key={option.label} onClick={() => choose(option.label, option.score)} className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#D9E4EE] hover:border-[#12B8AE] hover:bg-[#E6F7F6] font-medium transition">{option.label}</button>)}</div></div>}</section>
    {selected && index >= questions.length - 1 && <button disabled={processing || !canFinalizeSurvey(answers)} onClick={finish} className="w-full py-3 rounded-xl bg-[#12B8AE] text-[#163A63] font-black disabled:opacity-50">Finalizar e ver meu Retrato</button>}
    <div className="flex justify-between items-center"><button onClick={() => index > 0 ? setIndex(index - 1) : navigateTo('questionario_intro')} className="text-xs font-bold text-[#164E7A]">Voltar</button><button onClick={() => navigateTo('meu_viver_mais', 'gda')} className="text-xs font-bold text-[#164E7A]">Sair e continuar depois</button></div>
  </div></main>;
};
