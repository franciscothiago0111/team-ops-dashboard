import { z } from "zod";

export const CreateTeamSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  memberIds: z.array(z.string()).optional(),
  managerId: z.string()
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;

export const UpdateTeamSchema = CreateTeamSchema.partial();

export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
