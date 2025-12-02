"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/core/ui/Card";
import { BackButton } from "@/shared/components/BackButton";
import { DashboardShell } from "../../_components/DashboardShell";
import { TaskForm } from "../_components/TaskForm";
import { useAuth } from "@/core/hooks/useAuth";
import { ErrorState } from "@/shared/components/ErrorState";

export default function NewTaskPage() {
  const router = useRouter();
  const { user } = useAuth();

  function handleSuccess() {
    router.push("/dashboard/tasks");
  }

  // Only MANAGER and ADMIN can create tasks
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return (
      <DashboardShell title="Nova Tarefa">
        <div className="space-y-6">
          <BackButton />
          <ErrorState message="Você não tem permissão para criar tarefas. Apenas gerentes e administradores podem criar tarefas." />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Nova Tarefa">
      <div className="space-y-6">
        <BackButton />

        <Card>
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">
            Criar Nova Tarefa
          </h1>

          <TaskForm onSuccess={handleSuccess} />
        </Card>
      </div>
    </DashboardShell>
  );
}
