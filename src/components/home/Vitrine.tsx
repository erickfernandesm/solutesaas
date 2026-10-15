"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { produtos } from "@/data/produtos";
import { mocks } from "@/components/mocks";
import { BrowserFrame, Container, SectionHeading } from "@/components/ui";

const INTERVALO = 9000;

/** Janela grande e interativa, com uma aba para cada sistema. */
export default function Vitrine() {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const p = produtos[ativo];
  const { Componente } = mocks[p.slug];
  // O endereço só muda quando a tela nova termina de entrar.
  const [url, setUrl] = useState(mocks[p.slug].url);

  useEffect(() => {
    if (pausado) return;
    const t = setTimeout(() => setAtivo((a) => (a + 1) % produtos.length), INTERVALO);
    return () => clearTimeout(t);
  }, [ativo, pausado]);

  return (
    <section id="por-dentro" className="relative py-12 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          center
          title={<>Veja os sistemas <span className="text-gradient">por dentro.</span></>}
          text="Estas são as telas de cada sistema, com dados de exemplo. Clique, troque de aba e experimente."
        />

        <div
          role="tablist"
          aria-label="Escolha um sistema"
          className="mx-auto mb-6 mt-12 grid max-w-3xl grid-cols-2 gap-1.5 rounded-2xl border border-ink-600 bg-ink-900/70 p-1.5 backdrop-blur sm:grid-cols-4"
        >
          {produtos.map((prod, i) => (
            <button
              key={prod.slug}
              role="tab"
              aria-selected={ativo === i}
              type="button"
              onClick={() => { setAtivo(i); setPausado(true); }}
              className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition ${
                ativo === i ? "bg-ink-700 text-fog" : "text-fog-500 hover:text-fog-300"
              }`}
            >
              <prod.icone className={`h-4 w-4 ${ativo === i ? "text-brand" : ""}`} />
              {prod.nome}
              {ativo === i && !pausado && (
                <motion.span
                  key={`bar-${ativo}`}
                  className="absolute bottom-0 left-0 h-[2px] bg-brand"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: INTERVALO / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="relative" onMouseEnter={() => setPausado(true)}>
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-brand/40 via-brand/5 to-transparent" aria-hidden="true" />
          <BrowserFrame url={url} className="relative">
            <AnimatePresence mode="wait" onExitComplete={() => setUrl(mocks[produtos[ativo].slug].url)}>
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Componente />
              </motion.div>
            </AnimatePresence>
          </BrowserFrame>
        </div>
      </Container>
    </section>
  );
}
