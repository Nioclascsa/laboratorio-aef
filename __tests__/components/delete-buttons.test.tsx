import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TeamDeleteButton } from "@/app/components/team-delete-button";
import { NewsDeleteButton } from "@/app/components/news-delete-button";
import { OutreachDeleteButton } from "@/app/components/outreach-delete-button";

describe("Admin Delete Buttons", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("TeamDeleteButton", () => {
    it("renders the delete button", () => {
      render(<TeamDeleteButton id="123" name="Investigador Test" />);
      expect(
        screen.getByRole("button", { name: "Eliminar investigador" })
      ).toBeInTheDocument();
    });

    it("cancels deletion when window.confirm returns false", () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);
      globalThis.fetch = vi.fn();

      render(<TeamDeleteButton id="123" name="Investigador Test" />);
      fireEvent.click(screen.getByRole("button", { name: "Eliminar investigador" }));

      expect(window.confirm).toHaveBeenCalledWith("Eliminar a Investigador Test?");
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it("calls API when confirmation is accepted", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response);

      render(<TeamDeleteButton id="123" name="Investigador Test" />);
      await fireEvent.click(screen.getByRole("button", { name: "Eliminar investigador" }));

      expect(globalThis.fetch).toHaveBeenCalledWith("/api/team/123", {
        method: "DELETE",
      });
    });

    it("displays error message when delete fails", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Error en servidor" }),
      } as Response);

      render(<TeamDeleteButton id="123" name="Investigador Test" />);
      await fireEvent.click(screen.getByRole("button", { name: "Eliminar investigador" }));

      await waitFor(() => {
        expect(screen.getByText("Error en servidor")).toBeInTheDocument();
      });
    });
  });

  describe("NewsDeleteButton", () => {
    it("renders news delete button and responds to confirm", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response);

      render(<NewsDeleteButton id="news-1" title="Noticia Test" />);
      const btn = screen.getByRole("button", { name: "Eliminar noticia" });
      expect(btn).toBeInTheDocument();

      await fireEvent.click(btn);
      expect(window.confirm).toHaveBeenCalledWith('Eliminar la noticia "Noticia Test"?');
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/news/news-1", {
        method: "DELETE",
      });
    });
  });

  describe("OutreachDeleteButton", () => {
    it("renders outreach delete button and responds to confirm", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response);

      render(<OutreachDeleteButton id="outreach-1" title="Taller Test" />);
      const btn = screen.getByRole("button", { name: "Eliminar entrada" });
      expect(btn).toBeInTheDocument();

      await fireEvent.click(btn);
      expect(window.confirm).toHaveBeenCalledWith('Eliminar la entrada "Taller Test"?');
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/outreach/outreach-1", {
        method: "DELETE",
      });
    });
  });
});
