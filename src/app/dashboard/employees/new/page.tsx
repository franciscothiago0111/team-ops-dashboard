"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/core/ui/Card";
import { EmployeeForm } from "../_components/EmployeeForm";
import { DashboardShell } from "../../_components/DashboardShell";
import { RoleGuard } from "@/shared/components/RoleGuard";

export default function EmployeesNewPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard/employees");
  };

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Novo Colaborador">
        <div className="space-y-6">


          <Card>
            <EmployeeForm onSuccess={handleSuccess} />
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
