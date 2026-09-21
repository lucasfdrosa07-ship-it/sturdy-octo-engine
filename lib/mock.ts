// ============================================================
// Aura — dados mockados (camada visual, sem backend real)
// Data de referência: segunda-feira, 21/09/2026
// ============================================================

export const brl = (n: number) =>
  "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmt = (n: number) => n.toLocaleString("pt-BR");

export const USER = {
  name: "Rafael Souza",
  first: "Rafael",
  email: "rafael.souza@gmail.com",
  phone: "+55 51 99876-5432",
  birth: "14/03/1994",
  city: "Porto Alegre, RS",
};

// ---------------- Planos ----------------
export const PLANS: any = {
  free: {
    id: "free", name: "Free", price: 0, priceLabel: "R$ 0",
    credits: 1000, creditsLabel: "1.000 créditos/mês",
    models: "Aura Lite", memory: "Até 50 memórias", integr: "Até 3 integrações",
    autos: "Até 2 automações", storage: "1 GB de armazenamento",
  },
  plus: {
    id: "plus", name: "Plus",
    tiers: [ { c: 5000, p: 29.9 }, { c: 10000, p: 39.9 }, { c: 15000, p: 49.9 }, { c: 20000, p: 59.9 } ],
    models: "Aura Lite + Aura Standard", memory: "Até 500 memórias", integr: "Até 10 integrações",
    autos: "Até 10 automações", storage: "20 GB de armazenamento",
  },
  pro: {
    id: "pro", name: "Pro",
    tiers: [ { c: 10000, p: 69.9 }, { c: 20000, p: 89.9 }, { c: 30000, p: 109.9 }, { c: 40000, p: 129.9 }, { c: 50000, p: 149.9 } ],
    models: "Todos os modelos", memory: "Memórias ilimitadas", integr: "Integrações ilimitadas",
    autos: "Automações ilimitadas", storage: "200 GB de armazenamento",
  },
};

// ---------------- Conversas ----------------
type M = any;
const u = (text: string, t = "—"): M => ({ role: "u", text, t });
const a = (text: string, extra: M = {}): M => ({ role: "a", text, t: "—", ...extra });

