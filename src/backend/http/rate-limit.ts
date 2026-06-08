import { createHash } from "node:crypto";

import { getUpstashRedisEnv } from "@/backend/config/env";

import { BackendError } from "./errors";

type RateLimitCategory = "auth" | "api";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type LoginFailureEntry = {
  count: number;
  resetAt: number;
  lockedUntil?: number;
};

const rateStore = new Map<string, RateLimitEntry>();
const loginFailureStore = new Map<string, LoginFailureEntry>();

const RATE_WINDOW_SECONDS = 15 * 60;
const RATE_WINDOW_MS = RATE_WINDOW_SECONDS * 1000;
const LOGIN_LOCK_SECONDS = 30 * 60;
const LOGIN_LOCK_MS = LOGIN_LOCK_SECONDS * 1000;
const MAX_LOGIN_ATTEMPTS = 4;

const CATEGORY_LIMITS: Record<RateLimitCategory, number> = {
  auth: 40,
  api: 300,
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function identityKey(value: string) {
  return sha256(value.trim().toLowerCase());
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return realIp ?? forwardedFor?.split(",")[0].trim() ?? "127.0.0.1";
}

async function redisCommand<T>(command: unknown[]): Promise<T | null> {
  const env = getUpstashRedisEnv();

  if (!env) {
    return null;
  }

  const response = await fetch(env.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    result?: T;
    error?: string;
  };

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Upstash Redis request failed.");
  }

  return payload.result ?? null;
}

async function redisAvailable() {
  return Boolean(getUpstashRedisEnv());
}

export async function checkRateLimit(
  request: Request,
  category: RateLimitCategory = "api",
  identifier?: string,
) {
  const ip = getClientIp(request);
  const limit = CATEGORY_LIMITS[category];
  const keyIdentity = identifier ? `${ip}:${identityKey(identifier)}` : ip;
  const key = `mycertify:rate:${category}:${identityKey(keyIdentity)}`;

  if (await redisAvailable()) {
    try {
      const count = Number(await redisCommand<number>(["INCR", key]));

      if (count === 1) {
        await redisCommand(["EXPIRE", key, RATE_WINDOW_SECONDS]);
      }

      if (count > limit) {
        throw new BackendError(
          "Demasiadas peticiones. Intenta de nuevo mas tarde.",
          429,
          "TOO_MANY_REQUESTS",
        );
      }

      return;
    } catch (error) {
      if (error instanceof BackendError) {
        throw error;
      }
    }
  }

  const now = Date.now();
  const entry = rateStore.get(key);

  if (!entry || entry.resetAt < now) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }

  if (entry.count >= limit) {
    throw new BackendError(
      "Demasiadas peticiones. Intenta de nuevo mas tarde.",
      429,
      "TOO_MANY_REQUESTS",
    );
  }

  entry.count += 1;
}

function loginKey(email: string) {
  return `mycertify:login:${identityKey(email)}`;
}

function loginBlockedError(lockedUntil: number) {
  throw new BackendError(
    "Por medio de seguridad hemos bloqueado tu cuenta por 30 minutos.",
    429,
    "ACCOUNT_TEMPORARILY_LOCKED",
    {
      lockedUntil: new Date(lockedUntil).toISOString(),
    },
  );
}

export async function assertLoginNotLocked(email: string) {
  const lockKey = `${loginKey(email)}:locked`;

  if (await redisAvailable()) {
    try {
      const lockedUntil = Number(await redisCommand<string | number>(["GET", lockKey]));

      if (lockedUntil && lockedUntil > Date.now()) {
        loginBlockedError(lockedUntil);
      }

      return;
    } catch (error) {
      if (error instanceof BackendError) {
        throw error;
      }
    }
  }

  const entry = loginFailureStore.get(loginKey(email));

  if (entry?.lockedUntil && entry.lockedUntil > Date.now()) {
    loginBlockedError(entry.lockedUntil);
  }
}

export async function recordFailedLogin(email: string) {
  const baseKey = loginKey(email);
  const attemptsKey = `${baseKey}:attempts`;
  const lockKey = `${baseKey}:locked`;

  if (await redisAvailable()) {
    try {
      const count = Number(await redisCommand<number>(["INCR", attemptsKey]));

      if (count === 1) {
        await redisCommand(["EXPIRE", attemptsKey, LOGIN_LOCK_SECONDS]);
      }

      if (count >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = Date.now() + LOGIN_LOCK_MS;
        await redisCommand(["SET", lockKey, String(lockedUntil), "EX", LOGIN_LOCK_SECONDS]);
        await redisCommand(["DEL", attemptsKey]);
        loginBlockedError(lockedUntil);
      }

      return {
        remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - count),
      };
    } catch (error) {
      if (error instanceof BackendError) {
        throw error;
      }
    }
  }

  const now = Date.now();
  const current = loginFailureStore.get(baseKey);
  const entry =
    !current || current.resetAt < now
      ? { count: 0, resetAt: now + LOGIN_LOCK_MS }
      : current;

  entry.count += 1;

  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    entry.lockedUntil = now + LOGIN_LOCK_MS;
    loginFailureStore.set(baseKey, entry);
    loginBlockedError(entry.lockedUntil);
  }

  loginFailureStore.set(baseKey, entry);

  return {
    remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - entry.count),
  };
}

export async function clearLoginFailures(email: string) {
  const baseKey = loginKey(email);

  if (await redisAvailable()) {
    try {
      await redisCommand(["DEL", `${baseKey}:attempts`, `${baseKey}:locked`]);
      return;
    } catch {
      // Local fallback below still clears this instance.
    }
  }

  loginFailureStore.delete(baseKey);
}
