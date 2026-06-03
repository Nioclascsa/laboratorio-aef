import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TeamDeleteButton } from "@/app/components/team-delete-button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  let isAdmin = false;
  let member:
    | {
        id: string;
        name: string;
        role: string;
        bio: string;
        email: string;
        degrees: string;
        photoUrl: string;
      }
    | null = null;
  let dbUnavailable = false;

  try {
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });

      isAdmin = user?.role === "ADMIN";
    }

    member = await prisma.teamMember.findUnique({
      where: { id },
    });
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading team member:", error);
  }

  if (dbUnavailable) {
    return (
      <main className="hero-grid section-page">
        <section className="upload-panel" aria-label="Estado base de datos">
          <div className="panel-head">
            <h2>Perfil no disponible temporalmente</h2>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
          <Link href="/quienes-somos" className="filter-button" style={{ textDecoration: "none" }}>
            Volver a equipo
          </Link>
        </section>
      </main>
    );
  }

  if (!member) {
    notFound();
  }

  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <div className="news-hero">
          <span className="badge">Equipo</span>
          <Link href="/quienes-somos" className="badge" style={{ textDecoration: "none" }}>
            Volver
          </Link>
        </div>
        <h1>{member.name}</h1>
        {isAdmin ? (
          <TeamDeleteButton id={member.id} name={member.name} />
        ) : null}
      </section>

      <article className="team-detail stagger delay-1">
        <div className="team-detail-profile">
          <div className="team-detail-photo">
            <img src={member.photoUrl} alt={`Foto de ${member.name}`} />
          </div>
          <div className="team-detail-bio">
            {member.bio.split("\n").map((line, index) => (
              <p key={`${member.id}-${index}`}>{line}</p>
            ))}
          </div>
        </div>

        <div className="team-detail-info">
          <div className="team-detail-field">
            <span className="team-detail-label">Cargo</span>
            <p>{member.role}</p>
          </div>
          <div className="team-detail-field">
            <span className="team-detail-label">Grados</span>
            {member.degrees ? (
              <ul className="team-detail-list">
                {member.degrees
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, index) => (
                    <li key={`${member.id}-degree-${index}`}>{line}</li>
                  ))}
              </ul>
            ) : (
              <p className="team-detail-muted">Sin informacion</p>
            )}
          </div>
          <div className="team-detail-field">
            <span className="team-detail-label">Correo</span>
            {member.email ? (
              <a className="team-detail-link" href={`mailto:${member.email}`}>
                {member.email}
              </a>
            ) : (
              <p className="team-detail-muted">Sin informacion</p>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
