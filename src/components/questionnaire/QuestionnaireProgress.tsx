import React from 'react';

export const QuestionnaireProgress: React.FC<{ axis: number; totalAxes: number; answered: number; total: number }> = ({ axis, totalAxes, answered, total }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold text-[#5A6F82]"><span>Eixo {axis} de {totalAxes}</span><span>{answered} de {total} perguntas respondidas</span></div>
    <div className="h-2 rounded-full bg-[#E6EEF4]"><div className="h-full rounded-full bg-[#12B8AE] transition-all" style={{ width: `${Math.round(answered / total * 100)}%` }} /></div>
  </div>
);
