"use client";
import Link from "next/link";
import * as I from "lucide-react";
import { Ic, Btn } from "@/components/ui";
import { Logo } from "@/components/shell";

export default function AuthErrorPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg px-4 text-center">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-[400px] rounded-xl border border-line bg-panel p-7 anim-up">
        <div className="h-12 w-12 rounded-xl bg-danger-soft text-danger flex items-center justify-center mx-auto mb-4">
          <Ic n={I.ShieldX} s={22} />
        </div>
        <h1 className="text-[18px] font-semibold tracking-tight">Sessão expirada</h1>
        <p className="text-[13px] text-mut mt-2 leading-relaxed">
          Sua sessão foi encerrada por segurança. Entre novamente para continuar de onde parou — suas conversas e memórias continuam salvas.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link href="/login" className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg bg-ink text-bg text-[13.5px] font-medium hover:opacity-85">
            <Ic n={I.LogIn} s={15} />Entrar novamente
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg text-[13.5px] font-medium text-mut hover:bg-soft">
            Criar uma nova conta
          </Link>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-faint">Erro de autenticação · sessão 8f3a21</p>
    </div>
  );
}
