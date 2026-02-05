"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-400/20 bg-slate-950/90 backdrop-blur-md">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-4"
          >
            <div className="relative h-10 w-10 flex items-center justify-center">
              <div className="absolute inset-0 border border-cyan-400/40 rotate-45 transition-transform group-hover:rotate-[135deg] group-hover:border-violet-400/60" />
              <div className="absolute inset-1 border border-violet-400/30 transition-all group-hover:scale-90 group-hover:border-cyan-400/50" />
              <span className="text-xs font-mono text-cyan-300 group-hover:text-violet-300 transition-colors">SV</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg font-extralight tracking-[0.3em] text-cyan-50 transition-colors group-hover:text-cyan-300">
                SV-ARCHIV
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-widest">
                ARCHIV-EPOCHE 4000
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(103,232,249,0.5)]" />
              <span>AKTIV</span>
            </div>
            
            <Link
              href="/archiv"
              className="future-btn relative px-5 py-2 text-sm font-light tracking-widest text-slate-300 transition-all hover:text-cyan-300 border border-transparent hover:border-cyan-500/30"
            >
              <span className="relative z-10">ARCHIV</span>
            </Link>
          </div>
        </nav>
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
    </header>
  );
}
