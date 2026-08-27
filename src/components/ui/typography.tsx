import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type TypographyVariant =
  | "pageTitle"
  | "sectionTitle"
  | "cardTitle"
  | "authTitle"
  | "body"
  | "bodySm"
  | "bodyMuted"
  | "label"
  | "caption";

type TypographyProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const variants: Record<TypographyVariant, string> = {
  pageTitle: "text-page-title",
  sectionTitle: "text-section-title",
  cardTitle: "text-card-title",
  authTitle: "text-auth-title",
  body: "text-body",
  bodySm: "text-body-sm",
  bodyMuted: "text-body-muted",
  label: "text-label",
  caption: "text-caption",
};

/** Tipografía semántica centralizada para títulos, cuerpo, etiquetas y ayudas. */
export function Typography<T extends ElementType = "p">({
  as,
  children,
  variant = "body",
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? "p";

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
