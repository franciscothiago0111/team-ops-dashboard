import { z } from "zod";

export const CreateTaskSchema = z.object({
  name: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(1, "Descrição é obrigatória"),
  assignedToId: z.string().min(1, "Funcionário é obrigatório"),
  teamId: z.string().min(1, "Time é obrigatório"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  name: z.string().min(3, "Título deve ter no mínimo 3 caracteres").optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  assignedToId: z.string().min(1, "Funcionário é obrigatório").optional(),
  teamId: z.string().min(1, "Time é obrigatório").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional().nullable(),
  labels: z.array(z.string()).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
