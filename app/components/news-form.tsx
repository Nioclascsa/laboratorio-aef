"use client";

import { FormEvent, useState } from "react";

type NewsResponse = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  imageUrl?: string | null;
};

export function NewsForm() {
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
      const response = await fetch("/api/news", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as { error?: string; data?: NewsResponse };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo crear la noticia.");
      }

      setStatus({
        type: "ok",
        message: `Noticia creada: ${body.data?.title}.`,
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
        <label htmlFor="title">Titulo</label>
        <input id="title" name="title" placeholder="Ej. Nueva expedicion en Patagonia" required />
      </div>

      <div>
        <label htmlFor="publishedAt">Fecha</label>
        <input id="publishedAt" name="publishedAt" type="date" required />
      </div>

      <div>
        <label htmlFor="body">Texto</label>
        <textarea
          id="body"
          name="body"
          rows={5}
          placeholder="Describe la noticia..."
          required
        />
      </div>

      <div>
        <label htmlFor="image">Imagen (opcional)</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Publicando..." : "Publicar noticia"}
      </button>

      {status ? (
        <p className={`status ${status.type === "ok" ? "ok" : "error"}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
