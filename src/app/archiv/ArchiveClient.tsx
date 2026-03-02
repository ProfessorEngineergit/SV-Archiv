"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { ProtocolMetadata } from "@/lib/protocols";

const PDF_PREVIEW_PARAMS = "#toolbar=0&navpanes=0&scrollbar=0&view=FitH";

interface ArchiveClientProps {
  protocols: ProtocolMetadata[];
  projects: string[];
  tags: string[];
}

export default function ArchiveClient({
  protocols,
}: ArchiveClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline");
  const [fullscreenProtocol, setFullscreenProtocol] = useState<ProtocolMetadata | null>(null);
  const [pdfLoadFailed, setPdfLoadFailed] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
  };

  // Sort protocols by date (oldest first for timeline)
  const sortedProtocols = useMemo(() => {
    return [...protocols].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [protocols]);

  const filteredProtocols = useMemo(() => {
    return sortedProtocols.filter((protocol) => {
      const matchesSearch =
        searchQuery === "" ||
        protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        protocol.date.includes(searchQuery);
      const protocolDate = new Date(protocol.date);
      const matchesDateFrom =
        dateFrom === "" || protocolDate >= new Date(dateFrom);
      const matchesDateTo =
        dateTo === "" || protocolDate <= new Date(dateTo);
      return matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }, [sortedProtocols, searchQuery, dateFrom, dateTo]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateLong = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const scrollToLatest = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTo({
        left: timelineRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToEarliest = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const openFullscreen = (protocol: ProtocolMetadata) => {
    setPdfLoadFailed(false);
    setFullscreenProtocol(protocol);
  };

  const closeFullscreen = () => {
    setFullscreenProtocol(null);
    setPdfLoadFailed(false);
  };

  // Close fullscreen on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
    };
    if (fullscreenProtocol) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenProtocol]);

  return (
    <>
      {/* Fullscreen Reading Mode */}
      {fullscreenProtocol && fullscreenProtocol.file && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex flex-col">
          {/* Top bar — frosted glass rounded */}
          <div className="flex items-center justify-between px-6 py-3 mx-4 mt-3 glass-heavy">
            <button
              onClick={closeFullscreen}
              className="inline-flex items-center gap-2 text-xs tracking-[0.15em] text-stone-400 uppercase hover:text-stone-900 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Zurück
            </button>
            <span className="hidden sm:block font-typewriter text-sm text-stone-900 truncate max-w-xs">
              {fullscreenProtocol.title}
            </span>
            <a
              href={fullscreenProtocol.file}
              download
              className="pencil-btn inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs tracking-[0.15em] uppercase hover:bg-stone-800 transition-all"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Herunterladen
            </a>
          </div>
          {/* PDF viewer with fallback for mobile/Safari */}
          <div className="flex-1 min-h-0 relative bg-stone-50 mx-4 mb-4 rounded-2xl overflow-hidden">
            {!pdfLoadFailed ? (
              <iframe
                src={fullscreenProtocol.file}
                className="absolute inset-0 w-full h-full"
                title={fullscreenProtocol.title}
                onError={() => setPdfLoadFailed(true)}
              />
            ) : null}
            {pdfLoadFailed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                <svg className="h-16 w-16 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-center">
                  <p className="text-stone-600 mb-2">PDF-Vorschau nicht verfügbar</p>
                  <p className="text-sm text-stone-400 mb-6">Dein Browser unterstützt keine PDF-Einbettung</p>
                  <a
                    href={fullscreenProtocol.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF herunterladen / öffnen
                  </a>
                </div>
              </div>
            )}
            {/* Mobile hint — shown on top of iframe */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-subtle text-xs text-stone-400 px-4 py-2 rounded-full pointer-events-none sm:hidden">
              Falls das PDF nicht lädt, bitte herunterladen ↑
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-stretch gap-5 mb-6">
            <div className="w-1.5 bg-stone-900 flex-shrink-0" />
            <div>
              <p className="text-[10px] tracking-[0.4em] text-stone-400 uppercase mb-2 font-subtitle">Protokolle</p>
              <h1 className="text-5xl font-extralight tracking-[0.15em] text-stone-900 uppercase text-embossed">
                Archiv
              </h1>
            </div>
          </div>
          {/* Pencil-sketch divider line */}
          <svg width="100%" height="4" viewBox="0 0 800 4" preserveAspectRatio="none" className="overflow-visible">
            <path d="M0,2 Q100,0 200,2 T400,2 T600,2 T800,2" stroke="#d6d3d1" strokeWidth="1" fill="none" className="pencil-line" strokeLinecap="round" />
          </svg>
        </div>

        {/* Filter Section — minimal brutalist */}
        <div className="mb-8 border-t-2 border-stone-900 pt-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs tracking-[0.3em] text-stone-500 uppercase">Filter</h2>
            <button
              onClick={clearAllFilters}
              className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-900 transition-colors border-b border-stone-300 hover:border-stone-900 pb-px"
            >
              Alle löschen
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* Search + View Toggle Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
              <div className="flex-1">
                <label htmlFor="search" className="mb-1.5 block text-[10px] text-stone-400 tracking-[0.25em] uppercase">
                  Suche
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Titel oder Datum durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-b-2 border-stone-200 bg-transparent px-0 py-2 text-stone-700 placeholder-stone-300 focus:border-stone-900 focus:outline-none transition-all"
                />
              </div>

              {/* View mode toggle — brutalist tabs */}
              <div className="flex border-b-2 border-stone-200 self-end">
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-5 py-2 text-[10px] tracking-[0.2em] uppercase transition-all ${
                    viewMode === "timeline"
                      ? "text-stone-900 border-b-2 border-stone-900 -mb-0.5"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-5 py-2 text-[10px] tracking-[0.2em] uppercase transition-all ${
                    viewMode === "table"
                      ? "text-stone-900 border-b-2 border-stone-900 -mb-0.5"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  Liste
                </button>
              </div>
            </div>

            {/* Date filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label htmlFor="dateFrom" className="mb-1.5 block text-[10px] text-stone-400 tracking-[0.25em] uppercase">
                  Von
                </label>
                <input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full max-w-full border-b-2 border-stone-200 bg-transparent px-0 py-2 text-stone-700 focus:border-stone-900 focus:outline-none transition-all"
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="dateTo" className="mb-1.5 block text-[10px] text-stone-400 tracking-[0.25em] uppercase">
                  Bis
                </label>
                <input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full max-w-full border-b-2 border-stone-200 bg-transparent px-0 py-2 text-stone-700 focus:border-stone-900 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[10px] tracking-[0.25em] text-stone-400 uppercase">
            {filteredProtocols.length} {filteredProtocols.length === 1 ? "Protokoll" : "Protokolle"}
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        {/* No results */}
        {filteredProtocols.length === 0 && (
          <div className="glass rounded-2xl px-8 py-16 text-center">
            <div className="mb-4 text-4xl text-stone-300">∅</div>
            <p className="text-stone-400 text-sm">
              Keine Protokolle für die aktuelle Filterauswahl gefunden
            </p>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === "timeline" && filteredProtocols.length > 0 && (
          <div className="relative">
            {/* Navigation buttons */}
            <div className="flex justify-between mb-4">
              <button
                onClick={scrollToEarliest}
                className="btn-glow flex items-center gap-2 px-3 py-1.5 text-xs text-stone-500 border border-stone-200 rounded-xl hover:text-stone-800 hover:border-stone-300 hover:bg-stone-50 transition-all"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                Ältestes
              </button>
              <button
                onClick={scrollToLatest}
                className="btn-glow flex items-center gap-2 px-3 py-1.5 text-xs text-stone-500 border border-stone-200 rounded-xl hover:text-stone-800 hover:border-stone-300 hover:bg-stone-50 transition-all"
              >
                Aktuelles
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Timeline container */}
            <div className="relative">
              <div
                ref={timelineRef}
                className="overflow-x-auto pb-6 timeline-scroll"
                style={{ scrollSnapType: "x mandatory" }}
              >
                <div className="inline-flex gap-5 relative px-10">
                  {/* Continuous timeline line */}
                  <div className="absolute left-0 right-0 h-px bg-stone-300 timeline-line-fade" style={{ top: "28px" }} />

                  {filteredProtocols.map((protocol) => (
                    <div
                      key={protocol.slug}
                      className="flex-shrink-0 flex flex-col items-center"
                      style={{ scrollSnapAlign: "center", width: "210px" }}
                    >
                      {/* Date above the line */}
                      <div className="text-center text-xs text-stone-400 mb-2">
                        {formatDate(protocol.date)}
                      </div>

                      {/* Timeline dot on the line */}
                      <div className="h-3 w-3 rounded-full bg-stone-500 border-2 border-white shadow-sm mb-3 relative z-10" />

                      {/* Protocol card - A4 proportioned with frosted glass depth */}
                      <div
                        className="w-full bg-white rounded-2xl overflow-hidden transition-all duration-400 cursor-pointer paper-card"
                        onClick={() => openFullscreen(protocol)}
                        style={{ aspectRatio: "210 / 297" }}
                      >
                        {/* PDF preview thumbnail */}
                        {protocol.file && (
                          <div className="relative h-full overflow-hidden bg-stone-50">
                            <iframe
                              src={`${protocol.file}${PDF_PREVIEW_PARAMS}`}
                              className="w-full h-full pointer-events-none"
                              title={`Vorschau: ${protocol.title}`}
                              tabIndex={-1}
                              style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%", maxWidth: "none" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-stone-200">
                              <h3 className="font-typewriter text-[11px] text-stone-900 line-clamp-2 leading-tight">
                                {protocol.title}
                              </h3>
                            </div>
                          </div>
                        )}
                        {!protocol.file && (
                          <div className="flex items-center justify-center h-full p-4">
                            <h3 className="font-typewriter text-xs text-stone-800 text-center line-clamp-3 leading-tight">
                              {protocol.title}
                            </h3>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "table" && filteredProtocols.length > 0 && (
          <div className="space-y-3">
            {[...filteredProtocols].reverse().map((protocol) => (
              <div
                key={protocol.slug}
                className="flex items-center gap-5 py-4 px-4 cursor-pointer group glass rounded-2xl transition-all hover:shadow-lg"
                onClick={() => openFullscreen(protocol)}
              >
                {/* PDF mini preview */}
                {protocol.file && (
                  <div className="hidden sm:block relative h-16 w-12 overflow-hidden bg-stone-50 rounded-lg border border-stone-200/50 flex-shrink-0">
                    <iframe
                      src={`${protocol.file}${PDF_PREVIEW_PARAMS}`}
                      className="w-full h-full pointer-events-none"
                      title={`Vorschau: ${protocol.title}`}
                      tabIndex={-1}
                      style={{ transform: "scale(0.3)", transformOrigin: "top left", width: "333%", height: "333%", maxWidth: "none" }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-typewriter text-base text-stone-900 truncate">
                    {protocol.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] tracking-wider text-stone-400 uppercase">
                    <span>{formatDateLong(protocol.date)}</span>
                    {protocol.project && (
                      <>
                        <span>—</span>
                        <span>{protocol.project}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {protocol.tags.map((tag) => (
                    <span key={tag} className="glass-subtle px-3 py-1 text-[10px] text-stone-500 tracking-wider rounded-full">
                      {tag}
                    </span>
                  ))}
                  <svg className="h-4 w-4 text-stone-300 group-hover:text-stone-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