export const CONVS: M[] = [
  {
    id: "c1", title: "Resumo do dia", preview: "Você tem um dia cheio… 4 compromissos e 2 pagamentos próximos.",
    date: "2026-09-21", time: "09:12", pin: true, tools: ["Google Calendar", "Gmail", "Financeiro"],
    msgs: [
      u("Bruce, me diga o que eu tenho para fazer hoje, se existe algum e-mail importante e se tenho algum pagamento vencendo.", "09:12"),
      a(
        "Você tem um dia cheio, Rafael. Aqui está o que importa:\n\n• 4 compromissos hoje, começando com a reunião do time às 9h — a pauta já está no seu Notion.\n• 3 e-mails novos. O mais relevante é o do Carlos sobre o deploy da v2.4: ele pede retorno até o fim da manhã.\n• 2 pagamentos próximos: Netflix (R$ 44,90, vence amanhã) e Enel (R$ 180,32, vence sexta). O fatura do cartão (R$ 1.240,18) está 6 dias em atraso — vale priorizar.\n\nSugestão: responda o Carlos antes da reunião. Quer que eu prepare um rascunho?",
        {
          t: "09:12",
          tools: [
            { icon: "Brain", label: "Entendendo sua solicitação", state: "ok", result: "Contexto carregado", detail: ["Perfil, memórias e dados financeiros consultados"] },
            { icon: "CalendarDays", label: "Google Calendar", state: "ok", result: "4 compromissos encontrados", detail: ["09:00 — Reunião diária com o time (Meet)", "11:30 — Almoço com a Ana (reservado)", "15:00 — Review do sprint", "19:00 — Aulas de espanhol"] },
            { icon: "Mail", label: "Gmail", state: "ok", result: "3 e-mails relevantes encontrados", detail: ["Carlos TechCorp — “Deploy da v2.4” (novo)", "Ana Souza — “Bolo de aniversário” (novo)", "Enel — “Lembrete de pagamento” (novo)"] },
            { icon: "Wallet", label: "Financeiro", state: "ok", result: "2 pagamentos próximos", detail: ["Enel — R$ 180,32 — vence 24/09 (3 dias)", "Netflix — R$ 44,90 — vence 23/09 (2 dias)"] },
            { icon: "StickyNote", label: "Suas notas", state: "ok", result: "1 informação relevante encontrada", detail: ["“Lista de presentes — aniversário da Ana” atualizada há 2 semanas"] },
            { icon: "NotionIcon", label: "Notion", state: "err", result: "Falha ao autenticar", errMsg: "Não consegui acessar o Notion. O token expirou.", detail: null },
          ],
          mem: ["Respostas diretas, sem rodeios", "Ana — esposa, aniversário 30/09", "Reuniões pela manhã"],
          ctx: { mem: 3, integ: 2, files: 1, acts: 1 },
        }
      ),
      u("Pode deixar. E o que não deu para consultar no Notion?", "09:14"),
      a("A conexão do Notion expirou por isso não consegui puxar as pautas do projeto. Você pode reconectar em Integrações (ou pelo botão acima). Enquanto isso, tudo o que veio do Calendar, Gmail e do Financeiro está confirmado.", { t: "09:14", ctx: { mem: 1, integ: 0, files: 0, acts: 0 } }),
    ],
  },
  {
    id: "c2", title: "Aniversário da Ana", preview: "Evento criado: Aniversário da Ana, 30/09, 19h–22h.",
    date: "2026-09-20", time: "16:40", pin: true, tools: ["Google Calendar", "Gmail"],
    msgs: [
      u("Agenda um evento no meu calendário para o aniversário da Ana: 30 de setembro, das 19h às 22h.", "16:40"),
      a("", {
        t: "16:40",
        tools: [
          { icon: "CalendarDays", label: "Google Calendar", state: "ok", result: "Slot 30/09 19h–22h livre", detail: ["Sem conflitos com compromissos existentes"] },
        ],
        confirm: {
          title: "Criar evento no Google Calendar",
          preview: "“Aniversário da Ana” — 30/09/2026 · 19h–22h · Local: Churrascaria Gaúcha (reservar 2 lugares)",
          state: "pending",
          done: "Evento criado: Aniversário da Ana, 30/09, 19h–22h.",
        },
        ctx: { mem: 2, integ: 1, files: 0, acts: 0 },
        mem: ["Ana — esposa, aniversário 30/09", "Gosto de comemorações intimistas"],
      }),
      a("Tá feito. Também encontrei uma churrascaria bem avaliada a 10 minutos de casa, com mesas disponíveis no dia 30. Quer que eu envie a solicitação de reserva?", { t: "16:41", ctx: { mem: 1, integ: 0, files: 0, acts: 0 } }),
    ],
  },
  {
    id: "c3", title: "Análise de gastos de agosto", preview: "Moradia foi 42% dos seus gastos em agosto…",
    date: "2026-09-20", time: "11:05", pin: false, tools: ["Financeiro"],
    msgs: [
      u("Analisa meus gastos de agosto? Tem algum padrão que eu deva mudar?", "11:05"),
      a(
        "Em agosto você gastou R$ 4.284,90. Os principais blocos:\n\nMoradia pesa 42% dos gastos — é a maior fatia, mas é fixa. O que chama atenção é alimentação fora de casa (R$ 612,40), que subiu 38% vs. julho, quase todo em cafeterias e iFood.\n\nSe quiser, reduzo esse bloco criando lembretes de marmita às segundas e quintas.",
        {
          t: "11:05",
          tools: [
            { icon: "Wallet", label: "Financeiro", state: "ok", result: "38 lançamentos encontrados", detail: ["31 gastos classificados", "4 recebimentos", "3 lançamentos sem categoria (posso sugerir)"] },
          ],
          list: [
            { label: "Moradia", v: "R$ 1.800,00", pct: 42 },
            { label: "Mercado", v: "R$ 1.120,40", pct: 26 },
            { label: "Alimentação fora", v: "R$ 612,40", pct: 14 },
            { label: "Transporte", v: "R$ 388,10", pct: 9 },
            { label: "Assinaturas", v: "R$ 151,00", pct: 4 },
            { label: "Outros", v: "R$ 213,00", pct: 5 },
          ],
          ctx: { mem: 2, integ: 0, files: 0, acts: 0 },
        }
      ),
      u("Manda um e-mail para mim mesmo com esse resumo para eu guardar.", "11:07"),
      a("", {
        t: "11:07",
        confirm: {
          title: "Enviar e-mail (ação sensível)",
          preview: "Para: rafael.souza@gmail.com · Assunto: Resumo de gastos — agosto/2026 · Corpo: resumo com 6 linhas e tabela por categoria",
          state: "pending",
          done: "E-mail enviado para sua caixa de entrada.",
        },
      }),
    ],
  },
  {
    id: "c4", title: "Créditos do plano", preview: "Você já usou todos os créditos do mês…",
    date: "2026-09-19", time: "20:31", pin: false, tools: [],
    limit: true,
    msgs: [
      u("Quantos créditos eu ainda tenho este mês?", "20:31"),
      a("Você já usou os 10.000 créditos do plano Plus neste ciclo (7.412 via chat e 2.588 via automações). O consumo das automações corresponde a ~26% do total — é o gasto previsível que você definiu.\n\nOs créditos renovam em 12/10. Se quiser, posso simular como ficaria o consumo no plano Pro com 20.000 créditos.", { t: "20:31", ctx: { mem: 1, integ: 0, files: 0, acts: 0 } }),
    ],
  },
  { id: "c5", title: "Roteiro da reunião da equipe", preview: "Montei o roteiro em 5 blocos de 10 minutos.", date: "2026-09-18", time: "08:52", pin: false, tools: ["Notion"],
    msgs: [ u("Monta um roteiro para a reunião de segunda com a equipe de produto.", "08:52"), a("Montei o roteiro em 5 blocos de 10 minutos: alinhamento do sprint, métricas da v2.3, blockers, priorização da v2.4 e decisões. Salvei uma cópia nas suas notas. Quer ajustar algum bloco?", { t: "08:52", ctx: { mem: 1, integ: 1, files: 1, acts: 1 } }) ] },
  { id: "c6", title: "Resumo de e-mails da semana", preview: "12 e-mails importantes: 3 exigem resposta.", date: "2026-09-17", time: "08:01", pin: false, tools: ["Gmail"],
    msgs: [ u("Resuma meus e-mails não lidos da semana.", "08:01"), a("São 12 e-mails relevantes: 3 pedem resposta (Carlos, Enel, e a universidade sobre o curso da Ana), 5 são cobranças e notificações, 4 promoções e 1 convite para evento no centro. Os 3 urgentes estão no detalhe acima.", { t: "08:01", ctx: { mem: 1, integ: 1, files: 0, acts: 0 } }) ] },
  { id: "c7", title: "Ideias para o app de finanças", preview: "Sugiro começar com o dashboard de categorias…", date: "2026-09-16", time: "22:15", pin: false, tools: [],
    msgs: [ u("Estou pensando num app simples de finanças para mim e a Ana. Me ajuda a organizar as ideias?", "22:15"), a("Organizei em 3 pilares: (1) dashboard de gastos por categoria com meta mensal, (2) faturas compartilhadas com lembretes, (3) “meta do casal” — poupança com progresso visível. Começaria pelo 1 e 2, que resolvem 80% da dor. Posso salvar isso como nota estruturada?", { t: "22:15", ctx: { mem: 2, integ: 0, files: 0, acts: 1 } }) ] },
  { id: "c8", title: "Comparar planos de internet", preview: "A Vivo Fibra sai 12% mais barata que a Oi…", date: "2026-09-16", time: "14:22", pin: false, tools: [],
    msgs: [ u("Compara o custo dos planos de internet de 500 MBP em Porto Alegre.", "14:22"), a("Com base nos preços públicos: Vivo Fibra R$ 99,90, Oi R$ 112,00 e Claro R$ 109,90. Considerando seu uso atual (~60% do link), a Vivo é a melhor relação. Quer que eu anote a data para renegociar a renovação?", { t: "14:22", ctx: { mem: 0, integ: 0, files: 0, acts: 0 } }) ] },
  { id: "c9", title: "Lista de compras do mês", preview: "Consolidei as compras de 4 mercados em uma lista.", date: "2026-09-15", time: "19:47", pin: false, tools: ["Google Drive"],
    msgs: [ u("Consolida as fotos de notas de mercado que subi no Drive em uma lista de compras do mês.", "19:47"), a("Consolidei 4 notas em uma lista de 23 itens. Itens que se repetiram 2x ou mais (arroz, feijão, café) ganham sugestão de compra em maior volume, o que rende ~9% de economia por mês. Salvei como nota.", { t: "19:47", ctx: { mem: 1, integ: 1, files: 4, acts: 1 } }) ] },
  { id: "c10", title: "Dúvida sobre fatura do cartão", preview: "O limite disponível cobre a fatura integral…", date: "2026-09-12", time: "10:12", pin: false, tools: ["Financeiro"],
    msgs: [ u("Consigo pagar a fatura do Banrisul em duas vezes e não pago juros?", "10:12"), a("Se pagar o mínimo, sim — mas o rotativo jura ~7% a.m. Melhor cenário: parcela em 2x sem juros até 28/10. Com seu salário de 03/09 e o freelance de 12/09, a primeira parcela entra sem aperto. Deixei um lembrete para o dia 20.", { t: "10:12", ctx: { mem: 2, integ: 0, files: 1, acts: 1 } }) ] },
  { id: "c11", title: "Resumo da reunião de segunda", preview: "3 decisões principais: prazo da v2.4…", date: "2026-09-08", time: "10:05", pin: false, tools: ["Notion"],
    msgs: [ u("Resumo o que ficou decidido na reunião de segunda?", "10:05"), a("3 decisões principais: (1) prazo da v2.4 movido para 04/10, (2) o feature flag do checkout fica ativo só para 10% dos usuários, (3) você apresenta o progresso na sexta. 2 ações ficaram com você, e estão nas suas notas.", { t: "10:05", ctx: { mem: 1, integ: 1, files: 1, acts: 0 } }) ] },
  { id: "c12", title: "Apresentação de portfólio", preview: "Reorganizei em 3 projetos em destaque…", date: "2026-09-05", time: "15:30", pin: false, tools: [],
    msgs: [ u("Me ajuda a reorganizar minha apresentação de portfólio para a entrevista na quinta?", "15:30"), a("Reorganizei em 3 projetos em destaque com o formato problema → ação → resultado. Sugiro abrir com o app de logística (maior impacto: -22% de tempo de despacho). Quer que eu monte os slides do roteiro de fala?", { t: "15:30", ctx: { mem: 1, integ: 0, files: 2, acts: 0 } }) ] },
  { id: "c13", title: "Presente de aniversário da Ana", preview: "Opções entre R$ 400 e R$ 1.200…", date: "2026-09-02", time: "17:18", pin: false, tools: [],
    msgs: [ u("Ideias de presente para a Ana? Ela faz aniversário em 30 de setembro.", "17:18"), a("Considerando o que ela comentou (álbum de fotos e viagem), minha sugestão: álbum impresso de 2025 (R$ 350) + experiência de final de semana. Ficou dentro do orçamento de R$ 1.200 que você anotou na lista. Deixei tudo na nota “Lista de presentes”.", { t: "17:18", ctx: { mem: 2, integ: 0, files: 1, acts: 0 } }) ] },
  { id: "c14", title: "Organizar arquivos do Drive", preview: "Sugiro 5 pastas raiz: Trabalho, Pessoal…", date: "2026-08-28", time: "21:04", pin: false, tools: ["Google Drive"],
    msgs: [ u("Meu Drive tá um caos. Como organizo?", "21:04"), a("Sugiro 5 pastas raiz: Trabalho, Pessoal, Finanças, Documentos e Arquivos para reciclar (328 MB). Encontrei 14 duplicatas que podem liberar ~40 MB. Posso criar a estrutura se você autorizar.", { t: "21:04", ctx: { mem: 1, integ: 1, files: 12, acts: 0 } }) ] },
  { id: "c15", title: "Entendendo créditos de IA", preview: "Créditos são a unidade de uso da inteligência…", date: "2026-08-15", time: "09:33", pin: false, tools: [],
    msgs: [ u("Como funcionam os créditos aqui?", "09:33"), a("Créditos são a unidade de uso da inteligência. Cada mensagem e cada ação consome de acordo com o modelo e as ferramentas acionadas. No seu plano Plus (10.000/mês), o consumo via chat e via automações aparece separado — automações são o gasto previsível, renovado todo mês.", { t: "09:33", ctx: { mem: 0, integ: 0, files: 0, acts: 0 } }) ] },
  { id: "c16", title: "Boas-vindas ao Aura", preview: "Fala, Rafael! Sou o Bruce…", date: "2026-08-01", time: "10:02", pin: false, tools: [],
    msgs: [ u("Oi! O que você sabe sobre mim?", "10:02"), a("Fala, Rafael! Sou o Bruce. Sei que você mora em Porto Alegre, trabalha como dev front-end na TechCorp e prefere respostas diretas. À medida que conversarmos, vou memorizar o que for relevante — e você pode revisar tudo em Personalização → Memória a qualquer momento.", { t: "10:02", ctx: { mem: 3, integ: 0, files: 0, acts: 0 } }) ] },
];

