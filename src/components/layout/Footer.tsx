export default function Footer() {
  return (
    <footer className="mt-8">
      <div className="mx-4 mb-4">
        <div className="glass-heavy container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <p className="text-sm text-stone-700 tracking-wider font-medium">
                SV FWS FFM
              </p>
              <p className="text-xs text-stone-400 font-subtitle">
                Protokoll-Archiv der Schülervertretung
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DATENBANK SYNCHRONISIERT
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-stone-200/40 text-center">
            <p className="text-[10px] text-stone-400 tracking-widest">
              © SV-Waldorfschule Frankfurt a.M. 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
