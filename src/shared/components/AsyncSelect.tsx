"use client";

import { useEffect, useState } from "react";

interface AsyncSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fetchOptions: () => Promise<Array<{ value: string; label: string }>>;
  className?: string;
}

export function AsyncSelect({
  value,
  onChange,
  placeholder = "Selecione...",
  fetchOptions,
  className = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
}: AsyncSelectProps) {
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchOptions();

        if (isMounted) {
          setOptions(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Erro ao carregar opções");
          console.error("Error loading select options:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [fetchOptions]);

  if (error) {
    return (
      <select disabled className={className}>
        <option>{error}</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      className={className}
    >
      <option value="">
        {isLoading ? "Carregando..." : placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
