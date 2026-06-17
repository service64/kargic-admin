"use client"

import * as React from "react"
import { ExternalLink } from "lucide-react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SEO_PAGES,
  buildPublicPageUrl,
  getSeoPageByKey,
} from "@/constants/seo-pages"

type SeoPageKeyFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  disabled?: boolean
  /** Include legacy/unknown key when editing existing SEO records. */
  fallbackKey?: string
}

export function SeoPageKeyField<T extends FieldValues>({
  control,
  name,
  disabled,
  fallbackKey,
}: SeoPageKeyFieldProps<T>) {
  const options = React.useMemo(() => {
    const pages = [...SEO_PAGES]
    if (
      fallbackKey &&
      !pages.some((page) => page.key === fallbackKey)
    ) {
      pages.push({ key: fallbackKey, url: `/${fallbackKey}` })
    }
    return pages
  }, [fallbackKey])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = getSeoPageByKey(String(field.value ?? ""))
        const liveUrl = selected ? buildPublicPageUrl(selected.url) : null

        return (
          <FormItem>
            <FormLabel>Page key</FormLabel>
            <Select
              key={
                field.value === undefined ||
                field.value === null ||
                field.value === ""
                  ? "__empty__"
                  : String(field.value)
              }
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a public page" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {options.map((page) => (
                    <SelectItem key={page.key} value={page.key}>
                      <span className="font-mono text-xs">{page.key}</span>
                      <a
                        href={buildPublicPageUrl(page.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary ml-2 hover:underline"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {page.url}
                      </a>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
              >
                Open live page
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
