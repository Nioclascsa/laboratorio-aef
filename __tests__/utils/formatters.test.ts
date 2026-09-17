import { describe, it, expect } from "vitest";

// Formatter utility test
function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function isAllowedImageName(name: string): boolean {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const lower = name.toLowerCase();
  return allowedExtensions.some((ext) => lower.endsWith(ext));
}

describe("Utility functions", () => {
  describe("formatDate", () => {
    it("formats dates into Chilean Spanish locale correctly", () => {
      const date = new Date(2026, 7, 23); // August 23, 2026
      const formatted = formatDate(date);
      expect(formatted).toContain("23");
      expect(formatted).toContain("agosto");
      expect(formatted).toContain("2026");
    });
  });

  describe("parseLines", () => {
    it("splits multiline strings and removes empty lines / whitespace", () => {
      const multiline = "  Ecología vegetal  \n\n  Restauración de turberas\n  \nBotánica  ";
      const result = parseLines(multiline);
      expect(result).toEqual([
        "Ecología vegetal",
        "Restauración de turberas",
        "Botánica",
      ]);
    });

    it("returns empty array for empty string", () => {
      expect(parseLines("")).toEqual([]);
      expect(parseLines("   \n   \n ")).toEqual([]);
    });
  });

  describe("isAllowedImageName", () => {
    it("accepts valid image extensions in lowercase and uppercase", () => {
      expect(isAllowedImageName("foto.jpg")).toBe(true);
      expect(isAllowedImageName("foto.JPEG")).toBe(true);
      expect(isAllowedImageName("imagen.png")).toBe(true);
      expect(isAllowedImageName("perfil.webp")).toBe(true);
    });

    it("rejects non-image files or dangerous extensions", () => {
      expect(isAllowedImageName("documento.pdf")).toBe(false);
      expect(isAllowedImageName("script.exe")).toBe(false);
      expect(isAllowedImageName("archivo.txt")).toBe(false);
    });
  });
});
