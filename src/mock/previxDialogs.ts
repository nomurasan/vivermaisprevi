export interface PrevixMenuItem {
  id: string;
  label: string;
  actionType: 'explain_portrait' | 'discover_exp' | 'care_dimension' | 'life_moment' | 'partners' | 'my_plan' | 'explain_ibpl' | 'custom';
  responseTitle: string;
  responseMessages: string[];
  suggestedAction?: {
    label: string;
    route?: string;
    view?: string;
  };
  options?: { label: string; nextId: string }[];
}

export const PREVIX_MENU_OPTIONS: PrevixMenuItem[] = [
  {
    id: 'explain_portrait',
    label: 'Quero entender meu retrato',
    actionType: 'explain_portrait',
    responseTitle: 'Seu Retrato de Longevidade',
    responseMessages: [
      'Seu retrato é um reflexo das suas respostas na Pesquisa Vivendo Mais. Ele não define limites, mas convida a reconhecer o que já está forte e o que pode ganhar um carinho especial.',
      'Suas dimensões são organizadas em três faixas para visualização: Fortalecidas (80+), Acompanhar (65-79) e Merecem Atenção (<65).',
      'Lembre-se: o protagonismo é sempre seu para escolher por onde quer começar.',
    ],
    suggestedAction: {
      label: 'Ver Meu Retrato Completo',
      view: 'meu_viver_mais',
    },
  },
  {
    id: 'discover_exp',
    label: 'Quero descobrir experiências',
    actionType: 'discover_exp',
    responseTitle: 'Possibilidades sob Medida',
    responseMessages: [
      'Que ótimo! 😊 O Viver Mais reúne experiências selecionadas com parceiros de confiança como Maturi, Easy Live e Sesc.',
      'Você pode explorar atividades culturais, cursos de tecnologia, mentorias, passeios ao ar livre e muito mais!',
    ],
    suggestedAction: {
      label: 'Explorar Todas as Experiências',
      view: 'explorar',
    },
  },
  {
    id: 'care_dimension',
    label: 'Quero cuidar de uma área da minha vida',
    actionType: 'care_dimension',
    responseTitle: 'Escolha seu Foco',
    responseMessages: [
      'Cuidar de você é o melhor investimento para o futuro. As 8 áreas da vida são interconectadas:',
      '• Saúde Física & Emocional: energia e serenidade\n• Trabalho & Propósito: novos projetos e saberes\n• Lazer & Relacionamentos: alegria e vínculos\n• Finanças & Moradia: segurança e bem-estar',
    ],
    suggestedAction: {
      label: 'Ir para O que Quero Fazer',
      view: 'meu_viver_mais',
    },
  },
  {
    id: 'life_moment',
    label: 'Quero entender meu Momento de Vida',
    actionType: 'life_moment',
    responseTitle: 'Seu Momento Atual',
    responseMessages: [
      'Cada etapa da longevidade tem sua beleza e seus desafios singulares.',
      'Identificamos seu contexto para sugerir conteúdos e parcerias que façam sentido para as situações reais do seu dia a dia, como novas rotinas, convivência com a família ou novos projetos.',
    ],
    suggestedAction: {
      label: 'Ver Meu Momento de Vida',
      view: 'meu_viver_mais',
    },
  },
  {
    id: 'partners',
    label: 'Quero conhecer os parceiros',
    actionType: 'partners',
    responseTitle: 'Ecossistema de Confiança PREVI',
    responseMessages: [
      'A PREVI seleciona instituições com comprovada experiência em longevidade ativa.',
      'Destaque para a Maturi (desenvolvimento e conexões 50+), Easy Live (cultura, lazer e benefícios) e parceiros de saúde e educação.',
    ],
    suggestedAction: {
      label: 'Ver Parceiros no Explorar',
      view: 'explorar',
    },
  },
  {
    id: 'my_plan',
    label: 'Quero ver meu Plano',
    actionType: 'my_plan',
    responseTitle: 'Seu Espaço de Escolhas',
    responseMessages: [
      'No "Meu Plano Viver Mais", você guarda as experiências que chamaram sua atenção, sem prazos rígidos ou pressão.',
      'Ao concluir uma atividade, você pode contar o que achou para enriquecer o aprendizado de toda a comunidade!',
    ],
    suggestedAction: {
      label: 'Acessar Meu Plano',
      view: 'meu_plano',
    },
  },
  {
    id: 'desaposente_rede',
    label: 'Desaposente sua Rede (Conexões & Saberes)',
    actionType: 'custom',
    responseTitle: 'Desaposente sua Rede: Vínculos & Vitalidade',
    responseMessages: [
      'Que ótima escolha! 🤝 O "Desaposente sua Rede" foi pensado para conectar você a antigos colegas de trabalho, novas amizades e grupos de prática por afinidade.',
      'Você pode compartilhar o que sabe, expressar o que sempre quis aprender e descobrir parceiros para atividades com total segurança e respeito à sua privacidade (LGPD).',
      'Solidão, aqui não! O que você gostaria de explorar hoje?',
    ],
    suggestedAction: {
      label: 'Abrir Desaposente sua Rede',
      view: 'desaposente_rede',
    },
  },
  {
    id: 'explain_ibpl',
    label: 'Quero entender o IBPL',
    actionType: 'explain_ibpl',
    responseTitle: 'Sobre o IBPL Demonstrativo',
    responseMessages: [
      'O IBPL (Índice do Bem-Estar PREVI para a Longevidade) é um indicador orientador que sintetiza o equilíbrio geral entre as 8 dimensões.',
      'Ele não é uma "nota definitiva" nem uma competição: é apenas uma bússola para apoiar seu autocuidado contínuo.',
    ],
    suggestedAction: {
      label: 'Entender a Metodologia',
      view: 'como_funciona',
    },
  },
];

