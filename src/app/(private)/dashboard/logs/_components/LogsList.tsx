"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/core/ui/Button";
import { LogCard } from "./LogCard";
import { Paginate } from "@/shared/components/Pagination";
import { ILogListParams } from "../_services/log.service";
import { useLogList } from "../_hooks/useLogList";
import { SkeletonList } from "@/core/components/LoadingState";
import { useCSVDownload } from "@/core/hooks/useCSVDownload";
import { CSVDownloadButton } from "@/shared/components/CSVDownloadButton";
import { formatDate } from "@/core/utils/formatters";

interface LogsListProps {
  title?: string;
}

export function LogsList({ title = "Logs" }: LogsListProps) {
  const searchParams = useSearchParams();
  const { generateCSV, isGenerating } = useCSVDownload();

  const filters: ILogListParams = {
    entity: searchParams.get("entity") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  // Separate query for CSV export with high limit
  const filtersCsv: ILogListParams = {
    ...filters,
    page: undefined,
    limit: 10000000,
  };

  const { data, isLoading, error, refetch } = useLogList(filters);
  const { data: dataCsv } = useLogList(filtersCsv);

  const logs = data?.data ?? [];

  const handleDownloadCSV = async () => {
    if (!dataCsv?.data || dataCsv.data.length === 0) {
      return;
    }

    const csvData = dataCsv.data.map((log) => ({
      ID: log.id,
      Ação: log.action,
      Entidade: log.entity,
      Usuário: log.user?.name || "Sistema",
      "ID da Empresa": log.companyId,
      "Criado em": formatDate(log.createdAt) || "",
      Metadados: log.metadata ? JSON.stringify(log.metadata) : "",
    }));

    const fileName = `logs_${formatDate(new Date())}.csv`;
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
        <p className="text-sm text-red-500">Erro ao carregar logs.</p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
        <p className="text-lg font-semibold text-slate-900">Nenhum log encontrado</p>
        <p className="text-sm text-slate-500">Não há registros de atividades no momento.</p>
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
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {logs.map((log) => (
          <LogCard key={log.id} log={log} />
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
        itemLabel="logs"
      />
    </div>
  );
}
