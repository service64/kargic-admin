'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Country } from 'country-state-city';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

type CountryOption = {
  label: string;
  value: string;
  isoCode: string;
};

interface FormCountryProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function FormCountry<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select country',
  searchPlaceholder = 'Search country...',
  emptyText = 'No country found.',
  disabled,
  className,
  triggerClassName,
}: FormCountryProps<T>) {
  const [open, setOpen] = React.useState(false);

  const countries = React.useMemo<CountryOption[]>(
    () =>
      Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.name,
        isoCode: country.isoCode,
      })),
    [],
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedCountry = countries.find(
          (country) => country.value === field.value,
        );

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      disabled={disabled}
                      className={cn(
                        'w-full justify-between font-normal',
                        !selectedCountry && 'text-muted-foreground',
                        triggerClassName,
                      )}
                    >
                      <span className="truncate">
                        {selectedCountry ? selectedCountry.label : placeholder}
                      </span>
                      <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                }
              />
              <PopoverContent
                className="min-w-72 max-w-[min(100vw-2rem,28rem)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.isoCode}
                          value={`${country.label} ${country.isoCode}`}
                          onSelect={() => {
                            field.onChange(country.value);
                            setOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 size-4',
                              selectedCountry?.value === country.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {country.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormCountry;
