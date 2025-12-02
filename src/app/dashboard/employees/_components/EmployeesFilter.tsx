"use client";

import { Filter } from "@/shared/components/Filter";


export function EmployeesFilter() {
  return (
    <Filter
      fields={[
        {
          name: "name",
          label: "Nome",
          placeholder: "Buscar por nome...",
          type: "text",
        },

        {
          name: "position",
          label: "Cargo",
          placeholder: "Cargo...",
          type: "text",
        },
      ]}
    />
  );
}
