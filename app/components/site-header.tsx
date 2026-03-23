"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quienes somos" },
  { href: "/investigacion", label: "Investigacion" },
  { href: "/publicaciones", label: "Publicaciones" },
  { href: "/docencia", label: "Docencia" },
  { href: "/vinculacion", label: "Vinculacion" },
  { href: "/noticias", label: "Noticias" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-mark">
          LabBio
        </Link>

        <nav aria-label="Principal" className="site-nav">
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
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
