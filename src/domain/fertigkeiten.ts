export type FertigkeitId =
  | 'plus10'
  | 'tausch'
  | 'nachbar'
  | 'verdoppeln'
  | 'kleinGross'
  | 'zehnerstopp'
  | 'verliebt'
  | 'umkehr';

export interface Fertigkeit {
  id: FertigkeitId;
  name: string;
}

/** Reihenfolge wie in der Elternansicht. */
export const FERTIGKEITEN: readonly Fertigkeit[] = [
  { id: 'plus10', name: 'Plus bis 10' },
  { id: 'tausch', name: 'Tauschaufgabe' },
  { id: 'verliebt', name: 'Verliebte Zahlen (Summe 10)' },
  { id: 'zehnerstopp', name: 'Zehnerstopp' },
  { id: 'nachbar', name: 'Nachbaraufgabe' },
  { id: 'verdoppeln', name: 'Halbieren und Verdoppeln' },
  { id: 'kleinGross', name: 'Kleine und grosse Aufgabe' },
  { id: 'umkehr', name: 'Minus und Umkehraufgabe' },
];

export function fertigkeitName(id: FertigkeitId): string {
  return FERTIGKEITEN.find((f) => f.id === id)?.name ?? id;
}
