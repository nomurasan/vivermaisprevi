import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DIMENSIONS } from '../mock/dimensions';
import { IBPLRegionalAxisMap } from '../components/IBPLRegionalAxisMap';
import { ConsumerHabitsDashboard } from '../components/ConsumerHabitsDashboard';
import { CassiHealthCIDDashboard } from '../components/CassiHealthCIDDashboard';
import { DifinInvestmentsDashboard } from '../components/DifinInvestmentsDashboard';
import {
  ECOSYSTEM_RANKINGS,
  DEMAND_SUPPLY_DATA,
  FUNNEL_STAGES,
  COVERAGE_MATRIX,
  EcosystemRankingItem,
} from '../mock/ecosystemMetrics';
import { STRATEGIC_INSIGHTS } from '../mock/insights';
import { PARTNERS } from '../mock/partners';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Building,
  Target,
  Sparkles,
  Filter,
  Layers,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Lightbulb,
  Award,
  MapPin,
  Trophy,
  PartyPopper,
  CreditCard,
  Activity,
  Landmark,
} from 'lucide-react';

export const InteligenciaView: React.FC = () => {
  const { prototypeFeedbacks } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'visao_geral'
    | 'habitos_consumo'
    | 'saude_cassi_cid'
    | 'difin_investimentos'
    | 'mapa_ibpl'
    | 'ecossistema'
    | 'rankings'
    | 'demanda_oferta'
    | 'cobertura'
    | 'parceiros'
    | 'insights'
    | 'validacao_v1'
  >('visao_geral');

  // Institutional interactive filters
  const [filterAge, setFilterAge] = useState('Todos');
  const [filterGender, setFilterGender] = useState('Todos');
  const [filterRegion, setFilterRegion] = useState('Todos');
  const [filterPlanStatus, setFilterPlanStatus] = useState('Todos');
  const [filterMoment, setFilterMoment] = useState('Todos');

  // Ranking sub-tabs: 4 separate ranking metrics
  const [rankingTab, setRankingTab] = useState<
    'procura' | 'utilizacao' | 'avaliacao' | 'impacto'
  >('procura');

  // Selected partner for partner dashboard
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('maturi');

  // Overall synthetic radar data for community
  const globalRadarData = [
    { dimension: 'Física', score: 74, fullName: 'Saúde Física' },
    { dimension: 'Emocional', score: 66, fullName: 'Saúde Emocional' },
    { dimension: 'Vínculos', score: 81, fullName: 'Relacionamentos' },
    { dimension: 'Propósito', score: 63, fullName: 'Trabalho e Propósito' },
    { dimension: 'Sentido', score: 72, fullName: 'Espiritualidade' },
    { dimension: 'Lazer', score: 68, fullName: 'Lazer e Cultura' },
    { dimension: 'Finanças', score: 71, fullName: 'Recursos Financeiros' },
    { dimension: 'Moradia', score: 79, fullName: 'Moradia e Ambiente' },
  ];

  // Age distribution data
  const ageDistributionData = [
    { range: '50-59 anos', ibpl: 71, associados: 3820 },
    { range: '60-69 anos', ibpl: 69, associados: 5410 },
    { range: '70-79 anos', ibpl: 67, associados: 2640 },
    { range: '80+ anos', ibpl: 65, associados: 616 },
  ];

  // Sort rankings according to sub-tab
  const sortedRankings = [...ECOSYSTEM_RANKINGS].sort((a, b) => {
    switch (rankingTab) {
      case 'procura':
        return b.views - a.views;
      case 'utilizacao':
        return b.uses - a.uses;
      case 'avaliacao':
        return b.rating - a.rating;
      case 'impacto':
        return b.perceivedImpact - a.perceivedImpact;
    }
  });

  const selectedPartner = PARTNERS.find((p) => p.id === selectedPartnerId) || PARTNERS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* 1. Header Institucional / Executivo */}
      <div className="bg-[#163A63] text-white rounded-3xl p-6 sm:p-8 shadow-md border-b-4 border-[#12B8AE] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#12B8AE]">
                VISÃO ESTRATÉGICA PREVI
              </span>
              <span className="text-[10px] bg-[#1E466F] text-[#D9E4EE] px-2.5 py-0.5 rounded-full border border-[#1F5B89]">
                Dados demonstrativos — protótipo
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Inteligência de Longevidade
            </h1>
            <p className="text-xs sm:text-sm text-[#D9E4EE]">
              Transformando dados em conhecimento para apoiar melhores decisões institucionais e personalização.
            </p>
          </div>
        </div>

        {/* 8 Metric KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-white block">12.486</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">Avaliados</span>
          </div>
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-[#12B8AE] block">68,4</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">IBPL Médio</span>
          </div>
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-white block">64%</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">Adequado/Alto</span>
          </div>
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-white block">23%</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">2+ Atenção</span>
          </div>
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-white block">8</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">Áreas da Vida</span>
          </div>
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-white block">36</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">Momentos</span>
          </div>
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-[#12B8AE] block">12</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">Parceiros</span>
          </div>
          <div className="bg-[#1E466F] p-3 rounded-2xl border border-[#1F5B89] text-center">
            <span className="text-lg sm:text-xl font-black text-white block">47</span>
            <span className="text-[10px] text-[#D9E4EE] font-semibold">Soluções</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Institutional Filters */}
      <div className="bg-white p-5 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#163A63] flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[#12B8AE]" />
            <span>Filtros Analíticos do Ecossistema</span>
          </span>
          <span className="text-[11px] text-[#5A6F82]">
            Simulação de segmentação em tempo real
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[#5A6F82] block mb-1">Faixa Etária</label>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63]"
            >
              <option value="Todos">Todas as Idades</option>
              <option value="50-59">50 a 59 anos</option>
              <option value="60-69">60 a 69 anos</option>
              <option value="70+">70 anos ou mais</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5A6F82] block mb-1">Região</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63]"
            >
              <option value="Todos">Brasil Inteiro</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Centro-Oeste">Centro-Oeste</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5A6F82] block mb-1">Situação</label>
            <select
              value={filterPlanStatus}
              onChange={(e) => setFilterPlanStatus(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63]"
            >
              <option value="Todos">Todas as Situações</option>
              <option value="Aposentado">Aposentados</option>
              <option value="Pré-aposentado">Pré-aposentados</option>
              <option value="Pensionista">Pensionistas</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5A6F82] block mb-1">Momento de Vida</label>
            <select
              value={filterMoment}
              onChange={(e) => setFilterMoment(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63]"
            >
              <option value="Todos">Todos os Momentos</option>
              <option value="Aposentadoria Ativa">Aposentadoria Ativa</option>
              <option value="Preparação">Preparação Nova Fase</option>
              <option value="Longevidade">Longevidade Plena</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5A6F82] block mb-1">Sexo</label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63]"
            >
              <option value="Todos">Ambos os Sexos</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Abas de Inteligência */}
      <div className="bg-white rounded-3xl border border-[#D9E4EE] shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[#EEF3F7] p-3 bg-[#FAFBFD] scrollbar-none text-xs font-bold">
          {[
            { id: 'visao_geral', label: '1. Dashboard das 8 Áreas' },
            { id: 'habitos_consumo', label: '2. Hábitos de Consumo (Cartão) 💳' },
            { id: 'saude_cassi_cid', label: '3. Saúde & CIDs (CASSI) 🏥' },
            { id: 'difin_investimentos', label: '4. Investimentos (DIFIN) 🏛️' },
            { id: 'mapa_ibpl', label: '5. Mapa Regional do IBPL 🗺️' },
            { id: 'ecossistema', label: '6. Funil do Ecossistema' },
            { id: 'rankings', label: '7. Rankings de Serviços' },
            { id: 'demanda_oferta', label: '8. Demanda x Oferta' },
            { id: 'cobertura', label: '9. Matriz de Cobertura' },
            { id: 'parceiros', label: '10. Visão de Parceiros' },
            { id: 'insights', label: '11. Insights Estratégicos' },
            { id: 'validacao_v1', label: '12. Validação do Protótipo' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === tab.id
                ? 'bg-[#163A63] text-white shadow-xs'
                : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#EEF3F7]'
                }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: VISÃO GERAL DAS 8 ÁREAS */}
        {activeTab === 'visao_geral' && (
          <div className="p-6 sm:p-8 space-y-8 animate-in fade-in">
            {/* Quick Access Spotlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Hábitos de Consumo */}
              <div
                onClick={() => setActiveTab('habitos_consumo')}
                className="p-5 bg-gradient-to-br from-[#FFFBF7] to-[#FFF3E6] rounded-2xl border border-[#FFE0B2] hover:border-[#E67E22] cursor-pointer shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#B25900] uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>DADOS OUROCARD / BB</span>
                  </span>
                  <h4 className="font-extrabold text-sm text-[#163A63] group-hover:text-[#E67E22] transition-colors">
                    Hábitos de Consumo do Aposentado
                  </h4>
                  <p className="text-xs text-[#5A6F82]">
                    Transição de gastos, farmácia, turismo e impacto no IBPL.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#E67E22] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Saúde CASSI & CIDs */}
              <div
                onClick={() => setActiveTab('saude_cassi_cid')}
                className="p-5 bg-gradient-to-br from-[#F4FBF9] to-[#E6F7F6] rounded-2xl border border-[#B4EBE6] hover:border-[#12B8AE] cursor-pointer shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#0A7D76] uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-[#12B8AE]" />
                    <span>DADOS CASSI & CIDs</span>
                  </span>
                  <h4 className="font-extrabold text-sm text-[#163A63] group-hover:text-[#12B8AE] transition-colors">
                    Saúde & Prevalência de CIDs
                  </h4>
                  <p className="text-xs text-[#5A6F82]">
                    Sinistralidade, doenças crônicas e programas preventivos.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#12B8AE] text-[#163A63] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Investimentos DIFIN */}
              <div
                onClick={() => setActiveTab('difin_investimentos')}
                className="p-5 bg-gradient-to-br from-[#FAFBFD] to-[#EEF3F7] rounded-2xl border border-[#CAD8E6] hover:border-[#163A63] cursor-pointer shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#164E7A] uppercase tracking-wider flex items-center gap-1">
                    <Landmark className="w-3.5 h-3.5 text-[#163A63]" />
                    <span>DADOS DIFIN PREVI</span>
                  </span>
                  <h4 className="font-extrabold text-sm text-[#163A63] group-hover:text-[#164E7A] transition-colors">
                    Investimentos & Aplicações
                  </h4>
                  <p className="text-xs text-[#5A6F82]">
                    Alocação, perfil de risco, rentabilidade e Empréstimo Simples.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#163A63] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Landmark className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: Mapa Regional */}
              <div
                onClick={() => setActiveTab('mapa_ibpl')}
                className="p-5 bg-gradient-to-br from-[#F4FBF9] to-[#E6F7F6] rounded-2xl border border-[#B4EBE6] hover:border-[#12B8AE] cursor-pointer shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#0A7D76] uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#12B8AE]" />
                    <span>NOVIDADE GEOGRÁFICA</span>
                  </span>
                  <h4 className="font-extrabold text-sm text-[#163A63] group-hover:text-[#12B8AE] transition-colors">
                    Mapa do IBPL: Onde está bem e Onde melhorar
                  </h4>
                  <p className="text-xs text-[#5A6F82]">
                    Diagnóstico dos 5 eixos e macrorregiões do Brasil com planos de ação.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#12B8AE] text-[#163A63] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Global Radar */}
              <div className="lg:col-span-6 bg-[#FAFBFD] p-6 rounded-2xl border border-[#D9E4EE]">
                <h3 className="font-bold text-sm text-[#163A63] mb-1">
                  Radar Comunitário PREVI (8 Áreas da Vida)
                </h3>
                <p className="text-xs text-[#5A6F82] mb-4">
                  Médias agregadas da base de associados avaliada
                </p>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={globalRadarData}>
                      <PolarGrid stroke="#CAD8E6" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#163A63', fontSize: 11, fontWeight: 700 }} />
                      <PolarRadiusAxis domain={[0, 100]} stroke="#5A6F82" tick={{ fontSize: 9 }} />
                      <Radar name="Média PREVI" dataKey="score" stroke="#164E7A" strokeWidth={2} fill="#12B8AE" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Age Distribution Chart */}
              <div className="lg:col-span-6 bg-[#FAFBFD] p-6 rounded-2xl border border-[#D9E4EE]">
                <h3 className="font-bold text-sm text-[#163A63] mb-1">
                  IBPL Médio por Faixa Etária
                </h3>
                <p className="text-xs text-[#5A6F82] mb-4">
                  Acompanhamento de estabilidade e transições ao longo do tempo
                </p>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F7" />
                      <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#163A63', fontWeight: 700 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#5A6F82' }} />
                      <RechartsTooltip />
                      <Bar dataKey="ibpl" name="IBPL Médio" fill="#12B8AE" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HÁBITOS DE CONSUMO (CARTÃO DE CRÉDITO) */}
        {activeTab === 'habitos_consumo' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <ConsumerHabitsDashboard />
          </div>
        )}

        {/* TAB 3: SAÚDE CASSI & CIDs */}
        {activeTab === 'saude_cassi_cid' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <CassiHealthCIDDashboard />
          </div>
        )}

        {/* TAB 4: INVESTIMENTOS DIFIN */}
        {activeTab === 'difin_investimentos' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <DifinInvestmentsDashboard />
          </div>
        )}

        {/* TAB 5: MAPA REGIONAL DO IBPL POR EIXO */}
        {activeTab === 'mapa_ibpl' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <IBPLRegionalAxisMap />
          </div>
        )}

        {/* TAB 2: ECOSSISTEMA E FUNIL */}
        {activeTab === 'ecossistema' && (
          <div className="p-6 sm:p-8 space-y-8 animate-in fade-in">
            <div className="space-y-2">
              <h3 className="font-bold text-base text-[#163A63]">
                Funil de Conversão e Engajamento das Soluções
              </h3>
              <p className="text-xs text-[#5A6F82]">
                Acompanhamento das etapas da jornada: da recomendação à avaliação e recomendação comunitária.
              </p>
            </div>

            {/* Funnel Progress Bars */}
            <div className="space-y-3 max-w-3xl mx-auto pt-4">
              {FUNNEL_STAGES.map((stg) => (
                <div key={stg.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#163A63]">{stg.stage}</span>
                    <span className="text-[#164E7A]">
                      {stg.count.toLocaleString()} ({stg.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-7 bg-[#EEF3F7] rounded-xl overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-lg transition-all duration-700 flex items-center justify-end px-3 text-white text-[11px] font-bold"
                      style={{ width: `${stg.pct}%`, backgroundColor: stg.color }}
                    >
                      {stg.pct}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RANKINGS SEPARADOS */}
        {activeTab === 'rankings' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-[#163A63]">
                  Rankings de Serviços e Soluções
                </h3>
                <p className="text-xs text-[#5A6F82]">
                  Métricas rigorosamente separadas para não confundir procura com impacto ou satisfação.
                </p>
              </div>

              {/* 4 Separate Sub-Tabs */}
              <div className="flex gap-1.5 bg-[#F4F7FA] p-1 rounded-xl border border-[#D9E4EE] text-xs">
                {[
                  { id: 'procura', label: 'MAIS PROCURADOS' },
                  { id: 'utilizacao', label: 'MAIS UTILIZADOS' },
                  { id: 'avaliacao', label: 'MAIS BEM AVALIADOS' },
                  { id: 'impacto', label: 'MAIOR IMPACTO' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setRankingTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${rankingTab === t.id
                      ? 'bg-[#163A63] text-white shadow-xs'
                      : 'text-[#5A6F82] hover:text-[#163A63]'
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto border border-[#D9E4EE] rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F7FA] text-[#163A63] font-bold border-b border-[#D9E4EE]">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Produto / Serviço</th>
                    <th className="p-3">Parceiro</th>
                    <th className="p-3">Área da Vida</th>
                    <th className="p-3 text-right">Visualizações</th>
                    <th className="p-3 text-right">Utilizações</th>
                    <th className="p-3 text-right">Conversão</th>
                    <th className="p-3 text-right">Avaliação</th>
                    <th className="p-3 text-right">Impacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF3F7]">
                  {sortedRankings.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#FAFBFD]">
                      <td className="p-3 font-bold text-[#5A6F82]">{idx + 1}</td>
                      <td className="p-3 font-bold text-[#163A63]">{item.name}</td>
                      <td className="p-3 text-[#164E7A] font-semibold">{item.partnerName}</td>
                      <td className="p-3 text-[#5A6F82]">{item.category}</td>
                      <td className="p-3 text-right text-[#163A63] font-semibold">
                        {item.views.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-[#12B8AE] font-black">
                        {item.uses.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-[#163A63]">
                        {item.conversionRate}%
                      </td>
                      <td className="p-3 text-right text-amber-600 font-bold">
                        ★ {item.rating}
                      </td>
                      <td className="p-3 text-right text-[#0A7D76] font-bold">
                        {item.perceivedImpact} / 5.0
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DEMANDA X OFERTA */}
        {activeTab === 'demanda_oferta' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#163A63]">
                Necessidades dos Associados x Soluções Disponíveis
              </h3>
              <p className="text-xs text-[#5A6F82]">
                Diagnóstico de cobertura do ecossistema por Área da Vida.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEMAND_SUPPLY_DATA.map((item) => (
                <div
                  key={item.dimensionId}
                  className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#163A63]">{item.name}</h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${item.status === 'BOA COBERTURA'
                        ? 'bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]'
                        : item.status === 'OPORTUNIDADE DE AMPLIAR'
                          ? 'bg-[#EDF2F7] text-[#2C3E50] border border-[#CAD8E6]'
                          : 'bg-[#EBF3FA] text-[#164E7A] border border-[#D9E4EE]'
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2 bg-[#F4F7FA] rounded-xl text-center">
                      <span className="text-[10px] text-[#5A6F82] block">Parceiros</span>
                      <span className="font-bold text-[#163A63] text-sm">{item.partnerCount}</span>
                    </div>
                    <div className="p-2 bg-[#F4F7FA] rounded-xl text-center">
                      <span className="text-[10px] text-[#5A6F82] block">Soluções</span>
                      <span className="font-bold text-[#163A63] text-sm">{item.solutionCount}</span>
                    </div>
                    <div className="p-2 bg-[#F4F7FA] rounded-xl text-center">
                      <span className="text-[10px] text-[#5A6F82] block">Impacto</span>
                      <span className="font-bold text-[#0A7D76] text-sm">{item.perceivedImpactScore} ★</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5A6F82] leading-snug">
                    {item.statusNote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MATRIZ DE COBERTURA */}
        {activeTab === 'cobertura' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#163A63]">
                Mapa de Cobertura do Ecossistema (8 Áreas x Momentos de Vida)
              </h3>
              <p className="text-xs text-[#5A6F82]">
                Contagem de soluções mapeadas para identificar lacunas e oportunidades de novas parcerias.
              </p>
            </div>

            <div className="overflow-x-auto border border-[#D9E4EE] rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#163A63] text-white font-bold">
                  <tr>
                    <th className="p-3">Área da Vida</th>
                    <th className="p-3 text-center">Aposentadoria Ativa</th>
                    <th className="p-3 text-center">Pré-Aposentadoria</th>
                    <th className="p-3 text-center">Longevidade Plena</th>
                    <th className="p-3 text-center">Cuidados & Família</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF3F7]">
                  {COVERAGE_MATRIX.map((row) => (
                    <tr key={row.dimension} className="hover:bg-[#FAFBFD]">
                      <td className="p-3 font-bold text-[#163A63]">{row.dimension}</td>
                      <td className="p-3 text-center">
                        <span className="px-3 py-1 bg-[#E6F7F6] text-[#0A7D76] font-bold rounded-lg">
                          {row.aposentadoria_ativa} sol.
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-3 py-1 bg-[#EBF3FA] text-[#164E7A] font-bold rounded-lg">
                          {row.pre_aposentadoria} sol.
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-3 py-1 bg-[#E6F7F6] text-[#0A7D76] font-bold rounded-lg">
                          {row.plenitude_longevidade} sol.
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 font-bold rounded-lg ${row.cuidadores_e_familia < 2
                            ? 'bg-[#EDF2F7] text-[#2C3E50]'
                            : 'bg-[#EBF3FA] text-[#164E7A]'
                            }`}
                        >
                          {row.cuidadores_e_familia} sol.
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DASHBOARD DE PARCEIROS */}
        {activeTab === 'parceiros' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Partner selector buttons */}
            <div className="flex gap-2 border-b border-[#EEF3F7] pb-3 overflow-x-auto">
              {PARTNERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartnerId(p.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedPartnerId === p.id
                    ? 'bg-[#163A63] text-white shadow-xs'
                    : 'bg-[#F4F7FA] text-[#5A6F82] hover:bg-[#EEF3F7]'
                    }`}
                >
                  {p.name} {p.isRealExample && '★'}
                </button>
              ))}
            </div>

            {/* Selected Partner Deep-Dive */}
            <div className="bg-[#FAFBFD] p-6 rounded-2xl border border-[#D9E4EE] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-[#163A63]">{selectedPartner.name}</h3>
                    {selectedPartner.specialBadge && (
                      <span className="text-[10px] bg-[#E6F7F6] text-[#0A7D76] px-2.5 py-0.5 rounded-full font-bold border border-[#B4EBE6]">
                        {selectedPartner.specialBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A6F82] mt-0.5">{selectedPartner.category}</p>
                </div>
              </div>

              <p className="text-xs text-[#2C3E50] leading-relaxed">
                {selectedPartner.description}
              </p>

              {selectedPartner.featuredServiceTitle && (
                <div className="p-3 bg-white rounded-xl border border-[#D9E4EE]">
                  <p className="text-[11px] text-[#5A6F82] font-bold uppercase tracking-wide">Serviço em destaque</p>
                  <p className="text-sm font-bold text-[#163A63] mt-1">{selectedPartner.featuredServiceTitle}</p>
                </div>
              )}

              {/* 6 KPI Cards for this partner */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-[#D9E4EE]">
                  <span className="text-[10px] text-[#5A6F82] block">Soluções</span>
                  <span className="font-black text-sm text-[#163A63]">{selectedPartner.solutionCount}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D9E4EE]">
                  <span className="text-[10px] text-[#5A6F82] block">Usuários Ativos</span>
                  <span className="font-black text-sm text-[#164E7A]">{selectedPartner.activeUsers.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D9E4EE]">
                  <span className="text-[10px] text-[#5A6F82] block">Aderência</span>
                  <span className="font-black text-sm text-[#12B8AE]">{selectedPartner.adherenceRate}%</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D9E4EE]">
                  <span className="text-[10px] text-[#5A6F82] block">Conversão</span>
                  <span className="font-black text-sm text-[#163A63]">{selectedPartner.conversionRate}%</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D9E4EE]">
                  <span className="text-[10px] text-[#5A6F82] block">Avaliação</span>
                  <span className="font-black text-sm text-amber-600">★ {selectedPartner.rating}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D9E4EE]">
                  <span className="text-[10px] text-[#5A6F82] block">Impacto</span>
                  <span className="font-black text-sm text-[#0A7D76]">{selectedPartner.perceivedImpact} / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: INSIGHTS ESTRATÉGICOS */}
        {activeTab === 'insights' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#163A63]">
                Insights Estratégicos Automatizados
              </h3>
              <p className="text-xs text-[#5A6F82]">
                Síntese de inteligência para tomada de decisões da diretoria e gerência da PREVI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STRATEGIC_INSIGHTS.map((ins) => (
                <div
                  key={ins.id}
                  className="p-5 bg-white rounded-2xl border border-[#D9E4EE] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]">
                      {ins.tag}
                    </span>
                    <span className="text-[10px] text-[#5A6F82] font-semibold">{ins.category}</span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-[#163A63] leading-snug">
                    {ins.title}
                  </h4>

                  <p className="text-xs text-[#5A6F82] leading-relaxed">
                    {ins.description}
                  </p>

                  <div className="pt-2 border-t border-[#EEF3F7] text-[10px] text-[#12B8AE] font-bold">
                    * Insight demonstrativo baseado em dados fictícios.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: VALIDAÇÃO DO PROTÓTIPO */}
        {activeTab === 'validacao_v1' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#163A63]">
                Resultados da Validação do Protótipo V1
              </h3>
              <p className="text-xs text-[#5A6F82]">
                Feedback contínuo dos associados e gestores que testaram a plataforma navegável.
              </p>
            </div>

            {/* 6 Validation KPI Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
                <span className="text-xs font-bold text-[#163A63] block">COMPREENSÃO</span>
                <p className="text-[11px] text-[#5A6F82]">"Entendi a proposta do Viver Mais."</p>
                <div className="text-xl font-black text-[#12B8AE]">96% Positivo</div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
                <span className="text-xs font-bold text-[#163A63] block">RELEVÂNCIA</span>
                <p className="text-[11px] text-[#5A6F82]">"Faz sentido para meu momento de vida."</p>
                <div className="text-xl font-black text-[#12B8AE]">91% Positivo</div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
                <span className="text-xs font-bold text-[#163A63] block">PERSONALIZAÇÃO</span>
                <p className="text-[11px] text-[#5A6F82]">"As sugestões seriam úteis para mim."</p>
                <div className="text-xl font-black text-[#12B8AE]">88% Positivo</div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
                <span className="text-xs font-bold text-[#163A63] block">CONFIANÇA</span>
                <p className="text-[11px] text-[#5A6F82]">"Me sinto seguro com a PREVI cuidando."</p>
                <div className="text-xl font-black text-[#12B8AE]">97% Positivo</div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
                <span className="text-xs font-bold text-[#163A63] block">INTENÇÃO DE USO</span>
                <p className="text-[11px] text-[#5A6F82]">"Eu utilizaria o Viver Mais."</p>
                <div className="text-xl font-black text-[#12B8AE]">93% Positivo</div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
                <span className="text-xs font-bold text-[#163A63] block">VALOR PERCEBIDO</span>
                <p className="text-[11px] text-[#5A6F82]">"Aumenta minha percepção sobre a PREVI."</p>
                <div className="text-xl font-black text-[#12B8AE]">95% Positivo</div>
              </div>
            </div>

            {/* List of received feedback items in this session */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-[#163A63]">
                Contribuições Recentes dos Avaliadores ({prototypeFeedbacks.length}):
              </h4>
              <div className="space-y-2">
                {prototypeFeedbacks.map((fb) => (
                  <div key={fb.id} className="p-3 bg-[#F4F7FA] rounded-xl border border-[#D9E4EE] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#164E7A]">
                        Útil: {fb.q1Utility} • Uso: {fb.q4WillUse}
                      </span>
                      <span className="text-[#5A6F82]">{fb.createdAt}</span>
                    </div>
                    {fb.q3WishList && (
                      <p className="text-[#2C3E50] italic">"{fb.q3WishList}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
