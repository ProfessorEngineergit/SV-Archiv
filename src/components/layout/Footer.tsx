export default function Footer() {
  return (
    <footer className="border-t border-cyan-400/15 bg-slate-950/95 backdrop-blur-sm">
      <div className="h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <p className="text-sm text-slate-400 tracking-wider">
              SV-ARCHIV
            </p>
            <p className="text-xs text-slate-600">
              Protokoll-Archiv der Schülervertretung
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
              DATENBANK SYNCHRONISIERT
            </span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-800/50 text-center">
          <p className="text-[10px] text-slate-600 tracking-widest">
            © warian 2026
          </p>
        </div>
      </div>
      
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
    </footer>
  );
}
