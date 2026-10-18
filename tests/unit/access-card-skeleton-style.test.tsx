import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AccessCardSkeleton } from "@/features/access/components/access-card-skeleton";

describe("AccessCardSkeleton responsive styles", () => {
  it("conserva clases de radio y altura validas", () => {
    const { container } = render(<AccessCardSkeleton />);

    const card = container.firstElementChild;

    expect(card).toHaveClass("min-h-0");
    expect(card).toHaveClass("rounded-[var(--radius-lg)]");
    expect(card).toHaveClass("sm:min-h-[286px]");
    expect(card).not.toHaveClass("rounded-");
  });
});
