"use client";
import Link from "next/link";
import * as I from "lucide-react";
import { Ic } from "@/components/ui";
import { Logo } from "@/components/shell";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-[420px] rounded-xl border border-line bg-panel p-8 anim-up">
        <div className="text-[52px] font-semibold tracking-tight text-faint leading-none">404</div>
        <h1 className="text-[17px] font-semibold tracking-tight mt-3">Página não encontrada</h1>
        <p className="text-[13px] text-mut mt-2 leading-relaxed">
          O endereço que você tentou acessar não existe ou foi movido. A IA procura a página para você — ou volte para o chat.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link href="/chat" className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg bg-ink text-bg text-[13.5px] font-medium hover:opacity-85">
            <Ic n={I.MessageSquare} s={15} />Ir para o Chat
          </Link>
          <Link href="/configuracoes" className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg text-[13.5px] font-medium text-mut hover:bg-soft">
            Abrir Configurações
          </Link>
        </div>
      </div>
    </div>
  );
}
