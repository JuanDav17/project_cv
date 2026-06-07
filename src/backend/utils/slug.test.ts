import { describe, expect, it } from "vitest";

import { publicNameFromProfile, slugify, splitFullName } from "./slug";

describe("slug utilities", () => {
  it("creates URL-safe public slugs", () => {
    expect(slugify("Maria Garcia DevOps")).toBe("maria-garcia-devops");
    expect(slugify("  React & Cloud  ")).toBe("react-cloud");
    expect(slugify("")).toBe("usuario");
  });

  it("splits full names with sensible defaults", () => {
    expect(splitFullName("Maria Alejandra Garcia")).toEqual({
      nombres: "Maria Alejandra",
      apellidos: "Garcia",
    });
    expect(splitFullName("Maria")).toEqual({
      nombres: "Maria",
      apellidos: "MyCertify",
    });
  });

  it("builds public display names from profile fields", () => {
    expect(
      publicNameFromProfile({ nombres: "Maria", apellidos: "Garcia" }),
    ).toBe("Maria Garcia");
    expect(publicNameFromProfile({ nombres: "Maria", apellidos: null })).toBe(
      "Maria",
    );
  });
});
