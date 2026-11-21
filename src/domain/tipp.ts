import { FERTIGKEITEN, type FertigkeitId } from './fertigkeiten';
import { fuellstand, standVon, type Fortschritt } from './fortschritt';

export interface Tipp {
  fertigkeit?: FertigkeitId;
  text: string;
}

function gross(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const TEXTE: Record<FertigkeitId, (n: string) => string> = {
  zehnerstopp: (n) => `Legt zusammen 8 rote und 6 blaue Plättchen hin und lasst ${n} erklären, wie man erst bis 10 und dann weiter rechnet.`,
  plus10: (n) => `Würfelt mit zwei Würfeln und lasst ${n} die Augen zusammenzählen. Wer die Würfelbilder ohne Zählen erkennt, rechnet schneller.`,
  tausch: () => 'Fragt beim Rechnen: «Geht es leichter, wenn du die Zahlen tauschst?» Bei 2 + 8 lohnt es sich, bei der 8 zu starten.',
  verliebt: (n) => `Spielt «Verliebte Zahlen»: Ihr nennt eine Zahl bis 10, ${n} sagt so schnell wie möglich die Zahl, die zusammen 10 gibt.`,
  nachbar: () => 'Übt zuerst die Verdoppelungen (3 + 3, 4 + 4 …). Dann fragt: «Wenn 4 + 4 = 8 ist, wie viel ist 4 + 5?»',
  verdoppeln: (n) => `Zeigt mit einer Hand eine Zahl, ${n} zeigt dieselbe Zahl und rechnet beide zusammen. Umgekehrt: 8 Finger gerecht auf zwei Hände verteilen.`,
  kleinGross: (n) => `Legt 2 + 4 mit Plättchen und gleich daneben 12 + 4. So merkt ${n}: Die kleine Aufgabe hilft bei der grossen.`,
  umkehr: (n) => `Legt 9 Plättchen hin und versteckt einige unter der Hand. ${gross(n)} findet heraus, wie viele fehlen: «? + 3 = 9».`,
};

/**
 * Tipp für zu Hause zur Fertigkeit, die am meisten Übung braucht:
 * zuerst «am Üben» mit dem tiefsten Stand, dann begonnene «neue».
 */
export function tippFuer(fortschritt: Fortschritt, name: string): Tipp {
  const n = name.trim() || 'euer Kind';
  const mitStand = FERTIGKEITEN.map((f) => ({ id: f.id, roh: fortschritt.fertigkeiten[f.id] })).map((x) => ({ ...x, stand: standVon(x.roh) }));

  const ueben = mitStand.filter((x) => x.stand === 'amUeben').sort((a, b) => fuellstand(a.roh) - fuellstand(b.roh));
  const begonnen = mitStand.filter((x) => x.stand === 'neu' && (x.roh?.versuche ?? 0) > 0);
  const wahl = ueben[0] ?? begonnen[0];
  if (wahl) return { fertigkeit: wahl.id, text: TEXTE[wahl.id](n) };

  if (mitStand.every((x) => x.stand === 'sicher')) {
    return { text: `Alle Tricks sitzen! Lasst ${n} euch einen Trick erklären: Wer erklärt, versteht am besten.` };
  }
  return { fertigkeit: 'zehnerstopp', text: TEXTE.zehnerstopp(n) };
}
