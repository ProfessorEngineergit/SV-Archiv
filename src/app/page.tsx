import Link from "next/link";
import SceneWrapper from "@/components/three/SceneWrapper";

export default function Home() {
  return (
    <>
      <SceneWrapper />
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          {/* Decorative top element */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border border-cyan-400/40" />
            </div>
          </div>
          
          {/* Main title */}
          <h1 className="mb-4 text-6xl font-extralight tracking-[0.25em] text-cyan-50 md:text-8xl holo-text">
            SV-ARCHIV
          </h1>
          
          {/* Subtitle */}
          <div className="mb-8 flex justify-center items-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-400/50" />
            <span className="text-xs text-violet-300/70 tracking-[0.4em]">PROTOKOLL-VERWALTUNG</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-400/50" />
          </div>
          
          <p className="mb-12 text-lg font-light tracking-wide text-slate-400 md:text-xl leading-relaxed">
            Zentrales Archiv für SV-Protokolle und Dokumentation.
            <br />
            <span className="text-slate-500">Zugang zu allen Protokollen und Beschlüssen.</span>
          </p>
          
          {/* CTA Button */}
          <Link
            href="/archiv"
            className="btn-glow group relative inline-flex items-center gap-4 px-10 py-5 overflow-hidden bg-cyan-500/5 border border-cyan-400/30 rounded-lg transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/10"
          >
            <span className="relative text-sm font-medium tracking-[0.2em] text-cyan-300 group-hover:text-cyan-200 transition-colors">
              ARCHIV BETRETEN
            </span>
            
            <svg
              className="relative h-4 w-4 text-cyan-400 transition-transform group-hover:translate-x-1"
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
          
          {/* Status indicators */}
          <div className="mt-16 flex justify-center gap-8 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
              SYSTEME AKTIV
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400/60" />
              DATEN VERFÜGBAR
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
