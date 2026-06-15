const LOCALE_PREFIXES = new Set(["en", "bn", "es", "ar"])

export const HOME_SITEMAP_PATH = "/"

const toPathSegment = (raw: string): string => {
  const trimmed = raw.trim()
  if (!trimmed || trimmed === "/" || trimmed.toLowerCase() === "home") {
    return ""
  }

  if (trimmed.includes("://")) {
    try {
      const { pathname } = new URL(trimmed)
      return toPathSegment(pathname)
    } catch {
      return trimmed
    }
  }

  const withoutSlashes = trimmed.replace(/^\/+|\/+$/g, "")
  if (!withoutSlashes || withoutSlashes.toLowerCase() === "home") {
    return ""
  }

  const segments = withoutSlashes.split("/").filter(Boolean)
  if (segments[0] && LOCALE_PREFIXES.has(segments[0])) {
    segments.shift()
  }

  const path = segments.join("/")
  return path.toLowerCase() === "home" ? "" : path
}

/** Normalize admin input to stored path (`/` = site root). */
export function normalizeSitemapPath(raw: string): string {
  const path = toPathSegment(raw)
  return path === "" ? HOME_SITEMAP_PATH : path
}

export function displaySitemapPath(url: string): string {
  const value = url.trim()
  if (!value || value === HOME_SITEMAP_PATH || value === "home") {
    return HOME_SITEMAP_PATH
  }
  return value
}
