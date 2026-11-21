type Kind = Node | string | number | false | null | undefined | readonly Kind[];
type Wert = string | number | boolean | undefined | ((e: Event) => void) | ((e: KeyboardEvent) => void);

/** Erzeugt ein Element; Text wird immer als Textknoten eingesetzt (kein innerHTML). */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, Wert> = {}, ...kinder: Kind[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  haengeAn(el, kinder);
  return el;
}

function haengeAn(el: Node, kinder: readonly Kind[]): void {
  for (const k of kinder) {
    if (k === null || k === undefined || k === false) continue;
    if (Array.isArray(k)) haengeAn(el, k);
    else if (k instanceof Node) el.appendChild(k);
    else el.appendChild(document.createTextNode(String(k)));
  }
}

/** Nur für eigene, statische SVG-Markup-Konstanten. */
export function svg(markup: string): SVGElement {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild as SVGElement;
}

export function geheZu(route: string): void {
  location.hash = `#/${route}`;
}
