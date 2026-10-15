import { pilares } from "@/data/produtos";
import { Container, CountUp, GlowCard, Reveal, SectionHeading } from "@/components/ui";

export default function Pilares() {
  return (
    <section className="py-12 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Sistemas feitos por uma consultoria de RH, não por quem só vende software."
          text="Antes de virar sistema, cada funcionalidade foi um processo aplicado em empresas reais pela equipe da Solute RH."
        />
        <div className="mt-8 sm:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map((b, i) => (
            <Reveal key={b.titulo} delay={i * 0.06} className="h-full">
              <GlowCard className="h-full">
                <div className="p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                    <b.icone className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-[18px] font-semibold tracking-[-.01em]">{b.titulo}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-fog-400">{b.texto}</p>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4">
          <div className="grid overflow-hidden rounded-3xl border border-ink-600 bg-ink-850 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: <CountUp to={700} prefix="+" />, l: "empresas atendidas pela Solute RH" },
              { v: <CountUp to={96} />, l: "de NPS no 1º semestre de 2026" },
              { v: <CountUp to={5} decimals={1} />, l: "de nota no Google" },
              { v: <CountUp to={16} prefix="+" suffix=" mil" />, l: "profissionais formados, com certificação MEC" },
            ].map((n, i) => (
              <div key={i} className="border-ink-600 p-8 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r">
                <p className="font-display text-[clamp(40px,4.4vw,58px)] font-extrabold leading-none tracking-[-.04em]">{n.v}</p>
                <p className="mt-3 text-[14px] text-fog-500">{n.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
