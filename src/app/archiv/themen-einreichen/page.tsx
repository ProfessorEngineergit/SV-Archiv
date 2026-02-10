import ArchiveTabs from "@/components/ArchiveTabs";
import ThemenForm from "./ThemenForm";
import { getTermine } from "@/lib/termine";
import { getNextSVStunde, formatSVStundeDisplay } from "@/lib/schedule";

export const metadata = {
  title: "Themen Einreichen | SV-Archiv",
  description: "Reiche ein Thema für die nächste SV-Stunde ein",
};

export default function ThemenEinreichenPage() {
  const termine = getTermine();
  const nextStunde = getNextSVStunde(termine);

  return (
    <>
      <ArchiveTabs />
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
            <span className="text-xs text-cyan-400/60 tracking-widest">THEMEN EINREICHEN</span>
            <div className="h-px flex-1 bg-gradient-to-l from-cyan-400/40 to-transparent" />
          </div>

          <h1 className="mb-4 text-5xl font-light tracking-[0.15em] text-cyan-50 text-center">
            THEMEN EINREICHEN
          </h1>
          
          {nextStunde ? (
            <p className="text-slate-400 text-center">
              Reiche ein Thema für die SV-Stunde am{" "}
              <span className="text-cyan-400 font-medium">
                {formatSVStundeDisplay(nextStunde)}
              </span>
              {" "}ein
            </p>
          ) : (
            <p className="text-slate-400 text-center">
              Keine bevorstehenden SV-Stunden geplant
            </p>
          )}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <ThemenForm nextStunde={nextStunde} />
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 border border-violet-400/20 bg-violet-900/10 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-violet-400"
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
              <h3 className="text-sm font-medium text-violet-300 mb-1">
                Hinweis
              </h3>
              <p className="text-sm text-slate-400">
                Eingereichte Themen werden in einem Google Docs-Dokument gespeichert.
                Die Liste wird nach jeder SV-Stunde automatisch geleert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
