export type ApiEnvelope<T> = {
  status: number
  message: string
  data: T
}

export function unwrapData<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}
