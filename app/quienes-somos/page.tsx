import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
};

export default async function QuienesSomosPage() {
  const session = await auth();
  let isAdmin = false;
  let dbUnavailable = false;
  let teamMembers: TeamMember[] = [];

  try {
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });

      isAdmin = user?.role === "ADMIN";
    }

    teamMembers = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading team:", error);
  }

  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <div className="news-hero">
          <span className="badge">Institucional</span>
          {isAdmin ? (
            <Link href="/quienes-somos/admin" className="badge" style={{ textDecoration: "none" }}>
              Agregar miembro
            </Link>
          ) : null}
        </div>
        <h1>Quienes somos</h1>
        <p>
          Somos un laboratorio cientifico de biologia orientado a la investigacion aplicada, 
          la formacion academica y la transferencia de conocimiento hacia la sociedad.
        </p>
      </section>

      <section className="cards stagger delay-1" aria-label="Mision y Vision">
        <article className="card">
          <h3>Mision</h3>
          <p>Generar evidencia cientifica de calidad para responder desafios biologicos regionales y globales.</p>
        </article>
        <article className="card">
          <h3>Vision</h3>
          <p>Consolidarnos como referente en investigacion biologica interdisciplinaria y ciencia abierta.</p>
        </article>
      </section>

      <section className="team-section stagger delay-2" aria-label="Nuestro Equipo">
        <div className="panel-head">
          <h2>Nuestro Equipo</h2>
          <p>Investigadores y especialistas comprometidos con la ciencia.</p>
        </div>

        {dbUnavailable ? (
          <div className="news-empty">
            <h3>Equipo no disponible temporalmente</h3>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
        ) : null}

        {!dbUnavailable && teamMembers.length === 0 ? (
          <div className="news-empty">
            <h3>Sin miembros registrados</h3>
            <p>Pronto compartiremos al equipo del laboratorio.</p>
          </div>
        ) : null}

        {!dbUnavailable && teamMembers.length > 0 ? (
          <div className="team-grid">
            {teamMembers.map((member) => (
              <Link
                key={member.id}
                href={`/quienes-somos/${member.id}`}
                className="team-card-link"
              >
                <article className="team-card">
                  <div className="team-photo-wrapper">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="team-photo"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <span className="role">{member.role}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
