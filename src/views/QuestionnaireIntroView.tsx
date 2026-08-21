import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const QuestionnaireIntroView: React.FC = () => {
  const { activeProfileId, currentParticipant, surveyDraft, startSurvey } = useApp();
  const [name, setName] = useState(surveyDraft?.displayName || currentParticipant.name);
  return <main className="min-h-[70vh] flex items-center justify-center px-4 py-10"><section className="max-w-2xl w-full bg-white rounded-3xl border border-[#D9E4EE] p-7 sm:p-10 shadow-sm space-y-6">
    <span className="text-xs font-black uppercase tracking-widest text-[#0A988F]">Vivendo Mais PREVI • Questionário demonstrativo</span>
    <h1 className="text-3xl font-black text-[#163A63]">Conheça seu retrato de longevidade</h1>
    <p className="text-[#5A6F82] leading-relaxed">Este resultado é demonstrativo e serve para reflexão pessoal. São 8 eixos, com 5 perguntas em cada um. Seus dados ficam somente neste navegador nesta demonstração.</p>
    <label className="block space-y-2"><span className="text-sm font-bold text-[#163A63]">Como você deseja ser chamado?</span><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[#D9E4EE] px-4 py-3 outline-none focus:border-[#12B8AE]" placeholder="Seu nome" /></label>
    <div className="flex flex-wrap gap-3"><button disabled={!name.trim()} onClick={() => startSurvey(name.trim())} className="px-5 py-3 rounded-xl bg-[#163A63] text-white font-bold disabled:opacity-50">Começar meu questionário</button>{surveyDraft && <button onClick={() => startSurvey(name.trim())} className="px-5 py-3 rounded-xl border border-[#12B8AE] text-[#0A7D76] font-bold">Continuar de onde parei</button>}</div>
    <p className="text-xs text-[#5A6F82]">Perfil ativo: {activeProfileId}. Você poderá voltar e continuar quando quiser.</p>
  </section></main>;
};
