import Link from "next/link";
import { Card } from "@/core/ui/Card";
import clsx from "clsx";
import { User } from "@/shared/types";

interface EmployeeCardProps {
  employee: User;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/dashboard/employees/${employee.id}`}
            className="block text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {employee.name}
          </Link>
        </div>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-semibold",
            employee.role === "ADMIN"
              ? "bg-blue-100 text-blue-800"
              : employee.role === "MANAGER"
                ? "bg-green-100 text-green-800"
                : "bg-slate-100 text-slate-800"
          )}
        >
          {employee.role}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm text-slate-500">
        <div>
          <dt className="font-medium text-slate-400">Email</dt>
          <dd className="text-slate-900">{employee.email}</dd>
        </div>

      </dl>

    </Card>
  );
}
