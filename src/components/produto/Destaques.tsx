import type { Produto } from "@/data/produtos";
import { Container, Reveal, SectionHeading } from "@/components/ui";

/** Título fixo à esquerda; à direita, os destaques em lista de duas colunas. */
export default function Destaques({ p }: { p: Produto }) {
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[.8fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading title={`O que o ${p.nome} muda na rotina.`} text={p.resumo} />
        </div>

        <div className="grid gap-x-10 sm:grid-cols-2">
          {p.destaques.map((d, i) => (
            <Reveal key={d.titulo} delay={(i % 2) * 0.06}>
              <div className="group h-full border-t border-ink-600 py-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-[#140A00]">
                    <d.icone className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-[18px] font-semibold leading-tight tracking-[-.01em]">{d.titulo}</h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-fog-400">{d.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
