"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as I from "lucide-react";
import { cx, Ic, Avatar, Progress, Menu, Dot, Badge } from "./ui";
import { useApp } from "@/lib/store";
import { fmt } from "@/lib/mock";

export const NAV = [
  { h: "/chat", l: "Chat", i: I.MessageSquare },
  { h: "/historico", l: "Histórico", i: I.History },
  { h: "/financeiro", l: "Financeiro", i: I.Wallet },
  { h: "/integracoes", l: "Integrações", i: I.Plug },
  { h: "/notas", l: "Notas & Arquivos", i: I.StickyNote },
  { h: "/automacoes", l: "Automações", i: I.Workflow },
  { h: "/personalizacao", l: "Personalização", i: I.Palette },
  { h: "/configuracoes", l: "Configurações", i: I.Settings },
];

export function Logo({ s = 28 }: any) {
  return (
    <Link href="/chat" className="flex items-center gap-2 shrink-0">
      <span className="rounded-lg bg-ink text-bg flex items-center justify-center" style={{ width: s, height: s }}>
        <Ic n={I.Sparkles} s={s * 0.5} />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Aura</span>
    </Link>
  );
}

function AvatarMenu() {
  const { user, toast } = useApp();
  const router = useRouter();
  return (
    <Menu
      icon={null}
      tip="Menu do usuário"
      btnCls="!h-9 !w-9 rounded-full overflow-hidden"
      items={[
        { icon: I.User, label: "Perfil", onClick: () => router.push("/configuracoes?tab=conta") },
        { icon: I.Gauge, label: "Plano", onClick: () => router.push("/planos") },
        { icon: I.Settings, label: "Configurações", onClick: () => router.push("/configuracoes") },
        { div: true },
        { icon: I.LogOut, label: "Sair", danger: true, onClick: () => { toast("Sessão encerrada.", "info", I.LogOut); router.push("/login"); } },
      ]}>
      <Avatar name={user.name} s={30} />
    </Menu>
  );
}

