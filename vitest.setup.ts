import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    priority,
    className,
    sizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    sizes?: string;
    [key: string]: unknown;
  }) => {
    return React.createElement("img", {
      src: typeof src === "object" ? (src as { src: string }).src : src,
      alt,
      className,
      "data-fill": fill ? "true" : undefined,
      "data-priority": priority ? "true" : undefined,
      ...props,
    });
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
