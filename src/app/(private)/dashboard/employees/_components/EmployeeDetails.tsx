"use client";

import Link from "next/link";
import { Card } from "@/core/ui/Card";
import { useEmployeeDetails } from "../_hooks/useEmployeeDetails";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { BackButton } from "@/shared/components/BackButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { InfoField } from "@/shared/components/InfoField";
import { RoleGuard } from "@/shared/components/RoleGuard";

interface IEmployeeDetailsProps {
  id: string;
}

export function EmployeeDetails({ id }: EmployeeDetailsProps) {
  const { data: employee, isLoading, error } = useEmployeeDetails(id);

  if (isLoading) {
    return <LoadingState message="Carregando colaborador..." />;
  }

  if (error || !employee) {
    return <ErrorState message="Não foi possível carregar o colaborador." />;
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="space-y-6">
        <BackButton />

        <Card>
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">{employee.name}</h1>
            </div>
            <div>
              <Link
                href={`/dashboard/employees/${id}/edit`}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Editar
              </Link>
            </div>
          </div>

          <InputsGrid>
            <InfoField label="Email" value={employee.email} />
            <InfoField label="Role" value={employee.role} />
          </InputsGrid>
        </Card>
      </div>
    </RoleGuard>
  );
}
