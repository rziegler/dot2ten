import { leererFortschritt, type Fortschritt } from './domain/fortschritt';
import type { Session } from './domain/session';
import { begrenzeMinuten, STANDARD_MINUTEN } from './domain/zeit';

export const MAX_NAME = 20;

export interface Einstellungen {
  name: string;
  minuten: number;
}

export interface Tag {
  ms: number;
  aufgaben: number;
  richtig: number;
}

export interface Daten {
  version: 1;
  einstellungen: Einstellungen;
  fortschritt: Fortschritt;
  tage: Record<string, Tag>;
  session?: Session;
}

const SCHLUESSEL = 'dot2ten:v1';

function standard(): Daten {
  return { version: 1, einstellungen: { name: '', minuten: STANDARD_MINUTEN }, fortschritt: leererFortschritt(), tage: {} };
}

function istObjekt(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

/** Liest defensiv: kaputte oder alte Daten fallen auf Standardwerte zurück. */
function lade(): Daten {
  const d = standard();
  try {
    const roh: unknown = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
    if (!istObjekt(roh)) return d;
    const e = istObjekt(roh.einstellungen) ? roh.einstellungen : {};
    d.einstellungen = {
      name: typeof e.name === 'string' ? e.name.slice(0, MAX_NAME) : '',
      minuten: begrenzeMinuten(typeof e.minuten === 'number' ? e.minuten : STANDARD_MINUTEN),
    };
    const f = roh.fortschritt;
    if (istObjekt(f) && istObjekt(f.fertigkeiten) && istObjekt(f.fehler)) d.fortschritt = f as unknown as Fortschritt;
    if (istObjekt(roh.tage)) d.tage = roh.tage as Record<string, Tag>;
    if (istObjekt(roh.session) && Array.isArray(roh.session.plan)) d.session = roh.session as unknown as Session;
  } catch {
    // Kein Zugriff auf localStorage (z. B. privater Modus): mit Standardwerten weiter.
  }
  return d;
}

let daten = lade();

export function lies(): Daten {
  return daten;
}

export function aendere(fn: (d: Daten) => Daten): Daten {
  daten = fn(daten);
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(daten));
  } catch {
    // Speichern nicht möglich: Daten bleiben bis zum Neuladen im Speicher.
  }
  return daten;
}

export function tagVon(d: Daten, iso: string): Tag {
  return d.tage[iso] ?? { ms: 0, aufgaben: 0, richtig: 0 };
}
