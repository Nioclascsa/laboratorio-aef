"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PaperDeleteButtonProps = {
  id: string;
  title: string;
};

export function PaperDeleteButton({ id, title }: PaperDeleteButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error";
    message: string;
  } | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Eliminar la publicación "${title}"?`);
    if (!confirmed) {
      return;
    }

    setStatus(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/papers/${id}`, {
        method: "DELETE",
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo eliminar la publicación.");
      }

      router.push("/publicaciones");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrio un error inesperado durante la eliminacion.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Eliminar publicación"
        onClick={handleDelete}
        disabled={isLoading}
        className="w-full text-center bg-red-500/90 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        {isLoading ? "Eliminando..." : "Eliminar"}
      </button>
      {status ? (
        <p className="text-red-600 text-xs mt-2 text-center font-medium">
          {status.message}
        </p>
      ) : null}
    </>
  );
}
