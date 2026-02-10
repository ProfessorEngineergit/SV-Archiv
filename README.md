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

## Google Drive spiegeln

Die Protokolle werden aus Google Drive synchronisiert. Google Drive ist die Single Source of Truth.

### Benötigte Umgebungsvariablen

| Variable | Beschreibung |
|----------|--------------|
| `DRIVE_FOLDER_ID` | Die ID des Google-Drive-Ordners mit den PDFs |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON-Credentials des Service Accounts |
| `THEMEN_DOC_ID` | Die ID des Google Docs-Dokuments für Themeneingaben (optional) |

### Service Account einrichten

1. Google Cloud Console öffnen
2. Neues Projekt erstellen oder bestehendes auswählen
3. Google Drive API aktivieren
4. Service Account erstellen
5. JSON-Key herunterladen
6. Service Account E-Mail-Adresse zum Drive-Ordner hinzufügen (Lesezugriff)

### Sync ausführen

```bash
npm run sync-drive
```

Oder direkt mit ts-node:

```bash
npx ts-node --transpile-only --compiler-options '{"module":"commonjs","moduleResolution":"node","esModuleInterop":true}' scripts/sync-drive.ts
```

### Dateiformat in Google Drive

Alle PDFs müssen folgendes Namensformat haben:

```
SV-Protokoll 25.11.2025.pdf
SV-Protokoll vom 19.1.2026.pdf
```

Unterstützt werden:
- Datumsformat mit oder ohne "vom"
- Einstellige und zweistellige Tage/Monate

Das Script parst automatisch:
- **title**: `SV-Protokoll`
- **date**: `2025-11-25` oder `2026-01-19`
- **slug**: `sv-protokoll-2025-11-25` oder `sv-protokoll-2026-01-19`

### GitHub Actions

Die Synchronisierung erfolgt automatisch über GitHub Actions alle 6 Stunden.

#### Benötigte Repository Secrets

Die folgenden Secrets müssen in den Repository-Einstellungen unter **Settings → Secrets and variables → Actions** hinterlegt werden:

| Secret | Beschreibung |
|--------|--------------|
| `DRIVE_FOLDER_ID` | Die ID des Google-Drive-Ordners mit den PDFs |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Der vollständige JSON-Inhalt der Service Account Credentials |
| `THEMEN_DOC_ID` | Die ID des Google Docs-Dokuments für Themeneingaben (optional) |

**Hinweis:** Wenn `THEMEN_DOC_ID` nicht konfiguriert ist, wird die Themeneingabe-Funktion eine benutzerfreundliche Fehlermeldung anzeigen, die Nutzer darüber informiert, dass die Funktion momentan nicht verfügbar ist.

#### Workflow manuell starten

1. Zum Tab **Actions** im Repository navigieren
2. Links den Workflow **Sync Google Drive** auswählen
3. Rechts auf **Run workflow** klicken
4. Branch auswählen (normalerweise `main`)
5. Auf den grünen **Run workflow** Button klicken

Der Workflow läuft auch automatisch alle 6 Stunden per Schedule.

### Ergebnis

Nach dem Sync liegen die Dateien in:
- `public/downloads/<slug>.pdf` – die PDF-Dateien
- `public/downloads/<slug>.pdf.meta.json` – Metadaten (für Change-Detection)
- `public/data/index.json` – Index aller Dateien (Array, sortiert nach Datum, neueste zuerst)

## Themen einreichen

Benutzer können über die Webseite Themen für die nächste SV-Stunde einreichen. Diese Funktion benötigt ein konfiguriertes Google Docs-Dokument.

### Konfiguration

1. Erstelle ein neues Google Docs-Dokument für die Themenliste
2. Teile das Dokument mit der Service Account E-Mail-Adresse (Bearbeitungsrechte)
3. Kopiere die Dokument-ID aus der URL (z.B. `https://docs.google.com/document/d/[DOKUMENT_ID]/edit`)
4. Setze die Umgebungsvariable `THEMEN_DOC_ID` auf diese ID

### Verhalten ohne Konfiguration

Wenn `THEMEN_DOC_ID` oder `GOOGLE_SERVICE_ACCOUNT_JSON` nicht konfiguriert sind, zeigt das System automatisch eine benutzerfreundliche Fehlermeldung an:

> "Die Themeneingabe ist momentan nicht verfügbar. Bitte kontaktiere die Administratoren."

Dies ermöglicht es, die Anwendung zu betreiben, ohne dass die Themeneingabe-Funktion vollständig konfiguriert sein muss.
