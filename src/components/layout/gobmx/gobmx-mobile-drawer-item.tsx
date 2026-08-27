import type { GobMxNavigationItem } from "@/components/layout/gobmx/gobmx-layout.types";

type GobMxMobileDrawerItemProps = {
  item: GobMxNavigationItem;
  onNavigate: () => void;
  showDivider: boolean;
};

export function GobMxMobileDrawerItem({
  item,
  onNavigate,
  showDivider,
}: GobMxMobileDrawerItemProps) {
  return (
    <li className={showDivider ? "border-b border-white/10" : undefined}>
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noreferrer noopener" : undefined}
        onClick={onNavigate}
        className="focus-ring flex h-[45px] w-full items-center justify-center px-5 text-center font-gobmx text-[15px] font-semibold-token tracking-[0.25px] text-white transition duration-200 hover:-translate-y-px hover:bg-white/[0.03] hover:tracking-[0.35px] active:translate-y-0 active:bg-white/[0.05]"
      >
        {item.label}
      </a>
    </li>
  );
}
