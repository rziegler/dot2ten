import '@fontsource/fredoka/latin-500.css';
import '@fontsource/fredoka/latin-600.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import './style.css';
import { aufgabeScreen } from './ui/aufgabe';
import { einstellungenScreen } from './ui/einstellungen';
import { elternScreen } from './ui/eltern';
import { startScreen } from './ui/start';
import { tricksScreen } from './ui/tricks';

type Screen = (root: HTMLElement) => (() => void) | void;

const ROUTEN: Record<string, Screen> = {
  '': startScreen,
  aufgabe: aufgabeScreen,
  tricks: tricksScreen,
  eltern: elternScreen,
  einstellungen: einstellungenScreen,
};

const root = document.getElementById('app')!;
let aufraeumen: (() => void) | void;

function zeige(): void {
  aufraeumen?.();
  root.replaceChildren();
  window.scrollTo(0, 0);
  const route = location.hash.replace(/^#\/?/, '');
  aufraeumen = (ROUTEN[route] ?? startScreen)(root);
}

window.addEventListener('hashchange', zeige);
zeige();
