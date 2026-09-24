"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import Image from "next/image";

export type TeamMemberEditable = {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  degrees: string;
  photoUrl: string;
  researchLines?: string;
  activeProjects?: string;
  courses?: string;
  featuredPubs?: string;
  orcid?: string;
  researchGate?: string;
};

type TeamEditButtonProps = {
  member: TeamMemberEditable;
};

export function TeamEditButton({ member }: TeamEditButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "ok" | "error";
    message: string;
  } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen && !isLoading) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`/api/team/${member.id}`, {
        method: "PUT",
        body: formData,
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "No se pudo actualizar el integrante.");
      }

      setStatus({ type: "ok", message: "Integrante actualizado correctamente." });
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al actualizar.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStatus(null);
          setPhotoPreview(null);
        }}
        className="inline-flex items-center gap-2 border-2 border-[#1c6576] bg-[#1c6576] hover:bg-[#145562] hover:border-[#145562] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
        aria-label={`Editar a ${member.name}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Editar investigador
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-member-title"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-[#d8ddd9] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8ddd9] bg-[#f8faf8]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1c6576]/10 flex items-center justify-center text-[#1c6576]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 id="edit-member-title" className="text-xl font-heading font-bold text-[#28282b]">
                    Editar investigador
                  </h3>
                  <p className="text-xs text-[#5a5a60]">Modifica la información del perfil de {member.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isLoading && setIsOpen(false)}
                disabled={isLoading}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#e2e6e3] flex items-center justify-center text-[#5a5a60] hover:text-[#28282b] transition-colors border border-[#d8ddd9] cursor-pointer"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
              {/* Nombre y Cargo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="edit-name" className="text-sm font-bold text-[#3a3a40] block">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    defaultValue={member.name}
                    required
                    className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="edit-role" className="text-sm font-bold text-[#3a3a40] block">
                    Cargo <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-role"
                    name="role"
                    defaultValue={member.role}
                    required
                    className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm"
                  >
                    <option value="Jefe de Laboratorio">Jefe de Laboratorio</option>
                    <option value="Profesor">Profesor</option>
                    <option value="Alumno">Alumno</option>
                  </select>
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-1.5">
                <label htmlFor="edit-email" className="text-sm font-bold text-[#3a3a40] block">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={member.email}
                  required
                  className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm"
                />
              </div>

              {/* Grados */}
              <div className="space-y-1.5">
                <label htmlFor="edit-degrees" className="text-sm font-bold text-[#3a3a40] block">
                  Grados académicos (un grado por línea) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-degrees"
                  name="degrees"
                  rows={3}
                  defaultValue={member.degrees}
                  required
                  placeholder="Licenciado en Cs. Biológicas&#10;Dr. en Ciencias"
                  className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm resize-none"
                />
              </div>

              {/* Biografía */}
              <div className="space-y-1.5">
                <label htmlFor="edit-bio" className="text-sm font-bold text-[#3a3a40] block">
                  Biografía <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-bio"
                  name="bio"
                  rows={4}
                  defaultValue={member.bio}
                  required
                  className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm resize-none"
                />
              </div>

              {/* Foto actual y reemplazo */}
              <div className="space-y-2 p-4 bg-[#f8faf8] rounded-2xl border border-[#d8ddd9]">
                <label className="text-sm font-bold text-[#3a3a40] block">
                  Foto de perfil
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#dce8ea] border border-[#d0d5d1] flex-shrink-0">
                    <Image
                      src={photoPreview || member.photoUrl}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      id="edit-photo"
                      name="photo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhotoChange}
                      className="block w-full text-xs text-[#5a5a60] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1c6576] file:text-white hover:file:bg-[#145562] file:cursor-pointer"
                    />
                    <p className="text-xs text-[#727278]">
                      Opcional. Deja este campo vacío si deseas mantener la foto actual.
                    </p>
                  </div>
                </div>
              </div>

              {/* Líneas de investigación */}
              <div className="space-y-1.5">
                <label htmlFor="edit-researchLines" className="text-sm font-bold text-[#3a3a40] block">
                  Líneas de investigación (opcional, una por línea)
                </label>
                <textarea
                  id="edit-researchLines"
                  name="researchLines"
                  rows={3}
                  defaultValue={member.researchLines || ""}
                  placeholder="Ecología funcional de plantas&#10;Interacciones planta-microorganismos"
                  className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm resize-none"
                />
              </div>

              {/* Proyectos activos */}
              <div className="space-y-1.5">
                <label htmlFor="edit-activeProjects" className="text-sm font-bold text-[#3a3a40] block">
                  Proyectos activos (opcional, uno por línea)
                </label>
                <textarea
                  id="edit-activeProjects"
                  name="activeProjects"
                  rows={3}
                  defaultValue={member.activeProjects || ""}
                  placeholder="FONDECYT Regular 1234567&#10;Proyecto de restauración ecológica"
                  className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm resize-none"
                />
              </div>

              {/* Asignaturas impartidas */}
              <div className="space-y-1.5">
                <label htmlFor="edit-courses" className="text-sm font-bold text-[#3a3a40] block">
                  Asignaturas impartidas (opcional, una por línea)
                </label>
                <textarea
                  id="edit-courses"
                  name="courses"
                  rows={3}
                  defaultValue={member.courses || ""}
                  placeholder="Botánica General&#10;Ecología Vegetal"
                  className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm resize-none"
                />
              </div>

              {/* Publicaciones destacadas */}
              <div className="space-y-1.5">
                <label htmlFor="edit-featuredPubs" className="text-sm font-bold text-[#3a3a40] block">
                  Publicaciones destacadas (opcional, 2-3 máximo)
                </label>
                <textarea
                  id="edit-featuredPubs"
                  name="featuredPubs"
                  rows={3}
                  defaultValue={member.featuredPubs || ""}
                  placeholder="Atala et al. (2024) Título del artículo. Revista, Vol."
                  className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm resize-none"
                />
              </div>

              {/* Enlaces académicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="edit-orcid" className="text-sm font-bold text-[#3a3a40] block">
                    ORCID (opcional)
                  </label>
                  <input
                    id="edit-orcid"
                    name="orcid"
                    type="url"
                    defaultValue={member.orcid || ""}
                    placeholder="https://orcid.org/0000-0000-0000-0000"
                    className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="edit-researchGate" className="text-sm font-bold text-[#3a3a40] block">
                    ResearchGate (opcional)
                  </label>
                  <input
                    id="edit-researchGate"
                    name="researchGate"
                    type="url"
                    defaultValue={member.researchGate || ""}
                    placeholder="https://www.researchgate.net/profile/..."
                    className="w-full bg-[#f5f7f5] border border-[#d0d5d1] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1c6576]/30 focus:border-[#1c6576] transition-all text-[#28282b] text-sm"
                  />
                </div>
              </div>

              {/* Status feedback */}
              {status ? (
                <div
                  className={`p-3 rounded-xl text-sm font-medium ${
                    status.type === "ok"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {status.message}
                </div>
              ) : null}

              {/* Modal footer / Actions */}
              <div className="flex gap-3 pt-3 border-t border-[#d8ddd9]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1c6576] hover:bg-[#145562] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="bg-[#f5f7f5] hover:bg-[#e2e6e3] text-[#3a3a40] px-5 py-3 rounded-xl font-bold transition-all border border-[#d0d5d1] cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
