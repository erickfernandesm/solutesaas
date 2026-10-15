import { Mail, Clock } from "lucide-react";
import IconeWhatsApp from "@/components/IconeWhatsApp";
import { contato, waLink } from "@/lib/contato";
import { Button, Container, Reveal } from "@/components/ui";
import Orbitas from "@/components/Orbitas";

export default function CtaFinal({ mensagem, titulo }: { mensagem?: string; titulo?: React.ReactNode }) {
  return (
    <section className="pb-24 pt-10 sm:pb-32 sm:pt-14">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-brand/30 bg-ink-850 px-7 py-16 sm:px-14 sm:py-20">
            {/* No celular o fundo fica sóbrio (sem órbitas e com brilho fraco) para não atrapalhar a leitura. */}
            <Orbitas rotulos={false} className="top-[-80px] hidden opacity-60 lg:flex lg:translate-x-[30%]" />
            <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand/10 blur-[120px] lg:bg-brand/25" aria-hidden="true" />
            <div className="relative grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="font-display text-[clamp(34px,5vw,62px)] font-extrabold leading-[1.02] tracking-[-.04em] text-balance">
                  {titulo ?? <>Veja os sistemas <span className="text-gradient">funcionando</span> na rotina da sua empresa.</>}
                </h2>
                <p className="mt-6 max-w-xl text-[17.5px] text-fog-400">
                  A gente entende como a sua equipe trabalha hoje e mostra, na prática, o que muda. Sem compromisso.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button href={waLink(mensagem)} external whatsapp>Agendar uma demonstração</Button>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { i: IconeWhatsApp, l: "WhatsApp", v: contato.whatsappExibicao },
                  { i: Mail, l: "E-mail", v: contato.email },
                  { i: Clock, l: "Atendimento", v: contato.horario },
                ].map((c) => (
                  <li key={c.l} className="flex items-center gap-4 rounded-2xl border border-ink-600 bg-ink-900/80 p-4 backdrop-blur">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-brand/10 text-brand"><c.i className="h-5 w-5" /></span>
                    <span className="min-w-0">
                      <span className="block text-[11.5px] uppercase tracking-[.14em] text-fog-500">{c.l}</span>
                      <span className="block select-all font-display text-[15.5px] font-semibold">{c.v}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
