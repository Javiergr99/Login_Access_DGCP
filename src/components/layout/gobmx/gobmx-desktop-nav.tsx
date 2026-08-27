import { GobMxSearchButton } from "@/components/layout/gobmx/gobmx-search-button";
import { GOBMX_NAVIGATION_ITEMS } from "@/components/layout/gobmx/gobmx-layout.constants";

export function GobMxDesktopNav() {
  return (
    <nav
      aria-label="Navegación institucional"
      className="hidden items-center gap-8 md:flex lg:gap-10"
    >
      {GOBMX_NAVIGATION_ITEMS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noreferrer noopener" : undefined}
          className="focus-ring rounded-sm font-gobmx text-[0.95rem] font-bold-token tracking-[0.02em] text-white transition-opacity duration-200 hover:opacity-90 lg:text-base"
        >
          {item.label}
        </a>
      ))}

      <GobMxSearchButton />
    </nav>
  );
}
