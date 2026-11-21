import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import './style.css';
import { aufgabeScreen } from './ui/aufgabe';
import { einstellungenScreen } from './ui/einstellungen';
import { startScreen } from './ui/start';
import { tricksScreen } from './ui/tricks';

type Screen = (root: HTMLElement) => (() => void) | void;

const ROUTEN: Record<string, Screen> = {
  '': startScreen,
  aufgabe: aufgabeScreen,
  tricks: tricksScreen,
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
