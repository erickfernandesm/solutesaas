"use client";

import { useState } from "react";
import {
  ListChecks, ChevronDownSquare, Image, ToggleLeft, Star, Gauge, Grid3x3, Mail, Phone, Calendar, Globe,
  Type, AlignLeft, Hash, Quote, Layers, Upload, HeartHandshake, Target, CalendarCheck, Megaphone,
} from "lucide-react";
import { Container, GlowCard, Reveal, SectionHeading } from "@/components/ui";

const familias = [
  { nome: "Escolhas", tipos: [[ListChecks, "Múltipla escolha"], [ChevronDownSquare, "Menu suspenso"], [Image, "Escolha de imagem"], [ToggleLeft, "Sim ou não"]] },
  { nome: "Avaliação", tipos: [[Star, "Avaliação com ícones"], [Gauge, "Escala de opinião"], [Grid3x3, "Matriz"]] },
  { nome: "Contato", tipos: [[Mail, "E-mail"], [Phone, "Telefone"], [Calendar, "Data"], [Globe, "Website"]] },
  { nome: "Texto e número", tipos: [[Type, "Texto curto"], [AlignLeft, "Texto longo"], [Hash, "Número"]] },
  { nome: "Estrutura", tipos: [[Quote, "Declaração"], [Layers, "Grupo"]] },
  { nome: "Arquivo", tipos: [[Upload, "Upload"]] },
] as const;

const usos = [
  { i: HeartHandshake, t: "Pesquisa de clima", d: "Escalas, matriz e texto livre. Dentro do Gestão, pode ser anônima de verdade." },
  { i: Target, t: "Captação de leads", d: "UTM em cada resposta e Kanban para o comercial dar seguimento." },
  { i: CalendarCheck, t: "Inscrições", d: "Eventos, treinamentos e processos, com bloqueio de e-mail repetido." },
  { i: Megaphone, t: "Campanhas", d: "QR code para materiais impressos e telas finais com redirecionamento." },
];

export default function EspecialForms() {
  const [fam, setFam] = useState<number | null>(null);
  return (
    <>
      <section className="relative overflow-hidden border-t border-ink-600 bg-ink-900/40 py-20 sm:py-24">
        <Container>
          <SectionHeading
            title={<>Pergunte do jeito certo <span className="text-gradient">para cada resposta.</span></>}
            text="Seis famílias de perguntas, com regras por pergunta: obrigatória, embaralhar opções, limite de escolhas, mínimo e máximo, opção Outro."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {familias.map((f, i) => (
              <Reveal key={f.nome} delay={(i % 3) * 0.06} className="h-full">
                <div
                  onMouseEnter={() => setFam(i)}
                  onMouseLeave={() => setFam(null)}
                  className={`h-full rounded-3xl border p-6 transition ${fam === i ? "border-brand/50 bg-brand/[.05]" : "border-ink-600 bg-ink-850"}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[17px] font-semibold">{f.nome}</h3>
                    <span className="font-mono text-[12px] text-fog-600">{f.tipos.length} {f.tipos.length > 1 ? "tipos" : "tipo"}</span>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {f.tipos.map(([Ic, nome]) => (
                      <li key={nome} className="flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-900 px-3 py-2 text-[13.5px] text-fog-300">
                        <Ic className="h-4 w-4 text-brand" />
                        {nome}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading center title="Um formulário para cada conversa da empresa." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {usos.map((b, k) => (
              <Reveal key={b.t} delay={k * 0.06} className="h-full">
                <GlowCard className="h-full">
                  <div className="p-7">
                    <b.i className="h-7 w-7 text-brand" />
                    <h3 className="mt-6 font-display text-[18px] font-semibold">{b.t}</h3>
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
