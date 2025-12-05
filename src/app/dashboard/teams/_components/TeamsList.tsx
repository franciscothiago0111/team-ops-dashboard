"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/core/ui/Button";
import { TeamCard } from "./TeamCard";
import { Paginate } from "@/shared/components/Pagination";
import { ITeamListParams } from "../_services/team.service";
import { useTeamList } from "../_hooks/useTeamList";
import { SkeletonList } from "@/core/components/LoadingState";
import { useAuth } from "@/core/hooks/useAuth";
import { useCSVDownload } from "@/core/hooks/useCSVDownload";
import { CSVDownloadButton } from "@/shared/components/CSVDownloadButton";
import { formatDate } from "@/core/utils/formatters";
import { stripHtmlTags } from "@/core/utils/text";

interface TeamsListProps {
  title?: string;
}

export function TeamsList({ title = "Times" }: TeamsListProps) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { generateCSV, isGenerating } = useCSVDownload();

  const canCreateTeam = user?.role === "ADMIN";

  const filters: ITeamListParams = {
    name: searchParams.get("name") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  // Separate query for CSV export with high limit
  const filtersCsv: ITeamListParams = {
    ...filters,
    page: undefined,
    limit: 10000000,
  };

  const { data, isLoading, error, refetch } = useTeamList(filters);
  const { data: dataCsv } = useTeamList(filtersCsv);

  const teams = data?.data ?? [];

  const handleDownloadCSV = async () => {
    if (!dataCsv?.data || dataCsv.data.length === 0) {
      return;
    }

    const csvData = dataCsv.data.map((team) => ({
      ID: team.id,
      Nome: team.name,
      Descrição: stripHtmlTags(team.description || ""),
      Gerente: team.manager?.name || "",
      "Número de membros": team.members?.length || 0,
      "Número de tarefas": team.tasks?.length || 0,
      "Criado em": formatDate(team.createdAt) || "",
      "Atualizado em": team.updatedAt ? formatDate(team.updatedAt) : "",
    }));

    const fileName = `times_${formatDate(new Date())}.csv`;
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
        <p className="text-sm text-red-500">Erro ao carregar times.</p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!teams.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
        <p className="text-lg font-semibold text-slate-900">Nenhum time encontrado</p>
        <p className="text-sm text-slate-500">Crie o primeiro time para começar.</p>
        {canCreateTeam && (
          <Link
            href="/dashboard/teams/new"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white"
          >
            Criar time
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
        <div className="flex items-center gap-3">
          <CSVDownloadButton
            onClick={handleDownloadCSV}
            isLoading={isGenerating}
            disabled={!dataCsv?.data || dataCsv.data.length === 0}
          />
          {canCreateTeam && (
            <Link
              href="/dashboard/teams/new"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white"
            >
              Novo time
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
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
        itemLabel="times"
      />
    </div>
  );
}
