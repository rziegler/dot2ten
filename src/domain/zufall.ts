/** Zufallsquelle als Funktion, damit Tests deterministisch laufen können. */
export type Zufall = () => number;

export function gewichtetWaehlen<T>(eintraege: readonly T[], gewicht: (t: T) => number, zufall: Zufall): T | undefined {
  const gewichte = eintraege.map((e) => Math.max(0, gewicht(e)));
  const summe = gewichte.reduce((s, g) => s + g, 0);
  if (summe <= 0) return undefined;
  let r = zufall() * summe;
  for (let i = 0; i < eintraege.length; i++) {
    r -= gewichte[i]!;
    if (r < 0) return eintraege[i];
  }
  return eintraege[eintraege.length - 1];
}

/** Kleiner deterministischer Generator (mulberry32) für Tests. */
export function seedZufall(seed: number): Zufall {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
