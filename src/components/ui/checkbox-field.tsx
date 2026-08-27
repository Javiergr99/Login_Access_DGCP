import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

export type CheckboxFieldProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

export function CheckboxField({ id, checked, onCheckedChange, label }: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-text-secondary)]"
    >
      <Checkbox.Root
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="focus-ring grid h-4 w-4 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]"
      >
        <Checkbox.Indicator>
          <Check className="h-3 w-3 text-[var(--color-primary-foreground)]" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span>{label}</span>
    </label>
  );
}
