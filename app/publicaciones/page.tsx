import { UploadForm } from "../components/upload-form";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/auth";

type SearchParams = {
  q?: string | string[];
  author?: string | string[];
  journal?: string | string[];
  year?: string | string[];
};

type PageProps = {
  searchParams?: SearchParams;
};

function getSingleParam(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0]?.trim() ?? "";
  }

  return "";
}

export default async function PublicacionesPage({ searchParams }: PageProps) {
  const session = await auth();
  let papers: {
    id: string;
    title: string;
    authors: string;
    journal: string | null;
    publicationDate: Date | null;
    summary: string | null;
    storagePath: string;
    uploadedAt: Date;
  }[] = [];
  let dbUnavailable = false;

  const query = getSingleParam(searchParams?.q);
  const selectedAuthor = getSingleParam(searchParams?.author);
  const selectedJournal = getSingleParam(searchParams?.journal);
  const selectedYear = getSingleParam(searchParams?.year);

  try {
    papers = await prisma.paper.findMany({
      orderBy: { uploadedAt: "desc" },
    });
  } catch (error) {
    dbUnavailable = true;
    console.error("Error loading papers:", error);
  }

  const authorSet = new Set<string>();
  const journalSet = new Set<string>();
  const yearSet = new Set<string>();

  papers.forEach((paper) => {
    const authors = paper.authors
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);
    authors.forEach((author) => authorSet.add(author));

    if (paper.journal) {
      journalSet.add(paper.journal);
    }

    const date = paper.publicationDate ?? paper.uploadedAt;
    yearSet.add(date.getFullYear().toString());
  });

  const authorOptions = Array.from(authorSet).sort((a, b) => a.localeCompare(b));
  const journalOptions = Array.from(journalSet).sort((a, b) => a.localeCompare(b));
  const yearOptions = Array.from(yearSet).sort((a, b) => Number(b) - Number(a));

  const normalizedQuery = query.toLowerCase();
  const normalizedAuthor = selectedAuthor.toLowerCase();
  const normalizedJournal = selectedJournal.toLowerCase();

  const filteredPapers = papers.filter((paper) => {
    const publicationDate = paper.publicationDate ?? paper.uploadedAt;
    const publicationYear = publicationDate.getFullYear().toString();
    const authorList = paper.authors
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);

    const matchesAuthor = !normalizedAuthor
      ? true
      : authorList.some((author) => author.toLowerCase() === normalizedAuthor);
    const matchesJournal = !normalizedJournal
      ? true
      : (paper.journal ?? "").toLowerCase() === normalizedJournal;
    const matchesYear = !selectedYear || publicationYear === selectedYear;
    const matchesQuery = !normalizedQuery
      ? true
      : [paper.title, paper.authors, paper.journal ?? "", paper.summary ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

    return matchesAuthor && matchesJournal && matchesYear && matchesQuery;
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

      {dbUnavailable && (
        <section className="upload-panel stagger delay-1" aria-label="Estado base de datos">
          <div className="panel-head">
            <h2>Repositorio no disponible temporalmente</h2>
            <p>
              No se pudo conectar con la base de datos en este momento. Revisa la variable
              DATABASE_URL en Vercel y vuelve a desplegar.
            </p>
          </div>
        </section>
      )}

      {session?.user && (
        <section className="upload-panel stagger delay-1" aria-label="Subida de papers">
          <div className="panel-head">
            <h2>Subir nuevo paper</h2>
            <p>Formatos permitidos: PDF. Tamano maximo recomendado: 20 MB.</p>
          </div>
          <UploadForm />
        </section>
      )}

      <section className="publications-layout stagger delay-2" aria-label="Repositorio digital">
        <aside className="publications-filters">
          <h2>Filtrar</h2>
          <form method="get" className="filters-form">
            <div className="filter-field">
              <label htmlFor="q">Busqueda</label>
              <input
                id="q"
                name="q"
                type="search"
                placeholder="Titulo, autores o revista"
                defaultValue={query}
              />
            </div>
            <div className="filter-field">
              <label htmlFor="author">Autores</label>
              <select id="author" name="author" defaultValue={selectedAuthor}>
                <option value="">Todos los autores</option>
                {authorOptions.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label htmlFor="journal">Revistas</label>
              <select id="journal" name="journal" defaultValue={selectedJournal}>
                <option value="">Todas las revistas</option>
                {journalOptions.map((journal) => (
                  <option key={journal} value={journal}>
                    {journal}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label htmlFor="year">Año</label>
              <select id="year" name="year" defaultValue={selectedYear}>
                <option value="">Todos los años</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="filter-button">
              Buscar
            </button>
          </form>
        </aside>

        <div className="publications-results">
          <div className="panel-head">
            <h2>Repositorio Digital</h2>
            <p>{filteredPapers.length} resultados</p>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="empty-results">
              <h3>No se encontraron publicaciones</h3>
              <p>Intenta ajustar los filtros o la busqueda.</p>
            </div>
          ) : (
            <ul className="publications-list">
              {filteredPapers.map((paper) => {
                const publicationDate = paper.publicationDate ?? paper.uploadedAt;
                const publicationYear = publicationDate.getFullYear();

                return (
                  <li key={paper.id} className="publication-item">
                    <div className="publication-card">
                      <div className="publication-main">
                        <h3 className="publication-title">{paper.title}</h3>
                        <dl className="publication-meta">
                          <div>
                            <dt>Autores</dt>
                            <dd>{paper.authors}</dd>
                          </div>
                          <div>
                            <dt>Revista</dt>
                            <dd>{paper.journal ?? "Sin especificar"}</dd>
                          </div>
                          <div>
                            <dt>Año</dt>
                            <dd>{publicationYear}</dd>
                          </div>
                        </dl>
                        {paper.summary && (
                          <p className="publication-summary">{paper.summary}</p>
                        )}
                      </div>
                      <div className="publication-actions">
                        <span className="publication-year">{publicationYear}</span>
                        <Link
                          href={paper.storagePath}
                          target="_blank"
                          className="publication-download"
                        >
                          Descargar articulo
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
