import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, Heart, HelpCircle, FileText, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setIsFeedbackModalOpen } = useApp();

  return (
    <footer className="bg-[#163A63] text-white pt-12 pb-8 border-t-4 border-[#12B8AE]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1E466F]">
          {/* Col 1: PREVI & Viver Mais Concept */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white px-2.5 py-1 rounded-lg shadow-xs flex items-center justify-center">
                <img
                  src="/previ.png"
                  alt="PREVI"
                  className="h-6 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Vivendo Mais PREVI
              </span>
            </div>
            <p className="text-xs text-[#D9E4EE] leading-relaxed">
              Ecossistema de longevidade ativa, bem-estar multidimensional e conexão com soluções pensadas para cada momento de vida.
            </p>
            <p className="text-xs font-semibold text-[#12B8AE] italic">
              "Conhecer melhor para cuidar melhor."
            </p>
          </div>

          {/* Col 2: Navegação Rápida */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#12B8AE] mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-[#D9E4EE]">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white hover:underline transition-colors">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('programa')} className="hover:text-white hover:underline transition-colors">
                  O Programa Viver Mais
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('como_funciona')} className="hover:text-white hover:underline transition-colors">
                  Como Funciona (7 Passos)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('meu_viver_mais')} className="hover:text-white hover:underline transition-colors">
                  Meu Viver Mais (Área do Associado)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('explorar')} className="hover:text-white hover:underline transition-colors">
                  Catálogo de Experiências
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Inteligência e Governança */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#12B8AE] mb-3">
              Gestão & Diretrizes
            </h4>
            <ul className="space-y-2 text-xs text-[#D9E4EE]">
              <li>
                <button onClick={() => navigateTo('inteligencia')} className="hover:text-white hover:underline transition-colors">
                  Inteligência de Longevidade
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacidade')} className="hover:text-white hover:underline transition-colors">
                  Privacidade e Governança
                </button>
              </li>
              <li>
                <button onClick={() => setIsFeedbackModalOpen(true)} className="text-[#12B8AE] font-bold hover:underline transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Avaliar este Protótipo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Aviso de Protótipo e Isenção */}
          <div className="bg-[#1E466F]/60 p-4 rounded-xl border border-[#1F5B89] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#12B8AE]">
              <Info className="w-4 h-4" />
              <span>Ambiente Demonstrativo V1</span>
            </div>
            <p className="text-[11px] text-[#D9E4EE] leading-relaxed">
              Este protótipo navegável destina-se exclusivamente à validação de conceitos com associados e gestores.
            </p>
            <p className="text-[10px] text-white/70">
              Todos os dados, perfis e cálculos são sintéticos e demonstrativos.
            </p>
          </div>
        </div>

        {/* Global Footer Mandatory Notice */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-[#D9E4EE]/90">
            <strong>Protótipo conceitual Viver Mais PREVI</strong> — dados fictícios e regras demonstrativas.
          </p>
          <div className="text-[11px] text-white/60 flex items-center gap-4">
            <span>PREVI • Caixa de Previdência dos Funcionários do Banco do Brasil</span>
            <span>Versão 1.0 (Protótipo Conceitual)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
