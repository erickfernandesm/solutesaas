"use client";

import { useState, type ReactNode } from "react";

/*
 * Réplica da tela de resultados do SoluteForms dentro do Sistema de Gestão
 * (tema escuro, slate + laranja #f47a1f), com as abas reais Resumo / Respostas /
 * Caixa de entrada / Kanban / Configurações. Em "Compartilhar", o link fica
 * oculto e "Testar" desativado nesta demonstração.
 */

const MARCA = "#f47a1f";

/* ------------------------------------------------------------------ dados */

type Tipo = "declaracao" | "suspenso" | "multipla" | "avaliacao" | "escala" | "simnao" | "longo" | "curto" | "email";

const TIPOS: Record<Tipo, { rotulo: string; cor: string; d: string }> = {
  declaracao: { rotulo: "Tela de abertura", cor: "#ec4899", d: "M4 5h16v11H9l-5 4z" },
  suspenso: { rotulo: "Menu suspenso", cor: "#0ea5e9", d: "M4 7h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM15 10l2 2 2-2" },
  multipla: { rotulo: "Múltipla escolha", cor: "#2563eb", d: "M9 11l3 3 7-7M21 12v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h9" },
  avaliacao: { rotulo: "Avaliação", cor: "#8b5cf6", d: "M12 3.5l2.6 5.5 6 .8-4.4 4.1 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8z" },
  escala: { rotulo: "Escala de opinião", cor: "#d946ef", d: "M4 16h3v5H4zM10.5 10h3v11h-3zM17 4h3v17h-3z" },
  simnao: { rotulo: "Sim/Não", cor: "#0891b2", d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 12l2.5 2.5 4.5-5" },
  longo: { rotulo: "Texto longo", cor: "#f97316", d: "M4 6h16M4 11h16M4 16h10" },
  curto: { rotulo: "Texto curto", cor: "#f59e0b", d: "M4 9h16M4 15h9" },
  email: { rotulo: "E-mail", cor: "#16a34a", d: "M3 6h18v12H3zM3 7l9 6 9-6" },
};

type Pergunta = {
  id: string;
  tipo: Tipo;
  titulo: string;
  curto: string;
  obrigatoria?: boolean;
  opcoes?: string[];
  descricao?: string;
};

const PERGUNTAS: Pergunta[] = [
  { id: "area", tipo: "suspenso", titulo: "Em qual área você trabalha?", curto: "Área", obrigatoria: true, opcoes: ["Administrativo", "Comercial", "Operações", "Tecnologia", "Recursos Humanos"] },
  { id: "tempo", tipo: "multipla", titulo: "Há quanto tempo você está na empresa?", curto: "Tempo de casa", obrigatoria: true, opcoes: ["Menos de 1 ano", "De 1 a 3 anos", "De 3 a 5 anos", "Mais de 5 anos"] },
  { id: "lider", tipo: "avaliacao", titulo: "Como você avalia a comunicação com a sua liderança?", curto: "Comunicação com a liderança", obrigatoria: true },
  { id: "enps", tipo: "escala", titulo: "De 0 a 10, quanto você recomendaria a empresa como um bom lugar para trabalhar?", curto: "Recomendaria a empresa", obrigatoria: true },
  { id: "reconhecido", tipo: "simnao", titulo: "Você se sente reconhecido(a) pelo seu trabalho?", curto: "Se sente reconhecido(a)", obrigatoria: true },
  { id: "motiva", tipo: "longo", titulo: "O que mais te motiva no dia a dia?", curto: "O que mais te motiva", descricao: "Fique à vontade: as respostas são lidas só pelo RH." },
  { id: "mudaria", tipo: "longo", titulo: "Se pudesse mudar uma coisa na empresa, o que seria?", curto: "O que mudaria" },
  { id: "nome", tipo: "curto", titulo: "Seu nome (opcional)", curto: "Nome" },
  { id: "email", tipo: "email", titulo: "Seu e-mail (opcional)", curto: "E-mail" },
];

const DISPOSITIVOS = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "desktop", rotulo: "Desktop" },
  { valor: "mobile", rotulo: "Mobile" },
  { valor: "tablet", rotulo: "Tablet" },
  { valor: "outro", rotulo: "Outro" },
];

// funil por dispositivo: quem abriu, quem começou e quantos saíram em cada pergunta
const FUNIL: Record<string, { abriram: number; comecaram: number; sairam: number[]; tempo: string }> = {
  desktop: { abriram: 236, comecaram: 190, sairam: [2, 1, 3, 3, 1, 8, 5, 1, 1], tempo: "00:02:58" },
  mobile: { abriram: 158, comecaram: 112, sairam: [2, 2, 2, 3, 1, 8, 3, 2, 0], tempo: "00:03:41" },
  tablet: { abriram: 14, comecaram: 12, sairam: [0, 0, 0, 0, 0, 1, 1, 0, 0], tempo: "00:03:05" },
  outro: { abriram: 4, comecaram: 4, sairam: [0, 0, 0, 0, 0, 0, 0, 0, 0], tempo: "00:02:20" },
};

function funilDe(disp: string) {
  if (disp !== "todos") return FUNIL[disp];
  const v = Object.values(FUNIL);
  return {
    abriram: v.reduce((a, f) => a + f.abriram, 0),
    comecaram: v.reduce((a, f) => a + f.comecaram, 0),
    sairam: PERGUNTAS.map((_, i) => v.reduce((a, f) => a + f.sairam[i], 0)),
    tempo: "00:03:12",
  };
}

