"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/core/hooks/useAuth";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/app/dashboard/_components/DashboardShell";
import { ErrorState } from "./ErrorState";
import { Role } from "@/shared/types/user";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
  title?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
  title = "Acesso Negado"
}: RoleGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role as Role)) {
      router.push(redirectTo);
    }
  }, [user, allowedRoles, router, redirectTo]);

  if (!user || !allowedRoles.includes(user.role as Role)) {
    return (
      <DashboardShell title={title}>
        <ErrorState
          message="Você não tem permissão para acessar esta página."
          showBackButton={true}
          backButtonText="Voltar ao Dashboard"
          onBack={() => router.push(redirectTo)}
        />
      </DashboardShell>
    );
  }

  return <>{children}</>;
}
