"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import svLogo from "../../../public/SV-Logo.svg";

const archiveTabs = [
  { name: "Protokolle", path: "/archiv" },
  { name: "Dokumente", path: "/archiv/dokumente" },
  { name: "Themen Einreichen", path: "/archiv/themen-einreichen" },
];

export default function Header() {
  const pathname = usePathname();
  const isArchive = pathname.startsWith("/archiv");

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-3">
        <div className="glass-heavy container mx-auto px-6">
          <nav className="flex items-center justify-between py-3">
            {/* Logo + Archiv */}
            <Link href="/" className="group flex items-center gap-3">
              <Image
                src={svLogo}
                alt="SV Logo"
                width={80}
                height={80}
                className="h-20 w-20 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                priority
              />

              <span className="font-subtitle text-2xl tracking-[0.08em] text-stone-900">
                Archiv
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-stone-400 tracking-widest mr-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AKTIV
              </div>

              <Link
                href="/archiv"
                className="pencil-btn px-5 py-2.5 text-xs font-medium tracking-[0.15em] text-white uppercase bg-stone-900 hover:bg-stone-800 transition-all"
              >
                Archiv
              </Link>
            </div>
          </nav>

          {/* Archive tabs — smoothly expand from header */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: isArchive ? "60px" : "0px",
              opacity: isArchive ? 1 : 0,
            }}
          >
            <div className="flex border-t border-stone-200/40">
              {archiveTabs.map((tab) => {
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
        </div>
      </div>
    </header>
  );
}
