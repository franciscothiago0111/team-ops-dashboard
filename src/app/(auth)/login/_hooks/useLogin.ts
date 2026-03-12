"use client";

import { useState } from "react";
import { AuthService } from "@/core/services/auth.service";
import { useAppToast } from "@/core/hooks/useToast";
import { useRouter } from "next/navigation";
import { LoginInput } from "../_schemas/login.schema";
import { useAuth } from "@/core/hooks/useAuth";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useAppToast();
  const { setUser } = useAuth();
  const router = useRouter();

  async function execute(data: LoginInput) {
    try {
      setIsLoading(true);
      const response = await AuthService.login(data);
      setUser(response.user);
      toast.success("Bem-vindo de volta!");
      router.push("/dashboard");
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Credenciais inválidas");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return { execute, isLoading };
}
