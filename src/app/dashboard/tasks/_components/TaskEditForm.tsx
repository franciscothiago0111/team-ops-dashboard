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
import { useUpdateTask } from "../_hooks/useUpdateTask";
import { useDeleteTaskFile } from "../_hooks/useDeleteTaskFile";
import { UpdateTaskInput, UpdateTaskSchema } from "../_schemas/task.schema";
import { Task } from "@/shared/types/task";
import { TaskService } from "../_services/task.service";
import { useAppToast } from "@/core/hooks/useToast";
import { FileUploadInput } from "./FileUploadInput";
import { FileList } from "./FileList";

import { useTeamList } from "../../teams/_hooks/useTeamList";
import { useEmployeeList } from "../../employees/_hooks/useEmployeeList";
import { getPriorityOptions, getStatusOptions } from "../_utils/task.utils";

interface TaskEditFormProps {
  task: Task;
  onSuccess?: () => void;
}


export function TaskEditForm({ task, onSuccess }: TaskEditFormProps) {
  const toast = useAppToast();
  const { execute, isLoading } = useUpdateTask();
  const { execute: executeDeleteFile, isLoading: isDeletingFile } = useDeleteTaskFile();

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const { data: teamsData, isLoading: isLoadingTeams } = useTeamList({ limit: 100 });
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployeeList({ limit: 100 });

  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      name: task.name,
      description: task.description ?? "",
      assignedToId: task.assignedToId ?? "",
      teamId: task.teamId,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      status: task.status,

    },
  });

  async function onSubmit(values: UpdateTaskInput) {
    const payload = {
      ...values,
      id: task.id,
      assignedToId: values.assignedToId || undefined,
      dueDate: values.dueDate || null,
    };
    await execute(payload);

    // Upload new files if any (no need to wait for task ID, we already have it)
    if (newFiles.length > 0) {
      setIsUploadingFiles(true);
      try {
        await TaskService.uploadFiles(task.id, newFiles);
        toast.success("Alterações salvas e arquivos enviados com sucesso!");
        setNewFiles([]);
      } catch (error) {
        toast.error("Alterações salvas, mas houve erro ao enviar os arquivos.");
      } finally {
        setIsUploadingFiles(false);
      }
    }

    onSuccess?.();
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      await executeDeleteFile({ taskId: task.id, fileId });
      onSuccess?.(); // Refresh task data
    } catch (error) {
      // Error already handled by the hook
    }
  };


  const { errors } = form.formState;

  const teams = teamsData?.data ?? [];
  const employees = employeesData?.data ?? [];

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  const employeeOptions = employees.map((employee) => ({
    value: employee.id,
    label: employee.name,
  }));

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
          label="Status"
          {...form.register("status")}
          error={errors.status?.message}
          options={getStatusOptions()}
        />

        <Select
          label="Prioridade"
          {...form.register("priority")}
          error={errors.priority?.message}
          options={getPriorityOptions()}
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
        <Input
          type="date"
          label="Data de Entrega"
          {...form.register("dueDate")}
          error={errors.dueDate?.message}
        />
      </InputsGrid>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            Arquivos anexados
          </h3>
          <FileList
            files={task.files || []}
            onDelete={handleDeleteFile}
            isDeleting={isDeletingFile}
          />
        </div>

        <FileUploadInput
          files={newFiles}
          onChange={setNewFiles}
          label="Adicionar novos arquivos"
          disabled={isLoading || isUploadingFiles}
        />
      </div>




      <div className="flex gap-3 pt-4">
        <CancelButton className="w-full" />
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading || isUploadingFiles || isLoadingTeams || isLoadingEmployees}
        >
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
