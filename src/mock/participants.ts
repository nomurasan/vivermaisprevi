import { Participant } from '../types';

export const PROFILES: Record<string, Participant> = {
  carlos: {
    id: 'carlos',
    name: 'Carlos Alberto Silveira',
    age: 64,
    gender: 'M',
    city: 'Brasília',
    state: 'DF',
    region: 'Centro-Oeste',
    planType: 'Plano 1',
    retirementStatus: 'Aposentado',
    yearsRetired: 2,
    persona: 'Aposentado Recente em Busca de Novos Rumos',
    lifeMomentId: 'aposentadoria_ativa',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ibpl: 72,
    ibplStatus: 'Bem-estar adequado',
    scores: {
      saude_fisica: 82,
      saude_emocional: 58,
      relacionamentos: 88,
      trabalho_proposito: 61,
      espiritualidade: 74,
      lazer: 69,
      recursos_financeiros: 76,
      moradia: 84,
    },
    declaredInterests: ['Trabalho e Propósito', 'Saúde Emocional', 'Lazer'],
  },
  marina: {
    id: 'marina',
    name: 'Marina Toledo Vasconcelos',
    age: 57,
    gender: 'F',
    city: 'São Paulo',
    state: 'SP',
    region: 'Sudeste',
    planType: 'PREVI Futuro',
    retirementStatus: 'Pré-aposentada',
    yearsRetired: 0,
    persona: 'Profissional em Transição Estratégica',
    lifeMomentId: 'pre_aposentadoria',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ibpl: 75,
    ibplStatus: 'Bem-estar adequado',
    scores: {
      saude_fisica: 78,
      saude_emocional: 63,
      relacionamentos: 79,
      trabalho_proposito: 59,
      espiritualidade: 70,
      lazer: 62,
      recursos_financeiros: 85,
      moradia: 88,
    },
    declaredInterests: ['Trabalho e Propósito', 'Recursos Financeiros', 'Saúde Física'],
  },
  roberto: {
    id: 'roberto',
    name: 'Roberto Mendes Drummond',
    age: 73,
    gender: 'M',
    city: 'Rio de Janeiro',
    state: 'RJ',
    region: 'Sudeste',
    planType: 'Plano 1',
    retirementStatus: 'Aposentado',
    yearsRetired: 15,
    persona: 'Veterano Focado em Convivência e Mobilidade',
    lifeMomentId: 'plenitude_longevidade',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ibpl: 78,
    ibplStatus: 'Bem-estar adequado',
    scores: {
      saude_fisica: 67,
      saude_emocional: 82,
      relacionamentos: 89,
      trabalho_proposito: 76,
      espiritualidade: 86,
      lazer: 78,
      recursos_financeiros: 81,
      moradia: 68,
    },
    declaredInterests: ['Saúde Física', 'Relacionamentos', 'Moradia'],
  },
};

