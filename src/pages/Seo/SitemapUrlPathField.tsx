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
} from "@/constants/seo-pages"
import {
  displaySitemapPath,
  normalizeSitemapPath,
} from "@/pages/Seo/sitemapPath"

type SitemapUrlOption = {
  value: string
  label: string
  livePath: string
}

function buildSitemapOptions(fallbackUrl?: string): SitemapUrlOption[] {
  const options: SitemapUrlOption[] = SEO_PAGES.map((page) => {
    const value = normalizeSitemapPath(page.url)
    return {
      value,
      label: displaySitemapPath(value),
      livePath: page.url,
    }
  })

  if (fallbackUrl) {
    const value = normalizeSitemapPath(fallbackUrl)
    if (!options.some((option) => option.value === value)) {
      const matched = SEO_PAGES.find(
        (page) => normalizeSitemapPath(page.url) === value,
      )
      options.push({
        value,
        label: displaySitemapPath(value),
        livePath: matched?.url ?? `/${value}`,
      })
    }
  }

  return options
}

function getLivePathForSitemapValue(value: string): string | null {
  const normalized = normalizeSitemapPath(value)
  const matched = SEO_PAGES.find(
    (page) => normalizeSitemapPath(page.url) === normalized,
  )
  if (matched) return matched.url
  if (normalized === "/") return "/"
  return `/${normalized}`
}

type SitemapUrlPathFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  disabled?: boolean
  fallbackUrl?: string
}

export function SitemapUrlPathField<T extends FieldValues>({
  control,
  name,
  disabled,
  fallbackUrl,
}: SitemapUrlPathFieldProps<T>) {
  const options = React.useMemo(
    () => buildSitemapOptions(fallbackUrl),
    [fallbackUrl],
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const fieldValue = normalizeSitemapPath(String(field.value ?? "/"))
        const livePath = getLivePathForSitemapValue(fieldValue)
        const liveUrl = livePath ? buildPublicPageUrl(livePath) : null
        const selectedPage = SEO_PAGES.find(
          (page) => normalizeSitemapPath(page.url) === fieldValue,
        )

        return (
          <FormItem>
            <FormLabel>URL path</FormLabel>
            <Select
              key={fieldValue || "__empty__"}
              value={fieldValue}
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
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="font-mono text-xs">{option.label}</span>
                      <a
                        href={buildPublicPageUrl(option.livePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary ml-2 hover:underline"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {option.livePath}
                      </a>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {selectedPage ? (
              <p className="text-muted-foreground text-xs">
                SEO key:{" "}
                <code className="text-foreground">{selectedPage.key}</code>
              </p>
            ) : null}
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
