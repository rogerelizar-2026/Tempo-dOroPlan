import { useEffect, useState } from "react";
import {
  dateKey,
  lastNDays,
  streakOf,
  WEEKDAYS_MIN,
  type Settings,
  type StatsData,
} from "../lib/core";
import { Card, CardTitle } from "./ui";
import { FlameIcon, SparkIcon, StopwatchIcon } from "./icons";

export function StatsPanel({
  stats,
  settings,
}: {
  stats: StatsData;
  settings: Settings;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const today = stats.history[dateKey(new Date())] ?? { completed: 0, minutes: 0 };
  const pct = Math.min(100, Math.round((today.completed / settings.dailyGoal) * 100));
  const streak = streakOf(stats.history);

  const days = lastNDays(7).map((d) => ({
    d,
    stat: stats.history[dateKey(d)] ?? { completed: 0, minutes: 0 },
  }));
  const maxMin = Math.max(1, ...days.map((x) => x.stat.minutes));

  const totalPomos = Object.values(stats.history).reduce((a, b) => a + b.completed, 0);
  const bestDay = Object.values(stats.history).reduce((a, b) => Math.max(a, b.minutes), 0);

  const goalHit = today.completed >= settings.dailyGoal;

  return (
    <Card delay={0.1}>
      <CardTitle
        icon={<StopwatchIcon width={16} height={16} />}
        aside={
          goalHit ? (
            <span className="flex items-center gap-1.5 rounded-full border border-mint-500/40 bg-mint-500/10 px-2.5 py-1 text-[11px] font-bold text-mint-300">
              <SparkIcon width={12} height={12} /> meta batida
            </span>
          ) : undefined
        }
      >
        Foco de hoje
      </CardTitle>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-[56px] leading-none font-extrabold tabular-nums" style={{ color: "var(--acc)" }}>
            {today.completed}
            <span className="ml-1 text-lg font-semibold text-sand-400">/ {settings.dailyGoal}</span>
          </p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-sand-400 uppercase">
            pomodoros concluídos
          </p>
        </div>
        <div className="pb-1 text-right">
          <p className="font-mono text-2xl font-medium text-sand-100 tabular-nums">
            {today.minutes}
            <span className="ml-1 text-xs text-sand-400">min</span>
          </p>
          <p className="text-[11px] text-sand-500">de foco profundo</p>
        </div>
      </div>

      {/* barra da meta diária */}
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-ink-700"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da meta diária"
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: mounted ? `${pct}%` : "0%",
            background: `linear-gradient(90deg, color-mix(in srgb, var(--acc) 70%, #0000) 0%, var(--acc) 100%)`,
            boxShadow: `0 0 12px color-mix(in srgb, var(--acc) 60%, transparent)`,
          }}
        />
      </div>

      {/* gráfico da semana */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold tracking-[0.16em] text-sand-400 uppercase">Últimos 7 dias</p>
          <p className="flex items-center gap-1 text-[11px] text-sand-500">
            <FlameIcon width={13} height={13} className={streak > 0 ? "text-tomato-400" : ""} />
            <span className="font-mono font-semibold text-sand-300 tabular-nums">{streak}</span> dia{streak === 1 ? "" : "s"} seguidos
          </p>
        </div>
        <div className="mt-3 grid grid-cols-7 items-end gap-1.5" style={{ height: 84 }}>
          {days.map(({ d, stat }, i) => {
            const isToday = i === 6;
            const h = stat.minutes > 0 ? Math.max(10, (stat.minutes / maxMin) * 100) : 5;
            return (
              <div key={i} className="group flex h-full flex-col items-center justify-end gap-1.5">
                <div className="flex w-full flex-1 items-end">
                  <div
                    title={`${WEEKDAYS_MIN[d.getDay()]} · ${stat.minutes} min · ${stat.completed} pomodoro${stat.completed === 1 ? "" : "s"}`}
                    className="w-full rounded-[4px] transition-all duration-700 ease-out group-hover:opacity-100"
                    style={{
                      height: mounted ? `${h}%` : "4%",
                      transitionDelay: `${i * 50}ms`,
                      opacity: stat.minutes === 0 ? 0.5 : isToday ? 1 : 0.72,
                      background:
                        stat.minutes === 0
                          ? "var(--color-ink-600)"
                          : isToday
                            ? "var(--acc)"
                            : "color-mix(in srgb, var(--acc) 45%, var(--color-ink-600))",
                      boxShadow: isToday && stat.minutes > 0 ? `0 0 14px color-mix(in srgb, var(--acc) 55%, transparent)` : "none",
                    }}
                  />
                </div>
                <span className={`text-[10px] font-semibold ${isToday ? "text-sand-100" : "text-sand-500"}`}>
                  {WEEKDAYS_MIN[d.getDay()].slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* totais */}
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-ink-700/70 pt-4">
        <div className="rounded-lg bg-ink-900/70 px-3 py-2.5">
          <p className="font-mono text-lg font-medium text-sand-100 tabular-nums">{totalPomos}</p>
          <p className="text-[11px] text-sand-500">pomodoros no total</p>
        </div>
        <div className="rounded-lg bg-ink-900/70 px-3 py-2.5">
          <p className="font-mono text-lg font-medium text-sand-100 tabular-nums">
            {bestMinFmt(bestDay)}
          </p>
          <p className="text-[11px] text-sand-500">recorde em um dia</p>
        </div>
      </div>
    </Card>
  );
}

const bestMinFmt = (min: number) =>
  min >= 60 ? `${Math.floor(min / 60)}h${String(min % 60).padStart(2, "0")}` : `${min} min`;
