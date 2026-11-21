import { describe, expect, it } from 'vitest';
import type { Aufgabe } from './aufgaben';
import { hilfeFuer, lobFuer } from './hilfe';
import { zwanzigerfeld } from './zwanzigerfeld';

const plus86: Aufgabe = { a: 8, op: '+', b: 6, ergebnis: 14, fertigkeit: 'zehnerstopp' };
const minus146: Aufgabe = { a: 14, op: '−', b: 6, ergebnis: 8, fertigkeit: 'zehnerstopp' };

describe('hilfeFuer', () => {
  it('zeigt den Zehnerstopp vorwärts', () => {
    expect(hilfeFuer(plus86, false).zeilen).toEqual(['8 + 2 = 10', '10 + 4 = ?']);
    expect(hilfeFuer(plus86, true).zeilen).toEqual(['8 + 2 = 10', '10 + 4 = 14']);
  });

  it('zeigt den Zehnerstopp rückwärts mit Umkehraufgabe', () => {
    expect(hilfeFuer(minus146, true).zeilen).toEqual(['14 − 4 = 10', '10 − 2 = 8', 'Umkehraufgabe: 8 + 6 = 14']);
  });

  it('verrät das Ergebnis nicht, solange die Aufgabe offen ist', () => {
    const x: Aufgabe = { a: 12, op: '+', b: 4, ergebnis: 16, fertigkeit: 'kleinGross' };
    const h = hilfeFuer(x, false);
    expect(h.zeilen).toEqual(['2 + 4 = 6', '12 + 4 = ?']);
    expect(h.zeilen.join(' ')).not.toContain('16');
  });

  it('nennt die Umkehraufgabe beim Minus', () => {
    expect(hilfeFuer({ a: 8, op: '−', b: 3, ergebnis: 5, fertigkeit: 'umkehr' }, false).zeilen[0]).toBe('? + 3 = 8');
    expect(lobFuer(minus146)).toContain('8 + 6 = 14');
  });

  it('zeigt die Nachbaraufgabe', () => {
    expect(hilfeFuer({ a: 4, op: '+', b: 3, ergebnis: 7, fertigkeit: 'nachbar' }, false).zeilen[0]).toBe('3 + 3 = 6');
  });
});

describe('zwanzigerfeld', () => {
  it('legt beim Plus zuerst rot, dann blau', () => {
    const f = zwanzigerfeld(plus86, false).map((x) => x.art);
    expect(f.filter((x) => x === 'rot')).toHaveLength(8);
    expect(f.filter((x) => x === 'blau')).toHaveLength(6);
    expect(f.slice(0, 8).every((x) => x === 'rot')).toBe(true);
    expect(f.slice(8, 14).every((x) => x === 'blau')).toBe(true);
    expect(f.slice(14).every((x) => x === 'leer')).toBe(true);
  });

  it('streicht beim Minus die weggenommenen Plättchen durch', () => {
    const f = zwanzigerfeld(minus146, false).map((x) => x.art);
    expect(f.slice(0, 8).every((x) => x === 'rot')).toBe(true);
    expect(f.slice(8, 14).every((x) => x === 'weg')).toBe(true);
    expect(f.slice(14).every((x) => x === 'leer')).toBe(true);
  });

  it('markiert mit Hilfe die Plättchen bis zum Zehnerstopp', () => {
    expect(zwanzigerfeld(plus86, true).flatMap((x, i) => (x.markiert ? [i] : []))).toEqual([8, 9]);
    expect(zwanzigerfeld(minus146, true).flatMap((x, i) => (x.markiert ? [i] : []))).toEqual([10, 11, 12, 13]);
    expect(zwanzigerfeld(plus86, false).some((x) => x.markiert)).toBe(false);
  });

  it('legt getauscht zuerst die blauen, dann die roten Plättchen', () => {
    const tausch: Aufgabe = { a: 3, op: '+', b: 8, ergebnis: 11, fertigkeit: 'tausch' };
    const f = zwanzigerfeld(tausch, true, true).map((x) => x.art);
    expect(f.slice(0, 8).every((x) => x === 'blau')).toBe(true);
    expect(f.slice(8, 11).every((x) => x === 'rot')).toBe(true);
    expect(f.slice(11).every((x) => x === 'leer')).toBe(true);
    expect(zwanzigerfeld(tausch, true, false).map((x) => x.art).slice(0, 3)).toEqual(['rot', 'rot', 'rot']);
  });
});
