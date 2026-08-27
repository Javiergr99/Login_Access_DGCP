import { Menu } from "lucide-react";

export function GobMxMobileMenuButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="Abrir menú"
      onClick={onOpen}
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-[7px] border border-white/25 text-white transition duration-200 hover:-translate-y-px hover:bg-white/10 md:hidden"
    >
      <Menu aria-hidden="true" className="h-6 w-6" />
    </button>
  );
}
