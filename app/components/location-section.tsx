"use client";

import { useState } from "react";

type ViewMode = "map" | "satellite" | "streetview";

export function LocationSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");

  const address = "Avenida Universidad 330, Valparaíso, Chile";
  const reference =
    "Laboratorio BIO 306, tercer piso, Instituto de Biología, Facultad de Ciencias, Campus Curauma, PUCV";
  const mapsSearchUrl = "https://www.google.com/maps/search/?api=1&query=Avenida+Universidad+330+Curauma+Valparaiso+PUCV";

  // Google Maps embed URLs for Campus Curauma PUCV (-33.1471, -71.5707)
  const streetViewEmbedUrl =
    "https://maps.google.com/maps?layer=c&cbll=-33.1471,-71.5707&cbp=12,25,0,0,0&output=svembed";
  const satelliteEmbedUrl =
    "https://maps.google.com/maps?q=-33.1471,-71.5707&t=k&z=17&ie=UTF8&iwloc=&output=embed";
  const standardMapEmbedUrl =
    "https://maps.google.com/maps?q=Campus+Curauma+PUCV+Avenida+Universidad+330+Valparaiso&t=m&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-24 border-t border-[#d8ddd9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 pb-4 border-b border-[#e2e6e3]">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#28282b]">
            Donde estamos
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Mapa interactivo grande con selector de vistas */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#d8ddd9] bg-[#eef2ef]">
              {/* Embed Frame */}
              <iframe
                title="Mapa de ubicación - Laboratorio AEF"
                src={
                  viewMode === "streetview"
                    ? streetViewEmbedUrl
                    : viewMode === "satellite"
                    ? satelliteEmbedUrl
                    : standardMapEmbedUrl
                }
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* View Switcher Overlay */}
              <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-md border border-gray-200 z-10">
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    viewMode === "map"
                      ? "bg-[#1c6576] text-white shadow-sm"
                      : "text-[#5a5a60] hover:text-[#28282b]"
                  }`}
                  title="Mapa estándar"
                >
                  Mapa
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("satellite")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    viewMode === "satellite"
                      ? "bg-[#1c6576] text-white shadow-sm"
                      : "text-[#5a5a60] hover:text-[#28282b]"
                  }`}
                  title="Vista satelital"
                >
                  Satélite
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("streetview")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    viewMode === "streetview"
                      ? "bg-[#1c6576] text-white shadow-sm"
                      : "text-[#5a5a60] hover:text-[#28282b]"
                  }`}
                  title="Vista 360° de la calle"
                >
                  Street View
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dirección, Abrir en Maps & Redes Sociales */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-[#f8faf9] p-6 sm:p-8 rounded-2xl border border-[#e2e6e3] shadow-sm">
            {/* Dirección */}
            <div>
              <div className="border-b border-[#e2e6e3] pb-3 mb-4">
                <h3 className="text-2xl font-bold text-[#28282b] font-heading">
                  Dirección:
                </h3>
              </div>
              <ul className="space-y-3.5 text-[#404045] text-base leading-relaxed mb-6">
                <li className="flex items-start">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1c6576] mt-1.5 mr-3 flex-shrink-0" />
                  <span className="font-semibold text-[#28282b]">{address}</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1c6576] mt-1.5 mr-3 flex-shrink-0" />
                  <span>{reference}</span>
                </li>
              </ul>

              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1c6576] hover:bg-[#145562] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all group"
              >
                <span>Abrir en Maps</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            {/* Nuestras Redes Sociales */}
            <div className="pt-6 border-t border-[#e2e6e3]">
              <h3 className="text-xl font-bold text-[#28282b] font-heading mb-4">
                Nuestras Redes Sociales:
              </h3>
              <div className="flex items-center gap-4">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/aefpucv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram del Laboratorio AEF"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  }}
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook del Laboratorio AEF"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#1877F2] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube del Laboratorio AEF"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FF0000] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
