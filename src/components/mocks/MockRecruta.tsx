"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, Bell } from "lucide-react";

/* Réplica da tela de processo do Solute Recruta (vagas/[id]): mesmo menu,
   mesmas abas, mesmos rótulos, selos e faixas de aderência do sistema real.
   Tema escuro por padrão (o sistema segue o tema do aparelho) e o botão
   "Tema claro" do menu funciona, como no produto. Dados fictícios. */

type Parte = { rot: string; curto: string; peso: number; nota: number | null };
type Req = { req: string; ok: boolean; declarado?: boolean };
type Cand = {
  nome: string;
  sub: string;
  etapa: keyof typeof ETAPA;
  match: number;
  partes: Parte[];
  obrig: Req[];
  porque: string;
};

const ETAPA = {
  RECEBIDO: { rot: "Recebido", est: "novo" },
  TRIAGEM: { rot: "Em triagem", est: "analise" },
  APROVADO_TRIAGEM: { rot: "Triagem aprovada", est: "analise" },
  ENTREVISTADO: { rot: "Entrevista realizada", est: "feito" },
  TESTE_CONCLUIDO: { rot: "Teste concluído", est: "feito" },
} as const;

const COR_ETAPA: Record<string, [string, string]> = {
  novo: ["bg-slate-100 text-slate-600", "bg-slate-700 text-slate-300"],
  analise: ["bg-sky-100 text-sky-700", "bg-sky-500/15 text-sky-300"],
  feito: ["bg-emerald-100 text-emerald-800", "bg-emerald-500/20 text-emerald-300"],
};

const FAIXAS = [
  { min: 90, rot: "ALTA ADERÊNCIA" },
  { min: 75, rot: "BOA ADERÊNCIA" },
  { min: 60, rot: "ADERÊNCIA MODERADA" },
  { min: 0, rot: "BAIXA ADERÊNCIA" },
];
const faixa = (n: number) => FAIXAS.find((f) => n >= f.min)!.rot;

const P = (c: number | null, e: number | null, b: number | null, f: number | null, o: number | null): Parte[] => [
  { rot: "Análise curricular (triagem)", curto: "Curricular", peso: 30, nota: c },
  { rot: "Entrevista por competências", curto: "Entrevista", peso: 25, nota: e },
  { rot: "Aderência comportamental", curto: "Comportamental", peso: 20, nota: b },
  { rot: "Fit cultural", curto: "Fit cultural", peso: 15, nota: f },
  { rot: "Requisitos obrigatórios", curto: "Obrigatórios", peso: 10, nota: o },
];

const R = ["Formação em Ciências Contábeis", "Excel avançado", "Conciliação bancária", "3 anos em rotinas financeiras"];

