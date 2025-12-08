"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Select } from "@/core/ui/Select";
import { RichTextEditor } from "@/core/ui/RichTextEditor";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useCreateTask } from "../_hooks/useCreateTask";
import { CreateTaskInput, CreateTaskSchema } from "../_schemas/task.schema";
import { FileUploadInput } from "./FileUploadInput";
import { TaskService } from "../_services/task.service";
import { useAppToast } from "@/core/hooks/useToast";

import { useTeamList } from "../../teams/_hooks/useTeamList";
import { useEmployeeList } from "../../employees/_hooks/useEmployeeList";
import { getPriorityOptions } from "../_utils/task.utils";

interface TaskFormProps {
  onSuccess?: () => void;
}


export function TaskForm({ onSuccess }: TaskFormProps) {
  const toast = useAppToast();
  const { execute, isLoading } = useCreateTask();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const { data: teamsData, isLoading: isLoadingTeams } = useTeamList({ limit: 100 });
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployeeList({ limit: 100, role: "EMPLOYEE" });

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
      assignedToId: values.assignedToId,
      dueDate: values.dueDate || undefined,
    };

    // First, create the task
    const createdTask = await execute(payload);

    // If there are files and the task was created successfully, upload them
    if (createdTask && selectedFiles.length > 0) {
      setIsUploadingFiles(true);
      try {
        await TaskService.uploadFiles(createdTask.id, selectedFiles);
        toast.success("Tarefa criada e arquivos enviados com sucesso!");
      } catch (error) {
        toast.error("Tarefa criada, mas houve erro ao enviar os arquivos.");
      } finally {
        setIsUploadingFiles(false);
      }
    }

    form.reset();
    setSelectedFiles([]);
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
    { value: "", label: "Selecione um time" },
  ];

  const employeeOptions = [
    ...employees.map((employee) => ({
      value: employee.id,
      label: employee.name,
    })),
    { value: "", label: "Selecione um funcionário" },
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
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <RichTextEditor
              label="Descrição"
              placeholder="Descreva os detalhes da tarefa..."
              value={field.value}
              onChange={field.onChange}
              error={errors.description?.message}
            />
          )}
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
          options={getPriorityOptions()}
        />

        <Input
          type="date"
          label="Data de Entrega"
          {...form.register("dueDate")}
          error={errors.dueDate?.message}
        />
      </InputsGrid>

      <FileUploadInput
        files={selectedFiles}
        onChange={setSelectedFiles}
        label="Anexar arquivos (opcional)"
        disabled={isLoading || isUploadingFiles}
      />

      <div className="flex gap-3 pt-4">
        <CancelButton className="w-full" />
        <Button type="submit" className="w-full" isLoading={isLoading || isUploadingFiles || isLoadingTeams || isLoadingEmployees}>
          Criar tarefa
        </Button>
      </div>
    </form>
  );
}
