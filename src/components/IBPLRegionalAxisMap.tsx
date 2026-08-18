import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Compass,
  ArrowUpRight,
  Sparkles,
  Layers,
  BarChart3,
  Building,
  Users,
  ShieldCheck,
  Heart,
  Activity,
  Lightbulb,
  Search,
  ChevronRight,
  Filter,
  Building2,
  X,
  ArrowLeft,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export type AxisId =
  | 'geral'
  | 'saude_fisica'
  | 'saude_emocional'
  | 'trabalho_proposito'
  | 'relacionamentos'
  | 'recursos_financeiros'
  | 'moradia'
  | 'lazer';

export interface CityData {
  name: string;
  uf: string;
  ibpl: number;
  associados: number;
  status: 'bom' | 'atencao';
  highlights: string;
  priorityAxis: string;
  partnerships: string[];
}

export interface StateData {
  uf: string;
  name: string;
  regionId: string;
  ibpl: number;
  associados: number;
  status: 'bom' | 'atencao';
  dominantStrength: string;
  mainChallenge: string;
  cities: CityData[];
}

export interface RegionData {
  id: string;
  name: string;
  shortName: string;
  states: string[];
  totalAssociados: number;
  ibplGeral: number;
  scores: Record<AxisId, number>;
  status: 'bom' | 'atencao';
  strengths: string[];
  improvementAreas: string[];
  recommendedActions: string[];
  keyHubs: string[];
}

