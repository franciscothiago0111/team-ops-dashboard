"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

const variants = {
  default: "border-slate-200 focus:border-slate-400 focus:ring-slate-100",
  error: "border-red-400 focus:border-red-400 focus:ring-red-100",
  success: "border-green-400 focus:border-green-400 focus:ring-green-100",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: keyof typeof variants;
  inputSize?: keyof typeof sizes;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    error,
    label,
    hint,
    id,
    leftIcon,
    rightIcon,
    variant,
    inputSize = "md",
    ...props
  }, ref) => {
    const inputId = id || props.name;
    const inputVariant = error ? "error" : variant || "default";

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-lg border bg-white text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              variants[inputVariant],
              sizes[inputSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {hint && !error && (
          <span className="text-xs text-slate-500">{hint}</span>
        )}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
