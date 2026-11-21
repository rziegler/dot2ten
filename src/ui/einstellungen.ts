import { BLOECKE } from '../domain/bloecke';
import { begrenzeMinuten, MAX_MINUTEN, MIN_MINUTEN, verteileZeit } from '../domain/zeit';
import { aendere, lies, MAX_NAME, type Daten } from '../speicher';
import { geheZu, h, svg } from './dom';
import { BLOCK_FARBE, begruessung, zurueckKnopf } from './gemeinsam';
import { MINUS, PLUS } from './icons';

/** Eine heute noch nicht begonnene Session wird verworfen, damit die neue Dauer gilt. */
function ohneUnbegonneneSession(d: Daten): Daten {
  return d.session && d.session.gesamtMs === 0 ? { ...d, session: undefined } : d;
}

export function einstellungenScreen(root: HTMLElement): void {
  const d = lies();

  const gruss = h('b', {}, begruessung(d.einstellungen.name));
  const name = h('input', {
    id: 'name',
    class: 'name-eingabe',
    type: 'text',
    maxlength: MAX_NAME,
    autocomplete: 'off',
    autocapitalize: 'words',
    spellcheck: 'false',
    value: d.einstellungen.name,
  });
  name.addEventListener('input', () => {
    const wert = name.value.slice(0, MAX_NAME);
    aendere((x) => ({ ...x, einstellungen: { ...x.einstellungen, name: wert } }));
    gruss.textContent = begruessung(wert);
  });

  const zahl = h('span', { class: 'zahl' });
  const weniger = h('button', { 'aria-label': 'Eine Minute weniger', onclick: () => setze(lies().einstellungen.minuten - 1) }, svg(MINUS));
  const mehr = h('button', { 'aria-label': 'Eine Minute mehr', onclick: () => setze(lies().einstellungen.minuten + 1) }, svg(PLUS));
  const regler = h('input', { type: 'range', min: MIN_MINUTEN, max: MAX_MINUTEN, step: 1, 'aria-label': 'Minuten pro Tag' });
  regler.addEventListener('input', () => setze(Number(regler.value)));
  const verteilung = h('div', { class: 'verteilung' });

  function setze(roh: number): void {
    const m = begrenzeMinuten(roh);
    if (m !== lies().einstellungen.minuten) aendere((x) => ohneUnbegonneneSession({ ...x, einstellungen: { ...x.einstellungen, minuten: m } }));
    zeige(m);
  }

  function zeige(m: number): void {
    zahl.textContent = String(m);
    regler.value = String(m);
    regler.setAttribute('aria-valuetext', `${m} Minuten`);
    weniger.disabled = m <= MIN_MINUTEN;
    mehr.disabled = m >= MAX_MINUTEN;
    const minuten = verteileZeit(m);
    verteilung.replaceChildren(
      ...BLOECKE.map((b, i) =>
        h(
          'div',
          { style: `flex:${minuten[i]} 1 0;background:${BLOCK_FARBE[b.id]}` },
          h('span', { class: 'titel' }, b.name),
          h('span', { class: 'leise', style: 'font-size:18px;font-weight:800' }, `${minuten[i]} Min.`),
        ),
      ),
    );
  }
  zeige(d.einstellungen.minuten);

  root.append(
    h(
      'div',
      { class: 'screen eltern' },
      h('header', { class: 'kopf' }, zurueckKnopf('Zurück', 'eltern'), h('h1', {}, 'Einstellungen')),
      h(
        'div',
        { class: 'einstellungen-reihe' },
        h(
          'section',
          { class: 'karte' },
          h('label', { for: 'name', class: 'karte-titel' }, 'Name des Kindes'),
          name,
          h('span', { class: 'leise', style: 'font-size:18px' }, 'So begrüsst dot2ten das Kind: ', gruss),
        ),
        h(
          'section',
          { class: 'karte', style: 'flex:1.2', 'aria-labelledby': 'dauer-titel' },
          h('h2', { class: 'karte-titel', id: 'dauer-titel' }, 'Dauer pro Tag'),
          h('div', { class: 'stepper' }, weniger, h('div', { class: 'stepper-wert', 'aria-live': 'polite' }, zahl, h('span', { class: 'einheit' }, ' Min.')), mehr),
          regler,
          h('div', { class: 'skala', 'aria-hidden': 'true' }, h('span', {}, `${MIN_MINUTEN} Min.`), h('span', {}, `${MAX_MINUTEN} Min.`)),
        ),
      ),
      h(
        'section',
        { class: 'karte', style: 'display:flex;flex-direction:column;gap:14px', 'aria-labelledby': 'verteilung-titel' },
        h('h2', { class: 'karte-titel', id: 'verteilung-titel' }, 'So verteilt sich die Zeit'),
        verteilung,
        h('span', { class: 'leise', style: 'font-size:17px' }, 'Die vier Blöcke passen sich automatisch an die gewählte Dauer an.'),
      ),
      h('div', { style: 'display:flex;justify-content:flex-end' }, h('button', { class: 'pille dunkel', style: 'padding:0 40px', onclick: () => geheZu('eltern') }, 'Fertig')),
    ),
  );
}
