import Link from "next/link";
import SceneWrapper from "@/components/three/SceneWrapper";

export default function NotFoundPage() {
  return (
    <>
      <SceneWrapper variant="404" />
      <section className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
        <article className="text-center">
          <span className="mb-4 block text-8xl font-extralight tracking-widest text-cyan-500/50 md:text-9xl">
            404
          </span>
          <p className="mb-8 text-2xl font-light tracking-wide text-slate-300 md:text-3xl">
            Nicht im Archiv gefunden
          </p>
          <p className="mx-auto mb-12 max-w-md text-slate-500">
            Das gesuchte Dokument existiert nicht oder wurde möglicherweise verschoben.
          </p>
          <Link
            href="/archiv"
            className="inline-flex items-center gap-3 border border-cyan-500/30 bg-cyan-500/10 px-8 py-4 text-sm font-light tracking-widest text-cyan-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/20"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            ZURÜCK ZUM ARCHIV
          </Link>
        </article>
      </section>
    </>
  );
}
