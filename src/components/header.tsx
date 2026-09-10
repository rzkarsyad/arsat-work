import Link from "next/link";
import { site } from "@/lib/site";
import { GitHub, Rss } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const iconLink =
  "flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
      <Link href="/" className="flex items-baseline gap-1.5 rounded-sm">
        <span className="text-[17px] font-semibold tracking-tight text-ink">Craft</span>
        <span className="text-[13px] text-muted">by {site.author}</span>
      </Link>
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
