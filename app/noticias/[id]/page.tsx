import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default async function NoticiaDetallePage({ params }: PageProps) {
  const { id } = await params;
  let news:
    | {
        id: string;
        title: string;
        body: string;
        publishedAt: Date;
        imageUrl: string | null;
      }
    | null = null;
  let dbUnavailable = false;

  try {
    news = await prisma.news.findUnique({
      where: { id },
    });
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading news detail:", error);
  }

  if (dbUnavailable) {
    return (
      <main className="hero-grid section-page">
        <section className="upload-panel" aria-label="Estado base de datos">
          <div className="panel-head">
            <h2>Noticia no disponible temporalmente</h2>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
          <Link href="/noticias" className="filter-button" style={{ textDecoration: "none" }}>
            Volver a noticias
          </Link>
        </section>
      </main>
    );
  }

  if (!news) {
    notFound();
  }

  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <div className="news-hero">
          <span className="badge">Noticia</span>
          <Link href="/noticias" className="badge" style={{ textDecoration: "none" }}>
            Volver
          </Link>
        </div>
        <h1>{news.title}</h1>
        <p>{formatDate(news.publishedAt)}</p>
      </section>

      <article className="news-detail stagger delay-1">
        <div className={`news-detail-image ${news.imageUrl ? "" : "news-placeholder"}`}>
          {news.imageUrl ? (
            <img src={news.imageUrl} alt={`Imagen de ${news.title}`} />
          ) : (
            <span className="news-fallback">Sin imagen</span>
          )}
        </div>
        <div className="news-detail-body">
          {news.body.split("\n").map((line, index) => (
            <p key={`${news.id}-${index}`}>{line}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
