import Link from "next/link";
import { Clock, Mail, MapPin } from "lucide-react";
import { produtos } from "@/data/produtos";
import { contato, waLink } from "@/lib/contato";
import IconeWhatsApp from "@/components/IconeWhatsApp";

// Mesmo desenho do rodapé do site oficial da Solute RH (soluterh.com.br).
const site = (p: string) => `${contato.site}/${p}`;
const institucional = [
  ["Quem somos", site("quem-somos.html")],
  ["Consultoria", site("consultoria.html")],
  ["Solute Cursos", site("cursos.html")],
  ["Clientes", site("clientes.html")],
  ["Solute Cast", site("solute-cast.html")],
  ["Contato", site("contato.html")],
  ["Política de Privacidade", site("politica-de-privacidade.html")],
];

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[17px] w-[17px]" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 002.46 2.5h.03A2.5 2.5 0 007.5 6a2.5 2.5 0 00-2.52-2.5zM3 21h4V9.5H3V21zm7.5 0h4v-6.4c0-1.7.6-2.8 2-2.8 1.2 0 1.8.8 1.8 2.6V21h4v-7.2c0-3.4-1.8-5-4.2-5-1.9 0-2.8 1.1-3.3 1.9h.03V9.5H10.5c.05 1.1 0 11.5 0 11.5z" />
    </svg>
  );
}
function YouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden="true">
      <path d="M22.5 7.4a2.7 2.7 0 00-1.9-1.9C18.9 5 12 5 12 5s-6.9 0-8.6.5A2.7 2.7 0 001.5 7.4 28 28 0 001 12a28 28 0 00.5 4.6 2.7 2.7 0 001.9 1.9C5.1 19 12 19 12 19s6.9 0 8.6-.5a2.7 2.7 0 001.9-1.9A28 28 0 0023 12a28 28 0 00-.5-4.6zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
    </svg>
  );
}

const titulo = "mb-5 font-display text-[12.5px] font-bold uppercase tracking-[.15em] text-fog-500";
const linkCls = "text-[14.5px] text-fog-300 transition hover:text-brand md:hover:translate-x-[3px]";
const contatoCls = "flex flex-col items-center gap-1.5 text-center text-[14.5px] leading-relaxed text-fog-300 md:flex-row md:items-start md:gap-3 md:text-left";
const iconeCls = "h-4 w-4 flex-none text-brand md:mt-[3px]";

export default function Footer() {
  const redes = [
    { href: contato.instagram, rotulo: "Instagram da Solute RH", Icone: Instagram },
    { href: contato.linkedin, rotulo: "LinkedIn da Solute RH", Icone: LinkedIn },
    { href: contato.youtube, rotulo: "YouTube da Solute RH", Icone: YouTube },
    { href: waLink(), rotulo: "WhatsApp da Solute RH", Icone: () => <IconeWhatsApp className="h-[17px] w-[17px]" /> },
  ];

  return (
    <footer className="relative isolate overflow-hidden border-t border-ink-600 bg-ink-950 pt-14 md:pt-20" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {/* brilho laranja suave no topo, como no site oficial */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-50%] -z-10 aspect-[2/1] w-[min(1200px,140%)] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at center, rgba(243,140,35,.11), transparent 62%)" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-site px-5 sm:px-8">
        <div className="grid gap-10 pb-12 text-center md:grid-cols-2 md:text-left lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12 lg:pb-16">
          <div className="md:col-span-2 lg:col-span-1">
            <img src="/assets/solute-rh-branca.svg" alt="Solute RH" className="mx-auto mb-5 h-[38px] w-auto md:mx-0" />
            <p className="mx-auto max-w-[34ch] text-[14.5px] leading-relaxed text-fog-400 md:mx-0">
              Fortalecemos negócios através de pessoas. Consultoria, educação e os sistemas que organizam a gestão de pessoas da sua empresa.
            </p>
            <div className="mt-6 flex justify-center gap-2 md:justify-start">
              {redes.map(({ href, rotulo, Icone }) => (
                <a
                  key={rotulo}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={rotulo}
                  className="grid h-10 w-10 place-items-center rounded-full border border-ink-500 text-fog-300 transition hover:-translate-y-[3px] hover:border-brand hover:bg-brand/10 hover:text-brand"
                >
                  <Icone />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className={titulo}>Sistemas</h2>
            <nav className="grid justify-items-center gap-2.5 md:justify-items-start" aria-label="Sistemas">
              {produtos.map((p) => (
                <Link key={p.slug} href={`/${p.slug}/`} className={linkCls}>{p.nome}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className={titulo}>Institucional</h2>
            <nav className="grid justify-items-center gap-2.5 md:justify-items-start" aria-label="Links institucionais">
              {institucional.map(([rotulo, href]) => (
                <a key={rotulo} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{rotulo}</a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className={titulo}>Fale com a gente</h2>
            <div className="grid justify-items-center gap-5 md:justify-items-start md:gap-4">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className={contatoCls + " transition hover:text-brand"}>
                <IconeWhatsApp className={iconeCls} />
                <span>
                  {contato.whatsappExibicao}
                  <span className="block text-[13px] text-fog-500">WhatsApp · resposta no mesmo dia</span>
                </span>
              </a>
              <p className={contatoCls}>
                <Mail className={iconeCls} />
                <span className="select-all">{contato.email}</span>
              </p>
              <p className={contatoCls}>
                <MapPin className={iconeCls} />
                <span>R. Batista de Oliveira, 1164, Sala 607<br />Centro, Juiz de Fora / MG</span>
              </p>
              <p className={contatoCls}>
                <Clock className={iconeCls} />
                <span>Segunda a quinta, das 08h às 18h<br />Sexta, das 08h às 17h</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-ink-600 py-6 text-center text-[13px] text-fog-500 md:justify-between md:text-left">
          <span>© {new Date().getFullYear()} Solute Recursos Humanos · CNPJ {contato.cnpj}</span>
          <nav className="flex flex-wrap justify-center gap-5" aria-label="Links legais">
            <a href={site("politica-de-privacidade.html")} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand">Política de Privacidade</a>
            <a href={site("contato.html")} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand">Contato</a>
          </nav>
        </div>
      </div>

      {/* marca d'água gigante, como no site oficial */}
      <span
        className="pointer-events-none block w-full select-none text-center font-display font-extrabold leading-none tracking-[-.02em] text-white/[.055]"
        style={{ fontSize: "clamp(3rem, 13.5vw, 13rem)" }}
        aria-hidden="true"
      >
        SOLUTE RH
      </span>
    </footer>
  );
}
