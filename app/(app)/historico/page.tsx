"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import { PageHead, Search, Select, Btn, Menu, Badge, Modal, Field, Input, Empty, Ic, cx, dBRshort, Skel } from "@/components/ui";
import { CONVS, INTEGRATIONS } from "@/lib/mock";
import { useApp } from "@/lib/store";

const GROUPS = [
  { v: "hoje", l: "Hoje" },
  { v: "ontem", l: "Ontem" },
  { v: "semana", l: "Esta semana" },
  { v: "mes", l: "Este mês" },
  { v: "antigos", l: "Antigos" },
];

function groupOf(date: string) {
  if (date === "2026-09-21") return "hoje";
  if (date === "2026-09-20") return "ontem";
  if (date >= "2026-09-15") return "semana";
  if (date >= "2026-09-01") return "mes";
  return "antigos";
}

export default function HistoricoPage() {
  const router = useRouter();
  const { toast } = useApp();
  const [q, setQ] = useState("");
  const [onlyPin, setOnlyPin] = useState(false);
  const [fDate, setFDate] = useState("all");
  const [fInteg, setFInteg] = useState("all");
  const [pins, setPins] = useState<Record<string, boolean>>(() => Object.fromEntries(CONVS.map((c) => [c.id, !!c.pin])));
  const [ren, setRen] = useState<any>(null);
  const [renName, setRenName] = useState("");
  const [del, setDel] = useState<any>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [end, setEnd] = useState(false);

  const list = useMemo(() => {
    return CONVS.filter((c) => !removed.includes(c.id))
      .filter((c) => c.title.toLowerCase().includes(q.toLowerCase()) || c.preview.toLowerCase().includes(q.toLowerCase()))
      .filter((c) => (onlyPin ? pins[c.id] : true))
      .filter((c) => (fDate === "all" ? true : groupOf(c.date) === fDate))
      .filter((c) => (fInteg === "all" ? true : (c.tools || []).includes(fInteg)));
  }, [q, onlyPin, fDate, fInteg, pins, removed]);

  const groups = GROUPS.map((g) => ({ ...g, items: list.filter((c) => groupOf(c.date) === g.v) })).filter((g) => g.items.length > 0);
  const usedIntegrations = [...new Set(CONVS.flatMap((c) => c.tools || []))];

  function loadMore() {
    if (loadingMore || end) return;
    setLoadingMore(true);
    setTimeout(() => { setLoadingMore(false); setEnd(true); }, 1200);
  }
  useEffect(() => {
    const f = () => {
      if (window.innerHeight + window.scrollY > document.body.offsetHeight - 260) loadMore();
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, end]);

  return (
    <Page>
      <PageHead title="Histórico" sub="Gerencie suas conversas antigas: fixe, renomeie, exporte ou exclua." />

      {/* filtros */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Search className="w-full sm:w-[260px]" value={q} onChange={(e: any) => setQ(e.target.value)} placeholder="Buscar por título ou conteúdo…" />
        <Select className="w-[150px]" value={fDate} onChange={setFDate}
          opts={[{ v: "all", l: "Todas as datas" }, ...GROUPS.map((g) => ({ v: g.v, l: g.l }))]} />
        <Select className="w-[190px]" value={fInteg} onChange={setFInteg}
          opts={[{ v: "all", l: "Todas as integrações" }, ...usedIntegrations.map((x) => ({ v: x, l: x }))]} />
        <button onClick={() => setOnlyPin(!onlyPin)}
          className={cx("inline-flex items-center gap-1.5 h-[38px] px-3 rounded-lg border text-[12.5px] font-medium transition-colors cursor-pointer",
            onlyPin ? "border-acc-500 bg-acc-100/60 text-acc-800 dark:bg-acc-950 dark:text-acc-200" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
          <Ic n={I.Pin} s={13} />Fixados
        </button>
        <span className="ml-auto text-[12px] text-faint">{list.length} conversa{list.length !== 1 && "s"}</span>
      </div>

      {/* lista */}
      <div className="mt-4 rounded-[10px] border border-line bg-panel overflow-hidden">
        {groups.length === 0 && (
          <Empty icon={I.History} title={q || onlyPin || fDate !== "all" || fInteg !== "all" ? "Nenhuma conversa encontrada" : "Suas conversas vão aparecer aqui"}
            desc={q || onlyPin || fDate !== "all" || fInteg !== "all" ? "Ajuste a busca ou os filtros para ver resultados." : "Comece um novo chat e ele ficará salvo por aqui."}
            action={(q || onlyPin || fDate !== "all" || fInteg !== "all") ? <Btn s="sm" onClick={() => { setQ(""); setOnlyPin(false); setFDate("all"); setFInteg("all"); }}>Limpar filtros</Btn> : <Btn s="sm" v="p" icon={I.Plus} onClick={() => router.push("/chat")}>Iniciar conversa</Btn>} />
        )}
        {groups.map((g) => (
          <div key={g.v}>
            <div className="px-4 py-2 bg-soft/50 border-b border-line text-[11px] font-semibold uppercase tracking-wide text-faint">{g.l}</div>
            {g.items.map((c: any) => (
              <div key={c.id} className="group flex items-center gap-3 px-4 py-3 border-b border-line last:border-b-0 hover:bg-soft/40 transition-colors cursor-pointer"
                onClick={() => router.push(`/chat/${c.id}`)}>
                <button onClick={(e) => { e.stopPropagation(); setPins((p) => ({ ...p, [c.id]: !p[c.id] })); toast(pins[c.id] ? "Conversa desfixada." : "Conversa fixada.", "info", I.Pin); }}
                  className={cx("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors", pins[c.id] ? "text-acc-600 dark:text-acc-300 bg-acc-100/60 dark:bg-acc-950" : "text-faint hover:text-ink hover:bg-soft")}
                  aria-label="Fixar">
                  <Ic n={pins[c.id] ? I.Pin : I.PinOff} s={14} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate">{c.title}</div>
                  <div className="text-[12px] text-faint truncate mt-0.5">{c.preview}</div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  {(c.tools || []).length > 0 && (
                    <span className="flex items-center gap-1 text-[10.5px] text-faint"><Ic n={I.Plug} s={10} />{c.tools!.join(", ")}</span>
                  )}
                </div>
                <span className="text-[11.5px] text-faint shrink-0 w-14 text-right">{dBRshort(c.date)}</span>
                <Menu btnCls="opacity-0 group-hover:opacity-100 max-sm:opacity-100"
                  items={[
                    { icon: I.MessageSquare, label: "Abrir", onClick: () => router.push(`/chat/${c.id}`) },
                    { icon: pins[c.id] ? I.PinOff : I.Pin, label: pins[c.id] ? "Desafixar" : "Fixar", onClick: () => { setPins((p) => ({ ...p, [c.id]: !p[c.id] })); } },
                    { icon: I.Pencil, label: "Renomear", onClick: () => { setRen(c); setRenName(c.title); } },
                    { icon: I.Copy, label: "Duplicar", onClick: () => toast("Conversa duplicada.", "info", I.Copy) },
                    { div: true },
                    { icon: I.FileText, label: "Exportar em PDF", onClick: () => toast("Exportação PDF gerada (simulação).", "info", I.FileText) },
                    { icon: I.FileCode, label: "Exportar em Markdown", onClick: () => toast("Exportação Markdown gerada (simulação).", "info", I.FileCode) },
                    { div: true },
                    { icon: I.Trash2, label: "Excluir", danger: true, onClick: () => setDel(c) },
                  ]} />
              </div>
            ))}
          </div>
        ))}
        {groups.length > 0 && (
          <div className="px-4 py-3 text-center">
            {loadingMore ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3"><Skel c="h-9 w-9 rounded-lg" /><div className="flex-1 space-y-1.5"><Skel c="h-3 w-1/3" /><Skel c="h-2.5 w-2/3" /></div><Skel c="h-3 w-10" /></div>
                <div className="text-[11.5px] text-faint pt-1">Carregando mais conversas…</div>
              </div>
            ) : end ? (
              <span className="text-[11.5px] text-faint">Você chegou ao fim — {list.length} conversas</span>
            ) : (
              <span className="text-[11.5px] text-faint">Role para carregar mais</span>
            )}
          </div>
        )}
      </div>

      {/* renomear */}
      <Modal open={!!ren} onClose={() => setRen(null)} title="Renomear conversa" w="max-w-sm"
        foot={<><Btn v="g" onClick={() => setRen(null)}>Cancelar</Btn>
          <Btn v="p" onClick={() => { toast("Conversa renomeada."); setRen(null); }}>Salvar</Btn></>}>
        <Field label="Novo título" req>
          <Input value={renName} onChange={(e: any) => setRenName(e.target.value)} placeholder="Título da conversa" />
        </Field>
      </Modal>

      {/* excluir */}
      <Modal open={!!del} onClose={() => setDel(null)} title="Excluir conversa?" w="max-w-sm"
        foot={<><Btn v="g" onClick={() => setDel(null)}>Cancelar</Btn>
          <Btn v="d" icon={I.Trash2} onClick={() => { setRemoved((r) => [...r, del.id]); setDel(null); toast("Conversa excluída.", "info", I.Trash2); }}>Excluir</Btn></>}>
        <div className="text-[13px] text-mut leading-relaxed">
          “<b className="text-ink">{del?.title}</b>” será removida permanentemente do histórico. As notas salvas a partir dela continuam em Notas & Arquivos.
        </div>
      </Modal>
    </Page>
  );
}
