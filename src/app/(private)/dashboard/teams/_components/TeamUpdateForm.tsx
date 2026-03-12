"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/ui/Button";
import { Input } from "@/core/ui/Input";
import { Textarea } from "@/core/ui/Textarea";
import { CancelButton } from "@/shared/components/CancelButton";
import { InputsGrid } from "@/shared/components/InputsGrid";
import { useUpdateTeam } from "../_hooks/useUpdateTeam";
import { UpdateTeamInput, UpdateTeamSchema } from "../_schemas/team.schema";
import { Team } from "@/shared/types/team";

interface TeamUpdateFormProps {
  team: Team;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TeamUpdateForm({ team, onSuccess, onCancel }: TeamUpdateFormProps) {
  const { execute, isLoading } = useUpdateTeam();

  const form = useForm<UpdateTeamInput>({
    resolver: zodResolver(UpdateTeamSchema),
    defaultValues: {
      name: team.name || "",
    },
  });

  async function onSubmit(values: UpdateTeamInput) {
    await execute({ id: team.id, ...values });
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
        <CancelButton className="w-full" onClick={onCancel} />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Atualizar time
        </Button>
      </div>
    </form>
  );
}
