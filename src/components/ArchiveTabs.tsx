"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ArchiveTab {
  name: string;
  path: string;
}

const tabs: ArchiveTab[] = [
  { name: "Protokolle", path: "/archiv" },
  { name: "Dokumente", path: "/archiv/dokumente" },
  { name: "Themen Einreichen", path: "/archiv/themen-einreichen" },
];

export default function ArchiveTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-cyan-400/20 bg-slate-900/60 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || (tab.path !== "/archiv" && pathname.startsWith(tab.path));
            
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`px-6 py-4 text-sm font-medium tracking-wider transition-all relative ${
                  isActive
                    ? "text-cyan-300 bg-slate-800/50"
                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30"
                }`}
              >
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
