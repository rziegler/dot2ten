export type BlockId = 'plus10' | 'zehnerstopp' | 'minus' | 'tausch';

export interface Block {
  id: BlockId;
  name: string;
  untertitel: string;
  /** Anteil an der Tageszeit im Verhältnis 2 : 3 : 3 : 2. */
  anteil: number;
}

export const BLOECKE: readonly Block[] = [
  { id: 'plus10', name: 'Plus bis 10', untertitel: 'Aufwärmen', anteil: 2 },
  { id: 'zehnerstopp', name: 'Zehnerstopp', untertitel: 'Über die 10', anteil: 3 },
  { id: 'minus', name: 'Minus und Umkehren', untertitel: 'Rückwärts rechnen', anteil: 3 },
  { id: 'tausch', name: 'Tauschaufgabe', untertitel: 'Schlau tauschen', anteil: 2 },
];
