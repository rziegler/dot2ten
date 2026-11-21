import { BLOECKE } from './bloecke';

export const MIN_MINUTEN = 5;
export const MAX_MINUTEN = 20;
export const STANDARD_MINUTEN = 10;

export function begrenzeMinuten(minuten: number): number {
  if (!Number.isFinite(minuten)) return STANDARD_MINUTEN;
  return Math.min(MAX_MINUTEN, Math.max(MIN_MINUTEN, Math.round(minuten)));
}

/**
 * Verteilt die Tageszeit proportional auf die Blöcke (Hamilton-Verfahren):
 * erst abrunden, den Rest nach grösstem Bruchteil vergeben (bei Gleichstand der
 * frühere Block). Jeder Block bekommt mindestens eine Minute.
 */
export function verteileZeit(gesamtMinuten: number, anteile: readonly number[] = BLOECKE.map((b) => b.anteil)): number[] {
  const summeAnteile = anteile.reduce((s, a) => s + a, 0);
  const roh = anteile.map((a) => (a * gesamtMinuten) / summeAnteile);
  const minuten = roh.map((r) => Math.floor(r));
  let rest = gesamtMinuten - minuten.reduce((s, m) => s + m, 0);

  const reihenfolge = roh
    .map((r, i) => ({ bruch: r - Math.floor(r), i }))
    .sort((x, y) => y.bruch - x.bruch || x.i - y.i);
  for (let j = 0; rest > 0; j = (j + 1) % reihenfolge.length, rest--) {
    minuten[reihenfolge[j]!.i]!++;
  }

  for (let i = 0; i < minuten.length; i++) {
    while (minuten[i]! < 1) {
      const groesster = minuten.indexOf(Math.max(...minuten));
      if (minuten[groesster]! <= 1) break;
      minuten[groesster]!--;
      minuten[i]!++;
    }
  }
  return minuten;
}
