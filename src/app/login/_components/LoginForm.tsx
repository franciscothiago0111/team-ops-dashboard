"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { useLogin } from "../_hooks/useLogin";
import { LoginInput, LoginSchema } from "../_schemas/login.schema";

export function LoginForm() {
  const { execute, isLoading } = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    await execute(values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        {...form.register("email")}
        error={form.formState.errors.email?.message}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        {...form.register("password")}
        error={form.formState.errors.password?.message}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Entrar
      </Button>
    </form>
  );
}
