import { describe, expect, it } from 'vitest';
import { begrenzeMinuten, verteileZeit } from './zeit';

describe('verteileZeit', () => {
  it('teilt 10 Minuten in 2, 3, 3 und 2', () => {
    expect(verteileZeit(10)).toEqual([2, 3, 3, 2]);
  });

  it('verteilt 20 Minuten proportional', () => {
    expect(verteileZeit(20)).toEqual([4, 6, 6, 4]);
  });

  it('vergibt bei 5 Minuten die Restminute an den grössten Bruchteil (früherer Block bei Gleichstand)', () => {
    expect(verteileZeit(5)).toEqual([1, 2, 1, 1]);
  });

  it('vergibt bei 7 Minuten den Rest nach grösstem Bruchteil', () => {
    // roh: 1.4, 2.1, 2.1, 1.4
    expect(verteileZeit(7)).toEqual([2, 2, 2, 1]);
  });

  it('vergibt bei 13 Minuten drei Restminuten', () => {
    // roh: 2.6, 3.9, 3.9, 2.6 → abgerundet 2, 3, 3, 2; Rest 3 an Block 2, 3, dann 1
    expect(verteileZeit(13)).toEqual([3, 4, 4, 2]);
  });

  it.each(Array.from({ length: 16 }, (_, i) => i + 5))('ergibt für %i Minuten die Summe und je mindestens 1 Minute', (m) => {
    const v = verteileZeit(m);
    expect(v).toHaveLength(4);
    expect(v.reduce((s, x) => s + x, 0)).toBe(m);
    expect(Math.min(...v)).toBeGreaterThanOrEqual(1);
  });

  it('gibt jedem Block mindestens 1 Minute, auch wenn die Anteile das nicht hergeben', () => {
    expect(verteileZeit(4, [10, 1, 1, 1])).toEqual([1, 1, 1, 1]);
    expect(verteileZeit(5, [10, 1, 1, 1])).toEqual([2, 1, 1, 1]);
  });
});

describe('begrenzeMinuten', () => {
  it('hält die Dauer zwischen 5 und 20', () => {
    expect(begrenzeMinuten(2)).toBe(5);
    expect(begrenzeMinuten(25)).toBe(20);
    expect(begrenzeMinuten(12.4)).toBe(12);
    expect(begrenzeMinuten(Number.NaN)).toBe(10);
  });
});
