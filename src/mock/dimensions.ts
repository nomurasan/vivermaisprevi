import { DimensionConfig, DimensionId, StatusScore } from '../types';

export const DIMENSIONS: DimensionConfig[] = [
  {
    id: 'saude_fisica',
    name: 'Saúde Física',
    shortName: 'Física',
    description: 'Vitalidade, mobilidade, nutrição, sono reparador e hábitos preventivos para o corpo.',
    iconName: 'Activity',
    color: '#164E7A',
    lightBg: '#EBF3FA',
    borderColor: '#D9E4EE',
    guidingQuestion: 'Como você cuida do seu corpo, da sua mobilidade e da sua energia diária?',
    reflectionTip: 'Pequenos hábitos contínuos de movimento e sono fazem grande diferença na longevidade.',
  },
  {
    id: 'saude_emocional',
    name: 'Saúde Emocional',
    shortName: 'Emocional',
    description: 'Equilíbrio interior, autorreflexão, serenidade e capacidade de lidar com transições.',
    iconName: 'Heart',
    color: '#1F5B89',
    lightBg: '#EEF3F7',
    borderColor: '#D9E4EE',
    guidingQuestion: 'Como você percebe seu bem-estar psicológico e sua serenidade no dia a dia?',
    reflectionTip: 'Reconhecer sentimentos e reservar tempo para si mesmo fortalece a resiliência.',
  },
  {
    id: 'relacionamentos',
    name: 'Relacionamentos',
    shortName: 'Vínculos',
    description: 'Laços familiares, amizades duradouras, convivência comunitária e pertencimento.',
    iconName: 'Users',
    color: '#12B8AE',
    lightBg: '#E6F7F6',
    borderColor: '#B4EBE6',
    guidingQuestion: 'Quais conexões humanas e redes de apoio nutrem a sua rotina?',
    reflectionTip: 'Cultivar amizades e participar de grupos é um dos maiores protetores da longevidade.',
  },
  {
    id: 'trabalho_proposito',
    name: 'Trabalho e Propósito',
    shortName: 'Propósito',
    description: 'Projetos de vida, mentoria, voluntariado, aprendizagem contínua e realizações.',
    iconName: 'Compass',
    color: '#163A63',
    lightBg: '#EBF0F6',
    borderColor: '#CAD8E6',
    guidingQuestion: 'O que faz seus olhos brilharem e dá sentido às suas manhãs?',
    reflectionTip: 'Transições são ótimas oportunidades para resgatar projetos e compartilhar saberes.',
  },
  {
    id: 'espiritualidade',
    name: 'Espiritualidade',
    shortName: 'Sentido',
    description: 'Conexão com valores profundos, transcendência, paz de espírito e filosofia de vida.',
    iconName: 'Sun',
    color: '#1F5B89',
    lightBg: '#EEF3F7',
    borderColor: '#D9E4EE',
    guidingQuestion: 'Como você nutre sua paz interior e sua conexão com o que considera sagrado ou essencial?',
    reflectionTip: 'Práticas reflexivas e contemplativas promovem tranquilidade em qualquer fase.',
  },
  {
    id: 'lazer',
    name: 'Lazer e Cultura',
    shortName: 'Lazer',
    description: 'Momentos prazerosos, viagens, manifestações culturais, hobbies e descanso.',
    iconName: 'Sparkles',
    color: '#12B8AE',
    lightBg: '#E6F7F6',
    borderColor: '#B4EBE6',
    guidingQuestion: 'Quanto espaço você tem aberto para o divertimento, a arte e o novo?',
    reflectionTip: 'O lazer de qualidade renova a mente, ativa a criatividade e desperta alegria.',
  },
  {
    id: 'recursos_financeiros',
    name: 'Recursos Financeiros',
    shortName: 'Finanças',
    description: 'Segurança econômica, organização orçamentária, planejamento de gastos e legado.',
    iconName: 'ShieldCheck',
    color: '#164E7A',
    lightBg: '#EBF3FA',
    borderColor: '#D9E4EE',
    guidingQuestion: 'Como está a sua tranquilidade em relação ao planejamento do presente e do futuro?',
    reflectionTip: 'Clareza e organização dos recursos garantem liberdade para fazer escolhas conscientes.',
  },
  {
    id: 'moradia',
    name: 'Moradia e Ambiente',
    shortName: 'Moradia',
    description: 'Conforto, segurança, acessibilidade do lar e harmonia com a vizinhança.',
    iconName: 'Home',
    color: '#163A63',
    lightBg: '#EBF0F6',
    borderColor: '#CAD8E6',
    guidingQuestion: 'O seu espaço físico e seu entorno acolhem com segurança o seu estilo de vida?',
    reflectionTip: 'Ambientes seguros e confortáveis promovem independência e bem-estar contínuo.',
  },
];

export function getStatusFromScore(score: number): StatusScore {
  if (score >= 80) return 'FORTALECIDA';
  if (score >= 65) return 'ACOMPANHAR';
  return 'MERECE_ATENCAO';
}

export function getStatusLabel(status: StatusScore): string {
  switch (status) {
    case 'FORTALECIDA':
      return 'Fortalecida';
    case 'ACOMPANHAR':
      return 'Acompanhar';
    case 'MERECE_ATENCAO':
      return 'Merece atenção';
  }
}

export function getStatusColorClass(status: StatusScore): {
  badge: string;
  text: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case 'FORTALECIDA':
      return {
        badge: 'bg-[#E6F7F6] text-[#0A7D76] border-[#B4EBE6]',
        text: 'text-[#0A7D76]',
        bg: 'bg-[#E6F7F6]',
        border: 'border-[#12B8AE]',
      };
    case 'ACOMPANHAR':
      return {
        badge: 'bg-[#EBF3FA] text-[#164E7A] border-[#D9E4EE]',
        text: 'text-[#164E7A]',
        bg: 'bg-[#EBF3FA]',
        border: 'border-[#1F5B89]',
      };
    case 'MERECE_ATENCAO':
      return {
        badge: 'bg-[#EDF2F7] text-[#2C3E50] border-[#CAD8E6]',
        text: 'text-[#2C3E50]',
        bg: 'bg-[#EDF2F7]',
        border: 'border-[#5A6F82]',
      };
  }
}
