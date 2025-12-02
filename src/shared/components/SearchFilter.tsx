"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/core/ui/Input";
import { Button } from "@/core/ui/Button";

interface SearchFilterProps {
  paramName?: string;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchFilter({
  paramName = "search",
  placeholder = "Buscar...",
  defaultValue
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    defaultValue ?? searchParams.get(paramName) ?? ""
  );

  const updateFilters = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(searchValue || undefined);
  };

  const handleClear = () => {
    setSearchValue("");
    updateFilters(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1 max-w-md">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          Buscar
        </Button>
        {searchValue && (
          <Button
            type="button"
            onClick={handleClear}
            className="bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Limpar
          </Button>
        )}
      </div>
    </form>
  );
}
