type SectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  blocks: Array<{
    title: string;
    text: string;
  }>;
};

export function SectionPage({ eyebrow, title, description, blocks }: SectionPageProps) {
  return (
    <main className="hero-grid section-page">
      <section className="hero stagger">
        <span className="badge">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <section className="cards stagger delay-1" aria-label={`${title} contenido`}>
        {blocks.map((block) => (
          <article className="card" key={block.title}>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
