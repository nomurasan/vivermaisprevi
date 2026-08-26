import { ContactPreference } from '../types';
export const FOLLOWUP_MESSAGE = 'Olá, Carlos! Como está o seu ciclo no Viver Mais PREVI? Se quiser, podemos conversar sobre seus avanços, dificuldades ou próximos passos.';
export const isFollowupDue = (lastInteraction: string) => Date.now() - new Date(lastInteraction).getTime() >= 30 * 24 * 60 * 60 * 1000;
export const followupLabel: Record<ContactPreference, string> = { mensal:'Lembretes mensais', trimestral:'Lembretes trimestrais', solicitar:'Somente quando eu solicitar', nao_receber:'Não quero receber mensagens' };
