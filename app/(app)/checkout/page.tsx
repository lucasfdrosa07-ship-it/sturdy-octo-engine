"use client";
import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import { PageHead, Btn, Badge, Field, Input, Ic, cx, QrFake } from "@/components/ui";
import { PLANS, brl, fmt } from "@/lib/mock";
import { useApp } from "@/lib/store";

function CheckoutInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user, setUser, toast } = useApp();
  const plan = (sp.get("plano") === "pro" ? "pro" : "plus") as "plus" | "pro";
  const P = PLANS[plan];
  const [credits, setCredits] = useState(parseInt(sp.get("creditos") || "10000"));
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"cartao" | "pix" | "boleto">("cartao");
  const [card, setCard] = useState({ num: "4242 4242 4242 4242", name: "RAFAEL SOUZA", exp: "08/27", cvv: "123" });
  const [processing, setProcessing] = useState(false);
  const [pixPaid, setPixPaid] = useState(false);
  const price = P.tiers.find((t: any) => t.c === credits)?.p ?? P.tiers[0].p;
  const pixCode = useMemo(() => `00020126580014BR.GOV.BCB.PIX0136aura-${plan}-${credits}5204000053039865802BR5906AURA6009PORTO ALG62070503***6304A1B2`, [plan, credits]);

  function pay() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setUser({ ...user, plan, credits, price, cancelling: false });
      setStep(3);
      toast(method === "boleto" ? "Boleto gerado. Assinatura ativa após compensação." : "Pagamento aprovado. Assinatura confirmada.");
    }, 1700);
  }

  return (
    <Page>
      <PageHead title="Checkout" sub="Assinatura mensal · renova automaticamente, cancele quando quiser." />

      {/* etapas */}
      <div className="mt-6 flex items-center gap-2 max-w-[560px]">
        {["Plano & créditos", "Pagamento", "Confirmação"].map((l, i) => (
          <React.Fragment key={l}>
            <div className={cx("flex items-center gap-2", i + 1 > step && "opacity-40")}>
              <span className={cx("h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-semibold",
                i + 1 < step ? "bg-ok text-white" : i + 1 === step ? "bg-ink text-bg" : "bg-soft border border-line2 text-mut")}>
                {i + 1 < step ? <Ic n={I.Check} s={13} /> : i + 1}
              </span>
              <span className="text-[12px] font-medium hidden sm:inline">{l}</span>
            </div>
            {i < 2 && <div className={cx("h-px flex-1", i + 1 < step ? "bg-ok" : "bg-line")} />}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        <div className="space-y-4">
          {step === 1 && (
            <div className="rounded-[10px] border border-line bg-panel p-5 anim-in">
              <h3 className="text-[14px] font-semibold">Confirme o plano</h3>
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-line bg-soft/50 p-4">
                <span className="h-11 w-11 rounded-xl bg-ink text-bg dark:bg-acc-800 flex items-center justify-center"><Ic n={I.Gauge} s={19} /></span>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">Plano {P.name} <Badge v="a" c="ml-1">{fmt(credits)} créditos/mês</Badge></div>
                  <div className="text-[12px] text-mut mt-0.5">Renova mensalmente · próxima cobrança em 12/10/2026</div>
                </div>
                <div className="text-[22px] font-semibold tabular-nums">{brl(price)}<span className="text-[11.5px] text-faint font-normal">/mês</span></div>
              </div>
              <div className="mt-4">
                <div className="text-[12px] font-medium mb-1.5">Quantidade de créditos</div>
                <div className="flex flex-wrap gap-1.5">
                  {P.tiers.map((t: any) => (
                    <button key={t.c} onClick={() => setCredits(t.c)}
                      className={cx("h-9 px-3 rounded-lg border text-[12.5px] font-medium transition-colors cursor-pointer tabular-nums",
                        credits === t.c ? "border-ink bg-ink text-bg" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
                      {fmt(t.c)} · {brl(t.p)}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11.5px] text-faint">Limite do plano {P.name}: {plan === "plus" ? "20.000" : "50.000"} créditos. A quantidade só pode diminuir no próximo ciclo.</p>
              </div>
              <div className="flex justify-end mt-5">
                <Btn v="p" icon={I.ArrowRight} onClick={() => setStep(2)}>Continuar para pagamento</Btn>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-[10px] border border-line bg-panel p-5 anim-in">
              <h3 className="text-[14px] font-semibold">Método de pagamento</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {([["cartao", "Cartão", I.CreditCard, "Stripe"], ["pix", "Pix", I.QrCode, "Mercado Pago"], ["boleto", "Boleto", I.Barcode, "Venc. 2 dias úteis"]] as const).map(([v, l, ic, d]) => (
                  <button key={v} onClick={() => setMethod(v)}
                    className={cx("rounded-xl border p-3 text-left transition-colors cursor-pointer", method === v ? "border-acc-500 bg-acc-100/40 dark:bg-acc-950/40" : "border-line hover:border-line2")}>
                    <div className="flex items-center gap-2 text-[13px] font-semibold"><Ic n={ic} s={15} c={method === v ? "text-acc-600 dark:text-acc-300" : "text-mut"} />{l}</div>
                    <div className="text-[10.5px] text-faint mt-1">{d}</div>
                  </button>
                ))}
              </div>

              {method === "cartao" && (
                <div className="mt-4 space-y-3.5 max-w-[440px]">
                  <Field label="Número do cartão">
                    <Input value={card.num} onChange={(e: any) => setCard({ ...card, num: e.target.value })} inputMode="numeric" placeholder="0000 0000 0000 0000" />
                  </Field>
                  <Field label="Nome impresso no cartão">
                    <Input value={card.name} onChange={(e: any) => setCard({ ...card, name: e.target.value.toUpperCase() })} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Validade"><Input value={card.exp} onChange={(e: any) => setCard({ ...card, exp: e.target.value })} placeholder="MM/AA" /></Field>
                    <Field label="CVV"><Input value={card.cvv} onChange={(e: any) => setCard({ ...card, cvv: e.target.value })} inputMode="numeric" placeholder="123" /></Field>
                  </div>
                  <div className="text-[11px] text-faint flex items-center gap-1.5"><Ic n={I.Lock} s={11} />Ambiente seguro processado via Stripe. Seus dados nunca tocam nossos servidores.</div>
                </div>
              )}

              {method === "pix" && (
                <div className="mt-4 max-w-[440px]">
                  <div className="rounded-lg border border-line p-4 flex flex-col items-center">
                    <QrFake seed={pixCode} s={150} />
                    <div className="text-[11px] text-faint mt-2">Escaneie o QR Code ou use o copia e cola</div>
                    <button onClick={() => { navigator.clipboard?.writeText(pixCode).catch(() => {}); toast("Código Pix copiado.", "info", I.Copy); }}
                      className="mt-2.5 w-full h-9 rounded-lg border border-line2 bg-soft/60 text-[11.5px] font-mono text-mut hover:text-ink hover:bg-soft flex items-center justify-center gap-2 cursor-pointer truncate px-3">
                      {pixCode.slice(0, 34)}…<Ic n={I.Copy} s={12} />
                    </button>
                  </div>
                  <div className="mt-3 text-[11.5px] text-faint flex items-center gap-1.5"><Ic n={I.Clock} s={11} />Aprovação em até 1 minuto após o pagamento.</div>
                </div>
              )}

              {method === "boleto" && (
                <div className="mt-4 max-w-[440px] rounded-lg border border-line p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-lg bg-soft border border-line flex items-center justify-center text-mut"><Ic n={I.Barcode} s={18} /></span>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">Boleto para assinatura</div>
                      <div className="text-[11.5px] text-faint mt-0.5">Vence em 2 dias úteis · assinaturas por boleto renovam mensalmente</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-md bg-soft/60 border border-line px-3 py-2 font-mono text-[11px] text-mut break-all">
                    23793.38128 80009.484286 47930.154995 7 9123000000{Math.round(price * 100)}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-5">
                <Btn v="g" icon={I.ArrowLeft} onClick={() => setStep(1)}>Voltar</Btn>
                <Btn v="p" icon={processing ? I.Loader2 : I.Lock} disabled={processing} onClick={pay}>
                  {processing ? "Processando…" : method === "boleto" ? "Gerar boleto" : `Pagar ${brl(price)}`}
                </Btn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-[10px] border border-line bg-panel p-7 text-center anim-in">
              <span className={cx("h-14 w-14 rounded-full flex items-center justify-center mx-auto", method === "boleto" ? "bg-warn-soft text-warn" : "bg-ok-soft text-ok")}>
                <Ic n={method === "boleto" ? I.Clock : I.Check} s={26} sw={2.2} />
              </span>
              <h3 className="text-[18px] font-semibold tracking-tight mt-4">
                {method === "boleto" ? "Boleto gerado com sucesso" : "Assinatura confirmada"}
              </h3>
              <p className="text-[13px] text-mut mt-1.5">
                {method === "boleto" ? "Sua assinatura ativa assim que o boleto compensar (até 2 dias úteis). Você receberá o comprovante por e-mail." : "Sua assinatura foi ativada. Os créditos já estão disponíveis."}
              </p>
              <div className="mt-5 max-w-[380px] mx-auto rounded-lg border border-line divide-y divide-[var(--c-line)] text-left">
                {[
                  ["Plano", `${P.name} · ${fmt(credits)} créditos/mês`],
                  ["Cobrança mensal", `${brl(price)} via ${method === "cartao" ? "cartão •••• " + card.num.slice(-4) : method === "pix" ? "Pix (Mercado Pago)" : "boleto"}`],
                  ["Renovação", "12/10/2026 (mensal, automática)"],
                  ["Consumo", "chat e automações separados, em tempo real"],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-[11.5px] text-faint w-28 shrink-0">{l}</span>
                    <span className="text-[12.5px] font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2">
                <Btn v="p" icon={I.Sparkles} onClick={() => router.push("/chat")}>Começar a usar</Btn>
                <Btn v="o" onClick={() => router.push("/configuracoes?tab=plano")}>Ver Plano & Cobrança</Btn>
              </div>
            </div>
          )}
        </div>

        {/* resumo lateral */}
        <div className="rounded-[10px] border border-line bg-panel p-4 lg:sticky lg:top-6">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-faint mb-3">Resumo</div>
          <div className="space-y-2.5 text-[12.5px]">
            <div className="flex justify-between"><span className="text-mut">Plano</span><b>{P.name}</b></div>
            <div className="flex justify-between"><span className="text-mut">Créditos</span><b>{fmt(credits)}/mês</b></div>
            <div className="flex justify-between"><span className="text-mut">Mensalidade</span><b className="tabular-nums">{brl(price)}</b></div>
            <div className="flex justify-between"><span className="text-mut">Renovação</span><b>12/10/2026</b></div>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-[11px] text-faint leading-relaxed">
            <Ic n={I.ShieldCheck} s={12} c="inline mr-1 text-ok" />
            Cancele quando quiser em Configurações → Plano & Cobrança. Upgrade de créditos vale na hora; downgrade, no próximo ciclo.
          </div>
        </div>
      </div>
    </Page>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-[1200px] mx-auto px-6 py-8" />}>
      <CheckoutInner />
    </Suspense>
  );
}
