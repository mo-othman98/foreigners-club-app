"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/map", label: "Map" },
  { href: "/explore", label: "Explore" },
  { href: "/passport", label: "My Passport" },
];

export default function Navigation() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header
      className={`z-50 border-b ${
        isLanding
          ? "absolute inset-x-0 top-0 border-white/10 bg-transparent"
          : "border-slate-200/80 bg-white/90 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className={`flex items-center gap-2.5 font-semibold tracking-tight ${
            isLanding ? "text-white" : "text-slate-900"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
              isLanding
                ? "bg-white/15 text-white"
                : "bg-teal-600 text-white"
            }`}
          >
            FC
          </span>
          <span>Foreigners Club</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/map" && pathname.startsWith("/country/")) ||
              (link.href === "/explore" && pathname.startsWith("/country/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? isLanding
                      ? "bg-white text-slate-900"
                      : "bg-teal-50 text-teal-700"
                    : isLanding
                      ? "text-white/90 hover:bg-white/10 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
