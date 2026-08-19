import { useState } from "react";
import { LIMITS, type Settings } from "../lib/core";
import { Card, CardTitle, Stepper, Toggle } from "./ui";
import { ChevronDownIcon, GearIcon } from "./icons";

export function SettingsPanel({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card delay={0.18} className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="-m-5 flex w-[calc(100%+2.5rem)] items-center justify-between p-5 text-left transition hover:bg-ink-700/30"
      >
        <span className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.14em] text-sand-300 uppercase">
          <GearIcon width={16} height={16} style={{ color: "var(--acc)" }} />
          Durações & ajustes
        </span>
        <ChevronDownIcon
          width={18}
          height={18}
          className={`text-sand-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-400 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-4 divide-y divide-ink-700/70 border-t border-ink-700/70">
            <Stepper
              label="Foco"
              value={settings.focus}
              min={LIMITS.focus[0]}
              max={LIMITS.focus[1]}
              unit="min"
              onChange={(v) => onChange({ focus: v })}
            />
            <Stepper
              label="Pausa curta"
              value={settings.short}
              min={LIMITS.short[0]}
              max={LIMITS.short[1]}
              unit="min"
              onChange={(v) => onChange({ short: v })}
            />
            <Stepper
              label="Pausa longa"
              value={settings.long}
              min={LIMITS.long[0]}
              max={LIMITS.long[1]}
              unit="min"
              onChange={(v) => onChange({ long: v })}
            />
            <Stepper
              label="Pausa longa a cada"
              hint="pomodoros concluídos no ciclo"
              value={settings.longEvery}
              min={LIMITS.longEvery[0]}
              max={LIMITS.longEvery[1]}
              unit="×"
              onChange={(v) => onChange({ longEvery: v })}
            />
            <Stepper
              label="Meta diária"
              hint="pomodoros por dia"
              value={settings.dailyGoal}
              min={LIMITS.dailyGoal[0]}
              max={LIMITS.dailyGoal[1]}
              unit="◆"
              onChange={(v) => onChange({ dailyGoal: v })}
            />
            <Toggle
              label="Som ao concluir"
              hint="sino discreto via WebAudio"
              checked={settings.sound}
              onChange={(v) => onChange({ sound: v })}
            />
            <Toggle
              label="Iniciar próxima sessão"
              hint="encadeia foco e pausas automaticamente"
              checked={settings.autoStart}
              onChange={(v) => onChange({ autoStart: v })}
            />
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-sand-500">
            Novas durações valem a partir da próxima sessão — o timer em curso não é interrompido.
          </p>
        </div>
      </div>
    </Card>
  );
}
