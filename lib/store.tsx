"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as I from "lucide-react";
import { cx, Ic, Modal } from "@/components/ui";

type Toast = { id: number; msg: string; tone?: "ok" | "err" | "info"; icon?: any };
type User = {
  name: string; first: string; email: string;
  plan: "free" | "plus" | "pro"; credits: number; price: number;
  chat: number; auto: number; renews: string; cancelling: boolean;
};

const Ctx = createContext<any>(null);
export const useApp = () => useContext(Ctx);

let tid = 1;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [assistant, setAssistant] = useState("Bruce");
  const [user, setUser] = useState<User>({
    name: "Rafael Souza", first: "Rafael", email: "rafael.souza@gmail.com",
    plan: "plus", credits: 10000, price: 39.9, chat: 2615, auto: 1227,
    renews: "12 de outubro de 2026", cancelling: false,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [rec, setRec] = useState<any>(null); // modal global de reconexão

  const toast = useCallback((msg: string, tone: "ok" | "err" | "info" = "ok", icon?: any) => {
    const t = { id: tid++, msg, tone, icon };
    setToasts((s) => [...s.slice(-3), t]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 4200);
  }, []);

  const setTheme = useCallback((t: "light" | "dark") => {
    setThemeState(t);
    try { localStorage.setItem("aura-theme", t); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, setTheme, assistant, setAssistant, user, setUser, toasts, toast, rec, setRec }}>
      {children}
    </Ctx.Provider>
  );
}

export function Toaster() {
  const { toasts } = useApp();
  return (
    <div className="fixed z-[130] top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 sm:top-4 flex flex-col gap-2 w-[calc(100%-24px)] sm:w-auto sm:min-w-[300px] pointer-events-none">
      {toasts.map((t: Toast) => (
        <div key={t.id} className="anim-pop pointer-events-auto flex items-center gap-2.5 rounded-lg bg-ink text-bg dark:bg-elev dark:text-ink dark:border dark:border-line px-3.5 py-2.5 shadow-lg text-[13px]">
          <Ic n={t.icon || (t.tone === "err" ? I.AlertCircle : t.tone === "info" ? I.Info : I.CheckCircle2)} s={15}
            c={t.tone === "err" ? "text-danger" : t.tone === "info" ? "text-acc-400" : "text-ok"} />
          <span className="flex-1 leading-snug">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// Modal global de reconexão de integração (token expirado)
export function ReconnectModal() {
  const { rec, setRec, toast } = useApp();
  const [busy, setBusy] = useState(false);
  if (!rec) return null;
  const go = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setRec(null);
      toast(`Conexão com ${rec.name} restaurada com sucesso.`);
    }, 1500);
  };
  return (
    <Modal open onClose={() => !busy && setRec(null)} title="Conexão expirada" w="max-w-md"
      foot={
        <>
          <button className="h-9 px-3.5 rounded-lg text-[13px] font-medium text-mut hover:bg-soft" onClick={() => !busy && setRec(null)}>
            Mais tarde
          </button>
          <button onClick={go} disabled={busy}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-ink text-bg text-[13px] font-medium hover:opacity-85 disabled:opacity-60">
            {busy ? <I.Loader2 size={14} className="animate-spin" /> : <I.Plug size={14} />}
            {busy ? "Reconectando…" : "Reconectar agora"}
          </button>
        </>
      }>
      <div className="flex items-start gap-3.5">
        <div className="h-11 w-11 rounded-xl flex items-center justify-center text-[17px] font-semibold text-white shrink-0" style={{ background: rec.color }}>
          {rec.name[0]}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] leading-snug">
            Sua conexão com <b>{rec.name}</b> expirou. A IA não consegue mais usar essa ferramenta até você reconectar.
          </p>
          <div className="mt-3 space-y-1.5 text-[12px] text-mut">
            <div className="flex items-center gap-2"><Ic n={I.History} s={12} c="text-faint" /> Última sincronização: <b className="text-ink">{rec.sync || "há 3 dias"}</b></div>
            <div className="flex items-center gap-2"><Ic n={I.ShieldCheck} s={12} c="text-faint" /> Permissões mantidas: <b className="text-ink">{rec.perm}</b></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
