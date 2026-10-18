import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FileText, LayoutGrid, Menu, UserRound } from "lucide-react";
import { Link } from "react-router";

const itemClassName = [
  "focus-ring flex min-h-11 cursor-default items-center gap-3",
  "rounded-[var(--radius-sm)] px-3 py-2.5",
  "text-sm font-semibold-token text-[var(--color-text-primary)]",
  "outline-none data-[highlighted]:bg-[var(--color-surface-muted)]",
].join(" ");

type MobileAccessNavigationProps = {
  publicFormatUrl: string;
};

export function MobileAccessNavigation({ publicFormatUrl }: MobileAccessNavigationProps) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir navegación"
          className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] xl:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          sideOffset={8}
          collisionPadding={8}
          className="z-[80] w-64 max-w-[calc(100vw-1rem)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-modal)]"
          aria-label="Navegación de acceso"
        >
          <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold-token text-[var(--color-text-muted)]">
            Navegación
          </DropdownMenu.Label>

          <DropdownMenu.Item asChild>
            <Link to="/accesos" className={itemClassName}>
              <LayoutGrid className="h-4 w-4 shrink-0" />
              Accesos disponibles
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link to="/perfil" className={itemClassName}>
              <UserRound className="h-4 w-4 shrink-0" />
              Mi perfil
            </Link>
          </DropdownMenu.Item>

          {publicFormatUrl ? (
            <DropdownMenu.Item asChild>
              <a href={publicFormatUrl} className={itemClassName}>
                <FileText className="h-4 w-4 shrink-0" />
                Formato de Atenciones NNA
              </a>
            </DropdownMenu.Item>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
