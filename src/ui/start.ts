import { BLOECKE } from '../domain/bloecke';
import { isoDatum, wocheVon, wochentagKurz } from '../domain/datum';
import { gesamtPlanMs, neueSession, restMs } from '../domain/session';
import { verteileZeit } from '../domain/zeit';
import { aendere, lies, tagVon } from '../speicher';
import { geheZu, h, svg } from './dom';
import { BLOCK_ICON, HAKEN, MARIENKAEFER, PLAY, SCHLOSS } from './icons';
import { BLOCK_FARBE, begruessung, fusszeile, minutenText } from './gemeinsam';

const TAG_LANG: Record<string, string> = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };

export function startScreen(root: HTMLElement): void {
  const d = lies();
  const heute = isoDatum(new Date());
  const session = d.session?.datum === heute ? d.session : undefined;
  const laeuft = session !== undefined && !session.fertig && session.gesamtMs > 0;
  const fertig = session?.fertig === true;
  const plan = session && !fertig ? session.plan : verteileZeit(d.einstellungen.minuten);
  const gesamtMin = plan.reduce((s, m) => s + m, 0);
  const restMin = laeuft ? Math.ceil(restMs(session) / 60_000) : gesamtMin;
  // Abgerundet, damit gerechnete und restliche Minuten zusammen die Tagesdauer ergeben.
  const gerechnetMin = laeuft ? gesamtMin - restMin : 0;
  // Der Ring füllt sich wie der Balken in der Aufgabe: rot ist die schon gerechnete Zeit.
  const anteil = fertig ? 1 : laeuft ? 1 - restMs(session) / gesamtPlanMs(session) : 0;

  const untertitel = fertig
    ? `Geschafft! Heute hast du ${session.sterne} ${session.sterne === 1 ? 'Stern' : 'Sterne'} gesammelt.`
    : laeuft
      ? `Noch ${minutenText(restMin)}. Weiter so!`
      : `Heute rechnen wir ${minutenText(gesamtMin)}. Das schaffst du!`;

  const woche = wocheVon(heute).map((iso) => {
    const kurz = wochentagKurz(iso);
    const geuebt = tagVon(d, iso).aufgaben > 0;
    const klassen = ['tag', geuebt && 'geuebt', iso === heute && 'heute', iso > heute && 'zukunft'].filter(Boolean).join(' ');
    return h('li', { class: klassen, 'aria-label': `${TAG_LANG[kurz]}${geuebt ? ': geübt' : ''}` }, kurz);
  });

  const umfang = 2 * Math.PI * 86;
  const ring = svg(`<svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r="86" fill="none" stroke="#F3E7D3" stroke-width="16"/>
    <circle cx="100" cy="100" r="86" fill="none" stroke="${fertig ? '#F4B63F' : '#C8434B'}" stroke-width="16" stroke-linecap="round"
      stroke-dasharray="${umfang}" stroke-dashoffset="${umfang * (1 - anteil)}" transform="rotate(-90 100 100)"/></svg>`);

  const los = () => {
    if (!session || fertig) aendere((x) => ({ ...x, session: neueSession(heute, x.einstellungen.minuten) }));
    geheZu('aufgabe');
  };

  root.append(
    h(
      'div',
      { class: 'screen' },
      h(
        'header',
        { class: 'start-kopf' },
        h('div', { class: 'begruessung' }, svg(MARIENKAEFER), h('div', {}, h('h1', {}, begruessung(d.einstellungen.name)), h('p', { class: 'leise' }, untertitel))),
        h('div', { class: 'woche' }, h('span', { class: 'abschnitt', id: 'woche-titel' }, 'Diese Woche'), h('ul', { class: 'woche-tage', 'aria-labelledby': 'woche-titel', style: 'list-style:none;margin:0;padding:0' }, woche)),
      ),
      h(
        'div',
        { class: 'start-mitte' },
        h(
          'section',
          { class: 'los-karte' },
          h(
            'div',
            { class: 'zeitring' },
            ring,
            h(
              'div',
              { class: 'zeitring-text' },
              h('span', { class: 'zeitring-zahl' }, fertig ? session.sterne : gerechnetMin),
              h('span', { class: 'zeitring-einheit leise' }, fertig ? (session.sterne === 1 ? 'Stern' : 'Sterne') : `von ${gesamtMin} Min.`),
            ),
          ),
          h('button', { class: 'pille rot gross', onclick: los }, svg(PLAY), fertig ? 'Nochmals üben' : laeuft ? "Weiter geht's" : "Los geht's"),
        ),
        h(
          'section',
          { class: 'bloecke', 'aria-labelledby': 'bloecke-titel' },
          h('h2', { class: 'abschnitt', id: 'bloecke-titel' }, 'Heute dabei'),
          BLOECKE.map((b, i) => {
            const erledigt = fertig || (laeuft && session.block > i);
            const jetzt = laeuft && session.block === i;
            return h(
              'div',
              { class: `block-zeile${jetzt ? ' jetzt' : ''}`, style: `background:${BLOCK_FARBE[b.id]}` },
              svg(BLOCK_ICON[b.id]),
              h('div', {}, h('div', { class: 'titel' }, b.name), h('div', { class: 'unter' }, `${b.untertitel} · ${plan[i]} Min.`)),
              erledigt && h('span', { class: 'status', 'aria-label': 'erledigt' }, svg(HAKEN)),
            );
          }),
        ),
      ),
      fusszeile('rechnen', svg(SCHLOSS)),
    ),
  );
}
