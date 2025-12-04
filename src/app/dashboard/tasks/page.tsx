import { TasksBoard } from "./_components/TasksBoard";
import { TasksFilter } from "./_components/TasksFilter";
import { DashboardShell } from "../_components/DashboardShell";

export default function TasksPage() {
  return (
    <DashboardShell title="Tarefas">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">
            Gerenciamento de Tarefas
          </h1>
          <p className="text-sm text-slate-500">
            Organize e acompanhe o progresso das tarefas da equipe.
          </p>
        </header>

        <TasksFilter />

        <TasksBoard />
      </div>
    </DashboardShell>
  );
}
