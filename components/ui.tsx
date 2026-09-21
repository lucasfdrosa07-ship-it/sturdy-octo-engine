"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as I from "lucide-react";

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

// ---------- ícone ----------
export function Ic({ n, s = 16, c = "", sw }: any) {
  const N = n;
  return <N size={s} strokeWidth={sw ?? 1.75} className={c} aria-hidden />;
}

// ---------- botão ----------
export function Btn({ v = "o", s = "md", icon: N, className, children, ...rest }: any) {
  const base = "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 select-none whitespace-nowrap cursor-pointer disabled:opacity-45 disabled:pointer-events-none";
  const vs: any = {
    p: "bg-ink text-bg hover:opacity-85",
    o: "border border-line2 bg-panel text-ink hover:bg-soft",
    g: "text-mut hover:text-ink hover:bg-soft",
    d: "bg-danger text-white hover:opacity-90",
    dg: "text-danger hover:bg-danger-soft",
  };
  const ss: any = { md: "h-9 px-3.5 text-[13.5px]", sm: "h-8 px-3 text-[13px]", xs: "h-7 px-2.5 text-[12px]" };
  return (
    <button className={cx(base, vs[v], ss[s], className)} {...rest}>
      {N && <Ic n={N} s={s === "md" ? 15 : s === "sm" ? 14 : 13} />}
      {children}
    </button>
  );
}

export function IconBtn({ icon: N, label, onClick, c = "", s = 15, dis }: any) {
  return (
    <span className="relative inline-flex">
      <button type="button" onClick={onClick} disabled={dis} aria-label={label}
        className={cx("h-8 w-8 rounded-lg flex items-center justify-center text-mut hover:text-ink hover:bg-soft transition-colors disabled:opacity-40 cursor-pointer", c)}>
        <Ic n={N} s={s} />
      </button>
      {label && (
        <span className="pointer-events-none absolute z-[70] bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-ink text-bg dark:bg-elev dark:border dark:border-line px-2 py-1 text-[11px] opacity-0 transition-opacity delay-200 group-hover:opacity-100 peer-hover:opacity-100 hover:opacity-100">
          {label}
        </span>
      )}
    </span>
  );
}

// ---------- badge ----------
export function Badge({ v = "n", children, icon: N, c = "" }: any) {
  const vs: any = {
    n: "bg-soft text-mut",
    a: "bg-acc-100 text-acc-700 dark:bg-acc-950 dark:text-acc-300",
    o: "bg-ok-soft text-ok",
    w: "bg-warn-soft text-warn",
    d: "bg-danger-soft text-danger",
    x: "border border-line2 text-mut",
  };
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[11px] font-medium leading-none whitespace-nowrap", vs[v], c)}>
      {N && <Ic n={N} s={11} />}
      {children}
    </span>
  );
}

// ---------- card ----------
export function Card({ children, className, onClick }: any) {
  return (
    <div onClick={onClick} className={cx("rounded-[10px] border border-line bg-panel", className)}>
      {children}
    </div>
  );
}

export function CardHead({ title, desc, action }: any) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-3 border-b border-line">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold">{title}</div>
        {desc && <div className="text-[11.5px] text-mut mt-0.5">{desc}</div>}
      </div>
      {action}
    </div>
  );
}

// ---------- form ----------
export function Field({ label, hint, err, children, req }: any) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12.5px] font-medium">{label}{req && <span className="text-danger"> *</span>}</span>
        {hint && <span className="text-[11px] text-faint">{hint}</span>}
      </div>
      {children}
      {err && <div className="mt-1 text-[11.5px] text-danger flex items-center gap-1"><Ic n={I.AlertCircle} s={11} />{err}</div>}
    </label>
  );
}

export const inputCls = "w-full h-[38px] rounded-lg border border-line2 bg-panel text-[13.5px] placeholder:text-faint focus:border-acc-500 focus:outline-none focus:ring-2 focus:ring-acc-500/25 transition-colors";
export const inputClsSm = "h-[34px] px-2.5 text-[13px]";

