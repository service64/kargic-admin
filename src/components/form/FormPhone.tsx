"use client";

import PhoneInput from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

/** Matches `Input` + shadcn form: one bordered control, focus ring on the group, flag lane separated. */
const phoneInputClassName = cn(
  "flex h-10 w-full min-w-0 items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30",
  "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
  "[--PhoneInput-color--focus:hsl(var(--ring))] [--PhoneInputCountrySelect-marginRight:0]",
  "[&.PhoneInput--disabled]:pointer-events-none [&.PhoneInput--disabled]:opacity-60",
  "[&_.PhoneInputCountry]:mr-0 [&_.PhoneInputCountry]:shrink-0 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-input [&_.PhoneInputCountry]:bg-muted/40 [&_.PhoneInputCountry]:pl-2.5 [&_.PhoneInputCountry]:pr-2",
  "[&_.PhoneInputCountrySelectArrow]:opacity-70",
  "[&_.PhoneInputInput]:h-full [&_.PhoneInputInput]:min-h-0 [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:shadow-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0",
  "[&_.PhoneInputInput]:rounded-none [&_.PhoneInputInput]:rounded-r-md [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:py-0 [&_.PhoneInputInput]:text-base md:[&_.PhoneInputInput]:text-sm",
  "[&_.PhoneInputInput]:text-foreground [&_.PhoneInputInput]:placeholder:text-muted-foreground",
  "[&_.PhoneInputInput]:selection:bg-primary [&_.PhoneInputInput]:selection:text-primary-foreground",
  "[&_.PhoneInputInput]:disabled:cursor-not-allowed",
);

const phoneInputInvalidClassName = cn(
  "border-destructive ring-destructive/20",
  "focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40",
);

interface FormPhoneProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  /** ISO country code for the default flag / dial prefix (e.g. `"US"`, `"BD"`). */
  defaultCountry?: Country;
  disabled?: boolean;
  international?: boolean;
  /** When `true`, caps length to the selected country’s max (recommended). Default `true`. */
  limitMaxLength?: boolean;
  className?: string;
}

export function FormPhone<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Enter phone number",
  defaultCountry,
  disabled,
  international,
  limitMaxLength = true,
  className,
}: FormPhoneProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("grid gap-2", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              className={cn(
                phoneInputClassName,
                fieldState.invalid && phoneInputInvalidClassName,
              )}
              defaultCountry={defaultCountry}
              disabled={disabled}
              international={international}
              limitMaxLength={limitMaxLength}
              placeholder={placeholder}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              autoComplete="tel"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
