interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  placeholder?: string;
}

export function InfoField({ label, value, placeholder = "—" }: InfoFieldProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-base text-slate-900">
        {value || placeholder}
      </p>
    </div>
  );
}