export function Input({ className = "px-3", ...rest }: any) {
  return <input className={cx(inputCls, className)} {...rest} />;
}
export function Textarea({ className = "px-3", ...rest }: any) {
  return <textarea className={cx(inputCls, "h-auto py-2.5 resize-none leading-relaxed", className)} {...rest} />;
}
export function Search({ className, ...rest }: any) {
  return (
    <div className={cx("relative", className)}>
      <Ic n={I.Search} s={14} c="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
      <input className={cx(inputCls, "pl-8.5 pr-3")} placeholder="Buscar…" {...rest} />
    </div>
  );
}
export function Select({ className, opts, ...rest }: any) {
  return (
    <div className={cx("relative", className)}>
      <select className={cx(inputCls, "appearance-none pl-3 pr-8 cursor-pointer")} {...rest}>
        {opts.map((o: any) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
      <Ic n={I.ChevronDown} s={14} c="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
    </div>
  );
}

// ---------- toggle ----------
export function Toggle({ on, onChange, dis }: any) {
  return (
    <button type="button" role="switch" aria-checked={on} disabled={dis}
      onClick={() => onChange && onChange(!on)}
      className={cx("relative h-[22px] w-[38px] rounded-full transition-colors duration-200 shrink-0 cursor-pointer", on ? "bg-acc-600" : "bg-line2", dis && "opacity-40 pointer-events-none")}>
      <span className={cx("absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200", on ? "left-[19px]" : "left-[3px]")} />
    </button>
  );
}

export function Checkbox({ checked, onChange, children }: any) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
      <button type="button" onClick={() => onChange && onChange(!checked)}
        className={cx("mt-0.5 h-[18px] w-[18px] rounded-[5px] border flex items-center justify-center transition-colors shrink-0 cursor-pointer",
          checked ? "bg-ink border-ink text-bg" : "border-line2 bg-panel group-hover:border-acc-400")}>
        {checked && <Ic n={I.Check} s={12} sw={2.5} />}
      </button>
      {children && <span className="text-[13px] leading-snug">{children}</span>}
    </label>
  );
}

// ---------- segmented ----------
export function Seg({ opts, val, onChange, s = "md" }: any) {
  return (
    <div className="inline-flex bg-soft rounded-lg p-0.5 border border-line">
      {opts.map((o: any) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={cx("inline-flex items-center justify-center rounded-[7px] font-medium transition-all",
            s === "sm" ? "px-2.5 h-[26px] text-[12px]" : "px-3.5 h-8 text-[12.5px]",
            val === o.v ? "bg-panel shadow-sm text-ink" : "text-mut hover:text-ink")}>
          {o.icon && <Ic n={o.icon} s={13} c="mr-1.5 -ml-0.5" />}
          {o.l}
        </button>
      ))}
    </div>
  );
}

// ---------- tabs ----------
export function Tabs({ tabs, val, onChange }: any) {
  return (
    <div className="flex gap-5 border-b border-line overflow-x-auto">
      {tabs.map((t: any) => (
        <button key={t.v} onClick={() => onChange(t.v)}
          className={cx("pb-2.5 -mb-px text-[13.5px] font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer",
            val === t.v ? "border-acc-600 text-ink" : "border-transparent text-mut hover:text-ink")}>
          {t.icon && <Ic n={t.icon} s={14} />}
          {t.l}
          {t.c != null && <span className="text-[11px] text-faint font-normal">{t.c}</span>}
        </button>
      ))}
    </div>
  );
}

