import { describe, expect, it } from 'vitest';
import { erfasse, fuellstand, gewichtFuer, leererFortschritt, standVon } from './fortschritt';

function mit(ergebnisse: boolean[]) {
  return ergebnisse.reduce((f, r, i) => erfasse(f, 'zehnerstopp', `k${i}`, r), leererFortschritt());
}

describe('Fortschritt', () => {
  it('ist ohne oder mit wenigen Versuchen neu', () => {
    expect(standVon(undefined)).toBe('neu');
    expect(standVon(mit([true, true, true, true]).fertigkeiten.zehnerstopp)).toBe('neu');
  });

  it('ist ab 5 Versuchen am Üben', () => {
    expect(standVon(mit([true, false, true, true, true]).fertigkeiten.zehnerstopp)).toBe('amUeben');
  });

  it('ist sicher ab 8 Versuchen mit mindestens 80 % richtig', () => {
    expect(standVon(mit([true, true, true, true, true, true, true, true]).fertigkeiten.zehnerstopp)).toBe('sicher');
    expect(standVon(mit([true, true, false, true, false, true, true, true]).fertigkeiten.zehnerstopp)).toBe('amUeben');
  });

  it('fällt wieder auf am Üben zurück, wenn neue Fehler kommen', () => {
    const r = [...Array(10).fill(true), false, false, false];
    expect(standVon(mit(r).fertigkeiten.zehnerstopp)).toBe('amUeben');
  });

  it('merkt sich nur die letzten 10 Ergebnisse', () => {
    expect(mit(Array(15).fill(true)).fertigkeiten.zehnerstopp?.letzte).toHaveLength(10);
  });

  it('zählt Fehler pro Aufgabe hoch und bei richtig wieder herunter', () => {
    let f = erfasse(leererFortschritt(), 'zehnerstopp', '8+6', false);
    f = erfasse(f, 'zehnerstopp', '8+6', false);
    expect(f.fehler['8+6']).toBe(2);
    f = erfasse(f, 'zehnerstopp', '8+6', true);
    f = erfasse(f, 'zehnerstopp', '8+6', true);
    expect(f.fehler['8+6']).toBeUndefined();
  });

  it('gewichtet am Üben am stärksten und sicher am schwächsten', () => {
    expect(gewichtFuer('amUeben')).toBeGreaterThan(gewichtFuer('neu'));
    expect(gewichtFuer('neu')).toBeGreaterThan(gewichtFuer('sicher'));
  });

  it('füllt den Balken nach Treffern und Anzahl Versuche', () => {
    expect(fuellstand(undefined)).toBe(0);
    expect(fuellstand(mit([true, true, true, true, true]).fertigkeiten.zehnerstopp)).toBe(0.5);
    expect(fuellstand(mit(Array(10).fill(true)).fertigkeiten.zehnerstopp)).toBe(1);
  });
});
