import Link from "next/link";
import SceneWrapper from "@/components/three/SceneWrapper";
import CountdownTimer from "@/components/CountdownTimer";
import { getTermine } from "@/lib/termine";
import { getNextSVStunde } from "@/lib/schedule";

export default function Home() {
  const termine = getTermine();
  const nextStunde = getNextSVStunde(termine);

  return (
    <>
      <SceneWrapper />
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="text-center max-w-3xl w-full">

          {/* Thin rule */}
          <div className="mb-10 flex justify-center">
            <div className="h-px w-24 bg-stone-900" />
          </div>

          {/* Main title — light sans-serif, wide tracking */}
          <h1 className="mb-2 text-5xl font-extralight tracking-[0.3em] text-stone-900 md:text-7xl uppercase">
            SV FWS FFM
          </h1>

          {/* Subtitle label */}
          <p className="mb-10 text-[11px] tracking-[0.5em] text-stone-400 uppercase">
            Protokoll-Archiv
          </p>

          {/* Thick rule + description side by side on desktop */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 text-left max-w-xl mx-auto">
            <div className="w-1 md:w-1 md:self-stretch bg-stone-900 flex-shrink-0 h-1 md:h-auto min-h-[3rem]" />
            <p className="text-sm font-light text-stone-500 leading-relaxed tracking-wide">
              Zentrales Archiv für SV-Protokolle und Dokumentation.
              Zugang zu allen Protokollen und Beschlüssen der Schülervertretung.
            </p>
          </div>

          {/* Countdown Timer */}
          <CountdownTimer nextStunde={nextStunde} />

          {/* CTA — brutalist: black filled button */}
          <Link
            href="/archiv"
            className="group mt-10 inline-flex items-center gap-4 px-8 py-4 bg-stone-900 text-white text-xs font-medium tracking-[0.2em] uppercase transition-all hover:bg-stone-800"
          >
            Archiv betreten
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Bottom rule */}
          <div className="mt-16 flex justify-center gap-8 text-[10px] text-stone-400 tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
              Systeme aktiv
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
              Daten verfügbar
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
