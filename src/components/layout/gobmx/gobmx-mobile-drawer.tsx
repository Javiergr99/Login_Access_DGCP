import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { GobMxHeaderLogo } from "@/components/layout/gobmx/gobmx-header-logo";
import { GOBMX_NAVIGATION_ITEMS } from "@/components/layout/gobmx/gobmx-layout.constants";
import { GobMxMobileDrawerItem } from "@/components/layout/gobmx/gobmx-mobile-drawer-item";
import { GobMxSearchButton } from "@/components/layout/gobmx/gobmx-search-button";

type GobMxMobileDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GobMxMobileDrawer({ open, onOpenChange }: GobMxMobileDrawerProps) {
  const closeMenu = () => onOpenChange(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/30 data-[state=closed]:animate-[gobmx-overlay-out_180ms_ease-in] data-[state=open]:animate-[gobmx-overlay-in_220ms_ease-out] md:hidden" />

        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-0 z-[80] overflow-hidden border-b border-white/10 bg-[var(--gobmx-header-background)] text-white shadow-2xl outline-none data-[state=closed]:animate-[gobmx-drawer-out_220ms_ease-in] data-[state=open]:animate-[gobmx-drawer-in_300ms_ease-out] md:hidden"
        >
          <Dialog.Title className="sr-only">Menú institucional</Dialog.Title>

          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <GobMxHeaderLogo compact />

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Cerrar menú"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition duration-200 hover:rotate-90 hover:bg-white/10"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="border-t border-white/10">
            <ul>
              {GOBMX_NAVIGATION_ITEMS.map((item, index) => (
                <GobMxMobileDrawerItem
                  key={item.label}
                  item={item}
                  onNavigate={closeMenu}
                  showDivider={index < GOBMX_NAVIGATION_ITEMS.length - 1}
                />
              ))}
            </ul>

            <div className="flex h-[60px] items-center justify-center border-t border-white/10 transition-colors duration-200 hover:bg-white/[0.03]">
              <GobMxSearchButton compact onNavigate={closeMenu} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
