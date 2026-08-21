import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPercentage } from '../utils/formatters';
import { Avatar } from '../components/Avatar';
import { DIMENSIONS } from '../mock/dimensions';
import { PROFILES } from '../mock/participants';
import { DimensionId } from '../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Compass,
  Users,
  Activity,
  Sun,
  Home,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Play,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigateTo, switchProfile, activeProfileId, currentParticipant } = useApp();
  const [selectedDimensionId, setSelectedDimensionId] = useState<DimensionId>('saude_fisica');

  const selectedDim = DIMENSIONS.find((d) => d.id === selectedDimensionId) || DIMENSIONS[0];

  const getDimensionIcon = (id: DimensionId) => {
    switch (id) {
      case 'saude_fisica':
        return <Activity className="w-5 h-5" />;
      case 'saude_emocional':
        return <Heart className="w-5 h-5" />;
      case 'relacionamentos':
        return <Users className="w-5 h-5" />;
      case 'trabalho_proposito':
        return <Compass className="w-5 h-5" />;
      case 'espiritualidade':
        return <Sun className="w-5 h-5" />;
      case 'lazer':
        return <Sparkles className="w-5 h-5" />;
      case 'recursos_financeiros':
        return <ShieldCheck className="w-5 h-5" />;
      case 'moradia':
        return <Home className="w-5 h-5" />;
    }
  };

  const steps = [
    { num: '1', title: 'Conhecemos Você', desc: 'Pesquisa Vivendo Mais PREVI' },
    { num: '2', title: 'Interpretamos', desc: 'Dados e regras metodológicas' },
    { num: '3', title: 'Seu Retrato', desc: 'Fortalezas e pontos de atenção' },
    { num: '4', title: 'Momentos de Vida', desc: 'Compreensão do contexto atual' },
    { num: '5', title: 'Possibilidades', desc: 'Conteúdos, parceiros e experiências' },
    { num: '6', title: 'Você Escolhe', desc: 'Protagonismo total do associado' },
    { num: '7', title: 'Acompanhamos', desc: 'Experiências, feedback e evolução' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#163A63] via-[#1E466F] to-[#163A63] text-white pt-16 pb-20 px-4 lg:px-8 overflow-hidden">
        {/* Subtle decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#12B8AE]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#164E7A]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12B8AE]/20 border border-[#12B8AE]/40 text-[#12B8AE] text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>PLATAFORMA VIVER MAIS PREVI • PROTÓTIPO V1</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif max-w-4xl mx-auto">
            Mais que viver mais.
            <span className="block text-[#12B8AE] font-sans font-bold mt-1">
              Viver com saúde, segurança, propósito e boas conexões.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#D9E4EE] max-w-3xl mx-auto leading-relaxed">
            O Viver Mais PREVI busca compreender diferentes momentos da vida dos associados para apoiar escolhas que contribuam para uma longevidade com mais qualidade de vida.
          </p>

          {/* Central Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigateTo('onboarding')}
              className="px-7 py-3.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 group"
            >
              <span>ENTRAR NO MEU VIVER MAIS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigateTo('como_funciona')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl border border-white/20 transition-colors"
            >
              VEJA COMO FUNCIONA
            </button>

            <button
              onClick={() => navigateTo('programa')}
              className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#D9E4EE] hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors"
            >
              CONHEÇA O PROGRAMA
            </button>
          </div>

          {/* Message Central */}
          <div className="pt-6 border-t border-white/10 max-w-lg mx-auto">
            <p className="text-sm font-semibold text-[#12B8AE] tracking-wide italic">
              "Conhecer melhor para cuidar melhor."
            </p>
          </div>
        </div>
      </section>

      {/* 2. UMA NOVA VISÃO SOBRE LONGEVIDADE */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest text-[#164E7A] font-extrabold">
            EVOLUÇÃO DA RELAÇÃO PREVI
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163A63] tracking-tight">
            Seu futuro não é feito apenas de números.
          </h2>
          <p className="text-sm text-[#5A6F82] leading-relaxed">
            A segurança previdenciária continua sendo nosso compromisso fundamental. O Viver Mais expande essa proteção para todas as dimensões da longevidade.
          </p>
        </div>

        {/* The Equation Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* SEGURANÇA PREVIDENCIÁRIA */}
          <div className="md:col-span-5 bg-white p-7 rounded-3xl border border-[#D9E4EE] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FA] text-[#164E7A] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#163A63]">
                  SEGURANÇA PREVIDENCIÁRIA
                </h3>
                <span className="text-xs text-[#5A6F82]">Compromisso histórico da PREVI</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-[#2C3E50] pt-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#164E7A]" />
                Patrimônio e solvência dos planos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#164E7A]" />
                Contribuições e benefícios regulares
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#164E7A]" />
                Planejamento e estabilidade financeira
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#164E7A]" />
                Segurança econômica para você e sua família
              </li>
            </ul>
          </div>

          {/* Plus Sign */}
          <div className="md:col-span-1 text-center font-black text-2xl text-[#12B8AE] flex justify-center py-2">
            <span className="w-10 h-10 rounded-full bg-[#E6F7F6] flex items-center justify-center border border-[#B4EBE6]">
              +
            </span>
          </div>

          {/* QUALIDADE DE VIDA */}
          <div className="md:col-span-5 bg-white p-7 rounded-3xl border border-[#D9E4EE] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#0A7D76] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#163A63]">
                  QUALIDADE DE VIDA
                </h3>
                <span className="text-xs text-[#5A6F82]">Dimensões do bem-estar diário</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-[#2C3E50] pt-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#12B8AE]" />
                Saúde física, emocional e autonomia
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#12B8AE]" />
                Relacionamentos, família e pertencimento
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#12B8AE]" />
                Propósito, novas carreiras e voluntariado
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#12B8AE]" />
                Lazer, cultura, viagens e moradia acolhedora
              </li>
            </ul>
          </div>
        </div>

        {/* Equals Result Banner */}
        <div className="mt-6 bg-[#163A63] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-[#12B8AE]">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs text-[#12B8AE] font-bold uppercase tracking-wider">
              RESULTADO
            </span>
            <p className="text-base font-bold text-white">
              VIVER MAIS PREVI: Um ecossistema inteligente de longevidade centrado no associado.
            </p>
          </div>
          <button
            onClick={() => navigateTo('meu_viver_mais')}
            className="px-5 py-2.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-bold text-xs rounded-xl shrink-0 transition-colors"
          >
            EXPERIMENTAR AGORA
          </button>
        </div>

        {/* NOVA EXPERIÊNCIA: DESAPOSENTE SUA REDE */}
        <div className="mt-6 bg-gradient-to-r from-[#164E7A] to-[#163A63] text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-[#12B8AE]/30">
          <div className="space-y-2 text-center sm:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-bold uppercase tracking-wider">
              <span>Solidão, aqui não! • Novidade</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              DESAPOSENTE SUA REDE
            </h3>
            <p className="text-xs sm:text-sm text-[#D9E4EE] leading-relaxed">
              Pessoas, histórias, interesses e novas experiências esperando para se conectar com você. Conecte-se com antigos colegas do BB/PREVI e associados com os mesmos hobbies.
            </p>
          </div>
          <button
            onClick={() => navigateTo('desaposente_rede')}
            className="px-6 py-3 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-black text-xs uppercase tracking-wider rounded-xl shrink-0 shadow-md transition-all flex items-center gap-2"
          >
            <span>Conhecer a Rede</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. AS 8 ÁREAS DA VIDA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs uppercase tracking-widest text-[#164E7A] font-extrabold">
            BEM-ESTAR MULTIDIMENSIONAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163A63] tracking-tight">
            As 8 Áreas da Vida
          </h2>
          <p className="text-sm text-[#5A6F82]">
            A vida é multidimensional. Diferentes áreas podem se fortalecer ou exigir maior atenção conforme o momento que estamos vivendo.
          </p>
        </div>

        {/* 8 Dimension Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          {DIMENSIONS.map((dim) => {
            const isSelected = selectedDimensionId === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => setSelectedDimensionId(dim.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#12B8AE] shadow-md ring-2 ring-[#12B8AE]/20'
                    : 'bg-white border-[#D9E4EE] hover:border-[#CAD8E6] hover:bg-[#FAFBFD]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#12B8AE] text-white' : 'bg-[#EBF3FA] text-[#164E7A]'
                    }`}
                  >
                    {getDimensionIcon(dim.id)}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#12B8AE]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#163A63] leading-snug">
                    {dim.name}
                  </h4>
                  <p className="text-[11px] text-[#5A6F82] mt-1 line-clamp-2">
                    {dim.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Dimension Detail Box */}
        <div className="bg-[#FAFBFD] p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#163A63] text-[#12B8AE] flex items-center justify-center">
                {getDimensionIcon(selectedDim.id)}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#164E7A]">
                  Dimensão Selecionada
                </span>
                <h3 className="text-lg font-bold text-[#163A63]">{selectedDim.name}</h3>
              </div>
            </div>

            <p className="text-xs text-[#2C3E50] leading-relaxed">
              {selectedDim.description}
            </p>

            <div className="p-3.5 bg-white rounded-xl border border-[#D9E4EE] space-y-1">
              <span className="text-[11px] font-bold text-[#164E7A] block">
                💬 Pergunta para reflexão:
              </span>
              <p className="text-xs text-[#5A6F82] italic">
                "{selectedDim.guidingQuestion}"
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <button
              onClick={() => navigateTo('explorar')}
              className="px-5 py-2.5 bg-[#163A63] hover:bg-[#1E466F] text-white font-bold text-xs rounded-xl text-center transition-colors"
            >
              Ver Soluções desta Área
            </button>
            <button
              onClick={() => navigateTo('meu_viver_mais', 'retrato')}
              className="px-5 py-2.5 bg-white hover:bg-[#EEF3F7] text-[#164E7A] font-bold text-xs rounded-xl border border-[#D9E4EE] text-center transition-colors"
            >
              Ver no Meu Retrato
            </button>
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA (FLUXO DOS 7 PASSOS) */}
      <section className="bg-[#EEF3F7] py-16 px-4 lg:px-8 border-y border-[#D9E4EE]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#164E7A] font-extrabold">
              JORNADA DO ASSOCIADO
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163A63]">
              Como Funciona o Viver Mais
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6F82]">
              Do questionário ao acompanhamento: uma experiência fluida de descobertas e escolhas.
            </p>
          </div>

          {/* Steps Horizontal / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
            {steps.map((s, idx) => (
              <div
                key={s.num}
                className="bg-white p-4 rounded-2xl border border-[#D9E4EE] shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-full bg-[#163A63] text-[#12B8AE] flex items-center justify-center font-black text-xs">
                  {s.num}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A63] leading-snug">{s.title}</h4>
                  <p className="text-[11px] text-[#5A6F82] mt-1 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigateTo('como_funciona')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#164E7A] hover:text-[#0A988F] transition-colors"
            >
              <span>Entenda a metodologia completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. PERFIS DEMONSTRATIVOS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D9E4EE] shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#164E7A] font-extrabold">
                SIMULAÇÃO DE EXPERIÊNCIAS REAIS
              </span>
              <h2 className="text-2xl font-extrabold text-[#163A63] mt-1">
                Escolha um perfil demonstrativo
              </h2>
              <p className="text-xs text-[#5A6F82] mt-1">
                Ao selecionar, toda a plataforma atualiza instantaneamente scores, radar e recomendações.
              </p>
            </div>
            <div className="text-xs bg-[#E6F7F6] text-[#0A7D76] px-3.5 py-1.5 rounded-full font-bold border border-[#B4EBE6] shrink-0">
              Perfil Ativo: {currentParticipant.name.split(' ')[0]}
            </div>
          </div>

          {/* 3 Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.values(PROFILES).map((p) => {
              const isActive = activeProfileId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => switchProfile(p.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#FAFBFD] border-[#12B8AE] shadow-md ring-2 ring-[#12B8AE]/20'
                      : 'bg-white border-[#D9E4EE] hover:border-[#CAD8E6] hover:bg-[#F4F7FA]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Avatar
                        src={p.avatarUrl}
                        name={p.name}
                        size="lg"
                      />
                      <span className="text-xs font-black text-[#12B8AE] bg-[#E6F7F6] px-2.5 py-1 rounded-md border border-[#B4EBE6]">
                        IBPL {formatPercentage(p.ibpl)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-[#163A63]">{p.name}</h3>
                      <p className="text-xs text-[#5A6F82]">
                        {p.age} anos • {p.city} ({p.state})
                      </p>
                      <p className="text-xs font-semibold text-[#164E7A] mt-1">
                        {p.retirementStatus} ({p.planType})
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#D9E4EE] space-y-1 text-xs">
                      <span className="text-[10px] uppercase font-bold text-[#5A6F82]">
                        Momento de Vida
                      </span>
                      <p className="font-bold text-[#163A63]">
                        {p.lifeMomentId === 'aposentadoria_ativa'
                          ? 'Aposentadoria Ativa'
                          : p.lifeMomentId === 'pre_aposentadoria'
                          ? 'Preparação para Nova Fase'
                          : 'Longevidade Plena'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#EEF3F7] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#164E7A]">
                      {isActive ? '✓ Perfil Selecionado' : 'Simular este associado'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#12B8AE]" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigateTo('onboarding')}
              className="px-8 py-3 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              VER REVELAÇÃO DO RETRATO DESTE PERFIL
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
