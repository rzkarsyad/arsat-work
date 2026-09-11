import Link from "next/link";
import { site } from "@/lib/site";
import { Inquiry } from "./inquiry";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
      <div className="flex items-center gap-5">
        <Link href="/" className="rounded-sm text-[17px] font-semibold tracking-tight text-ink">
          {site.brand}
        </Link>
        <NavLinks />
      </div>
      <nav aria-label="Site" className="flex items-center gap-1">
        <Inquiry />
        <ThemeToggle />
      </nav>
    </header>
  );
}
