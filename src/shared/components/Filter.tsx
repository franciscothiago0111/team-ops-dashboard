"use client";

import { useState, FormEvent, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/core/ui/Button";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "select" | "date" | "custom";
  options?: FilterOption[];
  renderCustom?: (props: {
    value: string;
    onChange: (value: string) => void;
  }) => ReactNode;
}

interface FilterProps {
  fields: FilterField[];
  onSubmit?: (values: Record<string, string>) => void;
}

export function Filter({ fields, onSubmit }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    fields.forEach((field) => {
      initialValues[field.name] = searchParams.get(field.name) ?? "";
    });
    return initialValues;
  });

  const updateFilters = (filterValues: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove each filter
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(values);
    } else {
      updateFilters(values);
    }
  };

  const handleClear = () => {
    const clearedValues: Record<string, string> = {};
    fields.forEach((field) => {
      clearedValues[field.name] = "";
    });
    setValues(clearedValues);
    updateFilters(clearedValues);
  };

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const hasActiveFilters = Object.values(values).some((value) => value !== "");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        {fields.map((field) => (
          <div key={field.name} className="flex-1 min-w-[200px] lg:min-w-[250px]">
            {field.label && (
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {field.label}
              </label>
            )}

            {field.type === "select" ? (
              <select
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              >
                <option value="" className="text-slate-500">
                  {field.placeholder ?? "Selecione..."}
                </option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "custom" && field.renderCustom ? (
              field.renderCustom({
                value: values[field.name],
                onChange: (value) => handleChange(field.name, value),
              })
            ) : (
              <input
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              />
            )}
          </div>
        ))}

        <div className="flex gap-2 lg:shrink-0">
          <Button type="submit" className="flex-1 lg:flex-initial">
            Buscar
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              onClick={handleClear}
              className="flex-1 lg:flex-initial bg-slate-200 text-slate-800 hover:bg-slate-300"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
