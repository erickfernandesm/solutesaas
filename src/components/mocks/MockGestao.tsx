"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * Réplica da tela de tarefas do Sistema de Gestão (tema escuro, slate + laranja
 * #f47a1f): "Tarefas da equipe" com a alternância Lista / Colunas, os filtros
 * reais (busca, Situação, responsável, prazo) e o kanban Fazer / Fazendo / Feito.
 * Clicar num cartão abre a tarefa (responsáveis, prazo, finalizar com o tempo
 * sugerido, comentários e dúvidas). Arrastar para "Feito" pede o tempo gasto.
 */

/* ------------------------------------------------------------------ dados */

const AGORA = "10:47";
const HOJE = 15; // 15/10/2026, quinta-feira
const EU = "ES";

type Status = "PENDENTE" | "EM_ANDAMENTO" | "FINALIZADO";

const PESSOAS: Record<string, { nome: string; cor: string; cargo: string }> = {
  ES: { nome: "Emíllia Santos", cor: "#f47a1f", cargo: "Analista de RH" },
  LC: { nome: "Lívia Campos", cor: "#2563eb", cargo: "Coordenadora de operações" },
  RM: { nome: "Rafael Moura", cor: "#059669", cargo: "Executivo comercial" },
  PA: { nome: "Pâmela Alves", cor: "#d946ef", cargo: "Analista de marketing" },
  VS: { nome: "Vítor Souza", cor: "#7c3aed", cargo: "Analista de TI" },
};

type Mensagem = { autor: string; quando: string; texto: string };
type Duvida = { id: string; resolvida: boolean; mensagens: Mensagem[] };
type Responsavel = { p: string; finalizou: boolean };

type Tarefa = {
  id: string;
  titulo: string;
  descricao: string;
  prazo: number | null; // dia de outubro/2026
  horario?: string;
  status: Status;
  categorias: string[];
  coluna?: string; // coluna criada pela equipe no kanban (opcional)
  anexos: { nome: string; tamanho: string }[];
  resp: Responsavel[];
  criador: string;
  solicitada: string;
  recorrencia?: string;
  emAndamentoEm?: string;
  minutos?: number;
  concluida?: string;
  naoVista?: boolean;
  comentarios: Mensagem[];
  duvidas: Duvida[];
};

const r = (...ps: string[]): Responsavel[] => ps.map((p) => ({ p, finalizou: false }));

const INICIAIS: Tarefa[] = [
  {
    id: "t1",
    titulo: "Enviar escala de novembro",
    descricao: "Montar a escala de novembro com as folgas já aprovadas e mandar para os líderes de turno até o fim do dia.",
    prazo: 15,
    status: "PENDENTE",
    categorias: ["Escalas"],
    anexos: [{ nome: "modelo-escala-2026.xlsx", tamanho: "48 KB" }],
    resp: r("LC"),
    criador: "ES",
    solicitada: "13/10/2026 às 09:12",
    comentarios: [{ autor: "LC", quando: "14/10/2026 às 16:20", texto: "Faltam só as folgas do turno da noite, fecho amanhã cedo." }],
    duvidas: [],
  },
  {
    id: "t2",
    titulo: "Revisar proposta comercial",
    descricao: "Revisar valores, escopo e prazos da proposta antes de enviar ao cliente.",
    prazo: 14,
    status: "PENDENTE",
    categorias: ["Comercial"],
    anexos: [
      { nome: "proposta-comercial-v3.pdf", tamanho: "1.2 MB" },
      { nome: "tabela-precos-2026.pdf", tamanho: "310 KB" },
    ],
    resp: r("RM", EU),
    criador: "PA",
    solicitada: "10/10/2026 às 14:03",
    comentarios: [],
    duvidas: [
      {
        id: "d1",
        resolvida: false,
        mensagens: [{ autor: "RM", quando: "14/10/2026 às 11:38", texto: "A proposta vai com o desconto de 10% ou mantemos a tabela cheia?" }],
      },
    ],
  },
  {
    id: "t3",
    titulo: "Conferir ponto da quinzena",
    descricao: "Conferir as marcações da primeira quinzena e sinalizar as divergências para cada líder.",
    prazo: 16,
    status: "PENDENTE",
    categorias: ["Rotina"],
    anexos: [],
    resp: r(EU),
    criador: "LC",
    solicitada: "15/10/2026 às 08:02",
    naoVista: true,
    comentarios: [],
    duvidas: [],
  },
  {
    id: "t4",
    titulo: "Calendário editorial da semana",
    descricao: "Fechar os temas dos posts da semana e deixar as legendas prontas para aprovação.",
    prazo: 16,
    status: "EM_ANDAMENTO",
    categorias: ["Marketing"],
    anexos: [],
    resp: r(EU),
    criador: "PA",
    solicitada: "12/10/2026 às 07:00",
    recorrencia: "Toda sexta-feira",
    emAndamentoEm: "08:10",
    comentarios: [{ autor: "PA", quando: "15/10/2026 às 08:31", texto: "Inclui o post da campanha de outubro, por favor." }],
    duvidas: [],
  },
  {
    id: "t5",
    titulo: "Integração do novo analista",
    descricao: "Apresentar a equipe, liberar acessos e passar o roteiro da primeira semana.",
    prazo: 16,
    horario: "09:00 às 12:00",
    status: "EM_ANDAMENTO",
    categorias: ["Onboarding"],
    anexos: [{ nome: "roteiro-primeira-semana.pdf", tamanho: "220 KB" }],
    resp: r("VS", EU),
    criador: EU,
    solicitada: "09/10/2026 às 10:15",
    emAndamentoEm: "09:05",
    comentarios: [
      { autor: "VS", quando: "15/10/2026 às 09:10", texto: "Acessos do e-mail e do sistema já liberados." },
      { autor: EU, quando: "15/10/2026 às 09:40", texto: "Ótimo! Eu fico com a apresentação da equipe às 11h." },
    ],
    duvidas: [],
  },
  {
    id: "t6",
    titulo: "Relatório mensal da equipe",
    descricao: "Consolidar entregas, horas e indicadores de setembro.",
    prazo: 10,
    status: "FINALIZADO",
    categorias: ["Relatórios"],
    anexos: [{ nome: "relatorio-setembro.pdf", tamanho: "860 KB" }],
    resp: [{ p: "RM", finalizou: true }],
    criador: EU,
    solicitada: "01/10/2026 às 09:00",
    minutos: 80,
    concluida: "09/10/2026 às 17:42",
    comentarios: [],
    duvidas: [],
  },
  {
    id: "t7",
    titulo: "Agendar 1:1 com a equipe",
    descricao: "Marcar as conversas individuais de outubro na agenda de cada um.",
    prazo: 13,
    status: "FINALIZADO",
    categorias: [],
    anexos: [],
    resp: [{ p: "PA", finalizou: true }],
    criador: EU,
    solicitada: "08/10/2026 às 15:30",
    minutos: 25,
    concluida: "13/10/2026 às 11:05",
    comentarios: [],
    duvidas: [],
  },
];

const prazoTxt = (t: Tarefa) => (t.prazo ? `${String(t.prazo).padStart(2, "0")}/10/2026` : null);
const atrasada = (t: Tarefa) => t.status !== "FINALIZADO" && t.prazo !== null && t.prazo < HOJE;
const duvidaAberta = (t: Tarefa) => t.duvidas.some((d) => !d.resolvida);
const temDuvida = (t: Tarefa) => t.criador !== t.resp[0].p && duvidaAberta(t);

