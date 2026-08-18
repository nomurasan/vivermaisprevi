import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Compass,
  Layers,
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const { navigateTo } = useApp();

  const fullSteps = [
    {
      step: '1',
      title: 'Conhecemos Você',
      subtitle: 'Pesquisa Vivendo Mais PREVI',
      desc: 'Um questionário simples e reflexivo aplicado periodicamente aos associados, abordando hábitos, sentimentos, projetos e rotinas.',
    },
    {
      step: '2',
      title: 'Interpretamos com Rigor Metodológico',
      subtitle: 'Cálculo do IBPL e Dimensões',
      desc: 'Os dados são organizados nas 8 Áreas da Vida e no Índice do Bem-Estar PREVI para a Longevidade (IBPL), ponderados sem foco punitivo.',
    },
    {
      step: '3',
      title: 'Apresentamos Seu Retrato',
      subtitle: 'Fortalezas e Pontos de Cuidado',
      desc: 'Você visualiza seu mapa em formato de teia (radar), reconhecendo de imediato seus pontos fortes e as áreas que podem merecer atenção.',
    },
    {
      step: '4',
      title: 'Reconhecemos Seu Momento de Vida',
      subtitle: 'Contextualização da Fase Atual',
      desc: 'Entendemos se você está se preparando para aposentar, se já está na fase ativa ou buscando novas formas de contribuição e cuidados.',
    },
    {
      step: '5',
      title: 'Conectamos Possibilidades',
      subtitle: 'Ecossistema de Parceiros Qualificados',
      desc: 'Sugerimos experiências, cursos (Maturi), momentos de lazer (Easy Live), atividades físicas e redes de relacionamento que combinam com seu perfil.',
    },
    {
      step: '6',
      title: 'Você Decide o Que Fazer',
      subtitle: 'Protagonismo e Escolha Consciente',
      desc: 'Você salva no Meu Plano somente o que desejar. Nenhum caminho é imposto ou obrigatório.',
    },
    {
      step: '7',
      title: 'Acompanhamos sua Evolução',
      subtitle: 'Feedbacks e Aperfeiçoamento Contínuo',
      desc: 'Ao concluir atividades, seu relato nos ajuda a aprimorar as recomendações futuras e enriquecer os dados estratégicos da PREVI.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#164E7A] bg-[#EBF3FA] px-3.5 py-1.5 rounded-full border border-[#D9E4EE]">
          METODOLOGIA E JORNADA
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163A63] font-serif">
          Como Funciona o Viver Mais
        </h1>
        <p className="text-base text-[#5A6F82] leading-relaxed">
          Do preenchimento reflexivo ao acompanhamento: uma jornada circular criada para respeitar o ritmo de cada associado.
        </p>
      </div>

      {/* 7 Detailed Steps Accordion/Cards */}
      <div className="space-y-4">
        {fullSteps.map((s) => (
          <div
            key={s.step}
            className="bg-white p-6 sm:p-7 rounded-3xl border border-[#D9E4EE] shadow-xs flex flex-col sm:flex-row items-start gap-5 hover:border-[#12B8AE] transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#163A63] text-[#12B8AE] flex items-center justify-center font-black text-lg shrink-0">
              {s.step}
            </div>
            <div className="space-y-1 flex-1">
              <span className="text-[11px] font-bold text-[#12B8AE] uppercase tracking-wider">
                {s.subtitle}
              </span>
              <h3 className="font-bold text-base text-[#163A63]">{s.title}</h3>
              <p className="text-xs text-[#5A6F82] leading-relaxed pt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Concept Disclaimer */}
      <div className="p-6 bg-[#FAFBFD] rounded-3xl border border-[#D9E4EE] space-y-2">
        <h4 className="font-bold text-xs text-[#163A63] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#164E7A]" />
          <span>Esclarecimento sobre a Versão Demonstrativa (Protótipo V1)</span>
        </h4>
        <p className="text-xs text-[#5A6F82] leading-relaxed">
          Os dados, perfis de associados, pontuações do IBPL e catálogos apresentados neste ambiente são conceituais e fictícios, criados exclusivamente para validação de navegabilidade, relevância e experiência do usuário.
        </p>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => navigateTo('onboarding')}
          className="px-8 py-3.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>VER DEMONSTRAÇÃO PRÁTICA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
