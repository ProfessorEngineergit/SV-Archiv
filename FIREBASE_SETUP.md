# Firebase Setup Guide für Aufgaben-Feature

## 1. Firebase Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Gib deinem Projekt einen Namen (z.B. "SV-Archiv")
4. Folge den Schritten zur Projekterstellung

## 2. Web-App in Firebase registrieren

1. Klicke in der Projektübersicht auf das Web-Symbol (`</>`)
2. Gib einen App-Namen ein (z.B. "SV-Archiv Web")
3. Klicke auf "App registrieren"
4. Kopiere die Firebase-Konfiguration

## 3. Firestore Database aktivieren

1. Gehe im linken Menü zu "Firestore Database"
2. Klicke auf "Datenbank erstellen"
3. Wähle "Im Testmodus starten" (für Entwicklung)
4. Wähle einen Standort (z.B. "europe-west3" für Deutschland)
5. Klicke auf "Aktivieren"

## 4. Firestore Security Rules einrichten

1. Gehe zu "Firestore Database" → "Rules"
2. Kopiere den Inhalt aus `firestore.rules` und füge ihn ein
3. Klicke auf "Veröffentlichen"

**Wichtig für Produktion:**
Die aktuellen Rules erlauben jedem Zugriff. Für Produktion solltest du Authentication hinzufügen und die Rules anpassen:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // Nur authentifizierte Benutzer können ihre eigenen Tasks verwalten
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 5. Environment Variables einrichten

1. Kopiere `.env.local.example` nach `.env.local`
2. Fülle die Firebase-Konfigurationswerte aus:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=dein_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dein-projekt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dein-projekt-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dein-projekt.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=deine_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=deine_app_id
```

Diese Werte findest du in der Firebase Console unter:
**Projekteinstellungen** → **Allgemein** → **Deine Apps** → **SDK-Konfiguration**

## 6. Lokale Entwicklung starten

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000/aufgaben](http://localhost:3000/aufgaben)

## 7. Testen

1. Klicke auf "Neue Aufgabe"
2. Erstelle eine Test-Aufgabe
3. Klicke auf die Fortschritts-Boxen (1/3, 2/3, 3/3)
4. Teste verschiedene Wiederholungsintervalle

## Troubleshooting

### "Missing or insufficient permissions" Fehler

**Ursachen:**
1. Firestore Rules sind zu restriktiv
2. Firebase-Konfiguration ist falsch
3. Firestore Database ist nicht aktiviert

**Lösungen:**
1. Überprüfe die Firestore Rules (siehe Schritt 4)
2. Stelle sicher, dass alle Environment Variables korrekt sind
3. Überprüfe in der Firebase Console, ob Firestore aktiviert ist
4. Schaue in die Browser-Konsole für detaillierte Fehlermeldungen

### Tasks werden nicht geladen

1. Öffne die Browser-Konsole (F12)
2. Überprüfe auf Fehler
3. Stelle sicher, dass Firebase korrekt initialisiert ist
4. Überprüfe die Network-Requests in den DevTools

## Deployment

Für GitHub Pages oder Vercel:

1. Füge die Environment Variables in deiner Deployment-Platform hinzu
2. In GitHub: **Settings** → **Secrets and variables** → **Actions**
3. Füge alle `NEXT_PUBLIC_*` Variablen hinzu
4. Deploy deine App

## Weitere Features (Optional)

### Firebase Authentication hinzufügen

1. Gehe zu **Authentication** in der Firebase Console
2. Klicke auf "Erste Schritte"
3. Aktiviere Anmeldemethoden (z.B. E-Mail/Passwort, Google)
4. Implementiere Login in der App
5. Aktualisiere die Firestore Rules mit userId-Check

### Indexe für bessere Performance

Falls Firestore einen Index-Fehler anzeigt:
1. Klicke auf den Link in der Fehlermeldung
2. Erstelle den vorgeschlagenen Index
3. Warte ein paar Minuten, bis der Index erstellt ist

## Support

Bei Problemen:
1. Prüfe die [Firebase Dokumentation](https://firebase.google.com/docs)
2. Schaue in die Browser-Konsole für Fehlermeldungen
3. Überprüfe die Firebase Console für Quota-Limits
