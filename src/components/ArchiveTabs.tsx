"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Protokolle", path: "/archiv" },
  { name: "Dokumente", path: "/archiv/dokumente" },
  { name: "Themen Einreichen", path: "/archiv/themen-einreichen" },
];

export default function ArchiveTabs() {
  const pathname = usePathname();

  return (
    <nav className="mx-4 mt-2">
      <div className="glass-heavy container mx-auto px-6">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.path ||
              (tab.path !== "/archiv" && pathname.startsWith(tab.path));

            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`px-6 py-4 text-[10px] tracking-[0.2em] uppercase transition-all relative ${
                  isActive
                    ? "text-stone-900 font-medium"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-stone-900 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
