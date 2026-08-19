import type { ComponentType, CSSProperties } from "react";
import { fmtClock, MODE_META, type Mode, type Settings } from "../lib/core";
import type { Pomodoro } from "../hooks/useTimer";
import {
  CoffeeIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  SkipIcon,
  TargetIcon,
} from "./icons";

const MODES: Mode[] = ["focus", "short", "long"];
const MODE_ICON: Record<Mode, ComponentType<{ width: number; height: number }>> = {
  focus: TargetIcon,
  short: CoffeeIcon,
  long: MoonIcon,
};

const R = 146;
const CIRC = 2 * Math.PI * R;

export function TimerView({
  pomo,
  settings,
}: {
  pomo: Pomodoro;
  settings: Settings;
}) {
  const meta = MODE_META[pomo.mode];
  const idx = MODES.indexOf(pomo.mode);
  const frac = pomo.total > 0 ? pomo.remaining / pomo.total : 0;
  const [mm, ss] = fmtClock(pomo.remaining).split(":");
  const filled =
    pomo.mode === "long"
      ? settings.longEvery
      : pomo.cycle % settings.longEvery;

  return (
    <div className="anim-rise flex flex-col items-center">
      {/* ---- seletor de modo ---- */}
      <div
        role="tablist"
        aria-label="Modo do timer"
        className="relative mb-8 grid w-full max-w-md grid-cols-3 rounded-full border border-ink-700 bg-ink-900/90 p-1"
      >
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full transition-transform duration-400 ease-[cubic-bezier(0.3,0.8,0.3,1)]"
          style={{
            background: meta.soft,
            boxShadow: `inset 0 0 0 1px ${meta.ring}`,
            transform: `translateX(${idx * 100}%)`,
          }}
        />
        {MODES.map((m, i) => {
          const Icon = MODE_ICON[m];
          const active = i === idx;
          return (
            <button
              key={m}
              role="tab"
              aria-selected={active}
              onClick={() => pomo.switchMode(m)}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300 ${
                active ? "" : "text-sand-400 hover:text-sand-200"
              }`}
              style={active ? { color: MODE_META[m].color } : undefined}
            >
              <Icon width={16} height={16} />
              <span className={i === 0 ? "" : "hidden sm:inline"}>
                {MODE_META[m].label}
              </span>
              {i === 0 && <span className="hidden sm:inline sr-only">Foco</span>}
            </button>
          );
        })}
      </div>

      {/* ---- anel do timer ---- */}
      <div className="relative w-full max-w-[340px]">
        <div
          aria-hidden
          className={`anim-breathe absolute inset-6 rounded-full blur-3xl transition-colors duration-700 ${
            pomo.running ? "" : "anim-paused opacity-60"
          }`}
          style={{ background: meta.soft }}
        />
        <svg viewBox="0 0 340 340" className="relative w-full">
          {/* marcações de minuto */}
          <circle
            cx="170" cy="170" r="162"
            fill="none" stroke="var(--color-ink-600)" strokeWidth="3"
            strokeDasharray="2 14.96" opacity="0.7"
          />
          {/* mostrador giratório */}
          <circle
            cx="170" cy="170" r="155"
            fill="none" stroke={meta.color} strokeWidth="1.5"
            strokeDasharray="1 30" opacity="0.35" strokeLinecap="round"
            className={`anim-spin-slow origin-center ${pomo.running ? "" : "anim-paused"}`}
          />
          {/* trilha */}
          <circle
            cx="170" cy="170" r={R}
            fill="none" stroke="var(--color-ink-700)" strokeWidth="10"
          />
          {/* progresso */}
          <circle
            cx="170" cy="170" r={R}
            fill="none" stroke={meta.color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - frac)}
            transform="rotate(-90 170 170)"
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.6s ease",
              filter: `drop-shadow(0 0 10px ${meta.ring})`,
            }}
          />
        </svg>

        {/* mostrador central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p
            className="flex items-center gap-2 text-[11px] font-bold tracking-[0.28em] uppercase"
            style={{ color: meta.color }}
          >
            <span
              className={`h-2 w-2 rounded-full ${pomo.running ? "animate-pulse" : ""}`}
              style={{ background: meta.color, boxShadow: `0 0 10px ${meta.ring}` }}
            />
            {pomo.running ? "em curso" : pomo.remaining < pomo.total ? "pausado" : "pronto"}
          </p>
          <p
            className="font-mono text-[76px] leading-none font-light tracking-tight text-sand-100 tabular-nums sm:text-[88px]"
            style={{ textShadow: `0 0 34px ${meta.soft}` }}
          >
            {mm}
            <span className={pomo.running ? "colon-blink" : ""}>:</span>
            {ss}
          </p>
          <p className="font-display text-lg font-semibold text-sand-300">
            {meta.label}
            <span className="text-sand-500"> · {settings[modeKey(pomo.mode)]} min</span>
          </p>
        </div>
      </div>

      {/* ---- ciclo até a pausa longa ---- */}
      <div
        className="mt-6 flex items-center gap-2.5"
        aria-label={`${filled} de ${settings.longEvery} pomodoros do ciclo`}
        title={`Pausa longa a cada ${settings.longEvery} pomodoros`}
      >
        {Array.from({ length: settings.longEvery }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: i < filled ? 22 : 10,
              background: i < filled ? meta.color : "var(--color-ink-600)",
              boxShadow: i < filled ? `0 0 8px ${meta.ring}` : "none",
            }}
          />
        ))}
      </div>

      {/* ---- controles ---- */}
      <div className="mt-7 flex w-full max-w-md items-center justify-center gap-3">
        <button
          type="button"
          onClick={pomo.reset}
          aria-label="Reiniciar sessão"
          className="grid h-12 w-12 place-items-center rounded-full border border-ink-600 bg-ink-800 text-sand-300 transition hover:border-ink-500 hover:text-sand-100 hover:-rotate-90 duration-300 active:scale-90"
        >
          <ResetIcon width={18} height={18} />
        </button>

        <button
          type="button"
          onClick={pomo.toggle}
          className="group flex h-14 min-w-[10.5rem] items-center justify-center gap-3 rounded-full px-8 font-display text-lg font-bold text-ink-950 shadow-[0_14px_36px_-10px_var(--acc)] transition-all duration-300 hover:scale-[1.04] active:scale-95"
          style={{ background: meta.color, ["--acc" as string]: meta.ring } as CSSProperties}
        >
          {pomo.running ? (
            <PauseIcon width={20} height={20} />
          ) : (
            <PlayIcon width={20} height={20} className="transition-transform group-hover:scale-110" />
          )}
          {pomo.running ? "Pausar" : pomo.remaining < pomo.total ? "Continuar" : "Iniciar"}
        </button>

        <button
          type="button"
          onClick={pomo.skip}
          aria-label="Pular para a próxima sessão"
          className="grid h-12 w-12 place-items-center rounded-full border border-ink-600 bg-ink-800 text-sand-300 transition hover:border-ink-500 hover:text-sand-100 hover:translate-x-0.5 duration-300 active:scale-90"
        >
          <SkipIcon width={18} height={18} />
        </button>
      </div>
    </div>
  );
}

const modeKey = (m: Mode) =>
  m === "focus" ? ("focus" as const) : m === "short" ? ("short" as const) : ("long" as const);
