import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GOBMX_SOCIAL_LINKS } from "@/components/layout/gobmx/gobmx-layout.constants";
import type { GobMxSocialLink } from "@/components/layout/gobmx/gobmx-layout.types";

const SOCIAL_ICON_MAP: Record<GobMxSocialLink["icon"], IconDefinition> = {
  facebook: faFacebookF,
  instagram: faInstagram,
  x: faXTwitter,
  youtube: faYoutube,
};

export function GobMxSocialLinks() {
  return (
    <div className="mt-2.5 flex flex-wrap gap-3 md:gap-4">
      {GOBMX_SOCIAL_LINKS.map((socialLink) => (
        <a
          key={socialLink.label}
          href={socialLink.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={socialLink.label}
          className="focus-ring inline-flex h-[42px] w-[42px] items-center justify-center rounded-md border border-white/35 text-white no-underline transition-colors duration-200 hover:bg-white/10 sm:h-[46px] sm:w-[46px] md:h-12 md:w-12"
        >
          <FontAwesomeIcon
            aria-hidden="true"
            icon={SOCIAL_ICON_MAP[socialLink.icon]}
            className="text-xl"
          />
        </a>
      ))}
    </div>
  );
}
