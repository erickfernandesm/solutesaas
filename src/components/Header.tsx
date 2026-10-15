"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { produtos } from "@/data/produtos";
import { waLink } from "@/lib/contato";
import IconeWhatsApp from "@/components/IconeWhatsApp";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setMenu(false); setMobile(false); }, [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobile ? "border-b border-ink-600/80 bg-ink-950/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-[72px] max-w-site items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Sistemas Solute RH, início">
          <img src="/assets/solute-rh-branca.svg" alt="Solute RH" className="h-12 w-auto" />
          <span className="hidden h-6 w-px bg-ink-500 sm:block" />
          <span className="hidden text-[13px] font-medium uppercase tracking-[.18em] text-fog-400 sm:block">Sistemas</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Principal">
          <div className="relative" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[14.5px] font-medium text-fog-300 transition hover:text-fog"
            >
              Sistemas <ChevronDown className={`h-4 w-4 transition-transform ${menu ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-3"
                >
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-ink-600 bg-ink-900/95 p-3 shadow-2xl backdrop-blur-xl">
                    {produtos.map((p) => (
                      <Link key={p.slug} href={`/${p.slug}/`} className="group flex gap-3.5 rounded-xl p-3.5 transition hover:bg-ink-800">
                        <span className="grid h-10 w-10 flex-none place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
                          <p.icone className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1 font-display text-[15px] font-semibold text-fog">
                            {p.nome}
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-fog-500">{p.resumo}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {[
            ["/#ecossistema", "Ecossistema"],
            ["/#como-funciona", "Como funciona"],
            ["/#sobre", "Sobre"],
            ["/#perguntas", "Perguntas"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3.5 py-2 text-[14.5px] font-medium text-fog-300 transition hover:text-fog">
              {label}
            </Link>
          ))}
        </nav>

        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[14px] font-semibold text-[#140A00] transition hover:bg-brand-soft sm:inline-flex lg:ml-0"
        >
          <IconeWhatsApp className="h-4 w-4" />
          Falar com a equipe
        </a>
        <button
          type="button"
          onClick={() => setMobile((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-ink-600 text-fog sm:ml-0 lg:hidden"
          aria-label={mobile ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobile}
        >
          {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink-600 lg:hidden"
            aria-label="Menu"
          >
            <div className="mx-auto max-w-site space-y-1 px-5 py-4 sm:px-8">
              {produtos.map((p) => (
                <Link key={p.slug} href={`/${p.slug}/`} className="flex items-center gap-3 rounded-xl p-3 hover:bg-ink-800">
                  <p.icone className="h-5 w-5 text-brand" />
                  <span className="font-display font-semibold">{p.nome}</span>
                </Link>
              ))}
              <div className="my-2 h-px bg-ink-600" />
              <Link href="/#como-funciona" className="block rounded-xl p-3 text-fog-300">Como funciona</Link>
              <Link href="/#sobre" className="block rounded-xl p-3 text-fog-300">Sobre a Solute RH</Link>
              <Link href="/#perguntas" className="block rounded-xl p-3 text-fog-300">Perguntas</Link>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand p-3 font-semibold text-[#140A00]">
                <IconeWhatsApp className="h-[18px] w-[18px]" />
                Falar com a equipe
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
