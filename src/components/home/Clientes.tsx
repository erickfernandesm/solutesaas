const nomes = [
  "TIM", "Adidas", "Fisk", "Hope", "Mundial Alumínio", "NBC Bank", "DAS Brasil", "Datafor",
  "H2A", "Sindicomércio", "Faculdade Líbano", "Paraibuna Embalagens", "Ativa Hospitalar", "SM Contabilidade",
];

export default function Clientes() {
  const lista = [...nomes, ...nomes];
  return (
    <section className="border-y border-ink-600 bg-ink-900/50 py-10" aria-label="Empresas que já confiaram na Solute RH">
      <p className="text-center text-[12px] font-semibold uppercase tracking-[.2em] text-fog-600">
        Empresas que já confiaram na Solute RH
      </p>
      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
          {lista.map((n, i) => (
            <li key={i} className="whitespace-nowrap font-display text-[22px] font-bold tracking-[-.02em] text-fog-600 transition hover:text-fog-300" aria-hidden={i >= nomes.length}>
              {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
