"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as I from "lucide-react";
import { cx, Ic, Btn, Badge, Kbd, Search, Tip, Drawer, LogoTile } from "./ui";
import { useApp } from "@/lib/store";
import { CONVS, INTEGRATIONS, fmt } from "@/lib/mock";

const ICONS: any = {
  Brain: I.Brain, CalendarDays: I.CalendarDays, Mail: I.Mail, Wallet: I.Wallet,
  StickyNote: I.StickyNote, NotionIcon: I.NotebookText, FileText: I.FileText, Plug: I.Plug,
};

// ---------- engine de resposta simulada ----------
function buildPlan(text: string) {
  const t = text.toLowerCase();
  if (/(pagamento|fatur|venc|cont|dinheiro|cart|devid)/.test(t))
    return {
      tools: [
        { icon: "Wallet", label: "Financeiro", state: "ok", result: "2 pagamentos próximos", detail: ["Enel — R$ 180,32 — vence 24/09 (3 dias)", "Netflix — R$ 44,90 — vence 23/09 (2 dias)"] },
        { icon: "Brain", label: "Memória", state: "ok", result: "2 preferências usadas", detail: ["“Prefiro ser avisado antes de pagar”", "“Cartão Banrisul: pagar em até 2x sem juros”"] },
      ],
      text: "Você tem 2 pagamentos vencendo nos próximos 3 dias:\n\n• Netflix — R$ 44,90 — vence amanhã (23/09)\n• Enel — R$ 180,32 — vence sexta (24/09)\n\nLembrete também: a fatura do Banrisul (R$ 1.240,18) está em atraso desde 15/09. Quer que eu crie um lembrete para amanhã às 9h?",
      mem: ["Prefiro ser avisado antes de pagar", "Cartão Banrisul: pagar em até 2x"],
      ctx: { mem: 2, integ: 0, files: 0, acts: 0 },
    };
  if (/(e-?mail|email|inbox|gmail)/.test(t))
    return {
      tools: [
        { icon: "Mail", label: "Gmail", state: "ok", result: "3 e-mails não lidos encontrados", detail: ["Carlos TechCorp — “Deploy da v2.4” (pede retorno até 12h)", "Ana Souza — “Bolo de aniversário” (conversa familiar)", "Enel — “Lembrete de pagamento” (automático)"] },
      ],
      text: "Você tem 3 e-mails não lidos. O único que exige ação agora é o do Carlos: ele pede retorno sobre o deploy da v2.4 até o fim da manhã. Os outros dois não são urgentes — a mensagem da Ana é sobre o bolo do aniversário dela.\n\nQuer que eu prepare um rascunho de resposta para o Carlos?",
      mem: ["Carlos é líder de eng. na TechCorp"],
      ctx: { mem: 1, integ: 1, files: 0, acts: 0 },
    };
  if (/(agenda|calend|evento|compromisso|reuni|hora)/.test(t))
    return {
      tools: [
        { icon: "CalendarDays", label: "Google Calendar", state: "ok", result: "4 compromissos encontrados", detail: ["09:00 — Reunião diária com o time (Meet)", "11:30 — Almoço com a Ana", "15:00 — Review do sprint", "19:00 — Aulas de espanhol"] },
      ],
      text: "Seu calendário de hoje tem 4 compromissos: reunião do time às 9h, almoço com a Ana às 11h30, review do sprint às 15h e espanhol às 19h.\n\nÀ tarde você tem um bloco livre entre 16h e 18h30 — bom momento para o trabalho de foco. Quer que eu bloqueie esse horário?",
      mem: ["Blocos de foco à tarde"],
      ctx: { mem: 1, integ: 1, files: 0, acts: 0 },
    };
  return {
    tools: [
      { icon: "CalendarDays", label: "Google Calendar", state: "ok", result: "4 compromissos encontrados", detail: ["09:00 — Reunião diária com o time", "11:30 — Almoço com a Ana", "15:00 — Review do sprint", "19:00 — Aulas de espanhol"] },
      { icon: "Mail", label: "Gmail", state: "ok", result: "3 e-mails relevantes encontrados", detail: ["Carlos TechCorp — “Deploy da v2.4”", "Ana Souza — “Bolo de aniversário”", "Enel — “Lembrete de pagamento”"] },
      { icon: "Wallet", label: "Financeiro", state: "ok", result: "2 pagamentos próximos", detail: ["Enel — R$ 180,32 — 24/09", "Netflix — R$ 44,90 — 23/09"] },
      { icon: "StickyNote", label: "Suas notas", state: "ok", result: "1 informação relevante", detail: ["“Lista de presentes — aniversário da Ana”"] },
    ],
    text: "Consolidei seu dia. Suas 3 prioridades:\n\n1. Responder o Carlos sobre o deploy da v2.4 (pede retorno até 12h).\n2. Pagar a fatura do Banrisul em atraso — R$ 1.240,18 desde 15/09.\n3. Preparar a pauta da reunião das 9h — ela está no Notion, mas a conexão expirou; posso reconectar se você autorizar.\n\nAlém disso: 2 pagamentos vencem nos próximos 3 dias (Netflix amanhã e Enel sexta).",
    mem: ["Respostas diretas, sem rodeios", "Reuniões pela manhã", "Ana — esposa, aniversário 30/09"],
    ctx: { mem: 3, integ: 2, files: 1, acts: 1 },
  };
}

