"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { ProtocolMetadata } from "@/lib/protocols";

const PDF_PREVIEW_PARAMS = "#toolbar=0&navpanes=0&scrollbar=0&view=FitH";
const PDF_A4_STYLE = {
  height: "calc(100vw * 1.414)" as const,
  maxHeight: "85vh" as const,
  minHeight: "500px" as const,
};

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
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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

  const toggleExpand = (slug: string) => {
    setExpandedSlug(expandedSlug === slug ? null : slug);
  };

  const basePath = typeof window !== "undefined" && window.location.pathname.startsWith("/SV-Archiv") ? "/SV-Archiv" : "";

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
          <span className="text-xs text-cyan-400/60 tracking-widest">PROTOKOLLE</span>
          <div className="h-px flex-1 bg-gradient-to-l from-cyan-400/40 to-transparent" />
        </div>

        <h1 className="mb-4 text-5xl font-light tracking-[0.15em] text-cyan-50 text-center">
          ARCHIV
        </h1>
        <p className="text-slate-400 text-center">
          Alle SV-Protokolle durchsuchen und einsehen
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-8 p-5 border border-cyan-400/20 bg-slate-900/40 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col gap-5">
          {/* Search + View Toggle Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="mb-2 block text-xs text-slate-500 tracking-wider"
              >
                SUCHE
              </label>
              <input
                id="search"
                type="text"
                placeholder="Titel oder Datum durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-md"
              />
            </div>

            {/* View mode toggle */}
            <div className="flex gap-1 p-1 bg-slate-800/60 rounded-lg border border-slate-700/40 self-end">
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 text-xs tracking-wider rounded-md transition-all ${
                  viewMode === "timeline"
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
                    : "text-slate-400 border border-transparent hover:text-slate-300"
                }`}
              >
                TIMELINE
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 text-xs tracking-wider rounded-md transition-all ${
                  viewMode === "table"
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
                    : "text-slate-400 border border-transparent hover:text-slate-300"
                }`}
              >
                TABELLE
              </button>
            </div>
          </div>

          {/* Date filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateFrom" className="mb-2 block text-xs text-slate-500 tracking-wider">
                VON
              </label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-2.5 text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-md"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="mb-2 block text-xs text-slate-500 tracking-wider">
                BIS
              </label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-2.5 text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {filteredProtocols.length}{" "}
          {filteredProtocols.length === 1 ? "Protokoll" : "Protokolle"} gefunden
        </span>
        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-slate-700/50 to-transparent" />
      </div>

      {/* No results */}
      {filteredProtocols.length === 0 && (
        <div className="border border-slate-700/50 bg-slate-900/30 px-8 py-16 text-center rounded-lg">
          <div className="mb-4 text-4xl text-slate-700">∅</div>
          <p className="text-slate-500 text-sm">
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
              className="btn-glow flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 border border-slate-700/40 rounded-md hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              Ältestes
            </button>
            <button
              onClick={scrollToLatest}
              className="btn-glow flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 border border-slate-700/40 rounded-md hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
            >
              Aktuelles
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Timeline container with fade */}
          <div className="relative">
            <div
              ref={timelineRef}
              className="flex gap-5 overflow-x-auto pb-6 timeline-scroll timeline-fade-both"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {filteredProtocols.map((protocol) => (
                <div
                  key={protocol.slug}
                  className="flex-shrink-0 w-72"
                  style={{ scrollSnapAlign: "center" }}
                >
                  {/* Timeline dot and line */}
                  <div className="flex items-center mb-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/30" />
                    <div className="h-3 w-3 rounded-full bg-cyan-400/60 border-2 border-slate-900 mx-2 shadow-[0_0_6px_rgba(103,232,249,0.4)]" />
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/30" />
                  </div>
                  <div className="text-center text-xs text-slate-500 mb-3">
                    {formatDate(protocol.date)}
                  </div>

                  {/* Protocol card */}
                  <div
                    className={`border rounded-lg transition-all duration-300 cursor-pointer ${
                      expandedSlug === protocol.slug
                        ? "border-cyan-400/50 bg-slate-900/60"
                        : "border-slate-700/40 bg-slate-900/30 hover:border-cyan-400/30 hover:bg-slate-900/50"
                    }`}
                    onClick={() => toggleExpand(protocol.slug)}
                  >
                    {/* PDF preview thumbnail */}
                    {protocol.file && (
                      <div className="relative h-40 overflow-hidden rounded-t-lg bg-slate-800/50 border-b border-slate-700/30">
                        <iframe
                          src={`${basePath}${protocol.file}${PDF_PREVIEW_PARAMS}`}
                          className="w-full h-full pointer-events-none"
                          title={`Vorschau: ${protocol.title}`}
                          tabIndex={-1}
                          style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-cyan-50 mb-1 line-clamp-2">
                        {protocol.title}
                      </h3>
                      {protocol.project && (
                        <span className="text-xs text-violet-400/70">
                          {protocol.project}
                        </span>
                      )}
                    </div>

                    {/* Expanded content */}
                    {expandedSlug === protocol.slug && protocol.file && (
                      <div className="border-t border-slate-700/30 p-4">
                        <div className="pdf-container mb-4">
                          <iframe
                            src={`${basePath}${protocol.file}`}
                            className="w-full rounded border border-slate-700/30"
                            style={{
                              height: "calc(100vw * 0.6)",
                              maxHeight: "600px",
                              minHeight: "400px",
                            }}
                            title={protocol.title}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          />
                        </div>
                        <a
                          href={`${basePath}${protocol.file}`}
                          download
                          className="btn-glow inline-flex items-center gap-2 px-4 py-2 text-xs text-cyan-400 border border-cyan-400/30 rounded-md hover:bg-cyan-400/10 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Herunterladen
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && filteredProtocols.length > 0 && (
        <div className="space-y-3">
          {[...filteredProtocols].reverse().map((protocol) => (
            <div
              key={protocol.slug}
              className={`border rounded-lg transition-all duration-300 cursor-pointer ${
                expandedSlug === protocol.slug
                  ? "border-cyan-400/50 bg-slate-900/60"
                  : "border-slate-700/40 bg-slate-900/30 hover:border-cyan-400/30 hover:bg-slate-900/50"
              }`}
              onClick={() => toggleExpand(protocol.slug)}
            >
              <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* PDF mini preview */}
                  {protocol.file && (
                    <div className="hidden sm:block relative h-16 w-12 overflow-hidden rounded bg-slate-800/50 border border-slate-700/30 flex-shrink-0">
                      <iframe
                        src={`${basePath}${protocol.file}${PDF_PREVIEW_PARAMS}`}
                        className="w-full h-full pointer-events-none"
                        title={`Vorschau: ${protocol.title}`}
                        tabIndex={-1}
                        style={{ transform: "scale(0.3)", transformOrigin: "top left", width: "333%", height: "333%" }}
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-base font-medium text-cyan-50 truncate">
                      {protocol.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                      <span className="text-slate-500">{formatDateLong(protocol.date)}</span>
                      {protocol.project && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-600" />
                          <span className="text-violet-400/80">{protocol.project}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {protocol.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-slate-600/50 bg-slate-800/40 px-2.5 py-1 text-xs text-slate-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  <svg
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                      expandedSlug === protocol.slug ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded content */}
              {expandedSlug === protocol.slug && protocol.file && (
                <div className="border-t border-slate-700/30 p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <span className="text-xs text-slate-500 tracking-wider">PDF-DOKUMENT</span>
                    <a
                      href={`${basePath}${protocol.file}`}
                      download
                      className="btn-glow inline-flex items-center gap-2 px-4 py-2 text-xs text-cyan-400 border border-cyan-400/30 rounded-md hover:bg-cyan-400/10 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Herunterladen
                    </a>
                  </div>
                  <div className="pdf-container">
                    <iframe
                      src={`${basePath}${protocol.file}`}
                      className="w-full rounded"
                      style={PDF_A4_STYLE}
                      title={protocol.title}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  </div>
                </div>
              )}

              {/* Bottom accent line */}
              <span className={`block h-px w-full bg-gradient-to-r from-cyan-400/40 to-violet-400/30 transition-opacity duration-300 ${
                expandedSlug === protocol.slug ? "opacity-100" : "opacity-0"
              }`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