// ---------------- Integrações ----------------
export const INTEGRATIONS: any[] = [
  { id: "gmail", name: "Gmail", cat: "Comunicação", desc: "Consulte, resuma e envie e-mails.", status: "connected", sync: "há 5 min", color: "#EA4335", dark: true,
    canDo: ["Consultar e-mails não lidos", "Resumir conversas e destacar o importante", "Rascunhar respostas", "Enviar e-mails (com confirmação)"],
    perms: [ { id: "r", l: "Somente leitura", s: ["gmail.readonly"] }, { id: "rw", l: "Ler e enviar", s: ["gmail.readonly", "gmail.send"] }, { id: "rwd", l: "Ler, enviar e excluir", s: ["gmail.modify"] } ], perm: "rw" },
  { id: "cal", name: "Google Calendar", cat: "Produtividade", desc: "Consulte a agenda e crie compromissos.", status: "connected", sync: "há 2 min", color: "#4285F4",
    canDo: ["Listar e consultar eventos", "Detectar conflitos de agenda", "Criar eventos (com confirmação)", "Editar eventos existentes"],
    perms: [ { id: "v", l: "Visualizar eventos", s: ["calendar.readonly"] }, { id: "ce", l: "Criar e editar eventos", s: ["calendar.events"] }, { id: "cde", l: "Criar, editar e excluir", s: ["calendar.events", "calendar.delete"] } ], perm: "ce" },
  { id: "drive", name: "Google Drive", cat: "Armazenamento", desc: "Pesquise arquivos e documentos.", status: "connected", sync: "há 1 h", color: "#F4B400", dark: true,
    canDo: ["Pesquisar arquivos por nome e conteúdo", "Listar arquivos recentes", "Ler documentos compatíveis"],
    perms: [ { id: "sr", l: "Pesquisar e visualizar", s: ["drive.readonly"] }, { id: "srw", l: "Pesquisar, visualizar e modificar", s: ["drive.file"] }, { id: "srd", l: "Acesso completo (inclui exclusão)", s: ["drive"] } ], perm: "sr" },
  { id: "notion", name: "Notion", cat: "Produtividade", desc: "Acesse páginas, bases e pautas.", status: "expired", sync: "há 3 dias", color: "#191919",
    canDo: ["Ler páginas e bases de dados", "Resumir documentos de projeto", "Criar notas (com confirmação)"],
    perms: [ { id: "r", l: "Somente leitura", s: ["notion.read"] }, { id: "rw", l: "Ler e criar", s: ["notion.read", "notion.create"] } ], perm: "r" },
  { id: "github", name: "GitHub", cat: "Dev", desc: "Issues, pull requests e deploys.", status: "off", sync: null, color: "#24292F",
    canDo: ["Listar issues e PRs abertos", "Resumir status de deploys", "Comentar em issues (com confirmação)"],
    perms: [ { id: "r", l: "Somente leitura", s: ["repo:read", "issues:read"] }, { id: "rw", l: "Ler e comentar", s: ["repo:read", "issues:write"] } ], perm: "r" },
  { id: "slack", name: "Slack", cat: "Comunicação", desc: "Mensagens e canais do trabalho.", status: "off", sync: null, color: "#611F69",
    canDo: ["Consultar mensagens não lidas", "Resumir conversas de canais"],
    perms: [ { id: "r", l: "Somente leitura", s: ["channels:history"] }, { id: "rw", l: "Ler e enviar", s: ["channels:history", "chat:write"] } ], perm: "r" },
  { id: "trello", name: "Trello", cat: "Produtividade", desc: "Quadros, cartões e tarefas.", status: "off", sync: null, color: "#0079BF",
    canDo: ["Listar cartões por prazo", "Criar cartões (com confirmação)"],
    perms: [ { id: "r", l: "Somente leitura", s: ["board:read"] }, { id: "rw", l: "Ler e criar", s: ["board:read", "board:write"] } ], perm: "r" },
  { id: "dropbox", name: "Dropbox", cat: "Armazenamento", desc: "Arquivos e backups na nuvem.", status: "off", sync: null, color: "#0061FF",
    canDo: ["Pesquisar arquivos", "Listar downloads recentes"],
    perms: [ { id: "r", l: "Somente leitura", s: ["files.read"] } ], perm: "r" },
  { id: "linear", name: "Linear", cat: "Dev", desc: "Issues e ciclos do time de produto.", status: "off", sync: null, color: "#5E6AD2",
    canDo: ["Listar issues do ciclo", "Resumir progresso do sprint"],
    perms: [ { id: "r", l: "Somente leitura", s: ["linear:read"] } ], perm: "r" },
  { id: "todoist", name: "Todoist", cat: "Produtividade", desc: "Tarefas e lembretes pessoais.", status: "off", sync: null, color: "#DC6B2F",
    canDo: ["Listar tarefas do dia", "Criar tarefas (com confirmação)"],
    perms: [ { id: "r", l: "Somente leitura", s: ["task:read"] }, { id: "rw", l: "Ler e criar", s: ["task:read", "task:write"] } ], perm: "r" },
  { id: "figma", name: "Figma", cat: "Dev", desc: "Arquivos e protótipos de design.", status: "off", sync: null, color: "#A259FF",
    canDo: ["Listar arquivos recentes", "Comentar em frames (com confirmação)"],
    perms: [ { id: "r", l: "Somente leitura", s: ["file:read"] } ], perm: "r" },
  { id: "spotify", name: "Spotify", cat: "Outros", desc: "Playlists e reprodução.", status: "off", sync: null, color: "#1DB954", dark: true,
    canDo: ["Listar playlists", "Adicionar músicas (com confirmação)"],
    perms: [ { id: "r", l: "Somente leitura", s: ["playlist-read"] }, { id: "rw", l: "Ler e modificar playlists", s: ["playlist-modify"] } ], perm: "r" },
  { id: "mp", name: "Mercado Pago", cat: "Finanças", desc: "Saldo, transferências e boletos.", status: "off", sync: null, color: "#00A868",
    canDo: ["Consultar saldo e movimentações", "Avisar sobre repasses pendentes"],
    perms: [ { id: "r", l: "Somente leitura", s: ["mp.read"] } ], perm: "r" },
  { id: "plausible", name: "Plausible", cat: "Outros", desc: "Analytics do seu site pessoal.", status: "off", sync: null, color: "#333A45",
    canDo: ["Resumir visitas e páginas top", "Avisar sobre picos de tráfego"],
    perms: [ { id: "r", l: "Somente leitura", s: ["analytics:read"] } ], perm: "r" },
];

