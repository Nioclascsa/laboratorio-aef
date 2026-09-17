"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "colaboracion", label: "Colaboración" },
  { value: "convenio", label: "Convenio" },
  { value: "evento", label: "Evento" },
  { value: "general", label: "General" },
];

type OutreachItem = {
  id: string;
  title: string;
  body: string;
  category: string;
  publishedAt: string;
  imageUrl: string | null;
};

function getExcerpt(text: string, limit = 220) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

type OutreachGridProps = {
  items: OutreachItem[];
  isAdmin: boolean;
};

export function OutreachGrid({ items, isAdmin }: OutreachGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <section className="hero-banner stagger" aria-label="Encabezado vinculacion" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')" }}>
        <div className="hero-banner-top">
          <span className="badge">Vinculación</span>
          {isAdmin && (
            <Link
              href="/vinculacion/admin"
              className="badge"
              style={{ textDecoration: "none" }}
            >
              Crear entrada
            </Link>
          )}
        </div>
        <h1>Vinculación</h1>
        <p>
          Colaboraciones, convenios y actividades que conectan el laboratorio
          con la comunidad científica, instituciones y el entorno social.
        </p>
      </section>

      {items.length > 0 && (
        <section
          className="outreach-filters stagger delay-1"
          aria-label="Filtrar por categoria"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={`outreach-filter-btn ${activeCategory === cat.value ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </section>
      )}

      {filtered.length === 0 && items.length > 0 ? (
        <section className="outreach-empty stagger delay-2" aria-label="Sin resultados">
          <h3>Sin entradas en esta categoría</h3>
          <p>Prueba seleccionando otra categoría.</p>
        </section>
      ) : null}

      {filtered.length > 0 ? (
        <section
          className="outreach-list stagger delay-2"
          aria-label="Listado de vinculacion"
        >
          {filtered.map((item, index) => (
            <Link
              href={`/vinculacion/${item.id}`}
              className="outreach-row-link"
              key={item.id}
            >
              <article className={`outreach-row ${index % 2 === 1 ? "outreach-row--reverse" : ""}`}>
                {/* Image side */}
                <div
                  className={`outreach-row-media ${item.imageUrl ? "" : "outreach-placeholder"}`}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={`Imagen de ${item.title}`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="outreach-fallback">Vinculación</span>
                  )}
                </div>

                {/* Text side */}
                <div className="outreach-row-body">
                  <div className="outreach-row-meta">
                    <span
                      className="outreach-cat"
                      data-cat={item.category}
                    >
                      {CATEGORIES.find((c) => c.value === item.category)?.label ??
                        item.category}
                    </span>
                    <time className="outreach-row-date">
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{getExcerpt(item.body)}</p>
                  <span className="outreach-row-cta">Ver más →</span>
                </div>
              </article>
            </Link>
          ))}
        </section>
      ) : null}
    </>
  );
}
