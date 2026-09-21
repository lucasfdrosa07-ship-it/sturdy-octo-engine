"use client";
import React, { useMemo, useState } from "react";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import { PageHead, Search, Btn, Badge, Modal, Ic, cx, LogoTile, Menu, Dot } from "@/components/ui";
import { INTEGRATIONS, INTEGRATION_CATS } from "@/lib/mock";
import { useApp } from "@/lib/store";

function StatusBadge({ s }: { s: string }) {
  if (s === "connected") return <Badge v="o" icon={I.CheckCircle2}>Conectado</Badge>;
  if (s === "expired") return <Badge v="w" icon={I.AlertTriangle}>Token expirado</Badge>;
  if (s === "error") return <Badge v="d" icon={I.XCircle}>Erro</Badge>;
  if (s === "connecting") return <Badge v="a" icon={I.Loader2} c="animate-pulse">Conectando…</Badge>;
  return <Badge v="n">Desconectado</Badge>;
}

export default function IntegracoesPage() {
  const { toast, setRec, rec } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [list, setList] = useState(INTEGRATIONS);
  const [sel, setSel] = useState<any>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  const byId = (id: string) => list.find((x) => x.id === id);
  const connected = list.filter((x) => x.status === "connected" || x.status === "expired" || x.status === "error");
  const available = list.filter((x) => x.status === "off");
  const filtered = (arr: any[]) =>
    arr.filter((x) => (cat === "Todas" || x.cat === cat) && x.name.toLowerCase().includes(q.toLowerCase()));

  function connect(id: string) {
    setConnecting(id);
    setTimeout(() => {
      setList((l) => l.map((x) => (x.id === id ? { ...x, status: "connected", sync: "agora" } : x)));
      setConnecting(null);
      setSel((s: any) => (s && s.id === id ? { ...s, status: "connected", sync: "agora" } : s));
      toast(`${byId(id)?.name} conectado via OAuth. Permissões aplicadas.`);
    }, 1400);
  }
  function disconnect(id: string) {
    setList((l) => l.map((x) => (x.id === id ? { ...x, status: "off", sync: null } : x)));
    toast(`${byId(id)?.name} desconectado. Tokens revogados.`, "info", I.Unplug);
  }
  function simulateExpired() {
    setList((l) => l.map((x) => (x.id === "notion" ? { ...x, status: "expired" } : x)));
    setRec({ name: "Notion", color: "#191919", sync: "há 3 dias", perm: "Somente leitura" });
  }

  const connectedF = filtered(connected);
  const availableF = filtered(available);

  return (
    <Page>
      <PageHead title="Integrações" sub="As ferramentas que a IA usa como braços: consulta dados e executa ações autorizadas, dentro das permissões que você definir."
        actions={
          <Menu icon={I.MoreHorizontal} items={[
            { icon: I.RefreshCw, label: "Sincronizar tudo", onClick: () => toast("Sincronização concluída: 3 integrações.", "info", I.RefreshCw) },
            { icon: I.AlarmClock, label: "Simular expiração de token (demo)", onClick: simulateExpired },
            { icon: I.ShieldCheck, label: "Revisar permissões", onClick: () => toast("Abra uma integração para revisar permissões.", "info", I.ShieldCheck) },
          ]} />
        } />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Search className="w-full sm:w-[280px]" value={q} onChange={(e: any) => setQ(e.target.value)} placeholder="Buscar por nome…" />
        <div className="flex gap-1.5 flex-wrap">
          {INTEGRATION_CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cx("h-8 px-3 rounded-lg border text-[12.5px] font-medium transition-colors cursor-pointer",
                cat === c ? "border-ink bg-ink text-bg" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* conectadas */}
      <div className="mt-7">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-[13.5px] font-semibold">Conectadas</h2>
          <Badge v="n">{connected.length}</Badge>
          {connected.some((x) => x.status !== "connected") && (
            <span className="flex items-center gap-1.5 text-[11.5px] text-warn"><Ic n={I.AlertTriangle} s={12} />atenção: 1 conexão precisa de reconexão</span>
          )}
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {connectedF.map((x) => (
            <div key={x.id} className={cx("rounded-[10px] border bg-panel p-4 transition-colors", x.status === "connected" ? "border-line hover:border-line2" : "border-warn/40 bg-warn-soft/40")}>
              <div className="flex items-start justify-between">
                <LogoTile name={x.name} color={x.color} dark={x.dark} s={38} />
                <StatusBadge s={x.status === "connecting" ? "connecting" : x.status} />
              </div>
              <div className="text-[13.5px] font-semibold mt-3">{x.name}</div>
              <div className="text-[11.5px] text-mut mt-0.5">{x.sync ? `Sincronizado ${x.sync}` : "Nunca sincronizado"}</div>
              <div className="mt-3 flex gap-1.5">
                <Btn s="xs" className="flex-1" onClick={() => setSel(x)}>Gerenciar</Btn>
                {x.status === "expired" && <Btn s="xs" v="p" icon={I.Plug} onClick={() => setRec({ name: x.name, color: x.color, sync: x.sync, perm: "Somente leitura" })}>Reconectar</Btn>}
              </div>
            </div>
          ))}
          {connectedF.length === 0 && (
            <div className="sm:col-span-2 xl:col-span-4 rounded-[10px] border border-dashed border-line2 p-6 text-center text-[12.5px] text-faint">
              Nenhuma integração conectada nessa categoria.
            </div>
          )}
        </div>
      </div>

      {/* disponíveis */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-[13.5px] font-semibold">Todas as integrações</h2>
          <Badge v="n">{available.length} disponíveis</Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {availableF.map((x) => (
            <div key={x.id} className="rounded-[10px] border border-line bg-panel p-4 hover:border-line2 transition-colors group">
              <div className="flex items-start justify-between">
                <LogoTile name={x.name} color={x.color} dark={x.dark} s={38} />
                <Badge v="x">{x.cat}</Badge>
              </div>
              <div className="text-[13.5px] font-semibold mt-3">{x.name}</div>
              <div className="text-[11.5px] text-mut mt-0.5 leading-snug min-h-[30px]">{x.desc}</div>
              <div className="mt-3">
                {x.status === "connecting" ? (
                  <Btn s="xs" className="w-full" disabled icon={I.Loader2}>Conectando via OAuth…</Btn>
                ) : (
                  <Btn s="xs" className="w-full" icon={I.Plug} onClick={() => setSel(x)}>Conectar</Btn>
                )}
              </div>
            </div>
          ))}
          {availableF.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 rounded-[10px] border border-dashed border-line2 p-6 text-center text-[12.5px] text-faint">
              Nenhuma integração disponível nessa categoria.
            </div>
          )}
        </div>
      </div>

      {/* modal de integração */}
      <Modal open={!!sel} onClose={() => setSel(null)} w="max-w-lg"
        title={sel?.name} sub={sel ? `${sel.cat} · ${sel.desc}` : ""}
        foot={sel && (
          <>
            {(sel.status === "connected" || sel.status === "expired" || sel.status === "error") && (
              <Btn v="dg" icon={I.Unplug} className="mr-auto" onClick={() => { disconnect(sel.id); }}>Desconectar</Btn>
            )}
            {sel.status === "expired" || sel.status === "error" ? (
              <Btn v="p" icon={I.Plug} disabled={connecting === sel.id} onClick={() => connect(sel.id)}>
                {connecting === sel.id ? "Reconectando…" : "Reconectar"}
              </Btn>
            ) : sel.status === "connected" ? (
              <Btn v="o" icon={I.RefreshCw} onClick={() => { setList((l) => l.map((x) => (x.id === sel.id ? { ...x, sync: "agora" } : x))); setSel((s: any) => ({ ...s, sync: "agora" })); toast(`${sel.name} sincronizado agora.`, "info", I.RefreshCw); }}>
                Sincronizar agora
              </Btn>
            ) : (
              <Btn v="p" icon={I.Plug} disabled={connecting === sel.id} onClick={() => connect(sel.id)}>
                {connecting === sel.id ? "Conectando…" : "Conectar"}
              </Btn>
            )}
          </>
        )}>
        {sel && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <LogoTile name={sel.name} color={sel.color} dark={sel.dark} s={44} />
              <div className="flex-1">
                <StatusBadge s={connecting === sel.id ? "connecting" : sel.status} />
              </div>
              <div className="text-right text-[11px] text-faint">
                <div>Última sincronização</div>
                <div className="text-[12px] text-mut font-medium mt-0.5">{sel.sync || "—"}</div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-faint mb-2">O que a IA poderá fazer</div>
              <ul className="space-y-1.5">
                {sel.canDo.map((c: string) => (
                  <li key={c} className="flex items-start gap-2 text-[12.5px] text-mut">
                    <Ic n={I.Check} s={13} c="text-ok shrink-0 mt-0.5" />{c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-faint mb-2">Nível de permissão</div>
              <div className="space-y-1.5">
                {sel.perms.map((p: any) => (
                  <label key={p.id} className={cx("flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors",
                    sel.perm === p.id ? "border-acc-500 bg-acc-100/40 dark:bg-acc-950/40" : "border-line hover:border-line2")}>
                    <input type="radio" name={`perm-${sel.id}`} checked={sel.perm === p.id}
                      onChange={() => setSel((s: any) => ({ ...s, perm: p.id }))} className="mt-0.5 accent-[#40668a]" />
                    <span className="flex-1">
                      <span className="block text-[13px] font-medium">{p.l}</span>
                      <span className="block text-[11px] text-faint mt-0.5">Nível de risco: {p.id === "r" || p.id === "v" || p.id === "sr" ? "leitura — execução automática" : "escrita — ações sensíveis pedem confirmação"}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-faint mb-2">Scopes solicitados</div>
              <div className="flex flex-wrap gap-1.5">
                {(sel.perms.find((p: any) => p.id === sel.perm)?.s || []).map((s: string) => (
                  <code key={s} className="rounded-md bg-soft border border-line px-2 py-1 text-[11px] text-mut font-mono">{s}</code>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-soft/60 border border-line px-3.5 py-3 text-[11.5px] text-mut leading-relaxed flex gap-2.5">
              <Ic n={I.ShieldCheck} s={14} c="text-ok shrink-0 mt-0.5" />
              Os tokens ficam armazenados com criptografia e podem ser revogados a qualquer momento aqui ou em Configurações → Privacidade & LGPD.
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}