export const INTEGRATION_CATS = ["Todas", "Produtividade", "Comunicação", "Armazenamento", "Finanças", "Dev", "Outros"];

// ---------------- Financeiro ----------------
export const FIN = {
  faturas: [
    { id: "f1", desc: "Enel — Energia elétrica", cat: "Moradia", due: "2026-09-24", paid: null, amount: 180.32, rec: "Mensal", remind: true },
    { id: "f2", desc: "Netflix", cat: "Assinatura", due: "2026-09-23", paid: null, amount: 44.9, rec: "Mensal", remind: true },
    { id: "f3", desc: "Vivo Fibra — Internet", cat: "Assinatura", due: "2026-09-28", paid: null, amount: 99.9, rec: "Mensal", remind: false },
    { id: "f4", desc: "Cartão Banrisul", cat: "Cartão", due: "2026-09-15", paid: null, amount: 1240.18, rec: "Mensal", remind: true },
    { id: "f5", desc: "Aluguel — Apartamento", cat: "Moradia", due: "2026-09-05", paid: "2026-09-04", amount: 1800, rec: "Mensal", remind: false },
    { id: "f6", desc: "Academia SmartFit", cat: "Saúde", due: "2026-09-10", paid: "2026-09-10", amount: 120, rec: "Mensal", remind: false },
    { id: "f7", desc: "Spotify", cat: "Assinatura", due: "2026-09-08", paid: "2026-09-08", amount: 21.9, rec: "Mensal", remind: false },
  ],
  gastos: [
    { id: "g1", desc: "Mercado Pão de Açúcar", cat: "Mercado", date: "2026-09-18", paid: "2026-09-18", amount: 342.18 },
    { id: "g2", desc: "Uber — volta do trabalho", cat: "Transporte", date: "2026-09-20", paid: "2026-09-20", amount: 28.4 },
    { id: "g3", desc: "Cafeteria Central", cat: "Alimentação", date: "2026-09-19", paid: "2026-09-19", amount: 12.5 },
    { id: "g4", desc: "Livraria da Praia", cat: "Lazer", date: "2026-09-15", paid: "2026-09-15", amount: 79.9 },
    { id: "g5", desc: "Farmácia São Paulo", cat: "Saúde", date: "2026-09-14", paid: "2026-09-14", amount: 56.3 },
    { id: "g6", desc: "iFood — almoço", cat: "Alimentação", date: "2026-09-12", paid: "2026-09-12", amount: 38.7 },
  ],
  recebimentos: [
    { id: "r1", desc: "Salário — TechCorp", cat: "Salário", date: "2026-09-03", paid: "2026-09-03", amount: 8500 },
    { id: "r2", desc: "Freelance — loja virtual", cat: "Freelance", date: "2026-09-12", paid: "2026-09-12", amount: 1200 },
  ],
};

