export const customFetcher = async <TResponse>(
  url: string,
  options?: RequestInit,
): Promise<TResponse> => {
  const baseUrl =
    import.meta.env.VITE_JSON_SERVER_URL ?? 'http://localhost:3000' // Default to localhost if the environment variable is not set

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data = [204, 205, 304].includes(res.status)
    ? undefined
    : await res.json()
  return {
    data,
    status: res.status,
    headers: res.headers,
  } as TResponse
}
