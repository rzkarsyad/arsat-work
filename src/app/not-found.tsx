import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-4 py-24 sm:px-8">
      <p className="text-[13px] text-muted">404</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-ink">Nothing crafted here.</h1>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink transition-colors hover:border-line-strong"
      >
        <ArrowLeft size={14} />
        Back to the index
      </Link>
    </main>
  );
}
