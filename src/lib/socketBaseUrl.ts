/** Socket.IO mounts on the same host as REST API, without the `/api/v1` suffix. */
export function getSocketBaseUrl(): string {
  const api = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1'
  return api.replace(/\/api\/v1\/?$/, '')
}
