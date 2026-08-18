import {
  CatalogInterest,
  ParticipantExpandedProfile,
  InterestRole,
} from '../types';

export const INTEREST_ROLE_LABELS: Record<InterestRole, string> = {
  quero_aprender: 'Quero aprender',
  estou_aprendendo: 'Estou aprendendo',
  quero_praticar: 'Quero praticar',
  praticar_com_outros: 'Quero praticar com outras pessoas',
  posso_compartilhar: 'Posso compartilhar o que sei',
  posso_ensinar: 'Posso ensinar',
  conversar: 'Quero conversar sobre o assunto',
  participar_experiencias: 'Quero participar de experiências',
  encontrar_pessoas: 'Quero encontrar pessoas com esse interesse',
};

export const CATALOG_INTERESTS: CatalogInterest[] = [
  {
    id: 'violao',
    name: 'Violão',
    category: 'Música & Artes',
    icon: '🎸',
    active: true,
    description: 'Prática de acordes, rodas de música, MPB, clássico e violão popular.',
  },
  {
    id: 'guitarra',
    name: 'Guitarra',
    category: 'Música & Artes',
    icon: '🎸',
    active: true,
    description: 'Rock, blues, jazz, técnicas de solo e formação de pequenos conjuntos musicais.',
  },
  {
    id: 'pesca',
    name: 'Pesca',
    category: 'Ar Livre & Natureza',
    icon: '🎣',
    active: true,
    description: 'Pesca esportiva, passeios fluviais e costeiros, equipamentos e confraternizações.',
  },
  {
    id: 'marcenaria',
    name: 'Marcenaria',
    category: 'Ofício & Criação',
    icon: '🪵',
    active: true,
    description: 'Trabalho em madeira, restauração de móveis, entalhe e ferramentas manuais.',
  },
  {
    id: 'artesanato',
    name: 'Artesanato',
    category: 'Ofício & Criação',
    icon: '🎨',
    active: true,
    description: 'Pintura, cerâmica, costura criativa, crochê, encadernação e biojoias.',
  },
  {
    id: 'jardinagem',
    name: 'Jardinagem',
    category: 'Ar Livre & Natureza',
    icon: '🌱',
    active: true,
    description: 'Hortas caseiras, cultivo de orquídeas, plantas medicinais e paisagismo.',
  },
  {
    id: 'fotografia',
    name: 'Fotografia',
    category: 'Música & Artes',
    icon: '📷',
    active: true,
    description: 'Fotografia de paisagem, retratos, uso de celular e câmeras manuais, passeios fotográficos.',
  },
  {
    id: 'culinaria',
    name: 'Culinária',
    category: 'Gastronomia & Convivência',
    icon: '🍳',
    active: true,
    description: 'Gastronomia regional, pães artesanais, harmonização de vinhos e cafés especiais.',
  },
  {
    id: 'leitura',
    name: 'Leitura & Literatura',
    category: 'Cultura & Saber',
    icon: '📚',
    active: true,
    description: 'Clubes do livro, poesia, biografias, história e escrita criativa.',
  },
  {
    id: 'caminhada',
    name: 'Caminhada & Trilhas',
    category: 'Saúde & Movimento',
    icon: '🚶',
    active: true,
    description: 'Caminhadas ao ar livre em parques, circuitos urbanos e trilhas ecológicas leves.',
  },
  {
    id: 'viagens',
    name: 'Viagens & Turismo',
    category: 'Cultura & Saber',
    icon: '✈️',
    active: true,
    description: 'Turismo cultural, roteiros históricos, ecoturismo e dicas de viagens em grupo.',
  },
  {
    id: 'cultura',
    name: 'Cultura & Teatro',
    category: 'Cultura & Saber',
    icon: '🎭',
    active: true,
    description: 'Peças teatrais, exposições de arte, visitas a museus e saraus culturais.',
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia & IA',
    category: 'Educação & Inovação',
    icon: '💻',
    active: true,
    description: 'Ferramentas de Inteligência Artificial, smartphones, segurança digital e aplicativos.',
  },
  {
    id: 'esportes',
    name: 'Esportes & Tênis',
    category: 'Saúde & Movimento',
    icon: '🎾',
    active: true,
    description: 'Tênis de quadra, beach tennis, natação, hidroginástica e alongamento.',
  },
  {
    id: 'musica',
    name: 'Música & Canto',
    category: 'Música & Artes',
    icon: '🎵',
    active: true,
    description: 'Coral, apreciação musical, teoria melódica e canto popular.',
  },
  {
    id: 'voluntariado',
    name: 'Voluntariado & Ação Social',
    category: 'Propósito & Impacto',
    icon: '🤝',
    active: true,
    description: 'Mentoria para jovens, apoio a projetos comunitários e causas socioambientais.',
  },
  {
    id: 'idiomas',
    name: 'Idiomas & Conversação',
    category: 'Educação & Inovação',
    icon: '🌎',
    active: true,
    description: 'Grupos de conversação em inglês, espanhol, francês e italiano.',
  },
  {
    id: 'educacao',
    name: 'Educação & Mentoria',
    category: 'Propósito & Impacto',
    icon: '🧑‍🏫',
    active: true,
    description: 'Compartilhamento de saberes, formação cidadã e facilitação de grupos.',
  },
  {
    id: 'jogos',
    name: 'Jogos & Estratégia',
    category: 'Gastronomia & Convivência',
    icon: '🎲',
    active: true,
    description: 'Xadrez, damas, jogos de tabuleiro modernos e jogos de cartas para raciocínio.',
  },
  {
    id: 'danca',
    name: 'Dança & Expressão',
    category: 'Saúde & Movimento',
    icon: '💃',
    active: true,
    description: 'Dança de salão, forró, ritmos latinos e expressão corporal livre.',
  },
];

