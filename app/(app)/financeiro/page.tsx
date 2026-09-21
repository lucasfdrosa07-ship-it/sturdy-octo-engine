"use client";
import React, { useMemo, useState } from "react";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import {
  PageHead, Search, Select, Btn, Menu, Badge, Drawer, Field, Input, Tabs,
  Stat, Ic, cx, Empty, dBR, Toggle,
} from "@/components/ui";
import { FIN, CATS, brl, faturaStatus } from "@/lib/mock";
import { useApp } from "@/lib/store";

const STATUS: any = {
  pago: { l: "Pago", v: "o" },
  pendente: { l: "Pendente", v: "n" },
  atrasado: { l: "Atrasado", v: "d" },
};

type Item = any;

function StatusBadge({ s }: { s: string }) {
  const st = STATUS[s];
  return <Badge v={st.v}>{st.l}</Badge>;
}

function daysTo(due: string) {
  const d = new Date(due + "T00:00:00");
  const today = new Date("2026-09-21T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export default function FinanceiroPage() {
  const { toast } = useApp();
  const [tab, setTab] = useState<"faturas" | "gastos" | "recebimentos">("faturas");
  const [q, setQ] = useState("");
  const [fMonth, setFMonth] = useState("set26");
  const [fCat, setFCat] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [items, setItems] = useState<Record<string, Item[]>>(FIN as any);
  const [form, setForm] = useState<any>(null); // {mode:'new'|'edit', item}
  const [detail, setDetail] = useState<Item | null>(null);
  const [del, setDel] = useState<Item | null>(null);
  const [receipt, setReceipt] = useState<Item | null>(null);

  const list = useMemo(() => {
    let l = items[tab].filter((x: Item) =>
      x.desc.toLowerCase().includes(q.toLowerCase()) &&
      (fCat === "all" || x.cat === fCat)
    );
    if (tab === "faturas") l = l.filter((x: Item) => (fStatus === "all" ? true : faturaStatus(x) === fStatus));
    if (fMonth === "ago26") l = l.filter((x: Item) => (x.due || x.date)?.startsWith("2026-08"));
    if (fMonth === "set26") l = l.filter((x: Item) => (x.due || x.date)?.startsWith("2026-09"));
    return l;
  }, [items, tab, q, fCat, fStatus, fMonth]);

  const totals = useMemo(() => {
    const f = items.faturas;
    const open = f.filter((x: Item) => !x.paid).reduce((s: number, x: Item) => s + x.amount, 0);
    const paid = f.filter((x: Item) => x.paid).reduce((s: number, x: Item) => s + x.amount, 0);
    const rec = items.recebimentos.reduce((s: number, x: Item) => s + x.amount, 0);
    const gastos = items.gastos.reduce((s: number, x: Item) => s + x.amount, 0);
    return { open, paid, rec, saldo: rec - paid - gastos };
  }, [items]);

  function openNew() {
    setForm({ mode: "new", item: { desc: "", amount: "", cat: "Outros", due: "2026-10-01", paid: "", rec: "Sem recorrência", remind: tab !== "recebimentos" } });
  }
  function save() {
    const it = { ...form.item, amount: parseFloat(String(form.item.amount).replace(",", ".")) || 0, id: "x" + Date.now() };
    setItems((s) => ({ ...s, [tab]: form.mode === "edit" ? s[tab].map((x) => (x.id === it.id ? { ...x, ...it } : x)) : [it, ...s[tab]] }));
    toast(form.mode === "edit" ? "Registro atualizado." : "Registro criado. A IA já o conhece para seus alertas.");
    setForm(null);
  }
  function markPaid(it: Item) {
    setItems((s) => ({ ...s, faturas: s.faturas.map((x) => (x.id === it.id ? { ...x, paid: "2026-09-21" } : x)) }));
    toast(`“${it.desc}” marcado como pago.`);
  }

  const empty = list.length === 0;
  const catOpts = [{ v: "all", l: "Todas as categorias" }, ...CATS.map((c) => ({ v: c, l: c }))];

  return (
    <Page>
      <PageHead title="Financeiro" sub="Faturas, gastos e recebimentos. A IA usa estes dados para avisos e respostas."
        actions={<Btn v="p" icon={I.Plus} className="max-sm:hidden" onClick={openNew}>Novo registro</Btn>} />

      {/* alerta da IA */}
      <div className="mt-5 rounded-[10px] border border-acc-200 dark:border-acc-900 bg-acc-50 dark:bg-acc-950/40 px-4 py-3 flex items-center gap-3 anim-in">
        <span className="h-8 w-8 rounded-lg bg-panel border border-line flex items-center justify-center shrink-0"><Ic n={I.Bell} s={15} c="text-acc-600 dark:text-acc-300" /></span>
        <div className="flex-1 text-[12.5px] leading-snug min-w-0">
          <b>2 pagamentos vencem nos próximos 3 dias:</b> <span className="text-mut">Netflix (R$ 44,90, 23/09) e Enel (R$ 180,32, 24/09). A fatura do Banrisul está em atraso desde 15/09.</span>
        </div>
        <Btn s="xs" v="o" className="shrink-0" onClick={() => { setTab("faturas"); setFStatus("all"); }}>Ver faturas</Btn>
      </div>

      {/* resumo */}
      <div className="mt-4 grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat icon={I.Wallet} label="Total a pagar no mês" value={brl(totals.open)} sub="4 faturas em aberto" subTone="text-warn" />
        <Stat icon={I.CheckCircle2} label="Total já pago" value={brl(totals.paid)} sub="3 pagamentos neste mês" />
        <Stat icon={I.TrendingUp} label="Total recebido" value={brl(totals.rec)} sub="salário + freelance" />
        <Stat icon={I.PiggyBank} label="Saldo do mês" value={brl(totals.saldo)} sub="recebidos − pagos − gastos" subTone="text-ok" />
      </div>

      {/* abas */}
      <div className="mt-6">
        <Tabs val={tab} onChange={setTab} tabs={[
          { v: "faturas", l: "Faturas", icon: I.FileText, c: items.faturas.length },
          { v: "gastos", l: "Gastos", icon: I.ShoppingCart, c: items.gastos.length },
          { v: "recebimentos", l: "Recebimentos", icon: I.TrendingUp, c: items.recebimentos.length },
        ]} />
      </div>

      {/* filtros */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Select className="w-[140px]" value={fMonth} onChange={setFMonth} opts={[{ v: "set26", l: "Setembro 2026" }, { v: "ago26", l: "Agosto 2026" }]} />
        <Select className="w-[170px]" value={fCat} onChange={setFCat} opts={catOpts} />
        {tab === "faturas" && (
          <Select className="w-[140px]" value={fStatus} onChange={setFStatus}
            opts={[{ v: "all", l: "Todos os status" }, { v: "pendente", l: "Pendente" }, { v: "atrasado", l: "Atrasado" }, { v: "pago", l: "Pago" }]} />
        )}
        <Search className="w-full sm:w-[220px]" value={q} onChange={(e: any) => setQ(e.target.value)} placeholder="Buscar descrição…" />
      </div>

      {/* lista desktop */}
      <div className="mt-4 hidden md:block rounded-[10px] border border-line bg-panel overflow-hidden">
        {empty ? (
          <Empty icon={I.Wallet} title="Nenhum registro com esses filtros" desc="Ajuste os filtros ou crie um novo registro." action={<Btn s="sm" v="p" icon={I.Plus} onClick={openNew}>Novo registro</Btn>} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b border-line">
                    <th className="th pl-4">Descrição</th>
                    <th className="th">Categoria</th>
                    <th className="th">{tab === "recebimentos" ? "Data" : "Vencimento"}</th>
                    <th className="th">Pagamento</th>
                    <th className="th">Recorrência</th>
                    <th className="th text-right">Valor</th>
                    {tab === "faturas" && <th className="th">Status</th>}
                    <th className="th w-10" />
                  </tr>
                </thead>
                <tbody>
                  {list.map((x: Item) => {
                    const st = tab === "faturas" ? faturaStatus(x) : "pago";
                    const dd = daysTo(x.due);
                    return (
                      <tr key={x.id} className="hover:bg-soft/40 transition-colors cursor-pointer" onClick={() => setDetail(x)}>
                        <td className="td pl-4 font-medium">{x.desc}</td>
                        <td className="td"><Badge v="n">{x.cat}</Badge></td>
                        <td className="td">
                          {dBR(x.due || x.date)}
                          {tab === "faturas" && st === "pendente" && dd <= 3 && dd >= 0 && (
                            <span className="ml-1.5 text-[11px] text-warn font-medium">{dd === 0 ? "hoje" : `em ${dd}d`}</span>
                          )}
                        </td>
                        <td className="td text-mut">{x.paid ? dBR(x.paid) : "—"}</td>
                        <td className="td">{x.rec ? <span className="inline-flex items-center gap-1 text-[12px] text-mut"><Ic n={I.Repeat} s={11} c="text-faint" />{x.rec}</span> : <span className="text-faint">—</span>}</td>
                        <td className={cx("td text-right font-semibold tabular-nums", tab === "recebimentos" && "text-ok")}>
                          {tab === "recebimentos" && "+"}{brl(x.amount)}
                        </td>
                        {tab === "faturas" && <td className="td"><StatusBadge s={st} /></td>}
                        <td className="td" onClick={(e) => e.stopPropagation()}>
                          <Menu items={[
                            { icon: I.Pencil, label: "Editar", onClick: () => setForm({ mode: "edit", item: { ...x, amount: x.amount } }) },
                            ...(tab === "faturas" && x.paid ? [] : [{ icon: I.CheckCircle2, label: "Marcar como pago", onClick: () => markPaid(x) }]),
                            { icon: I.Paperclip, label: "Anexar comprovante", onClick: () => setReceipt(x) },
                            { icon: I.Download, label: "Baixar comprovante", onClick: () => toast("Comprovante baixado (simulação).", "info", I.Download) },
                            { div: true },
                            { icon: I.Trash2, label: "Excluir", danger: true, onClick: () => setDel(x) },
                          ]} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* cards mobile */}
      <div className="mt-4 md:hidden space-y-2.5">
        {empty && <div className="rounded-[10px] border border-line bg-panel"><Empty icon={I.Wallet} title="Nenhum registro com esses filtros" /></div>}
        {list.map((x: Item) => {
          const st = tab === "faturas" ? faturaStatus(x) : "pago";
          return (
            <div key={x.id} className="rounded-[10px] border border-line bg-panel p-3.5 flex items-center gap-3">
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetail(x)}>
                <div className="text-[13.5px] font-medium truncate">{x.desc}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge v="n">{x.cat}</Badge>
                  {tab === "faturas" && <StatusBadge s={st} />}
                  <span className="text-[11px] text-faint">{dBR(x.due || x.date)}</span>
                </div>
              </div>
              <div className={cx("text-[14px] font-semibold tabular-nums shrink-0", tab === "recebimentos" && "text-ok")}>
                {tab === "recebimentos" && "+"}{brl(x.amount)}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB mobile */}
      <button onClick={openNew} aria-label="Novo registro"
        className="md:hidden fixed bottom-[74px] right-4 z-30 h-13 w-13 p-3.5 rounded-full bg-ink text-bg shadow-lg flex items-center justify-center cursor-pointer">
        <Ic n={I.Plus} s={22} />
      </button>

      {/* drawer criar/editar */}
      <Drawer open={!!form} onClose={() => setForm(null)}
        title={form?.mode === "edit" ? "Editar registro" : "Novo registro"}
        sub={tab === "faturas" ? "Fatura em aberto" : tab === "gastos" ? "Gasto" : "Recebimento"}
        foot={<><Btn v="g" onClick={() => setForm(null)}>Cancelar</Btn><Btn v="p" icon={I.Save} onClick={save}>{form?.mode === "edit" ? "Salvar alterações" : "Criar registro"}</Btn></>}>
        {form && (
          <div className="space-y-3.5">
            <Field label="Descrição" req>
              <Input value={form.item.desc} onChange={(e: any) => setForm({ ...form, item: { ...form.item, desc: e.target.value } })} placeholder="Ex.: Enel — Energia elétrica" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Valor (R$)" req>
                <Input inputMode="decimal" value={form.item.amount} onChange={(e: any) => setForm({ ...form, item: { ...form.item, amount: e.target.value } })} placeholder="0,00" />
              </Field>
              <Field label="Categoria">
                <Select value={form.item.cat} onChange={(v: string) => setForm({ ...form, item: { ...form.item, cat: v } })}
                  opts={CATS.map((c) => ({ v: c, l: c })).concat({ v: "__new", l: "+ Nova categoria…" })} />
              </Field>
            </div>
            {form.item.cat === "__new" && (
              <Field label="Nome da nova categoria" hint="será salva para reuso">
                <Input placeholder="Ex.: Pets" />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label={tab === "recebimentos" ? "Data do recebimento" : "Data de vencimento"}>
                <Input type="date" value={form.item.due || "2026-10-01"} onChange={(e: any) => setForm({ ...form, item: { ...form.item, due: e.target.value } })} />
              </Field>
              <Field label={tab === "recebimentos" ? "Data do crédito" : "Data de pagamento"} hint="opcional">
                <Input type="date" value={form.item.paid || ""} onChange={(e: any) => setForm({ ...form, item: { ...form.item, paid: e.target.value || null } })} />
              </Field>
            </div>
            <Field label="Recorrência" hint="repetição automática">
              <Select value={form.item.rec} onChange={(v: string) => setForm({ ...form, item: { ...form.item, rec: v } })}
                opts={["Sem recorrência", "Diária", "Semanal", "Mensal", "Anual"].map((r) => ({ v: r, l: r }))} />
            </Field>
            {tab !== "recebimentos" && (
              <div className="flex items-center justify-between rounded-lg border border-line bg-soft/50 px-3.5 py-3">
                <div>
                  <div className="text-[13px] font-medium flex items-center gap-1.5"><Ic n={I.Bell} s={13} c="text-acc-600 dark:text-acc-300" />Lembrete da IA</div>
                  <div className="text-[11.5px] text-mut mt-0.5">Avisar no Chat 3 dias antes do vencimento</div>
                </div>
                <Toggle on={form.item.remind} onChange={(v: boolean) => setForm({ ...form, item: { ...form.item, remind: v } })} />
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* drawer detalhe */}
      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.desc || ""} sub={detail ? `${detail.cat} · ${dBR(detail.due || detail.date)}` : ""}
        foot={detail && <>
          <Btn v="dg" icon={I.Trash2} className="mr-auto" onClick={() => { setDel(detail); setDetail(null); }}>Excluir</Btn>
          {tab === "faturas" && !detail.paid && <Btn v="o" icon={I.CheckCircle2} onClick={() => { markPaid(detail); setDetail(null); }}>Marcar como pago</Btn>}
          <Btn v="p" icon={I.Pencil} onClick={() => { setForm({ mode: "edit", item: { ...detail, amount: detail.amount } }); setDetail(null); }}>Editar</Btn>
        </>}>
        {detail && (
          <div className="space-y-4">
            <div className="text-[28px] font-semibold tracking-tight tabular-nums">{brl(detail.amount)}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-line bg-soft/50 p-3">
                <div className="text-[10.5px] uppercase tracking-wide text-faint font-medium">{tab === "recebimentos" ? "Data" : "Vencimento"}</div>
                <div className="text-[13px] font-medium mt-1">{dBR(detail.due || detail.date)}</div>
              </div>
              <div className="rounded-lg border border-line bg-soft/50 p-3">
                <div className="text-[10.5px] uppercase tracking-wide text-faint font-medium">Pagamento</div>
                <div className="text-[13px] font-medium mt-1">{detail.paid ? dBR(detail.paid) : "Aguardando"}</div>
              </div>
              <div className="rounded-lg border border-line bg-soft/50 p-3">
                <div className="text-[10.5px] uppercase tracking-wide text-faint font-medium">Recorrência</div>
                <div className="text-[13px] font-medium mt-1 flex items-center gap-1.5">{detail.rec ? <><Ic n={I.Repeat} s={12} />{detail.rec}</> : "Único"}</div>
              </div>
              <div className="rounded-lg border border-line bg-soft/50 p-3">
                <div className="text-[10.5px] uppercase tracking-wide text-faint font-medium">Status</div>
                <div className="mt-1.5">{tab === "faturas" ? <StatusBadge s={faturaStatus(detail)} /> : <Badge v="o">Recebido</Badge>}</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-faint font-medium mb-1.5">Comprovante</div>
              {detail.paid ? (
                <div className="rounded-lg border border-line p-4 flex items-center gap-3">
                  <span className="h-10 w-10 rounded-lg bg-ok-soft text-ok flex items-center justify-center"><Ic n={I.FileCheck2} s={18} /></span>
                  <div className="flex-1">
                    <div className="text-[12.5px] font-medium">comprovante-{detail.id}.pdf</div>
                    <div className="text-[11px] text-faint">148 KB · anexado em {dBR(detail.paid)}</div>
                  </div>
                  <Btn s="xs" onClick={() => toast("Comprovante baixado (simulação).", "info", I.Download)}>Baixar</Btn>
                </div>
              ) : (
                <button onClick={() => setReceipt(detail)} className="w-full rounded-lg border border-dashed border-line2 p-4 text-[12px] text-mut hover:text-ink hover:border-acc-400 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Ic n={I.Upload} s={14} />Anexar comprovante
                </button>
              )}
            </div>
            <div className="rounded-lg bg-acc-50 dark:bg-acc-950/40 border border-acc-200 dark:border-acc-900 px-3.5 py-3 text-[12px] text-mut leading-relaxed">
              <b className="text-ink flex items-center gap-1.5 mb-1"><Ic n={I.Sparkles} s={12} c="text-acc-600 dark:text-acc-300" />Como a IA usa isso</b>
              Este registro entra no contexto das respostas e dos alertas automáticos: a IA o usou 4 vezes no mês (2 no chat, 2 em automações).
            </div>
          </div>
        )}
      </Drawer>

      {/* anexar comprovante */}
      <Drawer open={!!receipt} onClose={() => setReceipt(null)} title="Anexar comprovante" sub={receipt?.desc} w="sm:w-[420px]">
        <button onClick={() => { setReceipt(null); toast("Comprovante anexado e processado.", "info", I.FileCheck2); }}
          className="w-full rounded-xl border-2 border-dashed border-line2 hover:border-acc-400 p-8 flex flex-col items-center text-center transition-colors cursor-pointer">
          <Ic n={I.UploadCloud} s={24} c="text-faint" />
          <div className="text-[13px] font-medium mt-2.5">Arraste o arquivo aqui ou clique</div>
          <div className="text-[11.5px] text-faint mt-1">PDF, JPG ou PNG · até 10 MB</div>
        </button>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-line p-2.5 text-[12px] text-mut">
            <Ic n={I.FileText} s={15} c="text-faint" /><span className="flex-1">comprovante-antigo.pdf</span><Badge v="n">2,1 MB</Badge>
          </div>
        </div>
      </Drawer>

      {/* excluir */}
      {del && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setDel(null)} />
          <div className="relative w-full max-w-[380px] bg-panel border border-line rounded-xl shadow-2xl anim-pop p-5">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg bg-danger-soft text-danger flex items-center justify-center"><Ic n={I.Trash2} s={17} /></span>
              <h3 className="text-[15px] font-semibold">Excluir registro?</h3>
            </div>
            <p className="text-[12.5px] text-mut mt-3 leading-relaxed">“<b className="text-ink">{del.desc}</b>” será removido e a IA deixará de usá-lo em respostas e alertas.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Btn v="g" onClick={() => setDel(null)}>Cancelar</Btn>
              <Btn v="d" onClick={() => {
                setItems((s) => ({ ...s, [tab]: s[tab].filter((x) => x.id !== del.id) }));
                setDel(null); toast("Registro excluído.", "info", I.Trash2);
              }}>Excluir</Btn>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
