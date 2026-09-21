"use client";
import * as I from "lucide-react";
import { Ic } from "@/components/ui";
import { Logo } from "@/components/shell";

const STATUS = [
  { l: "Chat e IA", s: "Operacional", ok: true },
  { l: "Integrações (OAuth)", s: "Operacional", ok: true },
  { l: "Cobrança (Stripe / Mercado Pago)", s: "Operacional", ok: true },
  { l: "Automações (orquestrador)", s: "Em manutenção", ok: false },
];

export default function ManutencaoPage() {
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-4">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-[440px] rounded-xl border border-line bg-panel p-7 anim-up">
        <div className="h-12 w-12 rounded-xl bg-warn-soft text-warn flex items-center justify-center mx-auto">
          <Ic n={I.Wrench} s={22} />
        </div>
        <h1 className="text-[18px] font-semibold tracking-tight text-center mt-4">Manutenção programada</h1>
        <p className="text-[13px] text-mut text-center mt-2 leading-relaxed">
          Estamos melhorando o orquestrador de automações. O chat, as integrações e a cobrança continuam funcionando normalmente.
        </p>
        <div className="mt-5 rounded-lg border border-line divide-y divide-[var(--c-line)]">
          {STATUS.map((s) => (
            <div key={s.l} className="flex items-center justify-between px-3.5 py-2.5 text-[12.5px]">
              <span className="text-mut">{s.l}</span>
              <span className={s.ok ? "text-ok flex items-center gap-1.5 font-medium" : "text-warn flex items-center gap-1.5 font-medium"}>
                <span className={s.ok ? "h-1.5 w-1.5 rounded-full bg-ok" : "h-1.5 w-1.5 rounded-full bg-warn pulse-soft"} />
                {s.s}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-faint">
          <Ic n={I.Clock} s={12} />Retornamos em instantes · janela estimada: 40 min
        </div>
        <p className="mt-3 text-center text-[11px] text-faint">
          As automações agendadas nesta janela serão repostas automaticamente após a conclusão.
        </p>
      </div>
    </div>
  );
}
