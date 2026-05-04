"use client";

import * as React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormTextAreaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  textAreaClassName?: string;
  /** Renders after the label (e.g. optional marker). */
  labelEnd?: React.ReactNode;
}

export function FormTextArea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
  maxLength,
  disabled,
  readOnly,
  autoComplete,
  textAreaClassName,
  labelEnd,
}: FormTextAreaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {labelEnd ? (
            <div className="flex items-center justify-between gap-2">
              <FormLabel>{label}</FormLabel>
              {labelEnd}
            </div>
          ) : (
            <FormLabel>{label}</FormLabel>
          )}

          <FormControl>
            <textarea
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              disabled={disabled}
              readOnly={readOnly}
              autoComplete={autoComplete}
              className={cn(
                "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                textAreaClassName,
              )}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
