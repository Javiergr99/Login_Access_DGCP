import { Search } from "lucide-react";

import { env } from "@/shared/config/env";

type GobMxSearchButtonProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export function GobMxSearchButton({ compact = false, onNavigate }: GobMxSearchButtonProps) {
  return (
    <a
      href={env.publicSites.gobMxSearch}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Buscar en gob.mx"
      onClick={onNavigate}
      className={
        compact
          ? "focus-ring inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/25 text-white transition duration-200 hover:scale-[1.05] hover:bg-white/10"
          : "focus-ring inline-flex h-10 w-10 items-center justify-center rounded-[7px] border border-white/30 text-white transition duration-200 hover:-translate-y-px hover:bg-white/10"
      }
    >
      <Search aria-hidden="true" className="h-[18px] w-[18px]" />
    </a>
  );
}
