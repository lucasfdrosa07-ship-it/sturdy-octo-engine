# Aura — Assistente Pessoal com IA (versão visual navegável)

Camada 100% visual/UX do SaaS descrito na especificação: **todas as páginas, abas, modais, drawers, formulários, filtros, toasts, tooltips e estados** — com dados mockados e estados locais. Sem backend, autenticação, OAuth, IA ou pagamento reais (tudo simulado para demonstração).

## Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (design system com tokens semânticos claro/escuro)
- **Lucide React** (ícones)

## Como rodar
```bash
npm install
npm run dev    # desenvolvimento (porta 3000)
npm run build && npm run start   # produção (porta 3000)
```

## O que está implementado (mapa do produto)

| Área | Rotas / o que ver |
|---|---|
| **Auth** | `/login` (mostrar/esconder senha, recuperar senha), `/register` (validações, força de senha, termos obrigatórios), `/erro-autenticacao` |
| **Onboarding** | `/onboarding` — wizard 4 passos: apelido da IA, primeira integração (OAuth simulado), primeira memória, tema |
| **Chat (home)** | `/chat` e `/chat/[id]` — header com status (Online/Pensando/Processando), seletor de modelo, sidebar de chats, bolhas, **tool calls expansíveis**, indicador de memórias, linha de contexto, ações por mensagem (copiar/regenerar/editar/👍👎/salvar nota), input expansível com anexos, atalhos `/` e `@`, sugestões no estado vazio, erro de ferramenta com reconexão, banner de rate limit (`/chat/c4`), conversa com **ação sensível para confirmar** (`/chat/c2`, `/chat/c3`). Ao enviar mensagem a IA "responde" sequenciando tool calls (simulação) |
| **Histórico** | `/historico` — busca, filtros (data, integração, fixados), agrupamento Hoje/Ontem/Semana/Mês/Antigos, fixar, renomear, duplicar, exportar PDF/MD, excluir com confirmação, scroll infinito com skeleton |
| **Financeiro** | `/financeiro` — 4 cards de resumo, abas Faturas/Gastos/Recebimentos, filtros mês/categoria/status/busca, tabela (desktop) e cards (mobile), FAB, drawer de criar/editar com recorrência e lembrete da IA, detalhe com comprovante, marcar como pago, status Pago/Pendente/Atrasado |
| **Integrações** | `/integracoes` — conectadas vs disponíveis, busca + categorias, modal com permissões por nível + scopes + última sincronização, estados (conectando/conectado/expirado/erro), reconectar, **modal global de reconexão** (disponível em "Simular expiração de token" no menu da página) |
| **Notas & Arquivos** | `/notas` — grid/lista, busca full-text, filtros tipo/favoritos/tags, modal de nota (rich text simples + tags), modal de link, upload com drag-and-drop simulado + progresso + erros (tamanho), player de áudio, drawer de detalhe, "Usar no Chat" |
| **Personalização** | `/personalizacao` — Memória da IA (cards, filtros por tipo, ativar/desativar, CRUD, memória automática, limite por plano), Instruções (apelido, como chamar, tom, idioma, instruções com pré-visualização ao vivo), Tema & Aparência (claro/escuro, mais temas "em breve", tamanho de fonte, densidade) |
| **Automações** | `/automacoes` — cards com gatilho/status/créditos por execução/estimativa mensal, wizard de criação em 3 passos (gatilho agendamento ou evento → tarefas → revisão com aviso de consumo), histórico de execuções com falhas, ativar/pausar/excluir |
| **Configurações** | `/configuracoes` — **Conta** (perfil, senha com show/hide, 2FA com QR + código), **Preferências** (idioma, tema, fonte, contraste, negrito, densidade), **Notificações** (push, e-mail, 4 tipos), **Plano & Cobrança** (plano atual, consumo chat × automações, método de pagamento, histórico, cancelar com retenção), **Privacidade & LGPD** (exportar dados, consentimentos, permissões/revogar, excluir conta com confirmação por texto), **Suporte** (FAQ, status, contato, links para páginas de estado) |
| **Planos** | `/planos` — Free/Plus/Pro com **seletor de créditos** (Plus até 20.000, Pro até 50.000) atualizando o preço, tabela comparativa completa |
| **Checkout** | `/checkout?plano=&creditos=` — 3 etapas, Cartão (Stripe) / Pix (Mercado Pago, QR + copia-e-cola) / Boleto, processamento simulado, confirmação; atualiza o estado global do plano (sidebar + créditos) |
| **Erros & exceções** | 404 (`/404x` + any rota), 500 (`/500x` + `error.tsx`), `/erro-autenticacao`, `/integracao-expirada`, `/assinatura-expirada`, `/manutencao` |
| **Navegação** | Sidebar desktop (com créditos e avatar → menu rápido), bottom nav mobile (Chat/Financeiro/Notas/Integrações/Mais → sheet) |

## Design system
- Paleta: preto/branco/cinza + **azure desaturado** como acento (sem gradientes, sem glassmorphism, sem sombras pesadas)
- Tokens semânticos (`bg`, `panel`, `elev`, `soft`, `line`, `ink`, `mut`, `faint`) com tema **claro/escuro** persistente (localStorage)
- Cores de estado discretas: verde (sucesso), vermelho (erro/perigo), âmbar (alerta)
- Componentes: `Btn`, `Badge`, `Card`, `Field/Input/Select/Textarea/Search`, `Toggle`, `Checkbox`, `Seg`, `Tabs`, `Modal`, `Drawer`, `Menu`, `Tip`, `Confirm`, `Empty`, `Progress`, `Skel`, `Stat`, `Avatar`, `LogoTile`, `Kbd`, `Dot`, `QrFake`, toasts globais

## Regras de demonstração
- Login: qualquer e-mail + senha 8+ caracteres (primeiro login → onboarding)
- Interações (toggles, filtros, seletores, formulários, exclusões) alteram **estados locais** e disparam toasts — nenhuma lógica real de produção
- "Simular expiração de token" (menu ⋯ em Integrações) dispara o modal global de reconexão
