/**
 * Google Apps Script – Themen-Einreichen → Google Doc
 *
 * Dieses Script empfängt Themenvorschläge aus dem SV-Archiv-Formular
 * und fügt sie in ein Google Doc ein.
 *
 * SETUP:
 *   1. Öffne https://script.google.com und erstelle ein neues Projekt.
 *   2. Ersetze den Inhalt von Code.gs mit diesem Code.
 *   3. Ersetze DOC_ID unten mit der ID deines Google Docs.
 *      (Die ID findest du in der URL: https://docs.google.com/document/d/<DOC_ID>/edit)
 *   4. Klicke auf „Bereitstellen" → „Neue Bereitstellung".
 *   5. Typ: „Web-App", Ausführen als: „Ich", Zugriff: „Jeder".
 *   6. Kopiere die Web-App-URL und setze sie als NEXT_PUBLIC_GOOGLE_SCRIPT_URL in .env.local.
 */

// ========== HIER DEINE GOOGLE DOC ID EINTRAGEN ==========
const DOC_ID = "DEINE_GOOGLE_DOC_ID_HIER";
// =========================================================

/** Formatiert ein Date-Objekt als DD.MM.YYYY HH:MM */
function formatDate(d, includeTime) {
  var day = ("0" + d.getDate()).slice(-2);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var year = d.getFullYear();
  var result = day + "." + month + "." + year;
  if (includeTime) {
    result += " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  return result;
}

/**
 * Wird aufgerufen, wenn das Formular ein Thema einreicht (POST-Request).
 * Erwartet JSON-Body: { name: string, thema: string, date: string }
 */
function doPost(e) {
  try {
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Ungültiges JSON-Format" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var name = data.name || "Unbekannt";
    var thema = data.thema || "(kein Thema)";
    var date = data.date || "";

    // Datum formatieren (ISO → DD.MM.YYYY)
    var formattedDate = "";
    if (date) {
      var d = new Date(date);
      if (!isNaN(d.getTime())) {
        formattedDate = formatDate(d, false);
      }
    }

    // Zeitstempel der Einreichung
    var timestamp = formatDate(new Date(), true);

    // Google Doc öffnen und Inhalt anhängen
    var doc = DocumentApp.openById(DOC_ID);
    var body = doc.getBody();

    // Trennlinie
    body.appendHorizontalRule();

    // Eintrag hinzufügen
    var heading = body.appendParagraph("Thema von " + name);
    heading.setHeading(DocumentApp.ParagraphHeading.HEADING3);

    body.appendParagraph("Für SV-Stunde am: " + formattedDate);
    body.appendParagraph("Eingereicht am: " + timestamp);
    body.appendParagraph("");
    body.appendParagraph(thema);
    body.appendParagraph("");

    doc.saveAndClose();

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET-Request: Zeigt eine einfache Bestätigungsseite (optional, zum Testen).
 */
function doGet() {
  return ContentService
    .createTextOutput("SV-Archiv Themen-Einreichen Script läuft.")
    .setMimeType(ContentService.MimeType.TEXT);
}
