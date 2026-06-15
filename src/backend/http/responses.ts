import { NextResponse } from "next/server";

import { BackendError, isBackendError } from "./errors";

type RouteHandler<T> = () => Promise<T>;

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function empty(status = 204) {
  return new NextResponse(null, { status });
}

export function fail(error: unknown) {
  // Siempre hacemos log del error en la consola para poder debuggear el error 500
  console.error("🚨 API Route Error:", error);
  
  const backendError = isBackendError(error)
    ? error
    : new BackendError("Ocurrio un error inesperado.", 500, "UNEXPECTED_ERROR");

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: backendError.code,
        message: backendError.message,
        details: backendError.details,
      },
    },
    { status: backendError.statusCode },
  );
}

export async function handleRoute<T>(handler: RouteHandler<T>) {
  try {
    const response = await handler();

    if (response instanceof Response) {
      return response;
    }

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}