// Gerador determinístico de 55 participantes sintéticos adicionais para estatísticas da comunidade e gestão
const REGIONS = [
  { region: 'Sudeste', states: ['SP', 'RJ', 'MG', 'ES'], cities: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Campinas', 'Vitória', 'Niterói'] },
  { region: 'Sul', states: ['RS', 'PR', 'SC'], cities: ['Porto Alegre', 'Curitiba', 'Florianópolis', 'Caxias do Sul', 'Londrina'] },
  { region: 'Nordeste', states: ['BA', 'PE', 'CE', 'RN'], cities: ['Salvador', 'Recife', 'Fortaleza', 'Natal', 'João Pessoa'] },
  { region: 'Centro-Oeste', states: ['DF', 'GO', 'MS', 'MT'], cities: ['Brasília', 'Goiânia', 'Campo Grande', 'Cuiabá'] },
  { region: 'Norte', states: ['PA', 'AM'], cities: ['Belém', 'Manaus'] },
];

const FIRST_NAMES_M = ['Antônio', 'Luiz', 'José', 'Paulo', 'Francisco', 'Marcos', 'Fernando', 'Sérgio', 'Ricardo', 'Eduardo', 'Jorge', 'Cláudio', 'Gilberto', 'César'];
const FIRST_NAMES_F = ['Maria', 'Ana', 'Tereza', 'Helena', 'Lúcia', 'Beatriz', 'Carmen', 'Sônia', 'Vera', 'Regina', 'Cláudia', 'Denise', 'Fátima', 'Elisabete'];
const LAST_NAMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes'];

export const SYNTHETIC_PARTICIPANTS: Participant[] = [
  PROFILES.carlos,
  PROFILES.marina,
  PROFILES.roberto,
];

// Seed additional 55 synthetic records
for (let i = 1; i <= 55; i++) {
  const isFemale = i % 2 === 0;
  const firstName = isFemale ? FIRST_NAMES_F[i % FIRST_NAMES_F.length] : FIRST_NAMES_M[i % FIRST_NAMES_M.length];
  const lastName1 = LAST_NAMES[i % LAST_NAMES.length];
  const lastName2 = LAST_NAMES[(i * 3 + 2) % LAST_NAMES.length];
  const age = 52 + ((i * 7) % 32); // ages 52 to 83
  const isRetired = age >= 59;
  const yearsRetired = isRetired ? Math.max(1, age - 58) : 0;
  const regionObj = REGIONS[i % REGIONS.length];
  const state = regionObj.states[i % regionObj.states.length];
  const city = regionObj.cities[i % regionObj.cities.length];
  const planType = age > 65 ? 'Plano 1' : i % 3 === 0 ? 'PREVI Família' : 'PREVI Futuro';
  
  let lifeMomentId = 'aposentadoria_ativa';
  if (!isRetired) lifeMomentId = 'pre_aposentadoria';
  else if (age >= 72) lifeMomentId = 'plenitude_longevidade';
  else if (i % 5 === 0) lifeMomentId = 'cuidadores_e_familia';

  const basePhysical = 60 + ((i * 13 + age) % 35);
  const baseEmotional = 55 + ((i * 17) % 40);
  const baseRel = 65 + ((i * 11) % 32);
  const baseWork = !isRetired ? 60 + (i % 25) : 50 + ((i * 9) % 42);
  const baseSpirit = 60 + ((i * 19) % 36);
  const baseLeisure = 55 + ((i * 7) % 40);
  const baseFin = 68 + ((i * 5) % 28);
  const baseHome = 65 + ((i * 23) % 32);

  const scores = {
    saude_fisica: Math.min(96, Math.max(45, basePhysical)),
    saude_emocional: Math.min(95, Math.max(48, baseEmotional)),
    relacionamentos: Math.min(98, Math.max(52, baseRel)),
    trabalho_proposito: Math.min(95, Math.max(42, baseWork)),
    espiritualidade: Math.min(96, Math.max(50, baseSpirit)),
    lazer: Math.min(95, Math.max(46, baseLeisure)),
    recursos_financeiros: Math.min(98, Math.max(54, baseFin)),
    moradia: Math.min(97, Math.max(50, baseHome)),
  };

  const avg = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / 8
  );

  let ibplStatus: Participant['ibplStatus'] = 'Bem-estar adequado';
  if (avg >= 80) ibplStatus = 'Bem-estar elevado';
  else if (avg < 65) ibplStatus = 'Bem-estar em transição';

  SYNTHETIC_PARTICIPANTS.push({
    id: `participant_${i}`,
    name: `${firstName} ${lastName1} ${lastName2}`,
    age,
    gender: isFemale ? 'F' : 'M',
    city,
    state,
    region: regionObj.region as any,
    planType: planType as any,
    retirementStatus: isRetired ? 'Aposentado' : 'Pré-aposentado',
    yearsRetired,
    persona: isRetired ? `Aposentado (${yearsRetired} anos)` : 'Associado Ativo',
    lifeMomentId,
    avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 123456) % 9000000}?w=150&auto=format&fit=crop&q=80`,
    ibpl: avg,
    ibplStatus,
    scores,
  });
}
