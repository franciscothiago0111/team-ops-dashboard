"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            "min-h-[100px] w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            error
              ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-slate-500">{hint}</span>
        )}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
