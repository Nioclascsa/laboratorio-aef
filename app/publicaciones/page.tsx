import { SectionPage } from "../components/section-page";
import { UploadForm } from "../components/upload-form";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/auth";

export default async function PublicacionesPage() {
  const session = await auth();
  const papers = await prisma.paper.findMany({
    orderBy: { uploadedAt: "desc" },
  });

  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge">Repositorio</span>
          {!session ? (
            <Link href="/login" className="badge" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}>
              Acceso Investigadores →
            </Link>
          ) : (
            <form action={async () => {
              "use server";
              await signOut();
            }}>
              <button type="submit" className="badge" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                Cerrar Sesión
              </button>
            </form>
          )}
        </div>
        <h1>Publicaciones y Papers</h1>
        <p>
          Accede a nuestra coleccion de articulos cientificos, tesis y reportes tecnicos.
          Contribuye al conocimiento subiendo nuevas evidencias.
        </p>
      </section>

      {session?.user && (
        <section className="upload-panel stagger delay-1" aria-label="Subida de papers">
          <div className="panel-head">
            <h2>Subir nuevo paper</h2>
            <p>Formatos permitidos: PDF. Tamano maximo recomendado: 20 MB.</p>
          </div>
          <UploadForm />
        </section>
      )}

      {papers.length > 0 && (
        <section className="papers-list stagger delay-2" aria-label="Lista de papers">
          <div className="panel-head">
            <h2>Repositorio Digital</h2>
          </div>
          <ul className="paper-grid">
            {papers.map((paper) => (
              <li key={paper.id} className="paper-item">
                <Link href={paper.storagePath} target="_blank" className="paper-link">
                  <div className="paper-info">
                    <h4>{paper.title}</h4>
                    <p className="paper-meta">
                      {paper.authors} • {new Date(paper.uploadedAt).toLocaleDateString()}
                    </p>
                    {paper.summary && <p className="paper-summary">{paper.summary}</p>}
                  </div>
                  <span className="download-icon">↓ PDF</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="cards stagger delay-2" aria-label="Categorias">
        <article className="card">
          <h3>Articulos Cientificos</h3>
          <p>Publicaciones indexadas y papers de revision revisados por pares.</p>
        </article>
        <article className="card">
          <h3>Tesis y Memorias</h3>
          <p>Trabajos de titulacion de pregrado y postgrado del laboratorio.</p>
        </article>
        <article className="card">
          <h3>Informes Tecnicos</h3>
          <p>Reportes de proyectos, asesorias y levantamientos de linea base.</p>
        </article>
      </section>
    </main>
  );
}
