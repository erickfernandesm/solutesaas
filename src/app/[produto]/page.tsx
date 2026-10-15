import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { porSlug, produtos, type Slug } from "@/data/produtos";
import ProdutoHero from "@/components/produto/ProdutoHero";
import Destaques from "@/components/produto/Destaques";
import Recursos from "@/components/produto/Recursos";
import OutrosSistemas from "@/components/produto/OutrosSistemas";
import EspecialGestao from "@/components/produto/EspecialGestao";
import EspecialPonto from "@/components/produto/EspecialPonto";
import EspecialRecruta from "@/components/produto/EspecialRecruta";
import EspecialForms from "@/components/produto/EspecialForms";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";

const especiais: Record<Slug, () => React.ReactNode> = {
  gestao: () => <EspecialGestao />,
  ponto: () => <EspecialPonto />,
  recruta: () => <EspecialRecruta />,
  forms: () => <EspecialForms />,
};

type Props = { params: Promise<{ produto: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return produtos.map((p) => ({ produto: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = porSlug((await params).produto);
  if (!p) return {};
  return { title: p.nome, description: `${p.resumo} ${p.descricao}` };
}

export default async function PaginaProduto({ params }: Props) {
  const p = porSlug((await params).produto);
  if (!p) notFound();
  return (
    <>
      <ProdutoHero slug={p.slug} />
      <Destaques p={p} />
      {especiais[p.slug]()}
      <Recursos p={p} />
      <Faq perguntas={p.perguntas} titulo={`Dúvidas sobre o ${p.nome}.`} />
      <OutrosSistemas atual={p.slug} />
      <CtaFinal mensagem={p.mensagem} titulo={<>Veja o {p.nome} <span className="text-gradient">funcionando</span> na sua empresa.</>} />
    </>
  );
}
