import { ReactNode } from "react";

interface InputsGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function InputsGrid({ children, cols = 2, className = "" }: InputsGridProps) {
  const colsClass = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[cols];

  return (
    <div className={`grid gap-4 ${colsClass} ${className}`}>
      {children}
    </div>
  );
}
