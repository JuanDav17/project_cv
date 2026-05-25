import { NextResponse, type NextRequest } from "next/server";
import { BackendError } from "./errors";

// Simple in-memory rate limiter for mitigating basic brute force attacks
// In a serverless environment (like Vercel), this memory resets on cold starts.
// For production with heavy traffic, a Redis-based limiter is recommended.

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10; // Max 10 requests per window per IP

export function checkRateLimit(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";
  
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    throw new BackendError(
      "Demasiadas peticiones. Intenta de nuevo mas tarde.",
      429,
      "TOO_MANY_REQUESTS"
    );
  }

  entry.count += 1;
}

// Helper to wrap route handlers
export function withRateLimit(handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: unknown[]) => {
    try {
      checkRateLimit(req);
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
