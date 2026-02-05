# SV-Archiv

Ein öffentliches Archiv für Protokolle und Dokumentation im minimalistischen Sci-Fi-Stil.

## Über das Projekt

SV-Archiv ist eine moderne Web-Anwendung zur Verwaltung und Präsentation von Protokollen und Dokumenten. Das Design orientiert sich an einem ruhigen, futuristischen Archiv-Konzept mit dezenten Three.js-Hintergründen.

## Technologien

| Bereich | Technologie |
|---------|-------------|
| Framework | Next.js 16 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS 4 |
| 3D-Grafik | React Three Fiber, Drei |
| Content | Markdown, gray-matter, remark |

## Installation & Start

```bash
npm install
npm run dev
```

Anschließend ist die Anwendung unter `http://localhost:3000` verfügbar.

## Verzeichnisstruktur

- `src/app/` - Next.js App Router Seiten
- `src/components/` - React-Komponenten (Layout, Three.js, UI)
- `src/lib/` - Hilfsfunktionen und Datenverarbeitung
- `content/protocols/` - Markdown-Dokumente

## Protokoll erstellen

Neue Dokumente werden als Markdown-Dateien in `content/protocols/` angelegt:

```markdown
---
title: Dokumenttitel
date: 2026-02-05
project: Projektname
tags: [tag1, tag2]
version: 1
visibility: public
---

# Überschrift

Dokumentinhalt...
```

## Seiten

| Route | Beschreibung |
|-------|--------------|
| `/` | Startseite mit Three.js-Hintergrund |
| `/archiv` | Übersicht aller Protokolle mit Filteroptionen |
| `/dokument/[slug]` | Detailansicht eines Dokuments |

## Design-Konzept

- Dunkles Farbschema mit Cyan als Akzentfarbe
- Dezente Three.js-Animationen im Hintergrund
- Unterstützung für `prefers-reduced-motion`
- Typografie im Museums-Stil
