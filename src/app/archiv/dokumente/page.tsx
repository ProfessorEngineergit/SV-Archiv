export const metadata = {
  title: "Dokumente | SV-Archiv",
  description: "Wichtige Dokumente wie Satzung und gewählte Personen",
};

// Placeholder documents - these would be fetched from Google Drive in a full implementation
const documents = [
  {
    title: "Satzung",
    description: "Die aktuelle Satzung der Schülervertretung",
    type: "Google Docs",
  },
  {
    title: "Gewählte Personen",
    description: "Übersicht der gewählten Mitglieder",
    type: "Google Docs",
  },
];

const CARD_ANIMATION_DELAY_INCREMENT_SEC = 0.08;
const ICON_ANIMATION_DELAY_BASE_SEC = 0;
const TITLE_ANIMATION_DELAY_BASE_SEC = 0.1;
const DESCRIPTION_ANIMATION_DELAY_BASE_SEC = 0.16;

export default function DokumentePage() {
  return (
    <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10 fade-draw-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent" />
            <span className="text-xs text-stone-400 tracking-widest handwrite-reveal">DOKUMENTE</span>
            <div className="h-px flex-1 bg-gradient-to-l from-stone-300 to-transparent" />
          </div>

          <h1 className="mb-4 text-5xl font-light tracking-[0.15em] text-stone-900 text-center handwrite-reveal" style={{ animationDelay: "0.2s" }}>
            DOKUMENTE
          </h1>
          <p className="text-stone-500 text-center fade-draw-in" style={{ animationDelay: "0.3s" }}>
            Wichtige Dokumente und Informationen
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Sequential draw-in across cards */}
          {documents.map((doc, index) => (
            <div
              key={doc.title}
              className="group p-8 border border-stone-200 bg-white rounded-lg transition-all duration-300 hover:border-stone-300 hover:shadow-md cursor-pointer"
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-stone-50 border border-stone-200 group-hover:bg-stone-100 transition-all">
                  <svg
                    className="h-6 w-6 text-stone-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Sequential draw-in: each icon starts with a delay based on its card position */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      className="pencil-line"
                      style={{ animationDelay: `${ICON_ANIMATION_DELAY_BASE_SEC + index * CARD_ANIMATION_DELAY_INCREMENT_SEC}s` }}
                    />
                  </svg>
                </div>
              </div>

              <h2
                className="mb-2 text-xl font-medium text-stone-800 group-hover:text-stone-900 transition-colors handwrite-reveal"
                style={{ animationDelay: `${TITLE_ANIMATION_DELAY_BASE_SEC + index * CARD_ANIMATION_DELAY_INCREMENT_SEC}s` }}
              >
                {doc.title}
              </h2>
              
              <p className="text-sm text-stone-500 mb-4 fade-draw-in" style={{ animationDelay: `${DESCRIPTION_ANIMATION_DELAY_BASE_SEC + index * CARD_ANIMATION_DELAY_INCREMENT_SEC}s` }}>
                {doc.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                {doc.type}
              </div>
            </div>
          ))}
        </div>

        {/* Info message */}
        <div className="mt-12 p-6 border border-stone-200 bg-stone-50 rounded-lg max-w-3xl mx-auto fade-draw-in" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-stone-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  className="pencil-line"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-900 mb-1 handwrite-reveal" style={{ animationDelay: "0.7s" }}>
                Hinweis
              </h3>
              <p className="text-sm text-stone-500 fade-draw-in" style={{ animationDelay: "0.8s" }}>
                Die Dokumente werden aus dem Google Drive &quot;Dokumente&quot;-Ordner geladen.
                Diese Funktion wird nach der Einrichtung der Ordnerstruktur verfügbar sein.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
