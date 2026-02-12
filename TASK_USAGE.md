# Task Management System - Verwendung

## Zwei Modi verfügbar

Das Aufgabenverwaltungssystem kann auf zwei Arten verwendet werden:

### 1. Mock-Modus (localStorage)
Für Tests und Entwicklung ohne Firebase-Setup.

**Vorteile:**
- ✅ Funktioniert sofort ohne Konfiguration
- ✅ Keine Firebase-Registrierung nötig
- ✅ Daten bleiben im Browser (localStorage)

**Nachteile:**
- ❌ Daten nur lokal gespeichert
- ❌ Keine Synchronisierung zwischen Geräten
- ❌ Daten gehen beim Löschen des Browser-Cache verloren

**Aktivierung:**
In `src/app/aufgaben/TasksClient.tsx` die Import-Zeile ändern:
```typescript
// Statt:
import { getTasks, ... } from '@/lib/taskService';

// Verwenden:
import { getTasks, ... } from '@/lib/taskServiceMock';
```

### 2. Firebase-Modus (Cloud Firestore)
Für Produktion mit Cloud-Speicherung.

**Vorteile:**
- ✅ Cloud-basierte Datenspeicherung
- ✅ Zugriff von überall
- ✅ Daten bleiben persistent
- ✅ Skalierbar und zuverlässig

**Nachteile:**
- ❌ Erfordert Firebase-Projekt-Setup
- ❌ Benötigt Umgebungsvariablen

**Aktivierung:**
1. Folge der Anleitung in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. Stelle sicher, dass `src/app/aufgaben/TasksClient.tsx` die Firebase-Version importiert:
```typescript
import { getTasks, ... } from '@/lib/taskService';
```

## Standard-Modus

Der Standard-Modus ist **Firebase** (`taskService`), aber wenn keine Firebase-Credentials vorhanden sind, wird ein Fehler angezeigt.

Für lokale Tests empfehlen wir:
1. Entweder Firebase einrichten (siehe [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
2. Oder zum Mock-Modus wechseln (siehe oben)

## Features

Beide Modi unterstützen alle Features:
- ✅ 3-Phasen-Fortschrittssystem
- ✅ Wiederholungsintervalle
- ✅ Fälligkeitsdaten
- ✅ Löschen von Aufgaben
- ✅ Automatische Neuplanung

## Empfehlung

- **Entwicklung/Tests:** Mock-Modus (localStorage)
- **Produktion:** Firebase-Modus (Firestore)
