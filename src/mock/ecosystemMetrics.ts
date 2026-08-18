import { DimensionId } from '../types';

export interface EcosystemRankingItem {
  id: string;
  name: string;
  partnerName: string;
  category: string;
  dimensionId: DimensionId;
  lifeMomentName: string;
  recommendations: number;
  views: number;
  interests: number;
  uses: number;
  conversionRate: number;
  rating: number;
  adherenceRate: number;
  perceivedImpact: number;
}

export const ECOSYSTEM_RANKINGS: EcosystemRankingItem[] = [
  {
    id: '1',
    name: 'Oportunidades Profissionais e Projetos 50+',
    partnerName: 'Maturi',
    category: 'Trabalho e Propósito',
    dimensionId: 'trabalho_proposito',
    lifeMomentName: 'Aposentadoria Ativa',
    recommendations: 4210,
    views: 3850,
    interests: 2420,
    uses: 1680,
    conversionRate: 69.4,
    rating: 4.8,
    adherenceRate: 91,
    perceivedImpact: 4.8,
  },
  {
    id: '2',
    name: 'Ingressos & Experiências Culturais com Desconto',
    partnerName: 'Easy Live',
    category: 'Lazer e Cultura',
    dimensionId: 'lazer',
    lifeMomentName: 'Todos os Momentos',
    recommendations: 6380,
    views: 5920,
    interests: 3410,
    uses: 2740,
    conversionRate: 80.3,
    rating: 4.9,
    adherenceRate: 93,
    perceivedImpact: 4.9,
  },
  {
    id: '3',
    name: 'Mentoria Intergeracional & Transferência de Saberes',
    partnerName: 'Maturi',
    category: 'Trabalho e Propósito',
    dimensionId: 'trabalho_proposito',
    lifeMomentName: 'Aposentadoria Ativa',
    recommendations: 2840,
    views: 2610,
    interests: 1690,
    uses: 1120,
    conversionRate: 66.2,
    rating: 4.9,
    adherenceRate: 89,
    perceivedImpact: 4.9,
  },
  {
    id: '4',
    name: 'Roteiros de Turismo Cultural e História Viva',
    partnerName: 'Sesc Conexões Culturais',
    category: 'Lazer e Viagens',
    dimensionId: 'lazer',
    lifeMomentName: 'Aposentadoria Ativa / Plenitude',
    recommendations: 3950,
    views: 3710,
    interests: 2180,
    uses: 1450,
    conversionRate: 66.5,
    rating: 4.9,
    adherenceRate: 94,
    perceivedImpact: 4.9,
  },
  {
    id: '5',
    name: 'Círculo de Transições & Serenidade Emocional',
    partnerName: 'Rede Acolhe',
    category: 'Saúde Emocional',
    dimensionId: 'saude_emocional',
    lifeMomentName: 'Transição / Aposentadoria',
    recommendations: 3120,
    views: 2890,
    interests: 1540,
    uses: 980,
    conversionRate: 63.6,
    rating: 4.8,
    adherenceRate: 87,
    perceivedImpact: 4.8,
  },
  {
    id: '6',
    name: 'Desmistificando IA no Cotidiano',
    partnerName: 'Saber Digital & IA 50+',
    category: 'Educação Digital',
    dimensionId: 'trabalho_proposito',
    lifeMomentName: 'Todos os Momentos',
    recommendations: 4790,
    views: 4320,
    interests: 2510,
    uses: 1890,
    conversionRate: 75.3,
    rating: 4.7,
    adherenceRate: 86,
    perceivedImpact: 4.6,
  },
  {
    id: '7',
    name: 'Pilates Clínico & Prevenção Postural 50+',
    partnerName: 'Movimento & Vitalidade',
    category: 'Saúde Física',
    dimensionId: 'saude_fisica',
    lifeMomentName: 'Plenitude / Aposentadoria',
    recommendations: 3640,
    views: 3380,
    interests: 1870,
    uses: 1320,
    conversionRate: 70.6,
    rating: 4.8,
    adherenceRate: 90,
    perceivedImpact: 4.9,
  },
  {
    id: '8',
    name: 'Organização Patrimonial e Planejamento de Legado',
    partnerName: 'PREVI Orientação Financeira',
    category: 'Recursos Financeiros',
    dimensionId: 'recursos_financeiros',
    lifeMomentName: 'Pré-Aposentadoria / Plenitude',
    recommendations: 2980,
    views: 2650,
    interests: 1390,
    uses: 940,
    conversionRate: 67.6,
    rating: 4.9,
    adherenceRate: 95,
    perceivedImpact: 4.8,
  },
];

export interface DemandSupplyItem {
  dimensionId: DimensionId;
  name: string;
  identifiedNeedRate: number; // % dos associados com necessidade
  partnerCount: number;
  solutionCount: number;
  recommendations: number;
  interestCount: number;
  usageCount: number;
  satisfactionScore: number;
  perceivedImpactScore: number;
  status: 'BOA COBERTURA' | 'ACOMPANHAR' | 'OPORTUNIDADE DE AMPLIAR';
  statusNote: string;
}

