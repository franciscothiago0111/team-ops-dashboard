"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Select } from "@/core/ui/Select";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useAuth } from "@/core/hooks/useAuth";
import { useUpdateEmployee } from "../_hooks/useUpdateEmployee";
import { UpdateEmployeeInput, UpdateEmployeeSchema } from "../_schemas/employee.schema";
import { useTeamList } from "../../teams/_hooks/useTeamList";
import { User } from "@/shared/types";

interface EmployeeUpdateFormProps {
  employee: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EmployeeUpdateForm({ employee, onSuccess, onCancel }: EmployeeUpdateFormProps) {
  const { execute, isLoading } = useUpdateEmployee(employee.id);
  const { user } = useAuth();

  const { data: teamsData, isLoading: isLoadingTeams } = useTeamList({ limit: 100 });
  const teams = teamsData?.data ?? [];

  const teamOptions = [
    ...teams.map((team) => ({
      value: team.id,
      label: team.name,
    })),
  ];

  const form = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      name: employee.name || "",
      email: employee.email || "",
      role: employee.role || "EMPLOYEE",
    },
  });

  // Determine available roles based on logged user's role
  const getRoleOptions = () => {
    if (user?.role === "ADMIN") {
      return [
        { value: "EMPLOYEE", label: "Colaborador" },
        { value: "MANAGER", label: "Gerente" },
      ];
    }
    // MANAGER can only create EMPLOYEE
    return [{ value: "EMPLOYEE", label: "Colaborador" }];
  };

  async function onSubmit(values: UpdateEmployeeInput) {
    await execute(values);
    onSuccess?.();
  }

  const { errors } = form.formState;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <InputsGrid>
        <Input
          label="Nome"
          placeholder="Maria Silva"
          {...form.register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="maria@empresa.com"
          {...form.register("email")}
          error={errors.email?.message}
        />
      </InputsGrid>

      <InputsGrid>

        <Select
          label="Função"
          {...form.register("role")}
          error={errors.role?.message}
          options={getRoleOptions()}
        />

      </InputsGrid>

      <div className="flex gap-3">
        <CancelButton className="w-full" onClick={onCancel} />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Atualizar colaborador
        </Button>
      </div>
    </form>
  );
}
