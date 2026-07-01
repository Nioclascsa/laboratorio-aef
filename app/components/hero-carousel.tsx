"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

const slides: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1600&q=80",
    alt: "Investigadora observando muestras biologicas en laboratorio",
    caption: "Investigacion de biodiversidad con estandares de excelencia.",
  },
  {
    src: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=1600&q=80",
    alt: "Estudio de plantas y ecosistemas en trabajo de campo",
    caption: "Trabajo en terreno para entender cambios ecosistemicos.",
  },
  {
    src: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80",
    alt: "Equipo analizando datos cientificos en computador",
    caption: "Datos, docencia y transferencia hacia la sociedad.",
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = useMemo(() => slides.length, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black" aria-label="Galeria de fotos del laboratorio">
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <figure
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100" : "opacity-0"}`}
              aria-hidden={!isActive}
            >
              <Image src={slide.src} alt={slide.alt} fill className="object-cover" sizes="100vw" priority={index === 0} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            </figure>
          );
        })}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-green-300 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
          Centro de investigación biológica
        </span>
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 max-w-5xl font-heading leading-tight drop-shadow-lg">
          Laboratorio Científico de Biología Aplicada
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl font-light drop-shadow-md">
          Institución dedicada a investigación científica de excelencia, docencia y transferencia de conocimiento para la conservación de la biodiversidad.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
           <a href="/proyecto" className="bg-[#147256] hover:bg-[#0f5a45] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
             Nuestro Proyecto
           </a>
           <a href="/publicaciones" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
             Publicaciones
           </a>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3" role="tablist" aria-label="Seleccion de imagen">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.alt}
              type="button"
              className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? "bg-[#147256] scale-125" : "bg-white/50 hover:bg-white/80"}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-selected={isActive}
              role="tab"
            />
          );
        })}
      </div>
    </section>
  );
}
