import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SiteHeader } from "@/app/components/site-header";

describe("SiteHeader component", () => {
  it("renders the logo and brand link", () => {
    render(<SiteHeader />);
    const logoLink = screen.getByRole("link", { name: /Ir al inicio/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");

    const logoImg = screen.getByAltText(/Logo Laboratorio de Anatomía y Ecología Funcional de Plantas/i);
    expect(logoImg).toBeInTheDocument();
  });

  it("renders all main navigation links", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Quienes somos" })).toHaveAttribute("href", "/quienes-somos");
    expect(screen.getByRole("link", { name: "Publicaciones" })).toHaveAttribute("href", "/publicaciones");
    expect(screen.getByRole("link", { name: "Noticias" })).toHaveAttribute("href", "/noticias");
    expect(screen.getByRole("link", { name: "Vinculación" })).toHaveAttribute("href", "/vinculacion");
  });

  it("toggles mobile hamburger menu when clicked", () => {
    render(<SiteHeader />);
    const toggleButton = screen.getByRole("button", { name: /Abrir menú/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Cerrar menú/i })).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes mobile menu when a navigation link is clicked", () => {
    render(<SiteHeader />);
    const toggleButton = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    const link = screen.getByRole("link", { name: "Quienes somos" });
    fireEvent.click(link);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders the Instituto de Biologia logo on the right", () => {
    render(<SiteHeader />);
    const instLink = screen.getByRole("link", { name: /Instituto de Biología PUCV/i });
    expect(instLink).toBeInTheDocument();
    expect(instLink).toHaveAttribute("href", "https://www.pucv.cl/uuaa/site/edic/base/port/instituto_de_biologia.html");

    const instImg = screen.getByAltText(/Logo Instituto de Biología PUCV/i);
    expect(instImg).toBeInTheDocument();
  });
});
