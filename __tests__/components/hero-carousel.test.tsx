import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { HeroCarousel } from "@/app/components/hero-carousel";

describe("HeroCarousel component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders main titles and call-to-action buttons", () => {
    render(<HeroCarousel />);
    expect(screen.getByText("Centro de investigación biológica")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Laboratorio Científico de Biología Aplicada" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nuestro Proyecto" })).toHaveAttribute("href", "/proyecto");
    expect(screen.getByRole("link", { name: "Publicaciones" })).toHaveAttribute("href", "/publicaciones");
  });

  it("renders tab controls for all slides", () => {
    render(<HeroCarousel />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
  });

  it("changes active slide when clicking tab buttons", () => {
    render(<HeroCarousel />);
    const tabs = screen.getAllByRole("tab");

    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");

    fireEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("automatically advances slides on interval timer", () => {
    render(<HeroCarousel />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(tabs[1]).toHaveAttribute("aria-selected", "true");

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(tabs[2]).toHaveAttribute("aria-selected", "true");

    // Loop back to 0
    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});
