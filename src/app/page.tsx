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

          {/* Animated pencil-sketch decorative drawing */}
          <div className="mb-8 flex justify-center">
            <svg width="160" height="20" viewBox="0 0 160 20" className="overflow-visible">
              <path d="M10,10 Q30,2 50,10 T90,10 T130,10 T150,10" stroke="#1c1917" strokeWidth="1.5" fill="none" className="pencil-line" strokeLinecap="round" />
              <circle cx="10" cy="10" r="3" stroke="#78716c" strokeWidth="1" fill="none" className="circle-draw" style={{ animationDelay: "0.8s" }} />
              <circle cx="150" cy="10" r="3" stroke="#78716c" strokeWidth="1" fill="none" className="circle-draw" style={{ animationDelay: "1.2s" }} />
            </svg>
          </div>

          {/* Main title — Arial, wide tracking, embossed feel */}
          <h1 className="mb-3 text-5xl font-extralight tracking-[0.3em] text-stone-900 md:text-7xl uppercase text-embossed handwrite-reveal">
            SV FWS FFM
          </h1>

          {/* Subtitle label — typewriter font */}
          <p className="mb-10 font-subtitle text-sm tracking-[0.3em] text-stone-500 uppercase fade-draw-in" style={{ animationDelay: "0.5s", opacity: 0 }}>
            Protokoll-Archiv
          </p>

          {/* Frosted glass description panel */}
          <div className="glass mb-12 max-w-xl mx-auto p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-left">
              <div className="w-1 md:w-1 md:self-stretch bg-stone-900/80 flex-shrink-0 h-1 md:h-auto min-h-[3rem] rounded-full" />
              <p className="text-sm font-light text-stone-500 leading-relaxed tracking-wide">
                Zentrales Archiv für SV-Protokolle und Dokumentation.
                Zugang zu allen Protokollen und Beschlüssen der Schülervertretung.
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <CountdownTimer nextStunde={nextStunde} />

          {/* CTA — tactile button with rounded corners */}
          <Link
            href="/archiv"
            className="pencil-btn group mt-10 inline-flex items-center gap-4 px-8 py-4 bg-stone-900 text-white text-xs font-medium tracking-[0.2em] uppercase transition-all hover:bg-stone-800"
          >
            Archiv betreten
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" className="pencil-line" style={{ animationDelay: "1s" }} />
            </svg>
          </Link>

          {/* Live-drawing decorative scribble */}
          <div className="mt-10 flex justify-center">
            <svg width="240" height="24" viewBox="0 0 240 24" className="overflow-visible opacity-40">
              <path d="M0,12 C20,4 40,20 60,12 C80,4 100,20 120,12 C140,4 160,20 180,12 C200,4 220,20 240,12" stroke="#78716c" strokeWidth="1" fill="none" className="pencil-scribble" strokeLinecap="round" />
              <path d="M20,16 C40,8 60,22 80,14 C100,8 120,22 140,14 C160,8 180,22 200,14 C220,8 230,16 240,14" stroke="#a8a29e" strokeWidth="0.6" fill="none" className="pencil-scribble" strokeLinecap="round" style={{ animationDelay: "0.5s" }} />
            </svg>
          </div>

          {/* Bottom status indicators in frosted glass pill */}
          <div className="mt-8 inline-flex glass-subtle px-6 py-3 gap-8 text-[10px] text-stone-400 tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Systeme aktiv
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Daten verfügbar
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
