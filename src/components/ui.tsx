import type { ReactNode } from "react";
import { clamp } from "../lib/core";
import { MinusIcon, PlusIcon } from "./icons";
import { playTick } from "../lib/sound";

/* ---------- Stepper numérico ---------- */

export function Stepper({
  label,
  hint,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const set = (v: number) => onChange(clamp(v, min, max));
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-sand-200">{label}</p>
        {hint && <p className="text-xs text-sand-500">{hint}</p>}
      </div>
      <div className="flex items-center gap-1 rounded-full border border-ink-600 bg-ink-900 p-1">
        <button
          type="button"
          aria-label={`Diminuir ${label}`}
          onClick={() => { playTick(); set(value - 1); }}
          className="grid h-7 w-7 place-items-center rounded-full text-sand-400 transition hover:bg-ink-700 hover:text-sand-100 active:scale-90"
        >
          <MinusIcon width={14} height={14} />
        </button>
        <div className="flex w-[4.6rem] items-baseline justify-center gap-1 font-mono">
          <input
            type="number"
            inputMode="numeric"
            value={value}
            min={min}
            max={max}
            aria-label={label}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n)) set(n);
            }}
            onBlur={(e) => {
              const n = parseInt(e.target.value, 10);
              onChange(clamp(Number.isNaN(n) ? min : n, min, max));
            }}
            className="w-10 bg-transparent text-center text-base font-medium text-sand-100 outline-none"
          />
          <span className="text-[11px] text-sand-500">{unit}</span>
        </div>
        <button
          type="button"
          aria-label={`Aumentar ${label}`}
          onClick={() => { playTick(); set(value + 1); }}
          className="grid h-7 w-7 place-items-center rounded-full text-sand-400 transition hover:bg-ink-700 hover:text-sand-100 active:scale-90"
        >
          <PlusIcon width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Interruptor ---------- */

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-sand-200">{label}</p>
        {hint && <p className="text-xs text-sand-500">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => { playTick(); onChange(!checked); }}
        className="relative h-6.5 w-12 shrink-0 rounded-full border transition-colors duration-300"
        style={{
          background: checked ? "var(--acc)" : "var(--color-ink-700)",
          borderColor: checked ? "var(--acc)" : "var(--color-ink-600)",
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-sand-100 shadow transition-transform duration-300"
          style={{ transform: checked ? "translateX(22px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

/* ---------- Cartão ---------- */

export function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={`anim-rise rounded-xl border border-ink-700 bg-ink-800/80 p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)] ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}

export function CardTitle({
  icon,
  children,
  aside,
}: {
  icon?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.14em] text-sand-300 uppercase">
        {icon && <span style={{ color: "var(--acc)" }}>{icon}</span>}
        {children}
      </h2>
      {aside}
    </div>
  );
}

/* ---------- Toasts ---------- */

export interface ToastItem {
  id: number;
  text: string;
  color: string;
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onDismiss(t.id)}
          className="anim-toast pointer-events-auto flex max-w-md items-center gap-3 rounded-full border border-ink-600 bg-ink-800/95 py-2.5 pr-5 pl-3 text-left text-sm font-medium text-sand-100 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-sm transition hover:border-ink-500"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: t.color, boxShadow: `0 0 12px ${t.color}` }}
          />
          {t.text}
        </button>
      ))}
    </div>
  );
}
