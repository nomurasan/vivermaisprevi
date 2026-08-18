import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  ShoppingBag,
  Heart,
  Plane,
  BookOpen,
  Home,
  Utensils,
  Calendar,
  Filter,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  DollarSign,
  PieChart as PieChartIcon,
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

export const ConsumerHabitsDashboard: React.FC = () => {
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('todos');
  const [filterCardType, setFilterCardType] = useState<string>('todos');

  // Distribution of credit card spending by category
  const SPENDING_CATEGORIES = [
    { name: 'Farmácia & Medicamentos', value: 24.8, amount: 'R$ 842 / mês', color: '#E67E22', icon: Heart },
    { name: 'Supermercado & Alimentação', value: 22.4, amount: 'R$ 760 / mês', color: '#164E7A', icon: Utensils },
    { name: 'Viagens, Hotéis & Turismo 50+', value: 16.5, amount: 'R$ 560 / mês', color: '#12B8AE', icon: Plane },
    { name: 'Saúde Suplementar & Clínicas', value: 13.2, amount: 'R$ 448 / mês', color: '#27AE60', icon: Heart },
    { name: 'Moradia, Reformas & Utilidades', value: 10.1, amount: 'R$ 343 / mês', color: '#34495E', icon: Home },
    { name: 'Lazer, Cultura & Gastronomia', value: 6.8, amount: 'R$ 231 / mês', color: '#9B59B6', icon: ShoppingBag },
    { name: 'Educação, Livros & Cursos', value: 3.8, amount: 'R$ 129 / mês', color: '#2980B9', icon: BookOpen },
    { name: 'Outros Serviços & Varejo', value: 2.4, amount: 'R$ 82 / mês', color: '#95A5A6', icon: CreditCard },
  ];

  // Pre vs Post Retirement Spending Shift
  const SHIFT_DATA = [
    { category: 'Farmácia & Saúde', pre: 11.2, pos: 24.8, diff: '+13.6%' },
    { category: 'Viagens & Turismo', pre: 7.5, pos: 16.5, diff: '+9.0%' },
    { category: 'Alimentação / Casa', pre: 16.0, pos: 22.4, diff: '+6.4%' },
    { category: 'Lazer & Cultura', pre: 4.2, pos: 6.8, diff: '+2.6%' },
    { category: 'Educação & Cursos', pre: 2.1, pos: 3.8, diff: '+1.7%' },
    { category: 'Vestuário Corporativo', pre: 14.5, pos: 3.2, diff: '-11.3%' },
    { category: 'Transporte Diário / Combustível', pre: 18.2, pos: 7.1, diff: '-11.1%' },
    { category: 'Almoço Fora / Dia de Trabalho', pre: 15.0, pos: 4.5, diff: '-10.5%' },
  ];

  // Monthly Seasonality Curve (12 months)
  const SEASONALITY_DATA = [
    { month: 'Jan', volume: 2980, viagens: 620, saude: 710 },
    { month: 'Fev', volume: 2840, viagens: 580, saude: 690 },
    { month: 'Mar', volume: 3100, viagens: 450, saude: 740 },
    { month: 'Abr', volume: 3050, viagens: 480, saude: 730 },
    { month: 'Mai', volume: 3380, viagens: 640, saude: 760 }, // Dia das Mães / Viagens pré-inverno
    { month: 'Jun', volume: 3250, viagens: 690, saude: 750 },
    { month: 'Jul', volume: 3620, viagens: 890, saude: 780 }, // Férias escolares com netos
    { month: 'Ago', volume: 3180, viagens: 510, saude: 770 },
    { month: 'Set', volume: 3290, viagens: 540, saude: 780 },
    { month: 'Out', volume: 3410, viagens: 590, saude: 790 },
    { month: 'Nov', volume: 4120, viagens: 950, saude: 820 }, // 1ª parcela 13º + Black Friday
    { month: 'Dez', volume: 4890, viagens: 1350, saude: 850 }, // 2ª parcela 13º + Festas
  ];

  // Correlation: IBPL score vs Spending on Active Longevity
  const IBPL_SPENDING_CORRELATION = [
    { faixaIBPL: 'IBPL < 50 (Crítico)', ticketMedioSaude: 1120, ticketMedioLazerCultura: 95, gastosViagemAnual: 1400 },
    { faixaIBPL: 'IBPL 50-69 (Atenção)', ticketMedioSaude: 910, ticketMedioLazerCultura: 210, gastosViagemAnual: 3200 },
    { faixaIBPL: 'IBPL 70-84 (Bom)', ticketMedioSaude: 740, ticketMedioLazerCultura: 420, gastosViagemAnual: 6800 },
    { faixaIBPL: 'IBPL 85-100 (Excelente)', ticketMedioSaude: 620, ticketMedioLazerCultura: 680, gastosViagemAnual: 11400 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#163A63] via-[#1A4570] to-[#164E7A] text-white p-7 sm:p-8 rounded-3xl shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-black uppercase tracking-wider">
          <CreditCard className="w-4 h-4 text-[#12B8AE]" />
          <span>INTELIGÊNCIA DE CONSUMO • BASE TRANSACIONADA OUROCARD & BB PREVI</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Hábitos de Consumo do Aposentado
            </h2>
            <p className="text-xs sm:text-sm text-[#B4EBE6] max-w-3xl leading-relaxed mt-1">
              Cruzamento de dados anônimos agregados de compras no cartão de crédito: entenda como a renda é alocada, a transição pós-carreira e o impacto dos gastos com bem-estar no IBPL.
            </p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#B4EBE6] block">
              Gasto Médio Mensal Cartão
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">R$ 3.395</span>
            <span className="text-[10px] text-[#B4EBE6] block">por associado ativo</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Farmácia & Medicamentos
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E67E22]">24.8%</span>
            <span className="text-xs text-[#5A6F82]">do total faturado</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">R$ 842 / mês por aposentado</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Viagens & Turismo 50+
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#12B8AE]">16.5%</span>
            <span className="text-xs text-[#0A7D76] font-bold">+9% pós-aposentadoria</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">R$ 560 / mês em média</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Pico no 13º Salário
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#163A63]">+44%</span>
            <span className="text-xs text-[#12B8AE] font-bold">em Nov/Dez</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">R$ 4.890 em Dezembro</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-1">
          <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
            Impacto no IBPL
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#27AE60]">+18.4 pts</span>
          </div>
          <p className="text-[11px] text-[#5A6F82]">em quem investe em lazer e viagens</p>
        </div>
      </div>

      {/* Grid 1: Category Distribution Pie & Bar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Shares */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-5">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              DISTRIBUIÇÃO DE GASTOS
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Onde o Aposentado PREVI Gasta no Cartão
            </h3>
            <p className="text-xs text-[#5A6F82]">
              Categorização automática das faturas consolidadas
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {SPENDING_CATEGORIES.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-bold text-[#163A63]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#5A6F82]">{cat.amount}</span>
                    <span className="font-black text-[#163A63] w-12 text-right">{cat.value}%</span>
                  </div>
                </div>
                <div className="w-full bg-[#EEF3F7] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.value * 3.5}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pre vs Post Retirement Shift */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-5">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              MUDANÇA DE COMPORTAMENTO
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Antes vs Depois da Aposentadoria
            </h3>
            <p className="text-xs text-[#5A6F82]">
              Variação percentual nas categorias de consumo após o encerramento do vínculo ativo
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {SHIFT_DATA.map((item, idx) => {
              const isPositive = item.diff.startsWith('+');
              return (
                <div
                  key={idx}
                  className="p-3 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#163A63]">{item.category}</span>
                    <div className="text-[11px] text-[#5A6F82]">
                      Pré: {item.pre}% ➔ Pós: {item.pos}%
                    </div>
                  </div>
                  <span
                    className={`font-black px-2.5 py-1 rounded-full text-xs flex items-center gap-1 ${
                      isPositive
                        ? 'bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]'
                        : 'bg-[#FFF3E6] text-[#E67E22] border border-[#FFE0B2]'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#12B8AE]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-[#E67E22]" />
                    )}
                    <span>{item.diff}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid 2: Sazonalidade ao Longo do Ano */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
              CURVA DE SAZONALIDADE MENSAL (R$ POR APOSENTADO)
            </span>
            <h3 className="text-lg font-black text-[#163A63] mt-0.5">
              Gastos Totais, Viagens e Gastos com Farmácia/Saúde por Mês
            </h3>
          </div>
          <div className="text-xs text-[#5A6F82] font-semibold">
            Base anualizada consolidada
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SEASONALITY_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F7" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#163A63', fontWeight: 700 }} />
              <YAxis domain={[0, 5200]} tick={{ fontSize: 10, fill: '#5A6F82' }} />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="volume"
                name="Fatura Média Total (R$)"
                stroke="#163A63"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="viagens"
                name="Viagens & Hotéis (R$)"
                stroke="#12B8AE"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="saude"
                name="Farmácia & Saúde (R$)"
                stroke="#E67E22"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-[#F4FBF9] rounded-2xl border border-[#B4EBE6] text-xs text-[#164E7A] flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#12B8AE] shrink-0 mt-0.5" />
          <div>
            <strong>Insight de Consumo Estratégico:</strong> Os meses de <strong>Novembro e Dezembro</strong> concentram o maior volume de compras impulsionados pelo adiantamento e liquidação do 13º salário, com forte alocação em pacotes turísticos (Turismo 50+), presentes para netos e reformas residenciais de acessibilidade.
          </div>
        </div>
      </div>

      {/* Grid 3: Cruzamento Consumo vs IBPL */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
        <div className="space-y-1 border-b border-[#EEF3F7] pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#164E7A] block">
            CRUZAMENTO: GASTOS EM LAZER/CULTURA vs SAÚDE REATIVA vs PONTUAÇÃO NO IBPL
          </span>
          <h3 className="text-lg font-black text-[#163A63]">
            A Relação entre Investimento em Qualidade de Vida e a Longevidade Ativa
          </h3>
          <p className="text-xs text-[#5A6F82]">
            Aposentados com maior IBPL direcionam proporcionalmente mais recursos para experiências enriquecedoras e menos para remédios de uso agudo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {IBPL_SPENDING_CORRELATION.map((row, i) => (
            <div key={i} className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-3">
              <span className="text-xs font-black text-[#163A63] block border-b border-[#EEF3F7] pb-2">
                {row.faixaIBPL}
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-[#5A6F82] block">Lazer & Cultura / Mês:</span>
                  <span className="font-black text-[#12B8AE] text-sm">
                    R$ {row.ticketMedioLazerCultura}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#5A6F82] block">Farmácia & Medicamentos:</span>
                  <span className="font-black text-[#E67E22] text-sm">
                    R$ {row.ticketMedioSaude}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#5A6F82] block">Viagens Anuais (Total):</span>
                  <span className="font-black text-[#163A63] text-sm">
                    R$ {row.gastosViagemAnual.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
