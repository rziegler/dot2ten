import { isoDatum, wocheVon, wochentagKurz } from '../domain/datum';
import { FERTIGKEITEN } from '../domain/fertigkeiten';
import { fuellstand, STAND_TEXT, standVon } from '../domain/fortschritt';
import { tippFuer } from '../domain/tipp';
import { lies, tagVon } from '../speicher';
import { geheZu, h } from './dom';
import { zurueckKnopf } from './gemeinsam';

export function elternScreen(root: HTMLElement): void {
  const d = lies();
  const name = d.einstellungen.name.trim();
  const heute = isoDatum(new Date());
  const zielMs = d.einstellungen.minuten * 60_000;

  const woche = wocheVon(heute).map((iso) => ({ iso, tag: tagVon(d, iso) }));
  const geuebt = woche.filter((w) => w.tag.aufgaben > 0);
  const schnittMin = geuebt.length ? Math.round(geuebt.reduce((s, w) => s + w.tag.ms, 0) / geuebt.length / 60_000) : 0;
  const wochenText =
    geuebt.length === 0
      ? 'Diese Woche wurde noch nicht geübt.'
      : `${geuebt.length} von 7 Tagen geübt, im Schnitt ${schnittMin} ${schnittMin === 1 ? 'Minute' : 'Minuten'}`;

  const tipp = tippFuer(d.fortschritt, name);

  root.append(
    h(
      'div',
      { class: 'screen eltern' },
      h('header', { class: 'kopf' }, zurueckKnopf('Zurück', ''), h('h1', {}, name ? `Fortschritt von ${name}` : 'Fortschritt')),
      h(
        'div',
        { class: 'eltern-mitte' },
        h(
          'section',
          { class: 'karte eltern-links', 'aria-labelledby': 'tricks-titel' },
          h('h2', { class: 'karte-titel', id: 'tricks-titel', style: 'font-size:28px' }, 'Rechentricks im Überblick'),
          FERTIGKEITEN.map((f) => {
            const roh = d.fortschritt.fertigkeiten[f.id];
            const stand = standVon(roh);
            const prozent = Math.round(fuellstand(roh) * 100);
            return h(
              'div',
              { class: 'trick-stand' },
              h('div', { class: 'zeile' }, h('span', {}, f.name), h('span', { class: `stand-chip ${stand}` }, STAND_TEXT[stand])),
              h(
                'div',
                { class: 'balken', role: 'progressbar', 'aria-label': f.name, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': prozent },
                h('div', { style: `width:${prozent}%` }),
              ),
            );
          }),
          h('p', { class: 'leise', style: 'font-size:15px;margin-top:auto' }, 'neu: weniger als 5 Aufgaben · sicher: mindestens 8 der letzten 10 im ersten Versuch richtig'),
        ),
        h(
          'div',
          { class: 'eltern-rechts' },
          h(
            'section',
            { class: 'karte', style: 'display:flex;flex-direction:column;gap:12px', 'aria-labelledby': 'woche-titel' },
            h('h2', { class: 'karte-titel', id: 'woche-titel' }, 'Diese Woche'),
            h(
              'div',
              { class: 'wochen-balken', 'aria-hidden': 'true' },
              woche.map((w) => {
                const anteil = Math.min(1, w.tag.ms / zielMs);
                return h(
                  'div',
                  {},
                  h('div', { class: `saeule${w.tag.aufgaben > 0 ? '' : ' leer'}`, style: `height:${Math.max(8, Math.round(anteil * 80))}px` }),
                  wochentagKurz(w.iso),
                );
              }),
            ),
            h('p', { class: 'leise', style: 'font-size:17px' }, wochenText),
          ),
          h(
            'section',
            { class: 'karte', style: 'display:flex;flex-direction:column;gap:10px', 'aria-labelledby': 'einst-titel' },
            h(
              'div',
              { style: 'display:flex;justify-content:space-between;align-items:center' },
              h('h2', { class: 'karte-titel', id: 'einst-titel' }, 'Einstellungen'),
              h('button', { class: 'pille dunkel klein', onclick: () => geheZu('einstellungen') }, 'Ändern'),
            ),
            h('div', { class: 'wert-zeile' }, h('span', {}, 'Dauer pro Tag'), h('b', {}, `${d.einstellungen.minuten} Min.`)),
            h('div', { class: 'wert-zeile' }, h('span', {}, 'Zahlenraum'), h('b', {}, 'bis 20')),
            h('div', { class: 'wert-zeile' }, h('span', {}, 'Daten'), h('b', {}, 'nur auf diesem Gerät')),
          ),
          h(
            'section',
            { class: 'karte tipp', style: 'display:flex;flex-direction:column;gap:6px', 'aria-labelledby': 'tipp-titel' },
            h('h2', { class: 'karte-titel', id: 'tipp-titel', style: 'font-size:22px' }, 'Tipp für zu Hause'),
            h('p', {}, tipp.text),
          ),
        ),
      ),
    ),
  );
}
