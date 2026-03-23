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
    <section className="hero-carousel stagger delay-1" aria-label="Galeria de fotos del laboratorio">
      <div className="carousel-window">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <figure
              key={slide.src}
              className={`carousel-slide ${isActive ? "active" : ""}`}
              aria-hidden={!isActive}
            >
              <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 900px) 100vw, 1100px" />
              <figcaption>{slide.caption}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Seleccion de imagen">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.alt}
              type="button"
              className={`dot ${isActive ? "active" : ""}`}
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
