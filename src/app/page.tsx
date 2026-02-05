import Link from "next/link";
import SceneWrapper from "@/components/three/SceneWrapper";

export default function Home() {
  return (
    <>
      <SceneWrapper />
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-extralight tracking-[0.2em] text-cyan-50 md:text-7xl">
            SV-ARCHIV
          </h1>
          <p className="mb-12 text-lg font-light tracking-wide text-slate-400 md:text-xl">
            Ein öffentliches Archiv für Protokolle und Dokumentation
          </p>
          <Link
            href="/archiv"
            className="inline-flex items-center gap-3 border border-cyan-500/30 bg-cyan-500/10 px-8 py-4 text-sm font-light tracking-widest text-cyan-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/20"
          >
            ZUM ARCHIV
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
