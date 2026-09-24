"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type PaperEditFormProps = {
  id: string;
  initialTitle: string;
  initialAuthors: string;
  initialJournal: string;
  initialPublicationDate: string;
  initialSummary: string;
};

export function PaperEditForm({
  id,
  initialTitle,
  initialAuthors,
  initialJournal,
  initialPublicationDate,
  initialSummary,
}: PaperEditFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "ok" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: formData.get("title") as string,
      authors: formData.get("authors") as string,
      journal: formData.get("journal") as string,
      publicationDate: formData.get("publicationDate") as string,
      summary: formData.get("summary") as string,
    };

    try {
      const response = await fetch(`/api/papers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo actualizar la publicación.");
      }

      setStatus({ type: "ok", message: "Publicación actualizada." });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrio un error inesperado.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <>
        <button
          type="button"
          aria-label="Editar publicación"
          onClick={() => {
            setIsOpen(true);
            setStatus(null);
          }}
          className="w-full text-center bg-amber-500/90 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Editar
        </button>
        {status ? (
          <p
            className={`text-xs mt-2 text-center font-medium ${
              status.type === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#d8ddd9] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d8ddd9]">
            <h3 className="text-xl font-heading font-bold text-[#28282b]">
              Editar publicación
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-[#f5f7f5] hover:bg-[#e2e6e3] flex items-center justify-center text-[#5a5a60] hover:text-[#28282b] transition-colors"
              aria-label="Cerrar editor"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor={`edit-title-${id}`}
                className="text-sm font-bold text-[#3a3a40] block"
              >
                Título
              </label>
              <input
                id={`edit-title-${id}`}
                name="title"
                defaultValue={initialTitle}
                required
                className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={`edit-authors-${id}`}
                className="text-sm font-bold text-[#3a3a40] block"
              >
                Autores
              </label>
              <input
                id={`edit-authors-${id}`}
                name="authors"
                defaultValue={initialAuthors}
                required
                className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={`edit-journal-${id}`}
                className="text-sm font-bold text-[#3a3a40] block"
              >
                Revista
              </label>
              <input
                id={`edit-journal-${id}`}
                name="journal"
                defaultValue={initialJournal}
                className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={`edit-date-${id}`}
                className="text-sm font-bold text-[#3a3a40] block"
              >
                Fecha de publicación
              </label>
              <input
                id={`edit-date-${id}`}
                name="publicationDate"
                type="date"
                defaultValue={initialPublicationDate}
                className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={`edit-summary-${id}`}
                className="text-sm font-bold text-[#3a3a40] block"
              >
                Resumen (opcional)
              </label>
              <textarea
                id={`edit-summary-${id}`}
                name="summary"
                rows={3}
                defaultValue={initialSummary}
                className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] resize-none"
              />
            </div>

            {status ? (
              <p
                className={`text-sm font-medium ${
                  status.type === "ok" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.message}
              </p>
            ) : null}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#1c6576] hover:bg-[#145562] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 bg-[#f5f7f5] hover:bg-[#e2e6e3] text-[#3a3a40] px-5 py-3 rounded-xl font-bold transition-all border border-[#d0d5d1]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
