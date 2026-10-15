import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Clock, UserSearch, ClipboardList,
  KanbanSquare, Timer, Video, MessageSquareHeart, Award, Bot, BellRing, LifeBuoy, ShieldCheck,
  Smartphone, Receipt, MapPin, Activity, FilePen, FileSpreadsheet, CalendarDays, FileCheck2, HeartPulse,
  FileText, Target, Megaphone, ScanText, Scale, MessagesSquare, Brain, ScrollText, Columns3, Gauge, Users,
  ListChecks, Paintbrush, QrCode, Save, Table2, Kanban, Lock, MessageCircle,
} from "lucide-react";

export type Slug = "gestao" | "ponto" | "recruta" | "forms";

export type Bloco = { icone: LucideIcon; titulo: string; texto: string };
export type Grupo = { titulo: string; itens: { titulo: string; texto: string }[] };
export type Pergunta = { p: string; r: string };

export type Produto = {
  slug: Slug;
  nome: string;          // "Solute Gestão"
  sufixo: string;        // "Gestão"
  icone: LucideIcon;
  logo?: string;         // logo oficial, quando existe
  resumo: string;        // uma linha, usada nos cartões
  publicoCurto: string;
  titulo: string;        // headline da página
  descricao: string;
  publico: string[];
  numeros: { valor: string; rotulo: string }[];
  destaques: Bloco[];    // bento da página
  grupos: Grupo[];       // lista completa de recursos
  perguntas: Pergunta[];
  nota?: string;
  sobMedida?: { titulo: string; texto: string; exemplos: string[] };
  chamadas: Bloco[];     // três destaques curtos acima da tela, no hero
  mensagem: string;      // texto do WhatsApp
};

