import { verteileZeit } from './zeit';

export interface Session {
  datum: string;
  /** Minuten pro Block, in der Reihenfolge der Blöcke. */
  plan: number[];
  block: number;
  /** Aktive Übungszeit im aktuellen Block. */
  blockMs: number;
  gesamtMs: number;
  sterne: number;
  aufgaben: number;
  richtigImErsten: number;
  fertig: boolean;
}

const MINUTE = 60_000;

export function neueSession(datum: string, gesamtMinuten: number): Session {
  return {
    datum,
    plan: verteileZeit(gesamtMinuten),
    block: 0,
    blockMs: 0,
    gesamtMs: 0,
    sterne: 0,
    aufgaben: 0,
    richtigImErsten: 0,
    fertig: false,
  };
}

export function vergehen(s: Session, ms: number): Session {
  if (s.fertig || ms <= 0) return s;
  return { ...s, blockMs: s.blockMs + ms, gesamtMs: s.gesamtMs + ms };
}

/** Die Blockzeit ist um; gewechselt wird erst nach der laufenden Aufgabe. */
export function blockZeitUm(s: Session): boolean {
  return s.blockMs >= (s.plan[s.block] ?? 0) * MINUTE;
}

export function naechsterBlock(s: Session): Session {
  if (s.block + 1 >= s.plan.length) return { ...s, fertig: true };
  return { ...s, block: s.block + 1, blockMs: 0 };
}

export function restMs(s: Session): number {
  if (s.fertig) return 0;
  const offen = s.plan.slice(s.block).reduce((sum, m) => sum + m, 0) * MINUTE;
  return Math.max(0, offen - s.blockMs);
}

export function gesamtPlanMs(s: Session): number {
  return s.plan.reduce((sum, m) => sum + m, 0) * MINUTE;
}

export function geloest(s: Session, imErstenVersuch: boolean): Session {
  return {
    ...s,
    sterne: s.sterne + 1,
    aufgaben: s.aufgaben + 1,
    richtigImErsten: s.richtigImErsten + (imErstenVersuch ? 1 : 0),
  };
}
