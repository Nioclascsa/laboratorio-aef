"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quienes somos" },
  { href: "/publicaciones", label: "Publicaciones" },
  { href: "/noticias", label: "Noticias" },
  { href: "/vinculacion", label: "Vinculación" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-mark">
          <Link href="/" className="brand-logo-link" aria-label="Ir al inicio" onClick={closeMenu}>
            <Image
              src="/AEF_Logo_Horizontal_blanco.png"
              alt="Logo Laboratorio de Anatomía y Ecología Funcional de Plantas"
              width={270}
              height={70}
              className="brand-logo"
              priority
            />
          </Link>
        </div>

        <nav aria-label="Principal" className={`site-nav ${isOpen ? "open" : ""}`}>
          {menu.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-right">
          <a
            href="https://www.pucv.cl/uuaa/site/edic/base/port/instituto_de_biologia.html"
            target="_blank"
            rel="noopener noreferrer"
            className="institute-logo-link"
            aria-label="Instituto de Biología PUCV"
          >
            <Image
              src="/Instituto_de_Biologia_BLANCO.png"
              alt="Logo Instituto de Biología PUCV"
              width={240}
              height={93}
              className="institute-logo"
              priority
            />
          </a>

          <button
            className={`hamburger-btn ${isOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