export const produtos: Produto[] = [
  {
    slug: "gestao",
    nome: "Solute Gestão",
    sufixo: "Gestão",
    icone: LayoutDashboard,
    resumo: "Tarefas, reuniões, pessoas e feedback num sistema montado para a sua empresa.",
    publicoCurto: "Empresas que querem a equipe organizada",
    titulo: "O sistema de gestão que se molda à sua empresa.",
    descricao:
      "Tarefas, projetos, reuniões e pessoas no mesmo lugar, com prazos, tempo gasto e produtividade acompanhados em tempo real. Você liga os módulos que a sua operação usa, define setores e permissões, e cada pessoa vê exatamente o que precisa.",
    publico: ["Donos e gestores", "Líderes de equipe", "RH", "PMEs"],
    numeros: [
      { valor: "08:30", rotulo: "resumo diário no WhatsApp" },
      { valor: "4", rotulo: "tipos de registro sobre cada pessoa" },
      { valor: "Por pessoa", rotulo: "permissões e visibilidade" },
    ],
    destaques: [
      { icone: KanbanSquare, titulo: "Tarefas que não se perdem", texto: "Prazos, status, categorias, anexos, comentários e mais de um responsável. Em lista ou Kanban, com tarefas recorrentes." },
      { icone: Timer, titulo: "Tempo gasto sem planilha", texto: "O sistema sugere o tempo de cada tarefa a partir de quando ela entrou em andamento. A equipe só confirma." },
      { icone: Video, titulo: "Reuniões na agenda de todos", texto: "Integração com Google Meet e Agenda. Reuniões recorrentes, filtro por setor ou pessoa e pedido de reunião direto pelo sistema." },
      { icone: MessageSquareHeart, titulo: "Feedback com regra clara", texto: "Reconhecimento é público. Feedback, ponto de melhoria e situação ficam só entre os líderes de cada pessoa." },
      { icone: Bot, titulo: "Assistente no WhatsApp", texto: "\"O que tenho hoje?\", \"minhas reuniões\", \"tarefas atrasadas\". A equipe pergunta e recebe a resposta na hora." },
      { icone: ShieldCheck, titulo: "Permissões por pessoa", texto: "Setores, cargos e acessos finos. Cada líder vê apenas as pessoas e os setores sob a responsabilidade dele." },
    ],
    grupos: [
      {
        titulo: "Rotina da equipe",
        itens: [
          { titulo: "Minhas tarefas e tarefas da equipe", texto: "Lista ou Kanban, com filtros por pessoa, setor e status." },
          { titulo: "Tarefas recorrentes", texto: "O que se repete toda semana ou todo mês entra sozinho na rotina." },
          { titulo: "Dúvidas por tarefa", texto: "Perguntas e respostas ficam na tarefa, para consultar depois." },
          { titulo: "Rotina e lembretes", texto: "Itens com horário, funções atribuídas e avisos." },
        ],
      },
      {
        titulo: "Reuniões e agenda",
        itens: [
          { titulo: "Google Meet e Agenda", texto: "Reuniões criadas no sistema aparecem na agenda de todos." },
          { titulo: "Reuniões recorrentes", texto: "As que se repetem entram sozinhas na agenda, com filtro por setor ou por pessoa." },
          { titulo: "Pedido de reunião", texto: "Qualquer pessoa da equipe solicita uma reunião pelo sistema." },
        ],
      },
      {
        titulo: "Pessoas e cultura",
        itens: [
          { titulo: "Acompanhamento da equipe", texto: "Reconhecimento, feedback, ponto de melhoria e situação, com relatório periódico em PDF." },
          { titulo: "Minha trajetória", texto: "Cada pessoa vê os reconhecimentos e feedbacks que recebeu." },
          { titulo: "Mural de elogios", texto: "Reconhecimento público entre colegas, com reações." },
          { titulo: "Forms interno", texto: "Pesquisas para a equipe, anônimas de verdade, com cobrança automática de quem não respondeu." },
        ],
      },
      {
        titulo: "Comunicação",
        itens: [
          { titulo: "Chat da equipe", texto: "Conversas internas com reações e figurinhas." },
          { titulo: "Assistente com base de conhecimento", texto: "Responde dúvidas com base no conteúdo que a sua empresa cadastrar." },
          { titulo: "Resumo diário e relatório mensal", texto: "No WhatsApp às 08:30 e no fim de cada mês, sem ninguém precisar montar." },
          { titulo: "Notificações e presença", texto: "No sino e por e-mail, com status Disponível, Ocupado e Ausente." },
        ],
      },
      {
        titulo: "Módulos por área",
        itens: [
          { titulo: "Comercial", texto: "Leads, propostas, contratos, carteira de clientes e finanças." },
          { titulo: "Marketing", texto: "Planner de redes sociais, calendário editorial, carrosséis e blog." },
          { titulo: "Tráfego pago", texto: "Anúncios do Meta ligados às vendas que eles geraram." },
          { titulo: "Chamados, sugestões e cofre de senhas", texto: "Pedidos internos, ideias da equipe e acessos guardados com segurança." },
        ],
      },
    ],
    perguntas: [
      { p: "Como o Solute Gestão se adapta à minha empresa?", r: "Na implantação, ligamos só os módulos que a sua operação usa, cadastramos setores e cargos e definimos o que cada pessoa pode ver e fazer. Dá para ligar novos módulos depois." },
      { p: "A equipe precisa instalar alguma coisa?", r: "Não. O sistema funciona no navegador do computador e do celular, no tema claro ou escuro. O assistente funciona no WhatsApp que a pessoa já usa." },
      { p: "Os feedbacks ficam visíveis para todos?", r: "Não. Só o reconhecimento é público. Feedback, ponto de melhoria e situação ficam restritos aos líderes daquela pessoa." },
      { p: "Funciona com o Google Agenda?", r: "Sim. O Solute Gestão se integra ao Google Meet e ao Google Agenda, e as reuniões criadas no sistema aparecem na agenda de cada participante." },
      { p: "Vocês desenvolvem funções específicas para a minha empresa?", r: "Sim. Se a sua operação precisa de algo que o Solute Gestão ainda não tem, a equipe da Solute RH avalia a necessidade e desenvolve o complemento sob medida, dentro do mesmo sistema." },
    ],
    sobMedida: {
      titulo: "Complementamos conforme a sua necessidade.",
      texto:
        "Precisa de um controle que não está na lista? A Solute RH também desenvolve. Entendemos o processo da sua empresa e criamos o módulo dentro do mesmo sistema, com as mesmas permissões e o mesmo visual que a equipe já conhece.",
      exemplos: ["Um fluxo de aprovação próprio", "Um cadastro específico do seu setor", "Um relatório no formato da diretoria", "Uma integração com a ferramenta que você já usa"],
    },
    chamadas: [
      { icone: CalendarDays, titulo: "Próxima reunião à vista", texto: "Dia, hora e link do Meet no Painel." },
      { icone: KanbanSquare, titulo: "Crie tarefas e colunas", texto: "Em Minhas tarefas, com um clique." },
      { icone: Bot, titulo: "Resumo no WhatsApp", texto: "As entregas do dia às 08:30." },
    ],
    mensagem: "Olá! Quero conhecer o Solute Gestão.",
  },
  {
    slug: "ponto",
    nome: "Solute Ponto",
    sufixo: "Ponto",
    icone: Clock,
    logo: "/assets/solute-ponto.svg",
    resumo: "Controle de ponto pelo navegador, com comprovante a cada batida.",
    publicoCurto: "Empresas com equipe CLT",
    titulo: "Controle de ponto simples para a equipe e seguro para a empresa.",
    descricao:
      "O colaborador bate o ponto pelo navegador do celular ou do computador, sem instalar nada. O RH acompanha o dia em tempo real, trata ajustes sem apagar nenhuma marcação e fecha o mês com relatório de saldo e os arquivos oficiais.",
    publico: ["Colaborador", "Gestor", "RH", "Equipes CLT"],
    numeros: [
      { valor: "1 toque", rotulo: "para registrar a batida" },
      { valor: "AFD + AEJ", rotulo: "nos leiautes oficiais" },
      { valor: "0", rotulo: "marcações apagadas em ajustes" },
    ],
    destaques: [
      { icone: Smartphone, titulo: "Sem relógio e sem aplicativo", texto: "Funciona no navegador. A pessoa entra com e-mail ou CPF, e a tela já mostra qual é a próxima batida." },
      { icone: Receipt, titulo: "Comprovante a cada batida", texto: "Cada registro gera um comprovante em PDF. Uma vez por dia, o colaborador recebe o resumo por e-mail." },
      { icone: Activity, titulo: "Painel do dia em tempo real", texto: "Quem está trabalhando, quem está no almoço, quem ainda não bateu e quem chegou atrasado." },
      { icone: FilePen, titulo: "Ajustes sem apagar nada", texto: "O colaborador pede a correção com motivo e anexo. A marcação original fica guardada, e o ajuste registra quem fez e por quê." },
      { icone: FileCheck2, titulo: "Arquivos da fiscalização", texto: "AFD e AEJ gerados pelo sistema, com numeração sequencial (NSR) que nunca se repete." },
      { icone: HeartPulse, titulo: "Um cuidado a mais com a equipe", texto: "Check-in de humor opcional e sigiloso. Quando o desânimo se repete, o RH recebe um aviso para se aproximar com discrição." },
    ],
    grupos: [
      {
        titulo: "Registro",
        itens: [
          { titulo: "Ponto pelo navegador", texto: "No celular ou no computador, com login por e-mail ou CPF." },
          { titulo: "Foto e localização opcionais", texto: "A empresa decide. As fotos ficam visíveis só para o dono e para o RH." },
          { titulo: "Nenhuma batida é recusada", texto: "Como pede a Portaria. Batidas extras entram como marcações adicionais." },
          { titulo: "Comprovante e resumo diário", texto: "PDF a cada batida e e-mail diário com as marcações do dia." },
        ],
      },
      {
        titulo: "Gestão do RH",
        itens: [
          { titulo: "Painel do dia", texto: "Situação da equipe em tempo real, com pendências e atrasos." },
          { titulo: "Pedidos de ajuste", texto: "Com motivo e anexo. RH ou gestor aprova ou recusa." },
          { titulo: "Relatório com saldo", texto: "Horas previstas, trabalhadas e saldo, com exportação para planilha." },
          { titulo: "Equipe, setores e cargos", texto: "Ficha cadastral completa e permissões por perfil." },
        ],
      },
      {
        titulo: "Jornada",
        itens: [
          { titulo: "Jornadas por pessoa", texto: "Horários por dia da semana e tolerância configurada." },
          { titulo: "Feriados", texto: "Nacionais carregados automaticamente. Estaduais e municipais cadastrados pela empresa." },
          { titulo: "Ausências e banco de horas", texto: "Faltas, DSR, folgas compensatórias e lançamentos de banco de horas." },
        ],
      },
      {
        titulo: "Segurança e LGPD",
        itens: [
          { titulo: "Registros encadeados", texto: "Cada marcação recebe um código calculado a partir da anterior. Uma alteração é detectada." },
          { titulo: "Trilha de auditoria", texto: "Tudo o que o RH faz fica registrado: quem, quando, o quê e de onde." },
          { titulo: "Aviso de LGPD", texto: "Ciência registrada na primeira batida e prazo de guarda das fotos definido pela empresa." },
          { titulo: "Suporte dentro do sistema", texto: "Chamados direto com a equipe da Solute RH." },
        ],
      },
    ],
    perguntas: [
      { p: "O Solute Ponto é homologado?", r: "Ele foi construído sobre os requisitos da Portaria 671/2021 para ponto por programa (REP-P) e já gera AFD e AEJ nos leiautes oficiais. O registro no INPI e a validação oficial junto ao Ministério do Trabalho estão em andamento. Explicamos a situação atual com transparência na apresentação." },
      { p: "Precisa de relógio de ponto ou aplicativo?", r: "Não. Funciona no navegador de qualquer celular ou computador com internet." },
      { p: "A foto na batida é reconhecimento facial?", r: "Não. A foto é opcional e fica guardada junto da marcação para o RH conferir, com acesso restrito." },
      { p: "O sistema calcula hora extra e adicional noturno?", r: "O Solute Ponto entrega horas previstas, trabalhadas e saldo. Hora extra e adicional noturno continuam sendo calculados na folha de pagamento." },
    ],
    nota: "O Solute Ponto foi construído sobre os requisitos da Portaria 671/2021 (REP-P). O registro do programa no INPI e a validação oficial junto ao Ministério do Trabalho estão em andamento.",
    chamadas: [
      { icone: Smartphone, titulo: "Ponto em 1 toque", texto: "A tela já mostra a próxima batida." },
      { icone: MapPin, titulo: "Foto e geolocalização", texto: "Na batida, quando a empresa ativa." },
      { icone: Receipt, titulo: "Comprovante a cada batida", texto: "Em PDF, no histórico da pessoa." },
      { icone: FileCheck2, titulo: "AFD e AEJ oficiais", texto: "Prontos para a fiscalização." },
    ],
    mensagem: "Olá! Quero conhecer o Solute Ponto.",
  },
  {
    slug: "recruta",
    nome: "Solute Recruta",
    sufixo: "Recruta",
    icone: UserSearch,
    logo: "/assets/solute-recruta-cor.svg",
    resumo: "Recrutamento e seleção por competências, da requisição ao parecer.",
    publicoCurto: "Consultorias de R&S",
    titulo: "A requisição vira perfil ideal, o perfil vira roteiro, e a entrevista vira parecer.",
    descricao:
      "O Solute Recruta conduz o processo seletivo inteiro da consultoria, do pedido do cliente ao relatório final. Cada nota mostra a evidência que a gerou, e a decisão continua sempre com a recrutadora.",
    publico: ["Consultorias de R&S", "Recrutadoras", "Gestores de consultoria"],
    numeros: [
      { valor: "7", rotulo: "etapas, da requisição ao parecer" },
      { valor: "5", rotulo: "questionários comportamentais" },
      { valor: "16", rotulo: "etapas no funil de candidatos" },
    ],
    destaques: [
      { icone: FileText, titulo: "Requisição por link", texto: "O cliente preenche a requisição por um link, ou o sistema lê o descritivo de cargo que ele mandou." },
      { icone: ScanText, titulo: "Currículos sem digitação", texto: "Leitura automática de PDF, Word e outros formatos. A pasta de currículos do e-mail vira o processo inteiro." },
      { icone: Scale, titulo: "Match explicável", texto: "Nota por critério com a evidência ao lado. \"Não identificado\" não é \"não atende\", e ninguém é eliminado automaticamente." },
      { icone: Brain, titulo: "Questionários comportamentais", texto: "DISC, Cinco Grandes Fatores, motivadores, fit cultural e preferências de tipo, enviados por link." },
      { icone: ScrollText, titulo: "Parecer pronto para o cliente", texto: "Texto corrido, sem notas nem percentuais, gerado a partir da análise e editável antes do envio." },
      { icone: Gauge, titulo: "Prazos e indicadores", texto: "SLA combinado com o cliente, conversão do funil e resumo de status pronto para o e-mail semanal." },
    ],
    grupos: [
      {
        titulo: "Abertura e divulgação",
        itens: [
          { titulo: "Perfil ideal", texto: "Competências com peso, senioridade, alvo comportamental e cultural." },
          { titulo: "Régua por vaga", texto: "Pesos, notas de corte, testes e etapas configuráveis em cada processo." },
          { titulo: "Anúncio por canal", texto: "LinkedIn, Catho, InfoJobs, Indeed, WhatsApp, Instagram e abordagem direta." },
          { titulo: "Link de candidatura", texto: "O candidato preenche um formulário sobre as próprias experiências, uma pergunta por vez, e o match fica mais assertivo. Vaga confidencial e PCD." },
        ],
      },
      {
        titulo: "Avaliação",
        itens: [
          { titulo: "Triagem por critério", texto: "Obrigatórios, desejáveis, experiência, formação, localização e remuneração." },
          { titulo: "Entrevista por competências", texto: "Roteiro no método STAR, com o que observar em cada resposta." },
          { titulo: "Análise cruzada", texto: "Aponta inconsistências, padrões e riscos entre currículo, entrevista e testes." },
          { titulo: "Ajuste com justificativa", texto: "A recrutadora pode mudar a nota, e o motivo fica registrado." },
        ],
      },
      {
        titulo: "Acompanhamento",
        itens: [
          { titulo: "Funil e quadro livre", texto: "16 etapas padrão e um quadro em que a recrutadora cria colunas como \"ligar hoje\"." },
          { titulo: "Comunicação com o candidato", texto: "Convite, retorno positivo e negativo, com histórico por canal." },
          { titulo: "Painel de pendências", texto: "Separa o que depende da consultora do que espera o cliente ou o candidato." },
          { titulo: "Banco de talentos", texto: "Ao abrir uma vaga, sugere quem já está no banco com match de 84 ou mais." },
        ],
      },
      {
        titulo: "Equipe da consultoria",
        itens: [
          { titulo: "Permissões por cargo", texto: "Quem vê todos os processos, define a régua, ajusta nota ou emite parecer." },
          { titulo: "Processos da equipe", texto: "Visão do gestor sobre a carga e os prazos de cada recrutadora." },
          { titulo: "Página de talentos", texto: "Link público para quem quer trabalhar na própria consultoria." },
        ],
      },
    ],
    perguntas: [
      { p: "O Solute Recruta usa inteligência artificial para escolher candidatos?", r: "Não. Ele usa um motor de análise com regras claras, e cada nota mostra a evidência que a gerou. Nenhum candidato é eliminado automaticamente. A decisão é sempre da recrutadora." },
      { p: "Serve para o RH interno de uma empresa?", r: "Ele foi desenhado para a rotina de consultorias de recrutamento e seleção, que atendem empresas clientes com requisição, parecer e relatório. Fale com a gente para avaliar o seu caso." },
      { p: "Os testes são psicológicos?", r: "Não. São questionários de autopercepção que ajudam a conversa da entrevista. Eles não geram diagnóstico." },
      { p: "O cliente precisa ter acesso ao sistema?", r: "Não. Ele preenche a requisição por link e recebe parecer, relatório e resumo de status." },
    ],
    chamadas: [
      { icone: Scale, titulo: "Match com evidência", texto: "Clique num candidato e veja o porquê." },
      { icone: Users, titulo: "Ninguém eliminado sozinho", texto: "A decisão é sempre da recrutadora." },
      { icone: ScrollText, titulo: "Parecer para o cliente", texto: "Gerado da análise, pronto para editar." },
    ],
    mensagem: "Olá! Quero conhecer o Solute Recruta.",
  },
  {
    slug: "forms",
    nome: "Solute Forms",
    sufixo: "Forms",
    icone: ClipboardList,
    resumo: "Formulários de uma pergunta por tela, com resultados que mostram onde as pessoas desistem.",
    publicoCurto: "RH, marketing e comercial",
    titulo: "Uma pergunta por tela, e você vê onde cada pessoa parou.",
    descricao:
      "Monte pesquisas, inscrições e formulários de captação que parecem uma conversa. Quem responde não precisa de login. Você acompanha a taxa de conclusão, a desistência pergunta a pergunta e trata cada resposta num Kanban.",
    publico: ["Pesquisa de clima", "Captação de leads", "Inscrições", "Campanhas"],
    numeros: [
      { valor: "17", rotulo: "tipos de pergunta" },
      { valor: "3", rotulo: "visões de resultado + Kanban" },
      { valor: "UTM", rotulo: "origem de cada resposta" },
    ],
    destaques: [
      { icone: ListChecks, titulo: "17 tipos de pergunta", texto: "Múltipla escolha, escolha por imagem, estrelas, escala de opinião, matriz, data, telefone, upload e outros." },
      { icone: Paintbrush, titulo: "Abertura e encerramento do seu jeito", texto: "Telas de boas-vindas e de agradecimento personalizadas, com redirecionamento no final." },
      { icone: QrCode, titulo: "Link, QR code e UTM", texto: "Compartilhe por link ou QR code e saiba de qual canal e campanha veio cada resposta." },
      { icone: Save, titulo: "Respostas parciais guardadas", texto: "Quem abandona no meio não some. Você vê o que a pessoa respondeu e onde parou." },
      { icone: Table2, titulo: "Resultados em três visões", texto: "Resumo com conclusão e tempo médio, tabela tipo planilha e caixa de entrada." },
      { icone: Kanban, titulo: "Kanban das respostas", texto: "Mova cada respondente por etapas de atendimento. Útil para leads e inscritos." },
    ],
    grupos: [
      {
        titulo: "Construtor",
        itens: [
          { titulo: "Prévia editável", texto: "Construtor em três colunas, com a pergunta aparecendo como o respondente vai ver." },
          { titulo: "Regras por pergunta", texto: "Obrigatória, embaralhar opções, limite de escolhas, opção \"Outro\", mínimo e máximo." },
          { titulo: "Sem repetição", texto: "Bloqueio de e-mail ou telefone repetido." },
          { titulo: "Rascunho, publicado ou fechado", texto: "Duplique formulários prontos e controle quando aceitam respostas." },
        ],
      },
      {
        titulo: "Resultados",
        itens: [
          { titulo: "Resumo", texto: "Visualizações, inícios, respostas, taxa de conclusão e tempo médio." },
          { titulo: "Desistência por pergunta", texto: "Mostra exatamente onde as pessoas abandonam o formulário." },
          { titulo: "Filtro por dispositivo", texto: "Desktop, celular ou tablet." },
          { titulo: "Caixa de entrada", texto: "Cada resposta marcada como completa ou parcial." },
        ],
      },
      {
        titulo: "Equipe",
        itens: [
          { titulo: "Quem pode editar", texto: "Formulário aberto a toda a equipe com permissão ou restrito a pessoas escolhidas." },
          { titulo: "Integrado ao Solute Gestão", texto: "Também vem dentro do Gestão, com formulários internos anônimos e agendados." },
          { titulo: "Em breve", texto: "Análise de sentimento e palavras-chave nas respostas de texto." },
        ],
      },
    ],
    perguntas: [
      { p: "Quem responde precisa criar conta?", r: "Não. A pessoa abre o link ou lê o QR code e responde, no celular ou no computador." },
      { p: "Dá para usar em pesquisa de clima?", r: "Sim. E dentro do Solute Gestão existe o formulário interno, que pode ser anônimo de verdade: o sistema não guarda quem respondeu." },
      { p: "O que acontece com quem não termina?", r: "As respostas parciais ficam guardadas, e o resumo mostra em qual pergunta cada pessoa parou." },
    ],
    nota: "O Solute Forms também vem dentro do Solute Gestão. Em breve: análise de sentimento e palavras-chave nas respostas de texto.",
    chamadas: [
      { icone: ListChecks, titulo: "Uma pergunta por tela", texto: "Quem responde chega até o fim." },
      { icone: Table2, titulo: "Desistência por pergunta", texto: "Veja onde as pessoas param." },
      { icone: Kanban, titulo: "Kanban das respostas", texto: "Dê seguimento a cada pessoa." },
    ],
    mensagem: "Olá! Quero conhecer o Solute Forms.",
  },
];

