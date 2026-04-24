import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/app/components/news-form";

export default async function NoticiasAdminPage() {
  const session = await auth();
  let isAdmin = false;
  let dbUnavailable = false;

  try {
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });

      isAdmin = user?.role === "ADMIN";
    }
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading admin news page:", error);
  }

  if (!session?.user) {
    return (
      <main className="hero-grid section-page">
        <section className="upload-panel" aria-label="Acceso restringido">
          <div className="panel-head">
            <h2>Acceso restringido</h2>
            <p>Inicia sesion con una cuenta administradora.</p>
          </div>
          <Link href="/login" className="filter-button" style={{ textDecoration: "none" }}>
            Ir a login
          </Link>
        </section>
      </main>
    );
  }

  if (dbUnavailable) {
    return (
      <main className="hero-grid section-page">
        <section className="upload-panel" aria-label="Estado base de datos">
          <div className="panel-head">
            <h2>Admin no disponible temporalmente</h2>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
          <Link href="/noticias" className="filter-button" style={{ textDecoration: "none" }}>
            Volver a noticias
          </Link>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="hero-grid section-page">
        <section className="upload-panel" aria-label="No autorizado">
          <div className="panel-head">
            <h2>No autorizado</h2>
            <p>Solo administradores pueden publicar noticias.</p>
          </div>
          <Link href="/noticias" className="filter-button" style={{ textDecoration: "none" }}>
            Volver a noticias
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <span className="badge">Administracion</span>
        <h1>Publicar noticia</h1>
        <p>Completa los campos para que la noticia aparezca en el listado publico.</p>
      </section>

      <section className="upload-panel stagger delay-1" aria-label="Formulario de noticias">
        <div className="panel-head">
          <h2>Nueva noticia</h2>
          <p>La imagen es opcional. Formatos: JPG, PNG o WEBP.</p>
        </div>
        <NewsForm />
      </section>
    </main>
  );
}
