"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Select } from "@/core/ui/Select";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useAuth } from "@/core/hooks/useAuth";
import { useCreateEmployee } from "../_hooks/useCreateEmployee";
import { CreateEmployeeInput, CreateEmployeeSchema } from "../_schemas/employee.schema";
import { useTeamList } from "../../teams/_hooks/useTeamList";

interface EmployeeFormProps {
  onSuccess?: () => void;
}

export function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const { execute, isLoading } = useCreateEmployee();


  const { data: teamsData, isLoading: isLoadingTeams } = useTeamList({ limit: 100 });
  const teams = teamsData?.data ?? [];

  const teamOptions = [
    ...teams.map((team) => ({
      value: team.id,
      label: team.name,
    })),
  ];




  const { user } = useAuth();

  const form = useForm<CreateEmployeeInput>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
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

  async function onSubmit(values: CreateEmployeeInput) {
    const payload = {
      ...values,
    };
    await execute(payload);
    form.reset();
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
        <Input
          label="Senha"
          type="password"
          placeholder="******"
          {...form.register("password")}
          error={errors.password?.message}
        />
        <Select
          label="Função"
          {...form.register("role")}
          error={errors.role?.message}
          options={getRoleOptions()}
        />
        <Select
          label="Time"
          {...form.register("teamId")}
          error={errors.teamId?.message}
          options={teamOptions}
          disabled={isLoadingTeams}
        />
      </InputsGrid>

      <div className="flex gap-3">
        <CancelButton className="w-full" />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Salvar colaborador
        </Button>
      </div>
    </form>
  );
}
