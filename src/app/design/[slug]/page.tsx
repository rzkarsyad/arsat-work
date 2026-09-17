import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignHome } from "@/components/design-home";
import { designs, getDesign } from "@/designs/catalog";
import { openGraphBase } from "@/lib/metadata";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return designs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) return {};
  return {
    title: design.title,
    description: design.description,
    openGraph: {
      ...openGraphBase,
      type: "article",
      title: design.title,
      description: design.description,
      url: `/design/${slug}`,
      publishedTime: design.date,
      tags: design.tags,
    },
  };
}

/** A design's URL renders the Design index with that shot's popup already open. */
export default async function DesignShotPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!getDesign(slug)) notFound();
  return <DesignHome initialSlug={slug} />;
}
