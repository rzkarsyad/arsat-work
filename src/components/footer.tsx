import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-6xl items-center justify-between px-4 py-8 text-[12px] text-muted sm:px-8">
      <span>
        © {new Date().getUTCFullYear()} {site.author}
      </span>
      <span className="flex gap-4">
        {site.repo ? (
          <a href={site.repo} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            Source
          </a>
        ) : null}
        <a href="/feed.xml" className="transition-colors hover:text-ink">
          RSS
        </a>
      </span>
    </footer>
  );
}
