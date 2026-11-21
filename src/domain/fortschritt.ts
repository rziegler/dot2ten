import type { FertigkeitId } from './fertigkeiten';

export type Stand = 'neu' | 'amUeben' | 'sicher';

export const STAND_TEXT: Record<Stand, string> = {
  neu: 'neu',
  amUeben: 'am Üben',
  sicher: 'sicher',
};

export interface FertigkeitStand {
  versuche: number;
  /** Ergebnisse der letzten Aufgaben (erster Versuch), neueste zuletzt. */
  letzte: boolean[];
}

export interface Fortschritt {
  fertigkeiten: Partial<Record<FertigkeitId, FertigkeitStand>>;
  /** Fehlerzähler pro Aufgabe (Schlüssel z. B. «8+6»); oft falsche kommen häufiger. */
  fehler: Record<string, number>;
}

const FENSTER = 10;
const MIN_VERSUCHE_UEBEN = 5;
const MIN_VERSUCHE_SICHER = 8;
const QUOTE_SICHER = 0.8;
const MAX_FEHLER = 5;

export function leererFortschritt(): Fortschritt {
  return { fertigkeiten: {}, fehler: {} };
}

function quote(f: FertigkeitStand): number {
  if (f.letzte.length === 0) return 0;
  return f.letzte.filter(Boolean).length / f.letzte.length;
}

export function standVon(f: FertigkeitStand | undefined): Stand {
  if (!f || f.versuche < MIN_VERSUCHE_UEBEN) return 'neu';
  if (f.versuche >= MIN_VERSUCHE_SICHER && quote(f) >= QUOTE_SICHER) return 'sicher';
  return 'amUeben';
}

/** Füllstand 0–1 für den Balken in der Elternansicht. */
export function fuellstand(f: FertigkeitStand | undefined): number {
  if (!f) return 0;
  return quote(f) * Math.min(1, f.versuche / FENSTER);
}

/** Sichere Fertigkeiten kommen seltener, solche am Üben am häufigsten. */
export function gewichtFuer(stand: Stand): number {
  return stand === 'sicher' ? 1 : stand === 'neu' ? 2 : 3;
}

export function erfasse(fortschritt: Fortschritt, fertigkeit: FertigkeitId, schluessel: string, richtig: boolean): Fortschritt {
  const alt = fortschritt.fertigkeiten[fertigkeit] ?? { versuche: 0, letzte: [] };
  const neu: FertigkeitStand = {
    versuche: alt.versuche + 1,
    letzte: [...alt.letzte, richtig].slice(-FENSTER),
  };
  const fehler = { ...fortschritt.fehler };
  const anzahl = (fehler[schluessel] ?? 0) + (richtig ? -1 : 1);
  if (anzahl <= 0) delete fehler[schluessel];
  else fehler[schluessel] = Math.min(MAX_FEHLER, anzahl);
  return { fertigkeiten: { ...fortschritt.fertigkeiten, [fertigkeit]: neu }, fehler };
}