export const CONTEXTUAL_PROMPTS: Record<string, { prompt: string; reply: string; linkView?: string }> = {
  saude_emocional: {
    prompt: 'Quer que eu explique este resultado ou mostre possibilidades de acolhimento para Saúde Emocional?',
    reply: 'Saúde Emocional reflete sua serenidade e manejo de transições. Encontrei círculos de escuta empática e meditação guiada que podem te interessar.',
    linkView: 'explorar',
  },
  trabalho_proposito: {
    prompt: 'Quer conhecer possibilidades relacionadas a novos projetos, aprendizagem ou contribuição profissional?',
    reply: 'Excelente! A Maturi oferece trilhas de mentoria intergeracional e projetos flexíveis para valorizar sua bagagem.',
    linkView: 'explorar',
  },
  maturi: {
    prompt: 'Quer entender por que a Maturi apareceu recomendada para você?',
    reply: 'A Maturi conecta associados a novas oportunidades profissionais, palestras e networking sob medida para a maturidade.',
    linkView: 'explorar',
  },
  easylive: {
    prompt: 'Quer encontrar experiências de lazer e cultura que combinem com seu momento?',
    reply: 'A Easy Live traz ingressos com desconto para cinemas, espetáculos e passeios ideais para compartilhar com amigos e família.',
    linkView: 'explorar',
  },
  meu_plano: {
    prompt: 'Quer ajuda para escolher ou avaliar sua próxima experiência no Plano?',
    reply: 'Você pode salvar experiências aqui e marcá-las como realizadas quando vivenciá-las para nos contar o que achou!',
    linkView: 'meu_plano',
  },
  desaposente_rede: {
    prompt: 'Quer que eu mostre pessoas com histórias, hobbies e saberes parecidos com os seus?',
    reply: 'Com prazer! No Desaposente sua Rede, você conecta suas paixões e memórias com outros associados em grupos de prática e reconexões seguras.',
    linkView: 'desaposente_rede',
  },
};
