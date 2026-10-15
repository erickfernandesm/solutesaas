"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo do hero: anéis em perspectiva com os quatro sistemas orbitando a empresa.
 * As posições são calculadas a cada quadro para os pontos não se deformarem com a perspectiva.
 */
const CX = 800, CY = 330, INCLINA = 0.34;
const aneis = [180, 300, 430, 570, 720];
const sistemas = [
  { nome: "Gestão", anel: 1, vel: 0.055, fase: 0.6 },
  { nome: "Ponto", anel: 2, vel: -0.04, fase: 2.4 },
  { nome: "Recruta", anel: 3, vel: 0.03, fase: 4.1 },
  { nome: "Forms", anel: 4, vel: -0.022, fase: 5.5 },
];

export default function Orbitas({ rotulos = true, className = "" }: { rotulos?: boolean; className?: string }) {
  const pontos = useRef<(SVGGElement | null)[]>([]);
  const livre = rotulos; // com rótulos, o hero tem título centralizado sobre as órbitas

  useEffect(() => {
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const inicio = performance.now();
    const desenhar = (agora: number) => {
      const t = (agora - inicio) / 1000;
      sistemas.forEach((s, i) => {
        const g = pontos.current[i];
        if (!g) return;
        const a = s.fase + (parado ? 0 : t * s.vel);
        const r = aneis[s.anel];
        const x = CX + Math.cos(a) * r;
        const y = CY + Math.sin(a) * r * INCLINA;
        // Na metade de trás da órbita o ponto fica mais apagado, dando profundidade.
        const frente = (Math.sin(a) + 1) / 2;
        // Atrás do título o ponto quase some e o nome não aparece, para não brigar com o texto.
        const atrasDoTexto = livre && Math.abs(x - CX) < 470 && y > 130 && y < 580;
        g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        g.style.opacity = String(atrasDoTexto ? 0.18 : 0.35 + frente * 0.65);
      });
      if (!parado) raf = requestAnimationFrame(desenhar);
    };
    raf = requestAnimationFrame(desenhar);
    return () => cancelAnimationFrame(raf);
  }, [livre]);

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 760" className="h-auto w-[1600px] max-w-none flex-none [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
        <defs>
          <linearGradient id="orb-anel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EDEDF0" stopOpacity=".04" />
            <stop offset="55%" stopColor="#EDEDF0" stopOpacity=".09" />
            <stop offset="100%" stopColor="#F38C23" stopOpacity=".45" />
          </linearGradient>
          <radialGradient id="orb-nucleo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F38C23" stopOpacity=".55" />
            <stop offset="40%" stopColor="#F38C23" stopOpacity=".16" />
            <stop offset="100%" stopColor="#F38C23" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb-ponto" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC98F" stopOpacity="1" />
            <stop offset="35%" stopColor="#F38C23" stopOpacity=".6" />
            <stop offset="100%" stopColor="#F38C23" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={CX} cy={CY} rx="520" ry="300" fill="url(#orb-nucleo)" />

        {aneis.map((r, i) => (
          <ellipse
            key={r}
            cx={CX}
            cy={CY}
            rx={r}
            ry={r * INCLINA}
            fill="none"
            stroke="url(#orb-anel)"
            strokeWidth={i === 0 ? 1.4 : 1}
            strokeDasharray={i % 2 ? "2 7" : undefined}
          />
        ))}

        {sistemas.map((s, i) => (
          <g key={s.nome} ref={(el) => { pontos.current[i] = el; }} transform={`translate(${CX + aneis[s.anel]} ${CY})`}>
            <circle r="18" fill="url(#orb-ponto)" />
            <circle r="3.5" fill="#FFE2C2" />
            {rotulos && (
              <text x="12" y="-12" style={{ transition: "opacity .4s" }} fill="#A0A0AA" fontSize="13" fontFamily="var(--font-inter), system-ui, sans-serif" letterSpacing="1.5">
                {s.nome.toUpperCase()}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
