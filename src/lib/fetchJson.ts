export interface FetchJsonResult<T> {
  response: Response;
  data: T | null;
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<FetchJsonResult<T>> {
  const response = await fetch(input, init);
  const data = (await response.json().catch(() => null)) as T | null;

  return { response, data };
}
