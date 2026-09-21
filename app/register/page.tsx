"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Ic, Field, Input, Btn, Modal, cx, Progress } from "@/components/ui";
import { Logo } from "@/components/shell";
import { useApp } from "@/lib/store";

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}

const TERMS = `Termos de Uso — resumo (demo)

1. O Aura é um assistente pessoal. Você é o único responsável pelo uso da conta.
2. Os créditos mensais variam conforme o plano e a quantidade contratada, e renovam na data da assinatura.
3. As integrações operam apenas com as permissões que você conceder, que podem ser revogadas a qualquer momento.
4. As automações executam em background e consomem créditos a cada execução.
5. Podemos suspender contas em caso de uso abusivo ou fraude.

Política de Privacidade — resumo (demo)

1. Coletamos apenas os dados necessários: identificação, contato e conteúdo que você salvar (notas, arquivos, financeiro, memórias).
2. Não vendemos dados. Nada é usado para treinar modelos sem consentimento explícito.
3. Você pode exportar ou excluir todos os seus dados a qualquer momento em Configurações → Privacidade & LGPD.
4. Dados de uso (créditos, execuções) ficam no Brasil (LGPD).
5. Encerramos o tratamento dos dados em até 30 dias após a exclusão da conta.`;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useApp();
  const [f, setF] = useState({ name: "", email: "", phone: "", birth: "", pass: "" });
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [tOpen, setTOpen] = useState(false);
  const [errs, setErrs] = useState<any>({});
  const st = strength(f.pass);
  const stLabel = ["Muito fraca", "Fraca", "Média", "Boa", "Forte"][st];
  const stTone = ["d", "d", "w", "o", "o"][st];

  function set(k: string, v: string) { setF((x) => ({ ...x, [k]: v })); setErrs((e: any) => ({ ...e, [k]: null })); }

  function submit() {
    const e: any = {};
    if (f.name.trim().split(" ").length < 2) e.name = "Informe seu nome completo.";
    if (!f.email.includes("@")) e.email = "Informe um e-mail válido.";
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Informe um telefone válido.";
    if (!f.birth) e.birth = "Informe sua data de nascimento.";
    if (f.pass.length < 8) e.pass = "A senha precisa de pelo menos 8 caracteres.";
    if (!terms) e.terms = "É necessário aceitar os Termos e a Política de Privacidade.";
    setErrs(e);
    if (Object.keys(e).length) return;
    try { localStorage.setItem("aura-onboarded", "1"); } catch {}
    toast("Conta criada. Vamos te conhecer em 4 passos.", I.Sparkles);
    router.push("/onboarding");
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg px-4 py-10">
      <div className="mb-7"><Logo /></div>
      <div className="w-full max-w-[440px] rounded-xl border border-line bg-panel shadow-sm anim-up">
        <div className="p-6">
          <h1 className="text-[19px] font-semibold tracking-tight">Criar sua conta</h1>
          <p className="text-[12.5px] text-mut mt-1">Pessoal e gratuito para começar. Sem cadastro empresarial.</p>
          <div className="mt-5 space-y-3.5">
            <Field label="Nome completo" req err={errs.name}>
              <Input value={f.name} onChange={(e: any) => set("name", e.target.value)} placeholder="Seu nome e sobrenome" />
            </Field>
            <Field label="E-mail" req err={errs.email}>
              <Input type="email" value={f.email} onChange={(e: any) => set("email", e.target.value)} placeholder="voce@email.com" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Telefone celular" req err={errs.phone}>
                <Input inputMode="tel" value={f.phone} onChange={(e: any) => set("phone", e.target.value)} placeholder="(51) 99999-0000" />
              </Field>
              <Field label="Data de nascimento" req err={errs.birth}>
                <Input type="date" value={f.birth} onChange={(e: any) => set("birth", e.target.value)} />
              </Field>
            </div>
            <Field label="Senha" req hint="mínimo 8 caracteres" err={errs.pass}>
              <div className="relative">
                <Input type={show ? "text" : "password"} value={f.pass} onChange={(e: any) => set("pass", e.target.value)} placeholder="Crie uma senha" className="pr-10" autoComplete="new-password" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-mut cursor-pointer" aria-label={show ? "Esconder senha" : "Mostrar senha"}>
                  <Ic n={show ? I.EyeOff : I.Eye} s={15} />
                </button>
              </div>
              {f.pass && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1"><Progress v={(st / 4) * 100} tone={stTone} h="h-1" /></div>
                  <span className={cx("text-[11px] font-medium", st >= 3 ? "text-ok" : st === 2 ? "text-warn" : "text-danger")}>{stLabel}</span>
                </div>
              )}
            </Field>
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={terms} onChange={(e) => { setTerms(e.target.checked); setErrs((x: any) => ({ ...x, terms: null })); }}
                  className="mt-0.5 h-[15px] w-[15px] rounded accent-[#40668a]" />
                <span className="text-[12.5px] text-mut leading-snug">
                  Li e aceito os <button type="button" onClick={(e) => { e.preventDefault(); setTOpen(true); }} className="text-acc-600 dark:text-acc-300 font-medium hover:underline">Termos de Uso</button> e a <button type="button" onClick={(e) => { e.preventDefault(); setTOpen(true); }} className="text-acc-600 dark:text-acc-300 font-medium hover:underline">Política de Privacidade</button>.
                </span>
              </label>
              {errs.terms && <div className="mt-1 text-[11.5px] text-danger flex items-center gap-1"><Ic n={I.AlertCircle} s={11} />{errs.terms}</div>}
            </div>
            <Btn v="p" className="w-full" onClick={submit}>Criar conta</Btn>
          </div>
          <div className="mt-5 pt-4 border-t border-line text-center text-[12.5px] text-mut">
            Já tem conta? <Link href="/login" className="text-acc-600 dark:text-acc-300 font-medium hover:underline">Entrar</Link>
          </div>
        </div>
      </div>

      <Modal open={tOpen} onClose={() => setTOpen(false)} title="Termos de Uso e Política de Privacidade" w="max-w-xl">
        <pre className="text-[12.5px] text-mut whitespace-pre-wrap font-sans leading-relaxed">{TERMS}</pre>
      </Modal>
    </div>
  );
}
