"use client";
import Link from "next/link";
import * as I from "lucide-react";
import { Ic } from "@/components/ui";
import { Logo } from "@/components/shell";

export default function FiveHundred() {
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-[420px] rounded-xl border border-line bg-panel p-8 anim-up">
        <div className="h-12 w-12 rounded-xl bg-danger-soft text-danger flex items-center justify-center mx-auto mb-4">
          <Ic n={I.AlertTriangle} s={22} />
        </div>
        <div className="text-[44px] font-semibold tracking-tight text-faint leading-none">500</div>
        <h1 className="text-[17px] font-semibold tracking-tight mt-3">Erro interno do servidor</h1>
        <p className="text-[13px] text-mut mt-2 leading-relaxed">
          Nosso orquestrador de ferramentas encontrou uma falha inesperada. A equipe já foi notificada — seus dados continuam intactos.
        </p>
        <code className="inline-block mt-3 text-[10.5px] font-mono text-faint bg-soft border border-line rounded px-1.5 py-0.5">ref: ERR-2026-0921-A7F3</code>
        <div className="mt-5 flex flex-col gap-2">
          <button onClick={() => window.location.reload()} className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg bg-ink text-bg text-[13.5px] font-medium hover:opacity-85 cursor-pointer">
            <Ic n={I.RefreshCw} s={15} />Recarregar a página
          </button>
          <Link href="/chat" className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg text-[13.5px] font-medium text-mut hover:bg-soft">
            Ir para o Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
