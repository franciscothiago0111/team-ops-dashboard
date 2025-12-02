"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Textarea } from "@/core/ui/Textarea";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useCreateTeam } from "../_hooks/useCreateTeam";
import { CreateTeamInput, CreateTeamSchema } from "../_schemas/team.schema";

interface TeamFormProps {
  onSuccess?: () => void;
}

export function TeamForm({ onSuccess }: TeamFormProps) {
  const { execute, isLoading } = useCreateTeam();

  const form = useForm<CreateTeamInput>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CreateTeamInput) {
    await execute(values);
    form.reset();
    onSuccess?.();
  }

  const { errors } = form.formState;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <InputsGrid cols={1}>
        <Input
          label="Nome do Time"
          placeholder="Desenvolvimento Frontend"
          {...form.register("name")}
          error={errors.name?.message}
        />
      </InputsGrid>





      <div className="flex gap-3">
        <CancelButton className="w-full" />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Criar time
        </Button>
      </div>
    </form>
  );
}
