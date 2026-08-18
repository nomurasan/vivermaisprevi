import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  PieChart as PieChartIcon,
  BarChart3,
  Percent,
  Layers,
  Sparkles,
  ArrowUpRight,
  Landmark,
  Building,
  Coins,
  CheckCircle2,
  Calendar,
  AlertCircle,
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

export const DifinInvestmentsDashboard: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'todos' | 'plano1' | 'previfuturo'>('todos');

  // Asset allocation of PREVI retirees
  const ASSET_ALLOCATION = [
    { name: 'Renda Fixa & Títulos Públicos (NTN-B/LFT)', value: 45.2, amount: 'R$ 6,68 Bi', color: '#163A63' },
    { name: 'Previdência Complementar PREVI', value: 26.8, amount: 'R$ 3,96 Bi', color: '#12B8AE' },
    { name: 'Fundos Imobiliários (FIIs) / Renda Mensal', value: 11.5, amount: 'R$ 1,70 Bi', color: '#27AE60' },
    { name: 'Ações de Dividendos & Empresas Sólidas', value: 9.4, amount: 'R$ 1,39 Bi', color: '#E67E22' },
    { name: 'CDBs / LCIs / LCAs Banco do Brasil', value: 4.7, amount: 'R$ 0,69 Bi', color: '#3498DB' },
    { name: 'Reserva de Liquidez Imediata (DI)', value: 2.4, amount: 'R$ 0,35 Bi', color: '#9B59B6' },
  ];

  // Investor risk profile distribution
  const RISK_PROFILES = [
    { profile: 'Conservador', share: 64.2, desc: 'Foco total em preservação de capital e fluxo de renda estável' },
    { profile: 'Moderado', share: 27.6, desc: 'Equilíbrio entre renda passiva e proteção inflacionária (IPCA+)' },
    { profile: 'Arrojado', share: 8.2, desc: 'Busca de crescimento patrimonial de longo prazo e legado familiar' },
  ];

  // Comparative Returns: Portfolios vs Actuarial Benchmark vs CDI (5-year accumulated)
  const PERFORMANCE_DATA = [
    { year: '2020', carteiraAposentado: 9.8, metaAtuarial: 8.4, cdi: 2.8 },
    { year: '2021', carteiraAposentado: 12.1, metaAtuarial: 11.2, cdi: 4.4 },
    { year: '2022', carteiraAposentado: 14.5, metaAtuarial: 12.8, cdi: 12.4 },
    { year: '2023', carteiraAposentado: 13.9, metaAtuarial: 11.5, cdi: 13.0 },
    { year: '2024 (Acum)', carteiraAposentado: 11.8, metaAtuarial: 9.8, cdi: 10.5 },
  ];

  // Empréstimo Simples (ES) & Financiamento Imobiliário Usage Distribution
  const CREDIT_USAGE = [
    { reason: 'Reformas de Acessibilidade & Adaptação do Lar', percentage: 42.0, color: '#12B8AE' },
    { reason: 'Apoio e Suporte Financeiro a Filhos / Netos', percentage: 28.0, color: '#164E7A' },
    { reason: 'Viagens dos Sonhos, Turismo & Comemorações', percentage: 18.0, color: '#E67E22' },
    { reason: 'Saúde Emergencial & Procedimentos Médicos', percentage: 12.0, color: '#27AE60' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#163A63] via-[#1F3A52] to-[#0D233A] text-white p-7 sm:p-8 rounded-3xl shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-black uppercase tracking-wider">
          <Landmark className="w-4 h-4 text-[#12B8AE]" />
          <span>DIFIN • DIRETORIA DE INVESTIMENTOS E FINANÇAS PREVI</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Painel DIFIN: Aplicações & Investimentos dos Aposentados
            </h2>
            <p className="text-xs sm:text-sm text-[#B4EBE6] max-w-3xl leading-relaxed mt-1">
              Visão consolidada do patrimônio financeiro sob custódia, alocação de ativos, perfil de risco, rentabilidade real e linhas de crédito sustentáveis da PREVI.
            </p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#B4EBE6] block">
              Patrimônio Mapeado DIFIN
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">R$ 14,8 Bi</span>
            <span className="text-[10px] text-[#B4EBE6] block">em investimentos dos aposentados</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Alocação em Renda Fixa
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#163A63]">72.0%</span>
            <span className="text-xs text-[#5A6F82]">Total RF + PREVI</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">Segurança e previsibilidade</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Perfil Conservador
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#12B8AE]">64.2%</span>
            <span className="text-xs text-[#0A7D76] font-bold">maioria absoluta</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">Foco em renda passiva mensal</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Adimplência ES PREVI
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#27AE60]">99.6%</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">Crédito consignado seguro</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Rentabilidade vs Meta
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E67E22]">+2.0%</span>
            <span className="text-xs text-[#164E7A] font-bold">acima da meta atuarial</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">Média consolidada 5 anos</p>
        </div>
      </div>

      {/* Grid 1: Asset Allocation & Risk Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Asset Allocation */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-5">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              ALOCAÇÃO DA CARTEIRA
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Onde Estão os Recursos dos Aposentados
            </h3>
            <p className="text-xs text-[#5A6F82]">
              Composição das aplicações financeiras e reservas mapeadas pela DIFIN
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {ASSET_ALLOCATION.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-[#163A63]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#5A6F82] font-medium">{item.amount}</span>
                    <span className="font-black text-[#163A63] w-12 text-right">{item.value}%</span>
                  </div>
                </div>
                <div className="w-full bg-[#EEF3F7] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value * 2.1}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Risk Profile Cards */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              PERFIL DE RISCO
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Distribuição por Perfil do Investidor
            </h3>
            <p className="text-xs text-[#5A6F82]">
              Classificação API (Análise de Perfil do Investidor) registrada
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {RISK_PROFILES.map((p, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#163A63]">{p.profile}</span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]">
                    {p.share}%
                  </span>
                </div>
                <p className="text-xs text-[#5A6F82]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 2: Performance vs Benchmarks */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              RENTABILIDADE CONSOLIDADA (% AO ANO)
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Carteira dos Aposentados vs Meta Atuarial PREVI vs CDI
            </h3>
          </div>
          <div className="text-xs text-[#5A6F82] font-semibold">
            Série histórica 2020 - 2024
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F7" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#163A63', fontWeight: 700 }} />
              <YAxis domain={[0, 18]} tick={{ fontSize: 10, fill: '#5A6F82' }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="carteiraAposentado" name="Carteira dos Aposentados (%)" fill="#12B8AE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="metaAtuarial" name="Meta Atuarial PREVI (IPCA + taxa) (%)" fill="#163A63" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cdi" name="CDI (%)" fill="#CAD8E6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid 3: Empréstimo Simples ES e Finalidade */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-5">
        <div className="border-b border-[#EEF3F7] pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
            CRÉDITO SUSTENTÁVEL • EMPRÉSTIMO SIMPLES (ES) & FINANCIAMENTO IMOBILIÁRIO (FINOB)
          </span>
          <h3 className="text-lg font-black text-[#163A63] mt-0.5">
            Destinação Declarada do Crédito PREVI pelos Aposentados
          </h3>
          <p className="text-xs text-[#5A6F82]">
            O crédito consignado da PREVI tem juros justos e é predominantemente investido na segurança do lar e bem-estar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {CREDIT_USAGE.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span
                  className="text-2xl font-black block"
                  style={{ color: item.color }}
                >
                  {item.percentage}%
                </span>
                <h4 className="font-extrabold text-xs text-[#163A63] leading-snug">
                  {item.reason}
                </h4>
              </div>
              <div className="w-full bg-[#EEF3F7] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percentage * 2}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
