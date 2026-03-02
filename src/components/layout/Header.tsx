"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-stone-900 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="container mx-auto px-6 py-3">
        <nav className="flex items-center justify-between">
          {/* Bauhaus geometric circle logo + wordmark */}
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative h-10 w-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                <circle cx="20" cy="20" r="18" stroke="#1c1917" strokeWidth="2" fill="none" />
                <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif" fill="#1c1917" letterSpacing="1">SV</text>
              </svg>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-px h-8 bg-stone-300" />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-light tracking-[0.25em] text-stone-900 uppercase">
                  SV FWS FFM
                </span>
                <span className="text-[9px] text-stone-400 tracking-[0.3em] uppercase font-subtitle">
                  Protokoll-Archiv
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center">
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-stone-400 tracking-widest mr-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AKTIV
            </div>

            <Link
              href="/archiv"
              className="pencil-btn px-5 py-3 text-xs font-medium tracking-[0.15em] text-white uppercase bg-stone-900 hover:bg-stone-800 transition-all hover:shadow-lg"
            >
              Archiv
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