export const DEMAND_SUPPLY_DATA: DemandSupplyItem[] = [
  {
    dimensionId: 'trabalho_proposito',
    name: 'Trabalho e Propósito',
    identifiedNeedRate: 38.4,
    partnerCount: 3,
    solutionCount: 12,
    recommendations: 7050,
    interestCount: 4110,
    usageCount: 2800,
    satisfactionScore: 4.8,
    perceivedImpactScore: 4.8,
    status: 'BOA COBERTURA',
    statusNote: 'Forte tração com Maturi e programas de mentoria.',
  },
  {
    dimensionId: 'saude_emocional',
    name: 'Saúde Emocional',
    identifiedNeedRate: 42.1,
    partnerCount: 2,
    solutionCount: 6,
    recommendations: 5890,
    interestCount: 3120,
    usageCount: 1640,
    satisfactionScore: 4.7,
    perceivedImpactScore: 4.8,
    status: 'OPORTUNIDADE DE AMPLIAR',
    statusNote: 'Alta demanda de acolhimento para expansão de novos parceiros.',
  },
  {
    dimensionId: 'lazer',
    name: 'Lazer e Cultura',
    identifiedNeedRate: 31.2,
    partnerCount: 4,
    solutionCount: 18,
    recommendations: 10330,
    interestCount: 6300,
    usageCount: 4870,
    satisfactionScore: 4.9,
    perceivedImpactScore: 4.8,
    status: 'BOA COBERTURA',
    statusNote: 'Excelente engajamento e alta taxa de conversão com Easy Live e Sesc.',
  },
  {
    dimensionId: 'saude_fisica',
    name: 'Saúde Física',
    identifiedNeedRate: 35.7,
    partnerCount: 3,
    solutionCount: 11,
    recommendations: 6940,
    interestCount: 3820,
    usageCount: 2610,
    satisfactionScore: 4.8,
    perceivedImpactScore: 4.9,
    status: 'BOA COBERTURA',
    statusNote: 'Atividades preventivas e caminhadas com ótima aderência.',
  },
  {
    dimensionId: 'relacionamentos',
    name: 'Relacionamentos',
    identifiedNeedRate: 24.6,
    partnerCount: 3,
    solutionCount: 9,
    recommendations: 4820,
    interestCount: 2950,
    usageCount: 2110,
    satisfactionScore: 4.8,
    perceivedImpactScore: 4.8,
    status: 'BOA COBERTURA',
    statusNote: 'Parcerias integradas geram conexões interpessoais espontâneas.',
  },
  {
    dimensionId: 'recursos_financeiros',
    name: 'Recursos Financeiros',
    identifiedNeedRate: 22.8,
    partnerCount: 2,
    solutionCount: 5,
    recommendations: 3980,
    interestCount: 2010,
    usageCount: 1420,
    satisfactionScore: 4.9,
    perceivedImpactScore: 4.7,
    status: 'ACOMPANHAR',
    statusNote: 'Consultoria de planejamento patrimonial bem avaliada.',
  },
  {
    dimensionId: 'moradia',
    name: 'Moradia e Ambiente',
    identifiedNeedRate: 26.5,
    partnerCount: 1,
    solutionCount: 3,
    recommendations: 2450,
    interestCount: 1180,
    usageCount: 710,
    satisfactionScore: 4.6,
    perceivedImpactScore: 4.5,
    status: 'OPORTUNIDADE DE AMPLIAR',
    statusNote: 'Potencial para parcerias em adaptação residencial e ergonomia 60+.',
  },
  {
    dimensionId: 'espiritualidade',
    name: 'Espiritualidade e Sentido',
    identifiedNeedRate: 18.2,
    partnerCount: 2,
    solutionCount: 4,
    recommendations: 2100,
    interestCount: 1140,
    usageCount: 860,
    satisfactionScore: 4.8,
    perceivedImpactScore: 4.7,
    status: 'ACOMPANHAR',
    statusNote: 'Práticas reflexivas e de contemplação integradas ao autocuidado.',
  },
];

export const FUNNEL_STAGES = [
  { stage: 'Recomendado', count: 43560, pct: 100, color: '#163A63' },
  { stage: 'Visualizado', count: 37026, pct: 85, color: '#1F5B89' },
  { stage: 'Interesse', count: 22650, pct: 52, color: '#164E7A' },
  { stage: 'Utilização', count: 16117, pct: 37, color: '#12B8AE' },
  { stage: 'Avaliação', count: 13068, pct: 30, color: '#20C2B4' },
  { stage: 'Recomendaria', count: 12284, pct: 28, color: '#0A988F' },
];

export const COVERAGE_MATRIX = [
  { dimension: 'Saúde Física', aposentadoria_ativa: 5, pre_aposentadoria: 3, plenitude_longevidade: 6, cuidadores_e_familia: 4 },
  { dimension: 'Saúde Emocional', aposentadoria_ativa: 4, pre_aposentadoria: 4, plenitude_longevidade: 2, cuidadores_e_familia: 3 },
  { dimension: 'Relacionamentos', aposentadoria_ativa: 6, pre_aposentadoria: 3, plenitude_longevidade: 5, cuidadores_e_familia: 2 },
  { dimension: 'Trabalho e Propósito', aposentadoria_ativa: 7, pre_aposentadoria: 6, plenitude_longevidade: 2, cuidadores_e_familia: 1 },
  { dimension: 'Espiritualidade', aposentadoria_ativa: 3, pre_aposentadoria: 2, plenitude_longevidade: 3, cuidadores_e_familia: 2 },
  { dimension: 'Lazer e Cultura', aposentadoria_ativa: 8, pre_aposentadoria: 5, plenitude_longevidade: 7, cuidadores_e_familia: 3 },
  { dimension: 'Recursos Financeiros', aposentadoria_ativa: 4, pre_aposentadoria: 5, plenitude_longevidade: 3, cuidadores_e_familia: 2 },
  { dimension: 'Moradia e Ambiente', aposentadoria_ativa: 2, pre_aposentadoria: 2, plenitude_longevidade: 3, cuidadores_e_familia: 2 },
];