export const CATS = ["Moradia", "Mercado", "Transporte", "Salário", "Assinatura", "Cartão", "Alimentação", "Saúde", "Lazer", "Freelance", "Outros"];

export const faturaStatus = (f: any) => (f.paid ? "pago" : f.due < "2026-09-21" ? "atrasado" : "pendente");

// ---------------- Notas & Arquivos ----------------
export const NOTES: any[] = [
  { id: "n1", type: "note", title: "Ideias para o app de finanças", text: "Pensar em dashboard com gráfico de gasto por categoria. Testar tema escuro no mobile. Avaliar Open Finance para importar extratos. Meta: R$ 3.000/mês guardados até dezembro.", tags: ["projetos", "ideias"], date: "2026-09-18", fav: true },
  { id: "n2", type: "note", title: "Lista de presentes — aniversário da Ana", text: "30/09. Ela quer: álbum de fotos, viagem em casal, perfume. Orçamento até R$ 1.200. Rascunho: álbum impresso 2025 (R$ 350) + final de semana em Gramado.", tags: ["pessoal"], date: "2026-09-10", fav: false },
  { id: "n3", type: "link", title: "Design Tokens — Aura", url: "figma.com/tokens/aura", desc: "Referência de cores, espaçamentos e tipografia do projeto.", tags: ["design"], date: "2026-09-05" },
  { id: "n4", type: "link", title: "Documentação da API Stripe", url: "stripe.com/docs/subscriptions", desc: "Assinaturas recorrentes e webhooks de cobrança.", tags: ["dev"], date: "2026-08-28" },
  { id: "n5", type: "pdf", title: "Contrato de trabalho 2026.pdf", size: "1,2 MB", tags: ["trabalho"], date: "2026-02-01" },
  { id: "n6", type: "pdf", title: "Notas fiscais — agosto.pdf", size: "4,8 MB", tags: ["financeiro"], date: "2026-09-01", fav: true },
  { id: "n7", type: "image", title: "Thor no parque.jpg", tags: ["pessoal"], date: "2026-09-16", tone: "#5b7d9e" },
  { id: "n8", type: "image", title: "Print — reunião 18/09.png", tags: ["trabalho"], date: "2026-09-18", tone: "#6e7f92" },
  { id: "n9", type: "audio", title: "Ideia para o podcast.mp3", size: "2,1 MB", dur: "3:24", tags: ["ideias"], date: "2026-09-14" },
  { id: "n10", type: "video", title: "Setup do ambiente — tutorial.mp4", size: "84 MB", dur: "12:08", tags: ["dev"], date: "2026-08-22" },
  { id: "n11", type: "note", title: "Risoto de abóbora", text: "2 xícaras de arroz arbóreo, 800g de abóbora cabotiá, 50g de parmesão, 1L de caldo. Refogar a cebola, tostear o arroz, adicionar o caldo aos poucos e finalizar com o azeite de abóbora.", tags: ["cozinha"], date: "2026-08-30" },
  { id: "n12", type: "pdf", title: "Apólice — seguro do carro.pdf", size: "860 KB", tags: ["documentos"], date: "2026-05-12" },
];

