import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, UserCheck } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#164E7A] bg-[#EBF3FA] px-3.5 py-1.5 rounded-full border border-[#D9E4EE]">
          GOVERNANÇA & ÉTICA
        </span>
        <h1 className="text-3xl font-extrabold text-[#163A63] font-serif">
          Privacidade e Segurança dos Seus Dados
        </h1>
        <p className="text-sm text-[#5A6F82]">
          Transparência total sobre como tratamos suas informações no Viver Mais PREVI.
        </p>
      </div>

      {/* Main Commitments Grid */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#0A7D76] flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#163A63]">Nossos Compromissos Inegociáveis</h3>
            <p className="text-xs text-[#5A6F82]">Diretrizes éticas e de conformidade LGPD</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#12B8AE] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#163A63]">
                Seus dados pertencem exclusivamente a você
              </h4>
              <p className="text-xs text-[#5A6F82] mt-0.5">
                Suas respostas às pesquisas e preferências são utilizadas apenas para gerar seu retrato pessoal e recomendações customizadas.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#12B8AE] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#163A63]">
                A PREVI não comercializa suas informações
              </h4>
              <p className="text-xs text-[#5A6F82] mt-0.5">
                Nenhum dado pessoal ou de contato é vendido ou compartilhado com terceiros para fins comerciais não autorizados.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#12B8AE] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#163A63]">
                Isolamento estrito dos planos previdenciários
              </h4>
              <p className="text-xs text-[#5A6F82] mt-0.5">
                Suas respostas no Viver Mais e suas escolhas de experiências <strong>nunca</strong> afetam seus benefícios, direitos, cálculos ou pontuações previdenciárias.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#12B8AE] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#163A63]">
                Total autonomia e consentimento revogável
              </h4>
              <p className="text-xs text-[#5A6F82] mt-0.5">
                Você pode atualizar suas respostas, excluir itens salvos ou solicitar a exclusão de seu perfil consultivo a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
