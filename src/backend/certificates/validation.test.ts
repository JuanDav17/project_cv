import { describe, expect, it } from "vitest";

import {
  getHoursRange,
  parseOptionalHexColor,
  parseOptionalIssueDate,
  parsePositiveInteger,
  parseVisibility,
  validatePdfFile,
} from "./validation";

function makePdfFile(parts: BlobPart[], options?: FilePropertyBag) {
  return new File(parts, "certificado.pdf", {
    type: "application/pdf",
    ...options,
  });
}

describe("certificate validation", () => {
  it("maps hours to the configured ranges", () => {
    expect(getHoursRange(3)).toBe("3-39");
    expect(getHoursRange(40)).toBe("40-90");
    expect(getHoursRange(90)).toBe("+90");
  });

  it("parses required positive integer fields", () => {
    expect(parsePositiveInteger("12", "Horas")).toBe(12);
    expect(() => parsePositiveInteger("0", "Horas")).toThrow(
      "Horas debe ser un numero entero positivo.",
    );
  });

  it("normalizes visibility with public as the default", () => {
    expect(parseVisibility("privado")).toBe("privado");
    expect(parseVisibility("publico")).toBe("publico");
    expect(parseVisibility(null)).toBe("publico");
  });

  it("validates optional issue dates", () => {
    expect(parseOptionalIssueDate("2026-05-24")).toBe("2026-05-24");
    expect(parseOptionalIssueDate("")).toBeNull();
    expect(() => parseOptionalIssueDate("24/05/2026")).toThrow(
      "La fecha de emision debe tener formato YYYY-MM-DD.",
    );
  });

  it("rejects future issue dates", () => {
    const future = new Date(Date.now() + 48 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    expect(() => parseOptionalIssueDate(future)).toThrow(
      "La fecha de emision no puede estar en el futuro.",
    );
  });

  it("validates optional hex colors", () => {
    expect(parseOptionalHexColor("#4f46e5")).toBe("#4f46e5");
    expect(parseOptionalHexColor("")).toBeNull();
    expect(() => parseOptionalHexColor("blue")).toThrow(
      "El color debe ser un hexadecimal valido.",
    );
  });

  it("accepts PDFs with a valid header and size", async () => {
    const file = makePdfFile([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])]);

    await expect(validatePdfFile(file)).resolves.toMatchObject({ file });
  });

  it("rejects files that only pretend to be PDFs", async () => {
    const file = makePdfFile([new Uint8Array([0x50, 0x4b, 0x03, 0x04])]);

    await expect(validatePdfFile(file)).rejects.toThrow(
      "El archivo no es un PDF valido.",
    );
  });
});
