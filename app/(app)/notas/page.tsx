"use client";
import React, { useMemo, useRef, useState } from "react";
import * as I from "lucide-react";
import { Page } from "@/components/shell";
import {
  PageHead, Search, Btn, Badge, Menu, Modal, Drawer, Field, Input, Textarea,
  Ic, cx, Empty, Progress, dBR,
} from "@/components/ui";
import { NOTES, NOTE_TAGS } from "@/lib/mock";
import { useApp } from "@/lib/store";

const TYPE: any = {
  note: { l: "Nota", i: I.StickyNote, tone: "text-acc-600 dark:text-acc-300" },
  link: { l: "Link", i: I.Link2, tone: "text-acc-600 dark:text-acc-300" },
  pdf: { l: "PDF", i: I.FileText, tone: "text-danger" },
  image: { l: "Imagem", i: I.Image, tone: "text-ok" },
  audio: { l: "Áudio", i: I.AudioWaveform, tone: "text-warn" },
  video: { l: "Vídeo", i: I.Video, tone: "text-acc-600 dark:text-acc-300" },
};

function Thumb({ n, c = "h-28" }: any) {
  if (n.type === "image")
    return (
      <div className={cx("relative flex items-center justify-center", c)} style={{ background: n.tone || "#6e7f92" }}>
        <Ic n={I.Image} s={26} c="text-white/70" />
        <span className="absolute bottom-1.5 right-1.5 text-[9.5px] text-white/70">{n.title.split(".")[1]?.toUpperCase()}</span>
      </div>
    );
  if (n.type === "video")
    return (
      <div className={cx("relative flex items-center justify-center bg-soft", c)}>
        <span className="h-9 w-9 rounded-full bg-panel border border-line shadow-sm flex items-center justify-center"><Ic n={I.Play} s={14} c="text-ink" /></span>
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 text-white text-[9.5px] px-1 py-0.5">{n.dur}</span>
      </div>
    );
  if (n.type === "pdf")
    return (
      <div className={cx("flex items-center justify-center bg-soft", c)}>
        <div className="flex flex-col items-center gap-1.5 text-danger">
          <Ic n={I.FileText} s={30} />
          <span className="text-[10px] font-semibold tracking-wide">PDF</span>
        </div>
      </div>
    );
  if (n.type === "audio")
    return (
      <div className={cx("px-3.5 flex items-center gap-2.5", c)}>
        <button className="h-9 w-9 rounded-full bg-ink text-bg flex items-center justify-center shrink-0 cursor-pointer"><Ic n={I.Play} s={13} /></button>
        <div className="flex-1">
          <div className="h-1 rounded-full bg-line overflow-hidden"><div className="h-full w-1/3 bg-acc-500 rounded-full" /></div>
          <div className="flex justify-between text-[9.5px] text-faint mt-1"><span>1:04</span><span>{n.dur}</span></div>
        </div>
      </div>
    );
  return (
    <div className={cx("px-3.5 py-3", c)}>
      <div className="text-[12px] text-mut leading-snug line-clamp-4">{n.text}</div>
    </div>
  );
}