export const porSlug = (slug: string) => produtos.find((p) => p.slug === slug);

export const pilares: Bloco[] = [
  { icone: Users, titulo: "Feito por quem vive RH", texto: "Cada sistema nasceu de um problema que a equipe da Solute RH resolvia na mão, todos os dias, nos clientes." },
  { icone: Smartphone, titulo: "Intuitivo desde o primeiro dia", texto: "Telas em português claro e o próximo passo sempre à vista. Roda no navegador e no celular, sem nada para instalar." },
  { icone: Lock, titulo: "Dados protegidos", texto: "Cada empresa acessa só os próprios dados, as senhas são criptografadas e as ações ficam registradas." },
  { icone: MessageCircle, titulo: "Suporte de gente", texto: "Quem atende é a própria equipe da Solute RH, que conhece a rotina de RH por dentro." },
];

export const perguntasGerais: Pergunta[] = [
  { p: "Preciso contratar os quatro sistemas?", r: "Não. Cada sistema é contratado separadamente. Você começa pelo que resolve a dor mais urgente e soma os outros quando fizer sentido." },
  { p: "Quanto custa?", r: "O valor depende do tamanho da equipe e dos módulos que a sua empresa vai usar. Chame a equipe no WhatsApp para receber uma proposta personalizada." },
  { p: "Preciso instalar algum aplicativo?", r: "Não. Todos os sistemas funcionam no navegador, no computador ou no celular. Basta ter internet." },
  { p: "Como ficam os dados da minha equipe?", r: "Cada empresa só acessa os próprios dados, as senhas são guardadas criptografadas e as ações do RH ficam registradas. Os sistemas seguem a LGPD." },
  { p: "Como é a implantação?", r: "A gente entende a rotina da sua empresa, configura o sistema com os seus setores, cargos e permissões e acompanha a equipe nas primeiras semanas." },
  { p: "Quem dá suporte?", r: "A própria equipe da Solute RH, por WhatsApp e, no Solute Ponto, também por chamado dentro do sistema." },
];
