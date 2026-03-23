import { SectionPage } from "../components/section-page";

export default function NoticiasPage() {
  return (
    <SectionPage
      eyebrow="Actualidad"
      title="Noticias"
      description="Publicamos novedades sobre avances cientificos, convocatorias, eventos y resultados de proyectos del laboratorio."
      blocks={[
        {
          title: "Convocatorias",
          text: "Anuncios de pasantias, tesis y oportunidades de colaboracion para estudiantes e investigadores.",
        },
        {
          title: "Publicaciones",
          text: "Difusion de articulos recientes y avances destacados del equipo en revistas especializadas.",
        },
        {
          title: "Eventos",
          text: "Agenda de congresos, jornadas y actividades abiertas organizadas por el laboratorio.",
        },
      ]}
    />
  );
}