export const NOTE_TAGS = ["projetos", "ideias", "pessoal", "design", "dev", "trabalho", "financeiro", "cozinha", "documentos"];

// ---------------- Memórias ----------------
export const MEMS: any[] = [
  { id: "m1", text: "Gosto de receber respostas diretas, sem rodeios.", type: "Preferências", src: "Manual", created: "2026-08-01", updated: null, on: true },
  { id: "m2", text: "Meu aniversário é em 14 de março.", type: "Pessoal", src: "Manual", created: "2026-08-01", updated: null, on: true },
  { id: "m3", text: "Trabalho como desenvolvedor front-end na TechCorp.", type: "Trabalho", src: "Automática", created: "2026-08-03", updated: "2026-09-02", on: true },
  { id: "m4", text: "Prefiro reuniões pela manhã; à tarde mantenho blocos de foco.", type: "Preferências", src: "Automática", created: "2026-08-12", updated: null, on: true },
  { id: "m5", text: "A Ana é minha esposa; aniversário dela em 30 de setembro.", type: "Pessoal", src: "Automática", created: "2026-08-20", updated: null, on: true },
  { id: "m6", text: "Moro em Porto Alegre (RS).", type: "Pessoal", src: "Manual", created: "2026-08-01", updated: null, on: true },
  { id: "m7", text: "Estou evitando carboidratos à noite.", type: "Pessoal", src: "Automática", created: "2026-09-05", updated: null, on: false },
  { id: "m8", text: "Uso o Notion para gerenciar projetos do trabalho.", type: "Trabalho", src: "Automática", created: "2026-08-15", updated: "2026-09-18", on: true },
];