// ---------- card de tool call ----------
function ToolCallCard({ t, onReconnect }: any) {
  const [open, setOpen] = useState(false);
  const N = ICONS[t.icon] || I.Plug;
  return (
    <div className="mb-2">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 rounded-lg border border-line bg-panel px-3 py-2 text-left hover:bg-soft/60 transition-colors cursor-pointer">
        <span className="h-6 w-6 rounded-md bg-acc-100 dark:bg-acc-950 text-acc-700 dark:text-acc-300 flex items-center justify-center shrink-0"><Ic n={N} s={13} /></span>
        <span className="flex-1 min-w-0">
          <span className="block text-[12.5px] font-medium truncate">{t.state === "run" ? `Consultando ${t.label}…` : t.label}</span>
          {t.result && <span className={cx("block text-[11.5px] truncate", t.state === "err" ? "text-danger" : "text-mut")}>{t.result}</span>}
        </span>
        {t.state === "run" ? <I.Loader2 size={14} className="animate-spin text-faint shrink-0" />
          : t.state === "err" ? <I.XCircle size={14} className="text-danger shrink-0" />
            : <I.CheckCircle2 size={14} className="text-ok shrink-0" />}
        {t.detail && <I.ChevronDown size={13} className={cx("text-faint transition-transform shrink-0", open && "rotate-180")} />}
      </button>
      {open && t.detail && (
        <div className="ml-8 mt-1 rounded-lg bg-soft border border-line px-3 py-1.5 anim-in">
          {t.detail.map((d: string, i: number) => (
            <div key={i} className="text-[12px] text-mut py-[5px] flex gap-2 leading-snug"><span className="text-faint shrink-0">•</span><span>{d}</span></div>
          ))}
        </div>
      )}
      {t.state === "err" && (
        <div className="ml-8 mt-1.5 flex items-center gap-2.5 flex-wrap">
          <span className="text-[11.5px] text-mut">{t.errMsg}</span>
          <Btn s="xs" icon={I.Plug} onClick={onReconnect}>Reconectar</Btn>
        </div>
      )}
    </div>
  );
}

