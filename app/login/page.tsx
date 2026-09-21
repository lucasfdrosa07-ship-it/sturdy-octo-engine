"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Ic, Field, Input, Btn, Modal, cx } from "@/components/ui";
import { Logo } from "@/components/shell";
import { useApp } from "@/lib/store";

function AuthFrame({ children, w = "max-w-[400px]" }: any) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg px-4 py-10">
      <div className="mb-7"><Logo /></div>
      <div className={cx("w-full rounded-xl border border-line bg-panel shadow-sm anim-up", w)}>{children}</div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [forgot, setForgot] = useState(false);
  const [fEmail, setFEmail] = useState("");

  function submit() {
    if (!email.includes("@")) return setErr("Informe um e-mail válido.");
    if (pass.length < 8) return setErr("A senha precisa de pelo menos 8 caracteres.");
    setErr("");
    let first = false;
    try { first = !localStorage.getItem("aura-onboarded"); } catch {}
    toast(`Bem-vindo de volta${first ? "" : ", Rafael"}.`, I.Sparkles);
    router.push(first ? "/onboarding" : "/chat");
  }

  return (
    <AuthFrame>
      <div className="p-6">
        <h1 className="text-[19px] font-semibold tracking-tight">Entrar no Aura</h1>
        <p className="text-[12.5px] text-mut mt-1">Acesse sua IA pessoal.</p>
        <div className="mt-5 space-y-3.5">
          <Field label="E-mail">
            <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" />
          </Field>
          <Field label="Senha" hint={<Link href="/erro-autenticacao" className="text-acc-600 dark:text-acc-300 hover:underline">Esqueci minha senha</Link>}>
            <div className="relative">
              <Input type={show ? "text" : "password"} value={pass} onChange={(e: any) => setPass(e.target.value)}
                onKeyDown={(e: any) => e.key === "Enter" && submit()} placeholder="••••••••" autoComplete="current-password" className="pl-3 pr-10" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-mut cursor-pointer" aria-label={show ? "Esconder senha" : "Mostrar senha"}>
                <Ic n={show ? I.EyeOff : I.Eye} s={15} />
              </button>
            </div>
            {err && <div className="mt-1 text-[11.5px] text-danger flex items-center gap-1"><Ic n={I.AlertCircle} s={11} />{err}</div>}
          </Field>
          <label className="flex items-center gap-2 text-[12.5px] text-mut cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="h-[15px] w-[15px] rounded accent-[#40668a]" />Manter conectado
          </label>
          <Btn v="p" className="w-full" onClick={submit}>Entrar</Btn>
        </div>
        <div className="mt-5 pt-4 border-t border-line text-center text-[12.5px] text-mut">
          Não tem conta? <Link href="/register" className="text-acc-600 dark:text-acc-300 font-medium hover:underline">Criar conta gratuita</Link>
        </div>
      </div>
      <div className="px-6 pb-5">
        <div className="rounded-lg bg-soft border border-line px-3 py-2.5 text-[11.5px] text-faint leading-relaxed">
          <b className="text-mut">Demonstração visual:</b> use qualquer e-mail e senha com 8+ caracteres para explorar a plataforma.
        </div>
      </div>

      <Modal open={forgot} onClose={() => setForgot(false)} title="Recuperar senha" sub="Enviaremos um link de redefinição para o seu e-mail." w="max-w-sm"
        foot={<><Btn v="g" onClick={() => setForgot(false)}>Cancelar</Btn><Btn v="p" onClick={() => { setForgot(false); toast("Link de redefinição enviado (simulação).", "info", I.Mail); }}>Enviar link</Btn></>}>
        <Field label="E-mail da conta" req>
          <Input type="email" value={fEmail} onChange={(e: any) => setFEmail(e.target.value)} placeholder="voce@email.com" />
        </Field>
      </Modal>
    </AuthFrame>
  );
}
