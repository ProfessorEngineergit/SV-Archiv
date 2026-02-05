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
          
          {/* Subtitle with year */}
          <div className="mb-8 flex justify-center items-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-400/50" />
            <span className="text-xs font-mono text-violet-300/70 tracking-[0.4em]">EPOCHE 4000</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-400/50" />
          </div>
          
          <p className="mb-12 text-lg font-light tracking-wide text-slate-400 md:text-xl leading-relaxed">
            Zentrales Wissensrepository der interstellaren Konföderation.
            <br />
            <span className="text-slate-500">Zugang zu historischen Protokollen und Dokumentationen.</span>
          </p>
          
          {/* CTA Button */}
          <Link
            href="/archiv"
            className="group relative inline-flex items-center gap-4 px-10 py-5 overflow-hidden"
          >
            {/* Button border */}
            <span className="absolute inset-0 border border-cyan-400/30 transition-all duration-300 group-hover:border-cyan-400/60" />
            
            {/* Background glow */}
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Corner accents */}
            <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-cyan-400/50" />
            <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-cyan-400/50" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-cyan-400/50" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan-400/50" />
            
            <span className="relative text-sm font-light tracking-[0.3em] text-cyan-300 group-hover:text-cyan-200 transition-colors">
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
          <div className="mt-16 flex justify-center gap-8 text-xs font-mono text-slate-600">
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
