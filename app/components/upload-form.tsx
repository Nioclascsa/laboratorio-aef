"use client";

import { FormEvent, useState } from "react";

type UploadResponse = {
  id: string;
  title: string;
  authors: string;
  originalName: string;
  size: number;
  uploadedAt: string;
};

export function UploadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "ok" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsLoading(true);
    try {
      const response = await fetch("/api/papers", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as { error?: string; data?: UploadResponse };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo subir el archivo.");
      }

      const sizeMb = ((body.data?.size || 0) / (1024 * 1024)).toFixed(2);
      setStatus({
        type: "ok",
        message: `Paper cargado: ${body.data?.title} (${sizeMb} MB).`,
      });
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrio un error inesperado durante la carga.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Titulo del paper</label>
        <input id="title" name="title" placeholder="Ej. Analisis de microbiota de suelo" required />
      </div>

      <div>
        <label htmlFor="authors">Autores</label>
        <input id="authors" name="authors" placeholder="Ej. Perez, Gomez, Ruiz" required />
      </div>

      <div>
        <label htmlFor="summary">Resumen breve (opcional)</label>
        <textarea id="summary" name="summary" rows={3} placeholder="Describe el aporte principal..." />
      </div>

      <div>
        <label htmlFor="paper">Archivo PDF</label>
        <input id="paper" name="paper" type="file" accept="application/pdf" required />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Subiendo..." : "Subir paper"}
      </button>

      {status ? (
        <p className={`status ${status.type === "ok" ? "ok" : "error"}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
