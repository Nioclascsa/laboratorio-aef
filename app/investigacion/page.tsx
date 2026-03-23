import { SectionPage } from "../components/section-page";

export default function InvestigacionPage() {
  return (
    <SectionPage
      eyebrow="Ciencia"
      title="Investigacion"
      description="Desarrollamos lineas de investigacion en biodiversidad, microbiologia y biotecnologia con enfoque en resultados reproducibles."
      blocks={[
        {
          title: "Lineas activas",
          text: "Microbiota ambiental, ecologia molecular y biologia de sistemas aplicadas a salud y produccion.",
        },
        {
          title: "Repositorio de papers",
          text: "Gestiona articulos, protocolos y reportes en PDF para consulta interna y colaborativa.",
        },
        {
          title: "Infraestructura",
          text: "Integramos analisis computacional, laboratorio humedo y metodologias de datos experimentales.",
        },
      ]}
    />
  );
}
