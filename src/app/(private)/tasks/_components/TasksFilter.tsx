"use client";

import { Filter } from "@/shared/components/Filter";

export function TasksFilter() {
  return (
    <Filter
      fields={[
        {
          name: "name",
          label: "Nome da Tarefa",
          placeholder: "Buscar por nome...",
          type: "text",
        },
        {
          name: "priority",
          label: "Prioridade",
          placeholder: "Todas as prioridades",
          type: "select",
          options: [
            { value: "", label: "Todas" },
            { value: "LOW", label: "🟢 Baixa" },
            { value: "MEDIUM", label: "🟡 Média" },
            { value: "HIGH", label: "🟠 Alta" },
            { value: "URGENT", label: "🔴 Urgente" },
          ],
        },
      ]}
    />
  );
}