const porcentagem = (parte: number, todo: number) => (todo > 0 ? Math.round((parte / todo) * 1000) / 10 : 0);
const numeroPt = (n: number) => String(n).replace(".", ",");

type Sessao = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  dispositivo: string;
  comecou: string;
  enviado: string | null;
  quando: string;
  r: Record<string, string>;
};

const SESSOES: Sessao[] = [
  { id: "cm9x2k7q4ta81mzp", nome: "Mariana Couto", email: "mariana.couto@empresa.com.br", telefone: "(11) 98412-3307", dispositivo: "desktop", comecou: "15/10/2026 08:41", enviado: "15/10/2026 08:44", quando: "há 12 minutos", r: { area: "Comercial", tempo: "De 1 a 3 anos", lider: "4", enps: "9", reconhecido: "Sim", motiva: "A equipe e a autonomia para propor melhorias.", mudaria: "Mais clareza nas metas do trimestre.", nome: "Mariana Couto", email: "mariana.couto@empresa.com.br" } },
  { id: "cm9x2h1v8pd3qkrw", nome: "Rafael Lima", email: "rafael.lima@empresa.com.br", dispositivo: "mobile", comecou: "15/10/2026 08:17", enviado: "15/10/2026 08:21", quando: "há 36 minutos", r: { area: "Operações", tempo: "Mais de 5 anos", lider: "3", enps: "7", reconhecido: "Não", motiva: "Os desafios novos de cada semana.", mudaria: "Reuniões mais curtas e com pauta definida.", nome: "Rafael Lima", email: "rafael.lima@empresa.com.br" } },
  { id: "cm9x1z5c2nb7yhte", nome: "Beatriz Nogueira", email: "bia.nogueira@empresa.com.br", telefone: "(31) 99107-5521", dispositivo: "desktop", comecou: "15/10/2026 07:52", enviado: "15/10/2026 07:55", quando: "há 1 hora", r: { area: "Tecnologia", tempo: "Menos de 1 ano", lider: "5", enps: "10", reconhecido: "Sim", motiva: "Aprender todo dia com gente muito boa.", mudaria: "Um programa de mentoria para quem está chegando.", nome: "Beatriz Nogueira", email: "bia.nogueira@empresa.com.br" } },
  { id: "cm9x1t0a6wq2ljud", nome: "", email: "", dispositivo: "mobile", comecou: "15/10/2026 07:30", enviado: null, quando: "há 1 hora", r: { area: "Administrativo", tempo: "De 3 a 5 anos", lider: "2", enps: "5", reconhecido: "Não" } },
  { id: "cm9x0m8e3hs6vgcb", nome: "Thiago Prado", email: "thiago.prado@empresa.com.br", dispositivo: "tablet", comecou: "14/10/2026 18:06", enviado: "14/10/2026 18:10", quando: "há 15 horas", r: { area: "Comercial", tempo: "De 3 a 5 anos", lider: "4", enps: "8", reconhecido: "Sim", motiva: "Bater a meta junto com o time.", mudaria: "Revisar a política de comissões.", nome: "Thiago Prado", email: "thiago.prado@empresa.com.br" } },
  { id: "cm9wz4r1kfa9xnoe", nome: "Camila Rocha", email: "camila.rocha@empresa.com.br", telefone: "(21) 97733-0164", dispositivo: "desktop", comecou: "14/10/2026 16:42", enviado: "14/10/2026 16:45", quando: "há 16 horas", r: { area: "Recursos Humanos", tempo: "De 1 a 3 anos", lider: "5", enps: "9", reconhecido: "Sim", motiva: "Ver as pessoas crescendo aqui dentro.", mudaria: "Mais treinamentos para as lideranças.", nome: "Camila Rocha", email: "camila.rocha@empresa.com.br" } },
  { id: "cm9wy7d9uje4bspa", nome: "", email: "", dispositivo: "mobile", comecou: "14/10/2026 13:15", enviado: null, quando: "há 20 horas", r: { area: "Operações", tempo: "Menos de 1 ano", lider: "3", enps: "6", reconhecido: "Sim" } },
  { id: "cm9wx2f6oli1czrm", nome: "Juliana Martins", email: "ju.martins@empresa.com.br", dispositivo: "desktop", comecou: "14/10/2026 10:03", enviado: "14/10/2026 10:07", quando: "há 1 dia", r: { area: "Tecnologia", tempo: "De 1 a 3 anos", lider: "4", enps: "9", reconhecido: "Sim", motiva: "Os projetos e a flexibilidade do home office.", mudaria: "Comunicar antes as mudanças de prioridade.", nome: "Juliana Martins", email: "ju.martins@empresa.com.br" } },
];

/* ------------------------------------------------------------- utilitários */

