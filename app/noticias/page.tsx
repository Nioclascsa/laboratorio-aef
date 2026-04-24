import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type NewsItem = {
  id: string;
  title: string;
  body: string;
  publishedAt: Date;
  imageUrl: string | null;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

function getExcerpt(text: string, limit = 160) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit).trim()}...`;
}

export default async function NoticiasPage() {
  const session = await auth();
  let isAdmin = false;
  let dbUnavailable = false;
  let news: NewsItem[] = [];

  try {
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });

      isAdmin = user?.role === "ADMIN";
    }

    news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading news:", error);
  }

  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <div className="news-hero">
          <span className="badge">Actualidad</span>
          {isAdmin ? (
            <Link href="/noticias/admin" className="badge" style={{ textDecoration: "none" }}>
              Crear noticia
            </Link>
          ) : null}
        </div>
        <h1>Noticias</h1>
        <p>
          Publicamos novedades sobre avances cientificos, convocatorias, eventos y
          resultados de proyectos del laboratorio.
        </p>
      </section>

      {dbUnavailable && (
        <section className="upload-panel stagger delay-1" aria-label="Estado base de datos">
          <div className="panel-head">
            <h2>Noticias no disponibles temporalmente</h2>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
        </section>
      )}

      {!dbUnavailable && news.length === 0 ? (
        <section className="news-empty stagger delay-1" aria-label="Sin noticias">
          <h3>Sin noticias por ahora</h3>
          <p>Pronto compartiremos novedades del laboratorio.</p>
        </section>
      ) : null}

      {!dbUnavailable && news.length > 0 ? (
        <section className="news-grid stagger delay-1" aria-label="Listado de noticias">
          {news.map((item) => {
            const displayDate = formatDate(item.publishedAt);
            return (
              <Link
                href={`/noticias/${item.id}`}
                className="news-card-link"
                key={item.id}
              >
                <article className="news-card">
                  <div
                    className={`news-media ${item.imageUrl ? "" : "news-placeholder"}`}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={`Imagen de ${item.title}`} loading="lazy" />
                    ) : (
                      <span className="news-fallback">Sin imagen</span>
                    )}
                    <span className="news-date">{displayDate}</span>
                  </div>
                  <div className="news-body">
                    <h3>{item.title}</h3>
                    <p>{getExcerpt(item.body)}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
