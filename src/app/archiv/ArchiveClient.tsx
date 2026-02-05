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

  // Filter protocols based on search and filters
  const filteredProtocols = useMemo(() => {
    return protocols.filter((protocol) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        protocol.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Project filter
      const matchesProject =
        selectedProject === "" || protocol.project === selectedProject;

      // Tag filter
      const matchesTag =
        selectedTag === "" || protocol.tags.includes(selectedTag);

      return matchesSearch && matchesProject && matchesTag;
    });
  }, [protocols, searchQuery, selectedProject, selectedTag]);

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
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-extralight tracking-widest text-cyan-50">
          ARCHIV
        </h1>
        <p className="text-slate-400">
          Durchsuche alle öffentlichen Protokolle und Dokumente
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm text-slate-500"
          >
            Suche
          </label>
          <input
            id="search"
            type="text"
            placeholder="Titel durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-800 bg-slate-900/50 px-4 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none"
          />
        </div>

        {/* Project Filter */}
        <div>
          <label
            htmlFor="project"
            className="mb-2 block text-sm text-slate-500"
          >
            Projekt
          </label>
          <select
            id="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full border border-slate-800 bg-slate-900/50 px-4 py-2 text-slate-200 focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="">Alle Projekte</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label htmlFor="tag" className="mb-2 block text-sm text-slate-500">
            Tag
          </label>
          <select
            id="tag"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full border border-slate-800 bg-slate-900/50 px-4 py-2 text-slate-200 focus:border-cyan-500/50 focus:outline-none"
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

      {/* Results count */}
      <div className="mb-6 text-sm text-slate-500">
        {filteredProtocols.length}{" "}
        {filteredProtocols.length === 1 ? "Dokument" : "Dokumente"} gefunden
      </div>

      {/* Protocol List */}
      <div className="space-y-4">
        {filteredProtocols.length === 0 ? (
          <div className="border border-slate-800 bg-slate-900/30 px-6 py-12 text-center">
            <p className="text-slate-500">
              Keine Dokumente gefunden für die aktuellen Filter.
            </p>
          </div>
        ) : (
          filteredProtocols.map((protocol) => (
            <Link
              key={protocol.slug}
              href={`/dokument/${protocol.slug}`}
              className="group block border border-slate-800 bg-slate-900/30 p-6 transition-colors hover:border-cyan-500/30 hover:bg-slate-900/50"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-light text-cyan-50 group-hover:text-cyan-400">
                    {protocol.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{formatDate(protocol.date)}</span>
                    {protocol.project && (
                      <>
                        <span className="text-slate-700">•</span>
                        <span className="text-cyan-600">{protocol.project}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {protocol.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-slate-700 bg-slate-800/50 px-2 py-1 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
