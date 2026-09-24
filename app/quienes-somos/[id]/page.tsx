import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TeamDeleteButton } from "@/app/components/team-delete-button";
import { TeamEditButton } from "@/app/components/team-edit-button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

/** Parse a newline-separated string into a trimmed, non-empty array */
function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  let isAdmin = false;
  let member: {
    id: string;
    name: string;
    role: string;
    bio: string;
    email: string;
    degrees: string;
    photoUrl: string;
    researchLines: string;
    activeProjects: string;
    courses: string;
    featuredPubs: string;
    orcid: string;
    researchGate: string;
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

  const degreesList = parseLines(member.degrees || "");
  const researchLinesList = parseLines(member.researchLines || "");
  const projectsList = parseLines(member.activeProjects || "");
  const coursesList = parseLines(member.courses || "");
  const pubsList = parseLines(member.featuredPubs || "");

  const hasContactLinks = member.orcid || member.researchGate;
  const showCourses = coursesList.length > 0;
  const showProjects = projectsList.length > 0;
  const showPubs = pubsList.length > 0;
  const showResearchLines = researchLinesList.length > 0;

  return (
    <main className="w-full bg-[#f5f7f5] min-h-screen">
      {/* ── Top bar ── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/quienes-somos"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#1c6576] hover:text-[#145562] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al equipo
        </Link>
        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-3 [&_.admin-actions]:!mt-0">
            <TeamEditButton member={member} />
            <TeamDeleteButton id={member.id} name={member.name} />
          </div>
        ) : null}
      </div>

      {/* ── Hero: Photo + Identity ── */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 pb-10">
        <div className="bg-white rounded-3xl border border-[#d8ddd9] shadow-[0_12px_40px_rgba(40,40,43,0.08)] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Photo */}
            <div className="relative w-full md:w-72 lg:w-80 aspect-square md:aspect-auto md:min-h-[360px] flex-shrink-0 bg-[#dce8ea]">
              <Image
                src={member.photoUrl}
                alt={`Foto de ${member.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            </div>

            {/* Identity */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              {/* Role badge */}
              <span className="inline-block self-start text-xs font-bold uppercase tracking-widest text-[#1c6576] bg-[#1c6576]/10 px-3 py-1.5 rounded-full mb-4">
                {member.role}
              </span>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#28282b] mb-3 leading-tight">
                {member.name}
              </h1>

              {/* Bio */}
              {member.bio ? (
                <div className="text-[#5a5a60] text-base leading-relaxed mb-6 space-y-2">
                  {member.bio.split("\n").map((line, i) => (
                    <p key={`bio-${i}`} className="m-0">{line}</p>
                  ))}
                </div>
              ) : null}

              {/* Contact row */}
              <div className="flex flex-wrap items-center gap-3">
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1c6576] bg-[#1c6576]/8 hover:bg-[#1c6576]/15 px-4 py-2 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {member.email}
                  </a>
                ) : null}

                {member.orcid ? (
                  <a
                    href={member.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#a6ce39] bg-[#a6ce39]/10 hover:bg-[#a6ce39]/20 px-4 py-2 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-1.847-1.238-3.722-3.806-3.722h-2.513z" />
                    </svg>
                    ORCID
                  </a>
                ) : null}

                {member.researchGate ? (
                  <a
                    href={member.researchGate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#00d0af] bg-[#00d0af]/10 hover:bg-[#00d0af]/20 px-4 py-2 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.586 0c-1.9 0-3.166 1.572-3.166 3.934v4.572c0 2.769-2.078 4.284-4.125 4.284-2.125 0-3.953-1.66-3.953-4.284V3.934C8.342 1.572 7.076 0 5.176 0 3.276 0 2 1.572 2 3.934v4.572c0 5.828 4.078 9.494 10.295 9.494h.381C18.894 18 23 14.334 23 8.506V3.934C23 1.572 21.486 0 19.586 0z" />
                    </svg>
                    ResearchGate
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content sections ── */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Formación académica — always shown */}
          <div className="bg-white rounded-2xl border border-[#d8ddd9] p-7 shadow-[0_4px_16px_rgba(40,40,43,0.04)]">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-[#1c6576]/10 flex items-center justify-center text-lg">🎓</span>
              <h2 className="text-lg font-heading font-bold text-[#28282b] m-0">Formación académica</h2>
            </div>
            {degreesList.length > 0 ? (
              <ul className="space-y-2.5 list-none m-0 p-0">
                {degreesList.map((deg, i) => (
                  <li key={`deg-${i}`} className="flex items-start gap-3 text-[#3a3a40] text-sm leading-relaxed">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1c6576] mt-2 flex-shrink-0" />
                    {deg}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#a0a0a8] m-0">Sin información de formación</p>
            )}
          </div>

          {/* Líneas de investigación */}
          {showResearchLines ? (
            <div className="bg-white rounded-2xl border border-[#d8ddd9] p-7 shadow-[0_4px_16px_rgba(40,40,43,0.04)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-[#1c6576]/10 flex items-center justify-center text-lg">🔬</span>
                <h2 className="text-lg font-heading font-bold text-[#28282b] m-0">Líneas de investigación</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {researchLinesList.map((line, i) => (
                  <Link
                    key={`rl-${i}`}
                    href="/#lineas-de-investigacion"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1c6576] bg-[#1c6576]/8 px-4 py-2 rounded-full border border-[#1c6576]/15 transition-all hover:bg-[#1c6576] hover:text-white hover:shadow-sm"
                  >
                    <span>{line}</span>
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {/* Proyectos activos */}
          {showProjects ? (
            <div className="bg-white rounded-2xl border border-[#d8ddd9] p-7 shadow-[0_4px_16px_rgba(40,40,43,0.04)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-[#f78117]/10 flex items-center justify-center text-lg">📋</span>
                <h2 className="text-lg font-heading font-bold text-[#28282b] m-0">Proyectos activos</h2>
              </div>
              <ul className="space-y-2.5 list-none m-0 p-0">
                {projectsList.map((proj, i) => (
                  <li key={`proj-${i}`} className="flex items-start gap-3 text-[#3a3a40] text-sm leading-relaxed">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f78117] mt-2 flex-shrink-0" />
                    {proj}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Asignaturas */}
          {showCourses ? (
            <div className="bg-white rounded-2xl border border-[#d8ddd9] p-7 shadow-[0_4px_16px_rgba(40,40,43,0.04)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-[#9bc837]/10 flex items-center justify-center text-lg">📚</span>
                <h2 className="text-lg font-heading font-bold text-[#28282b] m-0">Asignaturas impartidas</h2>
              </div>
              <ul className="space-y-2.5 list-none m-0 p-0">
                {coursesList.map((course, i) => (
                  <li key={`course-${i}`} className="flex items-start gap-3 text-[#3a3a40] text-sm leading-relaxed">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9bc837] mt-2 flex-shrink-0" />
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Publicaciones destacadas — full width */}
          {showPubs ? (
            <div className="bg-white rounded-2xl border border-[#d8ddd9] p-7 shadow-[0_4px_16px_rgba(40,40,43,0.04)] lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-[#1c6576]/10 flex items-center justify-center text-lg">📄</span>
                <h2 className="text-lg font-heading font-bold text-[#28282b] m-0">Publicaciones destacadas</h2>
              </div>
              <ol className="space-y-3 list-none m-0 p-0 counter-reset-[pub]">
                {pubsList.map((pub, i) => (
                  <li key={`pub-${i}`} className="flex items-start gap-4 text-[#3a3a40] text-sm leading-relaxed">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#1c6576]/8 text-[#1c6576] text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{pub}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 pt-4 border-t border-[#e8ece9]">
                <Link
                  href="/publicaciones"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1c6576] hover:text-[#145562] transition-colors"
                >
                  Ver todas las publicaciones
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : null}

        </div>
      </section>
    </main>
  );
}
