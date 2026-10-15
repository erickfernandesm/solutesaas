"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  KanbanSquare, CalendarDays, Users, MessageSquare, ClipboardList, Repeat, LifeBuoy,
  Briefcase, Megaphone, BarChart3, KeyRound, Home, Bot,
} from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui";

const modulos = [
  { id: "tarefas", icone: KanbanSquare, nome: "Tarefas e projetos", desc: "Lista, Kanban, recorrência e tempo gasto", grupo: "Rotina" },
  { id: "reunioes", icone: CalendarDays, nome: "Reuniões e agenda", desc: "Google Meet, Agenda e reuniões recorrentes", grupo: "Rotina" },
  { id: "rotina", icone: Repeat, nome: "Rotina e lembretes", desc: "Itens com horário e funções atribuídas", grupo: "Rotina" },
  { id: "pessoas", icone: Users, nome: "Avaliar time", desc: "Reconhecimentos, feedbacks e trajetória", grupo: "Pessoas" },
  { id: "chat", icone: MessageSquare, nome: "Chat e assistente", desc: "Conversas e base de conhecimento", grupo: "Pessoas" },
  { id: "forms", icone: ClipboardList, nome: "Forms", desc: "Pesquisas internas e formulários públicos", grupo: "Pessoas" },
  { id: "chamados", icone: LifeBuoy, nome: "Chamados e sugestões", desc: "Pedidos internos e ideias da equipe", grupo: "Pessoas" },
  { id: "comercial", icone: Briefcase, nome: "Comercial", desc: "Leads, propostas, contratos e carteira", grupo: "Áreas" },
  { id: "marketing", icone: Megaphone, nome: "Marketing", desc: "Planner, calendário editorial e blog", grupo: "Áreas" },
  { id: "trafego", icone: BarChart3, nome: "Tráfego pago", desc: "Anúncios do Meta ligados às vendas", grupo: "Áreas" },
  { id: "cofre", icone: KeyRound, nome: "Cofre de senhas", desc: "Acessos da empresa guardados com segurança", grupo: "Áreas" },
];

export default function EspecialGestao() {
  const [on, setOn] = useState<string[]>(["tarefas", "reunioes", "pessoas", "chat", "forms"]);
  const toggle = (id: string) => setOn((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  const ativos = modulos.filter((m) => on.includes(m.id));

  return (
    <>
      <section className="relative overflow-hidden border-t border-ink-600 bg-ink-900/40 py-12 sm:py-20 lg:py-24">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_70%)]" aria-hidden="true" />
        <Container className="relative">
          <SectionHeading
            title={<>Monte o Solute Gestão <span className="text-gradient">do jeito da sua empresa.</span></>}
            text="Cada empresa liga os módulos que usa. O menu da equipe mostra só o que foi contratado, e as permissões definem o que cada pessoa vê. Experimente abaixo."
          />
          <div className="mt-8 sm:mt-14 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Reveal>
              <div className="grid gap-3 sm:grid-cols-2">
                {modulos.map((m) => {
                  const ligado = on.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="switch"
                      aria-checked={ligado}
                      onClick={() => toggle(m.id)}
                      className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                        ligado ? "border-brand/50 bg-brand/[.06]" : "border-ink-600 bg-ink-850 hover:border-ink-500"
                      }`}
                    >
                      <span className={`grid h-10 w-10 flex-none place-items-center rounded-xl transition ${ligado ? "bg-brand text-[#140A00]" : "bg-ink-700 text-fog-500"}`}>
                        <m.icone className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className={`font-display text-[15px] font-semibold ${ligado ? "text-fog" : "text-fog-300"}`}>{m.nome}</span>
                          <span className={`relative h-5 w-9 flex-none rounded-full transition ${ligado ? "bg-brand" : "bg-ink-600"}`}>
                            <span className={`absolute top-[3px] h-3.5 w-3.5 rounded-full transition-all ${ligado ? "left-[19px] bg-[#140A00]" : "left-[3px] bg-fog-500"}`} />
                          </span>
                        </span>
                        <span className="mt-1 block text-[13px] leading-snug text-fog-500">{m.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="sticky top-28 overflow-hidden rounded-3xl border border-ink-500 bg-ink-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-ink-600 px-5 py-4">
                  <span className="font-display text-[14px] font-semibold">Menu da sua equipe</span>
                  <span className="rounded-full bg-brand/15 px-2.5 py-0.5 font-mono text-[12px] text-brand">{ativos.length} de {modulos.length}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] text-fog-300"><Home className="h-4 w-4" /> Painel</div>
                  <ul>
                    <AnimatePresence initial={false}>
                      {ativos.map((m) => (
                        <motion.li
                          key={m.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] text-fog">
                            <m.icone className="h-4 w-4 text-brand" /> {m.nome}
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  {ativos.length === 0 && <p className="px-3 py-4 text-[13px] text-fog-500">Ligue um módulo para ele aparecer aqui.</p>}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <SectionHeading
            title="Do WhatsApp ao relatório mensal, tudo automático."
            text="Às 08:30 cada pessoa recebe as entregas do dia. A qualquer hora, basta perguntar &quot;o que tenho hoje?&quot;, &quot;minhas reuniões&quot; ou &quot;tarefas atrasadas&quot;. No fim do mês, o relatório chega pronto para o gestor."
          />
          <Reveal delay={0.1}>
            <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[32px] border border-ink-500 bg-ink-900 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-ink-600 bg-ink-850 px-5 py-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-[#140A00]"><Bot className="h-5 w-5" /></span>
                <span>
                  <span className="block font-display text-[14.5px] font-semibold">Assistente Solute</span>
                  <span className="flex items-center gap-1.5 text-[12px] text-ok"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ok" /> online</span>
                </span>
              </div>
              <div className="flex flex-col gap-3 bg-ink-950 p-5 text-[14px] leading-snug">
                {[
                  { me: false, t: "Bom dia, Lívia! Hoje você tem 3 entregas e 1 reunião às 16:00.", h: "08:30" },
                  { me: true, t: "tarefas atrasadas", h: "14:02" },
                  { me: false, t: "Você tem 1 tarefa atrasada: Revisar proposta comercial (venceu ontem).", h: "14:02" },
                  { me: true, t: "minhas reuniões", h: "14:03" },
                  { me: false, t: "Hoje às 16:00: Alinhamento comercial, no Google Meet.", h: "14:03" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.35 }}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${m.me ? "self-end rounded-br-md bg-brand font-medium text-[#140A00]" : "self-start rounded-bl-md bg-ink-700"}`}
                  >
                    {m.t}
                    <span className="mt-1 block text-right font-mono text-[10.5px] opacity-60">{m.h}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
