import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaperDeleteButton } from "@/app/components/paper-delete-button";
import { PaperEditForm } from "@/app/components/paper-edit-form";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("Paper management buttons", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("PaperDeleteButton", () => {
    it("renders the delete button", () => {
      render(<PaperDeleteButton id="paper-1" title="Paper Test" />);
      expect(
        screen.getByRole("button", { name: "Eliminar publicación" })
      ).toBeInTheDocument();
    });

    it("cancels deletion when confirm is rejected", () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);
      globalThis.fetch = vi.fn();

      render(<PaperDeleteButton id="paper-1" title="Paper Test" />);
      fireEvent.click(
        screen.getByRole("button", { name: "Eliminar publicación" })
      );

      expect(window.confirm).toHaveBeenCalledWith(
        'Eliminar la publicación "Paper Test"?'
      );
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it("calls DELETE API when confirmation is accepted", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response);

      render(<PaperDeleteButton id="paper-1" title="Paper Test" />);
      await fireEvent.click(
        screen.getByRole("button", { name: "Eliminar publicación" })
      );

      expect(globalThis.fetch).toHaveBeenCalledWith("/api/papers/paper-1", {
        method: "DELETE",
      });
    });

    it("shows error message when deletion fails", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Error en servidor" }),
      } as Response);

      render(<PaperDeleteButton id="paper-1" title="Paper Test" />);
      await fireEvent.click(
        screen.getByRole("button", { name: "Eliminar publicación" })
      );

      await waitFor(() => {
        expect(screen.getByText("Error en servidor")).toBeInTheDocument();
      });
    });
  });

  describe("PaperEditForm", () => {
    const defaultProps = {
      id: "paper-1",
      initialTitle: "Mi Paper",
      initialAuthors: "Pérez, García",
      initialJournal: "Nature",
      initialPublicationDate: "2026-01-15",
      initialSummary: "Un resumen del paper.",
    };

    it("renders the edit button", () => {
      render(<PaperEditForm {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Editar publicación" })
      ).toBeInTheDocument();
    });

    it("opens modal with pre-filled form when edit button is clicked", () => {
      render(<PaperEditForm {...defaultProps} />);
      fireEvent.click(
        screen.getByRole("button", { name: "Editar publicación" })
      );

      expect(
        screen.getByRole("heading", { name: "Editar publicación" })
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Título")).toHaveValue("Mi Paper");
      expect(screen.getByLabelText("Autores")).toHaveValue("Pérez, García");
      expect(screen.getByLabelText("Revista")).toHaveValue("Nature");
      expect(screen.getByLabelText("Fecha de publicación")).toHaveValue(
        "2026-01-15"
      );
      expect(screen.getByLabelText("Resumen (opcional)")).toHaveValue(
        "Un resumen del paper."
      );
    });

    it("closes modal when cancel is clicked", () => {
      render(<PaperEditForm {...defaultProps} />);
      fireEvent.click(
        screen.getByRole("button", { name: "Editar publicación" })
      );

      expect(
        screen.getByRole("heading", { name: "Editar publicación" })
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(
        screen.queryByRole("heading", { name: "Editar publicación" })
      ).not.toBeInTheDocument();
    });

    it("sends PUT request on form submission", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: {} }),
      } as Response);

      render(<PaperEditForm {...defaultProps} />);
      fireEvent.click(
        screen.getByRole("button", { name: "Editar publicación" })
      );

      fireEvent.submit(
        screen.getByRole("button", { name: "Guardar cambios" })
      );

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith(
          "/api/papers/paper-1",
          expect.objectContaining({
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          })
        );
      });
    });
  });
});
