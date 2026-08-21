import React from 'react';
import { SurveyQuestion } from '../../types';

export const QuestionCard: React.FC<{ question: SurveyQuestion; selected?: string; onSelect: (label: string, score: number | null) => void }> = ({ question, selected, onSelect }) => (
  <div className="bg-white p-5 rounded-2xl border border-[#D9E4EE] space-y-4">
    <h3 className="font-bold text-[#163A63] leading-relaxed">{question.text}</h3>
    <div className="grid gap-2">
      {question.options.map((option) => <button key={option.label} onClick={() => onSelect(option.label, option.score)} className={`text-left px-4 py-3 rounded-xl border text-sm transition ${selected === option.label ? 'bg-[#E6F7F6] border-[#12B8AE] text-[#0A7D76] font-bold' : 'border-[#D9E4EE] hover:border-[#12B8AE]'}`}>{option.label}</button>)}
    </div>
  </div>
);
