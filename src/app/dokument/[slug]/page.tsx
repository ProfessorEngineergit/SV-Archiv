import { notFound } from "next/navigation";
import Link from "next/link";
import { getProtocolBySlug, getAllProtocolSlugs } from "@/lib/protocols";

export async function generateStaticParams() {
  const slugs = getAllProtocolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = await getProtocolBySlug(slug);

  if (!protocol) {
    return {
      title: "Dokument nicht gefunden | SV-Archiv",
    };
  }

  return {
    title: `${protocol.title} | SV-Archiv`,
    description: `${protocol.title} - ${protocol.project} Protokoll vom ${protocol.date}`,
  };
}

export default async function DokumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = await getProtocolBySlug(slug);

  if (!protocol) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Navigation */}
      <Link
        href="/archiv"
        className="group mb-10 inline-flex items-center gap-3 text-sm text-slate-500 transition-colors hover:text-cyan-400"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          />
        </svg>
        <span className="font-mono tracking-wider">ARCHIV-ÜBERSICHT</span>
      </Link>

      {/* Document Header */}
      <header className="mb-12 pb-8 border-b border-cyan-400/20">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
          <span className="text-xs font-mono text-cyan-400/60 tracking-widest">DOKUMENT</span>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent" />
        </div>
        
        <h1 className="mb-8 text-4xl font-extralight tracking-wide text-cyan-50 md:text-5xl leading-tight">
          {protocol.title}
        </h1>

        {/* Metadata Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 border border-slate-700/40 bg-slate-900/30">
            <span className="block text-xs font-mono text-slate-500 tracking-wider mb-2">DATUM</span>
            <p className="text-slate-300">{formatDate(protocol.date)}</p>
          </div>

          {protocol.project && (
            <div className="p-4 border border-slate-700/40 bg-slate-900/30">
              <span className="block text-xs font-mono text-slate-500 tracking-wider mb-2">PROJEKT</span>
              <p className="text-violet-400">{protocol.project}</p>
            </div>
          )}

          <div className="p-4 border border-slate-700/40 bg-slate-900/30">
            <span className="block text-xs font-mono text-slate-500 tracking-wider mb-2">VERSION</span>
            <p className="text-slate-300 font-mono">{protocol.version}</p>
          </div>

          {protocol.tags.length > 0 && (
            <div className="p-4 border border-slate-700/40 bg-slate-900/30">
              <span className="block text-xs font-mono text-slate-500 tracking-wider mb-2">KLASSIFIKATION</span>
              <div className="flex flex-wrap gap-2">
                {protocol.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-cyan-400/30 bg-cyan-400/5 px-2 py-0.5 text-xs font-mono text-cyan-400/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Document Content */}
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: protocol.htmlContent }}
      />

      {/* Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-slate-700/40">
        <Link
          href="/archiv"
          className="group inline-flex items-center gap-3 px-6 py-3 border border-slate-700/50 bg-slate-800/30 text-sm text-slate-400 transition-all hover:border-cyan-400/40 hover:text-cyan-400"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span className="font-mono tracking-wider">ZURÜCK ZUM ARCHIV</span>
        </Link>
      </div>
    </div>
  );
}
