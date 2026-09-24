import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TEAM_ROLES, TEAM_ROLE_LABELS, type TeamRole } from "@/lib/team-roles";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
};

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Link
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
  );
}

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

  // Group members by role
  const membersByRole: Record<string, TeamMember[]> = {};
  for (const role of TEAM_ROLES) {
    membersByRole[role] = teamMembers.filter((m) => m.role === role);
  }

  // Handle any members that may have a custom or legacy role
  const extraRoles = Array.from(
    new Set(
      teamMembers
        .map((m) => m.role)
        .filter((r) => !TEAM_ROLES.includes(r as TeamRole))
    )
  );

  for (const role of extraRoles) {
    membersByRole[role] = teamMembers.filter((m) => m.role === role);
  }

  const allRolesToRender = [...TEAM_ROLES, ...extraRoles];

  return (
    <main className="w-full">
      <section
        className="hero-banner stagger !rounded-none w-full mb-12"
        style={{
          backgroundImage: "url('/20231207_103733.jpg')",
          borderRadius: 0,
        }}
      >
        <div className="hero-banner-top">
          {isAdmin ? (
            <Link href="/quienes-somos/admin" className="badge" style={{ textDecoration: "none" }}>
              Agregar miembro
            </Link>
          ) : null}
        </div>
        <h1>Quienes somos</h1>
        <p>
          Somos un laboratorio científico de biología orientado a la investigación aplicada, la formación académica y la transferencia de conocimiento hacia la sociedad.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
        <section className="team-section stagger delay-1" aria-label="Equipo AEF">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#28282b] tracking-tight">
              Equipo AEF
            </h2>
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

          {!dbUnavailable &&
            allRolesToRender.map((role) => {
              const members = membersByRole[role] || [];
              if (members.length === 0) return null;

              if (role === "Jefe de Laboratorio") {
                return (
                  <div key={role} className="team-role-group team-role-jefe">
                    <h3 className="team-role-heading">
                      {TEAM_ROLE_LABELS[role] || role}
                    </h3>
                    <div className="team-grid-jefe">
                      {members.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={role} className="team-role-group">
                  <div className="team-role-divider" />
                  <h3 className="team-role-heading">
                    {TEAM_ROLE_LABELS[role] || role}
                  </h3>
                  <div className="team-grid">
                    {members.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              );
            })}
        </section>
      </div>
    </main>
  );
}

