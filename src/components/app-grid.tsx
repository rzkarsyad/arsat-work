import Image from "next/image";
import { apps } from "@/apps/catalog";
import { ArrowUpRight } from "./icons";

/** Product cards: a cover, then icon, name and tagline. Each card links to the product's site. */
export function AppGrid() {
  // Two columns at most: a lone card at a third of the width reads as an afterthought.
  return (
    <ul className="mt-8 grid max-w-5xl gap-x-8 gap-y-12 sm:mt-10 sm:grid-cols-2">
      {apps.map((app) => (
        <li key={app.slug}>
          <a href={app.url} target="_blank" rel="noreferrer" data-app={app.slug} className="group block rounded-sm">
            <div
              data-cover
              className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-stage ring-1 ring-line transition-[translate,box-shadow] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]"
            >
              <Image
                src={app.cover}
                alt={`${app.name} on ${app.platform}`}
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                placeholder="blur"
                className="object-cover"
              />
              {app.status ? (
                <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink ring-1 ring-line backdrop-blur">
                  {app.status}
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex items-start gap-3">
              <Image src={app.icon} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-[10px] ring-1 ring-black/5" />
              <div className="min-w-0 pt-0.5">
                <div className="flex items-center gap-2 text-[16px] font-medium leading-tight text-ink">
                  <span>{app.name}</span>
                  <span className="text-[12px] font-normal text-muted">{app.platform}</span>
                  <ArrowUpRight size={13} className="text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-[14px] leading-snug text-muted">{app.tagline}</p>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
