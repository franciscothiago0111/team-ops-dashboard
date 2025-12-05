"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/core/ui/Card";
import { DashboardShell } from "../../_components/DashboardShell";
import { useEmployeeDetails } from "../_hooks/useEmployeeDetails";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { EmployeeUpdateForm } from "./EmployeeUpdateForm";

interface EmployeeEditProps {
  id: string;
}

export function EmployeeEdit({ id }: EmployeeEditProps) {
  const router = useRouter();
  const { data: employee, isLoading, error } = useEmployeeDetails(id);

  const handleSuccess = () => {
    router.push(`/dashboard/employees/${id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <DashboardShell title="Editar Colaborador">
        <LoadingState />
      </DashboardShell>
    );
  }

  if (error || !employee) {
    return (
      <DashboardShell title="Editar Colaborador">
        <ErrorState message="Não foi possível carregar os dados do colaborador" />
      </DashboardShell>
    );
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Editar Colaborador">
        <div className="space-y-6">
          <Card>
            <EmployeeUpdateForm
              employee={employee}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
