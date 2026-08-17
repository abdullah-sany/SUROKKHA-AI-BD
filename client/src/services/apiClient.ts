/**
 * Single fetch wrapper for the backend API. The client NEVER calls Gemini
 * directly and never sees the API key — every AI call is proxied through
 * server/ (section 9: "Do not directly expose Gemini calls from UI
 * components").
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message: string, public status: number, public code: string) {
    super(message);
  }
}

function getClientId(): string {
  const KEY = "surokkha.clientId";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

interface RequestOptions {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildQueryString(query?: RequestOptions["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}${buildQueryString(options.query)}`;

  const headers: Record<string, string> = { "X-Client-Id": getClientId() };
  let body: BodyInit | undefined;

  if (options.isFormData) {
    body = options.body as FormData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(url, { method: options.method ?? "GET", headers, body });
  } catch {
    throw new ApiError(
      "Couldn't reach the SUROKKHA AI BD server. Check your connection and that the backend is running.",
      0,
      "NETWORK_ERROR"
    );
  }

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.ok) {
    const message = json?.error?.message ?? "Something went wrong on the server.";
    const code = json?.error?.code ?? "UNKNOWN_ERROR";
    throw new ApiError(message, response.status, code);
  }

  return json as T;
}

export { getClientId };
