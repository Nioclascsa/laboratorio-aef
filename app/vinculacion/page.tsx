import { SectionPage } from "../components/section-page";

export default function VinculacionPage() {
  return (
    <SectionPage
      eyebrow="En construccion"
      title="Vinculacion"
      description="Esta seccion esta en preparacion. Pronto compartiremos colaboraciones y proyectos."
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
