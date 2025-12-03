"use client";

import { Card } from "@/core/ui/Card";
import { Button } from "@/core/ui/Button";
import { Badge } from "@/core/ui/Badge";
import { useTeamDetails } from "../_hooks/useTeamDetails";
import { DashboardShell } from "../../_components/DashboardShell";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { BackButton } from "@/shared/components/BackButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { InfoField } from "@/shared/components/InfoField";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { useRouter } from "next/navigation";
import { Users, ClipboardList, UserX, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Task } from "@/shared/types/task";
import { User } from "@/shared/types";
import { useAuth } from "@/core/hooks/useAuth";

interface TeamDetailsProps {
  id: string;
}

export function TeamDetails({ id }: TeamDetailsProps) {
  const router = useRouter();
  const { data: team, isLoading, error } = useTeamDetails(id);
  const { user } = useAuth();

  const canEditTeam = user?.role === "ADMIN";



  const members = team?.members ?? [];
  const tasks = team?.tasks ?? [];

  const getTaskStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTaskStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return "Concluída";
      case "IN_PROGRESS":
        return "Em Progresso";
      default:
        return "Pendente";
    }
  };

  const getTaskStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando time..." />;
  }

  if (error || !team) {
    return <ErrorState message="Não foi possível carregar o time." />;
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Detalhes do Time">
        <div className="space-y-6">
          <BackButton />

          <Card>
            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">{team.name}</h1>
              </div>
              <div>
                {canEditTeam && (
                  <Button onClick={() => router.push(`/dashboard/teams/${id}/edit`)}>
                    Editar
                  </Button>
                )}
              </div>
            </div>

            {team.description && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Descrição</h3>
                <p className="text-slate-900">{team.description}</p>
              </div>
            )}

            <InputsGrid className="mt-6">
              <InfoField label="Gerente" value={team?.manager?.name} />
              {team.createdAt && (
                <InfoField
                  label="Criado em"
                  value={new Date(team.createdAt).toLocaleString("pt-BR")}
                />
              )}
              {team.updatedAt && (
                <InfoField
                  label="Atualizado em"
                  value={new Date(team.updatedAt).toLocaleString("pt-BR")}
                />
              )}
            </InputsGrid>
          </Card>

          {/* Members Section */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-slate-900">
                  Membros do Time
                </h2>
              </div>
              <Badge variant="default">
                {members.length} {members.length === 1 ? "membro" : "membros"}
              </Badge>
            </div>

            {!members || members.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12">
                <UserX className="h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  Nenhum membro no time
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Adicione membros editando o time
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member: User) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/dashboard/employees/${member.id}`)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Tasks Section */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-slate-900">
                  Tarefas do Time
                </h2>
              </div>
              <Badge variant="default">
                {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
              </Badge>
            </div>

            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12">
                <ClipboardList className="h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  Nenhuma tarefa encontrada
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Crie tarefas para este time
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task: Task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getTaskStatusIcon(task.status)}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {task.name}
                        </h3>
                        {task.description && (
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTaskStatusColor(
                          task.status
                        )}`}
                      >
                        {getTaskStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
