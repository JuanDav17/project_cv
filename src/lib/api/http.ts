type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure = {
  ok: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok) {
    const failure = payload as ApiFailure;

    throw new ApiError(
      failure.error?.message ?? "No se pudo completar la solicitud.",
      response.status,
      failure.error?.code,
      failure.error?.details,
    );
  }

  if (!payload.ok) {
    throw new ApiError(
      payload.error?.message ?? "No se pudo completar la solicitud.",
      response.status,
      payload.error?.code,
      payload.error?.details,
    );
  }

  return payload.data;
}
