"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, File, Image as ImageIcon, FileText, Trash2 } from "lucide-react";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Select } from "@/core/ui/Select";
import { Textarea } from "@/core/ui/Textarea";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useUpdateTask } from "../_hooks/useUpdateTask";
import { UpdateTaskInput, UpdateTaskSchema } from "../_schemas/task.schema";
import { Task } from "@/shared/types/task";
import { TaskService } from "../_services/task.service";
import { useAppToast } from "@/core/hooks/useToast";

import { useTeamList } from "../../teams/_hooks/useTeamList";
import { useEmployeeList } from "../../employees/_hooks/useEmployeeList";

interface TaskEditFormProps {
  task: Task;
  onSuccess?: () => void;
}

const priorityOptions = [
  { value: "LOW", label: "🟢 Baixa" },
  { value: "MEDIUM", label: "🟡 Média" },
  { value: "HIGH", label: "🟠 Alta" },
  { value: "URGENT", label: "🔴 Urgente" },
];

const statusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "IN_PROGRESS", label: "Em Progresso" },
  { value: "DONE", label: "Concluída" },
];

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-purple-500" />;
  if (mimeType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
  return <File className="h-5 w-5 text-slate-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function TaskEditForm({ task, onSuccess }: TaskEditFormProps) {
  const toast = useAppToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { execute, isLoading } = useUpdateTask();

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

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

    // Upload new files if any
    if (newFiles.length > 0) {
      setIsUploadingFiles(true);
      try {
        await TaskService.uploadFiles(task.id, newFiles);
        toast.success("Arquivos enviados com sucesso!");
        setNewFiles([]);
      } catch {
        toast.error("Erro ao enviar arquivos.");
      } finally {
        setIsUploadingFiles(false);
      }
    }

    onSuccess?.();
  }


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
          label="Status"
          {...form.register("status")}
          error={errors.status?.message}
          options={statusOptions}
        />

        <Select
          label="Prioridade"
          {...form.register("priority")}
          error={errors.priority?.message}
          options={priorityOptions}
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
