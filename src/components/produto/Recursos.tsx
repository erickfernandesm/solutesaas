import { Check, Plus, Puzzle } from "lucide-react";
import type { Produto } from "@/data/produtos";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import { waLink } from "@/lib/contato";

type Grupo = Produto["grupos"][number];

function Item({ it }: { it: Grupo["itens"][number] }) {
  return (
    <li className="flex gap-3 py-3.5">
      <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand/15 text-brand">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-fog">{it.titulo}</span>
        <span className="mt-0.5 block text-[14px] leading-relaxed text-fog-500">{it.texto}</span>
      </span>
    </li>
  );
}

function Titulo({ texto }: { texto: string }) {
  return (
    <h3 className="flex items-center gap-3 border-b border-ink-600 pb-4 font-display text-[13px] font-semibold uppercase tracking-[.16em] text-brand">
      {texto}
    </h3>
  );
}

export default function Recursos({ p }: { p: Produto }) {
  // Com 3 grupos: três colunas. Com número par: grade 2×N. Com número ímpar (>3): os pares na grade
  // e o último grupo ocupa a largura toda, com os itens lado a lado. Assim a grade nunca fica com buraco.
  const n = p.grupos.length;
  const ultimoLargo = n > 3 && n % 2 === 1;
  const grade = ultimoLargo ? p.grupos.slice(0, -1) : p.grupos;
  const largo = ultimoLargo ? p.grupos[n - 1] : null;
  return (
    <section id="recursos" className="border-t border-ink-600 bg-ink-900/40 py-20 sm:py-24">
      <Container>
        <SectionHeading title={`Tudo o que vem no ${p.nome}.`} />
        <div className={`mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 ${n === 3 ? "lg:grid-cols-3" : ""}`}>
          {grade.map((g, gi) => (
            <Reveal key={g.titulo} delay={(gi % 2) * 0.06}>
              <Titulo texto={g.titulo} />
              <ul className="mt-2">
                {g.itens.map((it) => <Item key={it.titulo} it={it} />)}
              </ul>
            </Reveal>
          ))}
        </div>
        {largo && (
          <Reveal className="mt-10">
            <Titulo texto={largo.titulo} />
            <ul className="mt-2 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
              {largo.itens.map((it) => <Item key={it.titulo} it={it} />)}
            </ul>
          </Reveal>
        )}
        {p.sobMedida && (
          <Reveal className="mt-16">
            <div className="relative overflow-hidden rounded-3xl border border-brand/40 bg-ink-850">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-[90px]" aria-hidden="true" />
              <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-[#140A00]">
                    <Puzzle className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-[clamp(24px,2.6vw,32px)] font-bold leading-tight tracking-[-.02em]">{p.sobMedida.titulo}</h3>
                  <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-fog-400">{p.sobMedida.texto}</p>
                  <Button href={waLink(`${p.mensagem} Tenho uma necessidade específica.`)} external whatsapp className="mt-7">
                    Contar o que a minha empresa precisa
                  </Button>
                </div>
                <ul className="space-y-2.5">
                  {p.sobMedida.exemplos.map((ex) => (
                    <li key={ex} className="flex items-center gap-3 rounded-2xl border border-ink-600 bg-ink-900/80 px-4 py-3.5 text-[14.5px] text-fog-300">
                      <Plus className="h-4 w-4 flex-none text-brand" />
                      {ex}
                    </li>
                  ))}
                  <li className="px-4 pt-1 text-[12.5px] text-fog-600">Exemplos do que pode ser desenvolvido.</li>
                </ul>
              </div>
            </div>
          </Reveal>
        )}
        {p.nota && (
          <Reveal>
            <p className="mt-14 rounded-2xl border border-brand/25 bg-brand/[.06] p-5 text-[14.5px] leading-relaxed text-fog-300">
              {p.nota}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
