import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Home } from "@/components/home";
import { entries, getEntry } from "@/crafts/catalog";
import { openGraphBase } from "@/lib/metadata";

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
      ...openGraphBase,
      type: "article",
      title: craft.title,
      description: craft.description,
      url: `/${slug}`,
      publishedTime: craft.date,
      tags: craft.tags,
    },
  };
}

/** A craft's URL renders the index with that craft's popup already open. */
export default async function CraftPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!getEntry(slug)) notFound();
  return <Home initialSlug={slug} />;
}