export const IBPLRegionalAxisMap: React.FC = () => {
  const [selectedAxis, setSelectedAxis] = useState<AxisId>('geral');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('sudeste');
  const [selectedStateUf, setSelectedStateUf] = useState<string | null>('SP');
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [cityStatusFilter, setCityStatusFilter] = useState<'todos' | 'bom' | 'atencao'>('todos');

  // National averages for comparison
  const NATIONAL_AVERAGES: Record<AxisId, number> = {
    geral: 68.4,
    saude_fisica: 74.0,
    saude_emocional: 66.2,
    trabalho_proposito: 63.5,
    relacionamentos: 81.0,
    recursos_financeiros: 71.4,
    moradia: 79.1,
    lazer: 68.3,
  };

  // Comprehensive Brazil Regional Database
  const REGIONS_DATA: Record<string, RegionData> = {
    sudeste: {
      id: 'sudeste',
      name: 'Região Sudeste',
      shortName: 'Sudeste',
      states: ['SP', 'RJ', 'MG', 'ES'],
      totalAssociados: 68420,
      ibplGeral: 71.2,
      scores: {
        geral: 71.2,
        saude_fisica: 76.5,
        saude_emocional: 64.8,
        trabalho_proposito: 66.1,
        relacionamentos: 82.3,
        recursos_financeiros: 75.8,
        moradia: 81.4,
        lazer: 71.9,
      },
      status: 'bom',
      strengths: [
        'Excelente infraestrutura financeira e maior índice de moradia segura/adaptada (81.4)',
        'Forte oferta de serviços culturais, gastronômicos e lazer urbano em SP e RJ',
        'Ampla penetração de soluções de saúde suplementar e telemedicina CASSI',
      ],
      improvementAreas: [
        'Saúde Emocional (64.8) sofre com estresse urbano e isolamento em grandes metrópoles',
        'Rotina de mobilidade e trânsito dificulta encontros presenciais espontâneos',
      ],
      recommendedActions: [
        'Criar hubs presenciais de descompressão e saúde mental preventiva na Casinha PREVI RJ/SP',
        'Expandir parcerias com Maturi para recolocação em consultorias e mentorias 50+',
      ],
      keyHubs: ['São Paulo (Capital)', 'Rio de Janeiro', 'Belo Horizonte', 'Campinas', 'Vitória'],
    },
    sul: {
      id: 'sul',
      name: 'Região Sul',
      shortName: 'Sul',
      states: ['RS', 'PR', 'SC'],
      totalAssociados: 31250,
      ibplGeral: 73.8,
      scores: {
        geral: 73.8,
        saude_fisica: 78.2,
        saude_emocional: 72.0,
        trabalho_proposito: 68.4,
        relacionamentos: 85.1,
        recursos_financeiros: 73.5,
        moradia: 83.2,
        lazer: 72.5,
      },
      status: 'bom',
      strengths: [
        'Maior pontuação nacional em Relacionamentos Comunitários e Vínculos Sociais (85.1)',
        'Índices elevados de prática de atividades físicas ao ar livre e contato com a natureza',
        'Forte cultura de clubes de aposentados (AABB/AFABB) e voluntariado cooperativo',
      ],
      improvementAreas: [
        'Acesso a soluções de desaposentação digital em cidades do interior do RS/PR',
        'Apoio específico a cuidados familiares no inverno rigoroso',
      ],
      recommendedActions: [
        'Fortalecer programas de intergeracionalidade e caravanas culturais regionais',
        'Ampliar rede de cuidadores certificados e apoio domiciliar preventivo',
      ],
      keyHubs: ['Curitiba', 'Porto Alegre', 'Florianópolis', 'Londrina', 'Caxias do Sul'],
    },
    centro_oeste: {
      id: 'centro_oeste',
      name: 'Região Centro-Oeste',
      shortName: 'Centro-Oeste',
      states: ['DF', 'GO', 'MS', 'MT'],
      totalAssociados: 24180,
      ibplGeral: 67.5,
      scores: {
        geral: 67.5,
        saude_fisica: 72.1,
        saude_emocional: 61.4,
        trabalho_proposito: 60.8,
        relacionamentos: 78.2,
        recursos_financeiros: 74.2,
        moradia: 78.6,
        lazer: 64.1,
      },
      status: 'atencao',
      strengths: [
        'Alto poder aquisitivo médio e solidez em Recursos Financeiros (74.2)',
        'Planejamento patrimonial e previdenciário consolidado em Brasília',
      ],
      improvementAreas: [
        'Trabalho & Propósito (60.8) é o mais desafiador: perda de identidade pós-aposentadoria do funcionalismo BB',
        'Saúde Emocional (61.4) necessita de maior atenção após o rompimento da rotina corporativa',
        'Opções de lazer cultural com pouca variedade fora do eixo central de Brasília',
      ],
      recommendedActions: [
        'Implantar programa intensivo de Mentoria e Novos Rumos pós-carreira BB em Brasília',
        'Lançar circuitos de lazer, turismo ecológico em Goiás e rodas de apoio psicológico',
      ],
      keyHubs: ['Brasília (DF)', 'Goiânia', 'Campo Grande', 'Cuiabá', 'Anápolis'],
    },
    nordeste: {
      id: 'nordeste',
      name: 'Região Nordeste',
      shortName: 'Nordeste',
      states: ['BA', 'PE', 'CE', 'RN', 'PB', 'AL', 'SE', 'MA', 'PI'],
      totalAssociados: 28940,
      ibplGeral: 66.8,
      scores: {
        geral: 66.8,
        saude_fisica: 70.4,
        saude_emocional: 67.8,
        trabalho_proposito: 59.2,
        relacionamentos: 84.6,
        recursos_financeiros: 65.1,
        moradia: 74.8,
        lazer: 67.2,
      },
      status: 'atencao',
      strengths: [
        'Excelente calor humano e convivência familiar multigeracional (84.6)',
        'Apreciação por lazer ao ar livre, praia e gastronomia local',
      ],
      improvementAreas: [
        'Trabalho e Propósito (59.2) é o menor índice do país: carência de redes de mentoria e projetos estruturados',
        'Recursos Financeiros (65.1): necessidade de orientação contra endividamento familiar',
        'Acessibilidade em residências e segurança urbana em capitais costeiras',
      ],
      recommendedActions: [
        'Parcerias com cooperativas e universidades locais para programas de mentoria 50+',
        'Oficinas de educação financeira preventiva e proteção patrimonial familiar',
      ],
      keyHubs: ['Salvador', 'Recife', 'Fortaleza', 'Natal', 'João Pessoa', 'Maceió'],
    },
    norte: {
      id: 'norte',
      name: 'Região Norte',
      shortName: 'Norte',
      states: ['PA', 'AM', 'RO', 'TO', 'AC', 'AP', 'RR'],
      totalAssociados: 9810,
      ibplGeral: 64.9,
      scores: {
        geral: 64.9,
        saude_fisica: 68.2,
        saude_emocional: 63.5,
        trabalho_proposito: 58.7,
        relacionamentos: 77.4,
        recursos_financeiros: 66.2,
        moradia: 72.1,
        lazer: 61.3,
      },
      status: 'atencao',
      strengths: [
        'Forte ligação com natureza, alimentação regional e tranquilidade em cidades do interior',
        'Resiliência e laços comunitários espontâneos',
      ],
      improvementAreas: [
        'Acesso restrito a serviços especializados de saúde física e geriatria',
        'Menor pontuação nacional em Lazer & Cultura (61.3) e Propósito (58.7)',
        'Logística e isolamento geográfico dos aposentados fora de Belém e Manaus',
      ],
      recommendedActions: [
        'Disponibilizar pacote integral de teleatendimento médico e psicológico via aplicativo PREVI',
        'Criar trilhas digitais de capacitação e clubes virtuais de leitura e entretenimento',
      ],
      keyHubs: ['Belém', 'Manaus', 'Porto Velho', 'Palmas', 'Santarém'],
    },
  };

  // State and City Database with IBPL metrics
  const STATES_DATA: Record<string, StateData> = {
    // SUDESTE
    SP: {
      uf: 'SP',
      name: 'São Paulo',
      regionId: 'sudeste',
      ibpl: 72.4,
      associados: 38450,
      status: 'bom',
      dominantStrength: 'Moradia, Saúde Especializada e Lazer Cultural',
      mainChallenge: 'Estresse urbano e trânsito nos deslocamentos',
      cities: [
        {
          name: 'São Paulo (Capital)',
          uf: 'SP',
          ibpl: 71.8,
          associados: 22100,
          status: 'bom',
          highlights: 'Ampla rede CASSI, teatros, museus e Casinha PREVI',
          priorityAxis: 'Saúde Emocional & Mobilidade',
          partnerships: ['Casinha PREVI Pinheiros', 'AABB SP', 'Cinemateca'],
        },
        {
          name: 'Campinas',
          uf: 'SP',
          ibpl: 73.5,
          associados: 4820,
          status: 'bom',
          highlights: 'Polo universitário, qualidade de vida e parques (Taquaral)',
          priorityAxis: 'Relacionamentos & Lazer',
          partnerships: ['AABB Campinas', 'Clube Fonte São Paulo'],
        },
        {
          name: 'Ribeirão Preto',
          uf: 'SP',
          ibpl: 74.2,
          associados: 3190,
          status: 'bom',
          highlights: 'Excelente infraestrutura médica, clima ensolarado e praças',
          priorityAxis: 'Saúde Física & Caminhadas',
          partnerships: ['AABB Ribeirão', 'AFABB-SP'],
        },
        {
          name: 'Santos / Baixada Santista',
          uf: 'SP',
          ibpl: 75.1,
          associados: 4340,
          status: 'bom',
          highlights: 'Maior concentração de aposentados com praia plana e jardins',
          priorityAxis: 'Lazer ao Ar Livre & Convivência',
          partnerships: ['Orla Ativa 60+', 'AABB Santos'],
        },
        {
          name: 'São José dos Campos',
          uf: 'SP',
          ibpl: 73.8,
          associados: 2300,
          status: 'bom',
          highlights: 'Segurança urbana, ciclovias e proximidade com a Serra',
          priorityAxis: 'Moradia & Lazer Ecológico',
          partnerships: ['Parque Vicentina Aranha', 'AABB SJC'],
        },
        {
          name: 'Sorocaba',
          uf: 'SP',
          ibpl: 71.0,
          associados: 1700,
          status: 'bom',
          highlights: 'Rede de ciclovias, parques zoológicos e centros de convivência',
          priorityAxis: 'Saúde Preventiva',
          partnerships: ['AABB Sorocaba', 'Clube da Terceira Idade'],
        },
      ],
    },
    RJ: {
      uf: 'RJ',
      name: 'Rio de Janeiro',
      regionId: 'sudeste',
      ibpl: 70.1,
      associados: 16890,
      status: 'bom',
      dominantStrength: 'Lazer ao Ar Livre, Praias e Vínculos Afetivos',
      mainChallenge: 'Segurança pública e acessibilidade nas calçadas',
      cities: [
        {
          name: 'Rio de Janeiro (Capital)',
          uf: 'RJ',
          ibpl: 69.8,
          associados: 11800,
          status: 'bom',
          highlights: 'Sede PREVI, orla de Copacabana/Ipanema, AABB Lagoa e centros culturais',
          priorityAxis: 'Saúde Emocional & Segurança',
          partnerships: ['Sede PREVI Rio', 'AABB Lagoa', 'Casa de Saúde CASSI Botafogo'],
        },
        {
          name: 'Niterói',
          uf: 'RJ',
          ibpl: 73.4,
          associados: 2450,
          status: 'bom',
          highlights: 'Alto IDH, calçadão de Icaraí, trilhas no Parque da Cidade',
          priorityAxis: 'Lazer & Convivência Ativa',
          partnerships: ['AABB Niterói', 'Campo de São Bento 60+'],
        },
        {
          name: 'Petrópolis / Região Serrana',
          uf: 'RJ',
          ibpl: 71.9,
          associados: 1420,
          status: 'bom',
          highlights: 'Clima ameno, tranquilidade, gastronomia e caminhadas históricas',
          priorityAxis: 'Qualidade do Sono & Relaxamento',
          partnerships: ['AFABB Serra Carioca', 'AABB Petrópolis'],
        },
        {
          name: 'Volta Redonda',
          uf: 'RJ',
          ibpl: 67.2,
          associados: 1220,
          status: 'atencao',
          highlights: 'Serviços estruturados, mas demanda mais atividades esportivas 50+',
          priorityAxis: 'Lazer & Saúde Emocional',
          partnerships: ['AABB Volta Redonda'],
        },
      ],
    },
    MG: {
      uf: 'MG',
      name: 'Minas Gerais',
      regionId: 'sudeste',
      ibpl: 70.6,
      associados: 10430,
      status: 'bom',
      dominantStrength: 'Relacionamentos, Gastronomia Afetiva e Laços Familiares',
      mainChallenge: 'Acesso a centros médicos de alta complexidade no interior',
      cities: [
        {
          name: 'Belo Horizonte',
          uf: 'MG',
          ibpl: 71.4,
          associados: 6200,
          status: 'bom',
          highlights: 'Parque Municipal, Lagoa da Pampulha, feiras de artesanato e AABB Pampulha',
          priorityAxis: 'Relacionamentos & Lazer',
          partnerships: ['AABB Pampulha', 'CASSI BH Savassi'],
        },
        {
          name: 'Juiz de Fora',
          uf: 'MG',
          ibpl: 72.1,
          associados: 1680,
          status: 'bom',
          highlights: 'Tradição em aposentadoria tranquila, polo de geriatria e cultura',
          priorityAxis: 'Saúde Física & Educação Continuada',
          partnerships: ['AABB Juiz de Fora', 'Universidade Aberta à Terceira Idade UFJF'],
        },
        {
          name: 'Uberlândia',
          uf: 'MG',
          ibpl: 70.8,
          associados: 1450,
          status: 'bom',
          highlights: 'Parque do Sabiá, infraestrutura plana e serviços ágeis',
          priorityAxis: 'Caminhada & Atividade Física',
          partnerships: ['AABB Uberlândia'],
        },
        {
          name: 'Montes Claros',
          uf: 'MG',
          ibpl: 66.5,
          associados: 1100,
          status: 'atencao',
          highlights: 'Vínculos sociais fortes, porém requer mais especialistas médicos credenciados',
          priorityAxis: 'Saúde Preventiva & Telemedicina',
          partnerships: ['AABB Montes Claros'],
        },
      ],
    },
    ES: {
      uf: 'ES',
      name: 'Espírito Santo',
      regionId: 'sudeste',
      ibpl: 72.8,
      associados: 2650,
      status: 'bom',
      dominantStrength: 'Moradia Segura, Orla de Praia e Clima Estável',
      mainChallenge: 'Ampliação de cursos presenciais de capacitação e tecnologia',
      cities: [
        {
          name: 'Vitória',
          uf: 'ES',
          ibpl: 74.5,
          associados: 1520,
          status: 'bom',
          highlights: 'Praia de Camburi, calçadão plano, gastronomia capixaba e segurança',
          priorityAxis: 'Lazer & Atividade Física',
          partnerships: ['AABB Vitória', 'Orla Viva Camburi'],
        },
        {
          name: 'Vila Velha',
          uf: 'ES',
          ibpl: 72.0,
          associados: 780,
          status: 'bom',
          highlights: 'Praia da Costa, esportes náuticos leves e convivência social',
          priorityAxis: 'Relacionamentos & Lazer',
          partnerships: ['AABB Vila Velha'],
        },
        {
          name: 'Linhares',
          uf: 'ES',
          ibpl: 68.1,
          associados: 350,
          status: 'bom',
          highlights: 'Lagoas naturais, tranquilidade e baixo custo de vida',
          priorityAxis: 'Propósito & Voluntariado',
          partnerships: ['AABB Linhares'],
        },
      ],
    },

    // SUL
    RS: {
      uf: 'RS',
      name: 'Rio Grande do Sul',
      regionId: 'sul',
      ibpl: 73.2,
      associados: 13600,
      status: 'bom',
      dominantStrength: 'Clubes Sociais (AABB), Tradição Cultural e Amizades Sólidas',
      mainChallenge: 'Inverno rigoroso exigindo cuidados com saúde respiratória',
      cities: [
        {
          name: 'Porto Alegre',
          uf: 'RS',
          ibpl: 72.8,
          associados: 7800,
          status: 'bom',
          highlights: 'Parque da Redenção, Gasômetro, AABB Ipanema e tradição do chimarrão',
          priorityAxis: 'Relacionamentos & Saúde Emocional',
          partnerships: ['AABB Porto Alegre', 'AFABB-RS'],
        },
        {
          name: 'Caxias do Sul / Serra Gaúcha',
          uf: 'RS',
          ibpl: 75.6,
          associados: 2400,
          status: 'bom',
          highlights: 'Gastronomia italiana, vinhedos, longevidade acima da média e voluntariado',
          priorityAxis: 'Alimentação Saudável & Propósito',
          partnerships: ['AABB Caxias', 'Rota dos Vinhedos 60+'],
        },
        {
          name: 'Pelotas',
          uf: 'RS',
          ibpl: 71.9,
          associados: 1800,
          status: 'bom',
          highlights: 'Arquitetura histórica, confeitarias tradicionais e grupos de leitura',
          priorityAxis: 'Cultura & Lazer',
          partnerships: ['AABB Pelotas'],
        },
        {
          name: 'Santa Maria',
          uf: 'RS',
          ibpl: 72.1,
          associados: 1600,
          status: 'bom',
          highlights: 'Cidade universitária no centro do estado com ampla rede hospitalar',
          priorityAxis: 'Saúde Preventiva',
          partnerships: ['AABB Santa Maria', 'UFSM 3ª Idade'],
        },
      ],
    },
    PR: {
      uf: 'PR',
      name: 'Paraná',
      regionId: 'sul',
      ibpl: 74.5,
      associados: 11900,
      status: 'bom',
      dominantStrength: 'Mobilidade Acessível, Parques Arborizados e Gestão Financeira',
      mainChallenge: 'Estímulo a novos projetos pós-aposentadoria além do descanso',
      cities: [
        {
          name: 'Curitiba',
          uf: 'PR',
          ibpl: 75.8,
          associados: 6900,
          status: 'bom',
          highlights: 'Jardim Botânico, Parque Barigui, transporte público exemplar e AABB Tarumã',
          priorityAxis: 'Moradia & Caminhadas Verdes',
          partnerships: ['AABB Curitiba', 'AFABB-PR', 'Parques de Curitiba'],
        },
        {
          name: 'Maringá',
          uf: 'PR',
          ibpl: 76.2,
          associados: 1700,
          status: 'bom',
          highlights: 'Eleita uma das melhores cidades para viver no Brasil: arborização e segurança',
          priorityAxis: 'Qualidade de Vida & Convivência',
          partnerships: ['AABB Maringá', 'Parque do Ingá Ativo'],
        },
        {
          name: 'Londrina',
          uf: 'PR',
          ibpl: 74.0,
          associados: 2300,
          status: 'bom',
          highlights: 'Lago Igapó, centros médicos modernos e forte vida associativa',
          priorityAxis: 'Saúde Física & Lazer',
          partnerships: ['AABB Londrina'],
        },
        {
          name: 'Foz do Iguaçu',
          uf: 'PR',
          ibpl: 71.5,
          associados: 1000,
          status: 'bom',
          highlights: 'Turismo ecológico internacional, contato diário com a natureza e clima quente',
          priorityAxis: 'Lazer & Meio Ambiente',
          partnerships: ['AABB Foz'],
        },
      ],
    },
    SC: {
      uf: 'SC',
      name: 'Santa Catarina',
      regionId: 'sul',
      ibpl: 75.1,
      associados: 5750,
      status: 'bom',
      dominantStrength: 'Maior Longevidade do Brasil, Segurança e Atividades Beira-Mar',
      mainChallenge: 'Custo de moradia elevado na alta temporada costeira',
      cities: [
        {
          name: 'Florianópolis',
          uf: 'SC',
          ibpl: 77.0,
          associados: 2900,
          status: 'bom',
          highlights: 'Campeã nacional em expectativa de vida: Beira-Mar Norte, AABB Coqueiros e praias',
          priorityAxis: 'Saúde Física & Esportes Leves',
          partnerships: ['AABB Florianópolis', 'CASSI SC', 'Viver Bem Ilha'],
        },
        {
          name: 'Joinville',
          uf: 'SC',
          ibpl: 74.2,
          associados: 1500,
          status: 'bom',
          highlights: 'Cidade da dança, flores, ciclovias e tranquilidade urbana',
          priorityAxis: 'Cultura & Moradia',
          partnerships: ['AABB Joinville', 'Festival de Dança 60+'],
        },
        {
          name: 'Blumenau',
          uf: 'SC',
          ibpl: 75.0,
          associados: 1350,
          status: 'bom',
          highlights: 'Tradição comunitária alemã, Parque Ramiro Ruediger e voluntariado',
          priorityAxis: 'Relacionamentos & Tradição',
          partnerships: ['AABB Blumenau'],
        },
      ],
    },

    // CENTRO-OESTE
    DF: {
      uf: 'DF',
      name: 'Distrito Federal',
      regionId: 'centro_oeste',
      ibpl: 69.2,
      associados: 14200,
      status: 'bom',
      dominantStrength: 'Poder Financeiro, Planejamento Previdenciário e Parques Planos',
      mainChallenge: 'Propósito pós-aposentadoria e reinvenção após anos de funcionalismo público',
      cities: [
        {
          name: 'Brasília (Plano Piloto / Asa Sul / Asa Norte)',
          uf: 'DF',
          ibpl: 70.8,
          associados: 9800,
          status: 'bom',
          highlights: 'Parque da Cidade, Lago Paranoá, AABB Brasília (beira-lago) e clubes estruturados',
          priorityAxis: 'Trabalho & Propósito (Mentoria 50+)',
          partnerships: ['AABB Brasília', 'AFABB-DF', 'Casinha PREVI Brasília'],
        },
        {
          name: 'Taguatinga / Águas Claras / Guará',
          uf: 'DF',
          ibpl: 67.5,
          associados: 4400,
          status: 'atencao',
          highlights: 'Densidade populacional alta, parques ecológicos locais e comércio ativo',
          priorityAxis: 'Lazer Comunitário & Saúde Emocional',
          partnerships: ['Parque de Águas Claras 60+', 'AABB DF'],
        },
      ],
    },
    GO: {
      uf: 'GO',
      name: 'Goiás',
      regionId: 'centro_oeste',
      ibpl: 66.8,
      associados: 5800,
      status: 'atencao',
      dominantStrength: 'Convivência Social, Gastronomia Típica e Parques Arborizados',
      mainChallenge: 'Baixa oferta de atividades culturais e de mentoria no interior',
      cities: [
        {
          name: 'Goiânia',
          uf: 'GO',
          ibpl: 68.2,
          associados: 3600,
          status: 'bom',
          highlights: 'Parque Flamboyant, Parque Vaca Brava, feiras ao ar livre e clima quente',
          priorityAxis: 'Lazer & Caminhadas',
          partnerships: ['AABB Goiânia', 'AFABB-GO'],
        },
        {
          name: 'Anápolis',
          uf: 'GO',
          ibpl: 65.4,
          associados: 1300,
          status: 'atencao',
          highlights: 'Polo logístico e farmacêutico, necessita de mais espaços de arte e cultura 50+',
          priorityAxis: 'Cultura & Saúde Emocional',
          partnerships: ['AABB Anápolis'],
        },
        {
          name: 'Rio Verde / Caldas Novas',
          uf: 'GO',
          ibpl: 65.0,
          associados: 900,
          status: 'atencao',
          highlights: 'Águas termais e turismo hidrotermal relaxante para a terceira idade',
          priorityAxis: 'Saúde Física & Hidroginástica',
          partnerships: ['AABB Caldas Novas'],
        },
      ],
    },
    MS: {
      uf: 'MS',
      name: 'Mato Grosso do Sul',
      regionId: 'centro_oeste',
      ibpl: 66.5,
      associados: 2300,
      status: 'atencao',
      dominantStrength: 'Contato com o Pantanal, Ar Puro e Tranquilidade',
      mainChallenge: 'Distância geográfica entre polos médicos e programas de desaposentação',
      cities: [
        {
          name: 'Campo Grande',
          uf: 'MS',
          ibpl: 68.0,
          associados: 1600,
          status: 'bom',
          highlights: 'Parque das Nações Indígenas, cidade muito arborizada e tereré comunitário',
          priorityAxis: 'Relacionamentos & Caminhadas',
          partnerships: ['AABB Campo Grande'],
        },
        {
          name: 'Dourados / Bonito',
          uf: 'MS',
          ibpl: 64.5,
          associados: 700,
          status: 'atencao',
          highlights: 'Natureza exuberante e ecoturismo, demandando mais serviços de telemedicina',
          priorityAxis: 'Saúde Preventiva CASSI',
          partnerships: ['AABB Dourados'],
        },
      ],
    },
    MT: {
      uf: 'MT',
      name: 'Mato Grosso',
      regionId: 'centro_oeste',
      ibpl: 65.8,
      associados: 1880,
      status: 'atencao',
      dominantStrength: 'Potência do Agronegócio e Laços Familiares',
      mainChallenge: 'Altas temperaturas exigindo mais espaços climatizados de lazer e atividade física',
      cities: [
        {
          name: 'Cuiabá / Várzea Grande',
          uf: 'MT',
          ibpl: 66.9,
          associados: 1200,
          status: 'atencao',
          highlights: 'Parque Mãe Bonifácia, culinária cuiabana e proximidade com Chapada dos Guimarães',
          priorityAxis: 'Lazer Climatizado & Atividade Física',
          partnerships: ['AABB Cuiabá'],
        },
        {
          name: 'Rondonópolis / Sinop',
          uf: 'MT',
          ibpl: 63.8,
          associados: 680,
          status: 'atencao',
          highlights: 'Cidades em forte expansão, carentes de clubes específicos para aposentados',
          priorityAxis: 'Conexões Sociais & Propósito',
          partnerships: ['AABB Rondonópolis'],
        },
      ],
    },

    // NORDESTE
    BA: {
      uf: 'BA',
      name: 'Bahia',
      regionId: 'nordeste',
      ibpl: 66.5,
      associados: 9400,
      status: 'atencao',
      dominantStrength: 'Cultura, Música, Convivência Comunitária e Gastronomia',
      mainChallenge: 'Acessibilidade em ruas antigas e projetos de requalificação profissional 50+',
      cities: [
        {
          name: 'Salvador',
          uf: 'BA',
          ibpl: 67.4,
          associados: 5800,
          status: 'atencao',
          highlights: 'Orla da Barra/Ondina, Parque da Cidade, rica vida musical e AABB Salvador (Piatã)',
          priorityAxis: 'Trabalho & Propósito / Acessibilidade',
          partnerships: ['AABB Salvador', 'AFABB-BA', 'Casinha PREVI Salvador'],
        },
        {
          name: 'Feira de Santana',
          uf: 'BA',
          ibpl: 64.8,
          associados: 1900,
          status: 'atencao',
          highlights: 'Polo comercial no entroncamento do estado, precisando de mais opções de lazer verde',
          priorityAxis: 'Saúde Emocional & Lazer',
          partnerships: ['AABB Feira de Santana'],
        },
        {
          name: 'Vitória da Conquista',
          uf: 'BA',
          ibpl: 67.0,
          associados: 1700,
          status: 'atencao',
          highlights: 'Clima ameno na serra baiana, qualidade de vida e polo médico regional',
          priorityAxis: 'Saúde Física & Convivência',
          partnerships: ['AABB Vitória da Conquista'],
        },
      ],
    },
    PE: {
      uf: 'PE',
      name: 'Pernambuco',
      regionId: 'nordeste',
      ibpl: 67.2,
      associados: 6100,
      status: 'atencao',
      dominantStrength: 'Polo Médico do Nordeste, Arte, Frevo e Gastronomia',
      mainChallenge: 'Educação financeira contra endividamento e suporte a cuidadores familiares',
      cities: [
        {
          name: 'Recife / Olinda',
          uf: 'PE',
          ibpl: 68.1,
          associados: 4100,
          status: 'bom',
          highlights: 'Boa Viagem, Parque Dona Lindu, centros médicos renomados e AABB Recife',
          priorityAxis: 'Relacionamentos & Lazer Cultural',
          partnerships: ['AABB Recife', 'AFABB-PE', 'Polo Médico CASSI Ilha do Leite'],
        },
        {
          name: 'Caruaru / Petrolina',
          uf: 'PE',
          ibpl: 65.5,
          associados: 2000,
          status: 'atencao',
          highlights: 'Cultura do forró, orla do Rio São Francisco e feiras de artesanato',
          priorityAxis: 'Propósito & Mentoria Comunitária',
          partnerships: ['AABB Caruaru', 'AABB Petrolina'],
        },
      ],
    },
    CE: {
      uf: 'CE',
      name: 'Ceará',
      regionId: 'nordeste',
      ibpl: 67.8,
      associados: 5200,
      status: 'atencao',
      dominantStrength: 'Avenida Beira-Mar, Clima Solar o Ano Todo e Vínculos Familiares',
      mainChallenge: 'Orientação financeira preventiva e cuidados com a pele/hidratação',
      cities: [
        {
          name: 'Fortaleza',
          uf: 'CE',
          ibpl: 68.5,
          associados: 3800,
          status: 'bom',
          highlights: 'Calçadão da Beira-Mar com academias ao ar livre, AABB Fortaleza e feirinha',
          priorityAxis: 'Saúde Física & Lazer Praiano',
          partnerships: ['AABB Fortaleza', 'AFABB-CE'],
        },
        {
          name: 'Juazeiro do Norte / Sobral',
          uf: 'CE',
          ibpl: 65.9,
          associados: 1400,
          status: 'atencao',
          highlights: 'Forte religiosidade, hospitalidade e apoio comunitário',
          priorityAxis: 'Espiritualidade & Saúde Preventiva',
          partnerships: ['AABB Juazeiro do Norte'],
        },
      ],
    },
    RN: {
      uf: 'RN',
      name: 'Rio Grande do Norte',
      regionId: 'nordeste',
      ibpl: 68.4,
      associados: 2800,
      status: 'bom',
      dominantStrength: 'Ar Mais Puro das Américas, Praias e Calma',
      mainChallenge: 'Poucas alternativas de empreendedorismo sênior',
      cities: [
        {
          name: 'Natal',
          uf: 'RN',
          ibpl: 68.9,
          associados: 2100,
          status: 'bom',
          highlights: 'Parque das Dunas, Ponta Negra, caminhadas no ar puro e AABB Natal',
          priorityAxis: 'Saúde Física & Respiração',
          partnerships: ['AABB Natal'],
        },
        {
          name: 'Mossoró',
          uf: 'RN',
          ibpl: 66.2,
          associados: 700,
          status: 'atencao',
          highlights: 'Águas termais e teatro de rua histórico',
          priorityAxis: 'Lazer & Convívio',
          partnerships: ['AABB Mossoró'],
        },
      ],
    },
    PB: {
      uf: 'PB',
      name: 'Paraíba',
      regionId: 'nordeste',
      ibpl: 71.2,
      associados: 2900,
      status: 'bom',
      dominantStrength: 'Destaque em Qualidade de Vida, Orla Preservada e Segurança',
      mainChallenge: 'Ampliação de conexões com jovens e voluntariado institucional',
      cities: [
        {
          name: 'João Pessoa',
          uf: 'PB',
          ibpl: 71.8,
          associados: 2200,
          status: 'bom',
          highlights: 'Fechamento da orla às 5h para caminhadas, cidade verde e tranquilidade exemplar',
          priorityAxis: 'Lazer, Caminhada & Moradia',
          partnerships: ['AABB João Pessoa', 'Orla Ativa Jampa'],
        },
        {
          name: 'Campina Grande',
          uf: 'PB',
          ibpl: 69.1,
          associados: 700,
          status: 'bom',
          highlights: 'Parque do Povo, clima agradável e polo educacional',
          priorityAxis: 'Cultura & Música',
          partnerships: ['AABB Campina Grande'],
        },
      ],
    },
    AL: {
      uf: 'AL',
      name: 'Alagoas',
      regionId: 'nordeste',
      ibpl: 66.8,
      associados: 1600,
      status: 'atencao',
      dominantStrength: 'Mar Calmo de Piscinas Naturais e Convivência Afetuosa',
      mainChallenge: 'Acesso a centros de fisioterapia e reabilitação motora',
      cities: [
        {
          name: 'Maceió',
          uf: 'AL',
          ibpl: 67.5,
          associados: 1300,
          status: 'atencao',
          highlights: 'Pajuçara e Ponta Verde, calçadões planos e passeios náuticos',
          priorityAxis: 'Lazer & Convivência',
          partnerships: ['AABB Maceió'],
        },
      ],
    },
    SE: {
      uf: 'SE',
      name: 'Sergipe',
      regionId: 'nordeste',
      ibpl: 69.0,
      associados: 1440,
      status: 'bom',
      dominantStrength: 'Orla de Atalaia Estruturada e Trânsito Fluido',
      mainChallenge: 'Oferta de programas de desaposentação',
      cities: [
        {
          name: 'Aracaju',
          uf: 'SE',
          ibpl: 69.5,
          associados: 1200,
          status: 'bom',
          highlights: 'Orla de Atalaia com lagos e passarela do caranguejo, cidade plana e segura',
          priorityAxis: 'Mobilidade & Caminhada',
          partnerships: ['AABB Aracaju'],
        },
      ],
    },
    MA: {
      uf: 'MA',
      name: 'Maranhão',
      regionId: 'nordeste',
      ibpl: 65.0,
      associados: 1400,
      status: 'atencao',
      dominantStrength: 'Patrimônio Histórico, Bumba Meu Boi e Laços Solidários',
      mainChallenge: 'Infraestrutura hospitalar especializada fora da capital',
      cities: [
        {
          name: 'São Luís',
          uf: 'MA',
          ibpl: 65.8,
          associados: 1100,
          status: 'atencao',
          highlights: 'Avenida Litorânea, casarões históricos e gastronomia maranhense',
          priorityAxis: 'Saúde Emocional & Cultura',
          partnerships: ['AABB São Luís'],
        },
      ],
    },
    PI: {
      uf: 'PI',
      name: 'Piauí',
      regionId: 'nordeste',
      ibpl: 64.6,
      associados: 1100,
      status: 'atencao',
      dominantStrength: 'Polo Médico no Meio-Norte e Solidariedade Comunitária',
      mainChallenge: 'Altas temperaturas exigindo atividades indoor e hidratação',
      cities: [
        {
          name: 'Teresina',
          uf: 'PI',
          ibpl: 65.2,
          associados: 900,
          status: 'atencao',
          highlights: 'Polo de clínicas e hospitais, Parque da Cidadania e encontros AABB',
          priorityAxis: 'Saúde Preventiva & Conforto Térmico',
          partnerships: ['AABB Teresina'],
        },
      ],
    },

    // NORTE
    PA: {
      uf: 'PA',
      name: 'Pará',
      regionId: 'norte',
      ibpl: 65.2,
      associados: 4200,
      status: 'atencao',
      dominantStrength: 'Gastronomia Amazônica, Tradição Religiosa e Comunidade Unida',
      mainChallenge: 'Acessibilidade urbana sob chuvas e calor intenso',
      cities: [
        {
          name: 'Belém',
          uf: 'PA',
          ibpl: 66.5,
          associados: 2900,
          status: 'atencao',
          highlights: 'Mangal das Garças, Estação das Docas, Círio de Nazaré e AABB Belém',
          priorityAxis: 'Cultura & Saúde Emocional',
          partnerships: ['AABB Belém', 'AFABB-PA'],
        },
        {
          name: 'Santarém / Alter do Chão',
          uf: 'PA',
          ibpl: 64.0,
          associados: 750,
          status: 'atencao',
          highlights: 'Praias de água doce cristalinas no Rio Tapajós e tranquilidade ímpar',
          priorityAxis: 'Lazer Ecológico & Relaxamento',
          partnerships: ['AABB Santarém'],
        },
      ],
    },
    AM: {
      uf: 'AM',
      name: 'Amazonas',
      regionId: 'norte',
      ibpl: 65.8,
      associados: 2600,
      status: 'atencao',
      dominantStrength: 'Teatro Amazonas, Rio Negro e Identidade Cultural Forte',
      mainChallenge: 'Isolamento de municípios do interior dependentes de transporte fluvial',
      cities: [
        {
          name: 'Manaus',
          uf: 'AM',
          ibpl: 66.4,
          associados: 2200,
          status: 'atencao',
          highlights: 'Ponta Negra, Teatro Amazonas, Bosque da Ciência e AABB Manaus',
          priorityAxis: 'Lazer Cultural & Saúde Preventiva',
          partnerships: ['AABB Manaus'],
        },
      ],
    },
    TO: {
      uf: 'TO',
      name: 'Tocantins',
      regionId: 'norte',
      ibpl: 66.8,
      associados: 950,
      status: 'atencao',
      dominantStrength: 'Cidade Planejada, Praias de Rio e Qualidade do Ar',
      mainChallenge: 'Atividades recreativas nos meses mais secos do ano',
      cities: [
        {
          name: 'Palmas',
          uf: 'TO',
          ibpl: 67.2,
          associados: 780,
          status: 'atencao',
          highlights: 'Praia da Graciosa, Praça dos Girassóis plana e parque Cesamar',
          priorityAxis: 'Caminhada & Lazer Aquático',
          partnerships: ['AABB Palmas'],
        },
      ],
    },
    RO: {
      uf: 'RO',
      name: 'Rondônia',
      regionId: 'norte',
      ibpl: 64.1,
      associados: 1100,
      status: 'atencao',
      dominantStrength: 'Espírito Pioneiro e Convivência em Clubes AABB',
      mainChallenge: 'Especialidades gerontológicas e transporte adaptado',
      cities: [
        {
          name: 'Porto Velho',
          uf: 'RO',
          ibpl: 64.5,
          associados: 850,
          status: 'atencao',
          highlights: 'Estrada de Ferro Madeira-Mamoré e convivência associativa AABB',
          priorityAxis: 'Saúde Física & Telemedicina',
          partnerships: ['AABB Porto Velho'],
        },
      ],
    },
    AC: {
      uf: 'AC',
      name: 'Acre',
      regionId: 'norte',
      ibpl: 63.5,
      associados: 450,
      status: 'atencao',
      dominantStrength: 'Tranquilidade e Laços Fraternos',
      mainChallenge: 'Distância dos grandes centros médicos',
      cities: [
        {
          name: 'Rio Branco',
          uf: 'AC',
          ibpl: 63.8,
          associados: 380,
          status: 'atencao',
          highlights: 'Parque da Maternidade, artesanato e vida comunitária pacata',
          priorityAxis: 'Telemedicina & Apoio Domiciliar',
          partnerships: ['AABB Rio Branco'],
        },
      ],
    },
    AP: {
      uf: 'AP',
      name: 'Amapá',
      regionId: 'norte',
      ibpl: 63.8,
      associados: 310,
      status: 'atencao',
      dominantStrength: 'Fortaleza de São José e Clima Equatorial',
      mainChallenge: 'Pouca oferta de lazer voltado especificamente a 60+',
      cities: [
        {
          name: 'Macapá',
          uf: 'AP',
          ibpl: 64.0,
          associados: 260,
          status: 'atencao',
          highlights: 'Orla do Rio Amazonas e Monumento Marco Zero',
          priorityAxis: 'Lazer Comunitário',
          partnerships: ['AABB Macapá'],
        },
      ],
    },
    RR: {
      uf: 'RR',
      name: 'Roraima',
      regionId: 'norte',
      ibpl: 63.2,
      associados: 200,
      status: 'atencao',
      dominantStrength: 'Cidade Planejada e Arborização em Boa Vista',
      mainChallenge: 'Isolamento territorial extremo',
      cities: [
        {
          name: 'Boa Vista',
          uf: 'RR',
          ibpl: 63.5,
          associados: 180,
          status: 'atencao',
          highlights: 'Parque do Rio Branco, praças iluminadas e avenidas largas',
          priorityAxis: 'Teleatendimento & Vínculos',
          partnerships: ['AABB Boa Vista'],
        },
      ],
    },
  };

  const axisOptions: { id: AxisId; label: string; icon: any }[] = [
    { id: 'geral', label: 'IBPL Geral', icon: Sparkles },
    { id: 'saude_fisica', label: 'Saúde Física', icon: Activity },
    { id: 'saude_emocional', label: 'Saúde Emocional', icon: Heart },
    { id: 'trabalho_proposito', label: 'Trabalho & Propósito', icon: Compass },
    { id: 'relacionamentos', label: 'Relacionamentos', icon: Users },
    { id: 'recursos_financeiros', label: 'Recursos Financeiros', icon: ShieldCheck },
    { id: 'moradia', label: 'Moradia & Ambiente', icon: Building },
    { id: 'lazer', label: 'Lazer & Cultura', icon: Sparkles },
  ];

  const currentRegion = REGIONS_DATA[selectedRegionId] || REGIONS_DATA['sudeste'];
  const nationalAvg = NATIONAL_AVERAGES[selectedAxis];
  const currentScore = currentRegion.scores[selectedAxis];

  // List of states belonging to the selected region
  const regionStates = currentRegion.states
    .map((uf) => STATES_DATA[uf])
    .filter(Boolean) as StateData[];

  // Active state data if selected
  const activeState = selectedStateUf ? STATES_DATA[selectedStateUf] : null;

  // Filter cities by search and status
  const filteredCities = activeState
    ? activeState.cities.filter((city) => {
        const matchesSearch =
          city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
          city.highlights.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
          city.priorityAxis.toLowerCase().includes(citySearchQuery.toLowerCase());
        const matchesStatus =
          cityStatusFilter === 'todos' ? true : city.status === cityStatusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  // Comparison data for all 5 regions
  const comparisonData = Object.values(REGIONS_DATA).map((r) => ({
    name: r.shortName,
    score: r.scores[selectedAxis],
    isAboveNational: r.scores[selectedAxis] >= nationalAvg,
    id: r.id,
  }));

  // Handle region click
  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    // Auto-select the first state of this region
    const newReg = REGIONS_DATA[regionId];
    if (newReg && newReg.states.length > 0) {
      setSelectedStateUf(newReg.states[0]);
    } else {
      setSelectedStateUf(null);
    }
    setCitySearchQuery('');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Title & Eixo Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E4EE] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EEF3F7] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E6F7F6] text-[#0A7D76] rounded-full text-xs font-black uppercase tracking-wider border border-[#B4EBE6]">
              <MapPin className="w-3.5 h-3.5 text-[#12B8AE]" />
              <span>MAPA DIAGNÓSTICO DO IBPL POR REGIÃO, ESTADO E CIDADE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#163A63]">
              Onde Está Bem e Onde Precisa Melhorar
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6F82]">
              Selecione uma macrorregião para ver a relação de IBPL por Estado e clique no Estado para detalhar por Cidade.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold shrink-0 self-start md:self-auto">
            <div className="flex items-center gap-1.5 text-[#0A7D76]">
              <span className="w-3 h-3 rounded-full bg-[#12B8AE] shadow-xs" />
              <span>Onde está bem (≥ 70)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#C0392B]">
              <span className="w-3 h-3 rounded-full bg-[#E67E22] shadow-xs" />
              <span>Precisa melhorar (&lt; 68)</span>
            </div>
          </div>
        </div>

        {/* Eixo / Indicator Filter Buttons */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#164E7A] block">
            Selecione o Eixo ou Indicador para Análise no Mapa:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            {axisOptions.map((axis) => {
              const Icon = axis.icon;
              const isSelected = selectedAxis === axis.id;
              return (
                <button
                  key={axis.id}
                  onClick={() => setSelectedAxis(axis.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#163A63] text-white shadow-xs ring-2 ring-[#12B8AE]'
                      : 'bg-[#F4F7FA] text-[#5A6F82] hover:bg-[#EEF3F7] hover:text-[#163A63]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#12B8AE]' : 'text-[#5A6F82]'}`} />
                  <span>{axis.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map & Regional Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Visual Regional Map & Region Selection Cards */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-extrabold text-base text-[#163A63] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#12B8AE]" />
              <span>1. Clique em uma Região ({axisOptions.find((a) => a.id === selectedAxis)?.label})</span>
            </h4>
            <p className="text-xs text-[#5A6F82]">
              Clique em uma das 5 macrorregiões para carregar a relação de Estados e Cidades abaixo:
            </p>
          </div>

          {/* Regional Cards Interactive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.values(REGIONS_DATA).map((reg) => {
              const score = reg.scores[selectedAxis];
              const isSelected = selectedRegionId === reg.id;
              const isGood = score >= 70;
              const diffFromNational = (score - nationalAvg).toFixed(1);

              return (
                <div
                  key={reg.id}
                  onClick={() => handleSelectRegion(reg.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                    isSelected
                      ? 'bg-[#163A63] text-white border-[#163A63] shadow-md ring-2 ring-[#12B8AE]'
                      : isGood
                      ? 'bg-[#F4FBF9] hover:bg-[#E6F7F6] border-[#B4EBE6]'
                      : 'bg-[#FFFBF7] hover:bg-[#FFF3E6] border-[#FFE0B2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase ${isSelected ? 'text-[#B4EBE6]' : 'text-[#164E7A]'}`}>
                      {reg.name}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isGood
                          ? isSelected
                            ? 'bg-[#12B8AE] text-[#163A63]'
                            : 'bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]'
                          : isSelected
                          ? 'bg-[#E67E22] text-white'
                          : 'bg-[#FFF3E6] text-[#E67E22] border border-[#FFE0B2]'
                      }`}
                    >
                      {isGood ? 'Está Bem 🟢' : 'Precisa Melhorar 🟡'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-2xl font-black">{score}</span>
                      <span className={`text-xs ${isSelected ? 'text-[#B4EBE6]' : 'text-[#5A6F82]'}`}>
                        {' '}
                        / 100
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold flex items-center ${
                        Number(diffFromNational) >= 0
                          ? isSelected
                            ? 'text-[#12B8AE]'
                            : 'text-[#0A7D76]'
                          : isSelected
                          ? 'text-amber-300'
                          : 'text-[#E67E22]'
                      }`}
                    >
                      {Number(diffFromNational) >= 0 ? '+' : ''}
                      {diffFromNational} vs Brasil
                    </span>
                  </div>

                  <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-[#D9E4EE]' : 'text-[#5A6F82]'}`}>
                    {reg.states.join(', ')} • {reg.totalAssociados.toLocaleString()} associados
                  </p>
                </div>
              );
            })}
          </div>

          {/* National Benchmark Info Callout */}
          <div className="p-3.5 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] flex items-center justify-between text-xs text-[#5A6F82]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#12B8AE]" />
              <span>
                Média Brasil no Eixo selecionado: <strong>{nationalAvg} pts</strong>
              </span>
            </div>
            <span className="text-[10px] text-[#164E7A] font-bold">12.486 associados na base</span>
          </div>
        </div>

        {/* Right 6 cols: Deep-Dive Diagnostic Panel on Selected Region */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-5 flex flex-col justify-between">
          {/* Header of selected region */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF3F7] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-[#163A63]">{currentRegion.name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    currentScore >= 70
                      ? 'bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]'
                      : 'bg-[#FFF3E6] text-[#E67E22] border border-[#FFE0B2]'
                  }`}
                >
                  {currentScore >= 70 ? 'STATUS: BOM / ELEVADO' : 'STATUS: ATENÇÃO / GARGALO'}
                </span>
              </div>
              <p className="text-xs text-[#5A6F82] mt-0.5">
                Estados: {currentRegion.states.join(', ')} • {currentRegion.totalAssociados.toLocaleString()} associados
              </p>
            </div>

            <div className="p-3 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-right shrink-0">
              <span className="text-[10px] text-[#5A6F82] uppercase font-bold block">
                Pontuação Regional
              </span>
              <span className="text-2xl font-black text-[#163A63]">{currentScore}</span>
              <span className="text-xs text-[#5A6F82]"> / 100</span>
            </div>
          </div>

          {/* 1. ONDE ESTÁ BEM (STRENGTHS) */}
          <div className="p-4 bg-[#F4FBF9] rounded-2xl border border-[#B4EBE6] space-y-2">
            <span className="text-xs font-black text-[#0A7D76] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#12B8AE]" />
              <span>O que está bem nesta região (Pontos Fortes)</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#2C3E50]">
              {currentRegion.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#12B8AE] font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. ONDE PRECISA MELHORAR (IMPROVEMENT AREAS) */}
          <div className="p-4 bg-[#FFFBF7] rounded-2xl border border-[#FFE0B2] space-y-2">
            <span className="text-xs font-black text-[#B25900] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E67E22]" />
              <span>Onde precisa melhorar (Pontos de Atenção & Desafios)</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#2C3E50]">
              {currentRegion.improvementAreas.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#E67E22] font-bold mt-0.5">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. AÇÕES & SOLUÇÕES RECOMENDADAS PREVI */}
          <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-[#D9E4EE] space-y-2">
            <span className="text-xs font-black text-[#164E7A] uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#12B8AE]" />
              <span>Ações Estratégicas PREVI Recomendadas para a Região</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#2C3E50]">
              {currentRegion.recommendedActions.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#12B8AE] shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: RELAÇÃO DE IBPL POR ESTADO (DRILLDOWN 1) */}
      {/* ============================================================ */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF3F7] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4F7FA] text-[#164E7A] rounded-full text-[11px] font-black uppercase tracking-wider border border-[#D9E4EE]">
              <Layers className="w-3.5 h-3.5 text-[#12B8AE]" />
              <span>2. RELAÇÃO DE IBPL POR ESTADO ({currentRegion.name.toUpperCase()})</span>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-[#163A63]">
              Estados da {currentRegion.name}
            </h4>
            <p className="text-xs text-[#5A6F82]">
              Clique em um Estado abaixo para filtrar os dados e carregar as cidades correspondentes:
            </p>
          </div>

          <div className="text-xs text-[#5A6F82] font-semibold">
            {regionStates.length} estado(s) na região
          </div>
        </div>

        {/* State Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regionStates.map((st) => {
            const isStateSelected = selectedStateUf === st.uf;
            const isGood = st.ibpl >= 70;

            return (
              <div
                key={st.uf}
                onClick={() => {
                  setSelectedStateUf(st.uf);
                  setCitySearchQuery('');
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative group ${
                  isStateSelected
                    ? 'bg-[#163A63] text-white border-[#163A63] shadow-md ring-2 ring-[#12B8AE]'
                    : isGood
                    ? 'bg-[#FAFBFD] hover:bg-[#F4FBF9] border-[#D9E4EE] hover:border-[#12B8AE]'
                    : 'bg-[#FAFBFD] hover:bg-[#FFFBF7] border-[#D9E4EE] hover:border-[#E67E22]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-xs ${
                        isStateSelected
                          ? 'bg-[#12B8AE] text-[#163A63]'
                          : 'bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]'
                      }`}
                    >
                      {st.uf}
                    </span>
                    <h5 className="font-extrabold text-sm line-clamp-1">{st.name}</h5>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      isGood
                        ? isStateSelected
                          ? 'bg-[#12B8AE] text-[#163A63]'
                          : 'bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]'
                        : isStateSelected
                        ? 'bg-[#E67E22] text-white'
                        : 'bg-[#FFF3E6] text-[#E67E22] border border-[#FFE0B2]'
                    }`}
                  >
                    {isGood ? 'Está Bem 🟢' : 'Atenção 🟡'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-black">{st.ibpl}</span>
                    <span className={`text-xs ${isStateSelected ? 'text-[#B4EBE6]' : 'text-[#5A6F82]'}`}>
                      {' '}
                      / 100 IBPL
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${isStateSelected ? 'text-[#D9E4EE]' : 'text-[#5A6F82]'}`}>
                    {st.associados.toLocaleString()} assoc.
                  </span>
                </div>

                <div className="space-y-1 text-xs border-t border-[#EEF3F7] pt-2">
                  <p className={`line-clamp-1 text-[11px] ${isStateSelected ? 'text-[#B4EBE6]' : 'text-[#2C3E50]'}`}>
                    <strong>Destaque:</strong> {st.dominantStrength}
                  </p>
                  <p className={`line-clamp-1 text-[11px] ${isStateSelected ? 'text-amber-200' : 'text-[#7F8C8D]'}`}>
                    <strong>Desafio:</strong> {st.mainChallenge}
                  </p>
                </div>

                <div
                  className={`text-[11px] font-bold flex items-center justify-between pt-1 ${
                    isStateSelected ? 'text-[#12B8AE]' : 'text-[#164E7A] group-hover:text-[#12B8AE]'
                  }`}
                >
                  <span>
                    {isStateSelected ? '✓ Estado Selecionado' : 'Clique para ver cidades'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: RELAÇÃO DE IBPL POR CIDADE (DRILLDOWN 2) */}
        {/* ============================================================ */}
        {activeState && (
          <div className="pt-6 border-t border-[#EEF3F7] space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAFBFD] p-5 rounded-2xl border border-[#D9E4EE]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#12B8AE]" />
                  <span className="text-xs font-extrabold uppercase text-[#164E7A]">
                    3. Detalhamento por Cidades ({activeState.name} - {activeState.uf})
                  </span>
                  <span className="text-[10px] bg-[#12B8AE]/20 text-[#0A7D76] font-black px-2 py-0.5 rounded-full">
                    {activeState.cities.length} Cidades Polo
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#163A63]">
                  Indicadores de Longevidade das Cidades em {activeState.name}
                </h4>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#5A6F82] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    placeholder="Buscar cidade ou polo..."
                    className="pl-8 pr-3 py-1.5 bg-white border border-[#D9E4EE] rounded-xl text-xs text-[#163A63] placeholder-[#5A6F82] focus:outline-none focus:ring-2 focus:ring-[#12B8AE] w-48 sm:w-60"
                  />
                  {citySearchQuery && (
                    <button
                      onClick={() => setCitySearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A6F82] hover:text-[#163A63]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D9E4EE] text-xs font-bold">
                  <button
                    onClick={() => setCityStatusFilter('todos')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      cityStatusFilter === 'todos'
                        ? 'bg-[#163A63] text-white shadow-xs'
                        : 'text-[#5A6F82] hover:text-[#163A63]'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setCityStatusFilter('bom')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      cityStatusFilter === 'bom'
                        ? 'bg-[#12B8AE] text-[#163A63] shadow-xs'
                        : 'text-[#5A6F82] hover:text-[#0A7D76]'
                    }`}
                  >
                    Está Bem (≥70)
                  </button>
                  <button
                    onClick={() => setCityStatusFilter('atencao')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      cityStatusFilter === 'atencao'
                        ? 'bg-[#E67E22] text-white shadow-xs'
                        : 'text-[#5A6F82] hover:text-[#E67E22]'
                    }`}
                  >
                    Atenção (&lt;70)
                  </button>
                </div>
              </div>
            </div>

            {/* City Cards Grid */}
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCities.map((city, idx) => {
                  const isCityGood = city.ibpl >= 70;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-2xl border border-[#D9E4EE] hover:border-[#12B8AE] hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#12B8AE]" />
                            <h5 className="font-extrabold text-sm text-[#163A63]">{city.name}</h5>
                          </div>

                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isCityGood
                                ? 'bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]'
                                : 'bg-[#FFF3E6] text-[#E67E22] border border-[#FFE0B2]'
                            }`}
                          >
                            {isCityGood ? 'Está Bem 🟢' : 'Precisa Melhorar 🟡'}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between py-1 bg-[#FAFBFD] px-3 rounded-xl border border-[#EEF3F7]">
                          <div>
                            <span className="text-xl font-black text-[#163A63]">{city.ibpl}</span>
                            <span className="text-xs text-[#5A6F82]"> / 100 IBPL</span>
                          </div>
                          <span className="text-xs font-bold text-[#164E7A]">
                            {city.associados.toLocaleString()} aposentados
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-[#2C3E50]">
                          <p>
                            <strong className="text-[#164E7A]">Destaques:</strong> {city.highlights}
                          </p>
                          <p>
                            <strong className="text-[#164E7A]">Foco de Atenção:</strong>{' '}
                            <span className="text-[#C0392B] font-semibold">{city.priorityAxis}</span>
                          </p>
                        </div>
                      </div>

                      {/* Parcerias & Hubs Locais */}
                      <div className="border-t border-[#EEF3F7] pt-2.5 space-y-1">
                        <span className="text-[10px] font-black text-[#5A6F82] uppercase tracking-wider block">
                          Parcerias e Hubs Ativos:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {city.partnerships.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-2 py-0.5 bg-[#F4F7FA] text-[#163A63] rounded-lg text-[10px] font-bold border border-[#D9E4EE]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FAFBFD] rounded-2xl border border-dashed border-[#D9E4EE] space-y-2">
                <p className="text-xs font-bold text-[#5A6F82]">
                  Nenhuma cidade encontrada com os filtros selecionados em {activeState.name}.
                </p>
                <button
                  onClick={() => {
                    setCitySearchQuery('');
                    setCityStatusFilter('todos');
                  }}
                  className="px-3 py-1.5 bg-[#163A63] text-white rounded-xl text-xs font-bold hover:bg-[#12B8AE] hover:text-[#163A63] transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Bar Chart Across 5 Regions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-4">
          <div>
            <h4 className="font-extrabold text-base text-[#163A63]">
              Comparativo Regional no Eixo: {axisOptions.find((a) => a.id === selectedAxis)?.label}
            </h4>
            <p className="text-xs text-[#5A6F82]">
              Linha de referência nacional fixada em {nationalAvg} pontos
            </p>
          </div>

          <div className="text-xs text-[#5A6F82] font-semibold">
            Valores médios agregados (0 a 100)
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F7" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#163A63', fontWeight: 700 }} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#5A6F82' }} />
              <RechartsTooltip />
              <Bar dataKey="score" name="Pontuação Regional" radius={[6, 6, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score >= 70 ? '#12B8AE' : '#E67E22'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
