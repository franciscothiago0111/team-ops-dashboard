"use client";

import { EmployeesList } from "./_components/EmployeesList";
import { EmployeesFilter } from "./_components/EmployeesFilter";
import { RoleGuard } from "@/shared/components/RoleGuard";

export default function EmployeesPage() {

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">
            Estrutura e People Ops
          </h1>
          <p className="text-sm text-slate-500">
            Gere admissões, desligamentos e movimentações com módulos independentes.
          </p>
        </header>

        <EmployeesFilter />

        <EmployeesList />
      </div>
    </RoleGuard>
  );
}
