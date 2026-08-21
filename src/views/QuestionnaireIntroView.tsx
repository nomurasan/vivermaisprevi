import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const QuestionnaireIntroView: React.FC = () => {
  const { currentParticipant, surveyDraft, startSurvey, navigateTo, restartSurvey } = useApp();
  const [name, setName] = useState(surveyDraft?.displayName || '');
  const hasDraft = Boolean(surveyDraft && Object.keys(surveyDraft.answers).length);
  return <main className="min-h-[70vh] flex items-center justify-center px-4 py-10"><section className="max-w-xl w-full bg-white rounded-3xl border border-[#D9E4EE] p-7 sm:p-9 shadow-sm space-y-6">
    <div className="flex items-center gap-3"><img src="/icone_previx_maior.png" alt="PREVIX" className="w-14 h-14 object-contain" /><div><p className="text-xs font-black uppercase tracking-widest text-[#0A988F]">PREVIX</p><h1 className="text-2xl font-black text-[#163A63]">Construindo seu Retrato de Longevidade</h1></div></div>
    <p className="text-[#5A6F82] leading-relaxed">Olá! 👋 Vamos conversar sobre como você está vivendo este momento? São 16 perguntas rápidas, uma de cada vez. Não existem respostas certas ou erradas.</p><p className="text-sm font-bold text-[#164E7A]">Aproximadamente 4 minutos • 8 eixos da sua vida</p>
    <label className="block space-y-2"><span className="text-sm font-bold text-[#163A63]">Como deseja ser chamado?</span><input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[#D9E4EE] px-4 py-3 outline-none focus:border-[#12B8AE]" placeholder={currentParticipant.name} /></label>
    {hasDraft && <div className="p-3 rounded-xl bg-[#E6F7F6] text-sm text-[#0A7D76]">Que bom ter você de volta! Podemos continuar de onde paramos.</div>}
    <div className="flex flex-wrap gap-3"><button disabled={!name.trim()} onClick={() => startSurvey(name.trim())} className="px-5 py-3 rounded-xl bg-[#163A63] text-white font-bold disabled:opacity-50">{hasDraft ? 'Continuar questionário' : 'Começar conversa'}</button>{hasDraft && <button onClick={() => { if (window.confirm('Recomeçar apagará apenas o rascunho deste questionário. Continuar?')) { restartSurvey(); navigateTo('questionario_intro'); } }} className="px-5 py-3 rounded-xl border border-[#D9E4EE] text-[#5A6F82] font-bold">Recomeçar</button>}<button onClick={() => navigateTo('meu_viver_mais', 'gda')} className="px-4 py-3 rounded-xl text-[#164E7A] font-bold">Sair e continuar depois</button></div>
  </section></main>;
};