function duracao(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}min`;
}
const minutosEntre = (de: string, ate: string) => {
  const [h1, m1] = de.split(":").map(Number);
  const [h2, m2] = ate.split(":").map(Number);
  return Math.max(1, h2 * 60 + m2 - (h1 * 60 + m1));
};

/* ------------------------------------------------------------- utilitários */

function Ico({ d, s = 16, w = 1.8, className = "" }: { d: string; s?: number; w?: number; className?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" className={"shrink-0 " + className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const CHEVRON = "m6 9 6 6 6-6";
const FECHAR = "M18 6 6 18M6 6l12 12";
const cartao = "rounded-xl border border-slate-700 bg-slate-800";
const rotuloDt = "text-[11px] uppercase tracking-wide text-slate-400";
const tituloSecao = "mb-2.5 text-[13px] font-medium text-slate-300";
const campo = "rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-slate-200 outline-none placeholder:text-slate-500 focus:border-[#f47a1f]";

function Avatar({ p, t = 26 }: { p: string; t?: number }) {
  const pessoa = PESSOAS[p];
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-bold text-white" style={{ width: t, height: t, fontSize: Math.max(7, t * 0.38), backgroundColor: pessoa.cor }} aria-hidden="true">
      {p}
    </span>
  );
}

function Selo({ texto, cor }: { texto: string; cor: string }) {
  return <span className={"inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium " + cor}>{texto}</span>;
}

const COR_SITUACAO = {
  PENDENTE: "bg-amber-100 text-amber-700",
  EM_ANDAMENTO: "bg-sky-100 text-sky-700",
  FINALIZADO: "bg-emerald-100 text-emerald-700",
  EM_ATRASO: "bg-red-100 text-red-700",
};

function SeloTarefa({ t }: { t: Tarefa }) {
  if (t.status === "FINALIZADO") return <Selo texto="Finalizado" cor={COR_SITUACAO.FINALIZADO} />;
  if (atrasada(t)) {
    return (
      <span className="inline-flex flex-wrap items-center justify-end gap-1">
        <Selo texto="Em atraso" cor={COR_SITUACAO.EM_ATRASO} />
        {t.status === "EM_ANDAMENTO" && <Selo texto="Em andamento" cor={COR_SITUACAO.EM_ANDAMENTO} />}
      </span>
    );
  }
  return t.status === "EM_ANDAMENTO" ? <Selo texto="Em andamento" cor={COR_SITUACAO.EM_ANDAMENTO} /> : <Selo texto="Pendente" cor={COR_SITUACAO.PENDENTE} />;
}

function Categoria({ nome }: { nome: string }) {
  return <span className="rounded-full bg-[#f47a1f]/15 px-2 py-0.5 text-[11px] font-medium text-[#f47a1f]">{nome}</span>;
}

/* --------------------------------------------------------- barra lateral */

type Vista = "painel" | "minhas" | "equipe";

const MAO = "M22 14a8 8 0 0 1-8 8M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15";

function Lateral({ naoVistas, vista, irPara, dica }: { naoVistas: number; vista: Vista; irPara: (v: Vista) => void; dica: boolean }) {
  const item = "flex items-center gap-2 rounded-md px-3 py-[5px] text-[13px] font-medium";
  const grupo = (rotulo: string) => (
    <li key={rotulo} className={item + " justify-between text-slate-300"}>
      {rotulo}
      <Ico d={CHEVRON} s={15} w={2} className="text-slate-400" />
    </li>
  );
  const link = (rotulo: string) => (
    <li key={rotulo} className={item + " text-slate-300"}>
      <span className="min-w-0 flex-1 leading-tight">{rotulo}</span>
    </li>
  );
  const badge = (n: number) =>
    n > 0 && <span className="inline-flex min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-white">{n}</span>;
  const clicavel = (v: Vista, rotulo: string, extra?: ReactNode, sublinhado = false) => (
    <button type="button" onClick={() => irPara(v)} aria-current={vista === v ? "page" : undefined} className={`${item} w-full text-left transition-colors ${vista === v ? "bg-[#f47a1f] text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
      <span className={"min-w-0 flex-1 leading-tight " + (sublinhado ? "underline decoration-[#f47a1f] decoration-dashed decoration-2 underline-offset-4" : "")}>{rotulo}</span>
      {extra}
    </button>
  );
  return (
    <aside className="hidden w-[212px] shrink-0 flex-col border-r border-slate-800 bg-slate-900 px-3.5 py-4 lg:flex">
      <div className="px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/solute-horizontal-branca.png" alt="Solute RH" className="h-9 w-auto" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-800/40 px-2 py-2">
        <span className="text-xs font-medium text-slate-300">Disponível</span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-400 ring-offset-1 ring-offset-slate-900" />
          <span className="h-3.5 w-3.5 rounded-full bg-red-500 opacity-30" />
          <span className="h-3.5 w-3.5 rounded-full bg-amber-400 opacity-30" />
        </span>
      </div>

      <ul className="mt-3 flex flex-1 flex-col gap-0.5">
        <li>{clicavel("painel", "Painel")}</li>
        <li>
          <span className={item + " justify-between text-white"}>
            Agenda
            <Ico d={CHEVRON} s={15} w={2} className="rotate-180 text-slate-300" />
          </span>
          <ul className="mt-0.5 flex flex-col gap-0.5 border-l-2 border-[#f47a1f] pl-2">
            <li className="relative">
              {clicavel("minhas", "Minhas tarefas", badge(naoVistas))}
              {dica && (
                // Contorno tracejado girando em volta do item: mostra a quem visita o site que dá para clicar
                // (some depois do 1º clique).
                <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                  <style>{"@keyframes mgFormigas{to{stroke-dashoffset:-20}}"}</style>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    rx="6"
                    fill="none"
                    stroke="#f47a1f"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    style={{ animation: "mgFormigas .8s linear infinite" }}
                  />
                </svg>
              )}
            </li>
            <li>{clicavel("equipe", "Tarefas da equipe")}</li>
            {link("Tarefas Solicitadas")}
            {link("Reuniões")}
            {link("Calendário")}
          </ul>
        </li>
        {grupo("Solicitações")}
        {grupo("Acompanhamento")}
        {grupo("Forms")}
        {link("Equipe")}
        {grupo("Outros Sistemas")}
      </ul>

      <div className="mt-3 flex items-center gap-3 border-t border-slate-800 pt-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f47a1f] text-sm font-bold text-white">ES</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-slate-100">Emíllia Santos</span>
          <span className="block truncate text-[11.5px] text-slate-400">Analista de RH</span>
        </span>
      </div>
      <span className="mt-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-300">
        <Ico d="M12 4V2M12 22v-2M4.9 4.9 3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1l-1.4 1.4M20.5 3.5l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" s={15} w={2} />
        Modo claro
      </span>
    </aside>
  );
}

/* ---------------------------------------------------------------- filtros */

const SITUACOES = [
  { valor: "PENDENTE", rotulo: "Pendentes" },
  { valor: "EM_ANDAMENTO", rotulo: "Em andamento" },
  { valor: "EM_ATRASO", rotulo: "Em atraso" },
  { valor: "DUVIDA", rotulo: "Com dúvida" },
  { valor: "FINALIZADO", rotulo: "Finalizadas" },
];

function passaSituacao(t: Tarefa, s: string) {
  if (s === "FINALIZADO") return t.status === "FINALIZADO";
  if (s === "EM_ANDAMENTO") return t.status === "EM_ANDAMENTO" && !atrasada(t);
  if (s === "PENDENTE") return t.status === "PENDENTE" && !atrasada(t);
  if (s === "EM_ATRASO") return atrasada(t);
  if (s === "DUVIDA") return duvidaAberta(t);
  return true;
}

