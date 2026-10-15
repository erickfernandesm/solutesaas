import { LayoutDashboard, Clock, UserSearch, ClipboardList } from "lucide-react";
import IconeWhatsApp from "@/components/IconeWhatsApp";
import { Container, Reveal, SectionHeading } from "@/components/ui";

const nos = [
  { id: "recruta", x: 110, y: 90, icone: UserSearch, nome: "Solute Recruta", rel: "Atalho direto no menu do Gestão" },
  { id: "ponto", x: 590, y: 90, icone: Clock, nome: "Solute Ponto", rel: "Chamados de suporte tratados no Gestão" },
  { id: "forms", x: 110, y: 390, icone: ClipboardList, nome: "Solute Forms", rel: "Vem embutido no Gestão" },
  { id: "whats", x: 590, y: 390, icone: IconeWhatsApp, nome: "WhatsApp", rel: "Resumo diário e assistente da equipe" },
];
const centro = { x: 350, y: 240 };

export default function Conexoes() {
  return (
    <section className="relative overflow-hidden border-y border-ink-600 bg-ink-900/40 py-12 sm:py-20 lg:py-24">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" aria-hidden="true" />
      <Container className="relative grid items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading
            title={<>O Solute Gestão é o <span className="text-gradient">centro da operação.</span></>}
            text="Cada sistema funciona sozinho. Quando a empresa usa mais de um, o Gestão vira o ponto de partida da equipe: dá acesso rápido aos outros sistemas, recebe os chamados do Ponto e já traz o Forms dentro."
          />
          <Reveal delay={0.1}>
            <ul className="mt-10 space-y-3">
              {nos.map((n) => (
                <li key={n.id} className="flex items-start gap-3 text-[15px]">
                  <n.icone className="mt-1 h-4 w-4 flex-none text-brand" />
                  <span className="min-w-0">
                    <span className="font-semibold text-fog">{n.nome}</span>
                    <span className="block text-fog-500 sm:ml-2 sm:inline">{n.rel}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-[700/480] w-full max-w-[700px]">
            <svg viewBox="0 0 700 480" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F38C23" stopOpacity=".35" />
                  <stop offset="100%" stopColor="#F38C23" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={centro.x} cy={centro.y} r="150" fill="url(#halo)" />
              <circle cx={centro.x} cy={centro.y} r="120" fill="none" stroke="#26262D" strokeDasharray="2 6" />
              {nos.map((n) => (
                <g key={n.id}>
                  <line x1={centro.x} y1={centro.y} x2={n.x} y2={n.y} stroke="#26262D" strokeWidth="2" />
                  <line x1={centro.x} y1={centro.y} x2={n.x} y2={n.y} stroke="#F38C23" strokeWidth="2" className="flow-line" />
                </g>
              ))}
            </svg>
            <div
              className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-brand/60 bg-ink-850 px-6 py-5 text-center shadow-[0_0_60px_-10px_rgba(243,140,35,.6)]"
              style={{ left: `${(centro.x / 700) * 100}%`, top: `${(centro.y / 480) * 100}%` }}
            >
              <LayoutDashboard className="h-7 w-7 text-brand" />
              <span className="mt-2 font-display text-[15px] font-bold leading-tight sm:text-[17px]">Solute Gestão</span>
            </div>
            {nos.map((n) => (
              <div
                key={n.id}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-2xl border border-ink-500 bg-ink-850 px-3 py-2.5 sm:px-4"
                style={{ left: `${(n.x / 700) * 100}%`, top: `${(n.y / 480) * 100}%` }}
              >
                <n.icone className="h-4 w-4 text-brand" />
                <span className="font-display text-[12px] font-semibold sm:text-[14px]">{n.nome}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
