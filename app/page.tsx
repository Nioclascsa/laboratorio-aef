import Link from "next/link";
import { HeroCarousel } from "./components/hero-carousel";
import { InstagramEmbeds } from "./components/instagram-embeds";
import { LocationSection } from "./components/location-section";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

const researchLines = [
  {
    title: "Ecología funcional de plantas",
    text: "Estudiamos los patrones y mecanismos de respuesta al ambiente de las plantas.",
  },
  {
    title: "Interacciones planta-microorganismos",
    text: "Estudiamos asociaciones mutualistas entre plantas y microorganismos que modulan su evolución, distribución y comportamiento.",
  },
  {
    title: "Innovación para la conservación",
    text: "Generamos soluciones basadas en la naturaleza para la restauración y conservación de ecosistemas de turbera.",
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
  "https://www.instagram.com/p/DbA5BZDkXHq/",
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
    <main className="w-full overflow-hidden bg-[#f5f7f5]">
      {/* 1. Hero Section */}
      <HeroCarousel />

      {/* 2. Intro Strip / Vida al extremo */}
      <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#28282b] mb-8">
            Ven a explorar la biodiversidad con nosotros
          </h2>
          <div className="h-1 w-24 bg-[#f78117] mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-[#5a5a60] leading-relaxed">
            Conectamos la ciencia y la naturaleza a través de experiencias de aprendizaje,
            divulgación y trabajo colaborativo. Acercamos el conocimiento científico a estudiantes,
            comunidades y organizaciones, promoviendo una comprensión más profunda de la biodiversidad
            y de los procesos ecológicos que sustentan la vida en distintos ambientes.
          </p>
        </div>
      </section>

      {/* 3. Líneas de Investigación */}
      <section id="lineas-de-investigacion" className="w-full bg-gradient-to-b from-[#f0f4f1] to-[#f5f7f5] py-24 px-6 md:px-12 lg:px-24 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#28282b] mb-4">Líneas de investigación</h2>
            <p className="text-[#5a5a60] text-lg max-w-2xl mx-auto">Líneas científicas prioritarias del laboratorio orientadas a la excelencia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchLines.map((program) => (
              <article key={program.title} className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-2 border border-[#d8ddd9] flex flex-col">
                <div className="w-12 h-1 bg-[#1c6576] rounded-full mb-6" />
                <h3 className="text-2xl font-heading font-bold text-[#28282b] mb-4 leading-snug">{program.title}</h3>
                <p className="text-[#5a5a60] text-lg md:text-xl leading-relaxed flex-grow">{program.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>



      {/* 5. Noticias */}
      <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#d8ddd9] pb-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#28282b] mb-3">Noticias recientes</h2>
              <p className="text-[#5a5a60] text-lg">Actualidad del laboratorio, convocatorias y publicaciones.</p>
            </div>
            <Link href="/noticias" className="hidden md:inline-flex mt-6 md:mt-0 items-center text-[#1c6576] font-bold hover:text-[#145562] transition-colors">
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
            <div className="bg-[#f5f7f5] border border-[#d8ddd9] rounded-2xl p-12 text-center text-[#5a5a60]">
              <h3 className="text-xl font-bold mb-2 text-[#28282b]">Sin noticias por ahora</h3>
              <p>Pronto compartiremos novedades del laboratorio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <article key={item.id} className="group cursor-pointer">
                  <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-[#f5f7f5] relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={`Imagen de ${item.title}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#a0a0a8] font-bold uppercase tracking-widest text-sm">Sin imagen</div>
                    )}
                  </div>
                  <div className="px-2">
                    <span className="text-sm font-bold text-[#f78117] uppercase tracking-wider mb-3 block">{formatDate(item.publishedAt)}</span>
                    <h3 className="text-2xl font-bold text-[#28282b] mb-4 leading-snug group-hover:text-[#1c6576] transition-colors">
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
            <Link href="/noticias" className="inline-flex items-center text-[#1c6576] font-bold hover:text-[#145562] transition-colors">
              Ver todas las noticias
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Instagram */}
      <section className="w-full bg-[#f5f7f5] py-20 px-6 md:px-12 lg:px-24 border-t border-[#d8ddd9]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#28282b] mb-4">Instagram</h2>
            <p className="text-[#5a5a60] text-lg">Publicaciones recientes de @aefpucv</p>
          </div>

          {instagramPosts.length === 0 ? (
            <div className="bg-white border border-[#d8ddd9] rounded-2xl p-8 text-center text-[#5a5a60] max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-[#28282b] mb-2">Agrega enlaces de Instagram</h3>
              <p>Actualiza la lista en app/page.tsx para mostrar publicaciones.</p>
            </div>
          ) : (
            <div>
              <InstagramEmbeds posts={instagramPosts} />
            </div>
          )}
        </div>
      </section>

      {/* 6. Dónde estamos / Mapa, Street View y Ubicación */}
      <LocationSection />

      {/* 7. Footer / Enlaces institucionales */}
      <footer className="w-full bg-[#1c6576] text-white py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/20">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white font-heading">Laboratorio AEF</h3>
              <p className="text-white/85 text-base leading-relaxed">
                Laboratorio de Anatomía y Ecología Funcional de Plantas, Pontificia Universidad Católica de Valparaíso. Generamos investigación científica de frontera para la conservación de la biodiversidad.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white font-heading">Enlaces de interés</h3>
              <ul className="space-y-3 text-base">
                <li>
                  <a href="https://www.pucv.cl" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white transition-colors">
                    Pontificia Universidad Católica de Valparaíso
                  </a>
                </li>
                <li>
                  <a href="https://www.pucv.cl/uuaa/site/edic/base/port/instituto_de_biologia.html" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white transition-colors">
                    Instituto de Biología PUCV
                  </a>
                </li>
                <li>
                  <Link href="/publicaciones" className="text-white/85 hover:text-white transition-colors">
                    Repositorio de publicaciones AEF
                  </Link>
                </li>
                <li>
                  <Link href="/noticias" className="text-white/85 hover:text-white transition-colors">
                    Noticias y novedades
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white font-heading">Contacto y Ubicación</h3>
              <ul className="space-y-3 text-white/85 text-base leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-lg leading-none">✉️</span>
                  <span>
                    Envía tus consultas a:{" "}
                    <a href="mailto:cristian.atala@pucv.cl" className="text-white hover:underline transition-colors font-medium">
                      cristian.atala@pucv.cl
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg leading-none">📍</span>
                  <span>Dirección: Avenida Universidad 330, Valparaíso, Chile.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg leading-none">🏛️</span>
                  <span>Laboratorio BIO 306, tercer piso, Instituto de Biología, Facultad de Ciencias, Campus Curauma, PUCV.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg leading-none">📸</span>
                  <span>
                    Instagram:{" "}
                    <a
                      href="https://www.instagram.com/aefpucv/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline transition-colors font-medium"
                    >
                      @aefpucv
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg leading-none">🌐</span>
                  <span>
                    Web Instituto de Biología:{" "}
                    <a
                      href="https://www.pucv.cl/uuaa/site/edic/base/port/instituto_de_biologia.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline transition-colors font-medium"
                    >
                      Ver sitio web
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-white/70 gap-4">
            <p>© {new Date().getFullYear()} Laboratorio AEF - PUCV. Todos los derechos reservados.</p>
            <p>Valparaíso, Chile</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
