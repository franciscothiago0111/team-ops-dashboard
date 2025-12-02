"use client";

import { Card } from "@/core/ui/Card";
import { Button } from "@/core/ui/Button";
import { useEmployeeDetails } from "../_hooks/useEmployeeDetails";
import { DashboardShell } from "../../_components/DashboardShell";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { BackButton } from "@/shared/components/BackButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { InfoField } from "@/shared/components/InfoField";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { useRouter } from "next/navigation";

interface EmployeeDetailsProps {
  id: string;
}

export function EmployeeDetails({ id }: EmployeeDetailsProps) {
  const router = useRouter();
  const { data: employee, isLoading, error } = useEmployeeDetails(id);

  if (isLoading) {
    return <LoadingState message="Carregando colaborador..." />;
  }

  if (error || !employee) {
    return <ErrorState message="Não foi possível carregar o colaborador." />;
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Detalhes do Colaborador">
        <div className="space-y-6">
          <BackButton onClick={() => router.push("/dashboard/employees")} />

          <Card>
            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">{employee.name}</h1>
              </div>
              <div>
                <Button onClick={() => router.push(`/dashboard/employees/${id}/edit`)}>
                  Editar
                </Button>
              </div>
            </div>

            <InputsGrid>
              <InfoField label="Email" value={employee.email} />
              <InfoField label="Role" value={employee.role} />
            </InputsGrid>
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
