"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useCreateCompany } from "../_hooks/useCreateCompany";
import { CreateCompanyInput, CreateCompanySchema } from "../_schemas/company.schema";

export function SignupForm() {
  const { execute, isLoading } = useCreateCompany();
  const router = useRouter();

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
    },
  });

  async function onSubmit(values: CreateCompanyInput) {
    try {
      await execute(values);
      form.reset();
      router.push("/login");
    } catch {
      // Error is handled by the mutation's onError
    }
  }

  const { errors } = form.formState;

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <InputsGrid cols={1}>
        <Input
          label="Nome da Empresa"
          placeholder="Acme Corp"
          {...form.register("companyName")}
          error={errors.companyName?.message}
        />
      </InputsGrid>

      <InputsGrid>
        <Input
          label="Seu Nome"
          placeholder="João Silva"
          {...form.register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="joao@acme.com"
          {...form.register("email")}
          error={errors.email?.message}
        />
      </InputsGrid>

      <InputsGrid cols={1}>
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
          error={errors.password?.message}
        />
      </InputsGrid>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Criar Conta
      </Button>
    </form>
  );
}
