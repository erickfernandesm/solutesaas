"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { porSlug, type Slug } from "@/data/produtos";
import { mocks } from "@/components/mocks";
import { BrowserFrame, Button, Container, Wordmark } from "@/components/ui";
import { waLink } from "@/lib/contato";

const sobe = (d: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay: d, ease: [0.2, 0.7, 0.2, 1] as const },
});

export default function ProdutoHero({ slug }: { slug: Slug }) {
  const p = porSlug(slug)!;
  const { Componente, url } = mocks[slug];
  return (
    <section className="relative overflow-hidden pt-[104px]">
      <div className="pointer-events-none absolute -top-72 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-brand/[.14] blur-[140px]" aria-hidden="true" />

      <Container className="relative">
        <motion.nav {...sobe(0)} aria-label="Você está em" className="flex items-center gap-1.5 text-[13px] text-fog-500">
          <Link href="/" className="hover:text-fog">Sistemas Solute RH</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-fog-300">{p.nome}</span>
        </motion.nav>

        <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center text-center">
          <motion.div {...sobe(0.04)}>
            {p.logo ? <img src={p.logo} alt={p.nome} className="h-12 w-auto" /> : <Wordmark sufixo={p.sufixo} size="md" />}
          </motion.div>
          <motion.h1 {...sobe(0.1)} className="mt-7 font-display text-[clamp(32px,4.2vw,54px)] font-extrabold leading-[1.06] tracking-[-.035em] text-balance">
            {p.titulo}
          </motion.h1>
          <motion.p {...sobe(0.16)} className="mt-5 max-w-2xl text-[17px] leading-relaxed text-fog-300">
            {p.descricao}
          </motion.p>
          <motion.div {...sobe(0.22)} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={waLink(p.mensagem)} external whatsapp>Agendar demonstração</Button>
            <Button href="#recursos" variant="ghost">Ver recursos</Button>
          </motion.div>
          <motion.p {...sobe(0.26)} className="mt-5 text-[13px] text-fog-500">
            Para {p.publico.join(" · ")}
          </motion.p>
        </div>

        <motion.ul {...sobe(0.3)} className={`mx-auto mt-8 grid gap-3 lg:mt-12 ${p.chamadas.length === 4 ? "max-w-6xl sm:grid-cols-2 lg:grid-cols-4" : "max-w-4xl sm:grid-cols-3"}`}>
          {p.chamadas.map((c) => (
            <li key={c.titulo} className="flex items-start gap-3 rounded-2xl border border-ink-600 bg-ink-900/70 p-4 backdrop-blur">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl text-brand" style={{ backgroundColor: "rgba(243,140,35,.12)" }}>
                <c.icone className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[14.5px] font-semibold leading-tight">{c.titulo}</span>
                <span className="mt-1 block text-[12.5px] leading-snug text-fog-500">{c.texto}</span>
              </span>
            </li>
          ))}
        </motion.ul>

        <motion.div {...sobe(0.36)} className="relative mt-6">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-brand/40 via-brand/5 to-transparent" aria-hidden="true" />
          <BrowserFrame url={url} className="relative">
            <Componente />
          </BrowserFrame>
        </motion.div>
        <p className="mt-4 text-center text-[12.5px] text-fog-600">Tela de demonstração com dados de exemplo. Clique para interagir.</p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-ink-600 bg-ink-600 sm:grid-cols-3 lg:mt-16">
          {p.numeros.map((n) => (
            <div key={n.rotulo} className="bg-ink-900 px-6 py-5 lg:p-7">
              <p className="font-display text-[clamp(30px,3.4vw,42px)] font-extrabold leading-none tracking-[-.03em] text-brand">{n.valor}</p>
              <p className="mt-2.5 text-[14px] text-fog-400">{n.rotulo}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
