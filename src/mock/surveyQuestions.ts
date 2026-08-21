import { DimensionId } from '../types';

/**
 * Tipos do questionário demonstrativo de longevidade.
 * Os valores de score são normalizados entre 0 e 100.
 * A opção "Prefiro não responder" possui score: null e é ignorada no cálculo.
 */

export type SurveyScaleType =
  | 'frequencia'
  | 'concordancia'
  | 'satisfacao'
  | 'avaliacao'
  | 'preparo'
  | 'quantidade_fisica'
  | 'reserva_financeira'
  | 'reflexao_futuro'
  | 'compreensao_beneficio';

export interface SurveyOption {
  label: string;
  /** Pontuação normalizada entre 0 e 100. Use null para "Prefiro não responder". */
  score: number | null;
}

export interface SurveyQuestion {
  id: string;
  /** Código de origem na planilha piloto (Qxxx) ou "demonstrativa" quando criada para o protótipo. */
  sourceCode: string;
  axisId: DimensionId;
  text: string;
  scaleType: SurveyScaleType;
  options: SurveyOption[];
  required: boolean;
  isDemonstrative: boolean;
  sourceNote?: string;
}

export interface SurveyAxis {
  id: DimensionId;
  name: string;
  shortName: string;
  description: string;
  questions: SurveyQuestion[];
}

// ==========================================================
// Escalas padronizadas
// ==========================================================

