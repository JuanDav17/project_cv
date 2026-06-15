type LegalSearchParams = {
  from?: string | string[];
};

export type LegalPageProps = {
  searchParams?: Promise<LegalSearchParams>;
};

function safeReturnHref(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (typeof raw !== "string" || !raw.trim()) {
    return "/";
  }

  let decoded = raw.trim();

  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return "/";
  }

  if (decoded.startsWith("//") || !decoded.startsWith("/")) {
    return "/";
  }

  if (decoded.startsWith("/") || decoded.startsWith("/u/")) {
    return decoded;
  }

  return "/";
}

export async function resolveLegalReturnHref(
  searchParams: LegalPageProps["searchParams"],
) {
  const params = searchParams ? await searchParams : undefined;

  return safeReturnHref(params?.from);
}
