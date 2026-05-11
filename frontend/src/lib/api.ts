const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Make sure the backend is running.");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));

    if (typeof error.detail === "string") {
      throw new Error(error.detail);
    }

    if (error.detail?.compatibility_errors?.length) {
      throw new Error(error.detail.compatibility_errors.join(", "));
    }

    throw new Error(`HTTP ${res.status}`);
  }


  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || BASE_URL;

export async function apiFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
    });
  } catch {
    throw new Error(
      `Could not connect to the backend at ${API_URL}. Make sure the FastAPI server is running.`
    );
  }

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}