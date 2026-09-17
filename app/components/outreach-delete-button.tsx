"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OutreachDeleteButtonProps = {
  id: string;
  title: string;
};

export function OutreachDeleteButton({ id, title }: OutreachDeleteButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error";
    message: string;
  } | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Eliminar la entrada "${title}"?`);
    if (!confirmed) {
      return;
    }

    setStatus(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/outreach/${id}`, {
        method: "DELETE",
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo eliminar la entrada.");
      }

      router.push("/vinculacion");
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
      <button
        type="button"
        className="danger-button"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Eliminando..." : "Eliminar entrada"}
      </button>
      {status ? (
        <p className={`status ${status.type}`}>{status.message}</p>
      ) : null}
    </div>
  );
}
