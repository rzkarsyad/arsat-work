import { site } from "@/lib/site";

const ELSEWHERE = [
  { label: "X", href: site.links.x },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Contra", href: site.links.contra },
];

/** Label + value rows under the intro; "Elsewhere" is rendered separately so its links stay links. */
const FACTS = [
  { label: "Now", value: `${site.role}, open to async collaboration across time zones` },
  { label: "Based in", value: `${site.location}, ${site.timezone}` },
];

const ROW = "grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 sm:grid-cols-[8rem_1fr]";

export function About() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8">
      <h1 className="pt-5 text-[26px] font-medium leading-[1.1] tracking-tight text-ink sm:pt-10 sm:text-[40px]">
        Hi, I’m Rizki.
      </h1>
      <div className="mt-6 max-w-[38rem] space-y-5 text-[17px] leading-[1.6] text-ink sm:mt-8 sm:text-[19px]">
        <p>
          I’m a product designer based in {site.location}, working on web, mobile and SaaS products. Over
          the past five years I’ve shipped dashboards, mobile apps and landing pages for fintech, field
          service and project management companies, turning complex workflows into clean, scalable
          interfaces with handoffs developers actually like.
        </p>
        <p>
          The crafts on this site are rendered live in the browser. The design section is a shelf of
          shots from client and concept work.
        </p>
      </div>
      <dl className="mt-10 max-w-[38rem] divide-y divide-line border-y border-line text-[15px] leading-[1.5] sm:mt-14">
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
    </main>
  );
}
