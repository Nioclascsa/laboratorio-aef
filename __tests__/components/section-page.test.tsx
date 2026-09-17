import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionPage } from "@/app/components/section-page";

describe("SectionPage component", () => {
  it("renders eyebrow, main title and description", () => {
    render(
      <SectionPage
        eyebrow="Docencia"
        title="Cursos y Formación"
        description="Información de asignaturas de pregrado y postgrado."
        blocks={[]}
      />
    );

    expect(screen.getByText("Docencia")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Cursos y Formación" })).toBeInTheDocument();
    expect(screen.getByText("Información de asignaturas de pregrado y postgrado.")).toBeInTheDocument();
  });

  it("renders multiple content blocks", () => {
    const blocks = [
      { title: "Botánica General", text: "Asignatura para primer año de licenciatura." },
      { title: "Ecología Vegetal", text: "Estudio de las comunidades vegetales y su adaptación." },
    ];

    render(
      <SectionPage
        eyebrow="Programas"
        title="Asignaturas"
        description="Lista de asignaturas"
        blocks={blocks}
      />
    );

    expect(screen.getByRole("heading", { level: 3, name: "Botánica General" })).toBeInTheDocument();
    expect(screen.getByText("Asignatura para primer año de licenciatura.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Ecología Vegetal" })).toBeInTheDocument();
    expect(screen.getByText("Estudio de las comunidades vegetales y su adaptación.")).toBeInTheDocument();
  });
});