export default function NotasPage() {
  const { toast } = useApp();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [type, setType] = useState("todos");
  const [favOnly, setFavOnly] = useState(false);
  const [tag, setTag] = useState("all");
  const [items, setItems] = useState(NOTES);
  const [noteModal, setNoteModal] = useState<any>(null); // {mode, item}
  const [linkModal, setLinkModal] = useState(false);
  const [upModal, setUpModal] = useState(false);
  const [upload, setUpload] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [del, setDel] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const list = useMemo(
    () =>
      items.filter((n) =>
        (type === "todos" || n.type === type) &&
        (!favOnly || n.fav) &&
        (tag === "all" || n.tags?.includes(tag)) &&
        (n.title.toLowerCase().includes(q.toLowerCase()) || (n.text || n.desc || "").toLowerCase().includes(q.toLowerCase()))
      ),
    [items, q, type, favOnly, tag]
  );

  function toggleFav(n: any) {
    setItems((s) => s.map((x) => (x.id === n.id ? { ...x, fav: !x.fav } : x)));
    toast(n.fav ? "Removido dos favoritos." : "Adicionado aos favoritos.", "info", I.Star);
  }
  function useInChat(n: any) {
    toast(`“${n.title}” disponível para a IA na próxima mensagem.`, "info", I.Sparkles);
    setDetail(null);
  }
  function saveNote() {
    const it = { ...noteModal.item, id: noteModal.item.id || "n" + Date.now() };
    setItems((s) => (noteModal.item.id ? s.map((x) => (x.id === it.id ? it : x)) : [it, ...s]));
    setNoteModal(null);
    toast(noteModal.item.id ? "Nota atualizada." : "Nota criada e indexada para a IA.");
  }
  function saveLink() {
    setItems((s) => [{ id: "n" + Date.now(), type: "link", title: linkItem.title || "Novo link", url: linkItem.url, desc: linkItem.desc, tags: [], date: "2026-09-21" }, ...s]);
    setLinkModal(false); setLinkItem({ title: "", url: "", desc: "" });
    toast("Link salvo e indexado para a IA.");
  }
  const [linkItem, setLinkItem] = useState({ title: "", url: "", desc: "" });

  function fakeUpload() {
    const f = { name: "Fatura-Enel-092026.pdf", pct: 0, state: "up" as "up" | "done" | "err" };
    setUpload((u) => [...u, f]);
    const iv = setInterval(() => {
      setUpload((u) => u.map((x) => (x.name === f.name ? { ...x, pct: Math.min(100, x.pct + 18) } : x)));
    }, 220);
    setTimeout(() => {
      clearInterval(iv);
      setUpload((u) => u.map((x) => (x.name === f.name ? { ...x, pct: 100, state: "done" } : x)));
      setItems((s) => [{ id: "n" + Date.now(), type: "pdf", title: f.name, size: "1,4 MB", tags: ["financeiro"], date: "2026-09-21" }, ...s]);
      toast("Arquivo enviado e processado.");
    }, 1400);
  }
  function simulateErr() {
    setUpload((u) => [...u, { name: "Video-mestre-final.mp4", pct: 42, state: "err", err: "Arquivo excede o limite de 25 MB do plano Plus." }]);
    toast("Upload interrompido: limite de tamanho.", "err", I.AlertCircle);
  }

  return (
    <Page>
      <PageHead title="Notas & Arquivos" sub="Seu cofre pessoal. Tudo que você salvar aqui fica disponível para a IA, conforme as regras de acesso e indexação."
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex bg-soft rounded-lg p-0.5 border border-line">
              <button onClick={() => setView("grid")} className={cx("h-[30px] w-[34px] rounded-md flex items-center justify-center transition-colors cursor-pointer", view === "grid" ? "bg-panel shadow-sm" : "text-faint hover:text-ink")} aria-label="Grade"><Ic n={I.LayoutGrid} s={14} /></button>
              <button onClick={() => setView("list")} className={cx("h-[30px] w-[34px] rounded-md flex items-center justify-center transition-colors cursor-pointer", view === "list" ? "bg-panel shadow-sm" : "text-faint hover:text-ink")} aria-label="Lista"><Ic n={I.List} s={14} /></button>
            </div>
            <Menu label="Novo" icon={I.Plus} btnCls="h-9 px-3 rounded-lg border border-line2 gap-1.5"
              items={[
                { icon: I.StickyNote, label: "Nova nota", onClick: () => setNoteModal({ mode: "new", item: { title: "", text: "", tags: [] as string[], fav: false, date: "2026-09-21" } }) },
                { icon: I.Link2, label: "Novo link", onClick: () => setLinkModal(true) },
                { icon: I.Upload, label: "Enviar arquivo", onClick: () => setUpModal(true) },
              ]} />
          </div>
        } />

      {/* filtros */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Search className="w-full sm:w-[260px]" value={q} onChange={(e: any) => setQ(e.target.value)} placeholder="Busca full-text em títulos e conteúdo…" />
        <div className="flex gap-1.5 flex-wrap">
          {["todos", "note", "link", "pdf", "image", "audio", "video"].map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={cx("h-8 px-3 rounded-lg border text-[12.5px] font-medium transition-colors cursor-pointer",
                type === t ? "border-ink bg-ink text-bg" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
              {t === "todos" ? "Todos" : TYPE[t].l + "s"}
            </button>
          ))}
          <button onClick={() => setFavOnly(!favOnly)}
            className={cx("h-8 px-3 rounded-lg border text-[12.5px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer",
              favOnly ? "border-warn bg-warn-soft text-warn" : "border-line2 text-mut hover:text-ink hover:bg-soft")}>
            <Ic n={I.Star} s={13} />Favoritos
          </button>
        </div>
        <div className="relative">
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="h-8 pl-3 pr-8 rounded-lg border border-line2 bg-panel text-[12.5px] font-medium text-mut appearance-none cursor-pointer">
            <option value="all">Todas as tags</option>
            {NOTE_TAGS.map((t) => <option key={t} value={t}>#{t}</option>)}
          </select>
          <Ic n={I.ChevronDown} s={13} c="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
        </div>
        <span className="ml-auto text-[12px] text-faint">{list.length} item{list.length !== 1 && "s"}</span>
      </div>

      {list.length === 0 ? (
        <div className="mt-5 rounded-[10px] border border-line bg-panel">
          <Empty icon={I.StickyNote} title={items.length === 0 ? "Salve notas, links e arquivos aqui" : "Nenhum item com esses filtros"}
            desc={items.length === 0 ? "Tudo que você salvar fica disponível para a IA em conversas e automações." : "Tente outra combinação de busca, tipo ou tag."}
            action={<div className="flex gap-2"><Btn s="sm" onClick={() => { setType("todos"); setFavOnly(false); setTag("all"); setQ(""); }}>Limpar filtros</Btn>
              <Btn s="sm" v="p" icon={I.Plus} onClick={() => setNoteModal({ mode: "new", item: { title: "", text: "", tags: [], fav: false, date: "2026-09-21" } })}>Nova nota</Btn></div>} />
        </div>
      ) : view === "grid" ? (
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {list.map((n) => (
            <div key={n.id} className="group rounded-[10px] border border-line bg-panel overflow-hidden hover:border-line2 transition-colors cursor-pointer" onClick={() => setDetail(n)}>
              <Thumb n={n} />
              <div className="p-3">
                <div className="flex items-start gap-1.5">
                  <span className="text-[12.5px] font-medium leading-snug flex-1 line-clamp-2">{n.title}</span>
                  <button onClick={(e) => { e.stopPropagation(); toggleFav(n); }}
                    className={cx("shrink-0 cursor-pointer transition-colors", n.fav ? "text-warn" : "text-faint hover:text-ink opacity-0 group-hover:opacity-100 max-sm:opacity-100")} aria-label="Favoritar">
                    <Ic n={I.Star} s={13} c={n.fav ? "fill-current" : ""} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={cx("flex items-center gap-1 text-[10.5px]", TYPE[n.type].tone)}>
                    <Ic n={TYPE[n.type].i} s={10} />{TYPE[n.type].l}
                  </span>
                  {n.size && <span className="text-[10.5px] text-faint">{n.size}</span>}
                  <span className="text-[10.5px] text-faint ml-auto">{dBR(n.date).slice(0, 5)}</span>
                </div>
                {n.tags && n.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {n.tags.map((t: string) => <span key={t} className="text-[10px] text-faint bg-soft rounded px-1 py-0.5">#{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[10px] border border-line bg-panel overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-line">
                <th className="th pl-4">Item</th>
                <th className="th">Tipo</th>
                <th className="th">Tags</th>
                <th className="th">Tamanho</th>
                <th className="th">Data</th>
                <th className="th w-24" />
              </tr>
            </thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id} className="hover:bg-soft/40 cursor-pointer transition-colors" onClick={() => setDetail(n)}>
                  <td className="td pl-4">
                    <div className="flex items-center gap-3">
                      <span className={cx("h-8 w-8 rounded-lg bg-soft border border-line flex items-center justify-center shrink-0", TYPE[n.type].tone)}><Ic n={TYPE[n.type].i} s={14} /></span>
                      <span className="font-medium text-[13px]">{n.title}</span>
                    </div>
                  </td>
                  <td className="td"><Badge v="n">{TYPE[n.type].l}</Badge></td>
                  <td className="td text-[11.5px] text-faint">{n.tags?.map((t: string) => `#${t}`).join(" ") || "—"}</td>
                  <td className="td text-mut text-[12px]">{n.size || "—"}</td>
                  <td className="td text-mut text-[12px]">{dBR(n.date)}</td>
                  <td className="td" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleFav(n)} className={cx("h-7 w-7 rounded-md flex items-center justify-center cursor-pointer", n.fav ? "text-warn" : "text-faint hover:text-ink")} aria-label="Favoritar"><Ic n={I.Star} s={13} c={n.fav ? "fill-current" : ""} /></button>
                      <Menu items={[
                        { icon: I.ExternalLink, label: "Abrir", onClick: () => setDetail(n) },
                        { icon: I.Pencil, label: "Editar", onClick: () => (n.type === "note" ? setNoteModal({ mode: "edit", item: { ...n } }) : toast("Aberto o editor (simulação).", "info", I.Pencil)) },
                        { icon: I.Download, label: "Baixar", onClick: () => toast("Download iniciado (simulação).", "info", I.Download) },
                        { icon: I.Sparkles, label: "Usar no Chat", onClick: () => useInChat(n) },
                        { div: true },
                        { icon: I.Trash2, label: "Excluir", danger: true, onClick: () => setDel(n) },
                      ]} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* modal nota */}
      <Modal open={!!noteModal} onClose={() => setNoteModal(null)} title={noteModal?.item.id ? "Editar nota" : "Nova nota"} sub="Disponível para a IA após salvar (indexação automática)."
        foot={<><Btn v="g" onClick={() => setNoteModal(null)}>Cancelar</Btn>
          <label className="flex items-center gap-2 text-[12.5px] text-mut mr-auto cursor-pointer select-none">
            <input type="checkbox" checked={!!noteModal?.item.fav} onChange={(e) => setNoteModal({ ...noteModal, item: { ...noteModal.item, fav: e.target.checked } })} className="h-[14px] w-[14px] accent-[#a97a22]" />
            <Ic n={I.Star} s={12} c="text-warn" />Favoritar
          </label>
          <Btn v="p" icon={I.Save} onClick={saveNote}>Salvar nota</Btn></>}>
        {noteModal && (
          <div className="space-y-3.5">
            <Field label="Título" req>
              <Input value={noteModal.item.title} onChange={(e: any) => setNoteModal({ ...noteModal, item: { ...noteModal.item, title: e.target.value } })} placeholder="Título da nota" />
            </Field>
            <Field label="Conteúdo" hint="texto simples com formatação leve">
              <div className="flex gap-1 pb-1.5">
                {[I.Bold, I.Italic, I.List, I.Link2].map((ic: any, i: number) => (
                  <button key={i} type="button" onClick={() => toast("Formatação aplicada (demo).", "info")} className="h-7 w-7 rounded-md border border-line2 text-mut hover:text-ink hover:bg-soft flex items-center justify-center cursor-pointer"><Ic n={ic} s={12} /></button>
                ))}
              </div>
              <Textarea rows={6} value={noteModal.item.text} onChange={(e: any) => setNoteModal({ ...noteModal, item: { ...noteModal.item, text: e.target.value } })} placeholder="Escreva sua nota…" />
            </Field>
            <Field label="Tags" hint="Enter para adicionar">
              <TagInput value={noteModal.item.tags || []} onChange={(t: string[]) => setNoteModal({ ...noteModal, item: { ...noteModal.item, tags: t } })} />
            </Field>
          </div>
        )}
      </Modal>

      {/* modal link */}
      <Modal open={linkModal} onClose={() => setLinkModal(false)} title="Novo link" sub="A IA pode ler e resumir a página se você autorizar."
        foot={<><Btn v="g" onClick={() => setLinkModal(false)}>Cancelar</Btn><Btn v="p" icon={I.Save} onClick={saveLink}>Salvar link</Btn></>}>
        <div className="space-y-3.5">
          <Field label="Título" req><Input value={linkItem.title} onChange={(e: any) => setLinkItem({ ...linkItem, title: e.target.value })} placeholder="Nome da referência" /></Field>
          <Field label="URL" req><Input value={linkItem.url} onChange={(e: any) => setLinkItem({ ...linkItem, url: e.target.value })} placeholder="https://…" /></Field>
          <Field label="Descrição"><Textarea rows={3} value={linkItem.desc} onChange={(e: any) => setLinkItem({ ...linkItem, desc: e.target.value })} placeholder="Por que esse link é útil?" /></Field>
        </div>
      </Modal>

      {/* modal upload */}
      <Modal open={upModal} onClose={() => setUpModal(false)} title="Enviar arquivo" sub="PDFs, imagens, áudios e vídeos ficam indexados para a IA.">
        <div className="space-y-3">
          <input ref={fileRef} type="file" hidden onChange={() => fakeUpload()} />
          <button onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-line2 hover:border-acc-400 p-7 flex flex-col items-center text-center transition-colors cursor-pointer">
            <span className="h-10 w-10 rounded-lg bg-soft border border-line flex items-center justify-center mb-2.5"><Ic n={I.Upload} s={17} c="text-mut" /></span>
            <div className="text-[13px] font-medium">Arraste arquivos aqui ou clique para selecionar</div>
            <div className="text-[11.5px] text-faint mt-1">Máx. 25 MB por arquivo (plano Plus) · 8 GB restantes de armazenamento</div>
          </button>
          {upload.length > 0 && (
            <div className="space-y-2">
              {upload.map((f, i) => (
                <div key={i} className="rounded-lg border border-line p-3 anim-in">
                  <div className="flex items-center gap-2.5">
                    <Ic n={I.FileText} s={16} c="text-faint" />
                    <span className="text-[12.5px] font-medium flex-1 truncate">{f.name}</span>
                    {f.state === "up" && <span className="text-[11px] text-faint">{f.pct}%</span>}
                    {f.state === "done" && <Badge v="o" icon={I.Check}>Enviado</Badge>}
                    {f.state === "err" && <Badge v="d" icon={I.XCircle}>Erro</Badge>}
                    {f.state !== "up" && (
                      <button onClick={() => setUpload((u) => u.filter((_, j) => j !== i))} className="text-faint hover:text-danger cursor-pointer"><Ic n={I.X} s={13} /></button>
                    )}
                  </div>
                  {f.state === "up" && <div className="mt-2"><Progress v={f.pct} /></div>}
                  {f.state === "err" && (
                    <div className="mt-1.5 text-[11.5px] text-danger flex items-start gap-1.5"><Ic n={I.AlertCircle} s={12} c="mt-0.5 shrink-0" />{f.err} <button className="underline cursor-pointer" onClick={simulateErr}>Tentar novamente</button></div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center pt-1">
            <button onClick={simulateErr} className="text-[11.5px] text-faint hover:text-danger underline cursor-pointer">Simular erro de tamanho (demo)</button>
            <Btn s="sm" v="g" onClick={() => setUpModal(false)}>Concluir</Btn>
          </div>
        </div>
      </Modal>

      {/* drawer detalhe */}
      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.title || ""} sub={detail ? `${TYPE[detail.type].l} · ${dBR(detail.date)}` : ""}
        foot={detail && <>
          <Btn v="dg" icon={I.Trash2} className="mr-auto" onClick={() => setDel(detail)}>Excluir</Btn>
          <Btn v="o" icon={I.Download} onClick={() => toast("Download iniciado (simulação).", "info", I.Download)}>Baixar</Btn>
          <Btn v="p" icon={I.Sparkles} onClick={() => useInChat(detail)}>Usar no Chat</Btn>
        </>}>
        {detail && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-line">
              <Thumb n={detail} c={detail.type === "note" ? "min-h-[120px]" : "h-44"} />
            </div>
            {detail.url && (
              <div className="flex items-center gap-2 rounded-lg border border-line bg-soft/50 px-3 py-2.5">
                <Ic n={I.Link2} s={13} c="text-faint" />
                <span className="text-[12px] text-acc-600 dark:text-acc-300 truncate flex-1">{detail.url}</span>
                <button className="text-mut hover:text-ink cursor-pointer" onClick={() => toast("Link copiado.", "info", I.Copy)}><Ic n={I.Copy} s={13} /></button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2.5">
              {[["Tipo", TYPE[detail.type].l], ["Tamanho", detail.size || "—"], ["Origem", detail.src || "Você"]].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-line bg-soft/50 p-2.5">
                  <div className="text-[10px] uppercase tracking-wide text-faint font-medium">{l}</div>
                  <div className="text-[12.5px] font-medium mt-1">{v}</div>
                </div>
              ))}
            </div>
            {detail.tags?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {detail.tags.map((t: string) => <Badge key={t} v="n">#{t}</Badge>)}
              </div>
            )}
            <div className="rounded-lg bg-acc-50 dark:bg-acc-950/40 border border-acc-200 dark:border-acc-900 px-3.5 py-3 text-[12px] text-mut leading-relaxed">
              <b className="text-ink flex items-center gap-1.5 mb-1"><Ic n={I.Sparkles} s={12} c="text-acc-600 dark:text-acc-300" />Índice da IA</b>
              Este item está indexado e pode ser citado em respostas, notas geradas e automações. A IA o usou {Math.max(1, detail.title.length % 4)} vezes no último mês.
            </div>
          </div>
        )}
      </Drawer>

      {/* excluir */}
      {del && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setDel(null)} />
          <div className="relative w-full max-w-[380px] bg-panel border border-line rounded-xl shadow-2xl anim-pop p-5">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg bg-danger-soft text-danger flex items-center justify-center"><Ic n={I.Trash2} s={17} /></span>
              <h3 className="text-[15px] font-semibold">Excluir item?</h3>
            </div>
            <p className="text-[12.5px] text-mut mt-3 leading-relaxed">“<b className="text-ink">{del.title}</b>” será removido e a IA deixará de usá-lo como contexto.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Btn v="g" onClick={() => setDel(null)}>Cancelar</Btn>
              <Btn v="d" onClick={() => { setItems((s) => s.filter((x) => x.id !== del.id)); setDel(null); setDetail(null); toast("Item excluído.", "info", I.Trash2); }}>Excluir</Btn>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}

function TagInput({ value, onChange }: any) {
  const [v, setV] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-line2 bg-panel px-2 py-1.5 focus-within:border-acc-500 focus-within:ring-2 focus-within:ring-acc-500/25">
      {value.map((t: string) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-soft border border-line px-1.5 py-0.5 text-[11.5px] text-mut">
          #{t}<button onClick={() => onChange(value.filter((x: string) => x !== t))} className="text-faint hover:text-danger cursor-pointer"><Ic n={I.X} s={10} /></button>
        </span>
      ))}
      <input value={v} onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && v.trim()) { e.preventDefault(); if (!value.includes(v.trim())) onChange([...value, v.trim()]); setV(""); }
        }}
        placeholder={value.length ? "" : "adicionar tag…"}
        className="flex-1 min-w-[100px] bg-transparent outline-none text-[12.5px] placeholder:text-faint px-1 py-0.5" />
    </div>
  );
}
