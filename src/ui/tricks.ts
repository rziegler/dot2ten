import { h, svg } from './dom';
import { fusszeile, zurueckKnopf } from './gemeinsam';
import { SCHLOSS } from './icons';

interface Trick {
  titel: string;
  farbe: string;
  beispiel: string;
  wer: string;
  zitat: string;
  zeilen: string[];
  /** Plättchenreihen pro Gruppe: R rot, B blau, X weggenommen, Leerzeichen = Lücke nach dem Fünferblock. */
  gruppen: [string, string[]][];
}

/** Die sechs Rechentricks vom Klassenplakat. */
const TRICKS: readonly Trick[] = [
  {
    titel: 'Die Tauschaufgabe', farbe: 'var(--t-blau)', beispiel: '2 + 8 = 8 + 2', wer: 'Tim', zitat: 'Ich tausche die Zahlen!',
    zeilen: ['2 + 8 = 10', '8 + 2 = 10'],
    gruppen: [['Aufgabe', ['RRBBB BBBBB']], ['Ich rechne', ['BBBBB BBBRR']]],
  },
  {
    titel: 'Die Nachbaraufgabe', farbe: 'var(--t-pfirsich)', beispiel: '4 + 3 → 4 + 4', wer: 'Noé', zitat: 'Ich suche eine einfache Nachbaraufgabe!',
    zeilen: ['4 + 3 = 7', '4 + 4 = 8'],
    gruppen: [['Aufgabe', ['RRRRB BB']], ['Ich rechne', ['RRRRB BBB']]],
  },
  {
    titel: 'Halbieren und Verdoppeln', farbe: 'var(--t-gruen)', beispiel: '4 + 4 = 8', wer: 'Hanna', zitat: 'Gerade Zahlen kann ich halbieren und verdoppeln!',
    zeilen: ['4 + 4 = 8', '8 − 4 = 4'],
    gruppen: [['Verdoppeln', ['RRRR', 'BBBB']], ['Halbieren', ['RRRR', 'XXXX']]],
  },
  {
    titel: 'Kleine & grosse Aufgabe', farbe: 'var(--t-hellblau)', beispiel: '2 + 4 → 12 + 4', wer: 'Karl', zitat: 'Ich rechne zuerst die kleine Aufgabe!',
    zeilen: ['2 + 4 = 6', '12 + 4 = 16'],
    gruppen: [['Aufgabe', ['RRRRR RRRRR', 'RRBBB B']], ['Ich rechne', ['RRBBB B']]],
  },
  {
    titel: 'Zehnerstopp', farbe: 'var(--t-rosa)', beispiel: '8 + 6 = 14', wer: 'Zoe', zitat: 'Ich rechne bis 10 und dann weiter!',
    zeilen: ['8 + 2 = 10', '10 + 4 = 14'],
    gruppen: [['Aufgabe', ['RRRRR RRRBB', 'BBBB']]],
  },
  {
    titel: 'Die verliebten Zahlen', farbe: 'var(--t-pink)', beispiel: '4 + 6 = 10', wer: 'Valentine', zitat: 'Verliebte Zahlen geben zusammengerechnet immer 10!',
    zeilen: ['4 + 6 = 10'],
    gruppen: [['Aufgabe', ['RRRRB BBBBB']]],
  },
];

function punkte(reihe: string): HTMLElement {
  const els: HTMLElement[] = [];
  for (const ch of reihe) {
    if (ch === ' ') {
      els[els.length - 1]?.classList.add('luecke');
      continue;
    }
    els.push(h('div', { class: `punkt ${ch.toLowerCase()}` }));
  }
  return h('div', { class: 'punkte-reihe' }, els);
}

export function tricksScreen(root: HTMLElement): void {
  let gewaehlt = 0;

  function zeichne(): void {
    const t = TRICKS[gewaehlt]!;
    root.replaceChildren(
      h(
        'div',
        { class: 'screen' },
        h('header', { class: 'kopf' }, zurueckKnopf('Zurück', ''), h('h1', {}, 'Rechentricks'), h('span', { class: 'leise', style: 'font-size:19px' }, 'Tippe auf einen Trick.')),
        h(
          'div',
          { class: 'trick-karten' },
          TRICKS.map((x, i) =>
            h(
              'button',
              { class: 'trick-karte', style: `background:${x.farbe}`, 'aria-pressed': String(i === gewaehlt), onclick: () => ((gewaehlt = i), zeichne(), root.querySelectorAll<HTMLElement>('.trick-karte')[i]?.focus()) },
              h('span', { class: 'titel' }, x.titel),
              h('span', { class: 'beispiel' }, x.beispiel),
            ),
          ),
        ),
        h(
          'section',
          { class: 'trick-detail', style: `background:${t.farbe}`, 'aria-live': 'polite' },
          h(
            'div',
            { class: 'links' },
            h('h2', {}, t.titel),
            h('p', { class: 'zitat' }, h('b', {}, `${t.wer}: `), `«${t.zitat}»`),
            h('div', {}, t.zeilen.map((z) => h('div', { class: 'trick-zeile' }, z))),
          ),
          h(
            'div',
            { class: 'rechts', 'aria-hidden': 'true' },
            t.gruppen.map(([label, reihen]) => h('div', { class: 'punkte-gruppe' }, h('div', { class: 'punkte-label' }, `${label}:`), reihen.map(punkte))),
          ),
        ),
        fusszeile('tricks', svg(SCHLOSS)),
      ),
    );
  }
  zeichne();
}
