import { useEffect, useRef, useState } from "react";
import { load, save, type Mode, type Settings } from "../lib/core";

const KEY = "timer";

interface Snapshot {
  mode: Mode;
  remaining: number;
  running: boolean;
  cycle: number;
  endAt: number | null;
}

export interface Pomodoro {
  mode: Mode;
  running: boolean;
  remaining: number;
  total: number;
  progress: number; // 0 → início, 1 → fim
  cycle: number; // pomodoros concluídos no ciclo atual
  toggle: () => void;
  reset: () => void;
  skip: () => void;
  switchMode: (m: Mode) => void;
}

interface Options {
  settings: Settings;
  onSessionEnd: (finished: Mode, info: { away: boolean; next: Mode }) => void;
}

export function usePomodoro({ settings, onSessionEnd }: Options): Pomodoro {
  const durOf = (m: Mode, s: Settings = settings) =>
    (m === "focus" ? s.focus : m === "short" ? s.short : s.long) * 60;

  const initRef = useRef<Snapshot | null | undefined>(undefined);
  if (initRef.current === undefined) {
    initRef.current = load<Snapshot | null>(KEY, null);
    const p = initRef.current;
    if (p && (!p.mode || !["focus", "short", "long"].includes(p.mode))) {
      initRef.current = null;
    }
  }

  const [mode, setMode] = useState<Mode>(() => initRef.current?.mode ?? "focus");
  const [cycle, setCycle] = useState<number>(() => initRef.current?.cycle ?? 0);
  const [remaining, setRemaining] = useState<number>(() => {
    const p = initRef.current;
    if (p?.running && p.endAt) {
      const diff = Math.ceil((p.endAt - Date.now()) / 1000);
      if (diff > 0) return diff;
    }
    if (p && !p.running && p.remaining > 0) return p.remaining;
    return durOf(p?.mode ?? "focus");
  });
  const [running, setRunning] = useState(false);

  const endAtRef = useRef<number | null>(null);
  const modeRef = useRef(mode);
  const cycleRef = useRef(cycle);
  const remainingRef = useRef(remaining);
  const runningRef = useRef(running);
  const settingsRef = useRef(settings);
  const endCbRef = useRef(onSessionEnd);
  const lastDurRef = useRef(durOf(mode));
  modeRef.current = mode;
  cycleRef.current = cycle;
  remainingRef.current = remaining;
  runningRef.current = running;
  settingsRef.current = settings;
  endCbRef.current = onSessionEnd;

  const nextOf = (m: Mode, previewCycle: number): Mode =>
    m === "focus"
      ? previewCycle % settingsRef.current.longEvery === 0
        ? "long"
        : "short"
      : "focus";

  const settle = (finished: Mode, away = false) => {
    const wasFocus = finished === "focus";
    const newCycle = wasFocus ? cycleRef.current + 1 : cycleRef.current;
    const next = nextOf(finished, wasFocus ? newCycle : cycleRef.current);
    const d = durOf(next, settingsRef.current);
    lastDurRef.current = d;
    endAtRef.current = null;
    if (wasFocus) setCycle(newCycle);
    setMode(next);
    setRunning(false);
    setRemaining(d);
    endCbRef.current(finished, { away, next });
    if (settingsRef.current.autoStart) {
      endAtRef.current = Date.now() + d * 1000;
      setRunning(true);
    }
  };

  /* retomar sessão em andamento (ou concluir a que terminou fora da aba) */
  const bootedRef = useRef(false);
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const p = initRef.current;
    if (p?.running && p.endAt) {
      const diff = p.endAt - Date.now();
      if (diff > 0) {
        endAtRef.current = p.endAt;
        setRunning(true);
      } else {
        settle(p.mode, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* relógio propriamente dito — sem deriva, baseado em timestamp */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (endAtRef.current == null) return;
      const rem = Math.max(
        0,
        Math.round((endAtRef.current - Date.now()) / 1000)
      );
      setRemaining(rem);
      if (rem <= 0) settle(modeRef.current);
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  /* se as durações mudarem e o timer estiver parado, sincroniza o mostrador */
  useEffect(() => {
    const d = durOf(modeRef.current);
    if (d !== lastDurRef.current) {
      lastDurRef.current = d;
      if (!runningRef.current) setRemaining(d);
    }
  }, [settings.focus, settings.short, settings.long]);

  /* persistência contínua — abre o app no pendrive e continua de onde parou */
  useEffect(() => {
    save(KEY, {
      mode,
      remaining,
      running,
      cycle,
      endAt: running ? endAtRef.current : null,
    } satisfies Snapshot);
  }, [mode, remaining, running, cycle]);

  const start = () => {
    if (remainingRef.current <= 0 || runningRef.current) return;
    endAtRef.current = Date.now() + remainingRef.current * 1000;
    setRunning(true);
  };

  const pause = () => {
    if (endAtRef.current != null) {
      setRemaining(
        Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
      );
    }
    endAtRef.current = null;
    setRunning(false);
  };

  const toggle = () => (runningRef.current ? pause() : start());

  const reset = () => {
    endAtRef.current = null;
    setRunning(false);
    const d = durOf(modeRef.current);
    lastDurRef.current = d;
    setRemaining(d);
  };

  const switchMode = (m: Mode) => {
    if (m === modeRef.current && !runningRef.current) {
      reset();
      return;
    }
    endAtRef.current = null;
    setRunning(false);
    setMode(m);
    const d = durOf(m);
    lastDurRef.current = d;
    setRemaining(d);
  };

  const skip = () => {
    const m = modeRef.current;
    const preview = m === "focus" ? cycleRef.current + 1 : cycleRef.current;
    const next = nextOf(m, preview);
    endAtRef.current = null;
    setRunning(false);
    setMode(next);
    const d = durOf(next);
    lastDurRef.current = d;
    setRemaining(d);
  };

  const total = durOf(mode);
  return {
    mode,
    running,
    remaining,
    total,
    progress: total > 0 ? 1 - remaining / total : 0,
    cycle,
    toggle,
    reset,
    skip,
    switchMode,
  };
}