export const MEM_TYPES = ["Todas", "Pessoal", "Preferências", "Trabalho", "Outros"];

// ---------------- Automações ----------------
export const AUTOS: any[] = [
  {
    id: "a1", name: "Resumo matinal de e-mails", icon: "Clock",
    trig: "Todo dia às 08:00", trigType: "schedule",
    desc: "Lê os e-mails não lidos, resume os relevantes e cria uma nota com o resumo.",
    tasks: ["Resumir e-mails não lidos", "Criar nota com o resumo"], credits: 38,
    last: "Hoje, 08:00", lastOk: true, next: "Amanhã, 08:00", est: "1.178", on: true,
    runs: [
      { d: "21/09 08:00", ok: true, c: 38, t: "12s" },
      { d: "20/09 08:00", ok: true, c: 36, t: "11s" },
      { d: "19/09 08:00", ok: true, c: 41, t: "14s" },
      { d: "18/09 08:00", ok: false, c: 0, t: "—", err: "Token do Notion expirado" },
      { d: "17/09 08:00", ok: true, c: 35, t: "10s" },
      { d: "16/09 08:00", ok: true, c: 39, t: "12s" },
    ],
  },
  {
    id: "a2", name: "Aviso de faturas próximas", icon: "Bell",
    trig: "Quando uma fatura estiver a 3 dias do vencimento", trigType: "event",
    desc: "Consulta o Financeiro e avisa no Chat quando uma fatura chegar a 3 dias do vencimento.",
    tasks: ["Consultar faturas em aberto", "Enviar alerta no Chat"], credits: 12,
    last: "18/09, 10:02", lastOk: true, next: "23/09 — Netflix (R$ 44,90)", est: "360", on: true,
    runs: [
      { d: "18/09 10:02", ok: true, c: 12, t: "3s" },
      { d: "10/09 10:00", ok: true, c: 11, t: "3s" },
      { d: "05/09 10:00", ok: true, c: 13, t: "4s" },
      { d: "01/09 10:00", ok: true, c: 12, t: "3s" },
    ],
  },
  {
    id: "a3", name: "Planejamento semanal", icon: "CalendarDays",
    trig: "Toda segunda às 07:00", trigType: "weekly",
    desc: "Consulta os compromissos da semana, cruza com faturas e gera um planejamento de prioridades.",
    tasks: ["Consultar calendário", "Consultar faturas", "Gerar planejamento da semana", "Criar nota de prioridades"], credits: 120,
    last: "15/09, 07:00", lastOk: true, next: "22/09, 07:00", est: "480", on: true,
    runs: [
      { d: "15/09 07:00", ok: true, c: 120, t: "48s" },
      { d: "08/09 07:00", ok: true, c: 115, t: "45s" },
      { d: "01/09 07:00", ok: true, c: 124, t: "51s" },
    ],
  },
  {
    id: "a4", name: "Organizar arquivos do Drive", icon: "FolderOpen",
    trig: "Dia 28 de cada mês, às 19:00", trigType: "monthly",
    desc: "Revisa os uploads do mês no Drive e cria um resumo com sugestões de organização.",
    tasks: ["Consultar arquivos do Drive", "Criar resumo de uploads"], credits: 60,
    last: "28/08, 19:00", lastOk: false, next: "28/09, 19:00", est: "60", on: false,
    runs: [
      { d: "28/08 19:00", ok: false, c: 12, t: "8s", err: "Token do Drive expirado" },
      { d: "28/07 19:00", ok: true, c: 58, t: "39s" },
      { d: "28/06 19:00", ok: true, c: 61, t: "41s" },
    ],
  },
];

