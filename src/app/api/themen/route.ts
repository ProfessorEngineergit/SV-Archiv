import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

interface ThemaRequest {
  name: string;
  thema: string;
  nextStunde: {
    date: string;
    dateString: string;
    fs: string;
  };
}

/**
 * Initialize Google Docs API client
 */
function getDocsClient() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON environment variable");
  }

  const credentials = JSON.parse(serviceAccountJson);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });

  return google.docs({ version: "v1", auth });
}

/**
 * Append a theme submission to the Google Doc
 */
async function appendThemeToDoc(thema: ThemaRequest): Promise<void> {
  const docId = process.env.THEMEN_DOC_ID;

  if (!docId) {
    throw new Error("Missing THEMEN_DOC_ID environment variable");
  }

  const docs = getDocsClient();

  // Format the submission
  const timestamp = new Date().toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const submissionText = `\n\nSV-Stunde: ${thema.nextStunde.dateString} (${thema.nextStunde.fs})\nEingereicht von: ${thema.name}\nThema: ${thema.thema}\nZeitpunkt: ${timestamp}\n${"─".repeat(60)}`;

  // Get the document to find the end index
  const doc = await docs.documents.get({ documentId: docId });
  const content = doc.data.body?.content;

  if (!content || content.length === 0) {
    throw new Error("Document has no content");
  }

  const endIndex = content[content.length - 1]?.endIndex;

  if (!endIndex) {
    throw new Error("Could not determine document end index");
  }

  // Append the text to the end of the document
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: {
              index: endIndex - 1, // Insert before the last newline
            },
            text: submissionText,
          },
        },
      ],
    },
  });
}

/**
 * POST /api/themen
 * Submit a new theme for the next SV-Stunde
 */
export async function POST(request: NextRequest) {
  try {
    const body: ThemaRequest = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!body.thema?.trim()) {
      return NextResponse.json(
        { error: "Thema is required" },
        { status: 400 }
      );
    }

    if (!body.nextStunde || !body.nextStunde.dateString || !body.nextStunde.fs) {
      return NextResponse.json(
        { error: "Next SV-Stunde information is required" },
        { status: 400 }
      );
    }

    // Check if environment variables are configured
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const docId = process.env.THEMEN_DOC_ID;

    if (!serviceAccountJson || !docId) {
      console.error("❌ Google Docs API not configured");
      console.error("Missing environment variables:", {
        GOOGLE_SERVICE_ACCOUNT_JSON: serviceAccountJson ? "SET" : "MISSING",
        THEMEN_DOC_ID: docId ? "SET" : "MISSING",
      });
      
      return NextResponse.json(
        { 
          error: "Die Themeneingabe ist momentan nicht verfügbar. Bitte kontaktiere die Administratoren."
        },
        { status: 503 }
      );
    }

    // Append to Google Doc
    await appendThemeToDoc(body);

    return NextResponse.json(
      { success: true, message: "Thema erfolgreich eingereicht" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting theme:", error);

    // Return appropriate error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Fehler beim Einreichen des Themas. Bitte versuche es später erneut.", details: errorMessage },
      { status: 500 }
    );
  }
}