// ---------- dropdown menu ----------
export function Menu({ items, icon = I.MoreHorizontal, btnCls, align = "right", label, size = 15, tip, children }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button type="button" aria-label={tip || "Menu"} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={cx("h-8 w-8 rounded-lg flex items-center justify-center text-mut hover:text-ink hover:bg-soft transition-colors cursor-pointer", btnCls)}>
        {label ? <span className="text-[12.5px] font-medium">{label}</span> : children ? children : <Ic n={icon} s={size} />}
      </button>
      {open && (
        <div className={cx("absolute z-[80] mt-1 min-w-[190px] bg-panel border border-line rounded-lg shadow-lg py-1 anim-pop", align === "right" ? "right-0" : "left-0")}>
          {items.map((it: any, i: number) =>
            it.div ? (
              <div key={i} className="h-px bg-line my-1" />
            ) : (
              <button key={i} type="button"
                onClick={(e) => { e.stopPropagation(); setOpen(false); it.onClick && it.onClick(); }}
                className={cx("w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-soft text-left cursor-pointer", it.danger ? "text-danger" : "text-ink")}>
                {it.icon && <Ic n={it.icon} s={14} c={it.danger ? "" : "text-mut"} />}
                <span className="flex-1">{it.label}</span>
                {it.hint && <span className="text-[10.5px] text-faint">{it.hint}</span>}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ---------- tooltip ----------
export function Tip({ label, side = "top", children }: any) {
  return (
    <span className="relative inline-flex group/tip">
      {children}
      <span className={cx("pointer-events-none absolute z-[70] whitespace-nowrap rounded-md bg-ink text-bg dark:bg-elev dark:border dark:border-line px-2 py-1 text-[11px] opacity-0 group-hover/tip:opacity-100 transition-opacity delay-200",
        side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
        side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-1.5",
        side === "right" && "left-full top-1/2 -translate-y-1/2 ml-1.5")}>
        {label}
      </span>
    </span>
  );
}

// ---------- modal / drawer ----------
export function Modal({ open, onClose, title, sub, w = "max-w-lg", children, foot, noPad }: any) {
  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") onClose && onClose(); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/45 anim-in" onClick={onClose} />
      <div className={cx("relative w-full bg-panel border border-line rounded-t-2xl sm:rounded-xl shadow-2xl anim-pop flex flex-col max-h-[92dvh] sm:max-h-[85dvh]", w)}>
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-line shrink-0">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold tracking-tight">{title}</div>
            {sub && <div className="text-[12px] text-mut mt-0.5">{sub}</div>}
          </div>
          <button onClick={onClose} className="h-8 w-8 -mr-1 rounded-lg flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={I.X} s={15} /></button>
        </div>
        <div className={cx("overflow-y-auto", noPad ? "" : "px-5 py-4")}>{children}</div>
        {foot && <div className="px-5 py-3.5 border-t border-line flex items-center justify-end gap-2 shrink-0 bg-soft/40 rounded-b-2xl sm:rounded-b-xl">{foot}</div>}
      </div>
    </div>,
    document.body
  );
}

export function Drawer({ open, onClose, title, sub, children, foot, w = "sm:w-[460px]" }: any) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/45 anim-in" onClick={onClose} />
      <div className={cx("absolute inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto bg-panel border-t sm:border-t-0 sm:border-l border-line shadow-2xl anim-sheet sm:anim-slide-r flex flex-col max-h-[88dvh] sm:max-h-full", w)}>
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-line shrink-0">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold tracking-tight">{title}</div>
            {sub && <div className="text-[12px] text-mut mt-0.5">{sub}</div>}
          </div>
          <button onClick={onClose} className="h-8 w-8 -mr-1 rounded-lg flex items-center justify-center text-mut hover:text-ink hover:bg-soft cursor-pointer"><Ic n={I.X} s={15} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {foot && <div className="px-5 py-3.5 border-t border-line flex items-center justify-end gap-2 shrink-0 bg-soft/40">{foot}</div>}
      </div>
    </div>,
    document.body
  );
}

// ---------- confirmação ----------
export function Confirm({ open, onClose, onYes, title, desc, yes = "Excluir", danger = true, text }: any) {
  const [v, setV] = useState("");
  useEffect(() => { if (open) setV(""); }, [open]);
  return (
    <Modal open={open} onClose={onClose} title={title} w="max-w-sm"
      foot={
        <>
          <Btn v="g" onClick={onClose}>Cancelar</Btn>
          <Btn v={danger ? "d" : "p"} disabled={!!text && v !== text} onClick={() => { onYes(); onClose(); }}>{yes}</Btn>
        </>
      }>
      <div className="text-[13px] text-mut leading-relaxed">{desc}</div>
      {text && (
        <div className="mt-3">
          <Field label={`Digite <b>${text}</b> para confirmar`}>
            <Input value={v} onChange={(e: any) => setV(e.target.value)} placeholder={text} />
          </Field>
        </div>
      )}
    </Modal>
  );
}

// ---------- estados ----------
export function Empty({ icon: N = I.Inbox, title, desc, action }: any) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 anim-in">
      <div className="h-11 w-11 rounded-xl bg-soft border border-line flex items-center justify-center mb-3.5">
        <Ic n={N} s={19} c="text-faint" />
      </div>
      <div className="text-[14px] font-medium">{title}</div>
      {desc && <div className="text-[12.5px] text-mut mt-1 max-w-[320px] leading-relaxed">{desc}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Progress({ v = 0, tone = "a", h = "h-1.5", c = "" }: any) {
  const t: any = { a: "bg-acc-600", o: "bg-ok", d: "bg-danger", w: "bg-warn" };
  return (
    <div className={cx("w-full rounded-full bg-soft overflow-hidden", h, c)}>
      <div className={cx("h-full rounded-full transition-all duration-500", t[tone])} style={{ width: `${Math.min(100, Math.max(0, v))}%` }} />
    </div>
  );
}

export function Skel({ c = "" }: any) {
  return <div className={cx("skel", c)} />;
}

export function Stat({ icon: N, label, value, sub, subTone }: any) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-[12px] font-medium text-mut">
        <span className="h-[26px] w-[26px] rounded-md bg-soft border border-line flex items-center justify-center"><Ic n={N} s={13} /></span>
        {label}
      </div>
      <div className="mt-2.5 text-[21px] font-semibold tracking-tight">{value}</div>
      {sub && <div className={cx("text-[11.5px] mt-0.5", subTone || "text-faint")}>{sub}</div>}
    </Card>
  );
}

export function Avatar({ name, s = 32, c = "" }: any) {
  const init = String(name).split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className={cx("rounded-full bg-acc-100 text-acc-700 dark:bg-acc-950 dark:text-acc-300 flex items-center justify-center font-semibold shrink-0", c)}
      style={{ width: s, height: s, fontSize: s * 0.34 }}>
      {init}
    </div>
  );
}

export function LogoTile({ name, color = "#40668a", dark = false, s = 40, r = 10 }: any) {
  return (
    <div className="flex items-center justify-center font-semibold text-white shrink-0"
      style={{ width: s, height: s, borderRadius: r, background: color, fontSize: s * 0.4, color: dark ? "#1a2029" : "#fff" }}>
      {name[0]}
    </div>
  );
}

export function Kbd({ children }: any) {
  return <kbd className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded border border-line2 bg-soft text-[10.5px] font-semibold text-mut">{children}</kbd>;
}

export function Dot({ tone = "o", pulse, c = "" }: any) {
  const t: any = { o: "bg-ok", w: "bg-warn", d: "bg-danger", a: "bg-acc-500", n: "bg-line2" };
  return <span className={cx("inline-block h-2 w-2 rounded-full", t[tone], pulse && "pulse-soft", c)} />;
}

export function PageHead({ title, sub, actions }: any) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[19px] font-semibold tracking-tight">{title}</h1>
        {sub && <p className="text-[12.5px] text-mut mt-1 max-w-[580px] leading-relaxed">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// QR fake (Pix / 2FA)
export function QrFake({ seed = "aura", s = 148 }: any) {
  const N = 21;
  const cells: React.ReactNode[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rnd = () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; };
  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue;
      if (rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
    }
  const finder = (fx: number, fy: number) => (
    <g key={`f${fx}${fy}`}>
      <rect x={fx} y={fy} width={7} height={7} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={fx + 2} y={fy + 2} width={3} height={3} fill="currentColor" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${N} ${N}`} width={s} height={s} className="text-ink" shapeRendering="crispEdges">
      <g fill="currentColor">{cells}</g>
      {finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
    </svg>
  );
}

// helper de datas
export const dBR = (iso: string | null) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
export const dBRshort = (iso: string | null) => {
  if (!iso) return "—";
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};
