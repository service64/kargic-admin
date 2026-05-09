"use client";

import * as React from "react";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type CaptionLayout = "label" | "dropdown" | "dropdown-months" | "dropdown-years";

interface FormCalenderProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  /** Disable specific dates (e.g. `(d) => d < new Date()`). */
  disabled?: (date: Date) => boolean;
  /** dayjs format string for the trigger button label. */
  dateFormat?: string;
  className?: string;
  /**
   * Month/year UI: `"dropdown"` = both month & year selects (default).
   * `"label"` = month/year text + arrow nav only.
   */
  captionLayout?: CaptionLayout;
  /** Earliest month in dropdowns / navigation (default Jan 1900). */
  startMonth?: Date;
  /** Latest month in dropdowns / navigation (default current month). */
  endMonth?: Date;
}

const DEFAULT_START_MONTH = new Date(1900, 0, 1);

/** Stored form value: ISO date string `YYYY-MM-DD` (or legacy `Date` from older state). */
function parseFieldDate(value: unknown): Date | undefined {
  if (value == null || value === "") return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value === "string") {
    const d = dayjs(value);
    return d.isValid() ? d.toDate() : undefined;
  }
  return undefined;
}

function toDateString(date: Date | undefined): string | undefined {
  return date ? dayjs(date).format("YYYY-MM-DD") : undefined;
}

export function FormCalender<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Pick a date",
  disabled,
  dateFormat = "MMMM D, YYYY",
  className,
  captionLayout = "dropdown",
  startMonth = DEFAULT_START_MONTH,
  endMonth,
}: FormCalenderProps<T>) {
  const [open, setOpen] = React.useState(false);
  const resolvedEndMonth = endMonth ?? new Date();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedDate = parseFieldDate(field.value);
        return (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    {selectedDate ? (
                      dayjs(selectedDate).format(dateFormat)
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon
                      className="ml-auto h-4 w-4 shrink-0 opacity-50"
                      aria-hidden
                    />
                  </Button>
                </FormControl>
              }
            />
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                defaultMonth={selectedDate}
                onSelect={(date) => {
                  field.onChange(
                    date != null ? toDateString(date) : undefined,
                  );
                  setOpen(false);
                }}
                disabled={disabled}
                initialFocus
                captionLayout={captionLayout}
                startMonth={startMonth}
                endMonth={resolvedEndMonth}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
        );
      }}
    />
  );
}
