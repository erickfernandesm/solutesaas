import type { ComponentType } from "react";
import type { Slug } from "@/data/produtos";
import MockGestao from "./MockGestao";
import MockPonto from "./MockPonto";
import MockRecruta from "./MockRecruta";
import MockForms from "./MockForms";

export const mocks: Record<Slug, { Componente: ComponentType; url: string }> = {
  gestao: { Componente: MockGestao, url: "sistema.soluterh.com.br/painel" },
  ponto: { Componente: MockPonto, url: "ponto.soluterh.com.br" },
  recruta: { Componente: MockRecruta, url: "recruta.soluterh.com.br/vagas/analista-financeiro" },
  forms: { Componente: MockForms, url: "sistema.soluterh.com.br/soluteforms" },
};
