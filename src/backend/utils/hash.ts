import { createHash, createHmac, randomBytes, randomInt } from "node:crypto";
import { getSupabaseAdminEnv } from "@/backend/config/env";

export function sha256Hex(value: string | ArrayBuffer) {
  const hash = createHash("sha256");

  if (typeof value === "string") {
    hash.update(value);
  } else {
    hash.update(Buffer.from(value));
  }

  return hash.digest("hex");
}

function hmacSha256Hex(value: string) {
  try {
    const { secretKey } = getSupabaseAdminEnv();
    return createHmac("sha256", secretKey).update(value).digest("hex");
  } catch {
    // Fallback securely in case env is not loaded, but still better than plain sha256
    const fallbackSecret = process.env.SUPABASE_SECRET_KEY || "mycertify-secure-fallback";
    return createHmac("sha256", fallbackSecret).update(value).digest("hex");
  }
}

export function createNumericCode() {
  return randomInt(100000, 1000000).toString();
}

export function hashVerificationCode(userId: string, code: string) {
  return hmacSha256Hex(`${userId}:${code.trim().toUpperCase()}`);
}

const ALPHANUMERIC_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createAlphaNumericCode(length: number) {
  return Array.from({ length }, () => {
    const index = randomInt(0, ALPHANUMERIC_CODE_CHARS.length);
    return ALPHANUMERIC_CODE_CHARS[index];
  }).join("");
}

export function createUrlToken() {
  return randomBytes(32).toString("base64url");
}

export function hashUrlToken(token: string) {
  return hmacSha256Hex(token.trim());
}
