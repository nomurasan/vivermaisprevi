import { LifeMoment } from '../types';

export const LIFE_MOMENTS: LifeMoment[] = [
  {
    id: 'aposentadoria_ativa',
    name: 'Aposentadoria Ativa',
    tagline: 'Novas rotinas, projetos com autonomia, relações sociais e descobertas.',
    description:
      'Esta fase caracteriza-se pela transição já consolidada para a aposentadoria, com tempo disponível para reorganizar prioridades, novos aprendizados, cultivo de relações e busca por propósito renovado.',
    commonEvents: [
      'Início de uma segunda carreira ou consultoria',
      'Atividades voluntárias e de mentoria',
      'Viagens e experiências culturais planejadas',
      'Nascimento ou convivência próxima com netos',
      'Reformulação de hábitos de saúde e lazer',
      'Planejamento de moradia e adaptações do lar',
    ],
    priorityDimensions: ['trabalho_proposito', 'saude_emocional', 'lazer', 'relacionamentos'],
    keyChallenges: [
      'Construção de uma rotina significativa sem a obrigação formal de horário',
      'Sentimento de perda de identidade profissional anterior',
      'Gestão do tempo livre para evitar isolamento',
    ],
    opportunities: [
      'Dedicar-se a paixões antigas deixadas em segundo plano',
      'Compartilhar sabedoria com novas gerações através de redes colaborativas',
      'Explorar novos destinos e enriquecimento cultural com amigos ou parceiros',
    ],
  },
  {
    id: 'pre_aposentadoria',
    name: 'Preparação para Nova Fase',
    tagline: 'Transição estratégica, planejamento financeiro e visão de futuro.',
    description:
      'Fase preparatória para quem está nos últimos anos de trabalho formal, exigindo reflexão sobre patrimônio, novos projetos de vida, saúde preventiva e reconfiguração das relações interpessoais.',
    commonEvents: [
      'Cálculo e simulação de benefício previdenciário',
      'Planejamento de rotina e projetos pós-carreira corporativa',
      'Capacitação em novas áreas de interesse',
      'Conversas familiares sobre divisão de tempo e finanças',
    ],
    priorityDimensions: ['recursos_financeiros', 'trabalho_proposito', 'saude_emocional', 'saude_fisica'],
    keyChallenges: [
      'Ansiedade diante da mudança repentina de ritmo e papéis sociais',
      'Insegurança sobre a adequação do orçamento futuro',
      'Dúvidas sobre o que fazer no primeiro ano de aposentadoria',
    ],
    opportunities: [
      'Iniciar cursos e conexões antes da saída do mercado formal',
      'Mapear redes de parceiros como Maturi para projetos flexíveis',
      'Realizar check-ups preventivos e adotar novos esportes',
    ],
  },
  {
    id: 'plenitude_longevidade',
    name: 'Longevidade Plena e Convivência',
    tagline: 'Valorização de vínculos, autocuidado físico, conforto e serenidade.',
    description:
      'Momento em que a experiência de vida atinge maturidade profunda, com foco primordial na preservação da mobilidade, segurança na moradia, rede de afetos e bem-estar espiritual.',
    commonEvents: [
      'Adaptação do lar para máxima segurança e acessibilidade',
      'Encontros frequentes com familiares e grupos de amigos de longa data',
      'Acompanhamento médico regular e atividades físicas de baixo impacto',
      'Organização de memórias familiares e legado afetivo',
    ],
    priorityDimensions: ['saude_fisica', 'moradia', 'relacionamentos', 'espiritualidade'],
    keyChallenges: [
      'Prevenção de quedas e manutenção da autonomia motora',
      'Preservação da rede de amizades e convivência social ativa',
      'Cuidados com a saúde ocular, auditiva e cardiovascular',
    ],
    opportunities: [
      'Participar de oficinas de memória, arte e encontros da comunidade PREVI',
      'Aproveitar benefícios de lazer e eventos culturais próximos de casa',
      'Viver com tranquilidade desfrutando da segurança previdenciária construída',
    ],
  },
  {
    id: 'cuidadores_e_familia',
    name: 'Apoio Familiar e Cuidados',
    tagline: 'Equilíbrio entre dedicação a entes queridos e preservação do autocuidado.',
    description:
      'Momento em que o associado divide seu tempo entre apoiar pais idosos, cônjuge ou netos, necessitando de suporte emocional e ferramentas para não negligenciar a própria saúde.',
    commonEvents: [
      'Gestão de consultas e rotina de cuidados de familiares',
      'Apoio no cuidado de netos em idade escolar',
      'Reorganização da residência para acessibilidade de dependentes',
    ],
    priorityDimensions: ['saude_emocional', 'saude_fisica', 'relacionamentos', 'recursos_financeiros'],
    keyChallenges: [
      'Sobrecarga física e desgaste emocional de cuidadores',
      'Falta de tempo para atividades individuais e lazer próprio',
    ],
    opportunities: [
      'Grupos de apoio e redes de acolhimento mútuo',
      'Serviços e parcerias com cuidadores profissionais e orientação de saúde',
    ],
  },
];
