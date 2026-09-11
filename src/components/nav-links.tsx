"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Crafts", match: (path: string) => !path.startsWith("/design") && !path.startsWith("/about") },
  { href: "/design", label: "Design", match: (path: string) => path.startsWith("/design") },
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
            className={`rounded-full px-2.5 py-1.5 text-[13px] transition-colors sm:px-3 ${
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
