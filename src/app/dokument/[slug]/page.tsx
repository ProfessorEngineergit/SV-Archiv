import { notFound } from "next/navigation";
import Link from "next/link";
import { getProtocolBySlug, getAllProtocolSlugs } from "@/lib/protocols";
import PdfViewer from "./PdfViewer";

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
    return { title: "Dokument nicht gefunden | SV-Archiv" };
  }

  return {
    title: `${protocol.title} | SV-Archiv`,
    description: `${protocol.title} – Protokoll vom ${protocol.date}`,
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
      {/* Back navigation */}
      <Link
        href="/archiv"
        className="group mb-10 inline-flex items-center gap-2 text-xs tracking-[0.15em] text-stone-400 uppercase hover:text-stone-900 transition-colors"
      >
        <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Zurück zum Archiv
      </Link>

      {/* Document header — brutalist layout with thick left border */}
      <header className="mb-12">
        <div className="flex items-stretch gap-6">
          {/* Thick vertical rule — the "massive line" */}
          <div className="w-1.5 bg-stone-900 flex-shrink-0" />

          <div className="flex-1 py-2">
            {/* Date + classification line */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-[11px] tracking-[0.3em] text-stone-400 uppercase">
              <span>{formatDate(protocol.date)}</span>
              {protocol.project && (
                <>
                  <span className="text-stone-300">—</span>
                  <span>{protocol.project}</span>
                </>
              )}
              {protocol.tags.map((tag) => (
                <span key={tag} className="border border-stone-300 px-2 py-0.5 text-[10px]">{tag}</span>
              ))}
            </div>

            {/* Protocol title — bold monospace / typewriter */}
            <h1 className="font-typewriter text-3xl md:text-5xl text-stone-900 leading-tight">
              {protocol.title}
            </h1>
          </div>
        </div>

        {/* Horizontal rule under header */}
        <div className="mt-8 h-px bg-stone-200" />
      </header>

      {/* Document Content */}
      {protocol.file ? (
        <div>
          {/* Download button — brutalist style */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <span className="text-[10px] tracking-[0.3em] text-stone-400 uppercase">PDF-Dokument</span>
            <a
              href={protocol.file}
              download
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-stone-900 text-white text-xs tracking-[0.15em] uppercase hover:bg-stone-800 transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Herunterladen
            </a>
          </div>

          <PdfViewer file={protocol.file} title={protocol.title} />
        </div>
      ) : (
        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: protocol.htmlContent }}
        />
      )}

      {/* Footer navigation */}
      <div className="mt-16 pt-8 border-t border-stone-200">
        <Link
          href="/archiv"
          className="group inline-flex items-center gap-2 text-xs tracking-[0.15em] text-stone-400 uppercase hover:text-stone-900 transition-colors"
        >
          <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Zurück zum Archiv
        </Link>
      </div>
    </div>
  );
}
