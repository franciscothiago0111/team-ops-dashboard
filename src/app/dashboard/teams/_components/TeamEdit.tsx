"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, UserX } from "lucide-react";

import { Card } from "@/core/ui/Card";
import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Select } from "@/core/ui/Select";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { DashboardShell } from "../../_components/DashboardShell";
import { useTeamDetails } from "../_hooks/useTeamDetails";
import { useEmployeeList } from "../../employees/_hooks/useEmployeeList";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { BackButton } from "@/shared/components/BackButton";
import { RoleGuard } from "@/shared/components/RoleGuard";
import { useUpdateTeam } from "../_hooks/useUpdateTeam";
import { UpdateTeamInput, UpdateTeamSchema } from "../_schemas/team.schema";
import { useAppToast } from "@/core/hooks/useToast";

interface TeamEditProps {
  id: string;
}

export function TeamEdit({ id }: TeamEditProps) {
  const router = useRouter();
  const toast = useAppToast();
  const { data: team, isLoading, error } = useTeamDetails(id);
  const { data: employeesData } = useEmployeeList({ limit: 100, role: "EMPLOYEE", withoutTeam: true });
  const { execute: updateTeam, isLoading: isUpdating } = useUpdateTeam();

  const availableEmployees = employeesData?.data || [];
  const currentMembers = team?.members || [];

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [membersToAdd, setMembersToAdd] = useState<string[]>([]);
  const [membersToRemove, setMembersToRemove] = useState<string[]>([]);

  const form = useForm<UpdateTeamInput>({
    resolver: zodResolver(UpdateTeamSchema),
    values: team ? {
      name: team.name || "",
    } : undefined,
  });

  const employeeOptions = [
    { value: "", label: "Escolha um colaborador..." },
    ...availableEmployees.map((emp) => ({
      value: emp.id,
      label: `${emp.name} (${emp.email})`,
    })),
  ];

  const handleAddToPending = () => {
    if (!selectedUserId) {
      toast.error("Selecione um colaborador");
      return;
    }
    setMembersToAdd([...membersToAdd, selectedUserId]);
    setSelectedUserId("");
  };

  const handleRemoveFromPending = (userId: string) => {
    setMembersToAdd(membersToAdd.filter((id) => id !== userId));
  };

  const handleMarkForRemoval = (userId: string) => {
    if (membersToRemove.includes(userId)) {
      setMembersToRemove(membersToRemove.filter((id) => id !== userId));
    } else {
      setMembersToRemove([...membersToRemove, userId]);
    }
  };

  async function onSubmit(values: UpdateTeamInput) {
    try {
      // Calculate final member IDs
      const currentMemberIds = currentMembers.map((m) => m.id);
      const finalMemberIds = [
        ...currentMemberIds.filter((id) => !membersToRemove.includes(id)),
        ...membersToAdd,
      ];

      // Update team info with member IDs
      await updateTeam({
        id,
        ...values,
        memberIds: finalMemberIds,
      });

      toast.success("Time atualizado com sucesso!");
      router.push(`/dashboard/teams/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar time");
      }
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/teams/${id}`);
  };

  if (isLoading) {
    return (
      <DashboardShell title="Editar Time">
        <LoadingState />
      </DashboardShell>
    );
  }

  if (error || !team) {
    return (
      <DashboardShell title="Editar Time">
        <ErrorState message="Não foi possível carregar os dados do time" />
      </DashboardShell>
    );
  }

  const { errors } = form.formState;

  // Get pending employees to display
  const pendingEmployees = availableEmployees.filter((emp) =>
    membersToAdd.includes(emp.id)
  );

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Editar Time">
        <div className="space-y-6">
          <BackButton />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                Informações do Time
              </h2>

              <div className="space-y-4">
                <InputsGrid cols={1}>
                  <Input
                    label="Nome do Time"
                    placeholder="Desenvolvimento Frontend"
                    {...form.register("name")}
                    error={errors.name?.message}
                  />
                </InputsGrid>


              </div>
            </Card>

            <Card className="mt-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                Membros do Time
              </h2>

              <div className="space-y-4">
                {/* Add Member Section */}
                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Adicionar Membros
                  </h3>
                  <div className="flex gap-2">
                    <Select
                      label=""
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      options={employeeOptions}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddToPending}
                      disabled={!selectedUserId}
                      className="self-end"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Pending to add */}
                  {pendingEmployees.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-green-700">
                        Serão adicionados ao salvar:
                      </p>
                      {pendingEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {emp.name}
                              </p>
                              <p className="text-xs text-slate-500">{emp.email}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleRemoveFromPending(emp.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Members List */}
                {currentMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12">
                    <UserX className="h-12 w-12 text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Nenhum membro no time
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Adicione colaboradores usando o campo acima
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Membros atuais:
                    </p>
                    {currentMembers.map((member) => {
                      const markedForRemoval = membersToRemove.includes(member.id);
                      return (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${markedForRemoval
                            ? "border-red-200 bg-red-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${markedForRemoval
                                ? "bg-red-100 text-red-600"
                                : "bg-indigo-100 text-indigo-600"
                                }`}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p
                                className={`text-sm font-semibold ${markedForRemoval
                                  ? "text-slate-500 line-through"
                                  : "text-slate-900"
                                  }`}
                              >
                                {member.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleMarkForRemoval(member.id)}
                            variant="secondary"
                            className={
                              markedForRemoval
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "hover:bg-red-50 hover:text-red-600"
                            }
                          >
                            {markedForRemoval ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Desfazer
                              </>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-6 flex gap-3">
              <CancelButton className="w-full" onClick={handleCancel} />
              <Button
                type="submit"
                className="w-full"
                isLoading={isUpdating}
              >
                Salvar alterações
              </Button>
            </div>
          </form>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
