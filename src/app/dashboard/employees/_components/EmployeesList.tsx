"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/core/ui/Button";
import { EmployeeCard } from "./EmployeeCard";
import { Paginate } from "@/shared/components/Pagination";
import { IEmployeeListParams } from "../_services/employee.service";
import { useEmployeeList } from "../_hooks/useEmployeeList";
import { SkeletonList } from "@/core/components/LoadingState";

interface EmployeesListProps {
  title?: string;
}

export function EmployeesList({ title = "Colaboradores" }: EmployeesListProps) {
  const searchParams = useSearchParams();

  const filters: IEmployeeListParams = {
    name: searchParams.get("name") || undefined,
    department: searchParams.get("department") || undefined,
    position: searchParams.get("position") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  const { data, isLoading, error, refetch } = useEmployeeList(filters);

  const employees = data?.data ?? [];



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
        <p className="text-sm text-red-500">Erro ao carregar colaboradores.</p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
        <p className="text-lg font-semibold text-slate-900">Nenhum colaborador encontrado</p>
        <p className="text-sm text-slate-500">Cadastre o primeiro colaborador para começar.</p>
        <Link
          href="/dashboard/employees/new"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white"
        >
          Cadastrar colaborador
        </Link>
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
        <Link
          href="/dashboard/employees/new"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white"
        >
          Novo colaborador
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
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
        itemLabel="colaboradores"
      />

    </div>
  );
}
