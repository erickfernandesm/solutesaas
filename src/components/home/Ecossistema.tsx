import Link from "next/link";
import { ArrowUpRight, CircleCheck, CircleDashed } from "lucide-react";
import { porSlug } from "@/data/produtos";
import { Container, GlowCard, Reveal, SectionHeading, Wordmark } from "@/components/ui";

function Rodape({ slug, publico }: { slug: string; publico: string }) {
  return (
    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
      <span className="text-[13px] text-fog-500">{publico}</span>
      <Link
        href={`/${slug}/`}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-500 px-4 py-2 text-[13px] font-semibold text-fog transition after:absolute after:inset-0 group-hover:border-brand group-hover:text-brand"
      >
        Conhecer <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function Ecossistema() {
  const g = porSlug("gestao")!, p = porSlug("ponto")!, r = porSlug("recruta")!, f = porSlug("forms")!;
  return (
    <section id="ecossistema" className="relative pb-20 pt-6 sm:pb-24 sm:pt-8">
      <Container>
        <SectionHeading
          title={<>Quatro sistemas. <span className="text-fog-500">Cada um resolve uma parte da rotina de pessoas.</span></>}
          text="Contrate só o que a sua empresa precisa agora e some os outros quando fizer sentido. Todos rodam no navegador, sem nada para instalar."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-6">
          {/* Gestão */}
          <Reveal className="lg:col-span-4 lg:row-span-2">
            <GlowCard className="h-full">
              <div className="flex h-full flex-col p-7 sm:p-9">
                <Wordmark sufixo="Gestão" />
                <h3 className="mt-7 max-w-md font-display text-[28px] font-bold leading-tight tracking-[-.02em]">{g.titulo}</h3>
                <p className="mt-3 max-w-lg text-[15.5px] text-fog-400">{g.resumo} Você liga os módulos que a sua operação usa.</p>
                <div className="mt-8 grid gap-2 sm:grid-cols-3">
                  {[
                    ["Tarefas e projetos", true], ["Reuniões e agenda", true], ["Acompanhamento de pessoas", true],
                    ["Assistente no WhatsApp", true], ["Comercial", false], ["Marketing", true],
                    ["Tráfego pago", false], ["Chamados e sugestões", true], ["Forms interno", true],
                  ].map(([m, on]) => (
                    <div key={m as string} className="flex items-center justify-between gap-3 rounded-xl border border-ink-600 bg-ink-900/80 px-3.5 py-2.5">
                      <span className={`text-[13px] ${on ? "text-fog" : "text-fog-500"}`}>{m}</span>
                      <span className={`relative h-[18px] w-8 flex-none rounded-full ${on ? "bg-brand" : "bg-ink-600"}`}>
                        <span className={`absolute top-[3px] h-3 w-3 rounded-full transition ${on ? "left-[17px] bg-[#140A00]" : "left-[3px] bg-fog-500"}`} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink-600 bg-ink-600 sm:grid-cols-3">
                  {g.numeros.map((n) => (
                    <div key={n.rotulo} className="bg-ink-900 p-5">
                      <p className="font-display text-[26px] font-extrabold leading-none tracking-[-.02em] text-brand">{n.valor}</p>
                      <p className="mt-2 text-[13px] text-fog-500">{n.rotulo}</p>
                    </div>
                  ))}
                </div>
                <Rodape slug="gestao" publico={g.publicoCurto} />
              </div>
            </GlowCard>
          </Reveal>

          {/* Ponto */}
          <Reveal className="lg:col-span-2" delay={0.08}>
            <GlowCard className="h-full">
              <div className="flex h-full flex-col p-7">
                <img src="/assets/solute-ponto.svg" alt="Solute Ponto" className="h-11 w-auto self-start" />
                <div className="mt-7 rounded-2xl border border-ink-600 bg-ink-900 p-5">
                  <p className="font-mono text-[44px] font-medium leading-none tracking-tight tabular-nums">08:00</p>
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[12px] text-fog-500">
                    <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ok" /> Entrada · NSR 000184 · comprovante emitido
                  </p>
                </div>
                <p className="mt-5 text-[15px] text-fog-400">{p.resumo}</p>
                <Rodape slug="ponto" publico={p.publicoCurto} />
              </div>
            </GlowCard>
          </Reveal>

          {/* Recruta */}
          <Reveal className="lg:col-span-2" delay={0.16}>
            <GlowCard className="h-full">
              <div className="flex h-full flex-col p-7">
                <img src="/assets/solute-recruta-cor.svg" alt="Solute Recruta" className="h-10 w-auto self-start" />
                <div className="mt-7 flex items-center gap-4 rounded-2xl border border-ink-600 bg-ink-900 p-4">
                  <span className="grid h-14 w-14 flex-none place-items-center rounded-full border-[3px] border-brand font-display text-[19px] font-bold">91</span>
                  <ul className="min-w-0 space-y-1 text-[12.5px]">
                    <li className="flex items-center gap-1.5 text-fog-300"><CircleCheck className="h-3.5 w-3.5 flex-none text-ok" /> Excel avançado</li>
                    <li className="flex items-center gap-1.5 text-fog-300"><CircleCheck className="h-3.5 w-3.5 flex-none text-ok" /> Conciliação bancária</li>
                    <li className="flex items-center gap-1.5 text-fog-500"><CircleDashed className="h-3.5 w-3.5 flex-none" /> Inglês: não identificado</li>
                  </ul>
                </div>
                <p className="mt-5 text-[15px] text-fog-400">{r.resumo}</p>
                <Rodape slug="recruta" publico={r.publicoCurto} />
              </div>
            </GlowCard>
          </Reveal>

          {/* Forms */}
          <Reveal className="lg:col-span-6" delay={0.08}>
            <GlowCard>
              <div className="grid items-center gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_1.3fr]">
                <div className="flex h-full flex-col">
                  <Wordmark sufixo="Forms" />
                  <h3 className="mt-7 font-display text-[26px] font-bold leading-tight tracking-[-.02em]">{f.titulo}</h3>
                  <p className="mt-3 text-[15.5px] text-fog-400">{f.resumo}</p>
                  <Rodape slug="forms" publico={f.publicoCurto} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-ink-600 bg-ink-900 p-5">
                    <div className="h-1 overflow-hidden rounded-full bg-ink-700"><div className="h-full w-2/3 bg-brand" /></div>
                    <p className="mt-3 font-mono text-[11px] text-fog-500">Pergunta 8 de 12</p>
                    <p className="mt-2 font-display text-[16px] font-semibold leading-snug">Você recomendaria a empresa para um amigo?</p>
                    <div className="mt-4 grid grid-cols-5 gap-1.5">
                      {[6, 7, 8, 9, 10].map((n) => (
                        <span key={n} className={`grid h-9 place-items-center rounded-lg border text-[13px] font-semibold ${n === 9 ? "border-brand bg-brand text-[#140A00]" : "border-ink-600 text-fog-400"}`}>{n}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["86%", "conclusão"], ["3m12", "tempo médio"], ["P9", "maior desistência"], ["UTM", "origem de cada resposta"]].map(([v, l]) => (
                      <div key={l} className="rounded-2xl border border-ink-600 bg-ink-900 p-4">
                        <p className="font-display text-[24px] font-bold tabular-nums">{v}</p>
                        <p className="text-[12px] text-fog-500">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
