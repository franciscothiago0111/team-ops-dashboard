"use client";

import { Filter } from "@/shared/components/Filter";

export function LogsFilter() {
  return (
    <Filter
      fields={[
        {
          name: "entity",
          label: "Entidade",
          placeholder: "Selecione uma entidade...",
          type: "select",
          options: [

            { value: "TEAM", label: "Equipe" },
            { value: "TASK", label: "Tarefa" },
          ],
        },
      ]}
    />
  );
}
