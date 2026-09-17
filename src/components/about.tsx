import type { ReactNode } from "react";
import { photos } from "@/about/photos";
import { site } from "@/lib/site";
import { PhotoPile } from "./photo-pile";

const ELSEWHERE = [
  { label: "X", href: site.links.x },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Contra", href: site.links.contra },
];

/** Label + value rows under the intro; "Elsewhere" is rendered separately so its links stay links. */
const FACTS: { label: string; value: ReactNode }[] = [
  {
    label: "Now",
    // Breaks after "open to" on purpose, and "time zones" never splits.
    value: (
      <>
        {site.role}, open to
        <br />
        async collaboration across time&nbsp;zones
      </>
    ),
  },
  { label: "Based in", value: `${site.location}, ${site.timezone}` },
];

const ROW = "grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 sm:grid-cols-[8rem_1fr]";

export function About() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8">
      <h1 className="pt-5 text-[26px] font-medium leading-[1.1] tracking-tight text-ink sm:pt-10 sm:text-[40px]">
        Hi, I’m Rizki.
      </h1>
      <div className="mt-6 sm:mt-8 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] lg:gap-x-16">
        <div className="max-w-[38rem] space-y-5 text-[17px] leading-[1.6] text-ink sm:text-[19px] lg:col-start-1 lg:row-start-1">
          <p>
            I’m a senior product designer based in {site.location}, working
            on web, mobile and SaaS products. Over the past five years I’ve shipped
            dashboards, mobile apps and landing pages for fintech, field service
            and project management companies, turning complex workflows into
            clean, scalable interfaces with handoffs developers actually like.
          </p>
          <p>
            The crafts on this site are rendered live in the browser. The design
            section is a shelf of shots from client and concept work.
          </p>
        </div>
        {/* Between the intro and the facts on a phone; a column of its own beside both from lg up. */}
        <PhotoPile
          photos={photos}
          className="mx-auto mt-10 w-full max-w-[20rem] sm:max-w-[22rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:ml-auto lg:mt-0 lg:max-w-[24rem]"
        />
        <dl className="mt-10 max-w-[38rem] divide-y divide-line border-y border-line text-[15px] leading-[1.5] sm:mt-14 lg:col-start-1 lg:row-start-2">
          {FACTS.map(({ label, value }) => (
            <div key={label} className={ROW}>
              <dt className="text-muted">{label}</dt>
              <dd className="text-ink">{value}</dd>
            </div>
          ))}
          <div className={ROW}>
            <dt className="text-muted">Elsewhere</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1 text-ink">
              {ELSEWHERE.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
                >
                  {label}
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
