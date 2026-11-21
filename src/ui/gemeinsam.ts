import type { BlockId } from '../domain/bloecke';
import { geheZu, h, svg } from './dom';
import { ZURUECK } from './icons';

export const BLOCK_FARBE: Record<BlockId, string> = {
  plus10: 'var(--t-blau)',
  zehnerstopp: 'var(--t-rosa)',
  minus: 'var(--t-pfirsich)',
  tausch: 'var(--t-gruen)',
};

export function begruessung(name: string): string {
  const n = name.trim();
  return n ? `Hoi ${n}!` : 'Hoi!';
}

export function minutenText(m: number): string {
  return m === 1 ? '1 Minute' : `${m} Minuten`;
}

export function zurueckKnopf(text: string, route: string): HTMLButtonElement {
  return h('button', { class: 'pille klein rahmen', onclick: () => geheZu(route) }, svg(ZURUECK), text);
}

export function fusszeile(aktiv: 'rechnen' | 'tricks', schloss: SVGElement): HTMLElement {
  const reiter = (id: 'rechnen' | 'tricks', text: string, route: string) =>
    h('button', { class: `pille ${aktiv === id ? 'dunkel' : 'rahmen'}`, 'aria-current': aktiv === id ? 'page' : undefined, onclick: () => geheZu(route) }, text);
  return h(
    'nav',
    { class: 'fuss', 'aria-label': 'Hauptnavigation' },
    reiter('rechnen', 'Rechnen', ''),
    reiter('tricks', 'Rechentricks', 'tricks'),
    h('span', { class: 'marke', 'aria-hidden': 'true' }, 'dot2ten'),
    h('button', { class: 'pille text', onclick: () => geheZu('eltern') }, schloss, 'Für Eltern'),
  );
}
