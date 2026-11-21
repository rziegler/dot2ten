import type { BlockId } from './bloecke';
import type { FertigkeitId } from './fertigkeiten';
import { gewichtFuer, standVon, type Fortschritt } from './fortschritt';
import { gewichtetWaehlen, type Zufall } from './zufall';

export type Operator = '+' | '−';

export interface Aufgabe {
  a: number;
  op: Operator;
  b: number;
  ergebnis: number;
  fertigkeit: FertigkeitId;
}

export function schluessel(x: Pick<Aufgabe, 'a' | 'op' | 'b'>): string {
  return `${x.a}${x.op === '+' ? '+' : '-'}${x.b}`;
}

function plus(a: number, b: number, fertigkeit: FertigkeitId): Aufgabe {
  return { a, op: '+', b, ergebnis: a + b, fertigkeit };
}

function minus(a: number, b: number, fertigkeit: FertigkeitId): Aufgabe {
  return { a, op: '−', b, ergebnis: a - b, fertigkeit };
}

function aufgabenPlus10(): Aufgabe[] {
  const liste: Aufgabe[] = [];
  for (let a = 1; a <= 9; a++) {
    for (let b = 1; a + b <= 10; b++) {
      const f: FertigkeitId = a + b === 10 ? 'verliebt' : a === b ? 'verdoppeln' : Math.abs(a - b) === 1 ? 'nachbar' : 'plus10';
      liste.push(plus(a, b, f));
    }
  }
  return liste;
}

function aufgabenZehnerstopp(): Aufgabe[] {
  const liste: Aufgabe[] = [];
  for (let a = 2; a <= 9; a++) {
    for (let b = 2; b <= 9; b++) {
      if (a + b <= 10) continue;
      const f: FertigkeitId = a === b ? 'verdoppeln' : Math.abs(a - b) === 1 ? 'nachbar' : 'zehnerstopp';
      liste.push(plus(a, b, f));
    }
  }
  for (let a = 11; a <= 18; a++) {
    for (let b = 1; (a % 10) + b <= 9; b++) liste.push(plus(a, b, 'kleinGross'));
  }
  return liste;
}

function aufgabenMinus(): Aufgabe[] {
  const liste: Aufgabe[] = [];
  for (let a = 2; a <= 10; a++) {
    for (let b = 1; b < a; b++) liste.push(minus(a, b, 2 * b === a ? 'verdoppeln' : 'umkehr'));
  }
  for (let a = 11; a <= 19; a++) {
    for (let b = 1; b <= 9; b++) {
      if (b > a % 10) liste.push(minus(a, b, 'zehnerstopp'));
      else liste.push(minus(a, b, 'kleinGross'));
    }
  }
  return liste;
}

function aufgabenTausch(): Aufgabe[] {
  const liste: Aufgabe[] = [];
  for (let a = 1; a <= 4; a++) {
    for (let b = a + 4; b <= 9; b++) liste.push(plus(a, b, 'tausch'));
  }
  for (let a = 1; a <= 4; a++) {
    for (let b = 11; b + a <= 19; b++) liste.push(plus(a, b, 'tausch'));
  }
  return liste;
}

const POOLS: Record<BlockId, readonly Aufgabe[]> = {
  plus10: aufgabenPlus10(),
  zehnerstopp: aufgabenZehnerstopp(),
  minus: aufgabenMinus(),
  tausch: aufgabenTausch(),
};

/** Grundgewicht der Fertigkeiten pro Block: das Hauptthema des Blocks überwiegt. */
const BASIS: Record<BlockId, Partial<Record<FertigkeitId, number>>> = {
  plus10: { plus10: 2, verliebt: 2, verdoppeln: 1, nachbar: 1 },
  zehnerstopp: { zehnerstopp: 4, verdoppeln: 1, nachbar: 1, kleinGross: 1 },
  minus: { umkehr: 3, zehnerstopp: 3, verdoppeln: 1, kleinGross: 1 },
  tausch: { tausch: 1 },
};

export function aufgabenVonBlock(block: BlockId): readonly Aufgabe[] {
  return POOLS[block];
}

/**
 * Wählt die nächste Aufgabe eines Blocks: zuerst eine Fertigkeit (Grundgewicht ×
 * Lernstand), dann eine Aufgabe dieser Fertigkeit, wobei oft falsch gelöste
 * Aufgaben häufiger kommen und die zuletzt gestellten vermieden werden.
 */
export function naechsteAufgabe(block: BlockId, fortschritt: Fortschritt, zuletzt: readonly string[], zufall: Zufall): Aufgabe {
  const pool = POOLS[block];
  const basis = BASIS[block];
  const fertigkeiten = Object.keys(basis) as FertigkeitId[];
  const fertigkeit =
    gewichtetWaehlen(fertigkeiten, (f) => (basis[f] ?? 0) * gewichtFuer(standVon(fortschritt.fertigkeiten[f])), zufall) ?? fertigkeiten[0]!;

  let kandidaten = pool.filter((x) => x.fertigkeit === fertigkeit && !zuletzt.includes(schluessel(x)));
  if (kandidaten.length === 0) kandidaten = pool.filter((x) => !zuletzt.includes(schluessel(x)));
  if (kandidaten.length === 0) kandidaten = [...pool];

  return gewichtetWaehlen(kandidaten, (x) => 1 + 3 * (fortschritt.fehler[schluessel(x)] ?? 0), zufall) ?? kandidaten[0]!;
}
