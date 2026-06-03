import { SectionPage } from "../components/section-page";

export default function InvestigacionPage() {
  return (
    <SectionPage
      eyebrow="En construccion"
      title="Investigacion"
      description="Esta seccion esta en preparacion. Pronto compartiremos lineas de investigacion y avances del laboratorio."
      blocks={[
        {
          title: "En desarrollo",
          text: "Estamos organizando contenidos y proyectos para publicarlos aqui.",
        },
        {
          title: "Contacto",
          text: "Si necesitas informacion, escribe a contacto@labbio.cl.",
        },
      ]}
    />
  );
}
