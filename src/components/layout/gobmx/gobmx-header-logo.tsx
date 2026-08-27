import { useState } from "react";

import { GOBMX_ASSETS } from "@/components/layout/gobmx/gobmx-layout.constants";

type GobMxHeaderLogoProps = {
  compact?: boolean;
};

/**
 * Muestra el logotipo institucional y conserva un fallback legible mientras
 * el recurso gráfico todavía no haya sido copiado al proyecto.
 */
export function GobMxHeaderLogo({ compact = false }: GobMxHeaderLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <span
        className={
          compact
            ? "text-base font-bold-token tracking-tight text-white"
            : "text-lg font-bold-token tracking-tight text-white md:text-xl"
        }
      >
        Gobierno de México
      </span>
    );
  }

  return (
    <img
      src={GOBMX_ASSETS.logo}
      alt="Gobierno de México"
      loading="eager"
      onError={() => setImageFailed(true)}
      className={
        compact
          ? "block h-[34px] w-auto object-contain"
          : "block h-11 w-auto object-contain sm:h-12 md:h-14"
      }
    />
  );
}
