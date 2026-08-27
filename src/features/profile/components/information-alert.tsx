import { Info } from "lucide-react";

export function InformationAlert({ isAdministrator }: { isAdministrator: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-xs leading-5 text-blue-800">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>
        {isAdministrator
          ? "Esta pantalla es únicamente de consulta. La información de usuarios y permisos se administra desde el módulo Administración de usuarios."
          : "Esta información es únicamente de consulta. Para solicitar una actualización de datos, comunícate con un administrador del sistema."}
      </p>
    </div>
  );
}
