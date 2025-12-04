import Link from "next/link";
import { Task } from "@/shared/types/task";
import { Card } from "@/core/ui/Card";
import { Calendar, User, Paperclip, Flag, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { statusConfig, priorityConfigDetails } from "../_utils/task.utils";
import { isPast, isToday, formatDate } from "@/core/utils/formatters";
import { RichTextDisplay } from "@/shared/components/RichTextDisplay";


interface TaskCardProps {
  task: Task;
}


export function TaskCard({ task }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfigDetails[task.priority];

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const isOverdue = isPast(dueDate) && task.status !== "COMPLETED";
    const isDueToday = isToday(dueDate);

    return {
      formatted: formatDate(dueDate),
      isOverdue,
      isDueToday,
    };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <Card className="group transition-all hover:shadow-lg hover:border-slate-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx("flex items-center gap-1 text-xs font-medium", priority.color)}>
              <span>{priority.icon}</span>
              {priority.label}
            </span>
            <span className="text-slate-300">•</span>
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                status.color
              )}
            >

            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {task.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="mt-2 text-sm text-slate-600 line-clamp-2">
          <RichTextDisplay content={task.description} />
        </div>
      )}

      {/* Meta Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {dueDateInfo && (
          <div className="flex items-center gap-2">
            <Calendar
              className={clsx(
                "h-4 w-4",
                dueDateInfo.isOverdue ? "text-red-500" : dueDateInfo.isDueToday ? "text-amber-500" : "text-slate-400"
              )}
            />
            <span
              className={clsx(
                dueDateInfo.isOverdue
                  ? "font-medium text-red-600"
                  : dueDateInfo.isDueToday
                    ? "font-medium text-amber-600"
                    : "text-slate-600"
              )}
            >
              {dueDateInfo.formatted}
              {dueDateInfo.isOverdue && " (atrasada)"}
            </span>
          </div>
        )}

        {task.assignedTo && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600 truncate">{task.assignedTo.name}</span>
          </div>
        )}

        {task.team && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Time:</span>
            <span className="text-slate-600 truncate">{task.team.name}</span>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Criado em {formatDate(new Date(task.createdAt))}
        </span>
        <Link
          href={`/dashboard/tasks/${task.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Ver detalhes
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
