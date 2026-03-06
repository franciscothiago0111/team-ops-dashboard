"use client";


import { TeamsList } from "./_components/TeamsList";
import { TeamsFilter } from "./_components/TeamsFilter";
import { RoleGuard } from "@/shared/components/RoleGuard";

export default function TeamsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">
            Gerenciamento de Times
          </h1>
          <p className="text-sm text-slate-500">
            Organize e gerencie os times da sua organização.
          </p>
        </header>



        <TeamsFilter />

        <TeamsList />
      </div>
    </RoleGuard>
  );
}
