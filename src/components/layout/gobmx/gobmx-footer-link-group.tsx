import type { GobMxFooterLink } from "@/components/layout/gobmx/gobmx-layout.types";

type GobMxFooterLinkGroupProps = {
  links: readonly GobMxFooterLink[];
};

export function GobMxFooterLinkGroup({ links }: GobMxFooterLinkGroupProps) {
  return (
    <ul className="flex flex-col gap-1.5 pt-3.5 md:pt-[18px]">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring rounded-sm font-gobmx text-sm leading-[1.8] text-white/90 underline-offset-4 hover:underline md:text-[15px]"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
