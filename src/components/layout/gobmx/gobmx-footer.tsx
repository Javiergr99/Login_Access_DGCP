import { useState } from "react";

import { GobMxFooterLinkGroup } from "@/components/layout/gobmx/gobmx-footer-link-group";
import {
  GOBMX_ASSETS,
  GOBMX_INFORMATION_LINKS,
  GOBMX_LINKS,
} from "@/components/layout/gobmx/gobmx-layout.constants";
import { GobMxSocialLinks } from "@/components/layout/gobmx/gobmx-social-links";

function FooterSectionTitle({ children }: { children: string }) {
  return (
    <h2 className="min-h-0 font-gobmx text-[1.02rem] font-extrabold-token leading-[1.1] text-white lg:min-h-[34px] md:text-[1.1rem]">
      {children}
    </h2>
  );
}

/** Footer institucional reutilizado de Medidas de Protección 2.0. */
export function GobMxFooter() {
  const [logoFailed, setLogoFailed] = useState(false);
  const [textureFailed, setTextureFailed] = useState(false);

  return (
    <footer className="mt-auto bg-[var(--gobmx-footer-background)]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-11 md:px-10 md:py-14 lg:px-[72px]">
        <div className="grid items-start gap-8 text-white sm:grid-cols-2 sm:gap-9 md:gap-11 lg:grid-cols-[1.05fr_1fr_1fr_1fr] lg:gap-12">
          <div className="lg:pr-2">
            {logoFailed ? (
              <p className="font-gobmx text-2xl font-bold-token text-white">Gobierno de México</p>
            ) : (
              <img
                src={GOBMX_ASSETS.logo}
                alt="Gobierno de México"
                onError={() => setLogoFailed(true)}
                className="block h-[62px] w-auto object-contain sm:h-[70px] md:h-[88px]"
              />
            )}
          </div>

          <section aria-labelledby="gobmx-links-title">
            <div id="gobmx-links-title">
              <FooterSectionTitle>Enlaces</FooterSectionTitle>
            </div>
            <GobMxFooterLinkGroup links={GOBMX_LINKS} />
          </section>

          <section aria-labelledby="gobmx-about-title">
            <div id="gobmx-about-title">
              <FooterSectionTitle>¿Qué es gob.mx?</FooterSectionTitle>
            </div>

            <div className="pt-3.5 md:pt-[18px]">
              <p className="font-gobmx text-sm leading-[1.8] text-white/90 md:text-[15px]">
                Es el portal único de trámites, información y participación ciudadana.{" "}
                <a
                  href="https://www.gob.mx/que-es-gobmx"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring rounded-sm font-bold-token text-white underline underline-offset-4"
                >
                  Leer más
                </a>
              </p>

              <GobMxFooterLinkGroup links={GOBMX_INFORMATION_LINKS} />
            </div>
          </section>

          <section aria-labelledby="gobmx-contact-title">
            <div id="gobmx-contact-title">
              <FooterSectionTitle>Contacto</FooterSectionTitle>
            </div>

            <div className="pt-3.5 md:pt-[18px]">
              <p className="break-words font-gobmx text-sm leading-[1.8] text-white/90 md:text-[15px]">
                Dudas e información a:
                <br />
                <a
                  href="mailto:atencion_ciudadana@dif.gob.mx"
                  className="focus-ring rounded-sm font-bold-token text-white underline-offset-4 hover:underline"
                >
                  atencion_ciudadana@dif.gob.mx
                </a>
              </p>

              <div className="mt-5 md:mt-[18px]">
                <FooterSectionTitle>Síguenos en</FooterSectionTitle>
                <GobMxSocialLinks />
              </div>
            </div>
          </section>
        </div>
      </div>

      {!textureFailed ? (
        <img
          src={GOBMX_ASSETS.footerTexture}
          alt=""
          aria-hidden="true"
          onError={() => setTextureFailed(true)}
          className="block h-[42px] w-full object-cover sm:h-12 md:h-14"
        />
      ) : null}
    </footer>
  );
}
