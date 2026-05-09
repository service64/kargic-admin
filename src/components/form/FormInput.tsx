"use client";

import * as React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  /** Extra classes for the underlying `<input />` (e.g. `h-10`). */
  inputClassName?: string;
  autoComplete?: string;
  /** Renders after the label (e.g. forgot-password link). */
  labelEnd?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number | string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
  readOnly?: boolean;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  inputClassName,
  autoComplete,
  labelEnd,
  min,
  max,
  step,
  maxLength,
  inputMode,
  disabled,
  readOnly,
}: FormInputProps<T>) {
  const isNumeric = type === "number";

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
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              min={min}
              max={max}
              step={step}
              maxLength={maxLength}
              inputMode={inputMode}
              disabled={disabled}
              readOnly={readOnly}
              className={cn("h-10", inputClassName)}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              {...(isNumeric
                ? {
                    value:
                      field.value === undefined || field.value === null
                        ? ""
                        : field.value,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      const raw = e.target.value;
                      field.onChange(
                        raw === "" ? undefined : Number(raw),
                      );
                    },
                  }
                : {
                    value: field.value ?? "",
                    onChange: field.onChange,
                  })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
