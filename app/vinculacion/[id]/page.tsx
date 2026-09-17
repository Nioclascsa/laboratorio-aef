import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OutreachDeleteButton } from "@/app/components/outreach-delete-button";

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  colaboracion: "Colaboración",
  convenio: "Convenio",
  evento: "Evento",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default async function VinculacionDetallePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  let isAdmin = false;
  let entry: {
    id: string;
    title: string;
    body: string;
    category: string;
    publishedAt: Date;
    imageUrl: string | null;
  } | null = null;
  let dbUnavailable = false;

  try {
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });
      isAdmin = user?.role === "ADMIN";
    }

    entry = await prisma.outreach.findUnique({ where: { id } });
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading outreach detail:", error);
  }

  if (dbUnavailable) {
    return (
      <main className="hero-grid section-page">
        <section className="upload-panel" aria-label="Estado base de datos">
          <div className="panel-head">
            <h2>Entrada no disponible temporalmente</h2>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
          <Link
            href="/vinculacion"
            className="filter-button"
            style={{ textDecoration: "none" }}
          >
            Volver a vinculacion
          </Link>
        </section>
      </main>
    );
  }

  if (!entry) {
    notFound();
  }

  const categoryLabel =
    CATEGORY_LABELS[entry.category] ?? entry.category;

  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <div className="outreach-hero">
          <span className="outreach-cat" data-cat={entry.category}>
            {categoryLabel}
          </span>
          <Link
            href="/vinculacion"
            className="badge"
            style={{ textDecoration: "none" }}
          >
            Volver
          </Link>
        </div>
        <h1>{entry.title}</h1>
        <p>{formatDate(entry.publishedAt)}</p>
        {isAdmin ? (
          <OutreachDeleteButton id={entry.id} title={entry.title} />
        ) : null}
      </section>

      <article className="outreach-detail stagger delay-1">
        <div
          className={`outreach-detail-image ${entry.imageUrl ? "" : "outreach-placeholder"}`}
        >
          {entry.imageUrl ? (
            <img src={entry.imageUrl} alt={`Imagen de ${entry.title}`} />
          ) : (
            <span className="outreach-fallback">Sin imagen</span>
          )}
        </div>
        <div className="outreach-detail-body">
          {entry.body.split("\n").map((line, index) => (
            <p key={`${entry!.id}-${index}`}>{line}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
