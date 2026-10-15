import { Quote } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui";

const marcos = [
  ["2021", "Fundação da Solute RH, atendendo empresas de todo o Brasil."],
  ["2023", "Lançamento da plataforma de cursos online."],
  ["2024", "Certificação MEC em RH Estratégico."],
  ["2025", "Ano de crescimento histórico e premiações nacionais."],
  ["2026", "Lançamento do Solute Cast e dos sistemas próprios da Solute RH."],
];

export default function Sobre() {
  return (
    <section id="sobre" className="relative border-t border-ink-600 bg-ink-900/40 py-20 sm:py-24">
      <Container className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeading
            title={<>Método antes de opinião.</>}
            text="A Solute RH é uma consultoria de gestão de pessoas que estrutura RH em empresas de todos os portes. Os sistemas nasceram da mesma convicção que guia a consultoria: decisão sobre gente se toma com critério, dado real e ferramenta validada."
          />
          <Reveal delay={0.1}>
            <figure className="relative mt-12 overflow-hidden rounded-3xl border border-ink-600 bg-ink-850 p-8">
              <Quote className="absolute right-6 top-6 h-16 w-16 text-brand/15" aria-hidden="true" />
              <blockquote className="relative font-display text-[21px] font-medium leading-snug tracking-[-.01em]">
                &ldquo;A metodologia da Rose é prática, validada e gerou resultados visíveis em poucos meses.&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-[14px] text-fog-500">Riane Lopes, Faculdade Líbano</figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <ol className="relative space-y-0 border-l border-ink-500 pl-8">
            {marcos.map(([ano, texto], i) => (
              <li key={ano} className="relative pb-10 last:pb-0">
                <span className={`absolute -left-[39px] top-1 h-3.5 w-3.5 rounded-full border-2 ${i === marcos.length - 1 ? "border-brand bg-brand shadow-[0_0_20px_rgba(243,140,35,.8)]" : "border-ink-500 bg-ink-900"}`} />
                <p className={`font-display text-[28px] font-bold leading-none ${i === marcos.length - 1 ? "text-brand" : "text-fog"}`}>{ano}</p>
                <p className="mt-2 text-[15px] text-fog-400">{texto}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
