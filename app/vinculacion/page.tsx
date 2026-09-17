import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OutreachGrid } from "@/app/components/outreach-grid";

export default async function VinculacionPage() {
  let isAdmin = false;
  let dbUnavailable = false;
  let items: {
    id: string;
    title: string;
    body: string;
    category: string;
    publishedAt: Date;
    imageUrl: string | null;
  }[] = [];

  try {
    const session = await auth();

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });
      isAdmin = user?.role === "ADMIN";
    }

    items = await prisma.outreach.findMany({
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading outreach:", error);
  }

  if (dbUnavailable) {
    return (
      <main className="hero-grid section-page">
        <section className="hero-banner stagger" aria-label="Encabezado |vinculacion" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')" }}>

          <h1>Vinculación</h1>
          <p>
            Colaboraciones, convenios y actividades del laboratorio con la
            comunidad.
          </p>
        </section>
        <section
          className="upload-panel stagger delay-1"
          aria-label="Estado base de datos"
        >
          <div className="panel-head">
            <h2>Vinculación no disponible temporalmente</h2>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="hero-grid section-page">
        <section className="hero-banner stagger" aria-label="Encabezado vinculacion" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')" }}>
          <div className="hero-banner-top">
            <span className="badge">Vinculación</span>
            {isAdmin ? (
              <a
                href="/vinculacion/admin"
                className="badge"
                style={{ textDecoration: "none" }}
              >
                Crear entrada
              </a>
            ) : null}
          </div>
          <h1>Vinculación</h1>
          <p>
            Colaboraciones, convenios y actividades que conectan el laboratorio
            con la comunidad científica, instituciones y el entorno social.
          </p>
        </section>
        <section
          className="outreach-empty stagger delay-1"
          aria-label="Sin entradas"
        >
          <h3>Sin entradas por ahora</h3>
          <p>Pronto compartiremos colaboraciones y actividades del laboratorio.</p>
        </section>
      </main>
    );
  }

  // Serialize dates for the client component
  const serialized = items.map((item) => ({
    ...item,
    publishedAt: item.publishedAt.toISOString(),
  }));

  return (
    <main className="hero-grid section-page">
      <OutreachGrid items={serialized} isAdmin={isAdmin} />
    </main>
  );
}
