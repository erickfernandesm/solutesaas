"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/*
 * Réplica da tela "Início" do colaborador no Solute Ponto (tema escuro, que é
 * o padrão do sistema). Cores, raios, rótulos e frases seguem o public/ do
 * sistema real (estilo.css, inicio.js, barra-lateral.js). Dados fictícios.
 */

type Tipo = "entrada" | "saida_almoco" | "volta_almoco" | "saida";
const SEQUENCIA: { tipo: Tipo; rotulo: string; proxima: string }[] = [
  { tipo: "entrada", rotulo: "Entrada", proxima: "Entrada" },
  { tipo: "saida_almoco", rotulo: "Saída almoço", proxima: "Saída para almoço" },
  { tipo: "volta_almoco", rotulo: "Volta almoço", proxima: "Volta do almoço" },
  { tipo: "saida", rotulo: "Saída", proxima: "Saída" },
];

const PREVISTO_DIA = 8 * 60;
const ALMOCO_MIN = 60;

const paraMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
const fmtMin = (m: number) => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
const agoraHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function Ico({ children, className = "h-[17px] w-[17px]" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`flex-none ${className}`}>
      {children}
    </svg>
  );
}

const MENU = [
  { rotulo: "Início", ativo: true, ico: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></> },
  { rotulo: "Bater Ponto", ico: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
  { rotulo: "Histórico", ico: <path d="M3 5h18M3 12h18M3 19h12" /> },
  { rotulo: "Solicitações", ico: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
];

export default function MockPonto() {
  // Começa no início do dia: nenhuma batida ainda, para quem visita sentir a entrada e o check-in.
  const [batidas, setBatidas] = useState<string[]>([]);
  const [humorAberto, setHumorAberto] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const completa = batidas.length >= SEQUENCIA.length;
  const proxima = SEQUENCIA[batidas.length];

  function bater() {
    if (completa) return;
    // Na entrada, primeiro o check-in de bem-estar: o ponto só é registrado depois de escolher uma opção.
    if (batidas.length === 0) return setHumorAberto(true);
    setBatidas((b) => [...b, agoraHHMM()]);
  }

  function responderHumor(escolheu: boolean) {
    setHumorAberto(false);
    if (!escolheu) return; // saiu sem responder: a entrada não conta
    setBatidas((b) => (b.length === 0 ? [agoraHHMM()] : b));
    setAviso("Entrada registrada. Obrigado pelo check-in! 💙");
    setTimeout(() => setAviso(null), 2800);
  }

  // Frase do dia, como em fraseDoDia() do sistema real.
  let frase: string;
  if (completa) frase = `Jornada de hoje completa, com ${batidas.length} marcação(ões). Se precisar registrar mais alguma, pode bater.`;
  else if (batidas.length === 0) frase = "Você ainda não bateu ponto hoje.";
  else if (batidas.length === 1) frase = "Você ainda não bateu o ponto do almoço hoje.";
  else if (batidas.length === 2) frase = `Você tem ainda ${fmtMin(ALMOCO_MIN - 35)} de almoço, bata assim que acabar.`;
  else frase = "Você ainda não bateu a saída hoje.";

  // Trabalhado hoje: soma dos pares; período aberto conta até agora.
  const marcos = batidas.length % 2 ? [...batidas, agoraHHMM()] : batidas;
  let trabalhado = 0;
  for (let i = 0; i + 1 < marcos.length; i += 2) trabalhado += Math.max(0, paraMin(marcos[i + 1]) - paraMin(marcos[i]));
  const saldoDia = trabalhado - PREVISTO_DIA;
  const dia = completa
    ? {
        valor: saldoDia === 0 ? "0h00" : `${saldoDia > 0 ? "+" : "-"}${fmtMin(Math.abs(saldoDia))}`,
        rotulo: "Saldo do dia (dia fechado)",
        cor: saldoDia > 0 ? "text-[#F38C23]" : saldoDia < 0 ? "text-[#ff8b8b]" : "text-white",
      }
    : { valor: fmtMin(trabalhado), rotulo: "Trabalhado hoje (dia em andamento)", cor: "text-white" };

  return (
    <div className="relative flex h-full min-h-[520px] bg-slate-900 text-left font-sans text-white">
      {humorAberto && (
        // Modal de check-in de bem-estar, igual ao do sistema (ponto.html, #modal-humor).
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 p-4" onMouseDown={(e) => e.target === e.currentTarget && responderHumor(false)}>
          <div role="dialog" aria-modal="true" aria-label="Como você está hoje?" className="relative w-full max-w-[460px] rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center shadow-2xl">
            <button type="button" onClick={() => responderHumor(false)} aria-label="Fechar" className="absolute right-4 top-3 text-[22px] leading-none text-slate-400 hover:text-white">&times;</button>
            <h2 className="mb-1.5 text-[19px] font-bold">Bom te ver! Como você está hoje?</h2>
            <p className="mb-5 text-[13px] text-slate-400">Um check-in rápido que ajuda o RH a cuidar do bem-estar da equipe.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {([["😄", "Ótimo"], ["🙂", "Bem"], ["😐", "Neutro"], ["😟", "Desanimado"], ["😣", "Mal"]] as const).map(([e, r]) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => responderHumor(true)}
                  className="flex w-[66px] flex-col items-center gap-1.5 rounded-[14px] border border-slate-600 bg-slate-700/40 px-1 py-3 text-[26px] transition hover:border-[#F38C23] hover:bg-[rgba(243,140,35,.15)] active:scale-[.96]"
                >
                  {e}
                  <span className="text-[10.5px] font-semibold text-slate-300">{r}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-slate-500">A entrada é registrada assim que você escolher.</p>
          </div>
        </div>
      )}
      {aviso && (
        <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-xl">{aviso}</div>
      )}
      {/* Barra lateral */}
      <aside className="hidden w-[208px] flex-none flex-col border-r border-slate-800 bg-slate-900 px-3 pb-4 pt-5 md:flex">
        <div className="px-2">
          <img src="/assets/solute-ponto-branca.svg" alt="Solute Ponto" className="block h-auto w-full max-w-[128px]" />
        </div>
        <nav className="mt-5 flex flex-1 flex-col gap-0.5">
          <p className="mb-1.5 pl-2.5 text-[10px] font-semibold uppercase tracking-[.13em] text-slate-500">Meu ponto</p>
          {MENU.map((m) => (
            <span
              key={m.rotulo}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium ${
                m.ativo ? "bg-[#f47a1f] text-white" : "text-slate-300"
              }`}
            >
              <Ico>{m.ico}</Ico>
              {m.rotulo}
            </span>
          ))}
        </nav>
        <div className="mt-4 border-t border-slate-800 pt-3">
          <div className="flex items-center gap-2.5 px-1">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#f47a1f] text-[12px] font-bold text-white">MC</span>
            <span className="flex min-w-0 flex-col leading-[1.3]">
              <span className="truncate text-[13px] font-semibold">Marina Costa</span>
              <span className="text-[11px] text-slate-400">Colaborador</span>
            </span>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-[48px] items-center border-b border-slate-700 px-4 sm:px-5">
          <img src="/assets/solute-ponto-branca.svg" alt="Solute Ponto" className="h-6 w-auto md:hidden" />
          <span className="relative ml-auto grid h-9 w-9 place-items-center rounded-[9px] text-slate-500">
            <Ico className="h-[18px] w-[18px]">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </Ico>
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#e5484d] px-1 text-[9.5px] font-bold text-white">1</span>
          </span>
        </div>

        <div className="mx-auto w-full max-w-[860px] px-4 py-5 sm:px-6 sm:py-6">
          <h1 className="mb-1 text-[20px] font-bold">Olá, Marina</h1>
          <p className="text-[13px] text-slate-400">Quinta-feira, 15 de outubro</p>

          {/* Seu dia de hoje */}
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-[0_8px_30px_rgba(0,0,0,.55)] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="mb-0.5 text-[15.5px] font-semibold">Seu dia de hoje</h2>
                <p className="text-[13px] text-slate-400">{frase}</p>
              </div>
              <button
                type="button"
                onClick={bater}
                className={`whitespace-nowrap rounded-[10px] px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                  completa ? "cursor-default bg-slate-700 text-white" : "bg-[#F38C23] text-white hover:bg-[#d9791a]"
                }`}
              >
                {completa ? "Ver meu ponto" : `Bater ${proxima.proxima.toLowerCase()}`}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {SEQUENCIA.map((s, i) => {
                const hora = batidas[i];
                return (
                  <div
                    key={s.tipo}
                    className={`flex flex-col gap-0.5 rounded-xl border px-3.5 py-3 ${
                      hora ? "border-[rgba(243,140,35,.5)] bg-[rgba(243,140,35,.08)]" : "border-slate-700 bg-slate-700/40"
                    }`}
                  >
                    <span className="text-[11px] text-slate-400">{s.rotulo}</span>
                    <span className={`text-[18px] tabular-nums ${hora ? "font-bold text-white" : "font-medium text-slate-500"}`}>{hora ?? "--:--"}</span>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 border-t border-slate-700 pt-2.5 text-[12px] text-slate-400">
              Próximo feriado: <b className="text-slate-300">Finados</b>, 02/11 (segunda-feira) · faltam 18 dias.
            </p>
          </div>

          {/* Os números */}
          <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
            <div className="rounded-[14px] border border-slate-700 bg-slate-800 px-4 py-3.5">
              <b className={`block text-[25px] font-extrabold leading-[1.1] tabular-nums ${dia.cor}`}>{dia.valor}</b>
              <small className="mt-1 block text-[12px] text-slate-400">{dia.rotulo}</small>
              <span className="mt-2 flex gap-4 text-[11.5px] text-slate-400">
                <span className="flex flex-col">Previsto <b className="text-white">{fmtMin(PREVISTO_DIA)}</b></span>
              </span>
            </div>
            <div className="rounded-[14px] border border-slate-700 bg-slate-800 px-4 py-3.5">
              <b className="block text-[25px] font-extrabold leading-[1.1] tabular-nums text-[#F38C23]">+3h20</b>
              <small className="mt-1 block text-[12px] text-slate-400">A favor neste mês</small>
              <span className="mt-2 flex gap-4 text-[11.5px] text-slate-400">
                <span className="flex flex-col">Previsto <b className="text-[#F38C23]">80h00</b></span>
                <span className="flex flex-col">Cumprido <b className="text-[#F38C23]">83h20</b></span>
              </span>
            </div>
          </div>

          {/* Precisa da sua atenção */}
          <div className="mt-3.5 rounded-2xl border border-slate-700 bg-slate-800 px-4 pb-2 pt-4 shadow-[0_8px_30px_rgba(0,0,0,.55)] sm:px-5">
            <h2 className="mb-1.5 text-[15px] font-semibold text-slate-400">Precisa da sua atenção</h2>
            <div className="flex items-center gap-2.5 px-0.5 py-2.5">
              <Ico className="h-[18px] w-[18px] text-[#F38C23]">
                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1Z" />
              </Ico>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[13.5px] font-bold">1 resposta(s) nova(s) do RH</span>
                <span className="text-[12px] text-slate-400">Toque para ver o que foi decidido.</span>
              </span>
              <span aria-hidden="true" className="text-[22px] leading-none text-slate-500">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
