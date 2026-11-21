import type { Aufgabe } from './aufgaben';

export interface Hilfe {
  titel: string;
  zeilen: string[];
}

/**
 * Hilfe passend zur Fertigkeit der Aufgabe. Solange sie nicht gelöst ist,
 * steht für das Ergebnis ein «?».
 */
export function hilfeFuer(x: Aufgabe, geloest: boolean): Hilfe {
  const { a, b } = x;
  const q = geloest ? String(x.ergebnis) : '?';
  const istPlus = x.op === '+';

  switch (x.fertigkeit) {
    case 'zehnerstopp': {
      if (istPlus) {
        const bisZehn = 10 - a;
        return { titel: 'Zehnerstopp: erst bis 10, dann weiter!', zeilen: [`${a} + ${bisZehn} = 10`, `10 + ${b - bisZehn} = ${q}`] };
      }
      const bisZehn = a - 10;
      return {
        titel: 'Zehnerstopp rückwärts: erst bis 10, dann weiter!',
        zeilen: [`${a} − ${bisZehn} = 10`, `10 − ${b - bisZehn} = ${q}`, `Umkehraufgabe: ${q} + ${b} = ${a}`],
      };
    }
    case 'verliebt':
      return { titel: 'Verliebte Zahlen geben zusammen immer 10!', zeilen: [`${a} und ${b} sind verliebt.`, `${a} + ${b} = ${q}`] };
    case 'verdoppeln':
      return istPlus
        ? { titel: 'Verdoppeln: zweimal die gleiche Zahl!', zeilen: [`${a} + ${a} ist das Doppelte von ${a}.`, `${a} + ${b} = ${q}`] }
        : {
            titel: 'Halbieren: die Hälfte wegnehmen!',
            zeilen: [`${b} ist die Hälfte von ${a}.`, `${a} − ${b} = ${q}`, `Umkehraufgabe: ${q} + ${b} = ${a}`],
          };
    case 'nachbar': {
      const k = Math.min(a, b);
      return {
        titel: 'Nachbaraufgabe: such eine einfache Aufgabe daneben!',
        zeilen: [`${k} + ${k} = ${2 * k}`, `${a} + ${b} ist eins mehr: ${q}`],
      };
    }
    case 'kleinGross': {
      const klein = a - 10;
      return istPlus
        ? { titel: 'Rechne zuerst die kleine Aufgabe!', zeilen: [`${klein} + ${b} = ${klein + b}`, `${a} + ${b} = ${q}`] }
        : { titel: 'Rechne zuerst die kleine Aufgabe!', zeilen: [`${klein} − ${b} = ${klein - b}`, `${a} − ${b} = ${q}`] };
    }
    case 'tausch':
      return { titel: 'Tauschaufgabe: tausch die Zahlen!', zeilen: [`${a} + ${b} = ${b} + ${a}`, `Starte bei ${b} und zähle ${a} weiter: ${q}`] };
    case 'umkehr':
      return { titel: 'Umkehraufgabe: rechne mit Plus!', zeilen: [`${q} + ${b} = ${a}`, `Also ist ${a} − ${b} = ${q}`] };
    case 'plus10':
      return a < b
        ? { titel: 'Tipp: tausch die Zahlen!', zeilen: [`${b} + ${a} = ${q}`, `Starte bei ${b} und zähle ${a} weiter.`] }
        : { titel: 'Zuerst die Roten, dann die Blauen dazu!', zeilen: [`Starte bei ${a} und zähle ${b} weiter.`, `${a} + ${b} = ${q}`] };
  }
}

export function lobFuer(x: Aufgabe): string {
  switch (x.fertigkeit) {
    case 'zehnerstopp':
      return x.op === '+' ? 'Richtig! Das war ein Zehnerstopp.' : `Richtig! Die Umkehraufgabe stimmt: ${x.ergebnis} + ${x.b} = ${x.a}`;
    case 'umkehr':
      return `Richtig! Die Umkehraufgabe stimmt: ${x.ergebnis} + ${x.b} = ${x.a}`;
    case 'verliebt':
      return `Richtig! ${x.a} und ${x.b} sind verliebt.`;
    case 'tausch':
      return `Richtig! ${x.b} + ${x.a} geht schneller.`;
    case 'verdoppeln':
      return x.op === '+' ? 'Richtig! Gut verdoppelt.' : 'Richtig! Gut halbiert.';
    default:
      return 'Richtig! Super gemacht.';
  }
}