const CANDS: Cand[] = [
  {
    nome: "Camila Rezende",
    sub: "Analista Financeira · Grupo Vértice · Campinas/SP",
    etapa: "ENTREVISTADO",
    match: 89,
    partes: P(91, 86, 84, 88, 100),
    obrig: R.map((req) => ({ req, ok: true })),
    porque:
      "Maior Match Geral do processo, com todas as etapas avaliadas. Os 4 requisitos obrigatórios aparecem no currículo e a entrevista confirmou fechamento mensal e conciliação. Pretensão dentro da faixa da vaga.",
  },
  {
    nome: "Diego Martins",
    sub: "Analista Contábil · Lumen Distribuidora · São Paulo/SP",
    etapa: "TESTE_CONCLUIDO",
    match: 80,
    partes: P(84, 80, 78, null, 75),
    obrig: [{ req: R[0], ok: true }, { req: R[1], ok: true }, { req: R[2], ok: false }, { req: R[3], ok: true }],
    porque:
      "Experiência e conhecimentos técnicos fortes. Conciliação bancária não foi identificada no material recebido: confirmar na próxima conversa. Fit cultural ainda não aplicado, o peso foi redistribuído.",
  },
  {
    nome: "Patrícia Lima",
    sub: "Assistente Financeira · Orbe Saúde · Jundiaí/SP",
    etapa: "APROVADO_TRIAGEM",
    match: 76,
    partes: P(76, null, null, null, 75),
    obrig: [{ req: R[0], ok: true }, { req: R[1], ok: true, declarado: true }, { req: R[2], ok: false }, { req: R[3], ok: true }],
    porque:
      "Só a triagem curricular foi feita até aqui. Excel avançado foi declarado no formulário, sem evidência no currículo: confirmar na entrevista. A posição tende a mudar com as próximas etapas.",
  },
  {
    nome: "Rafael Souza",
    sub: "Auxiliar Administrativo · Prisma Log · São Paulo/SP",
    etapa: "TRIAGEM",
    match: 61,
    partes: P(64, null, null, null, 50),
    obrig: [{ req: R[0], ok: true }, { req: R[1], ok: true }, { req: R[2], ok: false }, { req: R[3], ok: false }],
    porque:
      "Formação aderente, mas o currículo mostra 1 ano e meio em rotinas financeiras, abaixo dos 3 anos do perfil ideal. Dois requisitos sem evidência no material: não identificado não é não atende.",
  },
  {
    nome: "Juliana Castro",
    sub: "Estagiária de Controladoria · Nexo Varejo · Osasco/SP",
    etapa: "RECEBIDO",
    match: 52,
    partes: P(52, null, null, null, 50),
    obrig: [{ req: R[0], ok: true }, { req: R[1], ok: false }, { req: R[2], ok: false }, { req: R[3], ok: false }],
    porque:
      "Currículo recém-chegado, ainda sem leitura da consultora. Nível de atuação abaixo do pleno. Continua no processo: ninguém é descartado pela ferramenta, a decisão é de quem conduz.",
  },
];

const ABAS = [
  { id: "geral", rot: "Visão geral" },
  { id: "req", rot: "Requisição" },
  { id: "perfil", rot: "Perfil ideal" },
  { id: "cand", rot: "Candidatos", destaque: 3 },
  { id: "ranking", rot: "Ranking" },
  { id: "div", rot: "Divulgação" },
  { id: "rel", rot: "Relatório" },
  { id: "crit", rot: "Critérios" },
  { id: "quest", rot: "Questionários" },
] as const;
type AbaId = (typeof ABAS)[number]["id"];

/* ícones do menu: os mesmos desenhos do sistema (menu-lateral.tsx) */
const ICONES: Record<string, ReactNode> = {
  Painel: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  Processos: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  "Processos da Equipe": (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M17 14a4.5 4.5 0 0 1 4 4.5V20" />
    </>
  ),
  "Banco de talentos": (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    </>
  ),
  Indicadores: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 3 3 5-7" />
    </>
  ),
  Equipe: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      <path d="M16.5 3.5 18 2m1.5 4.5L21 5" />
    </>
  ),
  Ajustes: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
};

const MENU: { rot: string; n?: number; ativo?: boolean }[] = [
  { rot: "Painel" },
  { rot: "Processos", n: 7, ativo: true },
  { rot: "Processos da Equipe", n: 2 },
  { rot: "Banco de talentos", n: 5 },
  { rot: "Indicadores" },
  { rot: "Equipe" },
  { rot: "Ajustes" },
];

