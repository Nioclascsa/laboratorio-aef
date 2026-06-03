import Link from "next/link";

import { HeroCarousel } from "./components/hero-carousel";
import { InstagramEmbeds } from "./components/instagram-embeds";
import { prisma } from "@/lib/prisma";

const researchPrograms = [
  {
    title: "Conservacion y bienestar humano",
    text: "Evaluamos servicios ecosistemicos y salud ambiental para apoyar decisiones publicas y comunitarias.",
  },
  {
    title: "Estatus y tendencias de biodiversidad",
    text: "Monitoreamos especies y ecosistemas con datos de campo, laboratorio y modelamiento.",
  },
  {
    title: "Factores de cambio biologico",
    text: "Analizamos presiones climaticas y antropicas que transforman la biodiversidad regional.",
  },
  {
    title: "Integridad de ecosistemas",
    text: "Estudiamos funcionalidad ecologica y aportes de la naturaleza a las personas.",
  },
];

const integrativePrograms = [
  {
    title: "Biodata y colecciones",
    text: "Unificamos registros biologicos, bases de datos y colecciones para ciencia abierta.",
  },
  {
    title: "Laboratorio de invasiones",
    text: "Investigamos dinamicas de especies invasoras y estrategias de control en terreno.",
  },
  {
    title: "Red socioecologica de largo plazo",
    text: "Sistemas de observacion continua para detectar cambios ecosistemicos con evidencia robusta.",
  },
];

type NewsPreview = {
  id: string;
  title: string;
  publishedAt: Date;
  imageUrl: string | null;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

// Reemplaza estos enlaces con publicaciones reales del Instagram del laboratorio
const instagramPosts = [
  "https://www.instagram.com/p/DVosclokYaj/",
  "https://www.instagram.com/p/DYr-ZW1ERAE/",
  "https://www.instagram.com/p/REEMPLAZA_3/",
];

export default async function Home() {
  let newsItems: NewsPreview[] = [];
  let newsUnavailable = false;

  try {
    newsItems = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        publishedAt: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    newsUnavailable = true;
    console.error("Error loading home news:", error);
  }

  return (
    <main className="hero-grid home-ie-style">
      <section className="hero hero-institutional stagger">
        <span className="badge">Centro de investigacion biologica</span>
        <h1>Somos el Laboratorio Cientifico de Biologia Aplicada</h1>
        <p>
          Institucion dedicada a investigacion cientifica de excelencia, docencia y transferencia de
          conocimiento para la conservacion de la biodiversidad.
        </p>
      </section>

      <HeroCarousel />

     

      <section className="intro-strip stagger delay-1" aria-label="Mensaje introductorio">
        <h2>Ven a explorar la biodiversidad con nosotros</h2>
        <p>
          Integramos trabajo de laboratorio, terreno y analitica de datos para generar evidencia
          util en politicas publicas, educacion y gestion ambiental.
        </p>
      </section>

      <section className="stacked-panel stagger delay-1" aria-label="Programas de investigacion">
        <div className="panel-head">
          <h2>Programas de investigacion</h2>
          <p>Lineas cientificas prioritarias del laboratorio.</p>
        </div>
        <div className="cards program-grid">
          {researchPrograms.map((program) => (
            <article className="card" key={program.title}>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stacked-panel stagger delay-2" aria-label="Programas integrativos">
        <div className="panel-head">
          <h2>Programas integrativos</h2>
          <p>Infraestructura transversal que fortalece proyectos interdisciplinarios.</p>
        </div>
        <div className="cards integrative-grid">
          {integrativePrograms.map((program) => (
            <article className="card" key={program.title}>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stacked-panel stagger delay-2" aria-label="Noticias destacadas">
        <div className="panel-head">
          <h2>Noticias</h2>
          <p>Actualidad del laboratorio, convocatorias y publicaciones recientes.</p>
        </div>
        {newsUnavailable ? (
          <div className="news-empty">
            <h3>Noticias no disponibles</h3>
            <p>No se pudo conectar con la base de datos. Intentalo mas tarde.</p>
          </div>
        ) : null}

        {!newsUnavailable && newsItems.length === 0 ? (
          <div className="news-empty">
            <h3>Sin noticias por ahora</h3>
            <p>Pronto compartiremos novedades del laboratorio.</p>
          </div>
        ) : null}

        {!newsUnavailable && newsItems.length > 0 ? (
          <div className="news-list">
            {newsItems.map((item) => (
              <article className="news-item news-item--media" key={item.id}>
                <div className={`news-thumb ${item.imageUrl ? "" : "news-thumb--empty"}`}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={`Imagen de ${item.title}`} loading="lazy" />
                  ) : (
                    <span className="news-thumb-fallback">Sin imagen</span>
                  )}
                </div>
                <div className="news-item-body">
                  <span>{formatDate(item.publishedAt)}</span>
                  <h3>{item.title}</h3>
                  <Link href={`/noticias/${item.id}`}>Ver mas</Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="stacked-panel stagger delay-2" aria-label="Instagram del laboratorio">
        <div className="panel-head">
          <h2>Instagram</h2>
          <p>Publicaciones recientes de @aefpucv.</p>
        </div>

        {instagramPosts.length === 0 ? (
          <div className="instagram-empty">
            <h3>Agrega enlaces de Instagram</h3>
            <p>Actualiza la lista en app/page.tsx para mostrar publicaciones.</p>
          </div>
        ) : (
          <InstagramEmbeds posts={instagramPosts} />
        )}
      </section>

      <section className="links-band stagger delay-2" aria-label="Enlaces e informacion institucional">
        <div>
          <h3>Links de interes</h3>
          <ul>
            <li>Portal de biodiversidad nacional</li>
            <li>Red de ciencia abierta</li>
            <li>Repositorio de datos biologicos</li>
          </ul>
        </div>
        <div>
          <h3>Redes sociales</h3>
          <ul>
            <li>LinkedIn</li>
            <li>Instagram</li>
            <li>YouTube</li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <ul>
            <li>contacto@labbio.cl</li>
            <li>+56 2 2000 1000</li>
            <li>Santiago, Chile</li>
          </ul>
        </div>
      </section>

    </main>
  );
}
