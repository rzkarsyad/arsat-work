import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-[11px] uppercase tracking-wider text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <span>
        {site.name} · {new Date().getUTCFullYear()}
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
