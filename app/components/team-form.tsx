"use client";

import { FormEvent, useState } from "react";

type TeamResponse = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
};

export function TeamForm() {
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
      const response = await fetch("/api/team", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as { error?: string; data?: TeamResponse };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo crear el miembro.");
      }

      setStatus({
        type: "ok",
        message: `Miembro creado: ${body.data?.name}.`,
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
        <label htmlFor="name">Nombre completo</label>
        <input id="name" name="name" placeholder="Ej. Dra. Maria Lopez" required />
      </div>

      <div>
        <label htmlFor="role">Cargo</label>
        <input id="role" name="role" placeholder="Ej. Investigadora principal" required />
      </div>

      <div>
        <label htmlFor="degrees">Grados</label>
        <textarea
          id="degrees"
          name="degrees"
          rows={3}
          placeholder="Ej. Licenciado en Cs. Biologicas, P. Universidad Catolica de Chile\nDr. en Ecologia"
          required
        />
      </div>

      <div>
        <label htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" placeholder="ejemplo@universidad.cl" required />
      </div>

      <div>
        <label htmlFor="bio">Biografia</label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          placeholder="Describe la trayectoria del miembro..."
          required
        />
      </div>

      <div>
        <label htmlFor="photo">Foto</label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Agregar miembro"}
      </button>

      {status ? (
        <p className={`status ${status.type === "ok" ? "ok" : "error"}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
