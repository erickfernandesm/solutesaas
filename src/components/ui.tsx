"use client";

import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import IconeWhatsApp from "@/components/IconeWhatsApp";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  title, text, center = false,
}: { title: ReactNode; text?: ReactNode; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className="font-display text-[clamp(30px,4.2vw,52px)] font-bold leading-[1.06] tracking-[-.03em] text-balance">
        {title}
      </h2>
      {text && <p className={`mt-5 text-[17px] leading-relaxed text-fog-400 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{text}</p>}
    </Reveal>
  );
}

type BtnProps = { href: string; children: ReactNode; variant?: "primary" | "ghost"; external?: boolean; className?: string; arrow?: boolean; whatsapp?: boolean };
export function Button({ href, children, variant = "primary", external, className = "", arrow, whatsapp }: BtnProps) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-brand text-[#140A00] shadow-[0_0_0_1px_rgba(243,140,35,.4),0_10px_30px_-10px_rgba(243,140,35,.6)] hover:bg-brand-soft"
      : "border border-ink-500 bg-ink-850/60 text-fog backdrop-blur hover:border-fog-500 hover:bg-ink-800";
  const content = (
    <>
      {whatsapp && <IconeWhatsApp className="h-[18px] w-[18px]" />}
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </>
  );
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles} ${className}`}>
        {content}
      </a>
    );
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {content}
    </Link>
  );
}

export function Reveal({
  children, className = "", delay = 0, y = 22,
}: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Cartão com luz que segue o mouse na borda e no fundo. */
export function GlowCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={`glow-card group relative overflow-hidden rounded-3xl border border-ink-600 bg-ink-850 ${className}`}>
      <div className="glow-card-light pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

/** Número que conta ao entrar na tela. */
export function CountUp({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(to);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const controls = animate(0, to, { duration: 1.6, ease: [0.2, 0.7, 0.2, 1], onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to]);
  const txt = val.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {txt}
      {suffix}
    </span>
  );
}

/** Nome do produto quando não existe logo oficial. */
export function Wordmark({ sufixo, size = "md" }: { sufixo: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "text-[46px]" : size === "sm" ? "text-[20px]" : "text-[30px]";
  return (
    <span className={`inline-block font-display font-extrabold uppercase leading-[.86] tracking-[-.02em] ${s}`} aria-label={`Solute ${sufixo}`}>
      Solute
      <span className="block text-brand">{sufixo}</span>
    </span>
  );
}

/** Moldura de navegador para as telas de exemplo. */
export function BrowserFrame({ url, children, className = "" }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-ink-500 bg-ink-900 shadow-[0_40px_120px_-30px_rgba(0,0,0,.9),0_0_0_1px_rgba(255,255,255,.03)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-ink-600 bg-ink-850 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        <div className="ml-3 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-ink-800 px-3 py-1 font-mono text-[11.5px] text-fog-500">
          <svg viewBox="0 0 24 24" className="h-3 w-3 flex-none" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          <span className="truncate">{url}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
