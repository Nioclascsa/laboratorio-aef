import { HeroCarousel } from "./components/hero-carousel";

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

const newsItems = [
  {
    date: "Marzo 2026",
    title: "Equipo del laboratorio presenta informe sobre calidad biologica de humedales urbanos",
  },
  {
    date: "Febrero 2026",
    title: "Nueva convocatoria para tesistas en microbiologia ambiental y analisis de metagenomas",
  },
  {
    date: "Enero 2026",
    title: "Publicamos protocolo abierto para monitoreo de biodiversidad en agroecosistemas",
  },
];

export default function Home() {
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

      <section className="search-strip stagger delay-1">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar papers, autores o temas de investigacion..."
            className="search-input"
          />
          <button type="button" className="search-button">
            Buscar
          </button>
        </div>
      </section>

      <section className="search-strip stagger delay-1">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar papers, autores o temas de investigacion..."
            className="search-input"
          />
          <button type="button" className="search-button">
            Buscar
          </button>
        </div>
      </section>

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
        <div className="news-list">
          {newsItems.map((item) => (
            <article className="news-item" key={item.title}>
              <span>{item.date}</span>
              <h3>{item.title}</h3>
              <a href="/noticias">Ver mas</a>
            </article>
          ))}
        </div>
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