// ---------- ação sensível (confirmação) ----------
function ConfirmBlock({ c, id, onState }: any) {
  const [state, setState] = useState(c.state);
  useEffect(() => setState(c.state), [id]);
  const done = (s: "done" | "cancelled") => { setState(s); onState?.(id, s); };
  if (state === "pending")
    return (
      <div className="rounded-lg border border-warn/40 bg-warn-soft p-3.5 mb-2.5 anim-in">
        <div className="flex items-center gap-2 text-warn text-[12.5px] font-semibold"><Ic n={I.ShieldAlert} s={14} />Ação sensível — requer sua confirmação</div>
        <div className="text-[13px] font-medium mt-2">{c.title}</div>
        {c.preview && <div className="mt-2 rounded-md bg-panel/80 border border-line px-3 py-2 text-[12px] text-mut leading-relaxed">{c.preview}</div>}
        <div className="flex gap-2 mt-3">
          <Btn s="sm" v="p" icon={I.Check} onClick={() => done("done")}>Confirmar</Btn>
          <Btn s="sm" onClick={() => done("cancelled")}>Cancelar</Btn>
        </div>
      </div>
    );
  return (
    <div className={cx("flex items-center gap-2 rounded-lg border px-3 py-2 mb-2.5 text-[12px]",
      state === "done" ? "border-ok/30 bg-ok-soft text-ink" : "border-line bg-soft text-mut")}>
      <Ic n={state === "done" ? I.CheckCircle2 : I.X} s={13} c={state === "done" ? "text-ok" : "text-faint"} />
      <span className="flex-1">{state === "done" ? c.done : "Ação cancelada por você."}</span>
      <Badge v={state === "done" ? "o" : "n"}>{state === "done" ? "Executado" : "Cancelado"}</Badge>
    </div>
  );
}

// ---------- linha de contexto ----------
function ContextRow({ ctx }: any) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[11px] text-faint">
      {ctx.mem > 0 && <span className="flex items-center gap-1"><Ic n={I.Brain} s={11} />{ctx.mem} memória{ctx.mem > 1 ? "s" : ""}</span>}
      {ctx.integ > 0 && <span className="flex items-center gap-1"><Ic n={I.Plug} s={11} />{ctx.integ} integração{ctx.integ > 1 ? "s" : ""}</span>}
      {ctx.files > 0 && <span className="flex items-center gap-1"><Ic n={I.FileText} s={11} />{ctx.files} arquivo{ctx.files > 1 ? "s" : ""}</span>}
      {ctx.acts > 0 && <span className="flex items-center gap-1"><Ic n={I.Zap} s={11} />{ctx.acts} ação executada</span>}
    </div>
  );
}

