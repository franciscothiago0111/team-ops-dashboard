"use client";

import { useState } from "react";
import { Button } from "@/core/ui/Button";
import { Plus, Trash2, UserX } from "lucide-react";
import { useEmployeeList } from "../../employees/_hooks/useEmployeeList";
import { LoadingState } from "@/shared/components/LoadingState";
import { Select } from "@/core/ui/Select";
import { useAppToast } from "@/core/hooks/useToast";
import { useTeamMembers, useAddTeamMember, useRemoveTeamMember } from "../_hooks/useTeamMembers";
import { User } from "@/shared/types";

interface TeamMembersProps {
  teamId: string;
}

export function TeamMembers({ teamId }: TeamMembersProps) {
  const toast = useAppToast();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: members, isLoading: isLoadingMembers } = useTeamMembers(teamId);
  const { data: employeesData } = useEmployeeList({ limit: 100 });
  const addMember = useAddTeamMember();
  const removeMember = useRemoveTeamMember();

  const employees = employeesData?.data ?? [];

  // Filter out employees already in the team
  const availableEmployees = employees.filter(
    (emp) => !members?.some((member: User) => member.id === emp.id)
  );

  const employeeOptions = [
    { value: "", label: "Escolha um colaborador..." },
    ...availableEmployees.map((emp) => ({
      value: emp.id,
      label: `${emp.name} (${emp.email})`,
    })),
  ];

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error("Selecione um colaborador");
      return;
    }

    try {
      await addMember.mutateAsync({ teamId, userId: selectedUserId });
      setSelectedUserId("");
      setIsAdding(false);
      toast.success("Membro adicionado com sucesso!");
    } catch {
      // Error already handled by hook
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (confirm(`Tem certeza que deseja remover ${userName} do time?`)) {
      try {
        await removeMember.mutateAsync({ teamId, userId });
        toast.success("Membro removido com sucesso!");
      } catch {
        // Error already handled by hook
      }
    }
  };

  if (isLoadingMembers) {
    return <LoadingState message="Carregando membros..." />;
  }

  return (
    <div className="space-y-4">
      {/* Add Member Section */}
      {!isAdding ? (
        <Button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      ) : (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Adicionar Novo Membro
          </h3>
          <Select
            label="Selecione um colaborador"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            options={employeeOptions}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setSelectedUserId("");
              }}
              className="flex-1"
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddMember}
              className="flex-1"
              isLoading={addMember.isPending}
              disabled={!selectedUserId}
            >
              Adicionar
            </Button>
          </div>
        </div>
      )}

      {/* Members List */}
      {!members || members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12">
          <UserX className="h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-900">
            Nenhum membro no time
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Adicione colaboradores ao time usando o botão acima
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member: User) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => handleRemoveMember(member.id, member.name)}
                variant="secondary"
                className="hover:bg-red-50 hover:text-red-600"
                disabled={removeMember.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
