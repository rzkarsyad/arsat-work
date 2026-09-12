import Link from "next/link";
import { site } from "@/lib/site";
import { Contact } from "./contact";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
      <div className="flex items-center gap-2 sm:gap-5">
        {/* Four section links leave no room for the full brand on a phone; the suffix returns from sm up. */}
        <Link href="/" aria-label={site.brand} className="rounded-sm text-[17px] font-semibold tracking-tight text-ink">
          {site.brand.split(".")[0]}
          <span className="hidden sm:inline">.{site.brand.split(".").slice(1).join(".")}</span>
        </Link>
        <NavLinks />
      </div>
      <nav aria-label="Site" className="flex items-center gap-1">
        <Contact />
        <ThemeToggle />
      </nav>
    </header>
  );
}
