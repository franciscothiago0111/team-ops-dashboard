"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Flag } from "lucide-react";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Select } from "@/core/ui/Select";
import { Textarea } from "@/core/ui/Textarea";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useCreateTask } from "../_hooks/useCreateTask";
import { CreateTaskInput, CreateTaskSchema } from "../_schemas/task.schema";

import { useTeamList } from "../../teams/_hooks/useTeamList";
import { useEmployeeList } from "../../employees/_hooks/useEmployeeList";

interface TaskFormProps {
  onSuccess?: () => void;
}

const priorityOptions = [
  { value: "LOW", label: "🟢 Baixa" },
  { value: "MEDIUM", label: "🟡 Média" },
  { value: "HIGH", label: "🟠 Alta" },
  { value: "URGENT", label: "🔴 Urgente" },
];

export function TaskForm({ onSuccess }: TaskFormProps) {
  const { execute, isLoading } = useCreateTask();

  const { data: teamsData, isLoading: isLoadingTeams } = useTeamList({ limit: 100 });
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployeeList({ limit: 100 });

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      assignedToId: "",
      teamId: "",
      priority: "MEDIUM",
      dueDate: "",
      labels: [],
    },
  });

  async function onSubmit(values: CreateTaskInput) {
    const payload = {
      ...values,
      assignedToId: values.assignedToId || undefined,
      dueDate: values.dueDate || undefined,
    };
    await execute(payload);
    form.reset();
    onSuccess?.();
  }

  const { errors } = form.formState;

  const teams = teamsData?.data ?? [];
  const employees = employeesData?.data ?? [];

  const teamOptions = [
    ...teams.map((team) => ({
      value: team.id,
      label: team.name,
    })),
  ];

  const employeeOptions = [
    ...employees.map((employee) => ({
      value: employee.id,
      label: employee.name,
    })),
  ];

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <InputsGrid cols={1}>
        <Input
          label="Título"
          placeholder="Implementar nova feature"
          {...form.register("name")}
          error={errors.name?.message}
        />
      </InputsGrid>

      <InputsGrid cols={1}>
        <Textarea
          label="Descrição"
          placeholder="Descreva os detalhes da tarefa..."
          {...form.register("description")}
          error={errors.description?.message}
          rows={4}
        />
      </InputsGrid>

      <InputsGrid>
        <Select
          label="Time"
          {...form.register("teamId")}
          error={errors.teamId?.message}
          options={teamOptions}
          disabled={isLoadingTeams}
        />

        <Select
          label="Atribuir para"
          {...form.register("assignedToId")}
          error={errors.assignedToId?.message}
          options={employeeOptions}
          disabled={isLoadingEmployees}
        />
      </InputsGrid>

      <InputsGrid>
        <Select
          label="Prioridade"
          {...form.register("priority")}
          error={errors.priority?.message}
          options={priorityOptions}
        />

        <Input
          type="date"
          label="Data de Entrega"
          {...form.register("dueDate")}
          error={errors.dueDate?.message}
        />
      </InputsGrid>

      <div className="flex gap-3 pt-4">
        <CancelButton className="w-full" />
        <Button type="submit" className="w-full" isLoading={isLoading || isLoadingTeams || isLoadingEmployees}>
          Criar tarefa
        </Button>
      </div>
    </form>
  );
}
