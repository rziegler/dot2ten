import { describe, expect, it } from 'vitest';
import type { FertigkeitId } from './fertigkeiten';
import { erfasse, leererFortschritt, type Fortschritt } from './fortschritt';
import { tippFuer } from './tipp';

function ueben(f: Fortschritt, id: FertigkeitId, ergebnisse: boolean[]): Fortschritt {
  return ergebnisse.reduce((x, r, i) => erfasse(x, id, `${id}${i}`, r), f);
}

describe('tippFuer', () => {
  it('nennt ohne Daten den Zehnerstopp und den Namen', () => {
    const t = tippFuer(leererFortschritt(), 'Paula');
    expect(t.fertigkeit).toBe('zehnerstopp');
    expect(t.text).toContain('Paula');
  });

  it('wählt die Fertigkeit am Üben mit dem tiefsten Stand', () => {
    let f = ueben(leererFortschritt(), 'tausch', [true, true, false, true, true]);
    f = ueben(f, 'umkehr', [false, false, true, false, true]);
    expect(tippFuer(f, '').fertigkeit).toBe('umkehr');
  });

  it('schreibt ohne Namen «euer Kind», am Satzanfang gross', () => {
    const f = ueben(leererFortschritt(), 'umkehr', [false, false, true, false, true]);
    expect(tippFuer(f, ' ').text).toContain('Euer Kind findet');
  });

  it('lobt, wenn alles sicher ist', () => {
    const ids: FertigkeitId[] = ['plus10', 'tausch', 'nachbar', 'verdoppeln', 'kleinGross', 'zehnerstopp', 'verliebt', 'umkehr'];
    const f = ids.reduce((x, id) => ueben(x, id, Array(10).fill(true)), leererFortschritt());
    const t = tippFuer(f, 'Paula');
    expect(t.fertigkeit).toBeUndefined();
    expect(t.text).toContain('Alle Tricks sitzen');
  });
});
