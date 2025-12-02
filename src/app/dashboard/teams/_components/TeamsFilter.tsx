"use client";

import { Filter } from "@/shared/components/Filter";

export function TeamsFilter() {
  return (
    <Filter
      fields={[
        {
          name: "name",
          label: "Nome",
          placeholder: "Buscar por nome do time...",
          type: "text",
        },
      ]}
    />
  );
}
