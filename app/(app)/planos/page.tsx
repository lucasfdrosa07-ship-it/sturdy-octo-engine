"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import { PageHead, Btn, Badge, Ic, cx } from "@/components/ui";
import { PLANS, brl, fmt } from "@/lib/mock";
import { useApp } from "@/lib/store";

export default function PlanosPage() {
  const { user, toast } = useApp();
  const router = useRouter();
  const [selPlus, setSelPlus] = useState(10000);
  const [selPro, setSelPro] = useState(20000);
  const is = (id: string) => user.plan === id;

  const choose = (plan: "plus" | "pro", credits: number, price: number) => {
    toast(`${plan === "plus" ? "Plano Plus" : "Plano Pro"} · ${fmt(credits)} créditos selecionado.`, "info", I.Gauge);
    router.push(`/checkout?plano=${plan}&creditos=${credits}`);
  };

  return (
    <Page>
      <PageHead title="Planos" sub="Free para começar, Plus e Pro com créditos mensais configuráveis. Quanto mais créditos, maior a mensalidade — você escolhe a quantidade dentro do limite do plano." />

      {/* cards */}
      <div className="mt-6 grid md:grid-cols-3 gap-3 items-stretch">
        {/* FREE */}
        <div className={cx("rounded-xl border bg-panel p-5 flex flex-col", is("free") ? "border-ink" : "border-line")}>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Free</h2>
            {is("free") && <Badge v="n" icon={I.Check}>Seu plano</Badge>}
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[28px] font-semibold tracking-tight">R$ 0</span>
            <span className="text-[12px] text-faint">/mês</span>
          </div>
          <div className="text-[11.5px] text-mut mt-1">1.000 créditos fixos por mês</div>
          <ul className="mt-4 space-y-2 text-[12.5px] text-mut flex-1">
            {[
              [true, "Aura Lite (modelo rápido)"],
              [true, "Até 50 memórias"],
              [true, "Até 3 integrações"],
              [true, "Até 2 automações"],
              [true, "1 GB de armazenamento"],
              [false, "Modelos Pro e créditos extras"],
            ].map(([ok, l]: any, i) => (
              <li key={i} className="flex items-start gap-2">
                <Ic n={ok ? I.Check : I.Minus} s={13} c={ok ? "text-ok" : "text-faint"} />
                <span className={ok ? "" : "text-faint"}>{l}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            {is("free") ? (
              <Btn v="o" className="w-full" disabled>Plano atual</Btn>
            ) : (
              <Btn v="o" className="w-full" onClick={() => { toast("Downgrade para o Free entra em vigor no próximo ciclo.", "info", I.ChevronDown); }}>
                Fazer downgrade
              </Btn>
            )}
          </div>
        </div>

        {/* PLUS */}
        <div className={cx("relative rounded-xl border bg-panel p-5 flex flex-col", is("plus") ? "border-ink" : "border-acc-400/70")}>
          {!is("plus") && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-ink text-bg text-[10px] font-semibold px-2.5 py-1 tracking-wide">MAIS POPULAR</span>}
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Plus</h2>
            {is("plus") && <Badge v="a" icon={I.Check}>Seu plano</Badge>}
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[28px] font-semibold tracking-tight tabular-nums">{brl(PLANS.plus.tiers.find((t: any) => t.c === selPlus)!.p)}</span>
            <span className="text-[12px] text-faint">/mês</span>
          </div>
          <div className="text-[11.5px] text-mut mt-1">escolha sua quantidade de créditos (até 20.000)</div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {PLANS.plus.tiers.map((t: any) => (
              <button key={t.c} onClick={() => setSelPlus(t.c)}
                className={cx("h-9 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer tabular-nums",
                  selPlus === t.c ? "border-ink bg-ink text-bg" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
                {fmt(t.c)}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-[12.5px] text-mut flex-1">
            {[
              [true, "Aura Lite + Aura Standard"],
              [true, "Até 500 memórias"],
              [true, "Até 10 integrações"],
              [true, "Até 10 automações"],
              [true, "20 GB de armazenamento"],
              [true, "Consumo chat/automações separado"],
            ].map(([ok, l]: any, i) => (
              <li key={i} className="flex items-start gap-2"><Ic n={I.Check} s={13} c="text-ok" /><span>{l}</span></li>
            ))}
          </ul>
          <div className="mt-5">
            {is("plus") ? (
              <Btn v="o" className="w-full" onClick={() => choose("plus", selPlus, PLANS.plus.tiers.find((t: any) => t.c === selPlus)!.p)}>
                {selPlus === user.credits ? "Gerenciar créditos" : "Alterar quantidade"}
              </Btn>
            ) : (
              <Btn v="p" className="w-full" icon={I.ArrowRight} onClick={() => choose("plus", selPlus, PLANS.plus.tiers.find((t: any) => t.c === selPlus)!.p)}>
                Escolher Plus
              </Btn>
            )}
          </div>
        </div>

        {/* PRO */}
        <div className={cx("rounded-xl border bg-panel p-5 flex flex-col", is("pro") ? "border-ink" : "border-line")}>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Pro</h2>
            {is("pro") && <Badge v="a" icon={I.Check}>Seu plano</Badge>}
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[28px] font-semibold tracking-tight tabular-nums">{brl(PLANS.pro.tiers.find((t: any) => t.c === selPro)!.p)}</span>
            <span className="text-[12px] text-faint">/mês</span>
          </div>
          <div className="text-[11.5px] text-mut mt-1">escolha sua quantidade de créditos (até 50.000)</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PLANS.pro.tiers.map((t: any) => (
              <button key={t.c} onClick={() => setSelPro(t.c)}
                className={cx("h-8 px-2.5 rounded-lg border text-[11.5px] font-medium transition-colors cursor-pointer tabular-nums",
                  selPro === t.c ? "border-ink bg-ink text-bg" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
                {fmt(t.c)}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-[12.5px] text-mut flex-1">
            {[
              [true, "Todos os modelos (incl. Aura Pro)"],
              [true, "Memórias ilimitadas"],
              [true, "Integrações ilimitadas"],
              [true, "Automações ilimitadas"],
              [true, "200 GB de armazenamento"],
              [true, "Suporte prioritário"],
            ].map(([ok, l]: any, i) => (
              <li key={i} className="flex items-start gap-2"><Ic n={I.Check} s={13} c="text-ok" /><span>{l}</span></li>
            ))}
          </ul>
          <div className="mt-5">
            {is("pro") ? (
              <Btn v="o" className="w-full" onClick={() => choose("pro", selPro, PLANS.pro.tiers.find((t: any) => t.c === selPro)!.p)}>Gerenciar créditos</Btn>
            ) : (
              <Btn v="p" className="w-full" icon={I.ArrowRight} onClick={() => choose("pro", selPro, PLANS.pro.tiers.find((t: any) => t.c === selPro)!.p)}>
                Escolher Pro
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* comparativo */}
      <div className="mt-8">
        <h2 className="text-[15px] font-semibold mb-3">Comparativo completo</h2>
        <div className="rounded-[10px] border border-line bg-panel overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-line">
                <th className="th pl-5 w-[34%]">Recurso</th>
                <th className="th">Free</th>
                <th className="th">Plus</th>
                <th className="th pr-5">Pro</th>
              </tr>
            </thead>
            <tbody className="text-[12.5px]">
              {[
                ["Créditos mensais", "1.000 (fixo)", "5.000 – 20.000 (escolha)", "10.000 – 50.000 (escolha)"],
                ["Modelos de IA", "Aura Lite", "Aura Lite + Standard", "Todos os modelos"],
                ["Memória", "50 memórias", "500 memórias", "Ilimitada"],
                ["Integrações", "3", "10", "Ilimitadas"],
                ["Automações", "2", "10", "Ilimitadas"],
                ["Armazenamento", "1 GB", "20 GB", "200 GB"],
                ["Exportação de dados", "—", "✓", "✓"],
                ["Suporte", "Comunidade", "E-mail", "Prioritário"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="td pl-5 font-medium">{r[0]}</td>
                  <td className="td text-mut">{r[1]}</td>
                  <td className="td text-mut">{r[2]}</td>
                  <td className="td pr-5 text-mut">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* o que são créditos */}
      <div className="mt-6 rounded-[10px] border border-line bg-soft/50 p-5 grid md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-[13.5px] font-semibold flex items-center gap-2"><Ic n={I.Gauge} s={15} c="text-acc-600 dark:text-acc-300" />O que são créditos?</h3>
          <p className="text-[12.5px] text-mut mt-2 leading-relaxed">
            Créditos são a unidade de uso da inteligência. Cada mensagem e cada ação consome créditos conforme o modelo e as ferramentas acionadas. Nos planos pagos, você escolhe a quantidade dentro do limite do plano — quanto maior, maior a mensalidade.
          </p>
        </div>
        <div>
          <h3 className="text-[13.5px] font-semibold flex items-center gap-2"><Ic n={I.Workflow} s={15} c="text-acc-600 dark:text-acc-300" />Chat × Automações</h3>
          <p className="text-[12.5px] text-mut mt-2 leading-relaxed">
            O consumo aparece separado: <b className="text-ink">chat</b> é o que você pede conversando; <b className="text-ink">automações</b> é o gasto recorrente e previsível de tarefas que rodam sozinhas. Você acompanha os dois em Plano & Cobrança.
          </p>
        </div>
      </div>
    </Page>
  );
}
