"use client";
import React, { useMemo, useState } from "react";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import { PageHead, Btn, Badge, Toggle, Modal, Drawer, Field, Input, Textarea, Select, Checkbox, Ic, cx, Stat, Empty } from "@/components/ui";
import { AUTOS, AUTO_TASKS, fmt } from "@/lib/mock";
import { useApp } from "@/lib/store";

const TRIGGERS = [
  { v: "schedule", l: "Agendamento", i: I.Clock, d: "Executa em horário fixo: todo dia, dias específicos ou semanal." },
  { v: "event", l: "Evento", i: I.Zap, d: "Executa quando algo acontece: fatura próxima do vencimento, e-mail novo, limite de créditos." },
];

export default function AutomacoesPage() {
  const { toast, user, setRec } = useApp();
  const [autos, setAutos] = useState(AUTOS);
  const [hist, setHist] = useState<any>(null);
  const [wiz, setWiz] = useState<any>(null); // {mode, step, draft}
  const [del, setDel] = useState<any>(null);

  const active = autos.filter((a) => a.on).length;
  const runsMonth = autos.reduce((s, a) => s + (a.runs || []).filter((r: any) => ["21/09", "20/09", "19/09", "18/09", "17/09", "16/09", "15/09"].some((p) => r.d.startsWith(p))).length, 0) + 101;
  const estMonth = autos.filter((a) => a.on).reduce((s, a) => s + parseInt(a.est), 0);

  function toggle(a: any) {
    setAutos((s) => s.map((x) => (x.id === a.id ? { ...x, on: !x.on } : x)));
    toast(a.on ? `“${a.name}” pausada. O consumo recorrente parou.` : `“${a.name}” ativada. Próxima execução: ${a.next}.`, "info", I.Workflow);
  }
  function openWiz(a?: any) {
    setWiz(
      a
        ? { mode: "edit", step: 1, draft: { id: a.id, name: a.name, trigType: a.trigType, sched: "dia", time: "08:00", event: "fatura3", days: "3", tasks: a.tasks, instr: a.desc, on: a.on } }
        : { mode: "new", step: 1, draft: { name: "", trigType: "schedule", sched: "dia", time: "08:00", event: "fatura3", days: "3", tasks: [], instr: "", on: true } }
    );
  }
  function setDraft(d: any) { setWiz((w: any) => ({ ...w, draft: { ...w.draft, ...d } })); }

  function saveWiz() {
    const d = wiz.draft;
    const est = 20 + d.tasks.length * 12;
    const label = d.trigType === "schedule"
      ? (d.sched === "dia" ? "Todo dia" : d.sched === "segunda" ? "Toda segunda" : "Dias escolhidos") + ` às ${d.time}`
      : d.event === "fatura3" ? `Fatura a ${d.days} dias do vencimento` : d.event === "email" ? "Novo e-mail não lido" : "Início da semana";
    if (wiz.mode === "edit") {
      setAutos((s) => s.map((x) => (x.id === d.id ? { ...x, name: d.name || x.name, trig: label, desc: d.instr, tasks: d.tasks, credits: est, est: String(est * 30), on: d.on } : x)));
      toast("Automação atualizada.");
    } else {
      setAutos((s) => [{ id: "a" + Date.now(), name: d.name || "Nova automação", trig: label, trigType: d.trigType, desc: d.instr, tasks: d.tasks, credits: est, last: "—", lastOk: null, next: "aguardando 1º ciclo", est: String(est * 30), on: d.on, runs: [] }, ...s]);
      toast("Automação criada. Cada execução consumirá ~" + est + " créditos.");
    }
    setWiz(null);
  }

  const dEst = wiz ? 20 + wiz.draft.tasks.length * 12 : 0;

  return (
    <Page>
      <PageHead title="Automações" sub="Tarefas executadas pela IA automaticamente, a partir de gatilhos — sem você precisar digitar o comando de novo. Cada execução consome créditos."
        actions={<Btn v="p" icon={I.Plus} onClick={() => openWiz()}>Nova automação</Btn>} />

      <div className="mt-5 grid grid-cols-3 gap-3 max-w-[720px]">
        <Stat icon={I.Workflow} label="Ativas" value={String(active)} sub={`de ${autos.length} criadas`} />
        <Stat icon={I.History} label="Execuções em setembro" value={String(runsMonth)} sub="1 falha (token expirado)" subTone="text-danger" />
        <Stat icon={I.Gauge} label="Consumo recorrente" value={`~${fmt(estMonth)}`} sub="créditos/mês (previsível)" />
      </div>

      {/* lista */}
      <div className="mt-5 space-y-3">
        {autos.length === 0 && (
          <div className="rounded-[10px] border border-line bg-panel">
            <Empty icon={I.Workflow} title="Nenhuma automação criada" desc="Crie fluxos que rodam sozinhos: resumo matinal, alertas de fatura, planejamento semanal."
              action={<Btn s="sm" v="p" icon={I.Plus} onClick={() => openWiz()}>Criar a primeira</Btn>} />
          </div>
        )}
        {autos.map((a: any) => (
          <div key={a.id} className={cx("rounded-[10px] border bg-panel transition-colors", a.on ? "border-line" : "border-line opacity-70")}>
            <div className="p-4 flex items-start gap-3.5">
              <span className={cx("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", a.on ? "bg-acc-100 dark:bg-acc-950 text-acc-700 dark:text-acc-300" : "bg-soft text-faint")}>
                <Ic n={a.icon === "Clock" ? I.Clock : a.icon === "Bell" ? I.Bell : a.icon === "FolderOpen" ? I.FolderOpen : I.CalendarDays} s={17} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold">{a.name}</span>
                  <Badge v={a.on ? "o" : "n"}>{a.on ? "Ativa" : "Pausada"}</Badge>
                  <Badge v="a" icon={I.Gauge}>~{a.credits} créditos/execução</Badge>
                </div>
                <div className="text-[12px] text-mut mt-1 flex items-center gap-1.5">
                  <Ic n={I.Zap} s={11} c="text-faint" />
                  <b className="text-ink/80">{a.trig}</b> · {a.desc}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11.5px] text-faint">
                  <span className="flex items-center gap-1">
                    <Ic n={a.lastOk ? I.CheckCircle2 : I.XCircle} s={11} c={a.lastOk ? "text-ok" : "text-danger"} />
                    Última: {a.last}{!a.lastOk && " — falhou (token expirado)"}
                  </span>
                  <span className="flex items-center gap-1"><Ic n={I.CalendarClock} s={11} />Próxima: {a.next}</span>
                  <span className="flex items-center gap-1"><Ic n={I.TrendingUp} s={11} />Estimativa: {a.est} créditos/mês</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Toggle on={a.on} onChange={() => toggle(a)} />
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-1.5">
                  <Btn s="xs" onClick={() => setHist(a)}>Execuções ({a.runs.length})</Btn>
                  <Btn s="xs" v="g" icon={I.Pencil} onClick={() => openWiz(a)} />
                </div>
                <Btn s="xs" v="g" icon={I.Trash2} c="text-mut hover:text-danger" onClick={() => setDel(a)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* banner consumo */}
      <div className="mt-5 rounded-[10px] border border-line bg-soft/50 px-4 py-3.5 flex items-start gap-3">
        <Ic n={I.Gauge} s={15} c="text-acc-600 dark:text-acc-300 shrink-0 mt-0.5" />
        <div className="text-[12px] text-mut leading-relaxed">
          <b className="text-ink">Consumo previsível:</b> com as {active} automações ativas, a estimativa é de <b className="text-ink">~{fmt(estMonth)} créditos/mês</b> ({Math.round((estMonth / user.credits) * 100)}% do seu plano). O valor é descontado dos créditos do mês e aparece separado do uso via chat em Plano & Cobrança.
          <button onClick={() => (window.location.href = "/configuracoes?tab=plano")} className="ml-1.5 text-acc-600 dark:text-acc-300 font-medium hover:underline cursor-pointer">Ver consumo →</button>
        </div>
      </div>

      {/* wizard */}
      <Modal open={!!wiz} onClose={() => setWiz(null)} w="max-w-xl"
        title={wiz?.mode === "edit" ? "Editar automação" : "Nova automação"}
        sub={wiz ? `Etapa ${wiz.step} de 3 — ${["Gatilho", "Tarefas", "Revisão"][wiz.step - 1]}` : ""}
        foot={wiz && (
          <>
            <Btn v="g" onClick={() => (wiz.step > 1 ? setWiz({ ...wiz, step: wiz.step - 1 }) : setWiz(null))}>{wiz.step > 1 ? "Voltar" : "Cancelar"}</Btn>
            {wiz.step < 3 ? (
              <Btn v="p" icon={I.ArrowRight}
                disabled={wiz.draft.trigType === "schedule" && !wiz.draft.time}
                onClick={() => setWiz({ ...wiz, step: wiz.step + 1 })}>
                Continuar
              </Btn>
            ) : (
              <Btn v="p" icon={I.Sparkles} disabled={!wiz.draft.tasks.length} onClick={saveWiz}>
                {wiz.mode === "edit" ? "Salvar automação" : "Criar automação"}
              </Btn>
            )}
          </>
        )}>
        {wiz && (
          <div className="space-y-4">
            {/* barra de etapas */}
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => <div key={s} className={cx("h-1 flex-1 rounded-full", s <= wiz.step ? "bg-acc-600" : "bg-line")} />)}
            </div>

            {wiz.step === 1 && (
              <>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {TRIGGERS.map((t) => (
                    <button key={t.v} onClick={() => setDraft({ trigType: t.v })}
                      className={cx("rounded-xl border p-3.5 text-left transition-colors cursor-pointer", wiz.draft.trigType === t.v ? "border-acc-500 bg-acc-100/40 dark:bg-acc-950/40" : "border-line hover:border-line2")}>
                      <div className="flex items-center gap-2 text-[13px] font-semibold"><Ic n={t.i} s={15} c="text-acc-600 dark:text-acc-300" />{t.l}{wiz.draft.trigType === t.v && <Ic n={I.Check} s={14} c="text-acc-600 dark:text-acc-300 ml-auto" />}</div>
                      <div className="text-[11.5px] text-mut mt-1.5 leading-snug">{t.d}</div>
                    </button>
                  ))}
                </div>
                {wiz.draft.trigType === "schedule" ? (
                  <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
                    <Field label="Frequência">
                      <Select value={wiz.draft.sched} onChange={(v: string) => setDraft({ sched: v })}
                        opts={[{ v: "dia", l: "Todo dia" }, { v: "segunda", l: "Toda segunda" }, { v: "dias", l: "Dias específicos" }]} />
                    </Field>
                    <Field label="Horário">
                      <Input type="time" value={wiz.draft.time} onChange={(e: any) => setDraft({ time: e.target.value })} />
                    </Field>
                    {wiz.draft.sched === "dias" && (
                      <div className="sm:col-span-2 flex gap-1.5">
                        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d, i) => (
                          <button key={d} onClick={() => toast(`Dia ${d} ${i % 2 ? "desativado" : "ativado"} (demo).`, "info")}
                            className={cx("h-8 flex-1 rounded-lg border text-[12px] font-medium cursor-pointer", i < 5 ? "border-acc-500 bg-acc-100/50 dark:bg-acc-950 text-acc-800 dark:text-acc-200" : "border-line2 text-faint")}>
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-1 space-y-3.5">
                    <Field label="Evento que dispara">
                      <Select value={wiz.draft.event} onChange={(v: string) => setDraft({ event: v })}
                        opts={[
                          { v: "fatura3", l: "Fatura a X dias do vencimento" },
                          { v: "email", l: "Novo e-mail não lido" },
                          { v: "semana", l: "Início da semana (segunda, 7h)" },
                          { v: "creditos", l: "Créditos do plano em < 20%" },
                        ]} />
                    </Field>
                    {wiz.draft.event === "fatura3" && (
                      <Field label="Antecedência (dias)">
                        <Select value={wiz.draft.days} onChange={(v: string) => setDraft({ days: v })} opts={["1", "2", "3", "5", "7"].map((d) => ({ v: d, l: `${d} dia${d !== "1" ? "s" : ""} antes` }))} />
                      </Field>
                    )}
                  </div>
                )}
              </>
            )}

            {wiz.step === 2 && (
              <>
                <Field label="O que a IA deve fazer" hint="selecione uma ou mais tarefas">
                  <div className="space-y-1.5">
                    {AUTO_TASKS.map((t) => (
                      <Checkbox key={t} checked={wiz.draft.tasks.includes(t)}
                        onChange={() => setDraft({ tasks: wiz.draft.tasks.includes(t) ? wiz.draft.tasks.filter((x: string) => x !== t) : [...wiz.draft.tasks, t] })}>
                        {t}
                      </Checkbox>
                    ))}
                  </div>
                </Field>
                <Field label="Instrução livre para a IA" hint="opcional — afina o comportamento">
                  <Textarea rows={3} value={wiz.draft.instr} onChange={(e: any) => setDraft({ instr: e.target.value })}
                    placeholder="Ex.: Resuma apenas e-mails de colegas de trabalho e ignore notificações automáticas." />
                </Field>
                <div className="rounded-lg bg-soft/60 border border-line px-3.5 py-3 text-[11.5px] text-mut flex items-center gap-2">
                  <Ic n={I.Gauge} s={13} c="text-acc-600 dark:text-acc-300" />
                  Estimativa atual: <b className="text-ink">~{dEst} créditos por execução</b> ({wiz.draft.tasks.length} tarefa{wiz.draft.tasks.length !== 1 && "s"} + contexto).
                </div>
              </>
            )}

            {wiz.step === 3 && (
              <>
                <Field label="Nome da automação" req>
                  <Input value={wiz.draft.name} onChange={(e: any) => setDraft({ name: e.target.value })}
                    placeholder={wiz.draft.trigType === "schedule" ? "Ex.: Resumo matinal de e-mails" : "Ex.: Aviso de faturas próximas"} />
                </Field>
                <div className="rounded-lg border border-line divide-y divide-[var(--c-line)]">
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px]">
                    <Ic n={I.Zap} s={13} c="text-faint" /><span className="text-mut w-24 shrink-0">Gatilho</span>
                    <span className="font-medium">{wiz.draft.trigType === "schedule"
                      ? `${wiz.draft.sched === "dia" ? "Todo dia" : wiz.draft.sched === "segunda" ? "Toda segunda" : "Dias escolhidos"} às ${wiz.draft.time}`
                      : wiz.draft.event === "fatura3" ? `Fatura a ${wiz.draft.days} dias do vencimento` : wiz.draft.event === "email" ? "Novo e-mail não lido" : "Início da semana"}</span>
                  </div>
                  <div className="flex items-start gap-2.5 px-3.5 py-2.5 text-[12.5px]">
                    <Ic n={I.ListChecks} s={13} c="text-faint mt-0.5" /><span className="text-mut w-24 shrink-0">Tarefas</span>
                    <span className="leading-relaxed">{wiz.draft.tasks.join(" → ")}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px]">
                    <Ic n={I.Gauge} s={13} c="text-faint" /><span className="text-mut w-24 shrink-0">Créditos</span>
                    <span className="font-medium">~{dEst} por execução · ~{fmt(dEst * 30)}/mês</span>
                  </div>
                </div>
                {dEst * 30 > user.credits * 0.25 && (
                  <div className="rounded-lg border border-warn/40 bg-warn-soft px-3.5 py-2.5 text-[12px] text-mut flex items-start gap-2">
                    <Ic n={I.AlertTriangle} s={13} c="text-warn shrink-0 mt-0.5" />
                    Esta automação usaria mais de 25% dos seus créditos mensais. Considere reduzir a frequência ou escolher outro plano.
                  </div>
                )}
                <label className="flex items-center justify-between rounded-lg border border-line bg-soft/50 px-3.5 py-3 cursor-pointer">
                  <span className="text-[13px] font-medium">Ativar imediatamente</span>
                  <Toggle on={wiz.draft.on} onChange={(v: boolean) => setDraft({ on: v })} />
                </label>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* histórico de execuções */}
      <Drawer open={!!hist} onClose={() => setHist(null)} title={hist?.name || ""} sub={`Histórico de execuções · ~${hist?.credits} créditos cada`}
        foot={hist && <><Btn v="g" icon={I.Trash2} c="mr-auto" onClick={() => { setDel(hist); setHist(null); }}>Excluir automação</Btn>
          <Btn v="p" icon={I.Pencil} onClick={() => { openWiz(hist); setHist(null); }}>Editar</Btn></>}>
        {hist && (
          <div className="rounded-[10px] border border-line overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line bg-soft/40">
                  <th className="th pl-4">Data</th><th className="th">Status</th><th className="th text-right">Créditos</th><th className="th pr-4 text-right">Duração</th>
                </tr>
              </thead>
              <tbody>
                {hist.runs.map((r: any, i: number) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="td pl-4 text-[12.5px]">{r.d}</td>
                    <td className="td">{r.ok ? <Badge v="o" icon={I.CheckCircle2}>Sucesso</Badge> : <Badge v="d" icon={I.XCircle}>Falhou</Badge>}</td>
                    <td className="td text-right tabular-nums">{r.c || "—"}</td>
                    <td className="td pr-4 text-right text-mut">{r.t}</td>
                  </tr>
                ))}
                {hist.runs.length === 0 && (
                  <tr><td className="td pl-4 text-[12.5px] text-faint" colSpan={4}>Ainda não executou. A próxima execução está agendada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {hist && hist.runs.some((r: any) => !r.ok) && (
          <div className="mt-3 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-3 text-[12px] text-mut flex items-start gap-2.5">
            <Ic n={I.XCircle} s={14} c="text-danger shrink-0 mt-0.5" />
            <div className="flex-1">
              Última falha: <b className="text-ink">token expirado</b> na integração usada por esta automação.
              <div className="mt-2"><Btn s="xs" icon={I.Plug} onClick={() => { setRec({ name: "Notion", color: "#191919", sync: "há 3 dias", perm: "Somente leitura" }); setHist(null); }}>Reconectar integração</Btn></div>
            </div>
          </div>
        )}
      </Drawer>

      {/* excluir */}
      {del && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setDel(null)} />
          <div className="relative w-full max-w-[380px] bg-panel border border-line rounded-xl shadow-2xl anim-pop p-5">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg bg-danger-soft text-danger flex items-center justify-center"><Ic n={I.Trash2} s={17} /></span>
              <h3 className="text-[15px] font-semibold">Excluir automação?</h3>
            </div>
            <p className="text-[12.5px] text-mut mt-3 leading-relaxed">“<b className="text-ink">{del.name}</b>” será removida e o consumo recorrente de ~{del.est} créditos/mês deixa de existir. O histórico é mantido por 30 dias.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Btn v="g" onClick={() => setDel(null)}>Cancelar</Btn>
              <Btn v="d" onClick={() => { setAutos((s) => s.filter((x) => x.id !== del.id)); setDel(null); toast("Automação excluída.", "info", I.Trash2); }}>Excluir</Btn>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
