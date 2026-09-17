"use client";

import { FormEvent, useState } from "react";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "colaboracion", label: "Colaboración" },
  { value: "convenio", label: "Convenio" },
  { value: "evento", label: "Evento" },
];

type OutreachResponse = {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
};

export function OutreachForm() {
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
      const response = await fetch("/api/outreach", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as {
        error?: string;
        data?: OutreachResponse;
      };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo crear la entrada.");
      }

      setStatus({
        type: "ok",
        message: `Entrada creada: ${body.data?.title}.`,
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
        <label htmlFor="outreach-title">Titulo</label>
        <input
          id="outreach-title"
          name="title"
          placeholder="Ej. Convenio con Universidad de Chile"
          required
        />
      </div>

      <div>
        <label htmlFor="outreach-category">Categoria</label>
        <select id="outreach-category" name="category" required>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="outreach-publishedAt">Fecha</label>
        <input
          id="outreach-publishedAt"
          name="publishedAt"
          type="date"
          required
        />
      </div>

      <div>
        <label htmlFor="outreach-body">Descripcion</label>
        <textarea
          id="outreach-body"
          name="body"
          rows={5}
          placeholder="Describe la actividad de vinculacion..."
          required
        />
      </div>

      <div>
        <label htmlFor="outreach-image">Imagen (opcional)</label>
        <input
          id="outreach-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Publicando..." : "Publicar entrada"}
      </button>

      {status ? (
        <p className={`status ${status.type === "ok" ? "ok" : "error"}`}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
