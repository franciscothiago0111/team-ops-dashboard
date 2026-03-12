import Link from "next/link";
import { Team } from "@/shared/types/team";
import { Card } from "@/core/ui/Card";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* <h3 className="text-xl font-semibold text-slate-900">{team.name}</h3> */}
          <Link
            href={`/dashboard/teams/${team.id}`}
            className="block text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {team.name}
          </Link>
        </div>
      </div>

      {team.description && (
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
          {team.description}
        </p>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-500">
        <div>
          <dt className="font-medium text-slate-400">Gerente</dt>
          <dd className="text-slate-900">{team?.manager?.name}</dd>
        </div>
        {team.createdAt && (
          <div>
            <dt className="font-medium text-slate-400">Criado em</dt>
            <dd className="text-slate-900">
              {new Date(team.createdAt).toLocaleDateString("pt-BR")}
            </dd>
          </div>
        )}
      </dl>

    </Card>
  );
}
