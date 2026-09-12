"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = ["/design", "/apps", "/about"];

const LINKS = [
  { href: "/", label: "Crafts", match: (path: string) => !SECTIONS.some((s) => path.startsWith(s)) },
  { href: "/design", label: "Design", match: (path: string) => path.startsWith("/design") },
  { href: "/apps", label: "Apps", match: (path: string) => path.startsWith("/apps") },
  { href: "/about", label: "About", match: (path: string) => path.startsWith("/about") },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections" className="flex items-center gap-1">
      {LINKS.map(({ href, label, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-2 py-1.5 text-[12px] transition-colors sm:px-3 sm:text-[13px] ${
              active ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
