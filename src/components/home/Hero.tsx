"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { produtos } from "@/data/produtos";
import { mocks } from "@/components/mocks";
import { BrowserFrame, Button, Container } from "@/components/ui";
import { waLink } from "@/lib/contato";

const LARG = 1100, ALT = 600;
const GIRO = 4800;

/** Renderiza uma tela de demonstração em tamanho real e reduz para caber no cartão. */
function MiniTela({ slug }: { slug: (typeof produtos)[number]["slug"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [esc, setEsc] = useState(0.5);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setEsc(e.contentRect.width / LARG));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { Componente } = mocks[slug];
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: ALT * esc }}>
      <div className="pointer-events-none absolute left-0 top-0 origin-top-left select-none" style={{ width: LARG, height: ALT, transform: `scale(${esc})` }} inert>
        <Componente />
      </div>
    </div>
  );
}

// Posição de cada cartão conforme a profundidade (0 = da frente).
const camadas = [
  { x: "0%", y: "0%", s: 1, o: 1 },
  { x: "5%", y: "-7%", s: 0.93, o: 0.8 },
  { x: "10%", y: "-14%", s: 0.86, o: 0.5 },
  { x: "15%", y: "-21%", s: 0.79, o: 0.25 },
];

function Pilha() {
  const [ordem, setOrdem] = useState([0, 1, 2, 3]);
  const [pausa, setPausa] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -3]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-16, -4]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    if (pausa) return;
    const t = setTimeout(() => setOrdem(([a, ...r]) => [...r, a]), GIRO);
    return () => clearTimeout(t);
  }, [ordem, pausa]);

  function mover(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  const trazer = (i: number) => setOrdem((o) => [i, ...o.filter((x) => x !== i)]);
  const frente = ordem[0];

  return (
    <div
      className="relative"
      onMouseMove={mover}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => { setPausa(false); mx.set(0); my.set(0); }}
    >
      <div style={{ perspective: 1800 }} className="pt-[13%]">
        <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative">
          {produtos.map((p, i) => {
            const prof = ordem.indexOf(i);
            const c = camadas[prof];
            return (
              <motion.div
                key={p.slug}
                role="button"
                tabIndex={0}
                onClick={() => trazer(i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trazer(i); } }}
                aria-label={`Ver ${p.nome}`}
                className={`${prof === 0 ? "relative" : "absolute inset-x-0 top-0"} block w-full cursor-pointer text-left`}
                style={{ zIndex: 10 - prof, transformOrigin: "50% 0%" }}
                animate={{ x: c.x, y: c.y, scale: c.s, opacity: c.o }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
              >
                <BrowserFrame url={mocks[p.slug].url} className={prof === 0 ? "shadow-[0_50px_120px_-30px_rgba(0,0,0,.95),0_0_80px_-30px_rgba(243,140,35,.45)]" : ""}>
                  <MiniTela slug={p.slug} />
                </BrowserFrame>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Sistemas">
        {produtos.map((p, i) => (
          <button
            key={p.slug}
            role="tab"
            type="button"
            aria-selected={frente === i}
            onClick={() => trazer(i)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
              frente === i ? "border-brand/60 bg-brand/10 text-fog" : "border-ink-600 text-fog-500 hover:text-fog-300"
            }`}
          >
            <p.icone className={`h-3.5 w-3.5 ${frente === i ? "text-brand" : ""}`} />
            {p.sufixo}
          </button>
        ))}
      </div>
    </div>
  );
}

const sobe = (d: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: d, ease: [0.2, 0.7, 0.2, 1] as const },
});

/** Celular com os quatro sistemas na versão de celular, um de cada vez. Só aparece em telas pequenas. */
function Celular() {
  const [ativo, setAtivo] = useState(0);
  const [pausa, setPausa] = useState(false);
  useEffect(() => {
    if (pausa) return;
    const t = setTimeout(() => setAtivo((a) => (a + 1) % produtos.length), 6500);
    return () => clearTimeout(t);
  }, [ativo, pausa]);
  const p = produtos[ativo];
  const { Componente } = mocks[p.slug];
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-brand/25 blur-[70px]" aria-hidden="true" />
        {/* aparelho */}
        <div className="relative w-[min(330px,86vw)] rounded-[46px] border-[7px] border-[#1d1d23] bg-black p-[3px] shadow-[0_40px_90px_-20px_rgba(0,0,0,.95),inset_0_0_0_1px_rgba(255,255,255,.08)]">
          <div className="relative h-[600px] overflow-hidden rounded-[38px] bg-slate-900" onPointerDown={() => setPausa(true)}>
            {/* barra de status com a ilha */}
            <div className="relative z-10 flex h-9 items-center justify-between bg-slate-900 px-6 text-[11px] font-semibold text-white">
              <span>09:41</span>
              <span className="absolute left-1/2 top-2 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
              <span className="flex items-center gap-1" aria-hidden="true">
                <span className="flex items-end gap-[1.5px]">{[4, 6, 8, 10].map((h) => <span key={h} className="w-[2.5px] rounded-sm bg-white" style={{ height: h }} />)}</span>
                <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-white/80 p-[1.5px]"><span className="block h-full w-3/4 rounded-[1px] bg-white" /></span>
              </span>
            </div>
            <div className="no-scrollbar h-[calc(100%-36px)] overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait">
                <motion.div key={p.slug} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                  <Componente />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="pointer-events-none absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-white/70" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="no-scrollbar -mx-5 mt-6 flex max-w-[100vw] gap-2 overflow-x-auto px-5" role="tablist" aria-label="Sistemas">
        {produtos.map((s, i) => (
          <button
            key={s.slug}
            role="tab"
            type="button"
            aria-selected={ativo === i}
            onClick={() => { setAtivo(i); setPausa(true); }}
            className={`relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${
              ativo === i ? "border-brand/60 bg-brand/10 text-fog" : "border-ink-600 text-fog-500"
            }`}
          >
            <s.icone className={`h-3.5 w-3.5 ${ativo === i ? "text-brand" : ""}`} />
            {s.sufixo}
            {ativo === i && !pausa && (
              <motion.span key={`b-${ativo}`} className="absolute bottom-0 left-0 h-[2px] bg-brand" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6.5, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-[12.5px] text-fog-500">Toque e role a tela para experimentar o {p.nome}.</p>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-[96px] sm:pb-24 lg:pt-[124px]">
      <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-[720px] w-[900px] rounded-full bg-brand/[.14] blur-[150px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-500 to-transparent" aria-hidden="true" />

      <Container className="relative grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
        <div className="text-center lg:text-left">
          <motion.h1 {...sobe(0)} className="font-display text-[clamp(32px,3.6vw,52px)] font-extrabold leading-[1.04] tracking-[-.04em]">
            Tecnologia que <span className="text-gradient">fortalece negócios</span> através de pessoas.
          </motion.h1>
          <motion.p {...sobe(0.1)} className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-fog-400 lg:mx-0 lg:mt-7 lg:text-[18px]">
            <span className="lg:hidden">Gestão, ponto, recrutamento e formulários. Quatro sistemas simples de usar.</span>
            <span className="hidden lg:inline">Gestão de equipes, ponto eletrônico, recrutamento e formulários. Quatro sistemas simples de usar, criados pela Solute RH a partir da rotina de mais de 700 empresas atendidas.</span>
          </motion.p>
          <motion.div {...sobe(0.2)} className="mt-10 hidden flex-wrap gap-3 lg:flex">
            <Button href={waLink("Olá! Quero agendar uma demonstração dos sistemas da Solute RH.")} external whatsapp>
              Agendar uma demonstração
            </Button>
            <Button href="#por-dentro" variant="ghost">Ver os sistemas por dentro</Button>
          </motion.div>
          <motion.dl {...sobe(0.3)} className="mt-12 hidden max-w-lg grid-cols-3 gap-6 border-t border-ink-600 pt-7 lg:grid">
            <div>
              <dt className="sr-only">Nota no Google</dt>
              <dd className="flex items-center gap-1.5 font-display text-[24px] font-bold">
                5,0 <span className="flex text-brand">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3 w-3 fill-brand" />)}</span>
              </dd>
              <p className="mt-1 text-[12.5px] text-fog-500">no Google</p>
            </div>
            <div>
              <dt className="sr-only">NPS</dt>
              <dd className="font-display text-[24px] font-bold">96</dd>
              <p className="mt-1 text-[12.5px] text-fog-500">de NPS em 2026</p>
            </div>
            <div>
              <dt className="sr-only">Empresas atendidas</dt>
              <dd className="font-display text-[24px] font-bold">+700</dd>
              <p className="mt-1 text-[12.5px] text-fog-500">empresas atendidas</p>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          className="hidden min-w-0 lg:-mr-8 lg:block xl:-mr-24"
        >
          <Pilha />
        </motion.div>

        <motion.div {...sobe(0.28)} className="min-w-0 lg:hidden">
          <Celular />
          {/* no celular, o botão vem depois da demonstração */}
          <Button href={waLink("Olá! Quero agendar uma demonstração dos sistemas da Solute RH.")} external whatsapp className="mt-7 w-full">
            Agendar uma demonstração
          </Button>
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12.5px] text-fog-500">
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-brand text-brand" /> 5,0 no Google</span>
            <span>NPS 96</span>
            <span>+700 empresas atendidas</span>
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
