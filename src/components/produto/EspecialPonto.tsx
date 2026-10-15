"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link2, ShieldAlert, ShieldCheck, RotateCcw, HeartPulse, EyeOff, Mail } from "lucide-react";
import { Container, GlowCard, Reveal, SectionHeading } from "@/components/ui";

// Código curto e determinístico (FNV-1a) só para a demonstração visual.
function codigo(texto: string) {
  let h1 = 0x811c9dc5, h2 = 0x01000193;
  for (let i = 0; i < texto.length; i++) {
    h1 = Math.imul(h1 ^ texto.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 ^ texto.charCodeAt(i), 2246822519) >>> 0;
  }
  return (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).slice(0, 12);
}

const base = [
  { nsr: "000184", tipo: "Entrada", hora: "08:00" },
  { nsr: "000185", tipo: "Saída almoço", hora: "12:02" },
  { nsr: "000186", tipo: "Volta almoço", hora: "13:01" },
  { nsr: "000187", tipo: "Saída", hora: "17:58" },
];

// Códigos gravados no momento de cada batida.
const gravados = (() => {
  const out: string[] = [];
  let ant = "inicio";
  for (const r of base) {
    const c = codigo(`${ant}|${r.nsr}|${r.tipo}|${r.hora}`);
    out.push(c);
    ant = c;
  }
  return out;
})();

export default function EspecialPonto() {
  const [alterado, setAlterado] = useState(false);
  const registros = useMemo(() => base.map((r, i) => (alterado && i === 1 ? { ...r, hora: "11:32" } : r)), [alterado]);

  const verificacao = registros.map((r, i) => {
    const anterior = i === 0 ? "inicio" : gravados[i - 1];
    const recalculado = codigo(`${anterior}|${r.nsr}|${r.tipo}|${r.hora}`);
    return { ok: recalculado === gravados[i], recalculado };
  });
  const quebrado = verificacao.findIndex((v) => !v.ok);

  return (
    <>
      <section className="relative overflow-hidden border-t border-ink-600 bg-ink-900/40 py-12 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr] lg:items-center">
            <div>
              <SectionHeading
                title={<>Uma alteração de horário <span className="text-gradient">não passa despercebida.</span></>}
                text="Cada marcação recebe um código calculado a partir da marcação anterior, como os elos de uma corrente. Se alguém mudar um horário, o código daquele registro deixa de conferir e o sistema aponta onde está o problema."
              />
              <Reveal delay={0.1}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setAlterado(true)}
                    disabled={alterado}
                    className="inline-flex items-center gap-2 rounded-xl border border-bad/50 bg-bad/10 px-5 py-3 text-[14.5px] font-semibold text-bad transition hover:bg-bad/20 disabled:opacity-40"
                  >
                    <ShieldAlert className="h-4 w-4" /> Simular alteração
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlterado(false)}
                    disabled={!alterado}
                    className="inline-flex items-center gap-2 rounded-xl border border-ink-500 px-5 py-3 text-[14.5px] font-semibold text-fog transition hover:border-fog-500 disabled:opacity-40"
                  >
                    <RotateCcw className="h-4 w-4" /> Restaurar
                  </button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-ink-500 bg-ink-900 p-5 sm:p-6">
                <div className={`mb-5 flex items-center gap-3 rounded-2xl border p-4 transition-colors ${quebrado < 0 ? "border-ok/40 bg-ok/10" : "border-bad/50 bg-bad/10"}`}>
                  {quebrado < 0 ? <ShieldCheck className="h-6 w-6 flex-none text-ok" /> : <ShieldAlert className="h-6 w-6 flex-none text-bad" />}
                  <div>
                    <p className={`font-display text-[15px] font-semibold ${quebrado < 0 ? "text-ok" : "text-bad"}`}>
                      {quebrado < 0 ? "Todos os registros conferem" : `Alteração detectada no NSR ${registros[quebrado].nsr}`}
                    </p>
                    <p className="text-[13px] text-fog-400">
                      {quebrado < 0 ? "A corrente de códigos está íntegra do primeiro ao último registro." : "O horário foi mudado depois da batida. O código gravado não bate com o recalculado."}
                    </p>
                  </div>
                </div>
                <ol className="space-y-2.5">
                  {registros.map((r, i) => {
                    const ok = verificacao[i].ok;
                    return (
                      <li key={r.nsr}>
                        <motion.div
                          animate={{ x: !ok && i === quebrado ? [0, -6, 6, -4, 4, 0] : 0 }}
                          transition={{ duration: 0.45 }}
                          className={`grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl border p-4 transition-colors sm:grid-cols-[auto_1fr_auto] ${ok ? "border-ink-600 bg-ink-850" : "border-bad/60 bg-bad/[.07]"}`}
                        >
                          <span className={`font-mono text-[22px] font-medium tabular-nums ${!ok ? "text-bad" : ""}`}>{r.hora}</span>
                          <span className="min-w-0">
                            <span className="block text-[14px] font-medium">{r.tipo}</span>
                            <span className="block font-mono text-[11.5px] text-fog-500">NSR {r.nsr}</span>
                          </span>
                          <span className="col-span-2 min-w-0 font-mono text-[11.5px] sm:col-span-1 sm:text-right">
                            <span className="flex items-center gap-1.5 text-fog-500 sm:justify-end"><Link2 className="h-3 w-3" /> código</span>
                            <span className={ok ? "text-brand" : "text-bad line-through"}>{gravados[i]}</span>
                          </span>
                        </motion.div>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4 text-[12px] text-fog-600">Demonstração ilustrativa. No sistema, a original fica guardada e todo ajuste é registrado à parte, com autor e motivo.</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            center
            title="Um cuidado a mais com quem trabalha."
            text="O Solute Ponto é um dos poucos sistemas de ponto com um olhar para a saúde emocional da equipe. O acompanhamento foi construído a partir de critérios do DSM-5 e do PHQ-9, referências usadas por profissionais de saúde para observar sinais de desânimo persistente."
          />
          <div className="mt-8 sm:mt-14 grid gap-4 md:grid-cols-3">
            {[
              { i: HeartPulse, t: "Check-in de humor opcional", d: "Na entrada, a pessoa pode dizer como está, em cinco opções: Ótimo, Bem, Neutro, Desanimado ou Mal." },
              { i: EyeOff, t: "Sigiloso de verdade", d: "Os colegas não veem as respostas. É um sinal de cuidado, não um diagnóstico médico." },
              { i: Mail, t: "Aviso discreto ao RH", d: "Quando o desânimo se repete, o RH recebe um e-mail para se aproximar da pessoa com discrição." },
            ].map((b, k) => (
              <Reveal key={b.t} delay={k * 0.08} className="h-full">
                <GlowCard className="h-full">
                  <div className="p-8">
                    <b.i className="h-7 w-7 text-brand" />
                    <h3 className="mt-6 font-display text-[19px] font-semibold">{b.t}</h3>
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
