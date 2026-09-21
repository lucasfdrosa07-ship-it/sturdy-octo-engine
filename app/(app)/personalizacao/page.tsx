"use client";
import React, { useMemo, useState } from "react";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import {
  PageHead, Tabs, Btn, Badge, Modal, Drawer, Field, Input, Textarea, Select,
  Toggle, Seg, Ic, cx, Empty, Progress, Menu, dBR,
} from "@/components/ui";
import { MEMS, MEM_TYPES } from "@/lib/mock";
import { useApp } from "@/lib/store";

export default function PersonalizacaoPage() {
  const { toast, theme, setTheme, assistant, setAssistant, user } = useApp();
  const [tab, setTab] = useState("memoria");
  const [mems, setMems] = useState(MEMS);
  const [autoMem, setAutoMem] = useState(true);
  const [fType, setFType] = useState("Todas");
  const [memModal, setMemModal] = useState<any>(null);
  const [del, setDel] = useState<any>(null);

  // instruções
  const [inst, setInst] = useState({ name: assistant, call: "Rafael", tone: "Direto", lang: "pt-BR", custom: "Sempre responda em tópicos curtos. Antes de enviar qualquer e-mail, peça a minha confirmação explicita." });
  // tema
  const [font, setFont] = useState("padrao");
  const [density, setDensity] = useState("confortavel");

  const list = useMemo(() => mems.filter((m) => fType === "Todas" || m.type === fType), [mems, fType]);
  const activeCount = mems.filter((m) => m.on).length;
  const limit = user.plan === "free" ? 50 : user.plan === "plus" ? 500 : Infinity;
  const pctLimit = limit === Infinity ? 12 : Math.round((mems.length / limit) * 100);

  function saveMem() {
    const it = { ...memModal.item, id: memModal.item.id || "m" + Date.now() };
    setMems((s) => (memModal.item.id ? s.map((x) => (x.id === it.id ? it : x)) : [it, ...s]));
    setMemModal(null);
    toast(memModal.item.id ? "Memória atualizada. A IA já a usa nas próximas respostas." : "Memória salva. A IA já a usa nas próximas respostas.");
  }

  return (
    <Page>
      <PageHead title="Personalização" sub="Molde a IA e a aparência do sistema: memória, identidade, comportamento e visual." />

      <div className="mt-5">
        <Tabs val={tab} onChange={setTab} tabs={[
          { v: "memoria", l: "Memória da IA", icon: I.Brain, c: mems.length },
          { v: "instrucoes", l: "Instruções do sistema", icon: I.SlidersHorizontal },
          { v: "tema", l: "Tema & Aparência", icon: I.Palette },
        ]} />
      </div>

      {/* ============ MEMÓRIA ============ */}
      {tab === "memoria" && (
        <div className="mt-5 space-y-4 anim-in">
          {/* toggle automática + limite */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-[10px] border border-line bg-panel p-4 flex items-start gap-3.5">
              <span className="h-10 w-10 rounded-lg bg-acc-100 dark:bg-acc-950 text-acc-700 dark:text-acc-300 flex items-center justify-center shrink-0"><Ic n={I.Sparkles} s={18} /></span>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold flex items-center gap-2">Memória automática {autoMem && <Badge v="o">Ativa</Badge>}</div>
                <p className="text-[12px] text-mut mt-1 leading-relaxed">A IA pode salvar informações automaticamente segundo as regras do sistema: preferências repetidas, fatos confirmados por você e contextos recorrentes. Nada é salvo sem regra — e você revisa tudo aqui.</p>
              </div>
              <Toggle on={autoMem} onChange={(v: boolean) => { setAutoMem(v); toast(v ? "Memória automática ativada." : "Memória automática desativada.", "info", I.Sparkles); }} />
            </div>
            <div className="rounded-[10px] border border-line bg-panel p-4">
              <div className="flex items-center justify-between text-[12px] font-medium text-mut">
                <span className="flex items-center gap-1.5"><Ic n={I.Gauge} s={13} />Limite do plano {user.plan.toUpperCase()}</span>
                <span>{limit === Infinity ? "Ilimitado (Pro)" : `${mems.length} de ${limit}`}</span>
              </div>
              <div className="mt-2.5"><Progress v={pctLimit} tone={pctLimit > 80 ? "w" : "a"} /></div>
              <div className="mt-2 text-[11px] text-faint">{activeCount} ativas · {mems.length - activeCount} desativadas {limit !== Infinity && "· Free 50 · Plus 500 · Pro ilimitadas"}</div>
            </div>
          </div>

          {/* filtros + nova */}
          <div className="flex flex-wrap items-center gap-2">
            {MEM_TYPES.map((t) => (
              <button key={t} onClick={() => setFType(t)}
                className={cx("h-8 px-3 rounded-lg border text-[12.5px] font-medium transition-colors cursor-pointer",
                  fType === t ? "border-ink bg-ink text-bg" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
                {t}
              </button>
            ))}
            <Btn s="sm" v="p" icon={I.Plus} className="ml-auto" onClick={() => setMemModal({ mode: "new", item: { text: "", type: "Pessoal", src: "Manual", created: "2026-09-21", updated: null, on: true } })}>
              Nova memória
            </Btn>
          </div>

          {/* lista */}
          {list.length === 0 ? (
            <div className="rounded-[10px] border border-line bg-panel">
              <Empty icon={I.Brain} title="A IA vai aprender sobre você conforme vocês conversam"
                desc="Memórias criadas manualmente ou automaticamente (com as regras do sistema) aparecem aqui — e você pode editar, desativar ou excluir qualquer uma."
                action={<Btn s="sm" icon={I.Plus} onClick={() => setMemModal({ mode: "new", item: { text: "", type: "Pessoal", src: "Manual", created: "2026-09-21", updated: null, on: true } })}>Criar a primeira memória</Btn>} />
            </div>
          ) : (
            <div className="rounded-[10px] border border-line bg-panel divide-y divide-[var(--c-line)]">
              {list.map((m) => (
                <div key={m.id} className={cx("px-4 py-3.5 flex items-start gap-3.5 transition-opacity", !m.on && "opacity-55")}>
                  <span className={cx("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", m.on ? "bg-acc-100 dark:bg-acc-950 text-acc-700 dark:text-acc-300" : "bg-soft text-faint")}>
                    <Ic n={I.Brain} s={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] leading-snug">“{m.text}”</div>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-[11px] text-faint">
                      <Badge v="n">{m.type}</Badge>
                      <span className="flex items-center gap-1"><Ic n={m.src === "Automática" ? I.Sparkles : I.User} s={10} />{m.src}</span>
                      <span>criada {dBR(m.created).slice(0, 5)}</span>
                      {m.updated && <span>· atualizada {dBR(m.updated).slice(0, 5)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Toggle on={m.on} onChange={(v: boolean) => { setMems((s) => s.map((x) => (x.id === m.id ? { ...x, on: v } : x))); toast(v ? "Memória ativada." : "Memória desativada — a IA não a usará.", "info", I.Brain); }} />
                    <Menu items={[
                      { icon: I.Pencil, label: "Editar", onClick: () => setMemModal({ mode: "edit", item: { ...m } }) },
                      { icon: m.on ? I.EyeOff : I.Eye, label: m.on ? "Desativar" : "Ativar", onClick: () => setMems((s) => s.map((x) => (x.id === m.id ? { ...x, on: !x.on } : x))) },
                      { icon: I.History, label: "Onde foi usada", onClick: () => toast("Usada em 4 conversas nas últimas semanas.", "info", I.History) },
                      { div: true },
                      { icon: I.Trash2, label: "Excluir", danger: true, onClick: () => setDel(m) },
                    ]} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ INSTRUÇÕES ============ */}
      {tab === "instrucoes" && (
        <div className="mt-5 grid lg:grid-cols-[1fr_340px] gap-4 anim-in items-start">
          <div className="rounded-[10px] border border-line bg-panel p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Apelido do assistente" hint="nome da IA">
                <Input value={inst.name} onChange={(e: any) => setInst({ ...inst, name: e.target.value })} placeholder="Bruce" />
              </Field>
              <Field label="Como te chamar">
                <Input value={inst.call} onChange={(e: any) => setInst({ ...inst, call: e.target.value })} placeholder="Rafael" />
              </Field>
            </div>
            <Field label="Tom de conversa">
              <Seg s="sm" val={inst.tone} onChange={(v: string) => setInst({ ...inst, tone: v })}
                opts={["Formal", "Casual", "Direto", "Engraçado"].map((t) => ({ v: t, l: t }))} />
            </Field>
            <Field label="Idioma preferido">
              <Select value={inst.lang} onChange={(v: string) => setInst({ ...inst, lang: v })}
                opts={[{ v: "pt-BR", l: "Português (Brasil)" }, { v: "en", l: "English" }, { v: "es", l: "Español" }]} />
            </Field>
            <Field label="Instruções personalizadas" hint={`${inst.custom.length}/500`}>
              <Textarea rows={5} maxLength={500} value={inst.custom} onChange={(e: any) => setInst({ ...inst, custom: e.target.value })}
                placeholder="Ex.: Sempre responda em tópicos curtos. Me avise antes de enviar qualquer e-mail." />
            </Field>
            <div className="flex justify-end">
              <Btn v="p" icon={I.Save} onClick={() => { setAssistant(inst.name || "Bruce"); toast("Instruções salvas. A IA vai seguir esse comportamento."); }}>
                Salvar alterações
              </Btn>
            </div>
          </div>

          {/* pré-visualização */}
          <div className="rounded-[10px] border border-line bg-panel p-4 lg:sticky lg:top-6">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-faint mb-3">Pré-visualização da IA</div>
            <div className="rounded-lg bg-soft/60 border border-line p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-ink text-bg dark:bg-acc-800 dark:text-acc-100 flex items-center justify-center"><Ic n={I.Sparkles} s={13} /></span>
                <div>
                  <div className="text-[12.5px] font-semibold">{inst.name || "Bruce"}</div>
                  <div className="text-[10.5px] text-faint">tom {inst.tone.toLowerCase()} · {inst.lang === "pt-BR" ? "pt-BR" : inst.lang}</div>
                </div>
              </div>
              <div className="text-[12.5px] leading-relaxed">
                {inst.tone === "Formal" && `Olá, ${inst.call}. Como posso ajudá-lo hoje?`}
                {inst.tone === "Casual" && `Oi, ${inst.call}! Manda a mensagem que eu te ajudo. 😊 — ah, sem emoji, confere? Pronto: o que precisas?`}
                {inst.tone === "Direto" && `${inst.call}: o que você precisa? Respondo em tópicos, sem enrolação.`}
                {inst.tone === "Engraçado" && `E aí, ${inst.call}! Prontinho pra mais um dia de prod — ou de procrastinação assistida.`}
              </div>
              {inst.custom && (
                <div className="rounded-md bg-panel border border-line px-2.5 py-2 text-[11px] text-mut leading-relaxed">
                  <b className="text-faint font-medium uppercase text-[9.5px] tracking-wide block mb-1">Instruções ativas</b>
                  {inst.custom}
                </div>
              )}
            </div>
            <p className="mt-3 text-[11px] text-faint leading-relaxed">Essas instruções têm prioridade sobre o padrão em todas as conversas e automações.</p>
          </div>
        </div>
      )}

      {/* ============ TEMA ============ */}
      {tab === "tema" && (
        <div className="mt-5 grid lg:grid-cols-2 gap-4 anim-in items-start">
          <div className="rounded-[10px] border border-line bg-panel p-5">
            <div className="text-[13.5px] font-semibold mb-3">Tema</div>
            <div className="grid grid-cols-2 gap-3">
              {([["light", "Claro", I.Sun], ["dark", "Escuro", I.Moon]] as const).map(([v, l, ic]) => (
                <button key={v} onClick={() => { setTheme(v); toast(`Tema ${l.toLowerCase()} aplicado.`); }}
                  className={cx("rounded-xl border p-3 text-left transition-colors cursor-pointer", theme === v ? "border-acc-500 bg-acc-100/40 dark:bg-acc-950/40" : "border-line hover:border-line2")}>
                  <div className={cx("h-16 rounded-lg border overflow-hidden relative", v === "light" ? "bg-white border-neutral-200" : "bg-[#0c0f14] border-[#232a35]")}>
                    <div className={cx("absolute inset-y-0 left-0 w-1/4 border-r", v === "light" ? "bg-neutral-50 border-neutral-100" : "bg-[#12161d] border-[#232a35]")} />
                    <div className="absolute left-1/4 right-2 top-2 space-y-1">
                      <div className={cx("h-2 rounded w-3/4", v === "light" ? "bg-neutral-200" : "bg-[#313a49]")} />
                      <div className={cx("h-2 rounded w-1/2", v === "light" ? "bg-[#e4ecf4]" : "bg-[#223146]")} />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[13px] font-medium">
                    <Ic n={ic} s={14} c={theme === v ? "text-acc-600 dark:text-acc-300" : "text-mut"} />{l}
                    {theme === v && <Ic n={I.Check} s={13} c="text-acc-600 dark:text-acc-300 ml-auto" />}
                  </div>
                </button>
              ))}
            </div>
            <button className="w-full mt-3 rounded-xl border border-dashed border-line2 p-3 text-left hover:border-line2 transition-colors cursor-pointer"
              onClick={() => toast("Temas coloridos chegam em uma próxima atualização.", "info", I.Palette)}>
              <div className="flex items-center gap-1.5">
                {["#40668a", "#7a5c9e", "#5c7a5e", "#9e7a5c"].map((c) => <span key={c} className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: c }} />)}
                <span className="text-[12.5px] font-medium text-mut ml-1.5">Mais temas coloridos</span>
                <Badge v="n" c="ml-auto">Em breve</Badge>
              </div>
            </button>
          </div>

          <div className="rounded-[10px] border border-line bg-panel p-5 space-y-5">
            <div>
              <div className="text-[13.5px] font-semibold mb-2">Tamanho da fonte</div>
              <Seg s="sm" val={font} onChange={(v: string) => { setFont(v); toast(`Tamanho da fonte: ${v}.`, "info"); }}
                opts={[{ v: "pequeno", l: "Pequeno" }, { v: "padrao", l: "Padrão" }, { v: "grande", l: "Grande" }]} />
              <div className="mt-3 rounded-lg bg-soft/60 border border-line px-3.5 py-3" style={{ fontSize: font === "pequeno" ? 12 : font === "grande" ? 16.5 : 14 }}>
                <div className="font-medium">Prévia: “Você tem 3 prioridades hoje…”</div>
                <div className="text-mut mt-1 text-[0.92em]">As respostas da IA aparecem neste tamanho em toda a plataforma.</div>
              </div>
            </div>
            <div>
              <div className="text-[13.5px] font-semibold mb-2">Densidade</div>
              <Seg s="sm" val={density} onChange={(v: string) => { setDensity(v); toast(`Densidade: ${v}.`, "info"); }}
                opts={[{ v: "compacto", l: "Compacto" }, { v: "confortavel", l: "Confortável" }]} />
              <div className="mt-3 rounded-lg border border-line overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={cx("flex items-center gap-2.5 border-b border-line last:border-0 bg-panel", density === "compacto" ? "px-3 py-1.5" : "px-3 py-3")}>
                    <span className="h-6 w-6 rounded-md bg-soft border border-line" />
                    <div className="flex-1"><div className={cx("rounded bg-soft", density === "compacto" ? "h-2 w-1/3" : "h-2.5 w-1/3")} /><div className={cx("mt-1 rounded bg-soft/70", density === "compacto" ? "h-1.5 w-2/3" : "h-2 w-2/3")} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end"><Btn v="p" icon={I.Save} onClick={() => toast("Aparência salva.")}>Salvar aparência</Btn></div>
          </div>
        </div>
      )}

      {/* modal memória */}
      <Modal open={!!memModal} onClose={() => setMemModal(null)} title={memModal?.item.id ? "Editar memória" : "Nova memória"}
        sub={memModal?.item.id ? "A alteração vale a partir da próxima resposta da IA." : "A IA passa a usar esta informação como contexto."}
        foot={<><Btn v="g" onClick={() => setMemModal(null)}>Cancelar</Btn><Btn v="p" icon={I.Save} onClick={saveMem}>Salvar memória</Btn></>}>
        {memModal && (
          <div className="space-y-3.5">
            <Field label="Conteúdo" req>
              <Textarea rows={3} value={memModal.item.text} onChange={(e: any) => setMemModal({ ...memModal, item: { ...memModal.item, text: e.target.value } })} placeholder="Ex.: Gosto de receber respostas diretas." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <Select value={memModal.item.type} onChange={(v: string) => setMemModal({ ...memModal, item: { ...memModal.item, type: v } })}
                  opts={["Pessoal", "Preferências", "Trabalho", "Outros"].map((t) => ({ v: t, l: t }))} />
              </Field>
              <Field label="Origem" hint={memModal.item.id ? "fixa" : "manual"}>
                <Select value={memModal.item.src} disabled onChange={() => {}} opts={[{ v: "Manual", l: "Manual" }, { v: "Automática", l: "Automática" }]} />
              </Field>
            </div>
          </div>
        )}
      </Modal>

      {/* excluir */}
      {del && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setDel(null)} />
          <div className="relative w-full max-w-[380px] bg-panel border border-line rounded-xl shadow-2xl anim-pop p-5">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg bg-danger-soft text-danger flex items-center justify-center"><Ic n={I.Trash2} s={17} /></span>
              <h3 className="text-[15px] font-semibold">Excluir memória?</h3>
            </div>
            <p className="text-[12.5px] text-mut mt-3 leading-relaxed">“{del.text}” será esquecida de forma permanente. A IA deixará de usá-la como contexto.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Btn v="g" onClick={() => setDel(null)}>Cancelar</Btn>
              <Btn v="d" onClick={() => { setMems((s) => s.filter((x) => x.id !== del.id)); setDel(null); toast("Memória excluída.", "info", I.Trash2); }}>Excluir</Btn>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
