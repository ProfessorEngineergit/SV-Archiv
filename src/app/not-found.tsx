import Link from "next/link";
import SceneWrapper from "@/components/three/SceneWrapper";

export default function NotFoundPage() {
  return (
    <>
      <SceneWrapper variant="404" />
      <section className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
        <article className="text-center max-w-xl">
          {/* Error code display */}
          <div className="relative mb-8">
            <span className="block text-[10rem] font-extralight tracking-widest text-cyan-400/20 leading-none md:text-[14rem] select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-mono text-cyan-400/60 tracking-[0.5em] md:text-5xl">
                FEHLER
              </span>
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-8 p-6 border border-orange-400/30 bg-orange-500/5">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-orange-400/70" />
              <span className="text-xs font-mono text-orange-400/80 tracking-wider">WARNMELDUNG</span>
            </div>
            <p className="text-xl font-light text-slate-300">
              Dokument nicht im Archiv lokalisiert
            </p>
          </div>
          
          <p className="mb-10 text-slate-500 leading-relaxed">
            Das angeforderte Datenfragment existiert nicht in der aktuellen Archiv-Matrix
            oder wurde in einen anderen Speichersektor verschoben.
          </p>
          
          {/* Return button */}
          <Link
            href="/archiv"
            className="group relative inline-flex items-center gap-4 px-8 py-4"
          >
            <span className="absolute inset-0 border border-cyan-400/30 transition-all group-hover:border-cyan-400/60" />
            <span className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <svg className="relative h-4 w-4 text-cyan-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            
            <span className="relative text-sm font-light tracking-[0.2em] text-cyan-300 group-hover:text-cyan-200">
              ZUM ARCHIV ZURÜCKKEHREN
            </span>
          </Link>
          
          {/* Status info */}
          <div className="mt-12 text-xs font-mono text-slate-600">
            ARCHIV-STATUS: AKTIV :: DATENINTEGRITÄT: 99.97%
          </div>
        </article>
      </section>
    </>
  );
}
