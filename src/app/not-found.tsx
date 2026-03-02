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
            <span className="block text-[10rem] font-extralight tracking-widest text-stone-200 leading-none md:text-[14rem] select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl text-stone-500 tracking-[0.5em] md:text-5xl">
                FEHLER
              </span>
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-8 p-6 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-xs text-orange-500 tracking-wider">HINWEIS</span>
            </div>
            <p className="text-xl font-light text-stone-700">
              Seite nicht gefunden
            </p>
          </div>
          
          <p className="mb-10 text-stone-400 leading-relaxed">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          
          {/* Return button */}
          <Link
            href="/archiv"
            className="btn-glow group relative inline-flex items-center gap-4 px-8 py-4 border border-stone-200 rounded-lg bg-white transition-all hover:border-stone-300 hover:bg-stone-50 shadow-sm"
          >
            <svg className="relative h-4 w-4 text-stone-400 group-hover:text-stone-800 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            
            <span className="relative text-sm font-medium tracking-[0.15em] text-stone-600 group-hover:text-stone-900">
              Zum Archiv
            </span>
          </Link>
        </article>
      </section>
    </>
  );
}
