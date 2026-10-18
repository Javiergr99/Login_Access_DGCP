import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { MobileAccessNavigation } from "@/components/layout/mobile-access-navigation";
import { Logo } from "@/components/ui/logo";

describe("mobile access navigation", () => {
  it("mantiene un acceso reconocible a la navegación móvil", () => {
    render(
      <MemoryRouter>
        <Logo to="/accesos" compactOnMobile />
        <MobileAccessNavigation publicFormatUrl="" />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Ecosistema Integral DGCP" })).toHaveAttribute(
      "href",
      "/accesos",
    );

    expect(screen.getByRole("button", { name: "Abrir navegación" })).toBeInTheDocument();
  });
});
