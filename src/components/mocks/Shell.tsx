import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Item = { icone: LucideIcon; label: string; ativo?: boolean };

/** Estrutura comum das telas de exemplo: menu lateral + conteúdo. */
export default function Shell({
  marca, itens, usuario, children,
}: { marca: ReactNode; itens: Item[]; usuario: { nome: string; papel: string }; children: ReactNode }) {
  const iniciais = usuario.nome.split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <div className="flex h-full min-h-[520px] text-left">
      <aside className="hidden w-[196px] flex-none flex-col border-r border-ink-600 bg-ink-900 p-4 md:flex">
        <div className="px-2 pb-5 pt-1">{marca}</div>
        <ul className="space-y-0.5">
          {itens.map((i) => (
            <li
              key={i.label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${
                i.ativo ? "font-medium text-brand" : "text-fog-400"
              }`}
              style={i.ativo ? { backgroundColor: "rgba(243,140,35,.12)" } : undefined}
            >
              <i.icone className="h-4 w-4" />
              {i.label}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-2.5 border-t border-ink-600 px-1 pt-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/15 text-[11px] font-semibold text-brand">{iniciais}</span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[12.5px] font-medium text-fog">{usuario.nome}</span>
            <span className="block text-[11px] text-fog-500">{usuario.papel}</span>
          </span>
        </div>
      </aside>
      <div className="min-w-0 flex-1 bg-ink-950 p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function MockLogo({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="h-9 w-auto" />;
}

export function MockWord({ sufixo }: { sufixo: string }) {
  return (
    <span className="block font-display text-[19px] font-extrabold uppercase leading-[.86] tracking-[-.02em]">
      Solute<span className="block text-brand">{sufixo}</span>
    </span>
  );
}