export const FREQUENCIA_OPTIONS: SurveyOption[] = [
  { label: 'Nunca', score: 0 },
  { label: 'Raramente', score: 25 },
  { label: 'Às vezes', score: 50 },
  { label: 'Frequentemente', score: 75 },
  { label: 'Sempre', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const CONCORDANCIA_OPTIONS: SurveyOption[] = [
  { label: 'Discordo totalmente', score: 0 },
  { label: 'Discordo', score: 25 },
  { label: 'Nem concordo nem discordo', score: 50 },
  { label: 'Concordo', score: 75 },
  { label: 'Concordo totalmente', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const SATISFACAO_OPTIONS: SurveyOption[] = [
  { label: 'Muito insatisfeito', score: 0 },
  { label: 'Insatisfeito', score: 25 },
  { label: 'Regular', score: 50 },
  { label: 'Satisfeito', score: 75 },
  { label: 'Muito satisfeito', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const AVALIACAO_OPTIONS: SurveyOption[] = [
  { label: 'Muito ruim', score: 0 },
  { label: 'Ruim', score: 25 },
  { label: 'Regular', score: 50 },
  { label: 'Bom', score: 75 },
  { label: 'Muito bom', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const PREPARO_OPTIONS: SurveyOption[] = [
  { label: 'Nada preparado', score: 0 },
  { label: 'Pouco preparado', score: 25 },
  { label: 'Moderadamente preparado', score: 50 },
  { label: 'Bem preparado', score: 75 },
  { label: 'Muito preparado', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const ATIVIDADE_FISICA_OPTIONS: SurveyOption[] = [
  { label: 'Não pratico', score: 0 },
  { label: 'Até 2 vezes por semana', score: 33 },
  { label: '3 a 4 vezes por semana', score: 67 },
  { label: '5 ou mais vezes por semana', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const RESERVA_FINANCEIRA_OPTIONS: SurveyOption[] = [
  { label: 'Não possuo', score: 0 },
  { label: 'Pequena', score: 33 },
  { label: 'Moderada', score: 67 },
  { label: 'Significativa', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const REFLEXAO_FUTURO_OPTIONS: SurveyOption[] = [
  { label: 'Nada', score: 0 },
  { label: 'Pouco', score: 25 },
  { label: 'Moderadamente', score: 50 },
  { label: 'Bastante', score: 75 },
  { label: 'Muito', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

export const COMPREENSAO_BENEFICIO_OPTIONS: SurveyOption[] = [
  { label: 'Nada', score: 0 },
  { label: 'Pouco', score: 25 },
  { label: 'Razoavelmente', score: 50 },
  { label: 'Bem', score: 75 },
  { label: 'Totalmente', score: 100 },
  { label: 'Prefiro não responder', score: null },
];

// ==========================================================
// Catálogo demonstrativo por eixo
// ==========================================================

export const SURVEY_AXES: SurveyAxis[] = [
  {
    id: 'saude_fisica',
    name: 'Saúde Física',
    shortName: 'Física',
    description: 'Vitalidade, mobilidade, nutrição, sono reparador e hábitos preventivos para o corpo.',
    questions: [
      {
        id: 'SF01',
        sourceCode: 'Q003',
        axisId: 'saude_fisica',
        text: 'Com que frequência você se sente cheio de energia para realizar suas atividades diárias?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'SF02',
        sourceCode: 'Q005',
        axisId: 'saude_fisica',
        text: 'Você pratica atividade física regularmente?',
        scaleType: 'quantidade_fisica',
        options: ATIVIDADE_FISICA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'SF03',
        sourceCode: 'Q006',
        axisId: 'saude_fisica',
        text: 'Como você avalia seus hábitos de alimentação?',
        scaleType: 'avaliacao',
        options: AVALIACAO_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'SF04',
        sourceCode: 'Q007',
        axisId: 'saude_fisica',
        text: 'Você realiza exames preventivos de saúde regularmente?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'SF05',
        sourceCode: 'Q008',
        axisId: 'saude_fisica',
        text: 'Considerando sua saúde atual, você acredita que poderá manter independência para realizar suas atividades nos próximos anos?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
    ],
  },
  {
    id: 'saude_emocional',
    name: 'Saúde Emocional',
    shortName: 'Emocional',
    description: 'Equilíbrio interior, autorreflexão, serenidade e capacidade de lidar com transições.',
    questions: [
      {
        id: 'SE01',
        sourceCode: 'Q004',
        axisId: 'saude_emocional',
        text: 'Como você avalia seu bem-estar emocional atualmente?',
        scaleType: 'avaliacao',
        options: AVALIACAO_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote:
          'A codificação original de Q004 está marcada para revisão na planilha; usamos a escala demonstrativa de avaliação.',
      },
      {
        id: 'SE02',
        sourceCode: 'demonstrativa',
        axisId: 'saude_emocional',
        text: 'Com que frequência você consegue manter a serenidade diante de imprevistos?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'SE03',
        sourceCode: 'demonstrativa',
        axisId: 'saude_emocional',
        text: 'Você consegue reconhecer e acolher suas emoções sem se julgar?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'SE04',
        sourceCode: 'demonstrativa',
        axisId: 'saude_emocional',
        text: 'Com que frequência reserva algum tempo para cuidar de si e recuperar suas energias?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'SE05',
        sourceCode: 'Q029',
        axisId: 'saude_emocional',
        text: 'Quão preparado emocionalmente você se sente para lidar com mudanças nesta fase da vida?',
        scaleType: 'preparo',
        options: PREPARO_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q029 para uso universal (sem restrição de aposentadoria).',
      },
    ],
  },
  {
    id: 'relacionamentos',
    name: 'Relacionamentos',
    shortName: 'Vínculos',
    description: 'Laços familiares, amizades duradouras, convivência comunitária e pertencimento.',
    questions: [
      {
        id: 'RE01',
        sourceCode: 'Q033',
        axisId: 'relacionamentos',
        text: 'Você possui pessoas com quem pode contar em momentos difíceis?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'RE02',
        sourceCode: 'Q034',
        axisId: 'relacionamentos',
        text: 'Quão satisfeito você está com suas relações familiares?',
        scaleType: 'satisfacao',
        options: SATISFACAO_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'RE03',
        sourceCode: 'Q036',
        axisId: 'relacionamentos',
        text: 'Você sente que pertence a uma rede de apoio social?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'RE04',
        sourceCode: 'Q031',
        axisId: 'relacionamentos',
        text: 'As pessoas próximas participam das decisões importantes da sua vida quando você deseja?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q031 para uso universal.',
      },
      {
        id: 'RE05',
        sourceCode: 'demonstrativa',
        axisId: 'relacionamentos',
        text: 'Com que frequência você mantém contato com pessoas importantes para você?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
    ],
  },
  {
    id: 'trabalho_proposito',
    name: 'Trabalho e Propósito',
    shortName: 'Propósito',
    description: 'Projetos de vida, mentoria, voluntariado, aprendizagem contínua e realizações.',
    questions: [
      {
        id: 'TP01',
        sourceCode: 'Q021',
        axisId: 'trabalho_proposito',
        text: 'Você mantém atividades que lhe proporcionam realização pessoal?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q021 sem a condição "somente aposentados".',
      },
      {
        id: 'TP02',
        sourceCode: 'Q027',
        axisId: 'trabalho_proposito',
        text: 'Quanto você já refletiu sobre como deseja viver os próximos anos?',
        scaleType: 'reflexao_futuro',
        options: REFLEXAO_FUTURO_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q027 sem a condição "somente aposentados".',
      },
      {
        id: 'TP03',
        sourceCode: 'Q028',
        axisId: 'trabalho_proposito',
        text: 'Você possui um projeto pessoal estruturado para esta fase da vida?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q028 sem a condição "somente aposentados".',
      },
      {
        id: 'TP04',
        sourceCode: 'Q038',
        axisId: 'trabalho_proposito',
        text: 'Você possui objetivos pessoais claramente definidos para os próximos anos?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'TP05',
        sourceCode: 'Q039',
        axisId: 'trabalho_proposito',
        text: 'Você acredita que continuará desenvolvendo projetos pessoais nos próximos anos?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q039 sem a condição "somente aposentados".',
      },
    ],
  },
  {
    id: 'espiritualidade',
    name: 'Espiritualidade',
    shortName: 'Sentido',
    description: 'Conexão com valores profundos, transcendência, paz de espírito e filosofia de vida.',
    questions: [
      {
        id: 'ES01',
        sourceCode: 'Q037',
        axisId: 'espiritualidade',
        text: 'Você sente que sua vida tem propósito e significado?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'ES02',
        sourceCode: 'demonstrativa',
        axisId: 'espiritualidade',
        text: 'Suas escolhas estão alinhadas aos valores que considera essenciais?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'ES03',
        sourceCode: 'demonstrativa',
        axisId: 'espiritualidade',
        text: 'Com que frequência você pratica reflexão, oração, meditação ou alguma forma de contemplação?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'ES04',
        sourceCode: 'demonstrativa',
        axisId: 'espiritualidade',
        text: 'Com que frequência você sente paz interior no cotidiano?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'ES05',
        sourceCode: 'demonstrativa',
        axisId: 'espiritualidade',
        text: 'Você encontra força em suas crenças, valores ou filosofia de vida nos momentos difíceis?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
    ],
  },
  {
    id: 'lazer',
    name: 'Lazer e Cultura',
    shortName: 'Lazer',
    description: 'Momentos prazerosos, viagens, manifestações culturais, hobbies e descanso.',
    questions: [
      {
        id: 'LC01',
        sourceCode: 'Q035',
        axisId: 'lazer',
        text: 'Você participa de atividades sociais, culturais ou comunitárias?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q035 para uso universal.',
      },
      {
        id: 'LC02',
        sourceCode: 'demonstrativa',
        axisId: 'lazer',
        text: 'Com que frequência reserva tempo para lazer e descanso?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'LC03',
        sourceCode: 'demonstrativa',
        axisId: 'lazer',
        text: 'Você mantém algum hobby ou atividade que lhe proporciona prazer?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'LC04',
        sourceCode: 'demonstrativa',
        axisId: 'lazer',
        text: 'Com que frequência participa de atividades culturais, viagens, passeios ou novas experiências?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'LC05',
        sourceCode: 'demonstrativa',
        axisId: 'lazer',
        text: 'Você considera equilibrada a divisão do seu tempo entre obrigações e lazer?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
    ],
  },
  {
    id: 'recursos_financeiros',
    name: 'Recursos Financeiros',
    shortName: 'Finanças',
    description: 'Segurança econômica, organização orçamentária, planejamento de gastos e legado.',
    questions: [
      {
        id: 'RF01',
        sourceCode: 'Q013',
        axisId: 'recursos_financeiros',
        text: 'Você se sente financeiramente preparado para o futuro?',
        scaleType: 'preparo',
        options: PREPARO_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'RF02',
        sourceCode: 'Q014',
        axisId: 'recursos_financeiros',
        text: 'Você possui reserva financeira além do plano de previdência?',
        scaleType: 'reserva_financeira',
        options: RESERVA_FINANCEIRA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'RF03',
        sourceCode: 'Q015',
        axisId: 'recursos_financeiros',
        text: 'Você acompanha regularmente sua situação previdenciária?',
        scaleType: 'frequencia',
        options: FREQUENCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'RF04',
        sourceCode: 'Q016',
        axisId: 'recursos_financeiros',
        text: 'Você compreende as opções de benefício disponíveis em seu plano de previdência?',
        scaleType: 'compreensao_beneficio',
        options: COMPREENSAO_BENEFICIO_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'RF05',
        sourceCode: 'Q022',
        axisId: 'recursos_financeiros',
        text: 'Você considera sua renda suficiente para atender suas necessidades atuais?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: false,
        sourceNote: 'Adaptação de Q022 para uso universal.',
      },
    ],
  },
  {
    id: 'moradia',
    name: 'Moradia e Ambiente',
    shortName: 'Moradia',
    description: 'Conforto, segurança, acessibilidade do lar e harmonia com a vizinhança.',
    questions: [
      {
        id: 'MO01',
        sourceCode: 'Q025',
        axisId: 'moradia',
        text: 'Quão satisfeito você está com sua moradia atual?',
        scaleType: 'satisfacao',
        options: SATISFACAO_OPTIONS,
        required: true,
        isDemonstrative: false,
      },
      {
        id: 'MO02',
        sourceCode: 'demonstrativa',
        axisId: 'moradia',
        text: 'Sua moradia oferece segurança e conforto para sua rotina?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'MO03',
        sourceCode: 'demonstrativa',
        axisId: 'moradia',
        text: 'Sua moradia possui ou permite adaptações de acessibilidade quando necessário?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'MO04',
        sourceCode: 'demonstrativa',
        axisId: 'moradia',
        text: 'O entorno da sua moradia facilita o acesso a serviços, transporte e convivência?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
      {
        id: 'MO05',
        sourceCode: 'demonstrativa',
        axisId: 'moradia',
        text: 'Os custos da sua moradia são compatíveis com seu orçamento atual?',
        scaleType: 'concordancia',
        options: CONCORDANCIA_OPTIONS,
        required: true,
        isDemonstrative: true,
      },
    ],
  },
];

export const SURVEY_VERSION = 'v1';

export function getAllSurveyQuestions(): SurveyQuestion[] {
  return SURVEY_AXES.flatMap((axis) => axis.questions);
}

export function getSurveyQuestionById(id: string): SurveyQuestion | undefined {
  return getAllSurveyQuestions().find((q) => q.id === id);
}

export function getSurveyAxisById(id: DimensionId): SurveyAxis | undefined {
  return SURVEY_AXES.find((a) => a.id === id);
}
