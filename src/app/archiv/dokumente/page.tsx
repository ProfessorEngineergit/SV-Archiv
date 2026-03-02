import ArchiveTabs from "@/components/ArchiveTabs";

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

export default function DokumentePage() {
  return (
    <>
      <ArchiveTabs />
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent" />
            <span className="text-xs text-stone-400 tracking-widest">DOKUMENTE</span>
            <div className="h-px flex-1 bg-gradient-to-l from-stone-300 to-transparent" />
          </div>

          <h1 className="mb-4 text-5xl font-light tracking-[0.15em] text-stone-900 text-center">
            DOKUMENTE
          </h1>
          <p className="text-stone-500 text-center">
            Wichtige Dokumente und Informationen
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {documents.map((doc) => (
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="mb-2 text-xl font-medium text-stone-800 group-hover:text-stone-900 transition-colors">
                {doc.title}
              </h2>
              
              <p className="text-sm text-stone-500 mb-4">
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
        <div className="mt-12 p-6 border border-stone-200 bg-stone-50 rounded-lg max-w-3xl mx-auto">
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
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-900 mb-1">
                Hinweis
              </h3>
              <p className="text-sm text-stone-500">
                Die Dokumente werden aus dem Google Drive &quot;Dokumente&quot;-Ordner geladen.
                Diese Funktion wird nach der Einrichtung der Ordnerstruktur verfügbar sein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
