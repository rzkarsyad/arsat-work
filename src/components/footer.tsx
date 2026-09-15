import { site } from "@/lib/site";
import { Contra, LinkedIn, XLogo } from "./icons";
import { SoundToggle } from "./sound-toggle";

const SOCIALS = [
  { label: "X", href: site.links.x, Icon: XLogo },
  { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedIn },
  { label: "Contra", href: site.links.contra, Icon: Contra },
];

export function Footer() {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-6xl items-center justify-between px-4 py-8 text-[12px] text-muted sm:px-8">
      <span>
        © {new Date().getUTCFullYear()} {site.author}
      </span>
      <div className="-mr-2 flex items-center gap-0.5">
        <SoundToggle />
        <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-line" />
        <nav aria-label="Social" className="flex items-center gap-0.5">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
          >
            <Icon size={15} />
          </a>
        ))}
        </nav>
      </div>
    </footer>
  );
}