function FiltroSituacao({ sel, setSel }: { sel: string[]; setSel: (s: string[]) => void }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setAberto((v) => !v)} className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-slate-700">
        <Ico d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" s={15} w={2} />
        Situação
        <span className="rounded-full bg-slate-700 px-1.5 text-[11px] text-slate-300">{sel.length > 0 ? sel.length : "todas"}</span>
        <Ico d={CHEVRON} s={14} w={2} className={"transition-transform " + (aberto ? "rotate-180" : "")} />
      </button>
      {aberto && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setAberto(false)} />
          <div className="absolute left-0 z-30 mt-1 w-56 rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-lg">
            <div className="flex items-center justify-between px-2 py-1">
              <button type="button" onClick={() => setSel([])} className="text-xs font-medium text-[#f47a1f] hover:underline">Mostrar todas</button>
              <button type="button" onClick={() => setSel(SITUACOES.map((o) => o.valor))} className="text-xs font-medium text-slate-400 hover:underline">Marcar todas</button>
            </div>
            {SITUACOES.map((o) => (
              <label key={o.valor} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] text-slate-300 hover:bg-slate-700">
                <input type="checkbox" checked={sel.includes(o.valor)} onChange={() => setSel(sel.includes(o.valor) ? sel.filter((x) => x !== o.valor) : [...sel, o.valor])} className="accent-[#f47a1f]" />
                <span className="truncate">{o.rotulo}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- kanban */

type Coluna = string;
type ColunaExtra = { chave: string; titulo: string; cor: string };
const CORES_EXTRAS = ["bg-sky-500", "bg-violet-500", "bg-pink-500", "bg-teal-500"];
const COLUNAS: { chave: Coluna; titulo: string; cor: string; status: Status }[] = [
  { chave: "FAZER", titulo: "Fazer", cor: "bg-slate-400", status: "PENDENTE" },
  { chave: "FAZENDO", titulo: "Em andamento", cor: "bg-amber-500", status: "EM_ANDAMENTO" },
  { chave: "FEITO", titulo: "Feito", cor: "bg-emerald-500", status: "FINALIZADO" },
];

function InfoCartao({ t }: { t: Tarefa }) {
  return (
    <>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
        <span className={atrasada(t) ? "font-medium text-red-500" : ""}>
          {t.prazo ? `Prazo: ${prazoTxt(t)}` : "Sem prazo"}
          {atrasada(t) ? " (atrasada)" : ""}
        </span>
        {t.anexos.length > 0 && <span>{t.anexos.length} anexo(s)</span>}
        {temDuvida(t) && <span className="text-sky-500">Dúvida</span>}
      </div>
      {t.categorias.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {t.categorias.map((c) => <Categoria key={c} nome={c} />)}
        </div>
      )}
    </>
  );
}

function NovaColuna({ criar }: { criar: (titulo: string) => void }) {
  const [abrindo, setAbrindo] = useState(false);
  const [nome, setNome] = useState("Em revisão");
  if (!abrindo)
    return (
      <button
        type="button"
        onClick={() => setAbrindo(true)}
        className="flex min-h-[120px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-600 p-3 text-[13px] font-medium text-slate-400 transition-colors hover:border-[#f47a1f] hover:text-[#f47a1f] md:w-[132px]"
      >
        <span className="text-xl leading-none">+</span>
        Nova coluna
      </button>
    );
  const ok = () => {
    if (!nome.trim()) return;
    criar(nome.trim());
    setNome("Aguardando cliente");
    setAbrindo(false);
  };
  return (
    <div className="flex shrink-0 flex-col gap-2 rounded-xl border border-[#f47a1f] bg-slate-800/60 p-3 md:w-[210px]">
      <label className="text-xs font-medium text-slate-300" htmlFor="mg-nova-coluna">Nome da coluna</label>
      <input
        id="mg-nova-coluna"
        autoFocus
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") ok(); if (e.key === "Escape") setAbrindo(false); }}
        className="rounded-md border border-slate-600 bg-slate-700 px-2.5 py-1.5 text-[13px] text-slate-100 outline-none focus:border-[#f47a1f]"
      />
      <div className="flex gap-2">
        <button type="button" onClick={ok} className="rounded-md bg-[#f47a1f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#d4640f]">Adicionar</button>
        <button type="button" onClick={() => setAbrindo(false)} className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200">Cancelar</button>
      </div>
    </div>
  );
}

function Kanban({ lista, abrir, soltar, destaque, mostrarResponsavel, extras, criarColuna }: { lista: Tarefa[]; abrir: (id: string) => void; soltar: (id: string, c: Coluna) => void; destaque: string | null; mostrarResponsavel: boolean; extras: ColunaExtra[]; criarColuna: (titulo: string) => void }) {
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [alvo, setAlvo] = useState<Coluna | null>(null);
  const trilho = useRef<HTMLDivElement>(null);
  // Ao criar uma coluna, rola o quadro até o fim para ela aparecer.
  useEffect(() => { if (extras.length) trilho.current?.scrollTo({ left: trilho.current.scrollWidth, behavior: "smooth" }); }, [extras.length]);
  const todas = [...COLUNAS.map((c) => ({ ...c, extra: false })), ...extras.map((c) => ({ ...c, status: "PENDENTE" as Status, extra: true }))];
  return (
    <div ref={trilho} className="flex flex-col gap-3 md:flex-row md:overflow-x-auto md:pb-2 [scrollbar-width:thin]">
      {todas.map((col) => {
        const desta = col.extra
          ? lista.filter((t) => t.coluna === col.chave && t.status !== "FINALIZADO")
          : col.status === "FINALIZADO"
            ? lista.filter((t) => t.status === "FINALIZADO")
            : lista.filter((t) => t.status === col.status && !t.coluna);
        return (
          <div
            key={col.chave}
            onDragOver={(e) => {
              e.preventDefault();
              setAlvo(col.chave);
            }}
            onDragLeave={() => setAlvo((a) => (a === col.chave ? null : a))}
            onDrop={(e) => {
              e.preventDefault();
              setAlvo(null);
              if (arrastando) soltar(arrastando, col.chave);
              setArrastando(null);
            }}
            className={`flex min-w-0 flex-col rounded-xl border p-3 transition-colors md:min-w-[170px] md:flex-1 ${alvo === col.chave ? "border-[#f47a1f] bg-[#f47a1f]/10" : "border-slate-700 bg-slate-800/40"}`}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={"h-2.5 w-2.5 shrink-0 rounded-full " + col.cor} />
              <h2 className="truncate text-[13px] font-semibold text-slate-200">{col.titulo}</h2>
              <span className="ml-auto rounded-full bg-slate-700 px-2 text-xs font-medium text-slate-300">{desta.length}</span>
            </div>
            <div className="flex min-h-[80px] flex-col gap-2">
              {desta.map((t) => {
                const podeArrastar = t.status !== "FINALIZADO";
                return (
                  <article
                    key={t.id}
                    draggable={podeArrastar}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", t.id);
                      setArrastando(t.id);
                    }}
                    onDragEnd={() => {
                      setArrastando(null);
                      setAlvo(null);
                    }}
                    onClick={() => abrir(t.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && abrir(t.id)}
                    tabIndex={0}
                    role="button"
                    className={`rounded-lg border bg-slate-800 p-3 shadow-sm transition-all duration-700 hover:border-slate-500 ${destaque === t.id ? "border-[#f47a1f] bg-[#f47a1f]/15 shadow-[0_0_0_3px_rgba(244,122,31,0.35)] " : "border-slate-700 "}${t.naoVista ? "ring-2 ring-amber-400/80 " : ""}${podeArrastar ? "cursor-grab active:cursor-grabbing " : "cursor-pointer "}${arrastando === t.id ? "opacity-50" : ""}`}
                  >
                    <p className="text-[13px] font-medium leading-snug text-slate-100">{t.titulo}</p>
                    <InfoCartao t={t} />
                    {(mostrarResponsavel || (t.status === "FINALIZADO" && !!t.minutos)) && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                        {mostrarResponsavel && (
                          <>
                            <Avatar p={t.resp[0].p} t={16} />
                            <span className="truncate">
                              {PESSOAS[t.resp[0].p].nome.split(" ")[0]}
                              {t.resp.length > 1 ? ` +${t.resp.length - 1}` : ""}
                            </span>
                          </>
                        )}
                        {t.status === "FINALIZADO" && t.minutos && <span className="ml-auto shrink-0">⏱️ {duracao(t.minutos)}</span>}
                      </div>
                    )}
                  </article>
                );
              })}
              {desta.length === 0 && <p className="rounded-lg border border-dashed border-slate-700 py-6 text-center text-xs text-slate-400">{col.extra ? "Arraste um cartão para cá" : "Nada aqui"}</p>}
            </div>
          </div>
        );
      })}
      <NovaColuna criar={criarColuna} />
    </div>
  );
}