// Dados expandidos pré-carregados para demonstração consistente e cálculo real de afinidades
export const INITIAL_EXPANDED_PROFILES: Record<string, ParticipantExpandedProfile> = {
  carlos: {
    participantId: 'carlos',
    isCompleted: true,
    interests: [
      {
        interestId: 'violao',
        roles: ['quero_aprender', 'praticar_com_outros', 'participar_experiencias'],
      },
      {
        interestId: 'marcenaria',
        roles: ['quero_praticar', 'posso_compartilhar'],
      },
      {
        interestId: 'fotografia',
        roles: ['quero_praticar', 'conversar', 'participar_experiencias'],
      },
      {
        interestId: 'voluntariado',
        roles: ['posso_compartilhar', 'posso_ensinar', 'participar_experiencias'],
      },
    ],
    knowledgeItems: [
      {
        id: 'k1',
        title: 'Gestão de equipes e projetos no Banco do Brasil',
        category: 'Gestão',
        canShare: true,
      },
      {
        id: 'k2',
        title: 'Técnicas básicas de marcenaria e restauração de móveis',
        category: 'Marcenaria',
        canShare: true,
      },
      {
        id: 'k3',
        title: 'Planejamento e organização financeira familiar',
        category: 'Finanças',
        canShare: true,
      },
    ],
    learningWishes: [
      {
        id: 'lw1',
        text: 'Quero aprender a tocar violão e MPB em grupo.',
        interestId: 'violao',
      },
      {
        id: 'lw2',
        text: 'Tenho vontade de aprender a usar ferramentas de Inteligência Artificial no dia a dia.',
        interestId: 'tecnologia',
      },
    ],
    resumeActivities: [
      {
        id: 'rw1',
        text: 'Voltar a pescar aos finais de semana com amigos.',
        interestId: 'pesca',
      },
      {
        id: 'rw2',
        text: 'Voltar a pedalar ao redor do Lago Paranoá.',
        interestId: 'caminhada',
      },
    ],
    experimentWishes: [
      {
        id: 'ew1',
        text: 'Fazer uma viagem cultural de trem pela Serra Gaúcha com grupo de associados.',
      },
      {
        id: 'ew2',
        text: 'Participar de uma oficina de pães artesanais de fermentação natural.',
      },
    ],
    connectionPreferences: [
      'colegas',
      'mesmos_hobbies',
      'ensinar',
      'aprender_com_outros',
      'proximos',
      'presencial',
      'grupos_pratica',
      'intergeracional',
      'novas_amizades',
    ],
    availability: {
      periods: ['manha', 'tarde'],
      days: ['dias_uteis', 'finais_semana'],
      modality: 'ambos',
      displacementRadiusKm: 20,
    },
    privacy: {
      showName: true,
      showPhoto: true,
      showCity: true,
      showInterests: true,
      showLearningWishes: true,
      showShareKnowledge: true,
      showCareerHistory: true,
      allowColleaguesFind: true,
      allowInterestSuggestions: true,
      receiveInvites: true,
      joinGroups: true,
      shareContactAfterConnection: true,
    },
    trajectory: [
      {
        id: 't1',
        participantId: 'carlos',
        organization: 'Banco do Brasil',
        unitName: 'Agência Centro - Brasília/DF',
        role: 'Gerente de Contas',
        city: 'Brasília',
        state: 'DF',
        startYear: 1992,
        endYear: 2004,
      },
      {
        id: 't2',
        participantId: 'carlos',
        organization: 'Banco do Brasil',
        unitName: 'Diretoria de Tecnologia (DITEC)',
        role: 'Gerente Executivo Adjunto',
        city: 'Brasília',
        state: 'DF',
        startYear: 2004,
        endYear: 2016,
      },
      {
        id: 't3',
        participantId: 'carlos',
        organization: 'PREVI',
        unitName: 'Gerência de Atendimento e Benefícios',
        role: 'Consultor Sênior',
        city: 'Brasília',
        state: 'DF',
        startYear: 2016,
        endYear: 2024,
      },
    ],
    completedAt: '2026-08-16',
  },
  marina: {
    participantId: 'marina',
    isCompleted: true,
    interests: [
      {
        interestId: 'violao',
        roles: ['posso_compartilhar', 'posso_ensinar', 'praticar_com_outros'],
      },
      {
        interestId: 'tecnologia',
        roles: ['quero_aprender', 'conversar', 'participar_experiencias'],
      },
      {
        interestId: 'jardinagem',
        roles: ['quero_praticar', 'conversar'],
      },
      {
        interestId: 'fotografia',
        roles: ['quero_aprender', 'participar_experiencias'],
      },
    ],
    knowledgeItems: [
      {
        id: 'km1',
        title: 'Violão popular e canto em conjunto',
        category: 'Música',
        canShare: true,
      },
      {
        id: 'km2',
        title: 'Auditoria de processos e governança corporativa',
        category: 'Gestão',
        canShare: true,
      },
    ],
    learningWishes: [
      {
        id: 'lwm1',
        text: 'Quero aprender fotografia de natureza com smartphone.',
        interestId: 'fotografia',
      },
    ],
    resumeActivities: [
      {
        id: 'rwm1',
        text: 'Voltar a praticar yoga e meditação regularmente.',
        interestId: 'caminhada',
      },
    ],
    experimentWishes: [
      {
        id: 'ewm1',
        text: 'Montar um jardim de orquídeas e temperos em casa.',
      },
    ],
    connectionPreferences: [
      'colegas',
      'mesmos_hobbies',
      'aprender_com_outros',
      'online',
      'presencial',
      'novas_amizades',
    ],
    availability: {
      periods: ['noite', 'tarde'],
      days: ['finais_semana'],
      modality: 'ambos',
      displacementRadiusKm: 15,
    },
    privacy: {
      showName: true,
      showPhoto: true,
      showCity: true,
      showInterests: true,
      showLearningWishes: true,
      showShareKnowledge: true,
      showCareerHistory: true,
      allowColleaguesFind: true,
      allowInterestSuggestions: true,
      receiveInvites: true,
      joinGroups: true,
      shareContactAfterConnection: true,
    },
    trajectory: [
      {
        id: 'tm1',
        participantId: 'marina',
        organization: 'Banco do Brasil',
        unitName: 'Superintendência Regional São Paulo/SP',
        role: 'Auditora Plena',
        city: 'São Paulo',
        state: 'SP',
        startYear: 1998,
        endYear: 2012,
      },
      {
        id: 'tm2',
        participantId: 'marina',
        organization: 'Banco do Brasil',
        unitName: 'Diretoria de Tecnologia (DITEC)',
        role: 'Assessora Estratégica',
        city: 'Brasília',
        state: 'DF',
        startYear: 2012,
        endYear: 2018,
      },
    ],
    completedAt: '2026-08-17',
  },
  roberto: {
    participantId: 'roberto',
    isCompleted: true,
    interests: [
      {
        interestId: 'pesca',
        roles: ['posso_compartilhar', 'praticar_com_outros', 'participar_experiencias'],
      },
      {
        interestId: 'marcenaria',
        roles: ['quero_aprender', 'praticar_com_outros'],
      },
      {
        interestId: 'leitura',
        roles: ['conversar', 'encontrar_pessoas'],
      },
    ],
    knowledgeItems: [
      {
        id: 'kr1',
        title: 'Pesca esportiva e navegação em represas',
        category: 'Pesca',
        canShare: true,
      },
      {
        id: 'kr2',
        title: 'História do sistema financeiro e memórias bancárias',
        category: 'Educação',
        canShare: true,
      },
    ],
    learningWishes: [
      {
        id: 'lwr1',
        text: 'Aprender técnicas de marcenaria artesanal com madeira de reaproveitamento.',
        interestId: 'marcenaria',
      },
    ],
    resumeActivities: [
      {
        id: 'rwr1',
        text: 'Voltar a jogar dominó e xadrez em praças públicas.',
        interestId: 'jogos',
      },
    ],
    experimentWishes: [
      {
        id: 'ewr1',
        text: 'Organizar um clube de leitura com antigos colegas aposentados.',
      },
    ],
    connectionPreferences: [
      'colegas',
      'mesmos_hobbies',
      'proximos',
      'presencial',
      'grupos_pratica',
      'novas_amizades',
    ],
    availability: {
      periods: ['manha'],
      days: ['dias_uteis', 'finais_semana'],
      modality: 'presencial',
      displacementRadiusKm: 10,
    },
    privacy: {
      showName: true,
      showPhoto: true,
      showCity: true,
      showInterests: true,
      showLearningWishes: true,
      showShareKnowledge: true,
      showCareerHistory: true,
      allowColleaguesFind: true,
      allowInterestSuggestions: true,
      receiveInvites: true,
      joinGroups: true,
      shareContactAfterConnection: true,
    },
    trajectory: [
      {
        id: 'tr1',
        participantId: 'roberto',
        organization: 'Banco do Brasil',
        unitName: 'Agência Centro - Brasília/DF',
        role: 'Gerente Geral',
        city: 'Brasília',
        state: 'DF',
        startYear: 1980,
        endYear: 1995,
      },
      {
        id: 'tr2',
        participantId: 'roberto',
        organization: 'Banco do Brasil',
        unitName: 'Superintendência Regional Rio de Janeiro/RJ',
        role: 'Superintendente Adjunto',
        city: 'Rio de Janeiro',
        state: 'RJ',
        startYear: 1995,
        endYear: 2009,
      },
    ],
    completedAt: '2026-08-15',
  },
};