function Ico({ d, s = 16, w = 1.8, className = "", fill = "none" }: { d: string; s?: number; w?: number; className?: string; fill?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" className={"shrink-0 " + className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const CHEVRON = "m6 9 6 6 6-6";
const card = "rounded-xl border border-slate-700 bg-slate-800";
const rotuloSecao = "text-[11px] font-semibold uppercase tracking-wide text-slate-400";

function Selo({ completa, pequeno = false }: { completa: boolean; pequeno?: boolean }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 ${pequeno ? "text-[10px]" : "text-[11px]"} font-semibold uppercase ${completa ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
      {completa ? "Completa" : "Parcial"}
    </span>
  );
}

function Avatar({ nome, grande = false }: { nome: string; grande?: boolean }) {
  const cores = ["#2563eb", "#059669", "#d946ef", "#f59e0b", "#0891b2", "#7c3aed", "#e11d48"];
  const soma = [...nome].reduce((a, c) => a + c.charCodeAt(0), 0);
  const letra = (nome.replace(/^#/, "")[0] ?? "?").toUpperCase();
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${grande ? "h-10 w-10 text-base" : "h-9 w-9 text-sm"}`} style={{ backgroundColor: cores[soma % cores.length] }} aria-hidden="true">
      {letra}
    </span>
  );
}

const nomeDe = (s: Sessao) => s.nome || `#${s.id.slice(-10)}`;

function Chave({ ligado, aoMudar, rotulo }: { ligado: boolean; aoMudar: () => void; rotulo: string }) {
  return (
    <button type="button" role="switch" aria-checked={ligado} aria-label={rotulo} onClick={aoMudar} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${ligado ? "bg-[#f47a1f]" : "bg-slate-600"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${ligado ? "left-[1.375rem]" : "left-0.5"}`} />
    </button>
  );
}

/* --------------------------------------------------------- barra lateral */

function Lateral() {
  const grupo = (rotulo: string) => (
    <li key={rotulo} className="flex items-center justify-between gap-2 rounded-md px-3 py-[7px] text-[13px] font-medium text-slate-300">
      {rotulo}
      <Ico d={CHEVRON} s={15} w={2} className="text-slate-400" />
    </li>
  );
  const link = (rotulo: string) => (
    <li key={rotulo} className="rounded-md px-3 py-[7px] text-[13px] font-medium text-slate-300">{rotulo}</li>
  );
  return (
    <aside className="hidden w-[212px] shrink-0 flex-col border-r border-slate-800 bg-slate-900 px-3.5 py-5 lg:flex">
      <div className="px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/solute-horizontal-branca.png" alt="Solute RH" className="h-10 w-auto" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-800/40 px-2 py-2">
        <span className="text-xs font-medium text-slate-300">Disponível</span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-400 ring-offset-1 ring-offset-slate-900" />
          <span className="h-3.5 w-3.5 rounded-full bg-red-500 opacity-30" />
          <span className="h-3.5 w-3.5 rounded-full bg-amber-400 opacity-30" />
        </span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-0.5">
        {link("Painel")}
        {grupo("Agenda")}
        {grupo("Solicitações")}
        {grupo("Acompanhamento")}
        {link("Rotina")}
        <li>
          <span className="flex items-center justify-between gap-2 rounded-md px-3 py-[7px] text-[13px] font-medium text-white">
            Forms
            <Ico d={CHEVRON} s={15} w={2} className="rotate-180 text-slate-300" />
          </span>
          <ul className="mt-0.5 flex flex-col gap-0.5 border-l-2 border-[#f47a1f] pl-2">
            <li className="rounded-md px-3 py-[7px] text-[13px] font-medium text-slate-300">Forms Interno</li>
            <li className="rounded-md bg-[#f47a1f] px-3 py-[7px] text-[13px] font-medium text-white">SoluteForms</li>
          </ul>
        </li>
        {link("Equipe")}
        {grupo("Outros Sistemas")}
      </ul>

      <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f47a1f] text-sm font-bold text-white">ES</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-slate-100">Emíllia Santos</span>
          <span className="block truncate text-[11.5px] text-slate-400">Analista de RH</span>
        </span>
      </div>
      <span className="mt-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-300">
        <Ico d="M12 4V2M12 22v-2M4.9 4.9 3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1l-1.4 1.4M20.5 3.5l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" s={15} w={2} />
        Modo claro
      </span>
    </aside>
  );
}

/* --------------------------------------------------------------- Resumo */

const AMOSTRAS: Record<string, string[]> = {
  area: ["Comercial", "Operações", "Tecnologia", "Administrativo"],
  tempo: ["De 1 a 3 anos", "Mais de 5 anos", "Menos de 1 ano", "De 3 a 5 anos"],
  lider: ["4", "3", "5", "2"],
  enps: ["9", "7", "10", "5"],
  reconhecido: ["Sim", "Não", "Sim", "Não"],
  motiva: ["A equipe e a autonomia para propor melhorias.", "Os desafios novos de cada semana.", "Aprender todo dia com gente muito boa.", "Bater a meta junto com o time."],
  mudaria: ["Mais clareza nas metas do trimestre.", "Reuniões mais curtas e com pauta definida.", "Um programa de mentoria para quem está chegando.", "Revisar a política de comissões."],
  nome: ["Mariana Couto", "Rafael Lima", "Beatriz Nogueira", "Thiago Prado"],
  email: ["mariana.couto@empresa.com.br", "rafael.lima@empresa.com.br", "bia.nogueira@empresa.com.br", "thiago.prado@empresa.com.br"],
};
const QUANDO = ["há 12 minutos", "há 36 minutos", "há 1 hora", "há 15 horas"];

function Numero({ cor, d, titulo, valor, abaixo, barra }: { cor: string; d: string; titulo: string; valor: string; abaixo?: string; barra?: number }) {
  return (
    <div className={card + " min-w-0 p-3.5"}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: cor + "22", color: cor }}>
          <Ico d={d} s={15} />
        </span>
        <p className="min-w-0 truncate text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{titulo}</p>
      </div>
      <p className="mt-2 text-[26px] font-bold leading-tight tabular-nums text-slate-100">{valor}</p>
      {barra !== undefined ? (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, barra)}%`, backgroundColor: cor }} />
        </div>
      ) : (
        <p className="mt-0.5 truncate text-xs text-slate-400">{abaixo}</p>
      )}
    </div>
  );
}

function Medida({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-slate-400">
      <span className="hidden sm:inline">{rotulo}</span>
      <strong className="font-semibold tabular-nums text-slate-200">{valor}</strong>
    </span>
  );
}

function Resumo() {
  const [disp, setDisp] = useState("todos");
  const [detalhes, setDetalhes] = useState(false);
  const [abertas, setAbertas] = useState<string[]>([]);
  const f = funilDe(disp);
  const respostas = f.comecaram - f.sairam.reduce((a, b) => a + b, 0);
  const conclusao = porcentagem(respostas, f.comecaram);

  const linhas = PERGUNTAS.map((p, i) => {
    const vis = f.comecaram - f.sairam.slice(0, i).reduce((a, b) => a + b, 0);
    const passou = vis - f.sairam[i];
    const resp = p.id === "nome" ? Math.round(passou * 0.62) : p.id === "email" ? Math.round(passou * 0.55) : passou;
    return { p, vis, resp, sair: f.sairam[i] };
  });

  const alternar = (id: string) => setAbertas((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const linha = (o: { id: string; tipo: Tipo; titulo: string; indice?: number; vis: number; resp: number | null; sair: number; detalhe: ReactNode }) => {
    const t = TIPOS[o.tipo];
    const aberta = abertas.includes(o.id);
    return (
      <div key={o.id}>
        {o.indice !== undefined && (
          <div className="flex justify-center py-1 text-slate-600"><Ico d="M12 5v14M6 13l6 6 6-6" s={16} /></div>
        )}
        <div className={card + " overflow-hidden"}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: t.cor + "22", color: t.cor }} title={t.rotulo}>
              <Ico d={t.d} s={17} w={1.7} />
            </span>
            <span className="flex min-w-0 flex-1 basis-40 items-baseline gap-2">
              {o.indice !== undefined && <span className="shrink-0 text-xs font-semibold text-slate-400">{o.indice + 1}</span>}
              <span className="min-w-0 truncate text-[13.5px] font-medium text-slate-100">{o.titulo}</span>
            </span>
            <Medida rotulo="Visualizações" valor={String(o.vis)} />
            <Medida rotulo="Respostas" valor={o.resp === null ? "—" : String(o.resp)} />
            <span className="flex items-center gap-1.5 text-[13px] text-slate-400">
              <span className="hidden sm:inline">Desistência</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${o.sair > 0 ? "bg-rose-500 text-white" : "bg-slate-700 text-slate-300"}`}>
                {o.sair > 0 ? "−" : ""}
                {o.sair} ({numeroPt(porcentagem(o.sair, o.vis))}%)
              </span>
            </span>
            {detalhes && (
              <button type="button" onClick={() => alternar(o.id)} aria-label={aberta ? "Esconder detalhes" : "Ver detalhes"} className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-600 text-slate-400 transition-colors hover:border-[#f47a1f] hover:text-[#f47a1f]">
                <Ico d={CHEVRON} s={15} w={2} className={"transition-transform " + (aberta ? "rotate-180" : "")} />
              </button>
            )}
          </div>
          {detalhes && aberta && <div className="border-t border-slate-700">{o.detalhe}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className={rotuloSecao}>Visão geral</p>
        <div className="flex max-w-full overflow-x-auto rounded-full border border-slate-600 text-[13px] sm:ml-auto">
          {DISPOSITIVOS.map((d) => (
            <button key={d.valor} type="button" onClick={() => setDisp(d.valor)} className={`shrink-0 px-3 py-1.5 font-medium transition-colors ${disp === d.valor ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-700/60"}`}>
              {d.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
        <Numero cor="#0ea5e9" d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" titulo="Visualizações" valor={String(f.abriram)} abaixo="abriram o link" />
        <Numero cor="#6366f1" d="M8 5v14l11-7z" titulo="Inícios" valor={String(f.comecaram)} abaixo="clicaram para começar" />
        <Numero cor="#16a34a" d="M9 12.5l2.5 2.5 5-5M21 12a9 9 0 1 1-9-9" titulo="Respostas" valor={String(respostas)} abaixo="chegaram ao fim" />
        <Numero cor={MARCA} d="M3 17l5-5 4 3 8-8M21 7h-5M21 7v5" titulo="Taxa de conclusão" valor={`${numeroPt(conclusao)}%`} barra={conclusao} />
        <Numero cor="#8b5cf6" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5V12l3 2" titulo="Tempo médio" valor={f.tempo} abaixo="do início ao envio" />
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-3">
        <p className={rotuloSecao}>Resumo das respostas</p>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-[13px] text-slate-300">
          Mostrar detalhes
          <Chave
            ligado={detalhes}
            rotulo="Mostrar detalhes"
            aoMudar={() => {
              setDetalhes((v) => !v);
              setAbertas(detalhes ? [] : ["motiva"]);
            }}
          />
        </label>
      </div>

      <div className="flex flex-col">
        {linha({
          id: "abertura",
          tipo: "declaracao",
          titulo: "Tela de abertura",
          vis: f.abriram,
          resp: null,
          sair: f.abriram - f.comecaram,
          detalhe: (
            <div>
              {["Abriu, respondeu e enviou", "Abriu e começou a responder", "Abriu e saiu sem começar"].map((t, i) => (
                <div key={t} className="flex flex-wrap items-center gap-x-3 border-b border-slate-700/60 px-4 py-2.5 last:border-b-0">
                  <span className="min-w-0 flex-1 truncate text-[13px] text-slate-200">{t}</span>
                  <span className="shrink-0 text-xs capitalize text-slate-400">{["desktop", "mobile", "mobile"][i]}</span>
                  <span className="shrink-0 text-xs text-slate-400">{QUANDO[i]}</span>
                </div>
              ))}
            </div>
          ),
        })}
        {linhas.map((l, i) =>
          linha({
            id: l.p.id,
            tipo: l.p.tipo,
            titulo: l.p.titulo,
            indice: i,
            vis: l.vis,
            resp: l.resp,
            sair: l.sair,
            detalhe: (
              <div>
                {AMOSTRAS[l.p.id].map((t, k) => (
                  <div key={k} className="flex flex-wrap items-baseline gap-x-3 border-b border-slate-700/60 px-4 py-2.5 last:border-b-0">
                    <p className="min-w-0 flex-1 break-words text-[13px] text-slate-200">{l.p.tipo === "avaliacao" ? `${t} de 5` : t}</p>
                    <p className="shrink-0 text-xs text-slate-400">{QUANDO[k]}</p>
                  </div>
                ))}
              </div>
            ),
          }),
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Respostas */

const COLUNAS_TABELA = ["area", "tempo", "lider", "enps", "reconhecido", "motiva", "mudaria"];

function Respostas() {
  const [ordem, setOrdem] = useState<{ chave: string; desc: boolean } | null>(null);
  const valorDe = (s: Sessao, chave: string) => {
    if (chave === "comecou") return s.comecou.split(" ")[0].split("/").reverse().join("") + s.comecou.split(" ")[1];
    if (chave === "enviado") return s.enviado ?? "";
    if (chave === "id") return s.id;
    if (chave === "status") return s.enviado ? "Completa" : "Parcial";
    return s.r[chave] ?? "";
  };
  const linhas = ordem
    ? [...SESSOES].sort((a, b) => {
        const x = valorDe(a, ordem.chave);
        const y = valorDe(b, ordem.chave);
        if (!x && y) return 1;
        if (x && !y) return -1;
        const r = x.localeCompare(y, "pt-BR", { numeric: true, sensitivity: "base" });
        return ordem.desc ? -r : r;
      })
    : SESSOES;
  const ordenar = (chave: string) =>
    setOrdem((o) => (!o || o.chave !== chave ? { chave, desc: false } : !o.desc ? { chave, desc: true } : null));

  const cabeca = (chave: string, rotulo: string, largura: string) => {
    const ativa = ordem?.chave === chave;
    return (
      <th key={chave} className={largura + " bg-slate-700/40 px-3 py-2 text-left"}>
        <button type="button" onClick={() => ordenar(chave)} title={ativa ? "Clique para inverter, e de novo para soltar a ordem" : `Ordenar por ${rotulo}`} className={`flex w-full items-center gap-1 text-left text-[11px] font-semibold uppercase tracking-wide ${ativa ? "text-[#f47a1f]" : "text-slate-300 hover:text-[#f47a1f]"}`}>
          <span className="min-w-0 truncate">{rotulo}</span>
          <Ico d="M12 5v14M6 13l6 6 6-6" s={12} w={3} className={(ativa ? "opacity-100" : "opacity-30") + (ativa && ordem?.desc ? " rotate-180" : "")} />
        </button>
      </th>
    );
  };
  const vazio = <span className="text-slate-600">—</span>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-slate-400">
        {SESSOES.length} pessoas começaram · {SESSOES.filter((s) => s.enviado).length} concluíram · role de lado para ver todas as perguntas
      </p>
      <div className={card + " overflow-x-auto"}>
        <table className="w-full min-w-[66rem] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-slate-700">
              {cabeca("comecou", "Começou em", "w-36")}
              {cabeca("enviado", "Enviado às", "w-36")}
              {cabeca("id", "ID", "w-32")}
              {cabeca("status", "Status", "w-24")}
              {COLUNAS_TABELA.map((c) => cabeca(c, PERGUNTAS.find((p) => p.id === c)!.titulo, "w-52"))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((s) => (
              <tr key={s.id} className="border-b border-slate-700/60 last:border-b-0 hover:bg-slate-700/30">
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-300">{s.comecou}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-300">{s.enviado ?? vazio}</td>
                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-slate-400">#{s.id.slice(-10)}</td>
                <td className="px-3 py-2.5"><Selo completa={!!s.enviado} /></td>
                {COLUNAS_TABELA.map((c) => (
                  <td key={c} className="px-3 py-2.5 align-top text-slate-200">
                    {s.r[c] ? <span className="line-clamp-2 break-words">{s.r[c]}</span> : vazio}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------------------------------- Caixa de entrada */

function Entrada() {
  const [filtro, setFiltro] = useState("todas");
  const [aberta, setAberta] = useState<string | null>(null);
  const colunas = PERGUNTAS;
  const lista = filtro === "todas" ? SESSOES : SESSOES.filter((s) => s.r[filtro]);
  const escolhida = lista.find((s) => s.id === aberta) ?? lista[0] ?? null;
  const chip = "inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-slate-700 px-2.5 py-1 text-xs text-slate-300";

  return (
    <div className="flex flex-col gap-3">
      <div className={card + " flex flex-wrap items-center gap-3 px-4 py-3"}>
        <span className="text-[13px] font-medium text-slate-300">Filtrar por pergunta</span>
        <select
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setAberta(null);
          }}
          className="min-w-0 max-w-full flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-[13px] text-slate-100 outline-none focus:border-[#f47a1f] sm:max-w-xs"
        >
          <option value="todas">Todas as perguntas</option>
          {colunas.map((p) => (
            <option key={p.id} value={p.id}>{p.titulo}</option>
          ))}
        </select>
        <span className="ml-auto rounded-full bg-slate-700 px-3 py-1 text-[13px] font-medium text-slate-300">
          {lista.length} {lista.length === 1 ? "resposta" : "respostas"}
        </span>
      </div>

      <div className="grid items-start gap-3 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div className={card + " max-h-[22rem] overflow-y-auto"}>
          {lista.map((s) => {
            const ativa = escolhida?.id === s.id;
            const previa = filtro === "todas" ? s.email || s.telefone : s.r[filtro];
            return (
              <button key={s.id} type="button" onClick={() => setAberta(s.id)} className={`flex w-full items-start gap-3 border-b border-l-[3px] border-b-slate-700/60 px-3 py-2.5 text-left transition-colors last:border-b-0 ${ativa ? "border-l-[#f47a1f] bg-[#f47a1f]/10" : "border-l-transparent hover:bg-slate-700/40"}`}>
                <Avatar nome={nomeDe(s)} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-100">{nomeDe(s)}</span>
                    <Selo completa={!!s.enviado} pequeno />
                  </span>
                  {previa && <span className="mt-0.5 block truncate text-xs text-slate-400">{previa}</span>}
                  <span className="mt-0.5 block text-xs text-slate-500">{s.quando}</span>
                </span>
              </button>
            );
          })}
        </div>

        {escolhida && (
          <div className={card + " min-w-0 overflow-hidden"}>
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-700 bg-slate-700/30 px-4 py-3">
              <Avatar nome={nomeDe(escolhida)} grande />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-slate-100">
                  <span className="min-w-0 truncate">{nomeDe(escolhida)}</span>
                  <Selo completa={!!escolhida.enviado} pequeno />
                </p>
                <p className="text-xs text-slate-400">
                  Começou em {escolhida.comecou}
                  {escolhida.enviado ? ` · enviou em ${escolhida.enviado}` : " · ainda não enviou"} · <span className="capitalize">{escolhida.dispositivo}</span>
                </p>
              </div>
              <div className="flex min-w-0 flex-wrap gap-2">
                {escolhida.email && (
                  <span className={chip}><Ico d={TIPOS.email.d} s={13} w={1.7} /><span className="truncate">{escolhida.email}</span></span>
                )}
                {escolhida.telefone && (
                  <span className={chip}><Ico d="M15.5 21A12.5 12.5 0 0 1 3 8.5V5a2 2 0 0 1 2-2h2.2l1.6 4.4-2 1.6a12 12 0 0 0 6.2 6.2l1.6-2L19 14.8V17a2 2 0 0 1-2 2z" s={13} w={1.7} />{escolhida.telefone}</span>
                )}
              </div>
            </div>
            <div className="grid gap-2.5 p-3.5 sm:grid-cols-2">
              {colunas.map((p) => {
                const texto = escolhida.r[p.id];
                return (
                  <div key={p.id} className="min-w-0 rounded-lg border border-slate-700 p-3">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      <Ico d={TIPOS[p.tipo].d} s={13} w={1.7} />
                      <span className="min-w-0 truncate">{p.titulo}</span>
                    </p>
                    {texto ? (
                      <p className="mt-1 break-words text-[13px] text-slate-200">{p.tipo === "avaliacao" ? `${texto} de 5` : texto}</p>
                    ) : (
                      <p className="mt-1 text-[13px] text-slate-600">não respondeu</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Kanban */

const COLUNAS_KANBAN = [
  { id: "novas", nome: "Novas" },
  { id: "analise", nome: "Em análise" },
  { id: "plano", nome: "Plano de ação" },
];

function Kanban() {
  const [onde, setOnde] = useState<Record<string, string>>(() =>
    Object.fromEntries(SESSOES.map((s, i) => [s.id, i < 4 ? "novas" : i < 6 ? "analise" : "plano"])),
  );
  const [alvo, setAlvo] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const mover = (id: string, col: string) => {
    setOnde((o) => ({ ...o, [id]: col }));
    setMenu(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {COLUNAS_KANBAN.map((c) => {
        const meus = SESSOES.filter((s) => onde[s.id] === c.id);
        return (
          <div
            key={c.id}
            onDragOver={(e) => {
              e.preventDefault();
              setAlvo(c.id);
            }}
            onDragLeave={() => setAlvo((a) => (a === c.id ? null : a))}
            onDrop={(e) => {
              e.preventDefault();
              setAlvo(null);
              const id = e.dataTransfer.getData("text/plain");
              if (id) mover(id, c.id);
            }}
            className={`flex w-60 shrink-0 flex-col gap-2 rounded-xl border p-2 transition-colors ${alvo === c.id ? "border-[#f47a1f] bg-[#f47a1f]/10" : "border-slate-700 bg-slate-800/60"}`}
          >
            <div className="flex items-center gap-2 px-1 py-1">
              <span className="min-w-0 flex-1 truncate text-[13px] font-bold uppercase tracking-wide text-slate-300">{c.nome}</span>
              <span className="rounded-md bg-slate-700 px-2 py-0.5 text-xs font-semibold tabular-nums text-white">{meus.length}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded text-slate-400">
                <Ico d="M5 12h.01M12 12h.01M19 12h.01" s={16} w={3} />
              </span>
            </div>
            {meus.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-slate-400">Arraste cartões para cá.</p>
            ) : (
              meus.map((s) => (
                <div key={s.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", s.id)} className="relative cursor-grab rounded-lg border border-slate-700 bg-slate-800 p-3 active:cursor-grabbing">
                  <div className="flex items-start gap-2">
                    <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-400">#{s.id.slice(-10)}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">{s.comecou.slice(0, 5)}</span>
                  </div>
                  <p className="mt-1 truncate text-[13px] font-semibold text-slate-100">{s.nome || "Sem nome"}</p>
                  {s.email && <p className="truncate text-xs text-slate-400">{s.email}</p>}
                  {s.telefone && <p className="truncate text-xs text-slate-400">{s.telefone}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${s.enviado ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>{s.enviado ? "Completa" : "Parcial"}</span>
                    <span className="min-w-0 flex-1 truncate text-[11px] text-slate-400">Iniciado {s.quando}</span>
                    <button type="button" onClick={() => setMenu((m) => (m === s.id ? null : s.id))} aria-label="Mover cartão" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-slate-600 text-slate-400 hover:border-[#f47a1f] hover:text-[#f47a1f]">
                      <Ico d="M12 5v14M5 12h14" s={13} w={2} />
                    </button>
                  </div>
                  {menu === s.id && (
                    <div className="absolute bottom-10 right-2 z-30 w-44 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-lg">
                      <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mover para</p>
                      {COLUNAS_KANBAN.map((d) => (
                        <button key={d.id} type="button" disabled={d.id === c.id} onClick={() => mover(s.id, d.id)} className="w-full truncate px-3 py-1.5 text-left text-[13px] text-slate-200 hover:bg-slate-700/60 disabled:opacity-40">
                          {d.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );
      })}
      <div className="w-48 shrink-0">
        <span className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-600 px-3 py-3 text-[13px] font-medium text-slate-400">
          <Ico d="M12 5v14M5 12h14" s={15} w={2} /> Nova coluna
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- Configurações */

function Configuracoes() {
  const [livre, setLivre] = useState(true);
  const [salvo, setSalvo] = useState(false);
  const opcao = (marcada: boolean, titulo: string, texto: string, aoClicar: () => void) => (
    <button type="button" onClick={aoClicar} className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors ${marcada ? "border-[#f47a1f] bg-[#f47a1f]/10" : "border-slate-700 hover:border-[#f47a1f]/50"}`}>
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${marcada ? "border-[#f47a1f]" : "border-slate-500"}`}>
        {marcada && <span className="h-2 w-2 rounded-full bg-[#f47a1f]" />}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-slate-100">{titulo}</span>
        <span className="block text-[12.5px] text-slate-400">{texto}</span>
      </span>
    </button>
  );
  return (
    <div className={card + " max-w-2xl p-5"}>
      <h2 className="text-[15px] font-semibold text-slate-100">Quem pode editar este formulário</h2>
      <p className="mt-1 text-[13px] text-slate-400">
        Ver os resultados continua liberado para todo mundo que tem acesso ao SoluteForms. Isto aqui vale para mexer nas perguntas, publicar, compartilhar e excluir.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {opcao(livre, "Qualquer pessoa da equipe com a permissão", "Quem tiver a permissão de criar e editar no SoluteForms mexe neste formulário.", () => { setLivre(true); setSalvo(false); })}
        {opcao(!livre, "Somente as pessoas escolhidas", "Além de quem criou, só quem estiver marcado na lista abaixo.", () => { setLivre(false); setSalvo(false); })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={() => setSalvo(true)} className="rounded-lg bg-[#f47a1f] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#d4640f]">Salvar</button>
        {salvo && <span className="text-[13px] text-emerald-400">Guardado!</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- modal compartilhar */

// Na demonstração o link fica oculto e "Testar" desativado.
function Compartilhar({ aoFechar }: { aoFechar: () => void }) {
  const [utm, setUtm] = useState(true);
  const redondo = "flex h-8 w-8 shrink-0 cursor-not-allowed items-center justify-center rounded-full text-slate-500";
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/50 p-3 py-8 sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <div role="dialog" aria-modal="true" aria-label="Compartilhar" className="w-full max-w-xl rounded-2xl bg-slate-800 p-5 shadow-xl sm:p-6">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-100">Compartilhar</h2>
            <p className="truncate text-[13px] text-slate-400">Pesquisa de clima 2026</p>
          </div>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700">
            <Ico d="M18 6 6 18M6 6l12 12" s={18} w={2} />
          </button>
        </div>
        <p className={rotuloSecao + " mt-5"}>Compartilhe seu formulário</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="flex min-w-0 flex-1 basis-56 items-center gap-1 rounded-full bg-slate-700/50 py-1 pl-4 pr-1.5">
            <span className="flex min-w-0 flex-1 select-none items-center gap-1.5 text-[13px] text-slate-500" aria-label="Link oculto na demonstração">
              <Ico d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" s={14} />
              <span className="truncate tracking-[.2em]">••••••••••••••••••••</span>
            </span>
            <span title="Indisponível na demonstração" aria-hidden="true" className={redondo}>
              <Ico d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" s={16} />
            </span>
            <span title="Indisponível na demonstração" aria-hidden="true" className={redondo}>
              <Ico d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" s={16} />
            </span>
          </div>
          <button type="button" disabled title="Indisponível na demonstração" className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-slate-600 px-5 py-1.5 text-[13px] font-medium text-slate-500">
            <Ico d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12zM12 9.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z" s={16} w={1.7} />
            Testar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">O link fica oculto nesta demonstração.</p>

        <p className={rotuloSecao + " mt-6 text-center"}>Rastreamento de usuário</p>
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-700 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-slate-200">Parâmetros UTM</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
              Ligando isto, o que vier na ponta do link (utm_source, utm_medium, utm_campaign…) fica guardado junto da resposta.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-slate-300">
              <Chave ligado={utm} aoMudar={() => setUtm((v) => !v)} rotulo="Parâmetros UTM" />
              {utm ? "Ligado" : "Desligado"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ tela */

type Aba = "resumo" | "respostas" | "entrada" | "kanban" | "configuracoes";

const ABAS: { id: Aba; rotulo: string; d: string }[] = [
  { id: "resumo", rotulo: "Resumo", d: "M3 3v18h18M7 15l3-4 3 3 4-6" },
  { id: "respostas", rotulo: "Respostas", d: "M3 5h18M3 12h18M3 19h18M9 5v14" },
  { id: "entrada", rotulo: "Caixa de entrada", d: "M4 13h4l2 3h4l2-3h4M4 13 6 5h12l2 8v6H4z" },
  { id: "kanban", rotulo: "Kanban", d: "M4 4h5v16H4zM10 4h5v10h-5zM16 4h4v13h-4z" },
  { id: "configuracoes", rotulo: "Configurações", d: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 13.5a7.6 7.6 0 0 0 0-3l1.8-1.3-2-3.4-2 .9a7.6 7.6 0 0 0-2.6-1.5L14.2 3h-4l-.4 2.2A7.6 7.6 0 0 0 7.2 6.7l-2-.9-2 3.4 1.8 1.3a7.6 7.6 0 0 0 0 3L3.2 15l2 3.4 2-.9a7.6 7.6 0 0 0 2.6 1.5l.4 2.2h4l.4-2.2a7.6 7.6 0 0 0 2.6-1.5l2 .9 2-3.4z" },
];

export default function MockForms() {
  const [aba, setAba] = useState<Aba>("resumo");
  const [compartilhando, setCompartilhando] = useState(false);
  const botao = "rounded-md border border-slate-600 px-3 py-1.5 text-[13px] font-medium text-slate-300 hover:bg-slate-700";

  return (
    <div className="relative flex min-h-[520px] overflow-hidden bg-slate-900 text-left font-sans text-slate-100 md:h-[600px]">
      <Lateral />

      <main className="relative flex min-w-0 flex-1 flex-col bg-slate-900">
        {/* Esmaecido no rodapé: indica que a área rola, em vez de parecer cortada. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-20 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent md:block" aria-hidden="true" />
        <header className="flex shrink-0 items-center gap-1.5 border-b border-slate-700 px-4 py-2 md:px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 lg:hidden" aria-hidden="true">
            <Ico d="M4 6h16M4 12h16M4 18h16" s={18} w={2} />
          </span>
          <div className="flex-1" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300" aria-hidden="true">
            <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" s={17} w={2} />
          </span>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-300" aria-hidden="true">
            <Ico d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" s={17} w={2} />
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f47a1f] px-1 text-[9px] font-bold text-white">3</span>
          </span>
          <span className="ml-1 flex items-center -space-x-2" aria-hidden="true">
            {[["LC", "#2563eb"], ["RM", "#059669"], ["PA", "#d946ef"]].map(([i, c]) => (
              <span key={i} className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 text-[10px] font-bold text-white" style={{ backgroundColor: c }}>
                {i}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
              </span>
            ))}
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700 text-[10px] font-semibold text-slate-200">+4</span>
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin] md:px-6">
          <div className="flex flex-col gap-3.5">
            <span className="-ml-2 inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-0.5 text-[13px] font-medium text-slate-400">
              <Ico d="M19 12H5M12 19l-7-7 7-7" s={15} w={2} />
              Voltar para o SoluteForms
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span className="min-w-0 truncate text-xl font-bold text-slate-100">Pesquisa de clima 2026</span>
                <Ico d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" s={15} className="text-slate-400" />
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-400">Publicado</span>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setCompartilhando(true)} className={botao + " inline-flex items-center gap-2"}>
                  <Ico d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4" s={15} />
                  Compartilhar
                </button>
                <button type="button" className={botao}>Editar</button>
              </div>
            </div>

            <nav className={card + " flex gap-1 overflow-x-auto p-1.5 [scrollbar-width:none]"} aria-label="Resultados">
              {ABAS.map((a) => (
                <button key={a.id} type="button" onClick={() => setAba(a.id)} aria-current={aba === a.id ? "page" : undefined} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${aba === a.id ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700/60"}`}>
                  <Ico d={a.d} s={15} />
                  {a.rotulo}
                </button>
              ))}
            </nav>

            <div className="min-w-0">
              {aba === "resumo" && <Resumo />}
              {aba === "respostas" && <Respostas />}
              {aba === "entrada" && <Entrada />}
              {aba === "kanban" && <Kanban />}
              {aba === "configuracoes" && <Configuracoes />}
            </div>
          </div>
        </div>
      </main>

      {compartilhando && <Compartilhar aoFechar={() => setCompartilhando(false)} />}
    </div>
  );
}
