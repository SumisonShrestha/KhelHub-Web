const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ApiResponse<T> {
  status: number;
  data: T;
  success: boolean;
  message: string;
}

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${BASE_URL}${path}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { headers: optionHeaders, ...restOptions } = options;

  const res = await fetch(buildUrl(path), {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...optionHeaders,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Something went wrong");
  }

  return json;
}

export const api = {
  post: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    }),

  get: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: "GET", headers }),
};