import { SectionPage } from "../components/section-page";

export default function DocenciaPage() {
  return (
    <SectionPage
      eyebrow="En construccion"
      title="Docencia"
      description="Esta seccion esta en preparacion. Pronto compartiremos cursos y actividades docentes."
      blocks={[
        {
          title: "En desarrollo",
          text: "Estamos preparando el contenido para publicarlo.",
        },
        {
          title: "Contacto",
          text: "Si necesitas informacion, escribe a contacto@labbio.cl.",
        },
      ]}
    />
  );
}
