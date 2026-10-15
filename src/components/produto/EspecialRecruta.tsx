"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Target, Megaphone, ScanText, Scale, MessagesSquare, ScrollText, HandHeart, Eye, CircleDashed } from "lucide-react";
import { Container, GlowCard, Reveal, SectionHeading } from "@/components/ui";

const etapas = [
  { icone: FileText, nome: "Requisição", faz: "O cliente preenche a requisição por um link, sem precisar de conta. Se ele mandar o descritivo de cargo ou um anúncio pronto, o sistema lê o documento e extrai os campos.", sai: "Requisição completa no processo e prazo convertido em SLA." },
  { icone: Target, nome: "Perfil ideal", faz: "A partir da requisição, o sistema monta o perfil: família de cargo, senioridade, competências com peso, alvo comportamental, cultural e valores.", sai: "Perfil ajustável e régua de avaliação da vaga." },
  { icone: Megaphone, nome: "Divulgação", faz: "O anúncio é escrito no formato de cada canal: LinkedIn, Catho, InfoJobs, Indeed, WhatsApp, Instagram e abordagem direta. O sistema também gera um link de candidatura: o candidato preenche um formulário sobre as próprias experiências e se candidata por ele.", sai: "Link de candidatura com formulário de experiências, que deixa o match ainda mais assertivo." },
  { icone: ScanText, nome: "Candidatos", faz: "Currículos em PDF, Word e outros formatos são lidos automaticamente. A pasta recebida por e-mail entra de uma vez, com aviso de repetidos.", sai: "Fichas preenchidas e banco de talentos sugerindo nomes." },
  { icone: Scale, nome: "Triagem", faz: "Cada candidato recebe nota por critério, com a evidência ao lado. Quando falta informação, o resultado é \"não identificado\", nunca \"não atende\".", sai: "Ranking com match explicável." },
  { icone: MessagesSquare, nome: "Entrevista e testes", faz: "Roteiro por competências no método STAR e questionários comportamentais enviados por link, com resultado direto no processo.", sai: "Match final: currículo, entrevista, comportamental e cultural." },
  { icone: ScrollText, nome: "Parecer", faz: "O parecer para o cliente sai em texto corrido, sem notas nem percentuais, e pode ser editado. O relatório final reúne os finalistas.", sai: "Parecer, relatório e resumo de status para o cliente." },
];

const principios = [
  { i: HandHeart, t: "A ferramenta apoia, não decide", d: "Nenhum candidato é eliminado automaticamente. A decisão é sempre da recrutadora." },
  { i: Eye, t: "Toda nota mostra a evidência", d: "Você sabe exatamente por que um candidato tem 84 e não 91." },
  { i: CircleDashed, t: "Não identificado não é não atende", d: "Falta de informação no currículo não vira reprovação injusta." },
];

export default function EspecialRecruta() {
  const [sel, setSel] = useState(0);
  const e = etapas[sel];
  return (
    <>
      <section className="relative border-t border-ink-600 bg-ink-900/40 py-12 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            title={<>Da requisição ao parecer, <span className="text-gradient">numa ferramenta só.</span></>}
            text="Toque em cada etapa para ver o que o Solute Recruta faz e o que entrega."
          />

          <Reveal className="mt-8 sm:mt-14">
            <div className="relative">
              <div className="absolute left-0 right-0 top-[27px] hidden h-px bg-ink-500 md:block" aria-hidden="true" />
              <motion.div
                className="absolute left-0 top-[27px] hidden h-px bg-brand md:block"
                animate={{ width: `${(sel / (etapas.length - 1)) * 100}%` }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
              />
              <div role="tablist" aria-label="Etapas do processo" className="relative grid grid-cols-4 gap-y-6 md:grid-cols-7">
                {etapas.map((x, i) => (
                  <button
                    key={x.nome}
                    role="tab"
                    type="button"
                    aria-selected={sel === i}
                    onClick={() => setSel(i)}
                    className="group flex flex-col items-center gap-3 text-center"
                  >
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl border transition ${
                      i <= sel ? "border-brand bg-brand text-[#140A00] shadow-[0_0_30px_-6px_rgba(243,140,35,.7)]" : "border-ink-500 bg-ink-900 text-fog-500 group-hover:text-fog"
                    }`}>
                      <x.icone className="h-6 w-6" />
                    </span>
                    <span className={`text-[13px] font-medium leading-tight ${sel === i ? "text-fog" : "text-fog-500"}`}>{x.nome}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-10 overflow-hidden rounded-3xl border border-ink-500 bg-ink-850">
            <AnimatePresence mode="wait">
              <motion.div
                key={sel}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid gap-8 p-8 sm:p-10 md:grid-cols-[auto_1fr_1fr]"
              >
                <span className="font-display text-[64px] font-extrabold leading-none text-brand/30">{String(sel + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[.16em] text-fog-500">O que acontece</p>
                  <h3 className="mt-2 font-display text-[24px] font-bold">{e.nome}</h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-fog-400">{e.faz}</p>
                </div>
                <div className="rounded-2xl border border-brand/30 bg-brand/[.06] p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[.16em] text-brand">O que sai desta etapa</p>
                  <p className="mt-3 font-display text-[18px] font-semibold leading-snug">{e.sai}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            center
            title="Critério no lugar de achismo."
            text="O Solute Recruta usa um motor de análise com regras claras. Nada de caixa-preta."
          />
          <div className="mt-8 sm:mt-14 grid gap-4 md:grid-cols-3">
            {principios.map((b, k) => (
              <Reveal key={b.t} delay={k * 0.08} className="h-full">
                <GlowCard className="h-full">
                  <div className="p-8">
                    <b.i className="h-7 w-7 text-brand" />
                    <h3 className="mt-6 font-display text-[19px] font-semibold">{b.t}</h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-fog-400">{b.d}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
