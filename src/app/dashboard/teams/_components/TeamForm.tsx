"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Textarea } from "@/core/ui/Textarea";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useCreateTeam } from "../_hooks/useCreateTeam";
import { CreateTeamInput, CreateTeamSchema } from "../_schemas/team.schema";
import { useEmployeeList } from "../../employees/_hooks/useEmployeeList";
import { Select } from "@/core/ui/Select";

interface TeamFormProps {
  onSuccess?: () => void;
}

export function TeamForm({ onSuccess }: TeamFormProps) {
  const { execute, isLoading } = useCreateTeam();


  const { data: ManagersData, isLoading: isLoadingEmployees } = useEmployeeList({ limit: 100, role: "MANAGER" });


  console.log('ManagersData', ManagersData);


  const form = useForm<CreateTeamInput>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: {
      name: "",

    },
  });

  async function onSubmit(values: CreateTeamInput) {
    await execute(values);
    form.reset();
    onSuccess?.();
  }

  const { errors } = form.formState;

  const managerOptions = [
    ...(ManagersData?.data ?? []).map((manager) => ({
      value: manager.id,
      label: manager.name,
    })),
  ];

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <InputsGrid cols={1}>
        <Input
          label="Nome do Time"
          placeholder="Desenvolvimento Frontend"
          {...form.register("name")}
          error={errors.name?.message}
        />

        <Select
          label="Gerente do Time"
          disabled={isLoadingEmployees}
          options={managerOptions}
          {...form.register("managerId")}
          error={errors.managerId?.message}
        />


      </InputsGrid>





      <div className="flex gap-3">
        <CancelButton className="w-full" />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Criar time
        </Button>
      </div>
    </form>
  );
}
