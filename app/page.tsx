import Link from "next/link";
import { HeroCarousel } from "./components/hero-carousel";
import { InstagramEmbeds } from "./components/instagram-embeds";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

const researchPrograms = [
  {
    title: "Conservacion y bienestar humano",
    text: "Evaluamos servicios ecosistemicos y salud ambiental para apoyar decisiones publicas y comunitarias.",
    icon: "🌍"
  },
  {
    title: "Estatus y tendencias de biodiversidad",
    text: "Monitoreamos especies y ecosistemas con datos de campo, laboratorio y modelamiento.",
    icon: "📊"
  },
  {
    title: "Factores de cambio biologico",
    text: "Analizamos presiones climaticas y antropicas que transforman la biodiversidad regional.",
    icon: "🔥"
  },
  {
    title: "Integridad de ecosistemas",
    text: "Estudiamos funcionalidad ecologica y aportes de la naturaleza a las personas.",
    icon: "🌱"
  },
];

const integrativePrograms = [
  {
    title: "Biodata y colecciones",
    text: "Unificamos registros biologicos, bases de datos y colecciones para ciencia abierta.",
    icon: "🗃️"
  },
  {
    title: "Laboratorio de invasiones",
    text: "Investigamos dinamicas de especies invasoras y estrategias de control en terreno.",
    icon: "🔬"
  },
  {
    title: "Red socioecologica de largo plazo",
    text: "Sistemas de observacion continua para detectar cambios ecosistemicos con evidencia robusta.",
    icon: "📡"
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
    <main className="w-full overflow-hidden bg-[#f3f7f2]">
      {/* 1. Hero Section */}
      <HeroCarousel />

      {/* 2. Intro Strip / Vida al extremo */}
      <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#11231e] mb-8">
            Ven a explorar la biodiversidad con nosotros
          </h2>
          <div className="h-1 w-24 bg-[#147256] mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-[#39564c] leading-relaxed">
            Integramos trabajo de laboratorio, terreno y analítica de datos para generar evidencia
            útil en políticas públicas, educación y gestión ambiental. Comprendemos y anticipamos
            los riesgos ecosistémicos para proteger la vida en sus condiciones más extremas.
          </p>
        </div>
      </section>

      {/* 3. Programas de Investigacion */}
      <section className="w-full bg-gradient-to-b from-[#eef5ed] to-[#f3f7f2] py-24 px-6 md:px-12 lg:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#11231e] mb-4">Programas de investigación</h2>
            <p className="text-[#46635a] text-lg max-w-2xl mx-auto">Líneas científicas prioritarias del laboratorio orientadas a la excelencia.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchPrograms.map((program, idx) => (
              <article key={program.title} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-2 border border-[#e1ebe4]">
                <div className="text-4xl mb-6 bg-[#f3f7f2] w-16 h-16 rounded-2xl flex items-center justify-center">{program.icon}</div>
                <h3 className="text-xl font-bold text-[#11231e] mb-4 leading-snug">{program.title}</h3>
                <p className="text-[#46635a] leading-relaxed">{program.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Programas Integrativos */}
      <section className="w-full bg-[#11231e] py-24 px-6 md:px-12 lg:px-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#147256]/30 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Programas integrativos</h2>
            <p className="text-[#a8c6ba] text-lg max-w-2xl mx-auto">Infraestructura transversal que fortalece proyectos interdisciplinarios.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrativePrograms.map((program) => (
              <article key={program.title} className="bg-[#173029] rounded-3xl p-8 border border-[#1f4036] hover:bg-[#1a3830] transition-colors duration-300">
                <div className="text-4xl mb-6 opacity-80">{program.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4 leading-snug">{program.title}</h3>
                <p className="text-[#8eab9f] leading-relaxed">{program.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Noticias */}
      <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#e1ebe4] pb-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#11231e] mb-3">Noticias recientes</h2>
              <p className="text-[#46635a] text-lg">Actualidad del laboratorio, convocatorias y publicaciones.</p>
            </div>
            <Link href="/noticias" className="hidden md:inline-flex mt-6 md:mt-0 items-center text-[#147256] font-bold hover:text-[#0f5a45] transition-colors">
              Ver todas las noticias
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          {newsUnavailable ? (
            <div className="bg-[#fdf2f2] border border-[#fbd5d5] rounded-2xl p-8 text-center text-[#9b1c1c]">
              <h3 className="text-xl font-bold mb-2">Noticias no disponibles</h3>
              <p>No se pudo conectar con la base de datos. Inténtalo más tarde.</p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="bg-[#f3f7f2] border border-[#e1ebe4] rounded-2xl p-12 text-center text-[#46635a]">
              <h3 className="text-xl font-bold mb-2 text-[#11231e]">Sin noticias por ahora</h3>
              <p>Pronto compartiremos novedades del laboratorio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <article key={item.id} className="group cursor-pointer">
                  <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-[#f3f7f2] relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={`Imagen de ${item.title}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#a8c6ba] font-bold uppercase tracking-widest text-sm">Sin imagen</div>
                    )}
                  </div>
                  <div className="px-2">
                    <span className="text-sm font-bold text-[#147256] uppercase tracking-wider mb-3 block">{formatDate(item.publishedAt)}</span>
                    <h3 className="text-2xl font-bold text-[#11231e] mb-4 leading-snug group-hover:text-[#147256] transition-colors">
                      <Link href={`/noticias/${item.id}`} className="before:absolute before:inset-0">
                        {item.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Link href="/noticias" className="inline-flex items-center text-[#147256] font-bold hover:text-[#0f5a45] transition-colors">
              Ver todas las noticias
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Instagram & Enlaces */}
      <section className="w-full bg-[#f3f7f2] py-24 px-6 md:px-12 lg:px-24 border-t border-[#e1ebe4]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#11231e] mb-4">Instagram</h2>
            <p className="text-[#46635a] text-lg">Publicaciones recientes de @aefpucv</p>
          </div>

          {instagramPosts.length === 0 ? (
            <div className="bg-white border border-[#e1ebe4] rounded-2xl p-8 text-center text-[#46635a] max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-[#11231e] mb-2">Agrega enlaces de Instagram</h3>
              <p>Actualiza la lista en app/page.tsx para mostrar publicaciones.</p>
            </div>
          ) : (
            <div className="mb-24">
              <InstagramEmbeds posts={instagramPosts} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-[#d6e5da]">
            <div>
              <h3 className="text-lg font-bold text-[#11231e] mb-6">Links de interés</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#46635a] hover:text-[#147256] transition-colors">Portal de biodiversidad nacional</a></li>
                <li><a href="#" className="text-[#46635a] hover:text-[#147256] transition-colors">Red de ciencia abierta</a></li>
                <li><a href="#" className="text-[#46635a] hover:text-[#147256] transition-colors">Repositorio de datos biológicos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#11231e] mb-6">Redes sociales</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#46635a] hover:text-[#147256] transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-[#46635a] hover:text-[#147256] transition-colors">Instagram</a></li>
                <li><a href="#" className="text-[#46635a] hover:text-[#147256] transition-colors">YouTube</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#11231e] mb-6">Contacto</h3>
              <ul className="space-y-4">
                <li className="text-[#46635a]">contacto@labbio.cl</li>
                <li className="text-[#46635a]">+56 2 2000 1000</li>
                <li className="text-[#46635a]">Santiago, Chile</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