function Lista({ lista, abrir, mostrarResponsavel }: { lista: Tarefa[]; abrir: (id: string) => void; mostrarResponsavel: boolean }) {
  if (lista.length === 0) return <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800 p-8 text-center text-[13px] text-slate-500">Nenhuma tarefa encontrada.</div>;
  return (
    <div className="flex flex-col gap-2.5">
      {lista.map((t, i) => (
        <div key={t.id} role="button" tabIndex={0} onClick={() => abrir(t.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && abrir(t.id)} className={`${cartao} flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left transition hover:border-slate-500 ${t.naoVista ? "ring-2 ring-amber-400/80" : ""}`}>
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-300">{i + 1}</span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium text-slate-100">{t.titulo}</span>
              <InfoCartao t={t} />
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className={mostrarResponsavel ? "hidden items-center gap-2 sm:flex" : "hidden"}>
              <Avatar p={t.resp[0].p} t={24} />
              <span className="whitespace-nowrap text-xs text-slate-400">
                {PESSOAS[t.resp[0].p].nome.split(" ")[0]}
                {t.resp.length > 1 ? ` +${t.resp.length - 1}` : ""}
              </span>
            </span>
            {temDuvida(t) && <Selo texto="Dúvida" cor="bg-sky-100 text-sky-700" />}
            <SeloTarefa t={t} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------- finalizar tarefa */

function ModalFinalizar({ t, sugerir, aoConfirmar, aoCancelar }: { t: Tarefa; sugerir: boolean; aoConfirmar: (min: number | null) => void; aoCancelar: () => void }) {
  const varios = t.resp.length > 1;
  const sugestao = sugerir && t.emAndamentoEm ? minutosEntre(t.emAndamentoEm, AGORA) : null;
  const [horas, setHoras] = useState(sugestao ? String(Math.floor(sugestao / 60)) : "");
  const [minutos, setMinutos] = useState(sugestao ? String(sugestao % 60) : "");
  const numero = "w-20 rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-[13px] text-slate-100 outline-none focus:border-[#f47a1f]";
  const parte = sugerir && varios;
  return (
    <div className="absolute inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10" onMouseDown={(e) => e.target === e.currentTarget && aoCancelar()}>
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-slate-800 p-6 shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-100">{parte ? "Finalizar minha parte" : "Finalizar tarefa"}</h2>
          <button type="button" onClick={aoCancelar} aria-label="Fechar" className="-mr-1 -mt-1 rounded-md p-1 text-slate-400 hover:bg-slate-700">
            <Ico d={FECHAR} s={18} w={2} />
          </button>
        </div>
        {parte ? (
          <p className="mt-1 text-[13px] text-slate-400">A tarefa só é concluída quando todos os responsáveis finalizarem.</p>
        ) : (
          <p className="mt-1 truncate text-[13px] text-slate-400">{t.titulo}</p>
        )}

        {sugestao && (
          <div className="mt-4 rounded-lg border border-emerald-800/50 bg-emerald-900/20 p-3">
            <p className="text-[13px] text-slate-300">
              Você pôs <b>em andamento</b> às {t.emAndamentoEm} e está finalizando às {AGORA}.
            </p>
            <p className="mt-1 text-[13px] font-semibold text-emerald-300">Sugestão: você levou {duracao(sugestao)}.</p>
            <p className="mt-1 text-xs text-slate-400">Já preenchi abaixo. Se não bater, é só ajustar.</p>
          </div>
        )}

        <div className="mt-4">
          <label className="mb-1 block text-[13px] text-slate-300">Quanto tempo você levou?</label>
          <div className="flex items-center gap-2">
            <input type="number" min={0} value={horas} onChange={(e) => setHoras(e.target.value)} placeholder="0" className={numero} />
            <span className="text-[13px] text-slate-400">h</span>
            <input type="number" min={0} max={59} value={minutos} onChange={(e) => setMinutos(e.target.value)} placeholder="0" className={numero} />
            <span className="text-[13px] text-slate-400">min</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={aoCancelar} className="rounded-md px-4 py-2 text-[13px] font-medium text-slate-400 hover:bg-slate-700">Cancelar</button>
          <button
            type="button"
            onClick={() => {
              const total = (parseInt(horas) || 0) * 60 + (parseInt(minutos) || 0);
              aoConfirmar(total > 0 ? total : null);
            }}
            className="rounded-md bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-emerald-700"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- tarefa aberta */

function Bloco({ titulo, extra, children }: { titulo: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <h3 className={tituloSecao}>
        {titulo}
        {extra}
      </h3>
      {children}
    </section>
  );
}

function Fala({ m }: { m: Mensagem }) {
  return (
    <div className="flex gap-2.5">
      <Avatar p={m.autor} t={28} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[13px] font-medium text-slate-200">{PESSOAS[m.autor].nome}</span>
          <span className="text-xs text-slate-400">{m.quando}</span>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-[13px] text-slate-300">{m.texto}</p>
      </div>
    </div>
  );
}

function Detalhe({
  t,
  aoFechar,
  atualizar,
  pedirFinalizar,
  voltar,
}: {
  t: Tarefa;
  aoFechar: () => void;
  atualizar: (f: (t: Tarefa) => Tarefa) => void;
  pedirFinalizar: () => void;
  voltar: string;
}) {
  const [comentario, setComentario] = useState("");
  const [novaDuvida, setNovaDuvida] = useState("");
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [resolvidasAbertas, setResolvidasAbertas] = useState<string[]>([]);

  const finalizada = t.status === "FINALIZADO";
  const varios = t.resp.length > 1;
  const minhaParte = t.resp.find((x) => x.p === EU) ?? null;
  const totalFinalizados = t.resp.filter((x) => x.finalizou).length;
  const tarefaPropria = !varios && t.criador === t.resp[0].p;
  const agora = `15/10/2026 às ${AGORA}`;
  const botaoMarca = "rounded-md bg-[#f47a1f] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#d4640f]";
  const areaTexto = campo + " w-full resize-none";

  const concluirComoGestor = () => atualizar((x) => ({ ...x, status: "FINALIZADO", concluida: agora, resp: x.resp.map((p) => ({ ...p, finalizou: true })) }));

  return (
    <div className="absolute inset-0 z-30 flex justify-end bg-black/50" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <aside role="dialog" aria-modal="true" aria-label={t.titulo} className="flex h-full w-full max-w-[480px] flex-col border-l border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-700 px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400">
            <Ico d="M19 12H5M12 19l-7-7 7-7" s={15} w={2} />
            {voltar}
          </span>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
            <Ico d={FECHAR} s={18} w={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <h2 className="min-w-0 flex-1 basis-48 text-lg font-semibold leading-snug text-slate-100">{t.titulo}</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {t.recorrencia && <Selo texto={t.recorrencia} cor="bg-amber-500/15 text-amber-400" />}
              {!tarefaPropria && duvidaAberta(t) && <Selo texto="Dúvida" cor="bg-sky-100 text-sky-700" />}
              <SeloTarefa t={t} />
            </div>
          </div>
          {(t.categorias.length > 0 || t.minutos) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {t.categorias.map((c) => <Categoria key={c} nome={c} />)}
              {t.minutos ? <span className="text-xs text-slate-400">⏱️ {duracao(t.minutos)}</span> : null}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3">
            <div className={cartao + " p-4"}>
              <dl className="flex flex-col gap-3 text-[13px]">
                <div>
                  <dt className={rotuloDt}>
                    {varios ? "Responsáveis" : "Responsável"}
                    {varios && <span className="ml-1 normal-case tracking-normal">({totalFinalizados} de {t.resp.length} finalizaram)</span>}
                  </dt>
                  <dd className="mt-1.5 flex flex-col gap-1.5">
                    {t.resp.map((x) => (
                      <div key={x.p} className="flex items-center gap-2">
                        <Avatar p={x.p} />
                        <span className="text-slate-200">{PESSOAS[x.p].nome}</span>
                        {varios && (x.finalizou ? <span className="ml-auto text-xs font-medium text-emerald-400">finalizou</span> : <span className="ml-auto text-xs text-slate-400">pendente</span>)}
                      </div>
                    ))}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className={rotuloDt}>Prazo</dt>
                    <dd className={"mt-1 " + (atrasada(t) ? "font-medium text-red-400" : "text-slate-200")}>
                      {prazoTxt(t) ?? "Sem prazo"}
                      {t.horario ? ` - ${t.horario}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className={rotuloDt}>Criada por</dt>
                    <dd className="mt-1 text-slate-200">{PESSOAS[t.criador].nome}</dd>
                  </div>
                </div>
                <div>
                  <dt className={rotuloDt}>Solicitada em</dt>
                  <dd className="mt-1 text-slate-200">{t.solicitada}</dd>
                </div>
              </dl>
            </div>

            {finalizada ? (
              <div className={cartao + " p-4"}>
                <p className="flex items-center gap-2 text-[13px] font-medium text-slate-200">
                  <Ico d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" s={16} w={2} />
                  Tarefa finalizada
                </p>
                <div className="mt-2">
                  {t.prazo !== null && t.prazo < HOJE && t.concluida?.startsWith("15/") ? (
                    <Selo texto="Finalizada com atraso" cor="bg-red-100 text-red-700" />
                  ) : (
                    <Selo texto="Finalizada no prazo" cor="bg-emerald-100 text-emerald-700" />
                  )}
                </div>
                {t.concluida && <p className="mt-2 text-xs text-slate-400">Concluída em {t.concluida}</p>}
              </div>
            ) : (
              <div className={cartao + " flex flex-col gap-2.5 p-4"}>
                <button
                  type="button"
                  onClick={() =>
                    atualizar((x) =>
                      x.status === "EM_ANDAMENTO" ? { ...x, status: "PENDENTE", emAndamentoEm: undefined } : { ...x, status: "EM_ANDAMENTO", emAndamentoEm: AGORA },
                    )
                  }
                  className="w-full rounded-md border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-[13px] font-medium text-sky-300 hover:bg-sky-500/20"
                >
                  {t.status === "EM_ANDAMENTO" ? "Voltar para pendente" : "Marcar em andamento"}
                </button>

                {minhaParte &&
                  (minhaParte.finalizou ? (
                    <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-[13px]">
                      <p className="font-medium text-emerald-400">Você finalizou sua parte.</p>
                      {varios && <p className="mt-0.5 text-xs text-emerald-400/80">Aguardando os demais ({totalFinalizados} de {t.resp.length} finalizaram).</p>}
                      <button type="button" onClick={() => atualizar((x) => ({ ...x, resp: x.resp.map((p) => (p.p === EU ? { ...p, finalizou: false } : p)) }))} className="mt-2 text-xs font-medium text-slate-400 underline hover:text-slate-200">
                        Desfazer minha finalização
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={pedirFinalizar} className="w-full rounded-md bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-emerald-700">
                      {varios ? "Finalizei minha parte" : "Marcar como finalizada"}
                    </button>
                  ))}

                {!minhaParte && !varios && (
                  <button type="button" onClick={concluirComoGestor} className="w-full rounded-md bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-emerald-700">
                    Marcar como finalizada
                  </button>
                )}

                {varios && (
                  <div className="border-t border-slate-700 pt-2.5">
                    <button type="button" onClick={concluirComoGestor} className="w-full rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-[13px] font-medium text-amber-400 hover:bg-amber-500/20">
                      Concluir mesmo assim
                    </button>
                    <p className="mt-1 text-xs text-slate-400">Fecha a tarefa sem esperar todos finalizarem. Só você, como gestor, vê esta opção.</p>
                  </div>
                )}
              </div>
            )}

            <div className={cartao + " p-4"}>
              <h3 className="text-[13px] font-medium text-slate-300">Descrição</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300">{t.descricao}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <Bloco titulo="Anexos">
              {t.anexos.length === 0 ? (
                <p className="text-[13px] text-slate-400">Nenhum anexo.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {t.anexos.map((a) => (
                    <li key={a.nome} className="flex items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-800 px-3 py-2">
                      <span className="min-w-0 truncate text-[13px] text-[#f47a1f]">{a.nome}</span>
                      <span className="shrink-0 text-xs text-slate-400">{a.tamanho}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Bloco>

            <Bloco titulo="Comentários" extra={t.comentarios.length > 0 && <span className="ml-2 font-normal text-slate-400">{t.comentarios.length}</span>}>
              <div className="flex flex-col gap-2.5">
                {t.comentarios.length === 0 && <p className="text-[13px] text-slate-400">Nenhum comentário ainda. Use pra combinar o que falta, avisar o que mudou e registrar o andamento.</p>}
                {t.comentarios.map((c, i) => (
                  <div key={i} className="rounded-lg border border-slate-700 bg-slate-800 p-3">
                    <Fala m={c} />
                  </div>
                ))}
                {!finalizada && (
                  <div className="flex flex-col gap-2">
                    <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} rows={2} placeholder="Escreva um comentário..." className={areaTexto} />
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!comentario.trim()) return;
                          atualizar((x) => ({ ...x, comentarios: [...x.comentarios, { autor: EU, quando: agora, texto: comentario.trim() }] }));
                          setComentario("");
                        }}
                        className={botaoMarca}
                      >
                        Comentar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Bloco>

            {!tarefaPropria && (
              <Bloco titulo="Dúvidas">
                <div className="flex flex-col gap-3">
                  {!finalizada && (
                    <div className="flex flex-col gap-2 rounded-lg border border-slate-700 bg-slate-800 p-3">
                      <textarea value={novaDuvida} onChange={(e) => setNovaDuvida(e.target.value)} rows={2} placeholder={minhaParte ? "Ficou com alguma dúvida sobre essa tarefa? Pergunte aqui." : "Abra uma dúvida ou recado pro responsável dessa tarefa."} className={areaTexto} />
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!novaDuvida.trim()) return;
                            atualizar((x) => ({ ...x, duvidas: [{ id: "d" + Date.now(), resolvida: false, mensagens: [{ autor: EU, quando: agora, texto: novaDuvida.trim() }] }, ...x.duvidas] }));
                            setNovaDuvida("");
                          }}
                          className={botaoMarca}
                        >
                          Abrir dúvida
                        </button>
                      </div>
                    </div>
                  )}
                  {t.duvidas.length === 0 && <p className="text-[13px] text-slate-400">Nenhuma dúvida registrada nesta tarefa.</p>}
                  {t.duvidas.map((d) =>
                    d.resolvida ? (
                      <div key={d.id} className="rounded-lg border border-slate-700">
                        <button type="button" onClick={() => setResolvidasAbertas((a) => (a.includes(d.id) ? a.filter((x) => x !== d.id) : [...a, d.id]))} className="flex w-full items-center justify-between px-4 py-2 text-left">
                          <span className="text-xs font-medium text-emerald-500">Resolvida</span>
                          <Ico d={CHEVRON} s={16} w={2} className={"text-slate-400 transition-transform " + (resolvidasAbertas.includes(d.id) ? "rotate-180" : "")} />
                        </button>
                        {resolvidasAbertas.includes(d.id) && (
                          <div className="flex flex-col gap-3 px-4 pb-4">
                            {d.mensagens.map((m, i) => <Fala key={i} m={m} />)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={d.id} className="rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
                          <span className="text-xs font-medium text-amber-500">Em aberto</span>
                          <button type="button" onClick={() => atualizar((x) => ({ ...x, duvidas: x.duvidas.map((y) => (y.id === d.id ? { ...y, resolvida: true } : y)) }))} className="text-xs text-slate-400 hover:underline">
                            Marcar como resolvida
                          </button>
                        </div>
                        <div className="flex flex-col gap-3 px-4 py-3">
                          {d.mensagens.map((m, i) => <Fala key={i} m={m} />)}
                        </div>
                        <div className="flex flex-col gap-2 border-t border-slate-700 p-3">
                          <textarea value={respostas[d.id] ?? ""} onChange={(e) => setRespostas((s) => ({ ...s, [d.id]: e.target.value }))} rows={2} placeholder="Escreva uma resposta..." className={areaTexto} />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const texto = (respostas[d.id] ?? "").trim();
                                if (!texto) return;
                                atualizar((x) => ({ ...x, duvidas: x.duvidas.map((y) => (y.id === d.id ? { ...y, mensagens: [...y.mensagens, { autor: EU, quando: agora, texto }] } : y)) }));
                                setRespostas((s) => ({ ...s, [d.id]: "" }));
                              }}
                              className={botaoMarca}
                            >
                              Enviar
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </Bloco>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ painel */

// réplica de /painel (aba "Resumo"): Minhas tarefas, Do time, Próxima reunião e
// Minhas próximas entregas. Os números saem das mesmas tarefas do kanban.
function Indicador({ rotulo, valor, accent, destaque, aoClicar }: { rotulo: string; valor: number; accent: "minhas" | "time"; destaque?: boolean; aoClicar: () => void }) {
  const cor = destaque ? "text-red-500" : accent === "minhas" ? "text-[#f47a1f]" : "text-sky-400";
  return (
    <button type="button" onClick={aoClicar} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3.5 text-left transition-colors hover:border-slate-500">
      <span className="block text-xs uppercase tracking-wide text-slate-500">{rotulo}</span>
      <span className={"mt-1 block text-2xl font-semibold tabular-nums " + cor}>{valor}</span>
    </button>
  );
}

function Pilula({ cor, d, children }: { cor: string; d: string; children: ReactNode }) {
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white " + cor}>
      <Ico d={d} s={13} w={2} />
      {children}
    </span>
  );
}

function VerMais({ aoClicar }: { aoClicar?: () => void }) {
  const cls = "inline-flex items-center gap-1 text-[13px] font-medium text-[#f47a1f] hover:underline";
  const corpo = (
    <>
      Ver mais <Ico d="M5 12h14M13 6l6 6-6 6" s={14} w={2} />
    </>
  );
  return aoClicar ? (
    <button type="button" onClick={aoClicar} className={cls}>{corpo}</button>
  ) : (
    <span className={cls}>{corpo}</span>
  );
}

function Painel({ tarefas, irPara, abrir }: { tarefas: Tarefa[]; irPara: (v: Vista) => void; abrir: (id: string) => void }) {
  // "minhas" = sou responsável e ainda não finalizei a minha parte
  const minhas = tarefas.filter((t) => t.status !== "FINALIZADO" && t.resp.some((x) => x.p === EU && !x.finalizou));
  const time = tarefas.filter((t) => t.status !== "FINALIZADO");
  const entregas = [...minhas].sort((a, b) => (a.prazo ?? 99) - (b.prazo ?? 99)).slice(0, 5);
  const video = "M15 10l5-3v10l-5-3M3 7h12v10H3z";
  const h2 = "text-[15px] font-medium text-slate-200";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold text-slate-100">Olá, Emíllia</h1>
          <p className="mt-1 text-[13px] text-slate-400">Aqui está o resumo do seu dia.</p>
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-slate-600" aria-hidden="true">
          <span title="Resumo" className="inline-flex items-center justify-center bg-slate-600 px-3.5 py-2.5 text-white">
            <Ico d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" s={15} w={2} />
          </span>
          <span title="Atalhos" className="inline-flex items-center justify-center px-3.5 py-2.5 text-slate-400">
            <Ico d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" s={15} w={2} />
          </span>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-5">
          <section>
            <div className="mb-2.5">
              <Pilula cor="bg-[#f47a1f]" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z">Minhas tarefas</Pilula>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Indicador rotulo="Em aberto" valor={minhas.length} accent="minhas" aoClicar={() => irPara("minhas")} />
              <Indicador rotulo="Em atraso" valor={minhas.filter(atrasada).length} destaque={minhas.some(atrasada)} accent="minhas" aoClicar={() => irPara("minhas")} />
            </div>
          </section>

          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className={h2}>Próxima reunião</h2>
              <VerMais />
            </div>
            <div className="rounded-xl border border-[#f47a1f]/40 bg-[#f47a1f]/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#f47a1f]">
                    Próxima reunião <span className="normal-case">- Google Agenda</span>
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">Alinhamento comercial</p>
                  <p className="mt-0.5 text-[13px] text-slate-300">15/10/2026 às 16:00 · em 5 horas</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Ico d={video} s={13} w={2} /> Google Meet · meet.google.com/rkp-qwtz-hvb
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#f47a1f] px-4 py-2 text-[13px] font-medium text-white">Entrar</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium text-slate-100">Reunião de equipe</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>16/10/2026 às 10:00</span>
                  <span className="rounded-full bg-slate-700 px-2 py-0.5">Online</span>
                  <span className="rounded-full bg-slate-700 px-2 py-0.5">Repete toda semana</span>
                </div>
              </div>
              <span className="shrink-0 rounded-md border border-slate-600 px-3 py-1.5 text-[13px] text-[#f47a1f]">Entrar</span>
            </div>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <section>
            <div className="mb-2.5">
              <Pilula cor="bg-sky-600" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75">Do time</Pilula>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Indicador rotulo="Em aberto" valor={time.length} accent="time" aoClicar={() => irPara("equipe")} />
              <Indicador rotulo="Em atraso" valor={time.filter(atrasada).length} destaque={time.some(atrasada)} accent="time" aoClicar={() => irPara("equipe")} />
            </div>
          </section>

          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className={h2}>Minhas próximas entregas</h2>
              <VerMais aoClicar={() => irPara("minhas")} />
            </div>
            {entregas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800 p-6 text-center text-[13px] text-slate-500">Nada no horizonte. Aproveite!</div>
            ) : (
              <div className="flex flex-col gap-2">
                {entregas.map((t) => (
                  <button key={t.id} type="button" onClick={() => abrir(t.id)} className={`${cartao} flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:border-slate-500`}>
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-medium text-slate-100">{t.titulo}</span>
                      <span className="mt-0.5 block text-xs text-slate-400">{t.prazo ? `Prazo: ${prazoTxt(t)}` : "Sem prazo"}</span>
                    </span>
                    <SeloTarefa t={t} />
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- nova tarefa */

const NOMES_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NOMES_LONGOS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

function rotuloRecorrencia(dias: number[]) {
  if (dias.length === 1) return `Toda ${NOMES_LONGOS[dias[0]]}`;
  if (dias.length === 7) return "Todos os dias";
  if (dias.length === 5 && [1, 2, 3, 4, 5].every((d) => dias.includes(d))) return "Dias úteis (seg a sex)";
  return dias.map((d) => NOMES_DIAS[d]).join(", ");
}

type NovaTarefaDados = { titulo: string; descricao: string; prazo: number | null; resp: string[]; horario?: string; recorrencia?: string };

function NovaTarefa({ aoCriar, aoCancelar, iniciais }: { aoCriar: (d: NovaTarefaDados) => void; aoCancelar: () => void; iniciais: string[] }) {
  const [titulo, setTitulo] = useState("Preparar pauta do alinhamento comercial");
  const [descricao, setDescricao] = useState("Levantar os números da semana e os pontos que precisam de decisão na reunião das 16h.");
  const [prazo, setPrazo] = useState("2026-10-15");
  const [semPrazo, setSemPrazo] = useState(false);
  const [repetir, setRepetir] = useState(false);
  const [dias, setDias] = useState<number[]>([]);
  const [resp, setResp] = useState<string[]>(iniciais);
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState(false);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [erro, setErro] = useState("");

  const entrada = "w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-[13px] text-slate-100 outline-none placeholder:text-slate-400 focus:border-[#f47a1f]";
  const rotulo = "mb-1 block text-[13px] font-medium text-slate-300";
  const dica = "text-xs text-slate-400";
  const diaDoPrazo = () => (prazo ? new Date(`${prazo}T12:00:00`).getDay() : null);
  const opcoes = Object.entries(PESSOAS)
    .filter(([, p]) => p.nome.toLowerCase().includes(busca.trim().toLowerCase()))
    .sort((a, b) => a[1].nome.localeCompare(b[1].nome, "pt-BR"));
  const nomeDe = (k: string) => (k === EU ? `${PESSOAS[k].nome} (você)` : PESSOAS[k].nome);
  const curto = (k: string) => (k === EU ? "Você" : PESSOAS[k].nome.split(" ")[0]);
  const resumoResp = resp.length <= 2 ? resp.map(curto).join(" e ") : `${resp.slice(0, 2).map(curto).join(", ")} e mais ${resp.length - 2}`;

  const criar = () => {
    if (!titulo.trim()) return setErro("Dê um título para a tarefa.");
    if (resp.length === 0) return setErro("Escolha ao menos um responsável.");
    if (!semPrazo && !prazo) return setErro("Informe o prazo de entrega ou marque “Sem prazo de entrega”.");
    if (repetir && dias.length === 0) return setErro("Escolha ao menos um dia da semana.");
    const [ano, mes, dia] = prazo.split("-").map(Number);
    aoCriar({
      titulo: titulo.trim(),
      descricao: descricao.trim() || "Sem descrição.",
      prazo: semPrazo || ano !== 2026 || mes !== 10 ? null : dia,
      resp,
      horario: !semPrazo && inicio && fim ? `${inicio} às ${fim}` : undefined,
      recorrencia: repetir && !semPrazo ? rotuloRecorrencia(dias) : undefined,
    });
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/50 p-3 sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && aoCancelar()}>
      <div role="dialog" aria-modal="true" aria-label="Nova tarefa" className="w-full max-w-xl rounded-xl bg-slate-800 p-4 shadow-xl sm:px-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-100">Nova tarefa</h2>
          <button type="button" onClick={aoCancelar} aria-label="Fechar" className="-mr-1 -mt-1 rounded-md p-1 text-slate-400 hover:bg-slate-700">
            <Ico d={FECHAR} s={18} w={2} />
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <div>
            <label htmlFor="nt-titulo" className={rotulo}>Título</label>
            <input id="nt-titulo" value={titulo} maxLength={160} onChange={(e) => setTitulo(e.target.value)} className={entrada} />
          </div>
          <div>
            <label htmlFor="nt-desc" className={rotulo}>Descrição</label>
            <textarea id="nt-desc" value={descricao} rows={2} onChange={(e) => setDescricao(e.target.value)} className={entrada + " resize-none"} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <label htmlFor="nt-prazo" className={rotulo + " mb-0"}>Prazo de entrega</label>
              <input id="nt-prazo" type="date" value={prazo} min="2026-10-15" disabled={semPrazo} onChange={(e) => setPrazo(e.target.value)} className={entrada + " [color-scheme:dark] " + (semPrazo ? "opacity-50" : "")} />
              <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={semPrazo} onChange={(e) => { setSemPrazo(e.target.checked); if (e.target.checked) setRepetir(false); }} className="accent-[#f47a1f]" />
                Sem prazo de entrega
              </label>
              <label className={"flex cursor-pointer items-center gap-2 text-xs " + (semPrazo ? "text-slate-600" : "text-slate-400")}>
                <input
                  type="checkbox"
                  checked={repetir}
                  disabled={semPrazo}
                  onChange={(e) => {
                    setRepetir(e.target.checked);
                    const d = diaDoPrazo();
                    if (e.target.checked && dias.length === 0 && d !== null) setDias([d]);
                  }}
                  className="accent-[#f47a1f]"
                />
                Repetir nos dias da semana
              </label>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <span className={rotulo + " mb-0"}>Responsáveis</span>
              <div className="relative">
                {/* Campo único: avatares empilhados + resumo dos nomes. Ao clicar, abre a lista com caixas de seleção. */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={lista}
                  onClick={() => setLista(!lista)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setLista(!lista))}
                  className={`flex h-10 cursor-pointer items-center gap-2.5 rounded-md border bg-slate-700 px-2.5 transition-colors ${lista ? "border-[#f47a1f]" : "border-slate-600 hover:border-slate-500"}`}
                >
                  {resp.length > 0 ? (
                    <>
                      <span className="flex shrink-0 -space-x-2">
                        {resp.slice(0, 4).map((k) => (
                          <span key={k} className="rounded-full ring-2 ring-slate-700">
                            <Avatar p={k} t={24} />
                          </span>
                        ))}
                        {resp.length > 4 && (
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-600 text-[10px] font-semibold text-slate-100 ring-2 ring-slate-700">+{resp.length - 4}</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-slate-100">{resumoResp}</span>
                    </>
                  ) : (
                    <span className="flex-1 text-[13px] text-slate-400">Escolher responsáveis</span>
                  )}
                  <Ico d="M6 9l6 6 6-6" s={15} w={2} className={`shrink-0 text-slate-400 transition-transform ${lista ? "rotate-180" : ""}`} />
                </div>

                {lista && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => { setLista(false); setBusca(""); }} aria-hidden="true" />
                    <div className="absolute bottom-full left-0 right-0 z-20 mb-1 overflow-hidden rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
                      <div className="relative border-b border-slate-700 p-2">
                        <Ico d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" s={14} w={2} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input autoFocus value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar pessoa..." aria-label="Buscar pessoa" className={entrada + " py-1.5 pl-8"} />
                      </div>
                      <ul className="max-h-40 overflow-y-auto overscroll-contain py-1">
                        {opcoes.length === 0 && <li className="px-3 py-2 text-[13px] text-slate-400">Ninguém encontrado.</li>}
                        {opcoes.map(([k, p]) => {
                          const marcado = resp.includes(k);
                          return (
                            <li key={k}>
                              <label className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 hover:bg-slate-700">
                                <Avatar p={k} t={26} />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[13px] text-slate-100">{nomeDe(k)}</span>
                                  <span className="block truncate text-[11px] text-slate-400">{p.cargo}</span>
                                </span>
                                <input
                                  type="checkbox"
                                  checked={marcado}
                                  onChange={() => setResp(marcado ? resp.filter((x) => x !== k) : [...resp, k])}
                                  className="h-4 w-4 shrink-0 accent-[#f47a1f]"
                                />
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="border-t border-slate-700 px-3 py-2 text-xs text-slate-400">
                        {resp.length} selecionado{resp.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <span className={dica}>Com mais de uma pessoa, a tarefa só fecha quando todos finalizarem.</span>
            </div>
          </div>

          {repetir && !semPrazo && (
            <div className="flex flex-col gap-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3">
              <span className="text-[13px] font-medium text-slate-300">Em quais dias repete?</span>
              <div className="flex flex-wrap gap-1.5">
                {NOMES_DIAS.map((nome, d) => (
                  <button key={d} type="button" onClick={() => setDias(dias.includes(d) ? dias.filter((x) => x !== d) : [...dias, d].sort((a, b) => a - b))} className={`h-8 w-11 rounded-md border text-[13px] font-medium transition ${dias.includes(d) ? "border-[#f47a1f] bg-[#f47a1f] text-white" : "border-slate-600 bg-slate-900 text-slate-300 hover:border-[#f47a1f]"}`}>
                    {nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {erro && <p className="text-[13px] text-red-400">{erro}</p>}

          <div className="flex flex-wrap items-end gap-3 border-t border-slate-700 pt-3">
            {!semPrazo && (
              <>
                <div>
                  <label htmlFor="nt-ini" className={rotulo}>Começa às <span className="font-normal text-slate-500">(opcional)</span></label>
                  <input id="nt-ini" type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} className={entrada + " w-32 [color-scheme:dark]"} />
                </div>
                <div>
                  <label htmlFor="nt-fim" className={rotulo}>Termina às <span className="font-normal text-slate-500">(opcional)</span></label>
                  <input id="nt-fim" type="time" value={fim} onChange={(e) => setFim(e.target.value)} className={entrada + " w-32 [color-scheme:dark]"} />
                </div>
              </>
            )}
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={aoCancelar} className="rounded-md px-4 py-2 text-[13px] font-medium text-slate-400 hover:bg-slate-700">Cancelar</button>
              <button type="button" onClick={criar} className="rounded-md bg-[#f47a1f] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#d4640f]">Criar tarefa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ tela */

export default function MockGestao() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(INICIAIS);
  const [colunasExtras, setColunasExtras] = useState<ColunaExtra[]>([]);
  const criarColuna = (titulo: string) =>
    setColunasExtras((cs) => [...cs, { chave: `EXTRA_${cs.length + 1}`, titulo, cor: CORES_EXTRAS[cs.length % CORES_EXTRAS.length] }]);
  const [kanban, setKanban] = useState(true);
  const [busca, setBusca] = useState("");
  const [situacoes, setSituacoes] = useState<string[]>([]);
  const [responsavel, setResponsavel] = useState("");
  const [categoria, setCategoria] = useState("");
  const [vista, setVista] = useState<Vista>("painel");
  const [dica, setDica] = useState(true);
  const [aberta, setAberta] = useState<string | null>(null);
  const [finalizando, setFinalizando] = useState<{ id: string; doDetalhe: boolean } | null>(null);
  const [criando, setCriando] = useState(false);
  const [destaque, setDestaque] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const criar = (d: NovaTarefaDados) => {
    const id = "n" + Date.now();
    const nova: Tarefa = {
      id,
      titulo: d.titulo,
      descricao: d.descricao,
      prazo: d.prazo,
      horario: d.horario,
      status: "PENDENTE",
      categorias: [],
      anexos: [],
      resp: r(...d.resp),
      criador: EU,
      solicitada: `15/10/2026 às ${AGORA}`,
      recorrencia: d.recorrencia,
      // quem cria a tarefa já a "viu": no sistema real ela não conta no contador de quem criou
      naoVista: false,
      comentarios: [],
      duvidas: [],
    };
    setTarefas((ts) => [nova, ...ts]);
    setCriando(false);
    setKanban(true);
    setDestaque(id);
    const nomes = d.resp.map((k) => (k === EU ? "você" : PESSOAS[k].nome.split(" ")[0]));
    setAviso(`Tarefa criada para ${nomes.join(" e ")}${d.prazo ? " · já aparece no Calendário" : ""}.`);
    setTimeout(() => setDestaque((x) => (x === id ? null : x)), 2600);
    setTimeout(() => setAviso(null), 3800);
  };

  const atualizar = (id: string, f: (t: Tarefa) => Tarefa) => setTarefas((ts) => ts.map((t) => (t.id === id ? f(t) : t)));

  const irPara = (v: Vista) => {
    if (v === "minhas") setDica(false);
    setVista(v);
    setBusca("");
    setSituacoes([]);
    setResponsavel("");
    setCategoria("");
  };
  const minhasVista = vista === "minhas";
  const minhasCategorias = [...new Set(tarefas.filter((t) => t.resp.some((x) => x.p === EU)).flatMap((t) => t.categorias))].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const lista = tarefas
    .filter((t) => !minhasVista || t.resp.some((x) => x.p === EU))
    .filter((t) => !categoria || t.categorias.includes(categoria))
    .filter((t) => !busca.trim() || t.titulo.toLowerCase().includes(busca.trim().toLowerCase()))
    .filter((t) => situacoes.length === 0 || situacoes.some((s) => passaSituacao(t, s)))
    .filter((t) => !responsavel || t.resp.some((x) => x.p === responsavel));
  const ordenada = kanban
    ? lista
    : [...lista].sort((a, b) => {
        const ordem: Record<Status, number> = { PENDENTE: 0, EM_ANDAMENTO: 1, FINALIZADO: 2 };
        return ordem[a.status] - ordem[b.status] || (a.prazo ?? 99) - (b.prazo ?? 99);
      });
  const filtrando = !!(busca || situacoes.length || responsavel || categoria);
  const naoVistas = tarefas.filter((t) => t.naoVista && t.resp.some((x) => x.p === EU)).length;

  const abrir = (id: string) => {
    setAberta(id);
    atualizar(id, (t) => (t.naoVista ? { ...t, naoVista: false } : t));
  };

  const soltar = (id: string, c: Coluna) => {
    const t = tarefas.find((x) => x.id === id);
    if (!t || t.status === "FINALIZADO") return;
    if (c === "FEITO") return setFinalizando({ id, doDetalhe: false });
    if (colunasExtras.some((x) => x.chave === c)) return atualizar(id, (x) => ({ ...x, coluna: c }));
    const status: Status = c === "FAZENDO" ? "EM_ANDAMENTO" : "PENDENTE";
    if (t.status === status && !t.coluna) return;
    atualizar(id, (x) => ({ ...x, status, coluna: undefined, emAndamentoEm: status === "EM_ANDAMENTO" ? (x.emAndamentoEm ?? AGORA) : undefined }));
  };

  const confirmarFinalizacao = (min: number | null) => {
    if (!finalizando) return;
    const { id, doDetalhe } = finalizando;
    setFinalizando(null);
    atualizar(id, (t) => {
      // do detalhe, quem é responsável finaliza a própria parte; a tarefa fecha quando todos finalizam
      const resp = doDetalhe ? t.resp.map((x) => (x.p === EU ? { ...x, finalizou: true } : x)) : t.resp.map((x) => ({ ...x, finalizou: true }));
      const todos = resp.every((x) => x.finalizou);
      return {
        ...t,
        resp,
        minutos: min ? (t.minutos ?? 0) + min : t.minutos,
        ...(todos ? { status: "FINALIZADO" as Status, concluida: `15/10/2026 às ${AGORA}` } : {}),
      };
    });
  };

  const tarefaAberta = tarefas.find((t) => t.id === aberta) ?? null;
  const tarefaFinalizando = tarefas.find((t) => t.id === finalizando?.id) ?? null;
  const botaoVista = "px-3 py-2 text-[13px] font-medium ";

  return (
    <div className="relative flex min-h-[520px] overflow-hidden bg-slate-900 text-left font-sans text-slate-100 md:h-[600px]">
      <Lateral naoVistas={naoVistas} vista={vista} irPara={irPara} dica={dica && vista === "painel"} />

      <main className="relative flex min-w-0 flex-1 flex-col bg-slate-900">
        {/* Esmaecido no rodapé: indica que a área rola, em vez de parecer cortada. */}
        {vista !== "painel" && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-20 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent md:block" aria-hidden="true" />}
        <header className="flex shrink-0 items-center gap-1.5 border-b border-slate-700 px-4 py-2 md:px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 lg:hidden" aria-hidden="true">
            <Ico d="M4 6h16M4 12h16M4 18h16" s={18} w={2} />
          </span>
          {/* abaixo de lg a barra lateral some: estes atalhos fazem o papel dela */}
          <nav className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] lg:hidden" aria-label="Navegação">
            {([["painel", "Painel"], ["minhas", "Minhas tarefas"], ["equipe", "Equipe"]] as [Vista, string][]).map(([v, rotulo]) => (
              <button key={v} type="button" onClick={() => irPara(v)} className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${vista === v ? "bg-[#f47a1f] text-white" : "text-slate-300 hover:bg-slate-800"}`}>
                {rotulo}
              </button>
            ))}
          </nav>
          <div className="flex-1" />
          <span className="hidden h-8 w-8 items-center justify-center rounded-full text-slate-300 sm:flex" aria-hidden="true">
            <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" s={17} w={2} />
          </span>
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300" aria-hidden="true">
            <Ico d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" s={17} w={2} />
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f47a1f] px-1 text-[9px] font-bold text-white">3</span>
          </span>
          <span className="ml-1 hidden items-center -space-x-2 sm:flex" aria-hidden="true">
            {["LC", "RM", "PA"].map((i) => (
              <span key={i} className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 text-[10px] font-bold text-white" style={{ backgroundColor: PESSOAS[i].cor }}>
                {i}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
              </span>
            ))}
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700 text-[10px] font-semibold text-slate-200">+4</span>
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-16 [scrollbar-width:thin] md:px-6">
          {vista === "painel" ? (
            <Painel tarefas={tarefas} irPara={irPara} abrir={abrir} />
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                <div className="min-w-0">
                  <h1 className="text-[22px] font-semibold text-slate-100">{minhasVista ? "Minhas tarefas" : "Tarefas da equipe"}</h1>
                  <p className="mt-1 text-[13px] text-slate-400">{minhasVista ? "As tarefas sob a sua responsabilidade." : "Tudo o que a equipe precisa entregar."}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex overflow-hidden rounded-md border border-slate-600">
                    <button type="button" onClick={() => setKanban(false)} className={botaoVista + (!kanban ? "bg-slate-600 text-white" : "text-slate-400 hover:bg-slate-700")}>Lista</button>
                    <button type="button" onClick={() => setKanban(true)} className={botaoVista + (kanban ? "bg-slate-600 text-white" : "text-slate-400 hover:bg-slate-700")}>Colunas</button>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-600 px-3 py-2 text-[13px] font-medium text-slate-400">
                    <Ico d="M3 3h18v5H3zM4 8v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8M10 12h4" s={15} w={2} />
                    Arquivadas
                  </span>
                  <span className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] font-medium text-slate-300">Nova categoria</span>
                  <button type="button" onClick={() => setCriando(true)} className="rounded-md bg-[#f47a1f] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#d4640f]">Nova tarefa</button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2.5">
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome..." aria-label="Buscar por nome" className={campo + " w-full sm:w-52"} />
                <FiltroSituacao sel={situacoes} setSel={setSituacoes} />
                {minhasVista ? (
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoria" className={campo + " min-w-0 max-w-full"}>
                    <option value="">Todas as categorias</option>
                    {minhasCategorias.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <select value={responsavel} onChange={(e) => setResponsavel(e.target.value)} aria-label="Responsável" className={campo + " min-w-0 max-w-full"}>
                    <option value="">Todos os responsáveis</option>
                    {Object.entries(PESSOAS)
                      .sort((a, b) => a[1].nome.localeCompare(b[1].nome, "pt-BR"))
                      .map(([k, p]) => (
                        <option key={k} value={k}>{p.nome}</option>
                      ))}
                  </select>
                )}
                <span className={campo + " inline-flex items-center gap-2 text-slate-500"} title="Filtrar por dia de prazo">
                  dd/mm/aaaa
                  <Ico d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" s={15} />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-600 px-4 py-2 text-[13px] font-medium text-white shadow-sm">
                  <Ico d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" s={15} w={2} />
                  Filtrar
                </span>
                {filtrando && (
                  <button type="button" onClick={() => { setBusca(""); setSituacoes([]); setResponsavel(""); setCategoria(""); }} className="inline-flex items-center px-2 py-2 text-[13px] font-medium text-slate-400 hover:text-slate-200">
                    Limpar
                  </button>
                )}
              </div>

              {kanban ? (
                <Kanban lista={ordenada} abrir={abrir} soltar={soltar} destaque={destaque} mostrarResponsavel={!minhasVista} extras={colunasExtras} criarColuna={criarColuna} />
              ) : (
                <Lista lista={ordenada} abrir={abrir} mostrarResponsavel={!minhasVista} />
              )}
            </>
          )}
        </div>
      </main>

      {tarefaAberta && (
        <Detalhe
          key={tarefaAberta.id}
          t={tarefaAberta}
          aoFechar={() => setAberta(null)}
          atualizar={(f) => atualizar(tarefaAberta.id, f)}
          pedirFinalizar={() => setFinalizando({ id: tarefaAberta.id, doDetalhe: true })}
          voltar={vista === "painel" ? "Painel" : minhasVista ? "Minhas tarefas" : "Tarefas da equipe"}
        />
      )}
      {criando && <NovaTarefa iniciais={minhasVista ? ["LC", EU] : ["LC"]} aoCriar={criar} aoCancelar={() => setCriando(false)} />}
      {aviso && (
        <div role="status" className="pointer-events-none absolute bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-[13px] font-medium text-white shadow-lg">
          {aviso}
        </div>
      )}
      {tarefaFinalizando && finalizando && (
        <ModalFinalizar
          key={tarefaFinalizando.id + String(finalizando.doDetalhe)}
          t={tarefaFinalizando}
          sugerir
          aoConfirmar={confirmarFinalizacao}
          aoCancelar={() => setFinalizando(null)}
        />
      )}
    </div>
  );
}
