import { notFound } from "next/navigation";
import Link from "next/link";
import { getProtocolBySlug, getAllProtocolSlugs } from "@/lib/protocols";

// Generate static params for all protocols
export async function generateStaticParams() {
  const slugs = getAllProtocolSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for the page
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

  // Format date for display
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
      {/* Back link */}
      <Link
        href="/archiv"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-cyan-400"
      >
        <svg
          className="h-4 w-4"
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
        Zurück zum Archiv
      </Link>

      {/* Document header */}
      <header className="mb-12 border-b border-slate-800 pb-8">
        <h1 className="mb-6 text-4xl font-extralight tracking-wide text-cyan-50 md:text-5xl">
          {protocol.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-slate-500">Datum</span>
            <p className="text-slate-300">{formatDate(protocol.date)}</p>
          </div>

          {protocol.project && (
            <div>
              <span className="text-slate-500">Projekt</span>
              <p className="text-cyan-400">{protocol.project}</p>
            </div>
          )}

          <div>
            <span className="text-slate-500">Version</span>
            <p className="text-slate-300">{protocol.version}</p>
          </div>

          {protocol.tags.length > 0 && (
            <div>
              <span className="text-slate-500">Tags</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {protocol.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-slate-700 bg-slate-800/50 px-2 py-0.5 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Document content */}
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: protocol.htmlContent }}
      />

      {/* Bottom navigation */}
      <div className="mt-16 border-t border-slate-800 pt-8">
        <Link
          href="/archiv"
          className="inline-flex items-center gap-2 border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm text-slate-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
        >
          <svg
            className="h-4 w-4"
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
          Zurück zum Archiv
        </Link>
      </div>
    </div>
  );
}
