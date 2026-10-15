"use client";

import { useState } from "react";
import { ChevronDown, Clock, ClipboardList, UserSearch, LifeBuoy, ArrowUpRight } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui";
import IconeWhatsApp from "@/components/IconeWhatsApp";

type Chave = "recruta" | "ponto" | "forms" | "whats";

const ligacoes: { chave: Chave; n: number; nome: string; texto: string }[] = [
  { chave: "recruta", n: 1, nome: "Solute Recruta", texto: "Fica em \"Outros Sistemas\", no menu do Gestão. Um clique e a equipe está nos processos seletivos." },
  { chave: "ponto", n: 2, nome: "Solute Ponto", texto: "Também em \"Outros Sistemas\". E os chamados de suporte do Ponto são tratados dentro do Gestão." },
  { chave: "forms", n: 3, nome: "Solute Forms", texto: "Já vem no menu do Gestão: formulários internos para a equipe e o SoluteForms para o público." },
  { chave: "whats", n: 4, nome: "WhatsApp", texto: "O assistente manda o resumo do dia às 08:30 e responde \"o que tenho hoje?\"." },
];

function IconeLigacao({ chave }: { chave: Chave }) {
  const cls = "h-4 w-4 text-brand";
  if (chave === "recruta") return <UserSearch className={cls} />;
  if (chave === "ponto") return <Clock className={cls} />;
  if (chave === "forms") return <ClipboardList className={cls} />;
  return <IconeWhatsApp className={cls} />;
}

/** Número que liga o item da lista ao ponto do menu. */
function Marca({ n, ativo }: { n: number; ativo: boolean }) {
  return (
    <span className={`grid h-5 w-5 flex-none place-items-center rounded-full text-[10.5px] font-bold transition ${ativo ? "bg-brand text-[#140A00]" : "bg-ink-600 text-fog-400"}`}>
      {n}
    </span>
  );
}

export default function Conexoes() {
  const [ativo, setAtivo] = useState<Chave | null>(null);
  const aceso = (c: Chave) => ativo === null || ativo === c;
  const item = (c: Chave) =>
    `flex items-center gap-2 rounded-md px-3 py-[7px] text-[13px] font-medium transition-all duration-300 ${
      ativo === c ? "bg-[#f47a1f] text-white shadow-[0_0_24px_-4px_rgba(244,122,31,.8)]" : "text-slate-300"
    } ${aceso(c) ? "opacity-100" : "opacity-40"}`;

  return (
    <section className="relative overflow-hidden border-y border-ink-600 bg-ink-900/40 py-12 sm:py-20 lg:py-24">
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            title={<>O Solute Gestão é o <span className="text-gradient">centro da operação.</span></>}
            text="Cada sistema funciona sozinho. Quando a empresa usa mais de um, o Gestão vira o ponto de partida da equipe. Passe o mouse (ou toque) nos itens para ver onde cada um aparece."
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-2" onMouseLeave={() => setAtivo(null)}>
              {ligacoes.map((l) => (
                <li key={l.chave}>
                  <button
                    type="button"
                    onMouseEnter={() => setAtivo(l.chave)}
                    onFocus={() => setAtivo(l.chave)}
                    onClick={() => setAtivo((a) => (a === l.chave ? null : l.chave))}
                    className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                      ativo === l.chave ? "border-brand/50 bg-brand/[.06]" : "border-ink-600 bg-ink-850/60 hover:border-ink-500"
                    }`}
                  >
                    <Marca n={l.n} ativo={ativo === l.chave} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-display text-[15.5px] font-semibold">
                        <IconeLigacao chave={l.chave} />
                        {l.nome}
                      </span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-fog-400">{l.texto}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Menu lateral do Solute Gestão, como no sistema, com os pontos de ligação numerados */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-left shadow-[0_40px_100px_-30px_rgba(0,0,0,.9)]">
              <div className="flex items-center justify-between gap-3 px-2 pb-4">
                <img src="/assets/solute-horizontal-branca.png" alt="Solute RH" className="h-8 w-auto" />
                <span className="truncate rounded-md border border-slate-700 px-2 py-1 font-mono text-[10.5px] text-slate-400">sistema.soluterh.com.br</span>
              </div>
              <ul className="space-y-0.5">
                <li className="rounded-md px-3 py-[7px] text-[13px] font-medium text-slate-300">Painel</li>
                <li className="flex items-center justify-between rounded-md px-3 py-[7px] text-[13px] font-medium text-slate-300">
                  Agenda <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </li>
                <li>
                  <span className={`flex items-center justify-between rounded-md px-3 py-[7px] text-[13px] font-medium text-white transition-opacity ${aceso("forms") ? "" : "opacity-40"}`}>
                    <span className="flex items-center gap-2">Forms <Marca n={3} ativo={ativo === "forms"} /></span>
                    <ChevronDown className="h-3.5 w-3.5 rotate-180 text-slate-400" />
                  </span>
                  <ul className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-[#f47a1f] pl-2">
                    <li className={item("forms")}>Forms Interno</li>
                    <li className={item("forms")}>SoluteForms</li>
                  </ul>
                </li>
                <li className={item("ponto")}>
                  <LifeBuoy className="h-3.5 w-3.5" /> Chamados do Ponto
                </li>
                <li className="rounded-md px-3 py-[7px] text-[13px] font-medium text-slate-300">Equipe</li>
                <li>
                  <span className={`flex items-center justify-between rounded-md px-3 py-[7px] text-[13px] font-medium text-white transition-opacity ${aceso("recruta") || aceso("ponto") ? "" : "opacity-40"}`}>
                    <span className="flex items-center gap-2">
                      Outros Sistemas <Marca n={1} ativo={ativo === "recruta"} /> <Marca n={2} ativo={ativo === "ponto"} />
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 rotate-180 text-slate-400" />
                  </span>
                  <ul className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-[#f47a1f] pl-2">
                    <li className={item("recruta") + " justify-between"}>
                      <span className="flex items-center gap-2"><UserSearch className="h-3.5 w-3.5" /> Solute Recruta</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                    </li>
                    <li className={item("ponto") + " justify-between"}>
                      <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Solute Ponto</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* mensagem do assistente no WhatsApp */}
            <div
              className={`relative ml-auto mt-4 w-[80%] rounded-2xl border bg-[#0b141a] p-3.5 shadow-2xl transition-all duration-300 lg:-mr-10 ${
                ativo === "whats" ? "scale-[1.03] border-[#25d366]/60" : "border-slate-700"
              } ${aceso("whats") ? "opacity-100" : "opacity-40"}`}
            >
              <p className="flex items-center gap-2 text-[11.5px] font-semibold text-[#25d366]">
                <IconeWhatsApp className="h-3.5 w-3.5" /> Assistente Solute
                <span className="ml-auto"><Marca n={4} ativo={ativo === "whats"} /></span>
              </p>
              <p className="mt-2 rounded-lg rounded-tl-sm bg-[#202c33] px-3 py-2 text-[12.5px] leading-snug text-slate-100">
                Bom dia, Lívia! Hoje você tem 3 entregas e 1 reunião às 16:00.
                <span className="mt-1 block text-right font-mono text-[10px] text-slate-400">08:30</span>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
