"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProtocolMetadata } from "@/lib/protocols";

interface ArchiveClientProps {
  protocols: ProtocolMetadata[];
  projects: string[];
  tags: string[];
}

export default function ArchiveClient({
  protocols,
  projects,
  tags,
}: ArchiveClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const filteredProtocols = useMemo(() => {
    return protocols.filter((protocol) => {
      const matchesSearch =
        searchQuery === "" ||
        protocol.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject =
        selectedProject === "" || protocol.project === selectedProject;
      const matchesTag =
        selectedTag === "" || protocol.tags.includes(selectedTag);
      return matchesSearch && matchesProject && matchesTag;
    });
  }, [protocols, searchQuery, selectedProject, selectedTag]);

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
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
          <span className="text-xs font-mono text-cyan-400/60 tracking-widest">DATENBANK</span>
          <div className="h-px flex-1 bg-gradient-to-l from-cyan-400/40 to-transparent" />
        </div>
        
        <h1 className="mb-4 text-5xl font-extralight tracking-[0.2em] text-cyan-50 text-center">
          ARCHIV
        </h1>
        <p className="text-slate-400 text-center">
          Durchsuche alle gespeicherten Protokolle und Dokumente
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-10 p-6 border border-cyan-400/20 bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
          <span className="text-xs font-mono text-slate-400 tracking-wider">SUCHFILTER</span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-xs font-mono text-slate-500 tracking-wider"
            >
              BEZEICHNUNG
            </label>
            <input
              id="search"
              type="text"
              placeholder="Titel durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-slate-200 placeholder-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="project"
              className="mb-2 block text-xs font-mono text-slate-500 tracking-wider"
            >
              PROJEKT-SEKTOR
            </label>
            <select
              id="project"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all"
            >
              <option value="">Alle Projekte</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tag" className="mb-2 block text-xs font-mono text-slate-500 tracking-wider">
              KLASSIFIKATION
            </label>
            <select
              id="tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all"
            >
              <option value="">Alle Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-mono text-slate-500">
          {filteredProtocols.length} {filteredProtocols.length === 1 ? "EINTRAG" : "EINTRÄGE"} GEFUNDEN
        </span>
        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-slate-700/50 to-transparent" />
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {filteredProtocols.length === 0 ? (
          <div className="border border-slate-700/50 bg-slate-900/30 px-8 py-16 text-center">
            <div className="mb-4 text-4xl text-slate-700">∅</div>
            <p className="text-slate-500 font-mono text-sm">
              KEINE DOKUMENTE FÜR AKTUELLE FILTER GEFUNDEN
            </p>
          </div>
        ) : (
          filteredProtocols.map((protocol, idx) => (
            <Link
              key={protocol.slug}
              href={`/dokument/${protocol.slug}`}
              className="group relative block border border-slate-700/40 bg-slate-900/30 p-6 transition-all hover:border-cyan-400/40 hover:bg-slate-900/50"
            >
              {/* Index number */}
              <span className="absolute top-4 right-4 text-xs font-mono text-slate-700 group-hover:text-cyan-400/50 transition-colors">
                #{String(idx + 1).padStart(3, "0")}
              </span>
              
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-light text-cyan-50 group-hover:text-cyan-300 transition-colors">
                    {protocol.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="font-mono text-slate-500">{formatDate(protocol.date)}</span>
                    {protocol.project && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-slate-600" />
                        <span className="text-violet-400/80">{protocol.project}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {protocol.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-slate-600/50 bg-slate-800/40 px-3 py-1 text-xs font-mono text-slate-400 group-hover:border-cyan-400/30 group-hover:text-cyan-400/70 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Bottom accent line */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400/60 to-violet-400/40 group-hover:w-full transition-all duration-500" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
