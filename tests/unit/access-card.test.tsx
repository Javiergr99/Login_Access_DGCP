import { render, screen } from "@testing-library/react";
import { Headphones } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { AccessCard } from "@/features/access/components/access-card";
import type { AccessItem } from "@/features/access/model/access.types";

const access: AccessItem = {
  id: "operations",
  target_app: "MESA_AYUDA",
  name: "Operación de Atenciones",
  title: "Operación de Atenciones",
  description: "Consulta y seguimiento de atenciones.",
  access_level: "full",
  permissions: ["VER_BITACORA"],
  order: 1,
  target_url: "http://127.0.0.1:5173/app/dashboard",
  modules: ["Dashboard", "Atenciones"],
  visiblePermissions: [{ code: "VER_BITACORA", label: "Consultar bitácora" }],
  badgeLabel: "Acceso completo",
  buttonLabel: "Ingresar",
  tone: "blue",
  icon: Headphones,
};

describe("AccessCard", () => {
  it("muestra el área, sus módulos y las acciones principales", () => {
    render(
      <AccessCard
        access={access}
        isEntering={false}
        onEnter={vi.fn()}
        onViewPermissions={vi.fn()}
      />,
    );

    expect(screen.getByText("Operación de Atenciones")).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ver permisos/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });
});
