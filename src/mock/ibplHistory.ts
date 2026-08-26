import { DimensionId } from '../types';
export const IBPL_DIMENSIONS: { id: DimensionId; name: string; symbol: string }[] = [
  { id: 'saude_fisica', name: 'Saúde Física', symbol: '●' }, { id: 'saude_emocional', name: 'Saúde Emocional', symbol: '◆' },
  { id: 'relacionamentos', name: 'Relacionamentos', symbol: '▲' }, { id: 'trabalho_proposito', name: 'Trabalho e Propósito', symbol: '■' },
  { id: 'espiritualidade', name: 'Espiritualidade', symbol: '✦' }, { id: 'lazer', name: 'Lazer', symbol: '✚' },
  { id: 'recursos_financeiros', name: 'Recursos Financeiros', symbol: '◈' }, { id: 'moradia', name: 'Moradia', symbol: '⬟' },
];
export const IBPL_HISTORY = [
  { year: '2022', ibpl: 61, scores: [58, 55, 62, 60, 64, 57, 65, 66] }, { year: '2023', ibpl: 64, scores: [61, 60, 66, 62, 65, 60, 67, 67] },
  { year: '2024', ibpl: 68, scores: [64, 68, 70, 65, 68, 64, 70, 69] }, { year: '2025', ibpl: 72, scores: [69, 73, 76, 68, 70, 67, 73, 72] },
  { year: '2026', ibpl: 76, scores: [72, 79, 82, 72, 74, 70, 76, 75] },
];
