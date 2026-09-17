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

/** Canonical role hierarchy – order matters */
const ROLE_ORDER = ["Jefe de Laboratorio", "Profesor", "Alumno"] as const;

const ROLE_LABELS: Record<string, string> = {
  "Jefe de Laboratorio": "Jefe de Laboratorio",
  Profesor: "Profesores",
  Alumno: "Alumnos",
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
  for (const role of ROLE_ORDER) {
    membersByRole[role] = teamMembers.filter((m) => m.role === role);
  }

  const jefes = membersByRole["Jefe de Laboratorio"];
  const profesores = membersByRole["Profesor"];
  const alumnos = membersByRole["Alumno"];

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

          {/* ── Jefe de Laboratorio ── */}
          {!dbUnavailable && jefes.length > 0 ? (
            <div className="team-role-group team-role-jefe">
              <h3 className="team-role-heading">{ROLE_LABELS["Jefe de Laboratorio"]}</h3>
              <div className="team-grid-jefe">
                {jefes.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ) : null}

          {/* ── Profesores ── */}
          {!dbUnavailable && profesores.length > 0 ? (
            <div className="team-role-group">
              <div className="team-role-divider" />
              <h3 className="team-role-heading">{ROLE_LABELS["Profesor"]}</h3>
              <div className="team-grid">
                {profesores.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ) : null}

          {/* ── Alumnos ── */}
          {!dbUnavailable && alumnos.length > 0 ? (
            <div className="team-role-group">
              <div className="team-role-divider" />
              <h3 className="team-role-heading">{ROLE_LABELS["Alumno"]}</h3>
              <div className="team-grid">
                {alumnos.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

