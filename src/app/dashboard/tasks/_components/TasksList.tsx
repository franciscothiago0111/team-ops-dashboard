"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/core/ui/Button";
import { TaskCard } from "./TaskCard";
import { Paginate } from "@/shared/components/Pagination";
import { ITaskListParams } from "../_services/task.service";
import { useTaskList } from "../_hooks/useTaskList";
import { SkeletonList } from "@/core/components/LoadingState";
import { useAuth } from "@/core/hooks/useAuth";

interface TasksListProps {
  title?: string;
}

export function TasksList({ title = "Tarefas" }: TasksListProps) {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const canCreateTask = user?.role === "MANAGER" || user?.role === "ADMIN";

  const filters: ITaskListParams = {
    name: searchParams.get("name") || undefined,
    status: searchParams.get("status") || undefined,
    assignedToId: searchParams.get("assignedToId") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  const { data, isLoading, error, refetch } = useTaskList(filters);

  const tasks = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>
        <SkeletonList count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-500">Erro ao carregar tarefas.</p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
        <p className="text-lg font-semibold text-slate-900">Nenhuma tarefa encontrada</p>
        <p className="text-sm text-slate-500">Crie a primeira tarefa para começar.</p>
        {canCreateTask && (
          <Link
            href="/dashboard/tasks/new"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white"
          >
            Criar tarefa
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {isLoading && (
            <p className="text-xs text-slate-500">Atualizando dados...</p>
          )}
        </div>
        {canCreateTask && (
          <Link
            href="/dashboard/tasks/new"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white"
          >
            Nova tarefa
          </Link>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <Paginate
        perPage={data ? Math.ceil(data.total / data.limit) : undefined}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(page));
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.pushState({}, "", newUrl);
          void refetch();
        }}
        totalRegisters={data?.total}
        currentPage={data?.currentPage}
        register={data?.data.length}
        registersPrePage={data?.limit}
        itemLabel="tarefas"
      />
    </div>
  );
}
