"use client";

import { useState } from "react";

interface PdfViewerProps {
  file: string;
  title: string;
}

export default function PdfViewer({ file, title }: PdfViewerProps) {
  const [loadFailed, setLoadFailed] = useState(false);

  if (loadFailed) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 glass rounded-2xl">
        <svg className="h-16 w-16 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="text-center">
          <p className="text-stone-600 mb-2 font-medium">PDF-Vorschau nicht verfügbar</p>
          <p className="text-sm text-stone-400 mb-6">
            Dein Browser unterstützt keine eingebetteten PDFs. Bitte lade das Dokument herunter.
          </p>
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF öffnen / herunterladen
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      <iframe
        src={file}
        className="w-full rounded-2xl border border-stone-200/50"
        style={{
          height: "calc(100vw * 1.414)",
          maxHeight: "85vh",
          minHeight: "500px",
        }}
        title={title}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-downloads"
        onError={() => setLoadFailed(true)}
      />
      {/* Mobile fallback hint */}
      <p className="mt-3 text-xs text-stone-400 text-center sm:hidden">
        Falls das PDF nicht angezeigt wird, bitte{" "}
        <a href={file} target="_blank" rel="noopener noreferrer" className="text-stone-800 underline">
          hier öffnen
        </a>
        .
      </p>
    </div>
  );
}
