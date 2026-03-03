import { z } from "zod";

// Helper to strip HTML tags and check if there's actual content
function hasTextContent(html: string): boolean {
  if (!html) return false;
  // Remove HTML tags and trim
  const textContent = html.replace(/<[^>]*>/g, '').trim();
  // Check if there's any actual text content
  return textContent.length > 0;
}

export const CreateTaskSchema = z.object({
  name: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().refine(
    (value) => hasTextContent(value),
    { message: "Descrição é obrigatória" }
  ),
  assignedToId: z.string().min(1, "Funcionário é obrigatório"),
  teamId: z.string().min(1, "Time é obrigatório"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  name: z.string().min(3, "Título deve ter no mínimo 3 caracteres").optional(),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
  teamId: z.string().min(1, "Time é obrigatório").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional().nullable(),
  labels: z.array(z.string()).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