// Seed expanded profile for synthetic participants deterministically
export function getExpandedProfile(participantId: string): ParticipantExpandedProfile {
  if (INITIAL_EXPANDED_PROFILES[participantId]) {
    return { ...INITIAL_EXPANDED_PROFILES[participantId] };
  }

  // Generative profile for synthetic participants
  const interestsList = [
    CATALOG_INTERESTS[0],
    CATALOG_INTERESTS[3],
    CATALOG_INTERESTS[5],
    CATALOG_INTERESTS[6],
    CATALOG_INTERESTS[7],
    CATALOG_INTERESTS[8],
  ];

  return {
    participantId,
    isCompleted: true,
    interests: [
      {
        interestId: 'violao',
        roles: ['posso_compartilhar', 'praticar_com_outros'],
      },
      {
        interestId: 'marcenaria',
        roles: ['quero_aprender', 'praticar_com_outros'],
      },
      {
        interestId: 'fotografia',
        roles: ['quero_praticar', 'conversar'],
      },
    ],
    knowledgeItems: [
      {
        id: `k_${participantId}_1`,
        title: 'Prática de violão popular e canto',
        category: 'Música',
        canShare: true,
      },
    ],
    learningWishes: [
      {
        id: `lw_${participantId}_1`,
        text: 'Quero aprender marcenaria fina.',
        interestId: 'marcenaria',
      },
    ],
    resumeActivities: [
      {
        id: `rw_${participantId}_1`,
        text: 'Voltar a caminhar em parques pela manhã.',
        interestId: 'caminhada',
      },
    ],
    experimentWishes: [
      {
        id: `ew_${participantId}_1`,
        text: 'Participar de uma roda de conversa intergeracional.',
      },
    ],
    connectionPreferences: [
      'colegas',
      'mesmos_hobbies',
      'proximos',
      'presencial',
      'novas_amizades',
    ],
    availability: {
      periods: ['manha', 'tarde'],
      days: ['dias_uteis', 'finais_semana'],
      modality: 'ambos',
      displacementRadiusKm: 20,
    },
    privacy: {
      showName: true,
      showPhoto: true,
      showCity: true,
      showInterests: true,
      showLearningWishes: true,
      showShareKnowledge: true,
      showCareerHistory: true,
      allowColleaguesFind: true,
      allowInterestSuggestions: true,
      receiveInvites: true,
      joinGroups: true,
      shareContactAfterConnection: true,
    },
    trajectory: [
      {
        id: `t_${participantId}_1`,
        participantId,
        organization: 'Banco do Brasil',
        unitName: 'Agência Centro - Brasília/DF',
        role: 'Analista Sênior',
        city: 'Brasília',
        state: 'DF',
        startYear: 1995,
        endYear: 2005,
      },
    ],
    completedAt: '2026-08-18',
  };
}
