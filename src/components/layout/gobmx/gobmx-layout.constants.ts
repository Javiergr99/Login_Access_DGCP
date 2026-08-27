import type {
  GobMxFooterLink,
  GobMxNavigationItem,
  GobMxSocialLink,
} from "@/components/layout/gobmx/gobmx-layout.types";
import { env } from "@/shared/config/env";

export const GOBMX_ASSETS = {
  logo: "/assets/images/gobmx-logo.png",
  footerTexture: "/assets/images/footer-textura.png",
} as const;

export const GOBMX_NAVIGATION_ITEMS: readonly GobMxNavigationItem[] = [
  {
    label: "Trámites",
    href: "https://www.gob.mx/tramites",
    external: true,
  },
  {
    label: "Gobierno",
    href: "https://www.gob.mx/gobierno",
    external: true,
  },
  {
    label: "Por Tus Derechos",
    href: env.publicSites.porTusDerechos,
    external: env.publicSites.porTusDerechos.startsWith("http"),
  },
] as const;

export const GOBMX_LINKS: readonly GobMxFooterLink[] = [
  { label: "Datos", href: "https://www.gob.mx/datos" },
  { label: "Transparencia", href: "https://www.gob.mx/transparencia" },
  {
    label: "PNT",
    href: "https://consultapublicamx.inai.org.mx/vut-web/",
  },
  { label: "INAI", href: "https://home.inai.org.mx/" },
  { label: "Alerta", href: "https://www.gob.mx/alertadores" },
  { label: "Denuncia", href: "https://sidec.funcionpublica.gob.mx/" },
] as const;

export const GOBMX_INFORMATION_LINKS: readonly GobMxFooterLink[] = [
  {
    label: "Declaración de Accesibilidad",
    href: "https://www.gob.mx/accesibilidad",
  },
  { label: "Términos y Condiciones", href: "https://www.gob.mx/terminos" },
] as const;

export const GOBMX_SOCIAL_LINKS: readonly GobMxSocialLink[] = [
  {
    label: "Facebook SNDIF",
    href: "https://www.facebook.com/SNDIF/",
    icon: "facebook",
  },
  {
    label: "X DIF Nacional",
    href: "https://x.com/DIF_NMX?lang=es",
    icon: "x",
  },
  {
    label: "Instagram DIF Nacional",
    href: "https://www.instagram.com/dif_nacional/",
    icon: "instagram",
  },
  {
    label: "YouTube DIF Nacional",
    href: "https://www.youtube.com/channel/UCwnX3jD0_IaObRXWoZGFUWA",
    icon: "youtube",
  },
] as const;
