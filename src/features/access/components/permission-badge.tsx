import { Check, Shield } from "lucide-react";

import type { AccessTone } from "@/features/access/model/access.types";
import { cn } from "@/shared/lib/cn";

const toneClassNames: Record<AccessTone, string> = {
  blue: "access-tone-blue",
  violet: "access-tone-violet",
  emerald: "access-tone-emerald",
  amber: "access-tone-amber",
};

export function PermissionBadge({ label, tone }: { label: string; tone: AccessTone }) {
  const Icon = tone === "amber" ? Shield : Check;

  return (
    <span
      className={cn(
        toneClassNames[tone],
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "bg-[var(--accent-color-soft)] text-[11px] font-semibold-token",
        "leading-none text-[var(--accent-color)]",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.3} />
      {label}
    </span>
  );
}