function Svg({ children, size = 17, sw = 1.8 }: { children: ReactNode; size?: number; sw?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
      strokeLinejoin="round" width={size} height={size} className="shrink-0" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function MockRecruta() {
  const [escuro, setEscuro] = useState(true);
  const [aba, setAba] = useState<AbaId>("ranking");
  const [sel, setSel] = useState(0);
  const c = CANDS[sel];

  // um par de classes (claro, escuro) por elemento, como o dark: do sistema real
  const t = (claro: string, esc: string) => (escuro ? esc : claro);

  const corNota = (n: number | null) =>
    n === null
      ? t("text-slate-400", "text-slate-500")
      : n >= 75
      ? t("text-emerald-600", "text-emerald-400")
      : n >= 60
      ? t("text-amber-600", "text-amber-400")
      : t("text-red-600", "text-red-400");
  const fundoNota = (n: number) =>
    n >= 75 ? t("bg-emerald-100", "bg-emerald-500/15") : n >= 60 ? t("bg-amber-100", "bg-amber-500/15") : t("bg-red-100", "bg-red-500/15");
  const barraCor = (n: number) => (n >= 75 ? "bg-emerald-500" : n >= 60 ? "bg-amber-500" : "bg-red-500");

  const cartao = "rounded-xl border p-4 " + t("border-slate-200 bg-white", "border-slate-700 bg-slate-800");
  const trilho = t("bg-slate-200", "bg-slate-700");

  const Titulo = ({ children, acao }: { children: ReactNode; acao?: ReactNode }) => (
    <div className={"mb-3 flex items-center justify-between gap-3 border-b pb-2 " + t("border-slate-200", "border-slate-700")}>
      <h2 className={"text-[10.5px] font-bold uppercase tracking-[0.14em] " + t("text-slate-400", "text-slate-500")}>{children}</h2>
      {acao}
    </div>
  );
  const barra = (v: number) => (
    <div className={"h-1.5 w-full overflow-hidden rounded-full " + trilho}>
      <div className={"h-full rounded-full transition-all duration-500 " + barraCor(v)} style={{ width: Math.max(0, Math.min(100, v)) + "%" }} />
    </div>
  );
  const Selo = ({ etapa }: { etapa: keyof typeof ETAPA }) => {
    const e = ETAPA[etapa];
    const [cl, es] = COR_ETAPA[e.est];
    return (
      <span className={"inline-flex shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-medium " + t(cl, es)}>
        {e.rot}
      </span>
    );
  };
  const Nota = ({ v }: { v: number }) => (
    <span className={"inline-block min-w-[40px] rounded-md px-1.5 py-0.5 text-center text-[12.5px] font-semibold tabular-nums " + fundoNota(v) + " " + corNota(v)}>
      {v}
    </span>
  );

  const abrir = (i: number) => {
    setSel(i);
    setAba("ranking");
  };

  return (
    <div className={"flex h-full min-h-[520px] text-left font-sans " + t("bg-slate-100 text-slate-800", "bg-slate-900 text-slate-200")}>
      {/* barra lateral */}
      <aside className={"hidden w-[212px] flex-none flex-col border-r px-3 py-5 md:flex " + t("border-slate-200 bg-white", "border-slate-800 bg-slate-900")}>
        <div className="px-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={escuro ? "/assets/solute-recruta.svg" : "/assets/solute-recruta-escuro.svg"}
            alt="Solute Recruta"
            className="w-full max-w-[164px]"
          />
        </div>
        <nav className="mt-5 flex flex-col gap-0.5">
          {MENU.map((m) => (
            <span
              key={m.rot}
              className={
                "flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium " +
                (m.ativo
                  ? t("bg-[#fdecdb] text-[#d4640f]", "bg-[#f47a1f]/15 text-[#f47a1f]")
                  : t("text-slate-600", "text-slate-300"))
              }
            >
              <Svg>{ICONES[m.rot]}</Svg>
              <span className="truncate">{m.rot}</span>
              {m.n ? (
                <span className="ml-auto rounded-full bg-[#f47a1f] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{m.n}</span>
              ) : null}
            </span>
          ))}
        </nav>
        <div className={"mt-auto flex items-center gap-2.5 border-t px-1 pt-4 " + t("border-slate-100", "border-slate-800")}>
          <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold " + t("bg-[#fdecdb] text-[#d4640f]", "bg-[#f47a1f]/20 text-[#f47a1f]")}>
            VP
          </span>
          <span className="min-w-0 leading-tight">
            <span className={"block truncate text-[12.5px] font-medium " + t("text-slate-700", "text-slate-100")}>Vanessa Prado</span>
            <span className="block truncate text-[11px] text-slate-400">Consultora de R&amp;S</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setEscuro((v) => !v)}
          className={"mt-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] font-medium transition-colors " + t("text-slate-600 hover:bg-slate-100", "text-slate-300 hover:bg-slate-800")}
        >
          <Svg size={15} sw={2}>
            {escuro ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </>
            ) : (
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            )}
          </Svg>
          {escuro ? "Tema claro" : "Tema escuro"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* barra do topo */}
        <header className={"flex items-center gap-2 border-b px-4 py-2 md:px-6 " + t("border-slate-200 bg-white", "border-slate-700 bg-slate-900")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={escuro ? "/assets/solute-recruta.svg" : "/assets/solute-recruta-escuro.svg"}
            alt="Solute Recruta"
            className="h-6 w-auto md:hidden"
          />
          <span className={"relative ml-auto rounded-full p-1.5 " + t("text-slate-500", "text-slate-400")}>
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </span>
        </header>

        <div className="min-w-0 flex-1 px-4 py-4 md:px-6">
          <span className={"-ml-1.5 mb-2 inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[12.5px] font-medium " + t("text-slate-500", "text-slate-400")}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Processos
          </span>

          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <h1 className={"text-[20px] font-semibold " + t("text-slate-800", "text-slate-100")}>Analista Financeiro Pleno</h1>
            <p className="text-[12.5px] text-slate-400">Grupo Horizonte · São Paulo/SP</p>
            <span className="text-[11.5px] font-medium text-[#f47a1f]">editar</span>
          </div>

          {/* abas do processo */}
          <div className={"mb-4 flex gap-0.5 overflow-x-auto border-b [scrollbar-width:none] " + t("border-slate-200", "border-slate-700")}>
            {ABAS.map((a) => {
              const clicavel = a.id === "geral" || a.id === "ranking";
              const ativa = aba === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => clicavel && setAba(a.id)}
                  className={
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-[12.5px] font-medium transition-colors " +
                    (ativa
                      ? t("border-[#f47a1f] text-[#d4640f]", "border-[#f47a1f] text-[#f47a1f]")
                      : "border-transparent " + t("text-slate-500 hover:text-slate-700", "text-slate-400 hover:text-slate-200")) +
                    (clicavel ? "" : " cursor-default")
                  }
                >
                  {a.rot}
                  {"destaque" in a && (
                    <span className="rounded-full bg-[#f47a1f] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{a.destaque}</span>
                  )}
                </button>
              );
            })}
          </div>

          {aba === "ranking" ? (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
              {/* ordenação */}
              <div className={cartao}>
                <Titulo acao={<span className="hidden text-[11px] text-slate-400 sm:inline">5 primeiros de 47 · clique para ver o porquê</span>}>
                  Ordenação pelo Match Geral
                </Titulo>
                <ul className="space-y-1">
                  {CANDS.map((k, i) => (
                    <li key={k.nome}>
                      <button
                        type="button"
                        onClick={() => setSel(i)}
                        aria-pressed={sel === i}
                        className={
                          "flex w-full items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition-colors " +
                          (sel === i
                            ? t("border-[#f47a1f]/50 bg-[#fdecdb]/60", "border-[#f47a1f]/45 bg-[#f47a1f]/[.07]")
                            : t("border-transparent hover:bg-slate-50", "border-transparent hover:bg-slate-700/40"))
                        }
                      >
                        <span
                          className={
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold " +
                            (i === 0
                              ? "bg-[#f47a1f] text-white"
                              : i === 1
                              ? t("bg-slate-700 text-white", "bg-slate-600 text-white")
                              : i === 2
                              ? "bg-slate-400 text-white"
                              : t("bg-slate-100 text-slate-500", "bg-slate-700 text-slate-300"))
                          }
                        >
                          {i + 1}º
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className={"text-[14px] font-semibold " + t("text-slate-800", "text-slate-100")}>{k.nome}</span>
                            <span className={"text-[13.5px] font-bold tabular-nums " + corNota(k.match)}>{k.match}% de Match</span>
                            <span className={"text-[10px] font-semibold uppercase tracking-wide " + corNota(k.match)}>{faixa(k.match)}</span>
                          </span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="min-w-0 max-w-full truncate text-[11.5px] text-slate-400">{k.sub}</span>
                            <Selo etapa={k.etapa} />
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className={"mt-3 rounded-r-lg border-l-[3px] px-3 py-2 text-[11.5px] leading-relaxed " + t("border-[#f47a1f] bg-[#fdecdb] text-amber-900", "border-[#f47a1f] bg-[#f47a1f]/10 text-amber-200")}>
                  <b>A pontuação apoia a decisão, não decide.</b> Requisito obrigatório aparece como evidência encontrada ou
                  alerta, nunca como reprovação automática.
                </div>
              </div>

              {/* composição + evidência do selecionado */}
              <div className={cartao}>
                <Titulo>Composição do resultado</Titulo>
                <div className="flex items-center gap-3">
                  <Anel v={c.match} escuro={escuro} cor={corNota(c.match)} />
                  <div className="min-w-0">
                    <p className={"truncate text-[14px] font-semibold " + t("text-slate-800", "text-slate-100")}>{c.nome}</p>
                    <p className={"text-[10.5px] font-semibold uppercase tracking-wide " + corNota(c.match)}>{faixa(c.match)}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Avaliação completa: {c.partes.filter((p) => p.nota !== null).reduce((s, p) => s + p.peso, 0)}%
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {c.partes.map((p) => (
                    <div key={p.curto} className="grid grid-cols-[minmax(0,1fr)_70px_26px] items-center gap-2.5">
                      <div className="min-w-0">
                        <p className={"truncate text-[12px] " + t("text-slate-700", "text-slate-200")}>{p.rot}</p>
                        <p className="truncate text-[10px] text-slate-400">
                          peso {p.peso}%{p.nota === null && " · etapa não realizada, peso redistribuído"}
                        </p>
                      </div>
                      {p.nota === null ? <div className={"h-1.5 rounded-full " + t("bg-slate-100", "bg-slate-700")} /> : barra(p.nota)}
                      <span className={"text-right text-[12.5px] font-bold tabular-nums " + corNota(p.nota)}>{p.nota ?? "-"}</span>
                    </div>
                  ))}
                </div>

                <p className={"mt-3 border-t pt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] " + t("border-slate-200 text-slate-400", "border-slate-700 text-slate-500")}>
                  Requisitos obrigatórios
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {c.obrig.map((o) => (
                    <span
                      key={o.req}
                      title={o.declarado ? "O candidato declarou no formulário; o currículo não mostra. Confirmar na entrevista." : o.ok ? undefined : "Não identificado no material recebido. Confirmar com o candidato."}
                      className={
                        "rounded-md px-2 py-0.5 text-[11px] font-medium " +
                        (o.declarado
                          ? t("bg-amber-100 text-amber-800", "bg-amber-500/15 text-amber-300")
                          : o.ok
                          ? t("bg-emerald-100 text-emerald-700", "bg-emerald-500/15 text-emerald-300")
                          : t("bg-red-100 text-red-700", "bg-red-500/15 text-red-300"))
                      }
                    >
                      {o.ok ? "✓ " : "! "}
                      {o.req}
                      {o.declarado && <span className="ml-1 font-normal opacity-80">(declarado)</span>}
                    </span>
                  ))}
                </div>
                {c.obrig.some((o) => !o.ok) && (
                  <p className={"mt-2 rounded-r-md border-l-[3px] px-2.5 py-1.5 text-[11px] leading-snug " + t("border-sky-500 bg-sky-50 text-sky-900", "border-sky-500 bg-sky-500/10 text-sky-200")}>
                    Requisito sem evidência não é requisito não atendido: o material recebido não falou dele. Confirme com o candidato antes de concluir.
                  </p>
                )}

                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f47a1f]">Por que está nessa posição</p>
                <p className={"mt-0.5 text-[12px] leading-relaxed " + t("text-slate-600", "text-slate-300")}>{c.porque}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2.5 lg:grid-cols-4">
                {[
                  ["47", "candidatos no processo", "cadastrados ou importados", ""],
                  ["71%", "match médio", "12 com 75% ou mais", ""],
                  ["18", "dias em aberto", "prazo de 30 dias", ""],
                  ["No prazo", "situação do prazo", "em risco a partir de 75% do prazo", t("text-emerald-600", "text-emerald-400")],
                ].map(([v, r, n, cor]) => (
                  <div key={r} className={"min-w-0 rounded-xl border px-3.5 py-2.5 " + t("border-slate-200 bg-white", "border-slate-700 bg-slate-800")}>
                    <b className={"block text-[20px] font-bold leading-tight tabular-nums " + (cor || t("text-slate-800", "text-slate-100"))}>{v}</b>
                    <span className={"block text-[12px] " + t("text-slate-600", "text-slate-300")}>{r}</span>
                    <span className="block truncate text-[10.5px] text-slate-400">{n}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-3">
                <div className={cartao + " lg:col-span-2"}>
                  <Titulo
                    acao={
                      <button type="button" onClick={() => setAba("ranking")} className="text-[11px] font-medium text-[#f47a1f]">
                        Ver ranking completo
                      </button>
                    }
                  >
                    Quem está na frente
                  </Titulo>
                  <ul className="space-y-0.5">
                    {CANDS.map((k, i) => (
                      <li key={k.nome}>
                        <button
                          type="button"
                          onClick={() => abrir(i)}
                          className={"flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors " + t("hover:bg-slate-50", "hover:bg-slate-700/40")}
                        >
                          <span
                            className={
                              "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold " +
                              (i === 0 ? "bg-[#f47a1f] text-white" : t("bg-slate-100 text-slate-500", "bg-slate-700 text-slate-300"))
                            }
                          >
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={"block truncate text-[13px] font-medium " + t("text-slate-800", "text-slate-100")}>{k.nome}</span>
                            <span className="block truncate text-[11px] text-slate-400">{k.sub.split(" · ").filter((_, j) => j !== 1).join(" · ")}</span>
                          </span>
                          <span className="hidden sm:inline-flex">
                            <Selo etapa={k.etapa} />
                          </span>
                          <Nota v={k.match} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={cartao}>
                  <Titulo>Funil do processo</Titulo>
                  <div className="space-y-2">
                    {([
                      ["Cadastrados", 47],
                      ["Contatados", 19],
                      ["Entrevistados", 8],
                      ["Apresentados", 3],
                      ["Aprovados", 0],
                    ] as const).map(([r, n]) => (
                      <div key={r} className="flex items-center gap-2">
                        <span className={"w-[84px] shrink-0 text-[11.5px] " + t("text-slate-500", "text-slate-400")}>{r}</span>
                        <div className="min-w-0 flex-1">
                          {barra((n / 47) * 100)}
                        </div>
                        <span className={"w-6 text-right text-[12.5px] font-semibold tabular-nums " + t("text-slate-700", "text-slate-200")}>{n}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mb-1.5 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Por etapa</p>
                  <div className="flex flex-wrap gap-1">
                    {([
                      [21, "Recebido"],
                      [7, "Em triagem"],
                      [11, "Triagem aprovada"],
                      [5, "Entrevista realizada"],
                      [3, "Apresentado ao cliente"],
                    ] as const).map(([n, r]) => (
                      <span key={r} className={"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] " + t("bg-slate-50", "bg-slate-700/50")}>
                        <b className={"font-semibold tabular-nums " + t("text-slate-700", "text-slate-200")}>{n}</b>
                        <span className={t("text-slate-500", "text-slate-400")}>{r}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* o anel de nota do sistema (ui.tsx > Anel), em tamanho de mock */
function Anel({ v, escuro, cor }: { v: number; escuro: boolean; cor: string }) {
  const tam = 76;
  const r = tam / 2 - 6;
  const c = 2 * Math.PI * r;
  const traco = v >= 75 ? "#059669" : v >= 60 ? "#d97706" : "#dc2626";
  return (
    <div className="relative shrink-0" style={{ width: tam, height: tam }}>
      <svg width={tam} height={tam} className="-rotate-90">
        <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" strokeWidth="7" stroke={escuro ? "#334155" : "#e2e8f0"} />
        <circle
          cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke={traco} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c.toFixed(1)} strokeDashoffset={(c * (1 - v / 100)).toFixed(1)}
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <span className={"absolute inset-0 grid place-items-center text-[18px] font-bold tabular-nums " + cor}>
        <span>
          {v}
          <span className="text-[0.55em]">%</span>
        </span>
      </span>
    </div>
  );
}
