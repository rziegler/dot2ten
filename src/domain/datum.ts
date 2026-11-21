const KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

/** Lokales Datum als «JJJJ-MM-TT». */
export function isoDatum(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const tt = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${tt}`;
}

function ausIso(iso: string): Date {
  const [j, m, t] = iso.split('-').map(Number);
  return new Date(j!, m! - 1, t!);
}

/** Die sieben Tage (Montag bis Sonntag) der Woche, in der `iso` liegt. */
export function wocheVon(iso: string): string[] {
  const d = ausIso(iso);
  const montag = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => isoDatum(new Date(montag.getFullYear(), montag.getMonth(), montag.getDate() + i)));
}

export function wochentagKurz(iso: string): string {
  return KURZ[ausIso(iso).getDay()]!;
}
