import { MessagesSquare, MonitorPlay, Settings2, LifeBuoy } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui";

const passos = [
  { icone: MessagesSquare, titulo: "Conversa", texto: "Entendemos como a sua equipe trabalha hoje e qual dor precisa ser resolvida primeiro." },
  { icone: MonitorPlay, titulo: "Demonstração", texto: "Você vê o sistema funcionando com situações parecidas com as da sua empresa." },
  { icone: Settings2, titulo: "Configuração", texto: "Cadastramos setores, cargos e permissões e ligamos só os módulos que a sua operação usa." },
  { icone: LifeBuoy, titulo: "Acompanhamento", texto: "A equipe da Solute RH acompanha as primeiras semanas e segue no suporte depois disso." },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative border-t border-ink-600 py-12 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          center
          title="Da primeira conversa à equipe usando, com a gente do lado."
          text="Você não recebe só um login. Recebe o sistema configurado para a sua rotina."
        />
        <div className="relative mt-20 grid gap-10 md:grid-cols-4 md:gap-6">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent md:block" aria-hidden="true" />
          {passos.map((p, i) => (
            <Reveal key={p.titulo} delay={i * 0.1}>
              <div className="relative text-center">
                <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-brand/40 bg-ink-900 text-brand shadow-[0_0_40px_-8px_rgba(243,140,35,.55)]">
                  <p.icone className="h-6 w-6" />
                </span>
                <span className="mt-6 block font-mono text-[12px] text-brand">Etapa {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-[20px] font-semibold">{p.titulo}</h3>
                <p className="mx-auto mt-2.5 max-w-[30ch] text-[14.5px] leading-relaxed text-fog-400">{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
