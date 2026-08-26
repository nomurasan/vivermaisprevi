import { JournalEntry } from '../types';
const VERSION = 1;
const key = (participantId: string) => `viver-mais:${participantId}:journal:v${VERSION}`;
export function loadJournal(participantId: string, fallback: JournalEntry[] = []): JournalEntry[] { try { const raw = localStorage.getItem(key(participantId)); if (!raw) return fallback; const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : fallback; } catch { return fallback; } }
export function saveJournal(participantId: string, entries: JournalEntry[]) { try { localStorage.setItem(key(participantId), JSON.stringify(entries)); } catch { /* fallback silencioso no protótipo */ } }
export function resetMeuViverMaisDemo(participantId: string) { try { localStorage.removeItem(key(participantId)); } catch { /* storage indisponível */ } }
