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

          {/* Animated pencil-sketch decorative line */}
          <div className="mb-10 flex justify-center">
            <svg width="120" height="6" viewBox="0 0 120 6" className="overflow-visible">
              <path d="M0,3 Q15,0 30,3 T60,3 T90,3 T120,3" stroke="#1c1917" strokeWidth="1.5" fill="none" className="pencil-line" strokeLinecap="round" />
            </svg>
          </div>

          {/* Main title — Arial, wide tracking, embossed feel */}
          <h1 className="mb-2 text-5xl font-extralight tracking-[0.3em] text-stone-900 md:text-7xl uppercase text-embossed">
            SV FWS FFM
          </h1>

          {/* Subtitle label — American Typewriter */}
          <p className="mb-10 font-subtitle text-sm tracking-[0.3em] text-stone-500 uppercase">
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

          {/* CTA — tactile button with pencil-style hover */}
          <Link
            href="/archiv"
            className="pencil-btn group mt-10 inline-flex items-center gap-4 px-8 py-4 bg-stone-900 text-white text-xs font-medium tracking-[0.2em] uppercase transition-all hover:bg-stone-800"
          >
            Archiv betreten
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Pencil-sketch decorative divider */}
          <div className="mt-12 flex justify-center">
            <svg width="200" height="12" viewBox="0 0 200 12" className="overflow-visible opacity-30">
              <path d="M0,6 Q25,1 50,6 T100,6 T150,6 T200,6" stroke="#78716c" strokeWidth="1" fill="none" className="pencil-scribble" strokeLinecap="round" />
              <path d="M20,8 Q45,3 70,8 T120,8 T170,8 T200,8" stroke="#78716c" strokeWidth="0.5" fill="none" className="pencil-scribble" strokeLinecap="round" style={{ animationDelay: "0.3s" }} />
            </svg>
          </div>

          {/* Bottom status indicators */}
          <div className="mt-8 flex justify-center gap-8 text-[10px] text-stone-400 tracking-widest uppercase">
            <span className="flex items-center gap-2 pencil-underline">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Systeme aktiv
            </span>
            <span className="flex items-center gap-2 pencil-underline">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Daten verfügbar
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
