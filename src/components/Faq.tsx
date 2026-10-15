"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Pergunta } from "@/data/produtos";
import { Container, SectionHeading } from "@/components/ui";

export default function Faq({ perguntas, titulo = "O que as empresas perguntam antes de contratar." }: { perguntas: Pergunta[]; titulo?: string }) {
  const [aberta, setAberta] = useState<number | null>(0);
  return (
    <section id="perguntas" className="border-t border-ink-600 pb-10 pt-12 sm:pb-16 sm:pt-24">
      <Container className="grid gap-4 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
        <SectionHeading title={titulo} />
        <div className="divide-y divide-ink-600 border-b border-ink-600 lg:border-t">
          {perguntas.map((q, i) => {
            const open = aberta === i;
            return (
              <div key={q.p}>
                <button
                  type="button"
                  onClick={() => setAberta(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-[17px] font-semibold leading-snug">{q.p}</span>
                  <span className={`grid h-8 w-8 flex-none place-items-center rounded-full border transition ${open ? "rotate-45 border-brand bg-brand text-[#140A00]" : "border-ink-500 text-brand"}`}>
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-[15.5px] leading-relaxed text-fog-400">{q.r}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
