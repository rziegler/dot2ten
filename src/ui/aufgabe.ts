import { naechsteAufgabe, schluessel, type Aufgabe } from '../domain/aufgaben';
import { BLOECKE } from '../domain/bloecke';
import { isoDatum } from '../domain/datum';
import { erfasse } from '../domain/fortschritt';
import { hilfeFuer, lobFuer } from '../domain/hilfe';
import { blockZeitUm, geloest, gesamtPlanMs, istVorbei, naechsterBlock, neueSession, restMs, vergehen, type Session } from '../domain/session';
import { zwanzigerfeld } from '../domain/zwanzigerfeld';
import { aendere, lies, tagVon, type Daten, type Tag } from '../speicher';
import { geheZu, h, svg } from './dom';
import { BLOCK_FARBE, minutenText } from './gemeinsam';
import { BLOCK_ICON, HILFE_ICON, STERN, ZURUECK } from './icons';

type Modus = 'rechnen' | 'zwischen' | 'fertig';
type Resultat = 'offen' | 'falsch' | 'richtig';

const MAX_TICK_MS = 5_000;

export function aufgabeScreen(root: HTMLElement): () => void {
  const heute = isoDatum(new Date());
  const gespeichert = lies().session;
  let session: Session =
    gespeichert && gespeichert.datum === heute && !istVorbei(gespeichert) ? gespeichert : neueSession(heute, lies().einstellungen.minuten);

  let modus: Modus = 'rechnen';
  let zuletzt: string[] = [];
  let aufgabe = ziehe();
  let eingabe = '';
  let hilfe = false;
  let getauscht = false;
  let resultat: Resultat = 'offen';
  let ersterVersuch = true;

  let zeitText: HTMLElement | undefined;
  let zeitBalken: HTMLElement | undefined;

  speichere((d) => d);

  function ziehe(): Aufgabe {
    const x = naechsteAufgabe(BLOECKE[session.block]!.id, lies().fortschritt, zuletzt, Math.random);
    zuletzt = [...zuletzt, schluessel(x)].slice(-3);
    return x;
  }

  function speichere(fn: (d: Daten) => Daten, tag?: (t: Tag) => Tag): void {
    aendere((d) => {
      const neu = fn({ ...d, session });
      return tag ? { ...neu, tage: { ...neu.tage, [heute]: tag(tagVon(neu, heute)) } } : neu;
    });
  }

  function neueAufgabe(): void {
    aufgabe = ziehe();
    eingabe = '';
    hilfe = false;
    getauscht = false;
    resultat = 'offen';
    ersterVersuch = true;
  }

  function tippe(ziffer: number): void {
    if (modus !== 'rechnen' || resultat === 'richtig') return;
    eingabe = eingabe === '0' ? String(ziffer) : (eingabe + ziffer).slice(0, 2);
    resultat = 'offen';
    zeichne();
  }

  function loesche(): void {
    if (modus !== 'rechnen' || resultat === 'richtig') return;
    eingabe = eingabe.slice(0, -1);
    resultat = 'offen';
    zeichne();
  }

  function pruefe(): void {
    if (modus !== 'rechnen' || resultat === 'richtig' || eingabe === '') return;
    const richtig = Number(eingabe) === aufgabe.ergebnis;
    const erster = ersterVersuch;
    const erfasseErsten = (d: Daten): Daten =>
      erster ? { ...d, fortschritt: erfasse(d.fortschritt, aufgabe.fertigkeit, schluessel(aufgabe), richtig) } : d;

    if (richtig) {
      resultat = 'richtig';
      session = geloest(session, erster);
      speichere(erfasseErsten, (t) => ({ ...t, aufgaben: t.aufgaben + 1, richtig: t.richtig + (erster ? 1 : 0) }));
    } else {
      resultat = 'falsch';
      hilfe = true;
      eingabe = '';
      ersterVersuch = false;
      speichere(erfasseErsten);
    }
    zeichne();
  }

  function weiter(): void {
    if (modus === 'zwischen') {
      modus = 'rechnen';
      neueAufgabe();
    } else if (modus === 'fertig') {
      geheZu('');
      return;
    } else if (resultat === 'richtig') {
      if (blockZeitUm(session)) {
        session = naechsterBlock(session);
        modus = session.fertig ? 'fertig' : 'zwischen';
        speichere((d) => d);
      } else {
        neueAufgabe();
      }
    }
    zeichne();
  }

  function aktualisiereZeit(): void {
    const rest = restMs(session);
    const min = Math.ceil(rest / 60_000);
    if (zeitText) zeitText.textContent = rest <= 0 ? 'gleich fertig' : `noch ${minutenText(min)}`;
    if (zeitBalken) zeitBalken.style.width = `${Math.min(100, (1 - rest / gesamtPlanMs(session)) * 100)}%`;
  }

  function kopf(): HTMLElement {
    const block = BLOECKE[session.block]!;
    zeitText = h('span', {});
    zeitBalken = h('div', {});
    const k = h(
      'header',
      { class: 'aufgabe-kopf' },
      h('button', { class: 'pille klein rahmen', onclick: () => geheZu('') }, svg(ZURUECK), 'Pause'),
      h(
        'div',
        { class: 'zeitleiste' },
        h('div', { class: 'zeitleiste-text' }, h('span', {}, `${block.name} · Block ${session.block + 1} von ${session.plan.length}`), zeitText),
        h('div', { class: 'balken', role: 'presentation' }, zeitBalken),
      ),
      h('div', { class: 'sterne', 'aria-label': `${session.sterne} Sterne` }, svg(STERN), String(session.sterne)),
    );
    aktualisiereZeit();
    return k;
  }

  function feld(): HTMLElement {
    const felder = zwanzigerfeld(aufgabe, hilfe, getauscht).map((f) => h('div', { class: `plaettchen ${f.art}${f.markiert ? ' markiert' : ''}` }));
    const beschreibung =
      aufgabe.op === '+'
        ? getauscht
          ? `${aufgabe.b} blaue und ${aufgabe.a} rote Plättchen`
          : `${aufgabe.a} rote und ${aufgabe.b} blaue Plättchen`
        : `${aufgabe.a} rote Plättchen, ${aufgabe.b} davon durchgestrichen`;
    return h(
      'div',
      { class: 'feld-rahmen' },
      h('span', { class: 'abschnitt', style: 'font-size:17px' }, 'Zwanzigerfeld'),
      h(
        'div',
        { class: 'zwanzigerfeld', role: 'img', 'aria-label': `Zwanzigerfeld: ${beschreibung}` },
        h('div', { class: 'feld-reihe' }, felder.slice(0, 10)),
        h('div', { class: 'feld-reihe' }, felder.slice(10)),
      ),
    );
  }

  function hilfeKarte(): HTMLElement {
    const hl = hilfeFuer(aufgabe, resultat === 'richtig');
    return h(
      'div',
      { class: 'hilfe' },
      svg(HILFE_ICON[aufgabe.fertigkeit]),
      h(
        'div',
        { class: 'hilfe-text' },
        h('span', { class: 'hilfe-titel' }, hl.titel),
        hl.zeilen.map((z, i) => h('span', { class: `hilfe-zeile${i >= 2 ? ' neben' : ''}` }, z)),
        aufgabe.fertigkeit === 'tausch' &&
          h(
            'button',
            { class: 'pille klein rahmen tauschen', 'aria-pressed': String(getauscht), onclick: () => ((getauscht = !getauscht), zeichne()) },
            'Tauschen',
          ),
      ),
    );
  }

  function tasten(): HTMLElement {
    const aus = resultat === 'richtig';
    const ziffer = (n: number) => h('button', { class: 'taste', 'aria-label': `Zahl ${n}`, disabled: aus, onclick: () => tippe(n) }, String(n));
    return h(
      'div',
      { class: 'zahlenpad' },
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(ziffer),
      h('button', { class: 'taste loeschen', 'aria-label': 'Löschen', disabled: aus, onclick: loesche }, '←'),
      ziffer(0),
      h('button', { class: 'taste ok', 'aria-label': 'Prüfen', disabled: aus, onclick: pruefe }, 'OK'),
    );
  }

  function rechnen(): HTMLElement[] {
    const antwortKlasse = ['antwort', eingabe === '' && resultat !== 'richtig' && 'leer', resultat === 'falsch' && 'falsch', resultat === 'richtig' && 'richtig']
      .filter(Boolean)
      .join(' ');
    const status = h(
      'div',
      { role: 'status', 'aria-live': 'polite' },
      resultat === 'falsch' && h('p', { class: 'fast' }, h('b', {}, 'Fast! '), 'Schau auf das Zwanzigerfeld und probier es nochmal.'),
      resultat === 'richtig' &&
        h(
          'div',
          { class: 'lob' },
          svg(STERN),
          h('div', { class: 'lob-text' }, lobFuer(aufgabe)),
          h('button', { class: 'pille dunkel', onclick: weiter, autofocus: true }, 'Weiter'),
        ),
    );
    return [
      kopf(),
      h(
        'div',
        { class: 'aufgabe-mitte' },
        h(
          'div',
          { class: 'aufgabe-links' },
          h(
            'div',
            { class: 'rechnung' },
            h('span', { class: 'rechnung-text', 'aria-label': `${aufgabe.a} ${aufgabe.op === '+' ? 'plus' : 'minus'} ${aufgabe.b} gleich` }, `${aufgabe.a} ${aufgabe.op} ${aufgabe.b} =`),
            h('output', { class: antwortKlasse, 'aria-label': 'Deine Antwort' }, resultat === 'richtig' ? String(aufgabe.ergebnis) : eingabe || '?'),
          ),
          feld(),
          hilfe && hilfeKarte(),
          status,
        ),
        h(
          'div',
          { class: 'aufgabe-rechts' },
          tasten(),
          resultat !== 'richtig' &&
            h('button', { class: 'pille rot-rahmen', 'aria-expanded': String(hilfe), onclick: () => ((hilfe = !hilfe), zeichne()) }, hilfe ? 'Hilfe verstecken' : 'Hilf mir'),
        ),
      ),
    ];
  }

  function zwischen(): HTMLElement[] {
    const block = BLOECKE[session.block]!;
    return [
      kopf(),
      h(
        'section',
        { class: 'zwischen' },
        h('h1', {}, 'Super gemacht!'),
        h('p', {}, 'Jetzt kommt:'),
        h('div', { class: 'block-zeile', style: `background:${BLOCK_FARBE[block.id]};flex:none;padding:18px 32px` }, svg(BLOCK_ICON[block.id]), h('div', { class: 'titel' }, block.name)),
        h('button', { class: 'pille rot gross', onclick: weiter, autofocus: true }, 'Weiter'),
      ),
    ];
  }

  function fertig(): HTMLElement[] {
    const name = lies().einstellungen.name.trim();
    return [
      h(
        'section',
        { class: 'zwischen' },
        h('h1', {}, name ? `Geschafft, ${name}!` : 'Geschafft!'),
        h('div', { class: 'sterne-gross', 'aria-label': `${session.sterne} Sterne` }, svg(STERN), String(session.sterne)),
        h('p', {}, `Du hast heute ${session.aufgaben} ${session.aufgaben === 1 ? 'Aufgabe' : 'Aufgaben'} gelöst. Bis morgen!`),
        h('button', { class: 'pille rot gross', onclick: weiter, autofocus: true }, 'Zum Start'),
      ),
    ];
  }

  function zeichne(): void {
    const inhalt = modus === 'rechnen' ? rechnen() : modus === 'zwischen' ? zwischen() : fertig();
    root.replaceChildren(h('div', { class: 'screen' }, inhalt));
    root.querySelector<HTMLElement>('[autofocus]')?.focus();
  }

  let letzter = performance.now();
  const takt = window.setInterval(() => {
    const jetzt = performance.now();
    const delta = Math.min(jetzt - letzter, MAX_TICK_MS);
    letzter = jetzt;
    if (modus !== 'rechnen' || document.hidden) return;
    session = vergehen(session, delta);
    speichere((d) => d, (t) => ({ ...t, ms: t.ms + delta }));
    aktualisiereZeit();
  }, 1000);

  const taste = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) tippe(Number(e.key));
    else if (e.key === 'Backspace') loesche();
    else if (e.key === 'Enter') {
      if (modus === 'rechnen' && resultat !== 'richtig') pruefe();
      else if (!(e.target instanceof HTMLButtonElement)) weiter();
      else return;
    } else return;
    e.preventDefault();
  };
  document.addEventListener('keydown', taste);

  zeichne();

  return () => {
    window.clearInterval(takt);
    document.removeEventListener('keydown', taste);
  };
}
