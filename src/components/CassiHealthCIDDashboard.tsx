import React, { useState } from 'react';
import {
  Activity,
  Heart,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Stethoscope,
  Hospital,
  Sparkles,
  Users,
  FileText,
  Filter,
  ArrowDownRight,
  Pill,
  Smile,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export const CassiHealthCIDDashboard: React.FC = () => {
  const [selectedCIDGroup, setSelectedCIDGroup] = useState<string>('todos');

  // Top CID-10 Groups prevalent among PREVI retirees according to CASSI claims & health records
  const TOP_CID_DIAGNOSES = [
    {
      cid: 'CID I10 / I25',
      name: 'Aparelho Circulatório (Hipertensão & Cardiopatias)',
      prevalence: 58.4,
      totalAposentados: 72910,
      sinistralidadeMedia: 'R$ 412 / mês',
      prevencao: 'Caminhadas diárias, controle de sódio, aferição periódica',
      color: '#E74C3C',
    },
    {
      cid: 'CID E11 / E78',
      name: 'Endócrino & Metabólico (Diabetes & Dislipidemia)',
      prevalence: 39.2,
      totalAposentados: 48940,
      sinistralidadeMedia: 'R$ 295 / mês',
      prevencao: 'Alimentação de baixo índice glicêmico e acompanhamento nutricional',
      color: '#E67E22',
    },
    {
      cid: 'CID M15 / M81',
      name: 'Osteomuscular & Articular (Artrose & Osteoporose)',
      prevalence: 34.7,
      totalAposentados: 43320,
      sinistralidadeMedia: 'R$ 260 / mês',
      prevencao: 'Musculação adaptada, pilates, hidroginástica e banho de sol matinal',
      color: '#F39C12',
    },
    {
      cid: 'CID F32 / F41',
      name: 'Saúde Mental & Afetiva (Depressão & Ansiedade)',
      prevalence: 26.1,
      totalAposentados: 32580,
      sinistralidadeMedia: 'R$ 380 / mês',
      prevencao: 'Redes de convivência, voluntariado, desaposentação e psicoterapia',
      color: '#9B59B6',
    },
    {
      cid: 'CID H25 / H40',
      name: 'Oftalmológico & Sensorial (Catarata & Glaucoma)',
      prevalence: 22.5,
      totalAposentados: 28090,
      sinistralidadeMedia: 'R$ 190 / mês',
      prevencao: 'Consultas oftalmológicas anuais e mapeamento de retina',
      color: '#3498DB',
    },
    {
      cid: 'CID G30 / F03',
      name: 'Neurocognitivo (Demências & Perda de Memória)',
      prevalence: 8.4,
      totalAposentados: 10480,
      sinistralidadeMedia: 'R$ 540 / mês',
      prevencao: 'Estímulo cognitivo contínuo, leitura, jogos mentais e idiomas',
      color: '#16A085',
    },
  ];

  // Correlation: IBPL Longevity Level vs CASSI Health Plan Cost & Hospitalizations
  const CASSI_IBPL_CORRELATION = [
    {
      faixa: 'IBPL < 50 (Crítico)',
      custoPerCapita: 1840,
      internacoesPor100: 3.8,
      consultasProntoSocorro: 5.2,
      adesaoPreventiva: 18,
    },
    {
      faixa: 'IBPL 50-69 (Atenção)',
      custoPerCapita: 1320,
      internacoesPor100: 2.1,
      consultasProntoSocorro: 3.4,
      adesaoPreventiva: 42,
    },
    {
      faixa: 'IBPL 70-84 (Bom)',
      custoPerCapita: 980,
      internacoesPor100: 1.2,
      consultasProntoSocorro: 1.8,
      adesaoPreventiva: 74,
    },
    {
      faixa: 'IBPL 85-100 (Excelente)',
      custoPerCapita: 740,
      internacoesPor100: 0.6,
      consultasProntoSocorro: 0.9,
      adesaoPreventiva: 91,
    },
  ];

  // Preventative programs from CASSI
  const CASSI_PREVENTIVE_PROGRAMS = [
    {
      name: 'Estratégia Saúde da Família (ESF CASSI)',
      coverage: 76.4,
      impact: 'Redução de 34% em internações sensíveis à atenção primária',
      enrolled: '95.200 vidas',
    },
    {
      name: 'Programa de Gerenciamento de Crônicos (Hiperdia)',
      coverage: 68.2,
      impact: 'Adesão medicamentosa acima de 88% e controle de pressão arterial',
      enrolled: '64.800 vidas',
    },
    {
      name: 'Telemedicina CASSI 24h & Pronto Atendimento Virtual',
      coverage: 54.9,
      impact: 'Resolução de 82% das queixas sem ida a pronto-socorro físico',
      enrolled: '48.300 atendimentos / ano',
    },
    {
      name: 'Campanha de Imunização Geriátrica Preventiva',
      coverage: 89.1,
      impact: 'Queda de 52% em complicações respiratórias no inverno',
      enrolled: '111.000 doses aplicadas',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#163A63] via-[#0E524D] to-[#0A7D76] text-white p-7 sm:p-8 rounded-3xl shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-black uppercase tracking-wider">
          <Activity className="w-4 h-4 text-[#12B8AE]" />
          <span>INTEGRAÇÃO CASSI • SAÚDE PREVENTIVA & MAPEAMENTO DE CIDs</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Painel de Saúde do Aposentado (CASSI + CID)
            </h2>
            <p className="text-xs sm:text-sm text-[#B4EBE6] max-w-3xl leading-relaxed mt-1">
              Monitoramento dos principais diagnósticos clínicos (CIDs), taxa de sinistralidade do plano CASSI e o impacto comprovado da longevidade ativa na redução de custos e internações.
            </p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#B4EBE6] block">
              Economia Assistencial CASSI
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">-38%</span>
            <span className="text-[10px] text-[#B4EBE6] block">em associados no Viver Mais</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Prevalência Cardiovascular
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E74C3C]">58.4%</span>
            <span className="text-xs text-[#5A6F82]">CID I10 / I25</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">72.910 associados acompanhados</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Queda em Internações
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#12B8AE]">-68%</span>
            <span className="text-xs text-[#0A7D76] font-bold">no IBPL Alto vs Baixo</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">0.6 vs 3.8 internações / 100 vidas</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Cobertura ESF CASSI
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#163A63]">76.4%</span>
            <span className="text-xs text-[#12B8AE] font-bold">Saúde da Família</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">95.200 associados vinculados</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Adesão à Vacinação
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#27AE60]">89.1%</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">Campanhas preventivas anuais</p>
        </div>
      </div>

      {/* Grid 1: Ranking of CID Prevalences */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              DIAGNÓSTICOS E GRUPOS DE CIDs MAIS FREQUENTES (BASE CASSI PREVI)
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Prevalência de Condições Crônicas e Ações Preventivas Recomendadas
            </h3>
          </div>
          <div className="text-xs text-[#5A6F82] font-semibold">
            Base ativa: 124.800 vidas
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {TOP_CID_DIAGNOSES.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.cid}
                  </span>
                  <span className="text-xs font-black text-[#163A63]">
                    {item.prevalence}% da base
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-[#163A63] leading-snug">
                  {item.name}
                </h4>
                <p className="text-[11px] text-[#5A6F82]">
                  {item.totalAposentados.toLocaleString()} associados diagnosticados • Custo médio {item.sinistralidadeMedia}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E1EBF2] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#0A7D76] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#12B8AE]" />
                  <span>Ação Preventiva Viver Mais:</span>
                </span>
                <p className="text-[11px] text-[#2C3E50] leading-tight">
                  {item.prevencao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid 2: Correlation Chart: IBPL vs CASSI Cost & Hospitalizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cost Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
          <div className="border-b border-[#EEF3F7] pb-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              CORRELAÇÃO CLÍNICO-FINANCEIRA
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Custo Assistencial Per Capita CASSI (R$/mês) por Faixa do IBPL
            </h3>
            <p className="text-xs text-[#5A6F82]">
              Maior pontuação na longevidade multidimensional gera expressiva queda na sinistralidade médica
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASSI_IBPL_CORRELATION} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F7" />
                <XAxis dataKey="faixa" tick={{ fontSize: 10, fill: '#163A63', fontWeight: 700 }} />
                <YAxis domain={[0, 2200]} tick={{ fontSize: 10, fill: '#5A6F82' }} />
                <RechartsTooltip />
                <Bar dataKey="custoPerCapita" name="Custo CASSI (R$/mês)" fill="#12B8AE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-[#FAFBFD] rounded-xl border border-[#D9E4EE] text-xs text-[#5A6F82] flex items-center justify-between">
            <span>Redução de <strong>R$ 1.840</strong> para <strong>R$ 740</strong> / mês</span>
            <span className="font-bold text-[#0A7D76]">-59.7% no custo máximo</span>
          </div>
        </div>

        {/* Right: Preventative CASSI Programs */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              PROGRAMAS PREVENTIVOS CASSI
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Adesão e Efetividade Clínica
            </h3>
            <p className="text-xs text-[#5A6F82]">
              Iniciativas de cuidado continuado integradas ao Vivendo Mais
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {CASSI_PREVENTIVE_PROGRAMS.map((prog, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#163A63]">{prog.name}</span>
                  <span className="font-black text-[#12B8AE]">{prog.coverage}%</span>
                </div>
                <div className="w-full bg-[#EEF3F7] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#12B8AE] rounded-full"
                    style={{ width: `${prog.coverage}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#5A6F82]">{prog.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
