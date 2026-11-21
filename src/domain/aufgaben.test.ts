import { describe, expect, it } from 'vitest';
import { BLOECKE } from './bloecke';
import { aufgabenVonBlock, naechsteAufgabe, schluessel, type Aufgabe } from './aufgaben';
import { erfasse, leererFortschritt, type Fortschritt } from './fortschritt';
import { seedZufall } from './zufall';

const alle = BLOECKE.flatMap((b) => aufgabenVonBlock(b.id));

function ziehe(block: Parameters<typeof naechsteAufgabe>[0], fortschritt: Fortschritt, n: number, seed = 1): Aufgabe[] {
  const zufall = seedZufall(seed);
  const zuletzt: string[] = [];
  const out: Aufgabe[] = [];
  for (let i = 0; i < n; i++) {
    const x = naechsteAufgabe(block, fortschritt, zuletzt, zufall);
    out.push(x);
    zuletzt.push(schluessel(x));
    if (zuletzt.length > 3) zuletzt.shift();
  }
  return out;
}

describe('Aufgabenpools', () => {
  it('bleiben im Zahlenraum bis 20 mit positiven Zahlen', () => {
    for (const x of alle) {
      expect(x.a).toBeGreaterThan(0);
      expect(x.b).toBeGreaterThan(0);
      expect(x.ergebnis).toBeGreaterThanOrEqual(0);
      expect(Math.max(x.a, x.b, x.ergebnis)).toBeLessThanOrEqual(20);
      expect(x.ergebnis).toBe(x.op === '+' ? x.a + x.b : x.a - x.b);
    }
  });

  it('Plus bis 10 bleibt bis 10, verliebte Zahlen ergeben 10', () => {
    for (const x of aufgabenVonBlock('plus10')) {
      expect(x.op).toBe('+');
      expect(x.ergebnis).toBeLessThanOrEqual(10);
      if (x.fertigkeit === 'verliebt') expect(x.ergebnis).toBe(10);
      if (x.fertigkeit === 'verdoppeln') expect(x.a).toBe(x.b);
      if (x.fertigkeit === 'nachbar') expect(Math.abs(x.a - x.b)).toBe(1);
    }
  });

  it('Zehnerstopp-Aufgaben gehen über die 10, vorwärts und rückwärts', () => {
    const zs = alle.filter((x) => x.fertigkeit === 'zehnerstopp');
    expect(zs.some((x) => x.op === '+')).toBe(true);
    expect(zs.some((x) => x.op === '−')).toBe(true);
    for (const x of zs) {
      if (x.op === '+') {
        expect(x.a).toBeLessThan(10);
        expect(x.ergebnis).toBeGreaterThan(10);
      } else {
        expect(x.a).toBeGreaterThan(10);
        expect(x.ergebnis).toBeLessThan(10);
      }
    }
  });

  it('enthält 14 − 6 als Zehnerstopp rückwärts', () => {
    expect(aufgabenVonBlock('minus')).toContainEqual({ a: 14, op: '−', b: 6, ergebnis: 8, fertigkeit: 'zehnerstopp' });
  });

  it('kleine und grosse Aufgaben bleiben im gleichen Zehner', () => {
    for (const x of alle.filter((x) => x.fertigkeit === 'kleinGross')) {
      expect(x.a).toBeGreaterThan(10);
      expect(x.ergebnis).toBeGreaterThanOrEqual(10);
      expect(x.ergebnis).toBeLessThan(20);
    }
  });

  it('Tauschaufgaben beginnen mit der kleineren Zahl', () => {
    for (const x of aufgabenVonBlock('tausch')) {
      expect(x.a).toBeLessThan(x.b);
      expect(x.fertigkeit).toBe('tausch');
    }
  });

  it('enthalten jede Fertigkeit mindestens einmal', () => {
    const ids = new Set(alle.map((x) => x.fertigkeit));
    expect([...ids].sort()).toEqual(['kleinGross', 'nachbar', 'plus10', 'tausch', 'umkehr', 'verdoppeln', 'verliebt', 'zehnerstopp']);
  });
});

describe('naechsteAufgabe', () => {
  it('liefert nur Aufgaben aus dem Block', () => {
    for (const b of BLOECKE) {
      const pool = aufgabenVonBlock(b.id).map(schluessel);
      for (const x of ziehe(b.id, leererFortschritt(), 50)) expect(pool).toContain(schluessel(x));
    }
  });

  it('wiederholt die letzten Aufgaben nicht direkt', () => {
    const folge = ziehe('minus', leererFortschritt(), 200).map(schluessel);
    for (let i = 1; i < folge.length; i++) expect(folge[i]).not.toBe(folge[i - 1]);
  });

  it('ist mit gleichem Zufall reproduzierbar', () => {
    expect(ziehe('zehnerstopp', leererFortschritt(), 20, 42)).toEqual(ziehe('zehnerstopp', leererFortschritt(), 20, 42));
  });

  it('stellt im Block Zehnerstopp überwiegend Zehnerstopp-Aufgaben', () => {
    const n = ziehe('zehnerstopp', leererFortschritt(), 1000).filter((x) => x.fertigkeit === 'zehnerstopp').length;
    expect(n).toBeGreaterThan(450);
  });

  it('stellt sichere Fertigkeiten seltener', () => {
    let sicher = leererFortschritt();
    for (let i = 0; i < 10; i++) sicher = erfasse(sicher, 'plus10', `x${i}`, true);
    const vorher = ziehe('plus10', leererFortschritt(), 2000).filter((x) => x.fertigkeit === 'plus10').length;
    const nachher = ziehe('plus10', sicher, 2000).filter((x) => x.fertigkeit === 'plus10').length;
    expect(nachher).toBeLessThan(vorher * 0.7);
  });

  it('stellt oft falsch gelöste Aufgaben häufiger', () => {
    let f = leererFortschritt();
    for (let i = 0; i < 4; i++) f = erfasse(f, 'zehnerstopp', '8+6', false);
    const zaehle = (fs: Fortschritt) => ziehe('zehnerstopp', fs, 3000).filter((x) => schluessel(x) === '8+6').length;
    expect(zaehle(f)).toBeGreaterThan(zaehle(leererFortschritt()) * 3);
  });
});