export const AUTO_TASKS = [
  "Resumir e-mails não lidos",
  "Criar nota com o resumo",
  "Consultar calendário",
  "Consultar faturas em aberto",
  "Gerar planejamento semanal",
  "Enviar alerta no Chat",
];

// ---------------- Cobrança ----------------
export const PAYMENTS = [
  { id: "p1", date: "12/09/2026", desc: "Assinatura Plus — 10.000 créditos", method: "Cartão •••• 4242", amount: 39.9, status: "Pago" },
  { id: "p2", date: "12/08/2026", desc: "Assinatura Plus — 10.000 créditos", method: "Cartão •••• 4242", amount: 39.9, status: "Pago" },
  { id: "p3", date: "12/07/2026", desc: "Assinatura Plus — 5.000 créditos", method: "Cartão •••• 4242", amount: 29.9, status: "Pago" },
  { id: "p4", date: "12/06/2026", desc: "Assinatura Plus — 5.000 créditos", method: "Cartão •••• 4242", amount: 29.9, status: "Pago" },
];

export const FAQ = [
  { q: "Como funcionam os créditos?", a: "Cada interação com a IA consome créditos de acordo com o modelo e as ferramentas acionadas. O consumo via chat e via automações é exibido separado, e os créditos renovam mensalmente na data da assinatura." },
  { q: "Minhas automações continuam rodando se eu não abrir o app?", a: "Sim. As automações são executadas em background pelos gatilhos definidos (horário ou evento) e consomem créditos do seu plano a cada execução. Você acompanha o histórico e o custo em Automações." },
  { q: "Quem pode ver os meus dados?", a: "Somente você e a IA, dentro das permissões que você conceder a cada integração. Nenhum dado é compartilhado com terceiros e você pode exportar ou excluir tudo em Configurações → Privacidade & LGPD." },
  { q: "Posso trocar a quantidade de créditos no meio do ciclo?", a: "Sim. Upgrade de créditos vale na hora, com rateio proporcional; downgrade e redução de créditos valem no ciclo seguinte." },
  { q: "O que acontece se eu atingir o limite de créditos?", a: "O chat fica pausado até a renovação do ciclo. Suas automações continuam apenas com o consumo previsto; ações sensíveis são suspensas. Você pode expandir o plano a qualquer momento." },
];
