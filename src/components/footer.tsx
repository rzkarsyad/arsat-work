import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-6xl px-4 py-8 text-[12px] text-muted sm:px-8">
      © {new Date().getUTCFullYear()} {site.author}
    </footer>
  );
}
