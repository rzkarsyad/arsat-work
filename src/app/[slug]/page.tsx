import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CraftStage } from "@/components/craft-stage";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";
import { KeyboardNav } from "@/components/keyboard-nav";
import { entries, getEntry, getNeighbours } from "@/crafts/catalog";
import type { CraftEntry } from "@/crafts/types";
import { formatDate, pad } from "@/lib/format";
import { site } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const craft = getEntry(slug);
  if (!craft) return {};
  return {
    title: craft.title,
    description: craft.description,
    openGraph: {
      type: "article",
      title: craft.title,
      description: craft.description,
      url: `/${slug}`,
      publishedTime: craft.date,
      tags: craft.tags,
    },
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[10px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

function Neighbour({ craft, direction }: { craft: CraftEntry; direction: "older" | "newer" }) {
  const newer = direction === "newer";
  return (
    <Link
      href={`/${craft.slug}`}
      className={`group flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-line-strong ${
        newer ? "flex-row-reverse text-right sm:col-start-2" : ""
      }`}
    >
      <span className="text-muted transition-colors group-hover:text-ink">
        {newer ? <ArrowRight /> : <ArrowLeft />}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {newer ? "Newer" : "Older"} · {pad(craft.number)}
        </span>
        <span className="truncate text-[15px] font-medium text-ink">{craft.title}</span>
      </span>
    </Link>
  );
}

export default async function CraftPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const craft = getEntry(slug);
  if (!craft) notFound();

  const { older, newer } = getNeighbours(slug);
  const paragraphs =
    craft.notes
      ?.split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];
  const reference = craft.source ? new URL(craft.source).hostname.replace(/^www\./, "") : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
      <KeyboardNav older={older?.slug} newer={newer?.slug} />

      <div className="flex items-center justify-between py-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-ink">
          <ArrowLeft size={13} />
          Index
        </Link>
        <span>№ {pad(craft.number)}</span>
      </div>

      <CraftStage
        slug={slug}
        eager
        controls
        className="mt-3 aspect-[4/3] rounded-3xl border border-line sm:aspect-[16/9]"
      />

      <div className="mt-10 grid gap-10 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-16">
        <div>
          <h1 className="text-3xl font-medium tracking-[-0.02em] text-ink sm:text-4xl">{craft.title}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{craft.description}</p>
          {paragraphs.length ? (
            <div className="mt-8 flex max-w-prose flex-col gap-4 text-[15px] leading-relaxed text-ink/85">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          ) : null}
        </div>

        <dl className="flex flex-col gap-5 self-start font-mono text-[12px]">
          <Field label="Published">
            <time dateTime={craft.date}>{formatDate(craft.date)}</time>
          </Field>
          <Field label="Tags">
            <span className="flex flex-wrap gap-x-2">
              {craft.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </span>
          </Field>
          {craft.source && reference ? (
            <Field label="Reference">
              <a href={craft.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                {reference}
                <ArrowUpRight size={12} />
              </a>
            </Field>
          ) : null}
          <Field label="Code">
            {site.repo ? (
              <a
                href={`${site.repo}/tree/main/src/crafts/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-accent"
              >
                src/crafts/{slug}
                <ArrowUpRight size={12} />
              </a>
            ) : (
              <span className="text-muted">src/crafts/{slug}</span>
            )}
          </Field>
          <Field label="Keys">
            <span className="text-muted">← older · → newer · esc index</span>
          </Field>
        </dl>
      </div>

      {older || newer ? (
        <nav aria-label="Neighbouring crafts" className="mt-16 grid gap-3 sm:grid-cols-2">
          {older ? <Neighbour craft={older} direction="older" /> : null}
          {newer ? <Neighbour craft={newer} direction="newer" /> : null}
        </nav>
      ) : null}
    </main>
  );
}
