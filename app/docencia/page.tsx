import { SectionPage } from "../components/section-page";

export default function DocenciaPage() {
  return (
    <SectionPage
      eyebrow="Formacion"
      title="Docencia"
      description="Promovemos aprendizaje basado en evidencia mediante cursos, seminarios y acompanamiento de tesistas en biologia."
      blocks={[
        {
          title: "Cursos",
          text: "Asignaturas de biologia celular, microbiologia y metodos de investigacion cientifica.",
        },
        {
          title: "Seminarios",
          text: "Ciclos periodicos con invitados nacionales e internacionales en temas emergentes.",
        },
        {
          title: "Mentoria",
          text: "Acompaniamiento de pregrado y posgrado en escritura cientifica y gestion de datos.",
        },
      ]}
    />
  );
}
