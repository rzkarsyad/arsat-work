import Link from "next/link";
import { site } from "@/lib/site";
import { GitHub, Rss } from "./icons";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

const iconLink =
  "flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
      <div className="flex items-center gap-5">
        <Link href="/" className="rounded-sm text-[17px] font-semibold tracking-tight text-ink">
          {site.brand}
        </Link>
        <NavLinks />
      </div>
      <nav aria-label="Site" className="flex items-center gap-0.5">
        <a href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={iconLink}>
          <GitHub />
        </a>
        <a href="/feed.xml" aria-label="RSS feed" className={iconLink}>
          <Rss />
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
