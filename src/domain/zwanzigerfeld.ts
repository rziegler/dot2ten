import type { Aufgabe } from './aufgaben';

export type Plaettchen = 'rot' | 'blau' | 'weg' | 'leer';

export interface Feld {
  art: Plaettchen;
  /** Mit offener Hilfe hervorgehoben, z. B. die Plättchen bis zum Zehnerstopp. */
  markiert: boolean;
}

/**
 * 20 Felder, 2 Reihen à 10. Plus: zuerst rot (erste Zahl), dann blau (zweite Zahl).
 * Minus: die erste Zahl rot, die weggenommenen am Ende durchgestrichen.
 */
export function zwanzigerfeld(x: Aufgabe, mitHilfe: boolean): Feld[] {
  const zehnerstopp = mitHilfe && x.fertigkeit === 'zehnerstopp';
  const felder: Feld[] = [];
  for (let k = 0; k < 20; k++) {
    let art: Plaettchen;
    let markiert = false;
    if (x.op === '+') {
      art = k < x.a ? 'rot' : k < x.a + x.b ? 'blau' : 'leer';
      markiert = zehnerstopp && art === 'blau' && k < 10;
    } else {
      art = k < x.ergebnis ? 'rot' : k < x.a ? 'weg' : 'leer';
      markiert = zehnerstopp && art === 'weg' && k >= 10;
    }
    felder.push({ art, markiert });
  }
  return felder;
}
