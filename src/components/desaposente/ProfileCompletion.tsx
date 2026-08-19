import React from 'react';

interface ProfileCompletionProps {
  percentage: number;
  remainingCount: number;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  percentage,
  remainingCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#D9E4EE] p-5 space-y-3">
      <h3 className="text-sm font-extrabold text-[#163A63]">
        Seu perfil esta {percentage}% pronto para novas conexoes
      </h3>
      <div className="w-full h-3 rounded-full bg-[#EEF3F7] overflow-hidden" aria-hidden>
        <div
          className="h-full bg-gradient-to-r from-[#12B8AE] to-[#0A988F] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-[#5A6F82]">
        {remainingCount > 0
          ? `Complete mais ${remainingCount} informacao(oes) para receber recomendacoes melhores.`
          : 'Perfil completo. Suas recomendacoes ja estao otimizadas.'}
      </p>
    </div>
  );
};
