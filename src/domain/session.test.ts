import { describe, expect, it } from 'vitest';
import { wocheVon, wochentagKurz } from './datum';
import { blockZeitUm, geloest, naechsterBlock, neueSession, restMs, vergehen } from './session';

const MIN = 60_000;

describe('Session', () => {
  it('plant die Blöcke nach der Tagesdauer', () => {
    expect(neueSession('2026-11-23', 10).plan).toEqual([2, 3, 3, 2]);
  });

  it('meldet das Ende der Blockzeit und wechselt zum nächsten Block', () => {
    let s = neueSession('2026-11-23', 10);
    s = vergehen(s, 2 * MIN - 1);
    expect(blockZeitUm(s)).toBe(false);
    s = vergehen(s, 1);
    expect(blockZeitUm(s)).toBe(true);
    s = naechsterBlock(s);
    expect(s.block).toBe(1);
    expect(s.blockMs).toBe(0);
    expect(restMs(s)).toBe(8 * MIN);
  });

  it('rechnet die Restzeit aus der gerechneten Zeit, nicht aus dem Block', () => {
    let s = vergehen(neueSession('2026-11-23', 10), 2 * MIN);
    s = { ...s, block: 3, blockMs: 0 };
    expect(restMs(s)).toBe(8 * MIN);
    expect(restMs(vergehen(s, 20 * MIN))).toBe(0);
  });

  it('ist nach dem letzten Block fertig', () => {
    let s = neueSession('2026-11-23', 5);
    for (let i = 0; i < 4; i++) s = naechsterBlock(vergehen(s, s.plan[s.block]! * MIN));
    expect(s.fertig).toBe(true);
    expect(restMs(s)).toBe(0);
    expect(vergehen(s, 1000)).toBe(s);
  });

  it('zählt Sterne und Treffer im ersten Versuch', () => {
    let s = geloest(neueSession('2026-11-23', 10), true);
    s = geloest(s, false);
    expect(s.sterne).toBe(2);
    expect(s.aufgaben).toBe(2);
    expect(s.richtigImErsten).toBe(1);
  });
});

describe('Datum', () => {
  it('liefert die Woche von Montag bis Sonntag', () => {
    const w = wocheVon('2026-11-21');
    expect(w[0]).toBe('2026-11-16');
    expect(w[6]).toBe('2026-11-22');
    expect(w.map(wochentagKurz)).toEqual(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);
  });

  it('funktioniert über den Monatswechsel', () => {
    expect(wocheVon('2026-12-02')[0]).toBe('2026-11-30');
  });
});
