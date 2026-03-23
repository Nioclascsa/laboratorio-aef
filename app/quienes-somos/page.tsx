"use client";

import Image from "next/image";

const teamMembers = [
  {
    name: "Dra. Ana Maria Gonzalez",
    role: "Directora de Laboratorio",
    bio: "Doctora en Biologia Molecular con 15 anios de experiencia en ecologia microbiana.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. Carlos Ruiz",
    role: "Investigador Principal",
    bio: "Especialista en botánica aplicada y conservación de ecosistemas amenazados.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Lic. Sofia Mendez",
    role: "Coordinadora de Proyectos",
    bio: "Biologa ambiental enfocada en gestion de datos y vinculacion con el medio.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mg. Javier Torres",
    role: "Analista de Datos",
    bio: "Experto en bioinformatica y modelamiento estadistico para ciencias biologicas.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
  },
];

export default function QuienesSomosPage() {
  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <span className="badge">Institucional</span>
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
        
        <div className="team-grid">
          {teamMembers.map((member) => (
            <article key={member.name} className="team-card">
              <div className="team-photo-wrapper">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="team-photo"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="role">{member.role}</span>
                <p>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
