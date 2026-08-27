export type GobMxNavigationItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type GobMxFooterLink = {
  label: string;
  href: string;
};

export type GobMxSocialLink = {
  label: string;
  href: string;
  icon: "facebook" | "x" | "instagram" | "youtube";
};
