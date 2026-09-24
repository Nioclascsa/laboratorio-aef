import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TeamEditButton, TeamMemberEditable } from "@/app/components/team-edit-button";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockMember: TeamMemberEditable = {
  id: "test-id-1",
  name: "Dr. Roberto García",
  role: "Profesor",
  bio: "Biólogo vegetal con experiencia en fisiología.",
  email: "roberto.garcia@pucv.cl",
  degrees: "Licenciado en Biología\nDoctor en Botánica",
  photoUrl: "https://example.com/photo.jpg",
  researchLines: "Fisiología vegetal\nEstrés hídrico",
  activeProjects: "FONDECYT 9999",
  courses: "Fisiología Vegetal",
  featuredPubs: "García et al. (2025) Estudio vegetal.",
  orcid: "https://orcid.org/0000-0001-2345-6789",
  researchGate: "https://researchgate.net/profile/Roberto-Garcia",
};

describe("TeamEditButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the edit button with correct accessible name", () => {
    render(<TeamEditButton member={mockMember} />);
    expect(
      screen.getByRole("button", { name: "Editar a Dr. Roberto García" })
    ).toBeInTheDocument();
    expect(screen.getByText("Editar investigador")).toBeInTheDocument();
  });

  it("opens modal and displays pre-populated fields when clicked", () => {
    render(<TeamEditButton member={mockMember} />);
    fireEvent.click(screen.getByRole("button", { name: "Editar a Dr. Roberto García" }));

    expect(screen.getByRole("heading", { name: "Editar investigador" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre completo/i)).toHaveValue("Dr. Roberto García");
    expect(screen.getByLabelText(/Cargo/i)).toHaveValue("Profesor");
    const roleSelect = screen.getByLabelText(/Cargo/i);
    expect(roleSelect).toContainHTML("Investigador");
    expect(roleSelect).toContainHTML("Colaborador externo");
    expect(roleSelect).toContainHTML("Jefe de Laboratorio");
    expect(roleSelect).toContainHTML("Profesor");
    expect(roleSelect).toContainHTML("Alumno");
    expect(screen.getByLabelText(/Correo electrónico/i)).toHaveValue("roberto.garcia@pucv.cl");
    expect(screen.getByLabelText(/Biografía/i)).toHaveValue("Biólogo vegetal con experiencia en fisiología.");
    expect(screen.getByLabelText(/ORCID/i)).toHaveValue("https://orcid.org/0000-0001-2345-6789");
  });

  it("submits updated data to /api/team/[id] with PUT method", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, data: mockMember }),
    } as Response);

    render(<TeamEditButton member={mockMember} />);
    fireEvent.click(screen.getByRole("button", { name: "Editar a Dr. Roberto García" }));

    const nameInput = screen.getByLabelText(/Nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Dr. Roberto García Modificado" } });

    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/team/test-id-1",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });

  it("displays error message if the PUT request fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Error al actualizar integrante." }),
    } as Response);

    render(<TeamEditButton member={mockMember} />);
    fireEvent.click(screen.getByRole("button", { name: "Editar a Dr. Roberto García" }));

    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => {
      expect(screen.getByText("Error al actualizar integrante.")).toBeInTheDocument();
    });
  });

  it("closes modal when Cancelar button is clicked", () => {
    render(<TeamEditButton member={mockMember} />);
    fireEvent.click(screen.getByRole("button", { name: "Editar a Dr. Roberto García" }));
    expect(screen.getByRole("heading", { name: "Editar investigador" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("heading", { name: "Editar investigador" })).not.toBeInTheDocument();
  });
});