// ---------- mensagem ----------
function Msg({ m, name, onCopy, onEdit, onSave, onRegen, onReconnect, onConfirmState, memOpen, setMemOpen }: any) {
  const [fb, setFb] = useState(false);
  if (m.role === "u")
    return (
      <div className="flex justify-end anim-up">
        <div className="max-w-[82%] sm:max-w-[75%]">
          <div className="rounded-xl rounded-br-md bg-acc-100/80 dark:bg-acc-950 px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap">{m.text}</div>
          <div className="text-[10.5px] text-faint text-right mt-1 pr-1">{m.t}</div>
        </div>
      </div>
    );
  return (
    <div className="group relative anim-up">
      <div className="flex gap-3">
        <div className="h-7 w-7 rounded-lg bg-ink text-bg dark:bg-acc-800 dark:text-acc-100 flex items-center justify-center shrink-0 mt-0.5"><Ic n={I.Sparkles} s={13} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11.5px] text-faint mb-1.5">
            <span className="font-semibold text-mut">{name}</span><span>{m.t}</span>
          </div>
          {m.tools && m.tools.map((t: any, i: number) => <ToolCallCard key={i} t={t} onReconnect={onReconnect} />)}
          {m.confirm && <ConfirmBlock c={m.confirm} id={m.cid} onState={onConfirmState} />}
          {m.text && <div className="text-[14px] leading-relaxed whitespace-pre-wrap">{m.text}</div>}
          {m.list && (
            <div className="mt-2.5 rounded-lg border border-line bg-panel overflow-hidden">
              {m.list.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 border-t border-line first:border-t-0">
                  <span className="text-[12px] w-36 truncate">{r.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-soft overflow-hidden"><div className="h-full bg-acc-500/70 rounded-full" style={{ width: r.pct + "%" }} /></div>
                  <span className="text-[12px] text-mut w-24 text-right tabular-nums">{r.v}</span>
                </div>
              ))}
            </div>
          )}
          {m.mem && m.mem.length > 0 && (
            <div className="relative mt-2">
              <button type="button" onClick={() => setMemOpen(!memOpen)}
                className="inline-flex items-center gap-1.5 rounded-md bg-soft border border-line px-2 py-1 text-[11.5px] text-mut hover:text-ink hover:border-acc-300 transition-colors cursor-pointer">
                <Ic n={I.Brain} s={12} c="text-acc-600 dark:text-acc-300" />Usou {m.mem.length} memórias<Ic n={I.ChevronDown} s={11} c={cx("transition-transform", memOpen && "rotate-180")} />
              </button>
              {memOpen && (
                <div className="absolute z-[60] mt-1.5 w-[290px] max-w-[85vw] rounded-lg border border-line bg-panel shadow-lg p-2 anim-pop">
                  <div className="text-[10.5px] uppercase tracking-wide text-faint font-medium px-1.5 pb-1">Memórias utilizadas nesta resposta</div>
                  {m.mem.map((x: string, i: number) => (
                    <div key={i} className="px-1.5 py-1.5 text-[12px] text-mut rounded-md hover:bg-soft flex gap-2"><Ic n={I.Brain} s={12} c="text-acc-500 shrink-0 mt-0.5" />{x}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          {m.ctx && <ContextRow ctx={m.ctx} />}
        </div>
      </div>
      <div className="absolute -top-6 right-0 hidden group-hover:flex items-center gap-0.5 bg-panel border border-line rounded-lg shadow-sm px-1 py-0.5 anim-in">
        <Tip label="Copiar"><button onClick={() => { navigator.clipboard?.writeText(m.text).catch(() => {}); onCopy(); }} className="h-7 w-7 rounded-md flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={fb ? I.Check : I.Copy} s={13} c={fb ? "text-ok" : ""} /></button></Tip>
        <Tip label="Regenerar"><button onClick={() => onRegen()} className="h-7 w-7 rounded-md flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={I.RefreshCw} s={13} /></button></Tip>
        <Tip label="Editar"><button onClick={() => onEdit(m.text)} className="h-7 w-7 rounded-md flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={I.Pencil} s={13} /></button></Tip>
        <Tip label="Boa resposta"><button className="h-7 w-7 rounded-md flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={I.ThumbsUp} s={13} /></button></Tip>
        <Tip label="Má resposta"><button className="h-7 w-7 rounded-md flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={I.ThumbsDown} s={13} /></button></Tip>
        <Tip label="Salvar como nota"><button onClick={() => onSave()} className="h-7 w-7 rounded-md flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={I.Bookmark} s={13} /></button></Tip>
      </div>
    </div>
  );
}

// ---------- lista lateral de chats ----------
function ChatList({ active, onPick, c }: any) {
  const [q, setQ] = useState("");
  const list = CONVS.filter((x) => x.title.toLowerCase().includes(q.toLowerCase()) || x.preview.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0));
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-3 border-b border-line space-y-2.5 shrink-0">
        <Btn icon={I.Plus} v="o" className="w-full" onClick={() => onPick(null)}>Novo chat</Btn>
        <Search value={q} onChange={(e: any) => setQ(e.target.value)} placeholder="Buscar conversas…" />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {list.length === 0 && <div className="text-center text-[12px] text-faint py-8">Nenhuma conversa encontrada.</div>}
        {list.slice(0, 20).map((x: any) => (
          <button key={x.id} type="button" onClick={() => onPick(x.id)}
            className={cx("w-full text-left rounded-lg px-2.5 py-2 transition-colors cursor-pointer", active === x.id ? "bg-soft" : "hover:bg-soft/60")}>
            <div className="flex items-center gap-1.5">
              <span className={cx("text-[13px] font-medium truncate flex-1", active === x.id && "text-ink")}>{x.title}</span>
              {x.pin && <I.Pin size={11} className="text-acc-500 shrink-0" />}
              <span className="text-[10.5px] text-faint shrink-0">{x.time}</span>
            </div>
            <div className="text-[11.5px] text-faint truncate mt-0.5">{x.preview}</div>
          </button>
        ))}
      </div>
      <div className="p-2.5 border-t border-line shrink-0">
        <Link href="/historico" className="flex items-center gap-1.5 text-[12px] font-medium text-mut hover:text-ink px-1 transition-colors">
          <Ic n={I.History} s={13} />Ver todos os chats<Ic n={I.ChevronRight} s={12} c="ml-auto" />
        </Link>
      </div>
    </div>
  );
}

// ---------- chat principal ----------
let mid = 100;

export function ChatView({ id }: { id?: string }) {
  const router = useRouter();
  const { assistant, user, toast, setRec } = useApp();
  const conv = CONVS.find((c) => c.id === id);
  const [msgs, setMsgs] = useState<any[]>(() => (conv ? conv.msgs.map((m: any, i: number) => ({ ...m, cid: `c${i}` })) : []));
  const [status, setStatus] = useState<"online" | "thinking" | "working">("online");
  const [input, setInput] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [memOpenIdx, setMemOpenIdx] = useState(-1);
  const [attach, setAttach] = useState<any[]>([]);
  const [menuAt, setMenuAt] = useState(false);
  const [menuCmd, setMenuCmd] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const connected = INTEGRATIONS.filter((i) => i.status === "connected");

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, status]);
  useEffect(() => {
    const c = CONVS.find((x) => x.id === id);
    setMsgs(c ? c.msgs.map((m: any, i: number) => ({ ...m, cid: `c${i}` })) : []);
    setStatus("online");
    setMemOpenIdx(-1);
  }, [id]);

  const pick = (cid: string | null) => { setListOpen(false); router.push(cid ? `/chat/${cid}` : "/chat"); };

  function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t || status !== "online") return;
    const ai: any = { role: "a", t: "agora", cid: "new" + ++mid, tools: null, text: "" };
    setMsgs((s) => [...s, { role: "u", text: t, t: "agora" }, ai]);
    setInput("");
    setStatus("thinking");
    const plan = buildPlan(t);
    const tools = plan.tools.map((x: any) => ({ ...x, state: "run", result: null }));
    setTimeout(() => {
      setStatus("working");
      setMsgs((s) => s.map((m) => (m.cid === ai.cid ? { ...m, tools } : m)));
    }, 750);
    tools.forEach((tl, i) => {
      setTimeout(() => {
        setMsgs((s) => s.map((m) => (m.cid === ai.cid ? { ...m, tools: m.tools.map((x: any, j: number) => (j === i ? { ...x, state: "ok", result: tl.result } : x)) } : m)));
      }, 1600 + i * 850);
    });
    setTimeout(() => {
      setMsgs((s) => s.map((m) => (m.cid === ai.cid ? { ...m, text: plan.text, mem: plan.mem, ctx: plan.ctx } : m)));
      setStatus("online");
    }, 1600 + tools.length * 850 + 500);
  }

  function onChangeInput(e: any) {
    const v = e.target.value;
    setInput(v);
    setMenuAt(/@[\p{L}]*/u.test(v));
    setMenuCmd(/\/[\p{L}]*/u.test(v));
    const el = taRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(140, el.scrollHeight) + "px"; }
  }
  const atQ = input.match(/@([\p{L}]*)$/u)?.[1]?.toLowerCase() || "";
  const cmdQ = input.match(/\/([\p{L}]*)$/u)?.[1]?.toLowerCase() || "";
  const cmds = [
    { c: "/resumo", d: "Resumo do dia (agenda + e-mails + finanças)" },
    { c: "/pagamentos", d: "Pagamentos próximos e em atraso" },
    { c: "/calendario", d: "Compromissos de hoje" },
    { c: "/notas", d: "Buscar nas minhas notas" },
    { c: "/limpar", d: "Limpar o contexto da conversa" },
  ];

  const statusLabel = status === "online" ? "Online" : status === "thinking" ? "Pensando…" : "Processando…";
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const hasMsgs = msgs.length > 0;

  const inputArea = (
    <div className="border-t border-line bg-panel px-3 sm:px-5 pt-3 pb-3 shrink-0">
      <div className="max-w-[760px] mx-auto">
        {(attach.length > 0 || menuAt || menuCmd) && (
          <div className="relative mb-2">
            {menuAt && (
              <div className="rounded-lg border border-line bg-panel shadow-lg p-1.5 anim-pop absolute bottom-full left-0 mb-1 w-[300px] max-w-full">
                <div className="text-[10.5px] uppercase tracking-wide text-faint font-medium px-2 pb-1">Mencionar integração</div>
                {connected.filter((i) => i.name.toLowerCase().includes(atQ)).map((i: any) => (
                  <button key={i.id} type="button" onClick={() => { setInput(input.replace(/@[\p{L}]*/u, i.name + " ")); setMenuAt(false); }}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-soft text-left cursor-pointer">
                    <LogoTile name={i.name} color={i.color} dark={i.dark} s={24} r={6} />
                    <span className="text-[12.5px] font-medium flex-1">{i.name}</span>
                    <Badge v="o">Conectada</Badge>
                  </button>
                ))}
              </div>
            )}
            {menuCmd && (
              <div className="rounded-lg border border-line bg-panel shadow-lg p-1.5 anim-pop absolute bottom-full left-0 mb-1 w-[320px] max-w-full">
                <div className="text-[10.5px] uppercase tracking-wide text-faint font-medium px-2 pb-1">Comandos</div>
                {cmds.filter((x) => x.c.includes(cmdQ)).map((x) => (
                  <button key={x.c} type="button" onClick={() => { setInput(x.c + " "); setMenuCmd(false); }}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-soft text-left cursor-pointer">
                    <span className="text-[12.5px] font-semibold text-acc-600 dark:text-acc-300 w-24">{x.c}</span>
                    <span className="text-[12px] text-mut">{x.d}</span>
                  </button>
                ))}
              </div>
            )}
            {attach.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-soft border border-line px-2 py-1 text-[11.5px] mr-1.5 mb-1">
                <Ic n={I.Paperclip} s={11} />{f}<button onClick={() => setAttach((a) => a.filter((_, j) => j !== i))} className="text-faint hover:text-danger cursor-pointer"><Ic n={I.X} s={11} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="rounded-xl border border-line2 bg-bg focus-within:border-acc-500 focus-within:ring-2 focus-within:ring-acc-500/20 transition-all">
          <textarea ref={taRef} rows={1} value={input} onChange={onChangeInput}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Conversar com ${assistant}…`}
            className="w-full bg-transparent resize-none px-4 pt-3 pb-1 text-[14px] outline-none placeholder:text-faint max-h-[140px] leading-relaxed" />
          <div className="flex items-center gap-0.5 px-2 pb-2 pt-1">
            <div className="relative group/att">
              <button type="button" title="Anexar arquivo" onClick={() => setAttach((a) => [...a, "Comprovante-092026.pdf"])}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer">
                <Ic n={I.Paperclip} s={15} />
              </button>
            </div>
            <Tip label="Voz (mobile-first)"><button type="button" className="h-8 w-8 rounded-lg flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer" onClick={() => toast("Captura de voz disponível na versão mobile.", "info", I.Mic)}><Ic n={I.Mic} s={15} /></button></Tip>
            <div className="flex-1" />
            <div className="hidden sm:flex items-center gap-1.5 text-faint mr-1">
              <Kbd>/</Kbd><span className="text-[10.5px]">comandos</span>
              <span className="w-1" />
              <Kbd>@</Kbd><span className="text-[10.5px]">integrações</span>
            </div>
            <button type="button" disabled={!input.trim() || status !== "online"} onClick={() => send()}
              className="h-8 w-8 rounded-lg bg-ink text-bg hover:opacity-85 flex items-center justify-center disabled:opacity-30 transition-opacity cursor-pointer">
              <Ic n={I.ArrowUp} s={15} sw={2.2} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 px-1">
          <span className="text-[10.5px] text-faint flex items-center gap-1.5"><Ic n={I.Plug} s={10} />{connected.length} integrações ativas</span>
          <span className="text-[10.5px] text-faint flex items-center gap-1"><Ic n={I.Gauge} s={10} />{fmt(user.credits - user.chat - user.auto)} créditos restantes</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100dvh-58px)] lg:h-dvh bg-bg pt-[56px] lg:pt-0">
      {/* sidebar de chats (desktop) */}
      <aside className="hidden lg:flex w-[300px] shrink-0 border-r border-line bg-panel flex-col">
        <ChatList active={id} onPick={pick} />
      </aside>

      <section className="flex-1 flex flex-col min-w-0">
        {/* header */}
        <header className="h-[56px] lg:h-14 border-b border-line bg-panel flex items-center gap-2 px-3 sm:px-5 shrink-0">
          <button type="button" onClick={() => setListOpen(true)} className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-mut hover:bg-soft cursor-pointer">
            <Ic n={I.MessageSquare} s={17} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[14.5px] font-semibold tracking-tight truncate">{conv ? conv.title : "Novo chat"}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-faint whitespace-nowrap">
                <span className={cx("h-1.5 w-1.5 rounded-full", status === "online" ? "bg-ok" : status === "thinking" ? "bg-warn pulse-soft" : "bg-acc-500 pulse-soft")} />
                {statusLabel}
              </span>
            </div>
          </div>
          <div className="relative group/mod hidden sm:block">
            <button type="button" className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-line2 text-[12px] font-medium text-mut hover:text-ink hover:bg-soft cursor-pointer">
              <Ic n={I.Cpu} s={13} />Aura Standard<Ic n={I.ChevronDown} s={12} />
            </button>
            <div className="absolute right-0 top-full mt-1 w-[250px] rounded-lg border border-line bg-panel shadow-lg p-1.5 hidden group-hover/mod:block anim-pop z-50">
              {[
                { n: "Aura Lite", d: "Rápido · 1 crédito/msg", v: false },
                { n: "Aura Standard", d: "Equilibrado · 4 créditos/msg", v: true },
                { n: "Aura Pro", d: "Máximo · 12 créditos/msg", v: false },
              ].map((m) => (
                <button key={m.n} type="button" onClick={() => toast(`Modelo ${m.n} selecionado.`)}
                  className={cx("w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-soft text-left cursor-pointer", m.v && "bg-soft")}>
                  <span className="text-[12.5px] font-semibold flex-1">{m.n}</span>
                  <span className="text-[10.5px] text-faint">{m.d}</span>
                  {m.v && <Ic n={I.Check} s={13} c="text-acc-600 dark:text-acc-300" />}
                </button>
              ))}
            </div>
          </div>
          <Btn s="sm" icon={I.Plus} onClick={() => pick(null)}>Novo chat</Btn>
        </header>

        {/* mensagens */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 space-y-7">
            {conv?.limit && (
              <div className="rounded-lg border border-warn/40 bg-warn-soft px-3.5 py-3 flex items-center gap-2.5 anim-in">
                <Ic n={I.Gauge} s={15} c="text-warn" />
                <div className="flex-1 text-[12.5px] leading-snug">
                  <b>Limite de créditos atingido.</b> <span className="text-mut">Os créditos renovam em 12/10. Aumente sua quantidade para continuar sem interrupção.</span>
                </div>
                <Btn s="xs" v="p" onClick={() => router.push("/planos")}>Ver planos</Btn>
              </div>
            )}

            {!hasMsgs && (
              <div className="flex flex-col items-center justify-center text-center pt-[9vh] pb-8 anim-in">
                <div className="h-11 w-11 rounded-xl bg-ink text-bg dark:bg-acc-800 flex items-center justify-center mb-4"><Ic n={I.Sparkles} s={18} /></div>
                <h2 className="text-[19px] font-semibold tracking-tight">{greet}, {user.first}</h2>
                <p className="text-[13px] text-mut mt-1">Como posso te ajudar?</p>
                <div className="grid sm:grid-cols-2 gap-2.5 mt-7 w-full max-w-[540px]">
                  {[
                    { i: I.CalendarDays, t: "O que tenho hoje?", d: "Agenda, e-mails e pagamentos em um resumo" },
                    { i: I.Wallet, t: "Algum pagamento vencendo?", d: "Faturas dos próximos 7 dias" },
                    { i: I.Mail, t: "Resuma meus e-mails não lidos.", d: "Prioriza o que exige resposta" },
                    { i: I.Zap, t: "Quais são minhas prioridades hoje?", d: "Cruza agenda, tarefas e finanças" },
                  ].map((s) => (
                    <button key={s.t} type="button" onClick={() => send(s.t)}
                      className="text-left rounded-xl border border-line bg-panel hover:border-acc-300 hover:bg-soft/50 p-3.5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 text-[13px] font-medium"><Ic n={s.i} s={15} c="text-acc-600 dark:text-acc-300" />{s.t}</div>
                      <div className="text-[11.5px] text-faint mt-1 leading-snug">{s.d}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 text-[11px] text-faint flex items-center gap-3">
                  <span className="flex items-center gap-1"><Ic n={I.Plug} s={11} />{connected.length} ferramentas conectadas</span>
                  <span className="flex items-center gap-1"><Ic n={I.Brain} s={11} />7 memórias ativas</span>
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <Msg key={m.cid || i} m={m} name={assistant} memOpen={memOpenIdx === i} setMemOpen={(v: boolean) => setMemOpenIdx(v ? i : -1)}
                onCopy={() => { toast("Mensagem copiada.", "info", I.Copy); }}
                onRegen={() => toast("Resposta regenerada (simulação).", "info", I.RefreshCw)}
                onEdit={(t: string) => { setInput(t); taRef.current?.focus(); }}
                onSave={() => toast("Salvo em Notas & Arquivos.", I.StickyNote)}
                onReconnect={() => setRec({ name: "Notion", color: "#191919", sync: "há 3 dias", perm: "Somente leitura" })}
                onConfirmState={(cid: string, s: string) => {
                  setMsgs((ms) => ms.map((x) => (x.cid === cid && x.confirm ? { ...x, confirm: { ...x.confirm, state: s } } : x)));
                  toast(s === "done" ? "Ação executada com sucesso." : "Ação cancelada.", s === "done" ? "ok" : "info");
                }} />
            ))}

            {status === "thinking" && (
              <div className="flex gap-3 anim-in">
                <div className="h-7 w-7 rounded-lg bg-ink text-bg dark:bg-acc-800 dark:text-acc-100 flex items-center justify-center shrink-0"><Ic n={I.Sparkles} s={13} /></div>
                <div className="flex items-center gap-1 pt-1.5">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {inputArea}
      </section>

      {/* drawer de chats (mobile) */}
      <Drawer open={listOpen} onClose={() => setListOpen(false)} title="Conversas" sub="Suas últimas conversas" w="sm:w-[340px]">
        <div className="-mx-5 -mt-4 h-[70dvh]"><ChatList active={id} onPick={pick} /></div>
      </Drawer>
    </div>
  );
}
