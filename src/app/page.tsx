import Hero from "@/components/home/Hero";
import Clientes from "@/components/home/Clientes";
import Vitrine from "@/components/home/Vitrine";
import Ecossistema from "@/components/home/Ecossistema";
import Conexoes from "@/components/home/Conexoes";
import Pilares from "@/components/home/Pilares";
import ComoFunciona from "@/components/home/ComoFunciona";
import Sobre from "@/components/home/Sobre";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import { perguntasGerais } from "@/data/produtos";

export default function Home() {
  return (
    <>
      <Hero />
      <Clientes />
      <Vitrine />
      <Ecossistema />
      <Conexoes />
      <Pilares />
      <ComoFunciona />
      <Sobre />
      <Faq perguntas={perguntasGerais} />
      <CtaFinal />
    </>
  );
}
