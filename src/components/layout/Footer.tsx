export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/10 bg-slate-950/80">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-light text-slate-500">
            © {new Date().getFullYear()} SV-Archiv
          </p>
          <p className="text-xs font-light text-slate-600">
            Ein öffentliches Archiv für Protokolle und Dokumentation
          </p>
        </div>
      </div>
    </footer>
  );
}
