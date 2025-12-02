"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/core/ui/Button";

interface CancelButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

export function CancelButton({ onClick, text = "Cancelar", className = "" }: CancelButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleClick}
      className={className}
    >
      {text}
    </Button>
  );
}
