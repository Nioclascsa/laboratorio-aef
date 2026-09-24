import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocationSection } from "@/app/components/location-section";

describe("LocationSection component", () => {
  it("renders the heading and address details accurately", () => {
    render(<LocationSection />);
    expect(screen.getByRole("heading", { name: "Donde estamos" })).toBeInTheDocument();
    expect(screen.getByText("Avenida Universidad 330, Valparaíso, Chile")).toBeInTheDocument();
    expect(
      screen.getByText(/Laboratorio BIO 306, tercer piso, Instituto de Biología/i)
    ).toBeInTheDocument();
  });

  it("renders view mode switcher buttons and switches modes", () => {
    render(<LocationSection />);
    const streetViewBtn = screen.getByRole("button", { name: /Street View/i });
    const satelliteBtn = screen.getByRole("button", { name: /Satélite/i });
    const mapBtn = screen.getByRole("button", { name: /Mapa/i });

    expect(streetViewBtn).toBeInTheDocument();
    expect(satelliteBtn).toBeInTheDocument();
    expect(mapBtn).toBeInTheDocument();

    const iframe = screen.getByTitle("Mapa de ubicación - Laboratorio AEF");
    expect(iframe).toHaveAttribute("src", expect.stringContaining("t=m"));

    // Switch to satellite
    fireEvent.click(satelliteBtn);
    expect(iframe).toHaveAttribute("src", expect.stringContaining("t=k"));

    // Switch to street view
    fireEvent.click(streetViewBtn);
    expect(iframe).toHaveAttribute("src", expect.stringContaining("layer=c"));

    // Switch back to standard map
    fireEvent.click(mapBtn);
    expect(iframe).toHaveAttribute("src", expect.stringContaining("t=m"));
  });

  it("renders Google Maps external link and social media links", () => {
    render(<LocationSection />);
    const mapsLink = screen.getByRole("link", { name: /Abrir en Maps/i });
    expect(mapsLink).toHaveAttribute("href", expect.stringContaining("maps/search"));

    const instagramLink = screen.getByLabelText("Instagram del Laboratorio AEF");
    expect(instagramLink).toHaveAttribute("href", "https://www.instagram.com/aefpucv/");

    const fbLink = screen.getByLabelText("Facebook del Laboratorio AEF");
    expect(fbLink).toHaveAttribute("href", "https://facebook.com");

    const ytLink = screen.getByLabelText("YouTube del Laboratorio AEF");
    expect(ytLink).toHaveAttribute("href", "https://youtube.com");
  });
});
