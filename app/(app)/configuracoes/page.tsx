"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import {
  PageHead, Btn, Badge, Input, Field, Select, Toggle, Seg, Ic, cx,
  Avatar, Progress, QrFake, dBR, Menu,
} from "@/components/ui";
import { PAYMENTS, FAQ, brl, fmt, INTEGRATIONS } from "@/lib/mock";
import { useApp } from "@/lib/store";

const TABS = [
  { v: "conta", l: "Conta", i: I.User },
  { v: "prefs", l: "Preferências", i: I.SlidersHorizontal },
  { v: "notif", l: "Notificações", i: I.Bell },
  { v: "plano", l: "Plano & Cobrança", i: I.CreditCard },
  { v: "priv", l: "Privacidade & LGPD", i: I.ShieldCheck },
  { v: "suporte", l: "Suporte", i: I.LifeBuoy },
];

function Conta() {
  const { toast } = useApp();
  const [show, setShow] = useState(false);
  const [twofa, setTwofa] = useState(false);
  const [twofaModal, setTwofaModal] = useState<0 | 1 | 2>(0);
  return (
    <div className="space-y-4 anim-in">
      <section className="rounded-[10px] border border-line bg-panel p-5">
        <h3 className="text-[14px] font-semibold mb-4">Perfil</h3>
        <div className="flex items-center gap-4 mb-5">
          <Avatar name="Rafael Souza" s={64} />
          <div>
            <Btn s="sm" icon={I.Camera} onClick={() => toast("Alteração de foto (simulação).", "info", I.Camera)}>Alterar foto</Btn>
            <div className="text-[11px] text-faint mt-1.5">PNG ou JPG · mín. 400×400</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome completo"><Input defaultValue="Rafael Souza" /></Field>
          <Field label="E-mail"><Input defaultValue="rafael.souza@gmail.com" /></Field>
          <Field label="Telefone celular"><Input defaultValue="+55 51 99876-5432" /></Field>
          <Field label="Data de nascimento"><Input defaultValue="14/03/1994" /></Field>
        </div>
        <div className="flex justify-end mt-5"><Btn v="p" icon={I.Save} onClick={() => toast("Perfil atualizado.")}>Salvar alterações</Btn></div>
      </section>

      <section className="rounded-[10px] border border-line bg-panel p-5">
        <h3 className="text-[14px] font-semibold mb-4">Senha</h3>
        <div className="grid sm:grid-cols-3 gap-4 max-w-[760px]">
          {["Senha atual", "Nova senha", "Confirmar nova senha"].map((l, i) => (
            <Field key={l} label={l}>
              <div className="relative">
                <Input type={show && i > 0 ? "text" : "password"} placeholder="••••••••" />
                {i === 0 && (
                  <button onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-mut cursor-pointer" aria-label="Mostrar senha"><Ic n={show ? I.EyeOff : I.Eye} s={15} /></button>
                )}
              </div>
            </Field>
          ))}
        </div>
        <div className="text-[11.5px] text-faint mt-3 flex items-center gap-1.5"><Ic n={I.KeyRound} s={12} />Última alteração: 02/03/2026 · mín. 8 caracteres</div>
        <div className="flex justify-end mt-4"><Btn v="o" onClick={() => toast("Senha atualizada.")}>Atualizar senha</Btn></div>
      </section>

      <section className="rounded-[10px] border border-line bg-panel p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[14px] font-semibold flex items-center gap-2">Verificação em duas etapas <Badge v={twofaModal === 2 ? "o" : "n"}>{twofaModal === 2 ? "Ativada" : "Desativada"}</Badge></h3>
            <p className="text-[12.5px] text-mut mt-1.5 max-w-[520px] leading-relaxed">Adicione um segundo fator de acesso usando um app autenticador (TOTP). Recomendado para contas com integrações financeiras.</p>
          </div>
          <Btn s="sm" v={twofaModal === 2 ? "dg" : "p"} icon={twofaModal === 2 ? I.X : I.ShieldCheck} onClick={() => (twofaModal === 2 ? (setTwofaModal(0), setTwofa(false), toast("2FA desativada.", "info")) : setTwofaModal(1))}>
            {twofaModal === 2 ? "Desativar" : "Ativar 2FA"}
          </Btn>
        </div>
      </section>

      {twofaModal === 1 && (
        <Modal2 title="Ativar verificação em duas etapas" onClose={() => setTwofaModal(0)}
          foot={<><Btn v="g" onClick={() => setTwofaModal(0)}>Cancelar</Btn><Btn v="p" icon={I.ArrowRight} onClick={() => setTwofaModal(2)}>Já registrei o código</Btn></>}>
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <div className="rounded-lg border border-line p-3 bg-panel"><QrFake seed="aura-2fa-rafael" s={132} /></div>
            <div>
              <ol className="text-[12.5px] text-mut space-y-2 leading-relaxed list-decimal list-inside">
                <li>Abra seu app autenticador (Google Authenticator, 1Password…)</li>
                <li>Escaneie o QR ou digite o código: <code className="font-mono text-[11.5px] bg-soft border border-line rounded px-1.5 py-0.5">AURA-7F3K-9Q2M</code></li>
                <li>Você receberá um código de 6 dígitos a cada 30s</li>
              </ol>
            </div>
          </div>
        </Modal2>
      )}
      {twofaModal === 2 && (
        <Modal2 title="Confirme o código" onClose={() => setTwofaModal(0)}
          foot={<><Btn v="g" onClick={() => setTwofaModal(0)}>Cancelar</Btn><Btn v="p" icon={I.ShieldCheck} onClick={() => { setTwofaModal(0); setTwofa(true); toast("Verificação em duas etapas ativada."); }}>Confirmar e ativar</Btn></>}>
          <div className="text-center">
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <input key={i} maxLength={1} inputMode="numeric" className="h-12 w-11 text-center text-[18px] font-semibold rounded-lg border border-line2 bg-panel focus:border-acc-500 focus:outline-none focus:ring-2 focus:ring-acc-500/25" />
              ))}
            </div>
            <p className="text-[11.5px] text-faint mt-3">Digite o código de 6 dígitos do seu app autenticador.</p>
          </div>
        </Modal2>
      )}
    </div>
  );
}

