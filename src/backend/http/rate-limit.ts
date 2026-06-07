import { NextResponse, type NextRequest } from "next/server";
import { BackendError } from "./errors";

// Simple in-memory rate limiter for mitigating basic brute force attacks
// In a serverless environment (like Vercel), this memory resets on cold starts.
// For production with heavy traffic, a Redis-based limiter is recommended.

type RateLimitCategory = "auth" | "api";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const CATEGORY_LIMITS: Record<RateLimitCategory, number> = {
  auth: 5,   // Strict limit for login/register to prevent brute force
  api: 100,  // Loose limit for standard API calls to prevent DoS
};

export function checkRateLimit(request: Request, category: RateLimitCategory = "api") {
  // Extraemos la IP previniendo spoofing de cabeceras X-Forwarded-For
  let ip = request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  
  if (!ip && forwardedFor) {
    // Proxies seguros suelen sobreescribir o añadir la IP real al final o principio.
    // Tomamos la primera IP de la cadena de forma limpia.
    ip = forwardedFor.split(",")[0].trim();
  }
  
  ip = ip ?? "127.0.0.1";
  const now = Date.now();
  const key = `${category}:${ip}`;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  const limit = CATEGORY_LIMITS[category];

  if (entry.count >= limit) {
    throw new BackendError(
      "Demasiadas peticiones. Intenta de nuevo mas tarde.",
      429,
      "TOO_MANY_REQUESTS"
    );
  }

  entry.count += 1;
}

// Helper to wrap route handlers
export function withRateLimit(
  handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>,
  category: RateLimitCategory = "api"
) {
  return async (req: NextRequest, ...args: unknown[]) => {
    try {
      checkRateLimit(req, category);
    } catch (error) {
      if (error instanceof BackendError && error.statusCode === 429) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        );
      }
      throw error;
    }
    return handler(req, ...args);
  };
}
