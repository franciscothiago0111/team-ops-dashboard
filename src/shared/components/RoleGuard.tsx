"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/core/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ErrorState } from "./ErrorState";
import { Role } from "@/shared/types/user";
import { DashboardShell } from "@/app/(private)/dashboard/_components/DashboardShell";

interface IRoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
  title?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
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
      <DashboardShell>
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
