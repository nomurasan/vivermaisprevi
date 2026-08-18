import React from 'react';
import { useApp } from '../context/AppContext';
import { DIMENSIONS } from '../mock/dimensions';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const ProgramView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#164E7A] bg-[#EBF3FA] px-3.5 py-1.5 rounded-full border border-[#D9E4EE]">
          CONHEÇA O PROGRAMA
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163A63] font-serif">
          Viver Mais PREVI
        </h1>
        <p className="text-base sm:text-lg text-[#5A6F82] leading-relaxed">
          Mais que viver mais. Viver com saúde, segurança, propósito e boas conexões.
        </p>
      </div>

      {/* Institutional Mission & Vision */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-[#163A63]">
          A Nova Fronteira do Cuidado da PREVI
        </h2>
        <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed">
          Há mais de 120 anos, a PREVI cuida do futuro financeiro dos funcionários do Banco do Brasil e seus familiares. Com o aumento contínuo da expectativa de vida dos nossos associados — hoje superando a média nacional —, cuidar do futuro exige ir além do benefício financeiro.
        </p>
        <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed">
          O <strong>Viver Mais PREVI</strong> nasce como uma plataforma relacional e consultiva, desenhada para apoiar cada participante a viver a longevidade com autonomia, saúde integral, novos projetos e convívio social ativo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
            <h3 className="font-bold text-sm text-[#163A63] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#164E7A]" />
              <span>Compromisso com o Associado</span>
            </h3>
            <p className="text-xs text-[#5A6F82] leading-relaxed">
              O associado é sempre o protagonista de suas escolhas. A PREVI não impõe caminhos, mas ilumina possibilidades.
            </p>
          </div>

          <div className="p-5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
            <h3 className="font-bold text-sm text-[#163A63] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#0A7D76]" />
              <span>Ecossistema Qualificado</span>
            </h3>
            <p className="text-xs text-[#5A6F82] leading-relaxed">
              Curadoria criteriosa de parceiros especialistas (como Maturi, Easy Live, Sesc) com condições diferenciadas.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#163A63] text-center">
          Os 4 Pilares Estratégicos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-2xl border border-[#D9E4EE] space-y-2">
            <span className="text-xs font-bold text-[#12B8AE]">PILAR 1</span>
            <h3 className="font-bold text-sm text-[#163A63]">Compreensão Multidimensional</h3>
            <p className="text-xs text-[#5A6F82]">
              Avaliação contínua das 8 Áreas da Vida através da Pesquisa Vivendo Mais e do IBPL.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#D9E4EE] space-y-2">
            <span className="text-xs font-bold text-[#12B8AE]">PILAR 2</span>
            <h3 className="font-bold text-sm text-[#163A63]">Sensibilidade aos Momentos de Vida</h3>
            <p className="text-xs text-[#5A6F82]">
              Reconhecimento das diferentes fases: preparação, aposentadoria ativa, maturidade e suporte familiar.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#D9E4EE] space-y-2">
            <span className="text-xs font-bold text-[#12B8AE]">PILAR 3</span>
            <h3 className="font-bold text-sm text-[#163A63]">Soluções Práticas e Experiências</h3>
            <p className="text-xs text-[#5A6F82]">
              Acesso facilitado a serviços reais de desenvolvimento, saúde, cultura, viagens e networking.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#D9E4EE] space-y-2">
            <span className="text-xs font-bold text-[#12B8AE]">PILAR 4</span>
            <h3 className="font-bold text-sm text-[#163A63]">Inteligência e Evolução Contínua</h3>
            <p className="text-xs text-[#5A6F82]">
              Métricas agregadas que retroalimentam as políticas de benefícios e novas parcerias institucionais.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-[#163A63] text-white p-8 rounded-3xl text-center space-y-4">
        <h3 className="text-xl font-bold">Experimente o Protótipo Navegável</h3>
        <p className="text-xs text-[#D9E4EE] max-w-md mx-auto">
          Navegue pelas funcionalidades com os perfis simulados de Carlos, Marina e Roberto.
        </p>
        <button
          onClick={() => navigateTo('onboarding')}
          className="px-7 py-3 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2"
        >
          <span>ENTRAR NO MEU VIVER MAIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
