"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/core/ui/Card";
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
      <LoadingState />
    );
  }

  if (error || !employee) {
    return (
      <ErrorState message="Não foi possível carregar os dados do colaborador" />
    );
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="space-y-6">
        <Card>
          <EmployeeUpdateForm
            employee={employee}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Card>
      </div>
    </RoleGuard>
  );
}
