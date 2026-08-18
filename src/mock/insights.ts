export interface StrategicInsight {
  id: string;
  tag: string;
  title: string;
  description: string;
  dimension: string;
  category: 'Oportunidade' | 'Tendência' | 'Engajamento' | 'Cobertura';
  accentColor: string;
}

export const STRATEGIC_INSIGHTS: StrategicInsight[] = [
  {
    id: 'insight_1',
    tag: 'Transição & Carreira',
    title: 'Alta procura em Trabalho e Propósito na Pré-Aposentadoria',
    description:
      'Trabalho e Propósito apresenta alta procura por soluções entre associados em transição para aposentadoria (55 a 62 anos), com 78% de interesse em mentorias e cursos flexíveis com parceiros como Maturi.',
    dimension: 'Trabalho e Propósito',
    category: 'Tendência',
    accentColor: '#164E7A',
  },
  {
    id: 'insight_2',
    tag: 'Gargalo de Oferta',
    title: 'Saúde Emocional demanda mais soluções de acolhimento',
    description:
      'Saúde Emocional apresenta demanda demonstrativa superior à quantidade de soluções atualmente disponíveis, indicando oportunidade imediata de ampliação do ecossistema de rodas de conversa e escuta guiada.',
    dimension: 'Saúde Emocional',
    category: 'Oportunidade',
    accentColor: '#1F5B89',
  },
  {
    id: 'insight_3',
    tag: 'Multiplicador de Valor',
    title: 'Experiências culturais potencializam Lazer e Vínculos',
    description:
      'Experiências culturais presenciais através da Easy Live e Sesc apresentam o maior índice de impacto percebido (4.9/5.0), fortalecendo simultaneamente as dimensões de Lazer e Relacionamentos familiares e comunitários.',
    dimension: 'Lazer e Cultura',
    category: 'Engajamento',
    accentColor: '#12B8AE',
  },
  {
    id: 'insight_4',
    tag: 'Habitabilidade 60+',
    title: 'Interesse crescente em adequação do lar e ergonomia preventiva',
    description:
      'Associados com mais de 70 anos registram crescente interesse em soluções de moradia segura e prevenção de acidentes domésticos, sugerindo parcerias em consultoria de acessibilidade residencial.',
    dimension: 'Moradia e Ambiente',
    category: 'Cobertura',
    accentColor: '#163A63',
  },
];