function Modal2({ title, onClose, children, foot }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 anim-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-panel border border-line rounded-xl shadow-2xl anim-pop">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line">
          <div className="text-[15px] font-semibold">{title}</div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-mut hover:bg-soft cursor-pointer"><Ic n={I.X} s={15} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {foot && <div className="px-5 py-3.5 border-t border-line flex items-center justify-end gap-2">{foot}</div>}
      </div>
    </div>
  );
}

function Prefs() {
  const { toast, theme, setTheme } = useApp();
  const router = useRouter();
  return (
    <div className="rounded-[10px] border border-line bg-panel divide-y divide-[var(--c-line)] anim-in">
      <PrefRow icon={I.Globe} title="Idioma" desc="Idioma da interface e das respostas da IA">
        <Select className="w-[180px]" defaultValue="pt-BR" opts={[{ v: "pt-BR", l: "Português (Brasil)" }, { v: "en", l: "English" }, { v: "es", l: "Español" }]} />
      </PrefRow>
      <PrefRow icon={I.Palette} title="Tema" desc="Aparência do sistema">
        <div className="flex items-center gap-2">
          <Seg s="sm" val={theme} onChange={(v: string) => { setTheme(v); }} opts={[{ v: "light", l: "Claro", icon: I.Sun }, { v: "dark", l: "Escuro", icon: I.Moon }]} />
          <Btn s="xs" v="g" onClick={() => router.push("/personalizacao")}>Personalizar →</Btn>
        </div>
      </PrefRow>
      <PrefRow icon={I.Type} title="Tamanho da fonte" desc="Tamanho base do texto">
        <Seg s="sm" val="padrao" onChange={(v: string) => toast(`Fonte: ${v}.`, "info")} opts={[{ v: "pequeno", l: "Pequeno" }, { v: "padrao", l: "Padrão" }, { v: "grande", l: "Grande" }]} />
      </PrefRow>
      <PrefRow icon={I.LayoutPanelTop} title="Densidade" desc="Espaçamento entre elementos">
        <Seg s="sm" val="confortavel" onChange={(v: string) => toast(`Densidade: ${v}.`, "info")} opts={[{ v: "compacto", l: "Compacto" }, { v: "confortavel", l: "Confortável" }]} />
      </PrefRow>
      <PrefRow icon={I.Sun} title="Alto contraste" desc="Aumenta o contraste do texto e das bordas">
        <Toggle on={false} onChange={(v: boolean) => toast(v ? "Alto contraste ativado." : "Alto contraste desativado.", "info")} />
      </PrefRow>
      <PrefRow icon={I.Bold} title="Texto em negrito" desc="Destaque os títulos e valores principais">
        <Toggle on={false} onChange={(v: boolean) => toast(v ? "Negrito ativado." : "Negrito desativado.", "info")} />
      </PrefRow>
    </div>
  );
}
function PrefRow({ icon: N, title, desc, children }: any) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="h-9 w-9 rounded-lg bg-soft border border-line flex items-center justify-center text-mut shrink-0"><Ic n={N} s={16} /></span>
        <div className="min-w-0">
          <div className="text-[13.5px] font-medium">{title}</div>
          <div className="text-[11.5px] text-mut truncate">{desc}</div>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Notif() {
  const { toast } = useApp();
  const [push, setPush] = useState(true);
  const [mail, setMail] = useState(true);
  const [types, setTypes] = useState({ fin: true, resumo: true, ia: true, autos: true });
  const list = [
    { k: "fin", i: I.Wallet, t: "Lembretes financeiros", d: "Ex.: “A fatura Enel vence sexta-feira (R$ 180,32)”" },
    { k: "resumo", i: I.Sunrise, t: "Resumo diário", d: "Resumo do dia às 08h: agenda, e-mails e pagamentos" },
    { k: "ia", i: I.ShieldAlert, t: "Alertas da IA", d: "Quando uma ação sensível precisa da sua confirmação" },
    { k: "autos", i: I.Workflow, t: "Alertas de automações", d: "Sucesso ou falha de execuções automáticas" },
  ];
  return (
    <div className="space-y-4 anim-in">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-[10px] border border-line bg-panel p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-soft border border-line flex items-center justify-center text-mut"><Ic n={I.Smartphone} s={16} /></span>
            <div>
              <div className="text-[13.5px] font-medium">Notificações push</div>
              <div className="text-[11.5px] text-faint">Este dispositivo (web) · em breve nos apps nativos</div>
            </div>
          </div>
          <Toggle on={push} onChange={(v: boolean) => { setPush(v); toast(v ? "Push ativado." : "Push desativado.", "info", I.Bell); }} />
        </div>
        <div className="rounded-[10px] border border-line bg-panel p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-soft border border-line flex items-center justify-center text-mut"><Ic n={I.Mail} s={16} /></span>
            <div>
              <div className="text-[13.5px] font-medium">E-mail</div>
              <div className="text-[11.5px] text-faint">rafael.souza@gmail.com</div>
            </div>
          </div>
          <Toggle on={mail} onChange={(v: boolean) => { setMail(v); toast(v ? "E-mails ativados." : "E-mails desativados.", "info", I.Mail); }} />
        </div>
      </div>
      <div className="rounded-[10px] border border-line bg-panel divide-y divide-[var(--c-line)]">
        <div className="px-5 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wide text-faint">Tipos de notificação</div>
        {list.map((x) => (
          <div key={x.k} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-8 w-8 rounded-lg bg-soft border border-line flex items-center justify-center text-mut shrink-0"><Ic n={x.i} s={14} /></span>
              <div className="min-w-0">
                <div className="text-[13px] font-medium">{x.t}</div>
                <div className="text-[11.5px] text-mut truncate">{x.d}</div>
              </div>
            </div>
            <Toggle on={types[x.k as keyof typeof types]} onChange={(v: boolean) => { setTypes((s) => ({ ...s, [x.k]: v })); toast("Preferência salva.", "info"); }} />
          </div>
        ))}
        <div className="px-5 py-3 text-[11px] text-faint">O Aura não usa WhatsApp como canal de notificação nesta versão.</div>
      </div>
    </div>
  );
}

