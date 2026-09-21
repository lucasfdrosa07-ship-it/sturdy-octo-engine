"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import { Btn, Badge, Ic, LogoTile } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function IntegracaoExpiradaPage() {
  const router = useRouter();
  const { toast, setRec } = useApp();
  const [busy, setBusy] = useState(false);
  const reconnect = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast("Conexão com o Notion restaurada com sucesso.");
      router.push("/integracoes");
    }, 1500);
  };
  return (
    <Page>
      <div className="max-w-[520px] mx-auto mt-4">
        <div className="rounded-[10px] border border-line bg-panel p-7 anim-up text-center">
          <div className="flex justify-center"><LogoTile name="Notion" color="#191919" s={52} r={12} /></div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h1 className="text-[18px] font-semibold tracking-tight">Sua conexão com o Notion expirou</h1>
          </div>
          <Badge v="w" c="mt-2"><Ic n={I.AlertTriangle} s={11} />Token de acesso expirado</Badge>
          <p className="text-[13px] text-mut mt-4 leading-relaxed">
            O token OAuth do Notion venceu. Enquanto isso, a IA <b className="text-ink">não consegue</b> consultar pautas, bases nem criar notas no Notion. Suas memórias, notas e financeiro continuam funcionando normalmente.
          </p>
          <div className="mt-5 rounded-lg border border-line bg-soft/50 p-4 text-left text-[12px] text-mut space-y-1.5">
            <div className="flex items-center gap-2"><Ic n={I.History} s={12} c="text-faint" />Última sincronização: <b className="text-ink">há 3 dias (18/09/2026)</b></div>
            <div className="flex items-center gap-2"><Ic n={I.ShieldCheck} s={12} c="text-faint" />Permissão atual: <b className="text-ink">Somente leitura (notion.read)</b></div>
            <div className="flex items-center gap-2"><Ic n={I.Workflow} s={12} c="text-faint" />1 automação dependente: <b className="text-ink">“Organizar arquivos do Drive”</b></div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2">
            <Btn v="p" icon={busy ? I.Loader2 : I.Plug} disabled={busy} onClick={reconnect}>
              {busy ? "Reconectando…" : "Reconectar agora"}
            </Btn>
            <Btn v="o" onClick={() => setRec({ name: "Notion", color: "#191919", sync: "há 3 dias", perm: "Somente leitura" })}>
              Ver detalhes no modal global
            </Btn>
            <Btn v="g" onClick={() => router.push("/integracoes")}>Gerenciar integrações</Btn>
          </div>
          <p className="mt-4 text-[11px] text-faint leading-relaxed">
            A reconexão pede login novamente no Notion e preserva as permissões que você já concedeu.
          </p>
        </div>
      </div>
    </Page>
  );
}
