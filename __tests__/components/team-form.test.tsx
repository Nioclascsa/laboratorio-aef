import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TeamForm } from "@/app/components/team-form";

describe("TeamForm component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all required and optional profile fields", () => {
    render(<TeamForm />);

    // Required fields
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Grados/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Biografia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Foto/i)).toBeInTheDocument();

    // New academic profile optional fields
    expect(screen.getByLabelText(/Líneas de investigación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Proyectos activos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Asignaturas impartidas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Publicaciones destacadas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ORCID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ResearchGate/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Agregar miembro" })).toBeInTheDocument();
  });

  it("handles successful form submission", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: "1",
          name: "Dr. Cristian Atala",
          role: "Jefe de Laboratorio",
        },
      }),
    } as Response);

    render(<TeamForm />);

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: "Dr. Cristian Atala" },
    });
    fireEvent.change(screen.getByLabelText(/Cargo/i), {
      target: { value: "Jefe de Laboratorio" },
    });
    fireEvent.change(screen.getByLabelText(/Grados/i), {
      target: { value: "Dr. en Ciencias" },
    });
    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "cristian.atala@pucv.cl" },
    });
    fireEvent.change(screen.getByLabelText(/Biografia/i), {
      target: { value: "Investigador principal" },
    });

    const form = screen.getByRole("button", { name: "Agregar miembro" }).closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Miembro creado: Dr. Cristian Atala/i)).toBeInTheDocument();
    });
  });

  it("handles submission error from API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "El correo no es valido.",
      }),
    } as Response);

    render(<TeamForm />);

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: "Tester" },
    });

    const form = screen.getByRole("button", { name: "Agregar miembro" }).closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("El correo no es valido.")).toBeInTheDocument();
    });
  });
});
