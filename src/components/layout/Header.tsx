import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-light tracking-widest text-cyan-50 transition-colors hover:text-cyan-400"
          >
            SV-ARCHIV
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/archiv"
              className="text-sm font-light tracking-wide text-slate-400 transition-colors hover:text-cyan-400"
            >
              Archiv
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
