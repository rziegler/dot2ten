import type { BlockId } from '../domain/bloecke';
import type { FertigkeitId } from '../domain/fertigkeiten';

const ROT = '#C8434B';
const BLAU = '#1F4E8C';
const TINTE = '#1F2A44';

export const MARIENKAEFER = `<svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
<ellipse cx="42" cy="48" rx="30" ry="27" fill="${ROT}"/><path d="M42 21V75" stroke="${TINTE}" stroke-width="3"/>
<path d="M18 34a30 27 0 0 1 48 0z" fill="${TINTE}"/>
<circle cx="30" cy="52" r="5" fill="${TINTE}"/><circle cx="54" cy="52" r="5" fill="${TINTE}"/>
<circle cx="33" cy="66" r="4" fill="${TINTE}"/><circle cx="51" cy="66" r="4" fill="${TINTE}"/>
<circle cx="34" cy="30" r="3.5" fill="#fff"/><circle cx="50" cy="30" r="3.5" fill="#fff"/></svg>`;

export const STERN = `<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 2l3.9 8.6 9.1 1-6.8 6.2 1.9 9.2L15 22.4 6.9 27l1.9-9.2L2 11.6l9.1-1z" fill="#F4B63F" stroke="#E0A02A" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

export const PLAY = `<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M6 3l17 10L6 23z" fill="#fff"/></svg>`;

export const ZURUECK = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2L4 8l6 6" fill="none" stroke="${TINTE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const SCHLOSS = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="9" width="12" height="9" rx="2" fill="none" stroke="#44506B" stroke-width="2"/><path d="M7 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="#44506B" stroke-width="2"/></svg>`;

export const MINUS = `<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M5 13h16" stroke="${TINTE}" stroke-width="3.5" stroke-linecap="round"/></svg>`;
export const PLUS = `<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M5 13h16M13 5v16" stroke="${TINTE}" stroke-width="3.5" stroke-linecap="round"/></svg>`;

export const HAKEN = `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M4 11.5l4.5 4.5L18 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const BLOCK_ICON: Record<BlockId, string> = {
  plus10: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="14" cy="28" r="9" fill="${ROT}"/><circle cx="28" cy="28" r="9" fill="${ROT}"/><circle cx="42" cy="28" r="9" fill="${BLAU}"/></svg>`,
  zehnerstopp: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26" fill="${ROT}"/><text x="28" y="37" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="22" fill="#fff">10</text></svg>`,
  minus: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="14" cy="28" r="9" fill="${ROT}"/><circle cx="28" cy="28" r="9" fill="${ROT}"/><circle cx="42" cy="28" r="9" fill="#fff" stroke="${ROT}" stroke-width="3"/><path d="M36 34l12-12" stroke="${ROT}" stroke-width="3"/></svg>`,
  tausch: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="14" cy="16" r="9" fill="${ROT}"/><circle cx="42" cy="16" r="9" fill="${BLAU}"/><circle cx="14" cy="42" r="9" fill="${BLAU}"/><circle cx="42" cy="42" r="9" fill="${ROT}"/></svg>`,
};

export const HILFE_ICON: Record<FertigkeitId, string> = {
  zehnerstopp: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><path d="M17 4h22l13 13v22L39 52H17L4 39V17z" fill="${ROT}"/><text x="28" y="34" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="15" fill="#fff">STOP</text></svg>`,
  verliebt: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><path d="M28 48S6 35 6 20a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 15-22 28-22 28z" fill="${ROT}"/><text x="28" y="31" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="16" fill="#fff">10</text></svg>`,
  tausch: BLOCK_ICON.tausch,
  nachbar: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><path d="M6 26L28 8l22 18" fill="none" stroke="${BLAU}" stroke-width="4" stroke-linejoin="round"/><rect x="12" y="24" width="32" height="26" rx="3" fill="${BLAU}"/><rect x="24" y="34" width="8" height="16" fill="#fff"/></svg>`,
  verdoppeln: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="31" rx="21" ry="19" fill="${ROT}"/><path d="M28 12V50" stroke="${TINTE}" stroke-width="2.5"/><path d="M11 22a21 19 0 0 1 34 0z" fill="${TINTE}"/><circle cx="19" cy="33" r="4" fill="${TINTE}"/><circle cx="37" cy="33" r="4" fill="${TINTE}"/><circle cx="21" cy="43" r="3" fill="${TINTE}"/><circle cx="35" cy="43" r="3" fill="${TINTE}"/></svg>`,
  kleinGross: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="15" cy="36" r="9" fill="${ROT}"/><circle cx="38" cy="28" r="16" fill="${BLAU}"/></svg>`,
  umkehr: `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><path d="M10 20h32l-7-7M46 36H14l7 7" fill="none" stroke="${ROT}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  plus10: BLOCK_ICON.plus10,
};