function CreditsBox() {
  const { user } = useApp();
  const used = user.chat + user.auto;
  const pct = Math.min(100, Math.round((used / user.credits) * 100));
  const tone = pct >= 90 ? "d" : pct >= 70 ? "w" : "a";
  return (
    <Link href="/configuracoes?tab=plano" className="block rounded-lg border border-line bg-soft/60 p-3 hover:border-acc-300 transition-colors">
      <div className="flex items-center justify-between text-[11.5px] font-medium text-mut">
        <span className="flex items-center gap-1.5"><Ic n={I.Gauge} s={12} />Créditos de IA</span>
        <Badge v="a">{user.plan.toUpperCase()}</Badge>
      </div>
      <div className="mt-2 text-[13px] font-semibold">{fmt(used)} <span className="text-faint font-normal text-[11.5px]">de {fmt(user.credits)}</span></div>
      <div className="mt-1.5"><Progress v={pct} tone={tone} /></div>
      <div className="mt-2 text-[11px] text-acc-600 dark:text-acc-300 flex items-center gap-1">
        Gerenciar créditos<Ic n={I.ChevronRight} s={11} />
      </div>
    </Link>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);
  const active = (h: string) => pathname === h || pathname.startsWith(h + "/");
  const onChat = active("/chat");

  return (
    <div className="min-h-dvh bg-bg">
      {/* ===== Sidebar desktop ===== */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[248px] flex-col border-r border-line bg-panel z-40">
        <div className="flex items-center justify-between px-4 h-14 border-b border-line shrink-0">
          <Logo />
          <AvatarMenu />
        </div>
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
          {NAV.map((n) => (
            <Link key={n.h} href={n.h}
              className={cx("flex items-center gap-2.5 rounded-lg px-2.5 h-9 text-[13.5px] font-medium transition-colors",
                active(n.h) ? "bg-acc-100/80 text-acc-800 dark:bg-acc-950 dark:text-acc-200" : "text-mut hover:text-ink hover:bg-soft")}>
              <Ic n={n.i} s={16} c={active(n.h) ? "" : "text-faint"} />
              {n.l}
              {n.h === "/integracoes" && <Dot tone="w" pulse c="ml-auto" />}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-3 shrink-0">
          <CreditsBox />
        </div>
      </aside>

      {/* ===== Topbar mobile ===== */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 z-40 bg-panel border-b border-line flex items-center justify-between px-4">
        <Logo s={26} />
        <AvatarMenu />
      </header>

      {/* ===== Bottom nav mobile ===== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-panel border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 h-[58px]">
          {[
            { h: "/chat", l: "Chat", i: I.MessageSquare },
            { h: "/financeiro", l: "Financeiro", i: I.Wallet },
            { h: "/notas", l: "Notas", i: I.StickyNote },
            { h: "/integracoes", l: "Integrações", i: I.Plug },
          ].map((n) => (
            <Link key={n.h} href={n.h}
              className={cx("flex flex-col items-center justify-center gap-1 text-[10px] font-medium", active(n.h) ? "text-ink" : "text-faint")}>
              <Ic n={n.i} s={19} c={active(n.h) ? "text-acc-600 dark:text-acc-300" : ""} />
              {n.l}
            </Link>
          ))}
          <button onClick={() => setMoreOpen(true)}
            className={cx("flex flex-col items-center justify-center gap-1 text-[10px] font-medium cursor-pointer",
              !onChat && ["/historico", "/automacoes", "/personalizacao", "/configuracoes", "/planos"].some((p) => pathname.startsWith(p)) ? "text-ink" : "text-faint")}>
            <Ic n={I.MoreHorizontal} s={19} />
            Mais
          </button>
        </div>
      </nav>

      {/* ===== Sheet "Mais" (mobile) ===== */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[90]">
          <div className="absolute inset-0 bg-black/45 anim-in" onClick={() => setMoreOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-panel border-t border-line rounded-t-2xl anim-sheet pb-[env(safe-area-inset-bottom)]">
            <div className="h-1 w-10 rounded-full bg-line2 mx-auto mt-2.5" />
            <div className="p-4 pt-3">
              <div className="text-[12px] font-medium text-faint uppercase tracking-wide px-1 mb-1.5">Continuar</div>
              {[
                { h: "/historico", l: "Histórico", i: I.History, d: "Gerenciar suas conversas" },
                { h: "/automacoes", l: "Automações", i: I.Workflow, d: "Tarefas automáticas" },
                { h: "/personalizacao", l: "Personalização", i: I.Palette, d: "Memória, tom e aparência" },
                { h: "/configuracoes", l: "Configurações", i: I.Settings, d: "Conta, plano e privacidade" },
                { h: "/planos", l: "Planos", i: I.Gauge, d: "Free, Plus e Pro" },
              ].map((n) => (
                <Link key={n.h} href={n.h} onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-soft transition-colors">
                  <span className="h-9 w-9 rounded-lg bg-soft border border-line flex items-center justify-center text-mut"><Ic n={n.i} s={16} /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13.5px] font-medium">{n.l}</span>
                    <span className="block text-[11.5px] text-faint">{n.d}</span>
                  </span>
                  <Ic n={I.ChevronRight} s={14} c="text-faint" />
                </Link>
              ))}
              <div className="mt-3"><CreditsBox /></div>
              <button onClick={() => { setMoreOpen(false); toast("Sessão encerrada.", "info", I.LogOut); window.location.href = "/login"; }}
                className="w-full mt-2 flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] font-medium text-danger hover:bg-danger-soft cursor-pointer">
                <Ic n={I.LogOut} s={15} />Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Conteúdo ===== */}
      <main className={cx("lg:pl-[248px]", !onChat && "pt-14 lg:pt-0")}>{children}</main>
    </div>
  );
}

export function Page({ children, c = "" }: any) {
  return (
    <div className={cx("max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-10", c)}>
      {children}
    </div>
  );
}
