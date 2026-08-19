import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  DEFAULT_SETTINGS,
  dateKey,
  fmtClock,
  MODE_META,
  todayLong,
  weekKey,
  type Mode,
  type PlannerData,
  type Settings,
  type StatsData,
} from "./lib/core";
import { useStored } from "./hooks/useStore";
import { usePomodoro } from "./hooks/useTimer";
import { playChime } from "./lib/sound";
import { TimerView } from "./components/TimerView";
import { StatsPanel } from "./components/StatsPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { PlannerView } from "./components/PlannerView";
import { ManualView } from "./components/ManualView";
import { ToastStack, type ToastItem } from "./components/ui";
import { BookIcon, ListIcon, StopwatchIcon, TomatoIcon } from "./components/icons";

type Tab = "timer" | "planner" | "manual";

export default function App() {
  const [settings, setSettings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const [stats, setStats] = useStored<StatsData>("stats", { history: {} });
  const [planner, setPlanner] = useStored<PlannerData>("planner", { weeks: {} });
  const [tab, setTab] = useState<Tab>("timer");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastId = useRef(0);

  const notify = useCallback((text: string, color = "#a89c80") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, text, color }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const handleSessionEnd = useCallback(
    (finished: Mode, info: { away: boolean; next: Mode }) => {
      if (finished === "focus") {
        const minutes = settings.focus;
        setStats((s) => {
          const k = dateKey(new Date());
          const day = s.history[k] ?? { completed: 0, minutes: 0 };
          return {
            history: {
              ...s.history,
              [k]: { completed: day.completed + 1, minutes: day.minutes + minutes },
            },
          };
        });
      }
      if (settings.sound && !info.away) {
        playChime(finished === "focus" ? "focus" : "break");
      }
      const nextLabel = MODE_META[info.next].label.toLowerCase();
      notify(
        finished === "focus"
          ? info.away
            ? "Sessão de foco concluída com o app fechado — +1 no placar de hoje"
            : `Foco concluído. Hora da ${nextLabel} — você mereceu`
          : "Pausa encerrada. De volta ao foco",
        finished === "focus" ? MODE_META[info.next].color : MODE_META.focus.color
      );
    },
    [notify, setStats, settings.focus, settings.sound]
  );

  const pomo = usePomodoro({ settings, onSessionEnd: handleSessionEnd });
  const meta = MODE_META[pomo.mode];

  /* título da aba acompanha o relógio */
  useEffect(() => {
    document.title =
      pomo.running || pomo.remaining !== pomo.total
        ? `${fmtClock(pomo.remaining)} · ${meta.label} — PomoFoco`
        : "PomoFoco — Pomodoro & Planner semanal";
  }, [pomo.remaining, pomo.running, pomo.total, meta.label]);

  /* atalhos de teclado: Espaço alterna, R reinicia */
  const pomoRef = useRef(pomo);
  pomoRef.current = pomo;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable ||
          el.closest("button, a, [role='switch']"))
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        pomoRef.current.toggle();
      } else if (e.key === "r" || e.key === "R") {
        pomoRef.current.reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const wkTasks = planner.weeks[weekKey(new Date())] ?? [];
  const pending = wkTasks.filter((t) => !t.done).length;

  const tabs: { id: Tab; label: string; icon: typeof StopwatchIcon }[] = [
    { id: "timer", label: "Timer", icon: StopwatchIcon },
    { id: "planner", label: "Planner", icon: ListIcon },
    { id: "manual", label: "Manual", icon: BookIcon },
  ];

  return (
    <div
      className="grain relative min-h-dvh overflow-x-clip"
      style={{ "--acc": meta.color, "--acc-soft": meta.soft } as CSSProperties}
    >
      {/* ---- camadas ambiente que mudam com o modo ---- */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        {(Object.keys(MODE_META) as Mode[]).map((m) => (
          <div
            key={m}
            className="absolute inset-0 transition-opacity duration-[1400ms]"
            style={{
              opacity: m === pomo.mode ? 1 : 0,
              background: `radial-gradient(56rem 38rem at 16% -10%, ${MODE_META[m].color}24, transparent 60%), radial-gradient(48rem 34rem at 108% 12%, ${MODE_META[m].color}14, transparent 58%), radial-gradient(70rem 46rem at 50% 118%, ${MODE_META[m].color}0f, transparent 62%)`,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90rem 50rem at 50% -20%, rgba(246,240,225,0.035), transparent 55%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col px-4 sm:px-6">
        {/* ---- cabeçalho ---- */}
        <header className="flex items-center justify-between gap-4 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-2xl border border-ink-600 bg-ink-800 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:rotate-6"
              aria-hidden
            >
              <TomatoIcon width={26} height={26} />
            </span>
            <div>
              <p className="font-display text-[22px] leading-none font-extrabold tracking-tight text-sand-100">
                Pomo<span style={{ color: "var(--acc)" }}>Foco</span>
              </p>
              <p className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-sand-500 uppercase">
                técnica pomodoro
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm font-medium text-sand-400 md:block">{todayLong()}</p>
            <span className="flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800/80 px-3 py-1.5 text-[11px] font-bold tracking-wide text-sand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-400 shadow-[0_0_8px_#63d198]" />
              offline
            </span>
          </div>
        </header>

        {/* ---- abas ---- */}
        <nav className="sticky top-0 z-30 -mx-4 border-b border-ink-800 bg-ink-950/85 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex gap-1 py-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-bold transition-all duration-300 ${
                    active
                      ? "bg-ink-800 text-sand-100 shadow-[inset_0_0_0_1px_var(--color-ink-600)]"
                      : "text-sand-400 hover:bg-ink-900 hover:text-sand-200"
                  }`}
                >
                  <Icon width={16} height={16} style={active ? { color: "var(--acc)" } : undefined} />
                  {t.label}
                  {t.id === "planner" && pending > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-tomato-500/15 px-1 font-mono text-[10px] font-bold text-tomato-300 tabular-nums">
                      {pending}
                    </span>
                  )}
                  {active && (
                    <span
                      className="absolute inset-x-4 -bottom-[9px] h-0.5 rounded-full"
                      style={{ background: "var(--acc)", boxShadow: `0 0 8px ${meta.soft}` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ---- conteúdo ---- */}
        <main className="flex-1 py-8">
          {tab === "timer" ? (
            <div key="timer" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
              <div className="rounded-xl border border-ink-800/70 bg-ink-900/40 px-4 py-8 sm:px-8 sm:py-10">
                <TimerView pomo={pomo} settings={settings} />
              </div>
              <div className="flex flex-col gap-5">
                <StatsPanel stats={stats} settings={settings} />
                <SettingsPanel
                  settings={settings}
                  onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
                />
              </div>
            </div>
          ) : tab === "planner" ? (
            <div key="planner" className="anim-rise">
              <PlannerView planner={planner} setPlanner={setPlanner} notify={notify} />
            </div>
          ) : (
            <ManualView key="manual" />
          )}
        </main>

        {/* ---- rodapé ---- */}
        <footer className="border-t border-ink-800/80 py-5">
          <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-sand-500 sm:flex-row">
            <p>
              <kbd className="rounded border border-ink-600 bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] text-sand-300">Espaço</kbd>{" "}
              inicia / pausa ·{" "}
              <kbd className="rounded border border-ink-600 bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] text-sand-300">R</kbd>{" "}
              reinicia
            </p>
            <p>
              Dados salvos neste dispositivo — funciona offline, no pendrive ou instalado no celular.
            </p>
          </div>
        </footer>
      </div>

      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