function Plano() {
  const { user, setUser, toast } = useApp();
  const router = useRouter();
  const [cancel, setCancel] = useState(false);
  const [method, setMethod] = useState(false);
  const used = user.chat + user.auto;
  const rest = user.credits - used;
  const pChat = (user.chat / user.credits) * 100;
  const pAuto = (user.auto / user.credits) * 100;
  return (
    <div className="space-y-4 anim-in">
      {/* plano atual */}
      <div className="rounded-[10px] border border-line bg-panel p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold">Plano {user.plan.toUpperCase()}</span>
              <Badge v="a">{fmt(user.credits)} créditos/mês</Badge>
              {user.cancelling && <Badge v="w" icon={I.AlarmClock}>Cancelamento agendado</Badge>}
            </div>
            <div className="text-[12px] text-mut mt-1.5">{brl(user.price)}/mês · renova em <b className="text-ink">{user.renews}</b></div>
          </div>
          <div className="flex gap-2">
            <Btn s="sm" icon={I.Gauge} onClick={() => router.push("/planos")}>Gerenciar créditos</Btn>
            <Btn s="sm" v={user.cancelling ? "o" : "dg"} icon={user.cancelling ? I.RotateCcw : I.X} onClick={() => (user.cancelling ? (setUser({ ...user, cancelling: false }), toast("Cancelamento desfeito. Assinatura mantida.")) : setCancel(true))}>
              {user.cancelling ? "Reativar" : "Cancelar"}
            </Btn>
          </div>
        </div>
      </div>

      {/* uso de créditos */}
      <div className="rounded-[10px] border border-line bg-panel p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-semibold">Consumo de créditos</h3>
          <button onClick={() => router.push("/planos")} className="text-[12px] text-acc-600 dark:text-acc-300 font-medium hover:underline cursor-pointer">Expandir plano →</button>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-[30px] font-semibold tracking-tight tabular-nums">{fmt(rest)}</div>
          <div className="text-[12.5px] text-mut pb-1">créditos restantes de {fmt(user.credits)}</div>
        </div>
        <div className="mt-3 h-2.5 rounded-full bg-soft overflow-hidden flex">
          <div className="h-full bg-acc-600" style={{ width: pChat + "%" }} />
          <div className="h-full bg-acc-300 dark:bg-acc-800" style={{ width: pAuto + "%" }} />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5 text-[11.5px] text-mut">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-acc-600" />Uso via chat: <b className="text-ink">{fmt(user.chat)}</b></span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-acc-300 dark:bg-acc-800" />Uso via automações: <b className="text-ink">{fmt(user.auto)}</b></span>
          <span className="flex items-center gap-1.5"><Ic n={I.TrendingUp} s={11} c="text-faint" />Estimativa recorrente: <b className="text-ink">~2.018/mês</b> (3 automações ativas)</span>
        </div>
        <div className="mt-3 rounded-lg bg-soft/60 border border-line px-3.5 py-2.5 text-[11.5px] text-mut flex items-center gap-2">
          <Ic n={I.Info} s={13} c="text-faint shrink-0" />
          Automações representam consumo previsível: mesmo sem você abrir o app, elas executam nos gatilhos e descontam créditos do mês.
        </div>
      </div>

      {/* método de pagamento */}
      <div className="rounded-[10px] border border-line bg-panel p-5 flex items-center gap-4">
        <span className="h-10 w-14 rounded-lg bg-soft border border-line flex items-center justify-center text-mut"><Ic n={I.CreditCard} s={18} /></span>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-medium">Cartão de crédito •••• 4242</div>
          <div className="text-[11.5px] text-faint">Vencimento 08/27 · processado via Stripe</div>
        </div>
        <Btn s="sm" icon={I.Pencil} onClick={() => setMethod(true)}>Editar</Btn>
      </div>

      {/* histórico */}
      <div className="rounded-[10px] border border-line bg-panel overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-line flex items-center justify-between">
          <h3 className="text-[14px] font-semibold">Histórico de pagamentos</h3>
          <Btn s="xs" v="g" icon={I.Download} onClick={() => toast("Nota fiscal baixada (simulação).", "info", I.FileText)}>Exportar (CSV)</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-line">
                <th className="th pl-5">Data</th><th className="th">Descrição</th><th className="th">Método</th><th className="th text-right">Valor</th><th className="th text-right">Status</th><th className="th w-10" />
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p) => (
                <tr key={p.id} className="hover:bg-soft/40 transition-colors">
                  <td className="td pl-5 text-mut">{p.date}</td>
                  <td className="td font-medium">{p.desc}</td>
                  <td className="td text-mut">{p.method}</td>
                  <td className="td text-right tabular-nums font-medium">{brl(p.amount)}</td>
                  <td className="td text-right"><Badge v="o" icon={I.CheckCircle2}>{p.status}</Badge></td>
                  <td className="td pr-3"><Menu icon={I.Download} btnCls="h-7 w-7" align="right" items={[{ icon: I.FileText, label: "Nota fiscal (PDF)", onClick: () => toast("Nota fiscal baixada (simulação).", "info", I.FileText) }]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* cancelar */}
      {cancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setCancel(false)} />
          <div className="relative w-full max-w-[420px] bg-panel border border-line rounded-xl shadow-2xl anim-pop p-5">
            <h3 className="text-[15px] font-semibold">Cancelar assinatura Plus?</h3>
            <p className="text-[12.5px] text-mut mt-2 leading-relaxed">Você mantém o acesso até <b className="text-ink">{user.renews}</b>. Depois disso, volta para o Free (1.000 créditos, 50 memórias, 3 integrações). Suas automações ficam pausadas.</p>
            <ul className="mt-3 space-y-1.5 text-[12px] text-mut">
              <li className="flex gap-2"><Ic n={I.Check} s={13} c="text-ok shrink-0 mt-0.5" />Seus dados, notas e memórias são preservados</li>
              <li className="flex gap-2"><Ic n={I.Check} s={13} c="text-ok shrink-0 mt-0.5" />Reative quando quiser, mantendo seu histórico</li>
            </ul>
            <div className="flex justify-end gap-2 mt-4">
              <Btn v="g" onClick={() => setCancel(false)}>Manter assinatura</Btn>
              <Btn v="d" onClick={() => { setCancel(false); setUser({ ...user, cancelling: true }); toast("Cancelamento agendado para o fim do ciclo.", "info", I.AlarmClock); }}>Confirmar cancelamento</Btn>
            </div>
          </div>
        </div>
      )}

      {/* método */}
      {method && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setMethod(false)} />
          <div className="relative w-full max-w-[400px] bg-panel border border-line rounded-xl shadow-2xl anim-pop p-5">
            <h3 className="text-[15px] font-semibold mb-4">Método de pagamento</h3>
            <div className="space-y-2.5">
              {[["Cartão de crédito", I.CreditCard, "Processado via Stripe"], ["Pix", I.QrCode, "Via Mercado Pago"], ["Boleto", I.Barcode, "Vencimento em 2 dias úteis"]].map(([l, ic, d]: any, i) => (
                <label key={i} className={cx("flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors", i === 0 ? "border-acc-500 bg-acc-100/40 dark:bg-acc-950/40" : "border-line hover:border-line2")}>
                  <input type="radio" name="pay" defaultChecked={i === 0} className="accent-[#40668a]" />
                  <Ic n={ic} s={17} c="text-mut" />
                  <span className="flex-1"><span className="block text-[13px] font-medium">{l}</span><span className="block text-[11px] text-faint">{d}</span></span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Btn v="g" onClick={() => setMethod(false)}>Cancelar</Btn>
              <Btn v="p" onClick={() => { setMethod(false); toast("Método de pagamento salvo."); }}>Salvar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Privacidade() {
  const { toast, setRec } = useApp();
  const router = useRouter();
  const [exporting, setExporting] = useState<0 | 1 | 2>(0);
  const [cons, setCons] = useState({ ctx: true, anal: true, train: false });
  const [del, setDel] = useState(false);
  const [delText, setDelText] = useState("");
  const [revoked, setRevoked] = useState<string[]>([]);
  const conns = INTEGRATIONS.filter((x) => x.status !== "off");
  return (
    <div className="space-y-4 anim-in">
      <div className="rounded-[10px] border border-ok/30 bg-ok-soft px-4 py-3.5 flex items-start gap-3">
        <Ic n={I.ShieldCheck} s={16} c="text-ok shrink-0 mt-0.5" />
        <p className="text-[12.5px] leading-relaxed text-mut">
          <b className="text-ink">Você controla seus dados.</b> Tudo que a IA sabe sobre você — memórias, notas, financeiro, permissões — pode ser exportado, revogado ou excluído aqui, conforme a LGPD.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-[10px] border border-line bg-panel p-4">
          <h3 className="text-[13.5px] font-semibold flex items-center gap-2"><Ic n={I.Download} s={15} c="text-mut" />Exportar dados</h3>
          <p className="text-[11.5px] text-mut mt-1.5 leading-relaxed">Todos os seus dados em um arquivo: conversas, memórias, notas, financeiro e configurações.</p>
          <div className="flex items-center gap-2 mt-3">
            <Seg s="sm" val="json" onChange={() => {}} opts={[{ v: "json", l: "JSON" }, { v: "csv", l: "CSV" }]} />
            <Btn s="sm" icon={exporting === 1 ? I.Loader2 : I.Download} disabled={exporting === 1} className="ml-auto"
              onClick={() => { setExporting(1); setTimeout(() => { setExporting(2); toast("Exportação pronta — link enviado por e-mail.", "info", I.FileArchive); }, 1500); }}>
              {exporting === 1 ? "Gerando…" : exporting === 2 ? "Exportar novamente" : "Exportar"}
            </Btn>
          </div>
          {exporting === 2 && <div className="mt-2.5 text-[11.5px] text-ok flex items-center gap-1.5"><Ic n={I.CheckCircle2} s={12} />Última exportação: hoje, 10:24 · 14,2 MB</div>}
        </div>

        <div className="rounded-[10px] border border-line bg-panel p-4">
          <h3 className="text-[13.5px] font-semibold flex items-center gap-2"><Ic n={I.Handshake} s={15} c="text-mut" />Gerenciar consentimentos</h3>
          <div className="mt-3 space-y-2.5">
            {([["ctx", "Usar meu contexto para melhorar respostas"], ["anal", "Análise de uso anônima (produtividade)"], ["train", "Permitir uso de dados em treinamento de modelos"]] as const).map(([k, l]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <span className="text-[12.5px] text-mut">{l}</span>
                <Toggle on={cons[k]} onChange={(v: boolean) => { setCons((s) => ({ ...s, [k]: v })); toast("Consentimento atualizado.", "info", I.ShieldCheck); }} />
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10.5px] text-faint flex items-center gap-1.5"><Ic n={I.Lock} s={10} />Nunca usamos seus dados para treinar modelos sem consentimento explícito.</div>
        </div>
      </div>

      {/* permissões */}
      <div className="rounded-[10px] border border-line bg-panel overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-line flex items-center justify-between">
          <div>
            <h3 className="text-[13.5px] font-semibold">Permissões de integrações</h3>
            <p className="text-[11.5px] text-mut mt-0.5">O que cada conector pode fazer, e desde quando.</p>
          </div>
          <Btn s="xs" onClick={() => router.push("/integracoes")}>Gerenciar todas →</Btn>
        </div>
        <div className="divide-y divide-[var(--c-line)]">
          {conns.map((x: any) => (
            <div key={x.id} className="flex items-center gap-3 px-4 py-3">
              <span className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-[13px] font-semibold shrink-0" style={{ background: x.color }}>{x.name[0]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium flex items-center gap-2">{x.name}
                  {x.status === "expired" && <Badge v="w">Token expirado</Badge>}
                  {revoked.includes(x.id) && <Badge v="n">Revogada</Badge>}
                </div>
                <div className="text-[11px] text-faint truncate">
                  {x.id === "gmail" && "gmail.readonly · gmail.send"}
                  {x.id === "cal" && "calendar.events"}
                  {x.id === "drive" && "drive.readonly"}
                  {x.id === "notion" && "notion.read"}
                </div>
              </div>
              {x.status === "expired" ? (
                <Btn s="xs" icon={I.Plug} onClick={() => setRec({ name: x.name, color: x.color, sync: x.sync, perm: "Somente leitura" })}>Reconectar</Btn>
              ) : (
                <Btn s="xs" v="dg" disabled={revoked.includes(x.id)} onClick={() => { setRevoked((r) => [...r, x.id]); toast(`Acesso do ${x.name} revogado.`, "info", I.Unplug); }}>
                  {revoked.includes(x.id) ? "Revogado" : "Revogar"}
                </Btn>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* zona de perigo */}
      <div className="rounded-[10px] border border-danger/30 bg-danger-soft/50 p-4">
        <h3 className="text-[13.5px] font-semibold text-danger flex items-center gap-2"><Ic n={I.AlertTriangle} s={15} />Zona de perigo</h3>
        <p className="text-[12px] text-mut mt-1.5">Exclui permanentemente sua conta e todos os dados: conversas, memórias, notas, financeiro e automações. O processo respeita o prazo de 30 dias da LGPD para backup final.</p>
        <Btn s="sm" v="d" icon={I.Trash2} className="mt-3" onClick={() => setDel(true)}>Excluir minha conta</Btn>
      </div>

      {del && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setDel(false)} />
          <div className="relative w-full max-w-[400px] bg-panel border border-line rounded-xl shadow-2xl anim-pop p-5">
            <h3 className="text-[15px] font-semibold">Excluir conta permanentemente</h3>
            <p className="text-[12.5px] text-mut mt-2 leading-relaxed">Esta ação não pode ser desfeita após o prazo de 30 dias.</p>
            <Field label='Digite <b>EXCLUIR</b> para confirmar' className="mt-3">
              <Input value={delText} onChange={(e: any) => setDelText(e.target.value)} placeholder="EXCLUIR" />
            </Field>
            <div className="flex justify-end gap-2 mt-4">
              <Btn v="g" onClick={() => setDel(false)}>Cancelar</Btn>
              <Btn v="d" disabled={delText !== "EXCLUIR"} onClick={() => { setDel(false); toast("Solicitação registrada. Você receberá o e-mail de confirmação.", "info", I.Trash2); }}>Excluir conta</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Suporte() {
  const { toast } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [q, setQ] = useState("");
  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-4 anim-in items-start">
      <div className="space-y-4">
        <div className="rounded-[10px] border border-line bg-panel p-4">
          <h3 className="text-[13.5px] font-semibold mb-3">Perguntas frequentes</h3>
          <div className="relative mb-3">
            <Ic n={I.Search} s={14} c="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar na base de conhecimento…" className="w-full h-[38px] pl-8.5 pr-3 rounded-lg border border-line2 bg-panel text-[13.5px] placeholder:text-faint focus:border-acc-500 focus:outline-none focus:ring-2 focus:ring-acc-500/25" />
          </div>
          <div className="divide-y divide-[var(--c-line)] rounded-lg border border-line overflow-hidden">
            {FAQ.filter((f) => f.q.toLowerCase().includes(q.toLowerCase())).map((f, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left hover:bg-soft/50 transition-colors cursor-pointer">
                  <span className="text-[13px] font-medium flex-1">{f.q}</span>
                  <Ic n={I.ChevronDown} s={14} c={cx("text-faint transition-transform", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && <div className="px-3.5 pb-3.5 text-[12.5px] text-mut leading-relaxed anim-in">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[10px] border border-line bg-panel p-4">
          <h3 className="text-[13.5px] font-semibold mb-1">Status da plataforma</h3>
          <div className="flex items-center gap-2 text-[12px] text-mut mt-2"><span className="h-2 w-2 rounded-full bg-ok" />Todos os sistemas operacionais · última verificação há 4 min</div>
        </div>

        <div className="rounded-[10px] border border-line bg-panel p-4">
          <h3 className="text-[13.5px] font-semibold mb-3">Páginas de estado (demonstração)</h3>
          <p className="text-[11.5px] text-faint mb-2.5">Telas de erro e exceções do produto, disponíveis para revisão visual.</p>
          <div className="flex flex-wrap gap-1.5">
            {[["/404x", "404 — Não encontrada"], ["/500x", "500 — Erro interno"], ["/erro-autenticacao", "Erro de autenticação"], ["/integracao-expirada", "Integração expirada"], ["/assinatura-expirada", "Assinatura expirada"], ["/manutencao", "Manutenção"]].map(([h, l]) => (
              <button key={h} onClick={() => routerNav(h)} className="h-8 px-3 rounded-lg border border-line2 text-[12px] text-mut hover:text-ink hover:bg-soft cursor-pointer">{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-line bg-panel p-5 lg:sticky lg:top-6">
        <h3 className="text-[13.5px] font-semibold flex items-center gap-2"><Ic n={I.LifeBuoy} s={15} c="text-mut" />Falar com o suporte</h3>
        <p className="text-[11.5px] text-mut mt-1">Resposta em até 1 dia útil.</p>
        <div className="mt-4 space-y-3.5">
          <Field label="Assunto">
            <Select defaultValue="conta" opts={[{ v: "conta", l: "Minha conta" }, { v: "plano", l: "Plano e cobrança" }, { v: "ia", l: "Comportamento da IA" }, { v: "outro", l: "Outro assunto" }]} />
          </Field>
          <Field label="Mensagem">
            <textarea rows={4} className="w-full rounded-lg border border-line2 bg-panel px-3 py-2.5 text-[13.5px] resize-none placeholder:text-faint focus:border-acc-500 focus:outline-none focus:ring-2 focus:ring-acc-500/25" placeholder="Descreva o que está acontecendo…" />
          </Field>
          <Btn v="p" icon={I.Send} className="w-full" onClick={() => toast("Mensagem enviada ao suporte.", "info", I.Send)}>Enviar mensagem</Btn>
        </div>
      </div>
    </div>
  );
}
function routerNav(h: string) { window.location.href = h; }

function SettingsInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const tab = sp.get("tab") || "conta";
  return (
    <Page>
      <PageHead title="Configurações" sub="Conta, preferências, notificações, plano, privacidade e suporte em um só lugar." />
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-[220px] shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            {TABS.map((t) => (
              <button key={t.v} onClick={() => router.replace(`/configuracoes?tab=${t.v}`)}
                className={cx("flex items-center gap-2.5 rounded-lg px-3 h-9 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0",
                  tab === t.v ? "bg-acc-100/80 text-acc-800 dark:bg-acc-950 dark:text-acc-200" : "text-mut hover:text-ink hover:bg-soft")}>
                <Ic n={t.i} s={15} c={tab === t.v ? "" : "text-faint"} />{t.l}
              </button>
            ))}
          </div>
        </nav>
        <div className="flex-1 min-w-0">
          {tab === "conta" && <Conta />}
          {tab === "prefs" && <Prefs />}
          {tab === "notif" && <Notif />}
          {tab === "plano" && <Plano />}
          {tab === "priv" && <Privacidade />}
          {tab === "suporte" && <Suporte />}
        </div>
      </div>
    </Page>
  );
}

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<div className="max-w-[1200px] mx-auto px-6 py-8" />}>
      <SettingsInner />
    </Suspense>
  );
}
