"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TeamDeleteButtonProps = {
  id: string;
  name: string;
};

export function TeamDeleteButton({ id, name }: TeamDeleteButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error";
    message: string;
  } | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Eliminar a ${name}?`);
    if (!confirmed) {
      return;
    }

    setStatus(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });

      const body = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo eliminar el integrante.");
      }

      router.push("/quienes-somos");
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
    <div className="admin-actions">
      <button type="button" className="danger-button" onClick={handleDelete} disabled={isLoading}>
        {isLoading ? "Eliminando..." : "Eliminar investigador"}
      </button>
      {status ? <p className={`status ${status.type}`}>{status.message}</p> : null}
    </div>
  );
}
