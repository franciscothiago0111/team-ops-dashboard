"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/core/ui/Button";
import { EmployeeCard } from "./EmployeeCard";
import { Paginate } from "@/shared/components/Pagination";
import { IEmployeeListParams } from "../_services/employee.service";
import { useEmployeeList } from "../_hooks/useEmployeeList";
import { SkeletonList } from "@/core/components/LoadingState";
import { useCSVDownload } from "@/core/hooks/useCSVDownload";
import { CSVDownloadButton } from "@/shared/components/CSVDownloadButton";
import { formatDate } from "@/core/utils/formatters";
import { usePersistedFilters } from "@/core/hooks/usePersistedFilters";

interface EmployeesListProps {
  title?: string;
}

const EMPLOYEE_FILTER_KEYS = ["name", "role"];

export function EmployeesList({ title = "Colaboradores" }: EmployeesListProps) {
  const searchParams = useSearchParams();
  usePersistedFilters("employees-filters", EMPLOYEE_FILTER_KEYS);
  const { generateCSV, isGenerating } = useCSVDownload();

  const filters: IEmployeeListParams = {
    name: searchParams.get("name") || undefined,
    role: searchParams.get("role") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  // Separate query for CSV export with high limit
  const filtersCsv: IEmployeeListParams = {
    ...filters,
    page: undefined,
    limit: 10000000,
  };

  const { data, isLoading, error, refetch } = useEmployeeList(filters);
  const { data: dataCsv } = useEmployeeList(filtersCsv);

  const employees = data?.data ?? [];

  const handleDownloadCSV = async () => {
    if (!dataCsv?.data || dataCsv.data.length === 0) {
      return;
    }

    const csvData = dataCsv.data.map((employee) => ({
      ID: employee.id,
      Nome: employee.name,
      Email: employee.email,
      Função: employee.role,
      Equipe: employee.team?.name || "",
      "Criado em": formatDate(employee.createdAt) || "",
      "Atualizado em": employee.updatedAt ? formatDate(employee.updatedAt) : "",
    }));

    const fileName = `colaboradores_${formatDate(new Date())}.csv`;
    await generateCSV({ data: csvData, filename: fileName });
  };



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
        <div className="flex items-center gap-3">
          <CSVDownloadButton
            onClick={handleDownloadCSV}
            isLoading={isGenerating}
            disabled={!dataCsv?.data || dataCsv.data.length === 0}
          />
          <Link
            href="/dashboard/employees/new"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white"
          >
            Novo colaborador
          </Link>
        </div>
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
