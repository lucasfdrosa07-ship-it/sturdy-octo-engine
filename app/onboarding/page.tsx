"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Ic, Btn, Field, Input, LogoTile, cx } from "@/components/ui";
import { Logo } from "@/components/shell";
import { useApp } from "@/lib/store";
import { INTEGRATIONS } from "@/lib/mock";

const STEPS = [
  { n: 1, l: "Apelido da IA" },
  { n: 2, l: "Primeira integração" },
  { n: 3, l: "Primeira memória" },
  { n: 4, l: "Aparência" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast, setTheme, setAssistant } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Bruce");
  const [integId, setIntegId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [mem, setMem] = useState("");
  const [theme, setThemeSel] = useState<"light" | "dark">("light");

  const pickInteg = (id: string) => {
    setConnecting(id);
    setTimeout(() => { setIntegId(id); setConnecting(null); toast("Conexão estabelecida via OAuth.", "info", I.Plug); }, 1300);
  };
  const finish = () => {
    setAssistant(name || "Bruce");
    setTheme(theme);
    router.push("/chat");
    toast(`Bem-vindo ao Aura, Rafael. ${name || "Bruce"} está pronto para ajudar.`, I.Sparkles);
  };

  const integOptions = ["cal", "gmail", "notion"].map((id) => INTEGRATIONS.find((x) => x.id === id)!);

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-[620px]">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <button onClick={() => { router.push("/chat"); }} className="text-[12.5px] font-medium text-mut hover:text-ink cursor-pointer">Pular por agora</button>
        </div>

        {/* progresso */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11.5px] font-medium mb-2">
            <span className="text-ink">Etapa {step} de 4</span>
            <span className="text-faint">{STEPS[step - 1].l}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((s) => (
              <div key={s.n} className={cx("h-1 flex-1 rounded-full transition-colors duration-300", s.n <= step ? "bg-acc-600" : "bg-line")} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel shadow-sm anim-up" key={step}>
          <div className="p-6 sm:p-8">
            {step === 1 && (
              <>
                <h1 className="text-[20px] font-semibold tracking-tight">Como você quer chamar a IA?</h1>
                <p className="text-[13px] text-mut mt-1.5 leading-relaxed">Esse é o nome que ela vai usar em todas as conversas. Você pode mudar depois em Personalização.</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-ink text-bg dark:bg-acc-800 dark:text-acc-100 flex items-center justify-center shrink-0"><Ic n={I.Sparkles} s={24} /></div>
                  <div className="flex-1">
                    <div className="text-[11.5px] text-faint mb-1">Pré-visualização</div>
                    <div className="text-[14.5px] font-medium">“Fala, Rafael! Eu sou <span className="text-acc-600 dark:text-acc-300">{name || "seu assistente"}</span>. Como posso ajudar hoje?”</div>
                  </div>
                </div>
                <div className="mt-6">
                  <Field label="Apelido do assistente" req>
                    <Input value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Ex.: Bruce" maxLength={20} />
                  </Field>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Bruce", "Max", "Luna", "Atlas", "Íris"].map((s) => (
                    <button key={s} onClick={() => setName(s)}
                      className={cx("h-8 px-3 rounded-lg border text-[12.5px] font-medium transition-colors cursor-pointer",
                        name === s ? "border-acc-500 bg-acc-100/60 text-acc-800 dark:bg-acc-950 dark:text-acc-200" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="text-[20px] font-semibold tracking-tight">Conecte sua primeira ferramenta</h1>
                <p className="text-[13px] text-mut mt-1.5 leading-relaxed">As integrações são os braços da IA: com elas ela consulta dados e executa ações autorizadas. Escolha uma para começar — você pode conectar mais depois.</p>
                <div className="mt-6 space-y-2.5">
                  {integOptions.map((x) => {
                    const done = integId === x.id;
                    const busy = connecting === x.id;
                    return (
                      <div key={x.id} className={cx("flex items-center gap-3.5 rounded-xl border p-3.5 transition-colors", done ? "border-acc-400 bg-acc-100/40 dark:bg-acc-950/50" : "border-line hover:border-line2")}>
                        <LogoTile name={x.name} color={x.color} dark={x.dark} s={40} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-semibold">{x.name}</div>
                          <div className="text-[11.5px] text-mut truncate">{x.desc}</div>
                        </div>
                        {done ? (
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ok"><Ic n={I.CheckCircle2} s={14} />Conectado</span>
                        ) : (
                          <Btn s="sm" icon={busy ? I.Loader2 : I.Plug} disabled={busy} onClick={() => pickInteg(x.id)}>
                            <span className={busy ? "animate-spin" : ""}>{busy ? "Conectando…" : "Conectar"}</span>
                          </Btn>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-[11.5px] text-faint flex items-center gap-1.5"><Ic n={I.ShieldCheck} s={12} />Autenticação via OAuth. A IA só acessa o que você autorizar.</p>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="text-[20px] font-semibold tracking-tight">Diga algo que a IA deve lembrar</h1>
                <p className="text-[13px] text-mut mt-1.5 leading-relaxed">A memória dá contexto às respostas. Tudo o que ela souber sobre você fica visível e editável em Personalização → Memória.</p>
                <div className="mt-6 space-y-4">
                  <Field label="Sua primeira memória" req hint="tipo: Preferência">
                    <Input value={mem} onChange={(e: any) => setMem(e.target.value)} placeholder="Ex.: Gosto de receber respostas diretas." />
                  </Field>
                  {mem && (
                    <div className="rounded-lg border border-line bg-soft/60 p-3 flex gap-2.5 anim-in">
                      <Ic n={I.Brain} s={14} c="text-acc-600 dark:text-acc-300 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[13px] leading-snug">“{mem}”</div>
                        <div className="text-[10.5px] text-faint mt-1 flex items-center gap-2">
                          <span className="rounded bg-acc-100 dark:bg-acc-950 text-acc-700 dark:text-acc-300 px-1.5 py-0.5 font-medium">Preferência</span>
                          Origem: manual · hoje
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Gosto de receber respostas diretas.", "Prefiro horários de reunião pela manhã.", "Meu cachote se chama Thor."].map((s) => (
                    <button key={s} onClick={() => setMem(s)} className="h-8 px-3 rounded-lg border border-line2 text-[12px] text-mut hover:text-ink hover:bg-soft cursor-pointer">
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="text-[20px] font-semibold tracking-tight">Escolha a aparência</h1>
                <p className="text-[13px] text-mut mt-1.5 leading-relaxed">Claro ou escuro. Você ajusta tamanho de fonte e densidade depois, em Personalização → Tema.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {(["light", "dark"] as const).map((t) => (
                    <button key={t} onClick={() => setThemeSel(t)}
                      className={cx("rounded-xl border p-3 text-left transition-colors cursor-pointer", theme === t ? "border-acc-500 bg-acc-100/40 dark:bg-acc-950/40" : "border-line hover:border-line2")}>
                      {/* mini preview */}
                      <div className={cx("rounded-lg border overflow-hidden", t === "light" ? "bg-white border-neutral-200" : "bg-[#0c0f14] border-[#232a35]")}>
                        <div className={cx("h-6 flex items-center px-2 gap-1 border-b", t === "light" ? "border-neutral-100" : "border-[#232a35]")}>
                          <span className={cx("h-2.5 w-2.5 rounded", t === "light" ? "bg-neutral-900" : "bg-[#40668a]")} />
                          <span className={cx("h-1.5 w-10 rounded-full", t === "light" ? "bg-neutral-200" : "bg-[#313a49]")} />
                        </div>
                        <div className="p-2 space-y-1.5">
                          <div className={cx("h-3.5 w-3/4 rounded self-end", t === "light" ? "bg-[#e4ecf4]" : "bg-[#223146]")} />
                          <div className={cx("h-1.5 w-5/6 rounded", t === "light" ? "bg-neutral-200" : "bg-[#313a49]")} />
                          <div className={cx("h-1.5 w-2/3 rounded", t === "light" ? "bg-neutral-200" : "bg-[#313a49]")} />
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2 text-[13px] font-medium">
                        <Ic n={t === "light" ? I.Sun : I.Moon} s={14} c="text-acc-600 dark:text-acc-300" />
                        {t === "light" ? "Claro" : "Escuro"}
                        {theme === t && <Ic n={I.Check} s={14} c="text-acc-600 dark:text-acc-300 ml-auto" />}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="px-6 sm:px-8 py-4 border-t border-line flex items-center justify-between bg-soft/40 rounded-b-xl">
            <button onClick={() => (step > 1 ? setStep(step - 1) : router.push("/chat"))} className="text-[13px] font-medium text-mut hover:text-ink cursor-pointer">
              {step > 1 ? "Voltar" : "Começar sem configurar"}
            </button>
            {step < 4 ? (
              <Btn v="p" icon={I.ArrowRight} onClick={() => setStep(step + 1)}>Continuar</Btn>
            ) : (
              <Btn v="p" icon={I.Sparkles} onClick={finish}>Começar a usar o Aura</Btn>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-faint">
          Etapa 4 de 4 leva menos de 1 minuto · tudo pode ser alterado depois
        </p>
      </div>
    </div>
  );
}
