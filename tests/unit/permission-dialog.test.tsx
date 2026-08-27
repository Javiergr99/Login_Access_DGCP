import type { AppAction } from "@/features/auth/api/auth.contracts";
import { render, screen } from "@testing-library/react";
import { Headphones } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { PermissionDialog } from "@/features/access/components/permission-dialog";
import type { AccessItem } from "@/features/access/model/access.types";

const permissions = Array.from({ length: 24 }, (_, index) => `PERMISO_${index + 1}`);

const access: AccessItem = {
  id: "operations",
  target_app: "MESA_AYUDA",
  name: "Mesa de Ayuda",
  title: "Mesa de Ayuda",
  description: "Consulta y seguimiento de atenciones.",
  access_level: "full",
  permissions: permissions as AppAction[],
  order: 1,
  target_url: "http://127.0.0.1:5173/app/dashboard",
  modules: ["Dashboard", "Atenciones"],
  visiblePermissions: permissions.slice(0, 3).map((code) => ({
    code: code as AppAction,
    label: code,
  })),
  badgeLabel: "Acceso completo",
  buttonLabel: "Ingresar",
  tone: "blue",
  icon: Headphones,
};

describe("PermissionDialog", () => {
  it("muestra un conteo compacto y todos los permisos dentro del diálogo", () => {
    render(<PermissionDialog access={access} open onOpenChange={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("24 permisos")).toBeInTheDocument();
    expect(screen.getByLabelText(/permisos habilitados para mesa de ayuda/i)).toBeInTheDocument();
    expect(screen.getByText("Permiso 24")).toBeInTheDocument();
  });
});
