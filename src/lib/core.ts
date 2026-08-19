/* Tipos, constantes e utilitários compartilhados */

export type Mode = "focus" | "short" | "long";

export interface Settings {
  focus: number; // minutos de foco
  short: number; // pausa curta
  long: number; // pausa longa
  longEvery: number; // pausa longa a cada N pomodoros
  dailyGoal: number; // meta de pomodoros por dia
  sound: boolean;
  autoStart: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  dailyGoal: 8,
  sound: true,
  autoStart: false,
};

export const LIMITS = {
  focus: [5, 120],
  short: [1, 45],
  long: [5, 60],
  longEvery: [2, 8],
  dailyGoal: [1, 20],
} as const;

export interface DayStat {
  completed: number;
  minutes: number;
}
export interface StatsData {
  history: Record<string, DayStat>; // chave YYYY-MM-DD
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
}
export interface PlannerData {
  weeks: Record<string, Task[]>; // chave ISO: YYYY-Www
}

export const MIN_PRIORITIES = 7;

export const MODE_META: Record<
  Mode,
  { label: string; short: string; color: string; soft: string; ring: string }
> = {
  focus: {
    label: "Foco",
    short: "foco",
    color: "#f4552f",
    soft: "rgba(244, 85, 47, 0.16)",
    ring: "rgba(244, 85, 47, 0.55)",
  },
  short: {
    label: "Pausa curta",
    short: "pausa curta",
    color: "#3fb87b",
    soft: "rgba(63, 184, 123, 0.15)",
    ring: "rgba(63, 184, 123, 0.55)",
  },
  long: {
    label: "Pausa longa",
    short: "pausa longa",
    color: "#6489f0",
    soft: "rgba(100, 137, 240, 0.16)",
    ring: "rgba(100, 137, 240, 0.55)",
  },
};

/* ---------- armazenamento ---------- */

const NS = "pomofoco:v1:";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw == null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      fallback &&
      typeof fallback === "object" &&
      !Array.isArray(fallback)
    ) {
      return { ...(fallback as object), ...(parsed as object) } as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* armazenamento cheio ou indisponível — o app segue funcionando */
  }
}

/* ---------- datas ---------- */

const pad = (n: number) => String(n).padStart(2, "0");

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function weekKey(d: Date): string {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  const week1 = new Date(t.getFullYear(), 0, 4);
  const wk =
    1 +
    Math.round(
      ((t.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${t.getFullYear()}-W${pad(wk)}`;
}

export function mondayOf(d: Date): Date {
  const m = new Date(d);
  m.setHours(0, 0, 0, 0);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
}

const PT_MONTHS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export function weekLabel(d: Date): string {
  const mon = mondayOf(d);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return `${mon.getDate()} ${PT_MONTHS[mon.getMonth()]} – ${sun.getDate()} ${PT_MONTHS[sun.getMonth()]}`;
}

export const WEEKDAYS_MIN = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function lastNDays(n: number): Date[] {
  const out: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d);
  }
  return out;
}

export function todayLong(): string {
  const s = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ---------- diversos ---------- */

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export const fmtClock = (sec: number) =>
  `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;

export const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function pruneWeeks(weeks: PlannerData["weeks"]): PlannerData["weeks"] {
  const keys = Object.keys(weeks).sort();
  if (keys.length <= 10) return weeks;
  const keep = new Set(keys.slice(-10));
  const out: PlannerData["weeks"] = {};
  for (const k of keys) if (keep.has(k)) out[k] = weeks[k];
  return out;
}

export function streakOf(history: StatsData["history"]): number {
  let s = 0;
  const d = new Date();
  if (!(history[dateKey(d)]?.completed ?? 0)) d.setDate(d.getDate() - 1);
  while ((history[dateKey(d)]?.completed ?? 0) > 0) {
    s++;
    d.setDate(d.getDate() - 1);
  }
  return s;
}
