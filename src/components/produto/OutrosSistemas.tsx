import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { produtos, type Slug } from "@/data/produtos";
import { Container, GlowCard, Reveal } from "@/components/ui";

export default function OutrosSistemas({ atual }: { atual: Slug }) {
  const outros = produtos.filter((p) => p.slug !== atual);
  return (
    <section className="border-t border-ink-600 pt-24 sm:pt-28">
      <Container>
        <Reveal>
          <h2 className="font-display text-[28px] font-bold tracking-[-.02em]">Conheça os outros sistemas</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {outros.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="h-full">
              <GlowCard className="h-full">
                <Link href={`/${p.slug}/`} className="flex h-full flex-col p-7">
                  <span className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                      <p.icone className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-fog-600 transition group-hover:text-brand" />
                  </span>
                  <span className="mt-6 font-display text-[19px] font-semibold">{p.nome}</span>
                  <span className="mt-2 text-[14.5px] leading-relaxed text-fog-400">{p.resumo}</span>
                </Link>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
