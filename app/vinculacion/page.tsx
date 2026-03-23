import { SectionPage } from "../components/section-page";

export default function VinculacionPage() {
  return (
    <SectionPage
      eyebrow="Colaboracion"
      title="Vinculacion"
      description="Articulamos trabajo con instituciones publicas, centros de salud, industria y comunidades para transferir conocimiento biologico."
      blocks={[
        {
          title: "Convenios",
          text: "Mantenemos alianzas para co-ejecutar proyectos y compartir capacidades tecnicas.",
        },
        {
          title: "Extension",
          text: "Impulsamos actividades de divulgacion cientifica para escolares y organizaciones locales.",
        },
        {
          title: "Servicios",
          text: "Ofrecemos apoyo analitico y asesorias en procesos biologicos de interes aplicado.",
        },
      ]}
    />
  );
}
