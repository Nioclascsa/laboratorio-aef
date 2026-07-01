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

  // Next.js 15+ searchParams are Promises
  const resolvedSearchParams = await searchParams;

  const query = getSingleParam(resolvedSearchParams?.q);
  const selectedAuthor = getSingleParam(resolvedSearchParams?.author);
  const selectedJournal = getSingleParam(resolvedSearchParams?.journal);
  const selectedYear = getSingleParam(resolvedSearchParams?.year);

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
    <main className="w-full bg-[#f3f7f2] min-h-screen">
      {/* 1. Hero Section */}
      <section className="w-full bg-[#0f5a45] relative overflow-hidden py-24 px-6 md:px-12 lg:px-24">
        {/* Background decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#147256] to-[#0f5a45] z-0"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-green-100 text-sm font-bold tracking-widest uppercase backdrop-blur-sm">
              Repositorio
            </span>
            
            {!session ? (
              <Link href="/login" className="inline-flex items-center text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-colors border border-white/20 backdrop-blur-sm">
                Acceso Investigadores 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-white font-medium text-sm">Hola, {session.user?.name || 'Investigador'}</span>
                <form action={async () => {
                  "use server";
                  await signOut();
                }}>
                  <button type="submit" className="inline-flex items-center text-sm font-bold text-white bg-red-500/20 hover:bg-red-500/40 px-5 py-2.5 rounded-full transition-colors border border-red-500/30 backdrop-blur-sm">
                    Cerrar Sesión
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Publicaciones y Papers
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl font-light">
            Accede a nuestra colección de artículos científicos, tesis y reportes técnicos. 
            Contribuye al conocimiento subiendo nuevas evidencias.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-8 relative z-20 pb-24">
        
        {dbUnavailable && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 mb-8 shadow-lg text-red-800">
            <h2 className="text-xl font-bold mb-2">Repositorio no disponible temporalmente</h2>
            <p>
              No se pudo conectar con la base de datos en este momento. Revisa la conexión
              o inténtalo más tarde.
            </p>
          </div>
        )}

        {session?.user && (
          <div className="bg-white rounded-3xl p-8 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#e1ebe4]">
            <div className="mb-6 border-b border-[#e1ebe4] pb-4">
              <h2 className="text-2xl font-heading font-bold text-[#11231e] mb-2">Subir nuevo paper</h2>
              <p className="text-[#46635a]">Formatos permitidos: PDF. Tamaño máximo recomendado: 20 MB.</p>
            </div>
            <UploadForm />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e1ebe4] sticky top-28">
              <h2 className="text-xl font-bold text-[#11231e] mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#147256]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Filtrar Resultados
              </h2>
              
              <form method="get" className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="q" className="text-sm font-bold text-[#2f4b41] block">Búsqueda general</label>
                  <input
                    id="q"
                    name="q"
                    type="search"
                    placeholder="Título, autor o resumen..."
                    defaultValue={query}
                    className="w-full bg-[#f3f7f2] border border-[#c4d5c9] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#147256]/30 focus:border-[#147256] transition-all text-[#11231e]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="author" className="text-sm font-bold text-[#2f4b41] block">Autor principal</label>
                  <div className="relative">
                    <select 
                      id="author" 
                      name="author" 
                      defaultValue={selectedAuthor}
                      className="w-full bg-[#f3f7f2] border border-[#c4d5c9] rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#147256]/30 focus:border-[#147256] transition-all text-[#11231e]"
                    >
                      <option value="">Todos los autores</option>
                      {authorOptions.map((author) => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#46635a]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="journal" className="text-sm font-bold text-[#2f4b41] block">Revista Científica</label>
                  <div className="relative">
                    <select 
                      id="journal" 
                      name="journal" 
                      defaultValue={selectedJournal}
                      className="w-full bg-[#f3f7f2] border border-[#c4d5c9] rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#147256]/30 focus:border-[#147256] transition-all text-[#11231e]"
                    >
                      <option value="">Todas las revistas</option>
                      {journalOptions.map((journal) => (
                        <option key={journal} value={journal}>{journal}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#46635a]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="year" className="text-sm font-bold text-[#2f4b41] block">Año de publicación</label>
                  <div className="relative">
                    <select 
                      id="year" 
                      name="year" 
                      defaultValue={selectedYear}
                      className="w-full bg-[#f3f7f2] border border-[#c4d5c9] rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#147256]/30 focus:border-[#147256] transition-all text-[#11231e]"
                    >
                      <option value="">Todos los años</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#46635a]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#147256] hover:bg-[#0f5a45] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4">
                  Aplicar Filtros
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content / Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#11231e]">
                {filteredPapers.length > 0 ? 'Documentos Encontrados' : 'Sin Resultados'}
              </h2>
              <span className="bg-[#e1ebe4] text-[#2f4b41] font-bold py-1 px-3 rounded-full text-sm">
                {filteredPapers.length} {filteredPapers.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>

            {filteredPapers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-[#e1ebe4]">
                <div className="w-20 h-20 bg-[#f3f7f2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#46635a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#11231e] mb-2">No se encontraron publicaciones</h3>
                <p className="text-[#46635a] text-lg">Intenta ajustar los filtros de búsqueda o prueba con otros términos.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPapers.map((paper) => {
                  const publicationDate = paper.publicationDate ?? paper.uploadedAt;
                  const publicationYear = publicationDate.getFullYear();

                  return (
                    <article key={paper.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] border border-[#e1ebe4] transition-all duration-300 flex flex-col sm:flex-row gap-6 md:gap-8 group">
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="bg-[#f3f7f2] text-[#147256] font-bold text-sm px-3 py-1 rounded-full border border-[#c4d5c9]">
                            {publicationYear}
                          </span>
                          <span className="text-[#46635a] text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                            {paper.journal ?? "Sin especificar"}
                          </span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-[#11231e] mb-3 leading-snug group-hover:text-[#147256] transition-colors">
                          {paper.title}
                        </h3>
                        
                        <p className="text-[#2f4b41] font-medium mb-4 flex items-start">
                          <svg className="w-5 h-5 mr-2 mt-0.5 text-[#a8c6ba] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          {paper.authors}
                        </p>
                        
                        {paper.summary && (
                          <p className="text-[#46635a] leading-relaxed line-clamp-3 mb-6">
                            {paper.summary}
                          </p>
                        )}
                      </div>
                      
                      <div className="sm:w-48 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-2 shrink-0 border-t sm:border-t-0 sm:border-l border-[#e1ebe4] sm:pl-6 gap-4">
                        <Link
                          href={paper.storagePath}
                          target="_blank"
                          className="w-full text-center bg-[#147256] hover:bg-[#0f5a45] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-105"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Descargar
                        </Link>
                      </div>

                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
