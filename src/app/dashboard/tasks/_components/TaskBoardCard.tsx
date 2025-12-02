"use client";

import Link from "next/link";
import { Calendar, User, Flag, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { Task, TaskStatus } from "@/shared/types/task";
import {
  priorityConfigCard,
  nextStatus,
  nextStatusLabelCard,
  getDueDateInfoCard,
} from "../_utils/task.utils";


interface TaskBoardCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  currentStatus: TaskStatus;
}

export function TaskBoardCard({ task, onStatusChange, currentStatus }: TaskBoardCardProps) {
  const priority = priorityConfigCard[task.priority];
  const next = nextStatus[currentStatus];
  const dueDateInfo = getDueDateInfoCard(task.dueDate, task.status);

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      {/* Priority & Labels */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            priority.bgColor,
            priority.color
          )}
        >
          <Flag className="h-3 w-3" />
          {priority.label}
        </span>


      </div>

      {/* Title */}
      <Link
        href={`/dashboard/tasks/${task.id}`}
        className="block text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
      >
        {task.name}
      </Link>

      {/* Description */}
      {task.description && (
        <p className="mt-2 text-xs text-slate-500 line-clamp-2">{task.description}</p>
      )}

      {/* Meta Info */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {task.assignedTo && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {task.assignedTo.name}
          </span>
        )}

        {dueDateInfo && (
          <span
            className={clsx(
              "flex items-center gap-1",
              dueDateInfo.isOverdue && "font-medium text-red-600",
              dueDateInfo.isDueToday && !dueDateInfo.isOverdue && "font-medium text-amber-600"
            )}
          >
            <Calendar className="h-3 w-3" />
            {dueDateInfo.text}
          </span>
        )}
      </div>

      {/* Action Button */}
      {next && (
        <button
          onClick={() => onStatusChange(task.id, next)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          {nextStatusLabelCard[currentStatus]}
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
