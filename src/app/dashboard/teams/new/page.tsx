"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/core/ui/Card";
import { BackButton } from "@/shared/components/BackButton";
import { DashboardShell } from "../../_components/DashboardShell";
import { TeamForm } from "../_components/TeamForm";
import { RoleGuard } from "@/shared/components/RoleGuard";

export default function NewTeamPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push("/dashboard/teams");
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Novo Time">
        <div className="space-y-6">
          <BackButton />

          <Card>
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">
              Criar Novo Time
            </h1>

            <TeamForm onSuccess={handleSuccess} />
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
