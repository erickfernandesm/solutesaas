export const contato = {
  whatsapp: "5532999501615",
  whatsappExibicao: "(32) 99950-1615",
  email: "contato@soluterh.com.br",
  horario: "Seg. a qui., 8h às 18h · sex., 8h às 17h",
  cnpj: "42.692.955/0001-05",
  endereco: "R. Batista de Oliveira, 1164, sala 607, Centro, Juiz de Fora/MG",
  site: "https://soluterh.com.br",
  instagram: "https://www.instagram.com/soluterecursoshumanos/",
  linkedin: "https://www.linkedin.com/company/solute-rh/",
  youtube: "https://www.youtube.com/@rose.especialistarh",
};

export function waLink(mensagem = "Olá! Quero conhecer os sistemas da Solute RH.") {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
