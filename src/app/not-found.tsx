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
              <span className="text-4xl text-cyan-400/60 tracking-[0.5em] md:text-5xl">
                FEHLER
              </span>
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-8 p-6 border border-orange-400/30 bg-orange-500/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-orange-400/70" />
              <span className="text-xs text-orange-400/80 tracking-wider">HINWEIS</span>
            </div>
            <p className="text-xl font-light text-slate-300">
              Seite nicht gefunden
            </p>
          </div>
          
          <p className="mb-10 text-slate-500 leading-relaxed">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          
          {/* Return button */}
          <Link
            href="/archiv"
            className="btn-glow group relative inline-flex items-center gap-4 px-8 py-4 border border-cyan-400/30 rounded-lg bg-cyan-500/5 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/10"
          >
            <svg className="relative h-4 w-4 text-cyan-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            
            <span className="relative text-sm font-medium tracking-[0.15em] text-cyan-300 group-hover:text-cyan-200">
              Zum Archiv
            </span>
          </Link>
        </article>
      </section>
    </>
  );
}
