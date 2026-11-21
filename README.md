# dot2ten

Eine kleine Rechen-App für Kinder der 1. Klasse (Schweiz, Lehrplan 21). Das Kind übt täglich ein paar Minuten **Plus und Minus im Zahlenraum bis 20** – mit dem Zwanzigerfeld und den Rechentricks aus dem Unterricht: Tauschaufgabe, Nachbaraufgabe, Halbieren und Verdoppeln, kleine und grosse Aufgabe, Zehnerstopp und verliebte Zahlen.

Gedacht für ein Tablet im Querformat. Die App läuft als PWA auch offline: https://rziegler.github.io/dot2ten/

## So funktioniert es

- **Tägliche Übung:** vier Blöcke im Verhältnis 2 : 3 : 3 : 2 – Plus bis 10, Zehnerstopp, Minus und Umkehren, Tauschaufgabe. Bei 10 Minuten sind das 2, 3, 3 und 2 Minuten; bei anderer Dauer (5–20 Minuten) wird proportional verteilt, jeder Block hat mindestens 1 Minute.
- **Zwanzigerfeld:** zwei Reihen à 10 Plättchen in Fünferblöcken. Plus: zuerst rot (erste Zahl), dann blau (zweite Zahl). Minus: weggenommene Plättchen sind durchgestrichen.
- **Hilfe statt Fehler:** Bei einer falschen Antwort gibt es kein rotes Kreuz, sondern «Fast!», und die Hilfe zum passenden Trick öffnet sich. Richtige Antworten geben einen Stern.
- **Fortschritt pro Trick:** neu, am Üben oder sicher. Tricks am Üben und oft falsch gelöste Aufgaben kommen häufiger, sichere Tricks seltener.
- **Elternansicht:** Stand pro Trick, Wochenübersicht, Tipp für zu Hause. Dort lassen sich Name des Kindes und Dauer pro Tag einstellen.

## Datenschutz

Alles bleibt auf dem Gerät (`localStorage`). Kein Server, keine Konten, kein Tracking. Schriften sind mitgeliefert, es werden keine externen Ressourcen geladen.

## Starten

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev        # Entwicklungsserver auf http://localhost:5173
```

Weitere Befehle:

```bash
npm test           # Unit-Tests (Vitest)
npm run build      # Typprüfung und Produktions-Build nach dist/
npm run preview    # Produktions-Build lokal ansehen (inkl. Service Worker)
```

## Veröffentlichung

Jeder Push auf `main` testet, baut und veröffentlicht die App über GitHub Actions (`.github/workflows/pages.yml`) auf GitHub Pages:

**https://rziegler.github.io/dot2ten/**

Auf dem Tablet die Seite im Browser öffnen und «Zum Home-Bildschirm» wählen. Danach läuft die App auch ohne Internet.

## Aufbau

```
src/
├── domain/        Reine Logik ohne DOM, mit Unit-Tests
│   ├── aufgaben.ts      Aufgabenpools pro Block und gewichtete Auswahl
│   ├── zeit.ts          Verteilung der Tageszeit auf die Blöcke
│   ├── hilfe.ts         Hilfe- und Lobtexte pro Trick
│   ├── zwanzigerfeld.ts Belegung des Zwanzigerfelds
│   ├── fortschritt.ts   Lernstand pro Trick
│   ├── session.ts       Ablauf der täglichen Übung
│   └── tipp.ts          Tipp für zu Hause
├── ui/            Bildschirme (Vanilla TypeScript)
├── speicher.ts    Laden und Speichern in localStorage
└── main.ts        Routing per URL-Hash
```

Die App-Icons werden aus `public/icon.svg` erzeugt: `npx pwa-assets-generator`.
