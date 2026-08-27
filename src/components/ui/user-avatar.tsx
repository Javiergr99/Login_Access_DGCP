import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/cn";

const DEFAULT_AVATAR_PATH = "/assets/icons/perfil.webp";

type UserAvatarProps = {
  name: string;
  src?: string;
  className?: string;
  imageClassName?: string;
};

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words.at(0)?.charAt(0) ?? "U";
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/** Avatar reutilizable con imagen institucional y fallback mediante tokens. */
export function UserAvatar({
  name,
  src = DEFAULT_AVATAR_PATH,
  className,
  imageClassName,
}: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full",
        "bg-[linear-gradient(135deg,var(--avatar-fallback-start),var(--avatar-fallback-end))]",
        "font-bold-token text-[var(--avatar-fallback-foreground)]",
        "ring-2 ring-[var(--avatar-ring)] shadow-[var(--shadow-xs)]",
        className,
      )}
      aria-hidden="true"
    >
      {hasImageError ? (
        <span>{initials}</span>
      ) : (
        <img
          src={src}
          alt=""
          className={cn("h-full w-full object-cover", imageClassName)}
          onError={() => setHasImageError(true)}
        />
      )}
    </span>
  );
}
