import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"], {
    message: "Role inválido",
  }),

});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;
