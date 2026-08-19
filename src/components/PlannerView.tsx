import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import {
  MIN_PRIORITIES,
  pruneWeeks,
  uid,
  weekKey,
  weekLabel,
  type PlannerData,
  type Task,
} from "../lib/core";
import { Card, CardTitle } from "./ui";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CheckIcon,
  PencilIcon,
  PlusIcon,
  SparkIcon,
  TrashIcon,
} from "./icons";

const SUGGESTIONS = [
  "Definir a meta número 1 da semana",
  "Reservar 2 blocos de foco profundo",
  "Avançar o projeto principal em uma etapa",
  "Zerar a caixa de entrada",
  "30 minutos de movimento por dia",
  "Revisar a agenda de sexta-feira",
  "Preparar a próxima segunda-feira",
  "Uma pausa longa longe das telas",
];

export function PlannerView({
  planner,
  setPlanner,
  notify,
}: {
  planner: PlannerData;
  setPlanner: Dispatch<SetStateAction<PlannerData>>;
  notify: (text: string, color?: string) => void;
}) {
  const wk = weekKey(new Date());
  const tasks = planner.weeks[wk] ?? [];
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const update = (fn: (t: Task[]) => Task[]) =>
    setPlanner((p) => ({ ...p, weeks: pruneWeeks({ ...p.weeks, [wk]: fn(p.weeks[wk] ?? []) }) }));

  const add = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    const count = tasks.length + 1;
    update((list) => [...list, { id: uid(), text: t, done: false }]);
    setText("");
    if (count === MIN_PRIORITIES)
      notify(`${MIN_PRIORITIES} prioridades definidas — semana no rumo certo`, "#3fb87b");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    add(text);
  };

  const toggle = (id: string) =>
    update((list) => {
      const next = list.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      const doneCount = next.filter((t) => t.done).length;
      if (doneCount === next.length && next.length >= MIN_PRIORITIES)
        notify("Todas as prioridades concluídas — semana vencida!", "#3fb87b");
      return next;
    });

  const remove = (id: string) => update((list) => list.filter((t) => t.id !== id));

  const move = (i: number, dir: -1 | 1) =>
    update((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setDraft(t.text);
  };

  const commitEdit = () => {
    if (editingId && draft.trim())
      update((list) =>
        list.map((t) => (t.id === editingId ? { ...t, text: draft.trim() } : t))
      );
    setEditingId(null);
  };

  const done = tasks.filter((t) => t.done).length;
  const missing = Math.max(0, MIN_PRIORITIES - tasks.length);
  const planned = tasks.length >= MIN_PRIORITIES;
  const suggestions = SUGGESTIONS.filter(
    (s) => !tasks.some((t) => t.text.toLowerCase() === s.toLowerCase())
  ).slice(0, Math.max(0, Math.min(4, MIN_PRIORITIES - tasks.length)));

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardTitle
          icon={<CalendarIcon width={16} height={16} />}
          aside={
            <span
              className={`rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums transition-colors ${
                planned
                  ? "border-mint-500/40 bg-mint-500/10 text-mint-300"
                  : "border-tomato-500/40 bg-tomato-500/10 text-tomato-300"
              }`}
            >
              {tasks.length}/{MIN_PRIORITIES}+
            </span>
          }
        >
          Semana {weekLabel(new Date())}
        </CardTitle>

        <p className="-mt-2 mb-5 max-w-xl text-sm leading-relaxed text-sand-400">
          Registre <strong className="text-sand-200">pelo menos {MIN_PRIORITIES} ações prioritárias</strong> para
          esta semana. A ordem define a prioridade — use as setas para reorganizar.
        </p>

        {/* entrada */}
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Ação prioritária nº ${tasks.length + 1}…`}
            aria-label="Nova ação prioritária"
            className="h-12 min-w-0 flex-1 rounded-xl border border-ink-600 bg-ink-900 px-4 text-[15px] text-sand-100 placeholder:text-sand-500 transition focus:border-[var(--acc)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex h-12 items-center gap-2 rounded-xl px-5 font-display text-sm font-bold text-ink-950 transition enabled:hover:scale-[1.03] enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
            style={{ background: "var(--acc)" }}
          >
            <PlusIcon width={16} height={16} /> Adicionar
          </button>
        </form>

        {/* medidor das 7 prioridades */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(100, (tasks.length / MIN_PRIORITIES) * 100)}%`,
                background: planned ? "var(--color-mint-500)" : "var(--acc)",
                boxShadow: `0 0 10px ${planned ? "rgba(63,184,123,.6)" : "transparent"}`,
              }}
            />
          </div>
          {planned ? (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-mint-300">
              <SparkIcon width={13} height={13} /> semana priorizada
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-sand-400">
              faltam <span className="font-mono text-tomato-300">{missing}</span>
            </span>
          )}
        </div>

        {/* sugestões quando ainda não chegou em 7 */}
        {suggestions.length > 0 && (
          <div className="anim-rise mt-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-full border border-ink-600 bg-ink-900/70 px-3 py-1.5 text-xs text-sand-300 transition hover:border-[var(--acc)] hover:text-sand-100 active:scale-95"
              >
                + {s}
              </button>
            ))}
          </div>
        )}

        {/* lista */}
        {tasks.length === 0 ? (
          <div className="anim-pop mt-8 rounded-xl border border-dashed border-ink-600 px-6 py-10 text-center">
            <CalendarIcon width={28} height={28} className="mx-auto text-sand-500" />
            <p className="mt-3 font-display text-lg font-bold text-sand-200">Nenhuma prioridade ainda</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-sand-500">
              Uma semana sem plano é um plano para improvisar. Adicione suas {MIN_PRIORITIES} ações acima — ou use as sugestões.
            </p>
          </div>
        ) : (
          <ol className="mt-5 space-y-2">
            {tasks.map((t, i) => (
              <li
                key={t.id}
                className="group anim-rise flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/70 px-3 py-2.5 transition hover:border-ink-500 hover:bg-ink-900"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <span className="w-6 shrink-0 text-right font-mono text-xs text-sand-500 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  role="checkbox"
                  aria-checked={t.done}
                  aria-label={`Concluir: ${t.text}`}
                  onClick={() => toggle(t.id)}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all duration-300 active:scale-90"
                  style={{
                    borderColor: t.done ? "var(--color-mint-500)" : "var(--color-ink-500)",
                    background: t.done ? "var(--color-mint-500)" : "transparent",
                  }}
                >
                  <CheckIcon
                    width={14}
                    height={14}
                    className={`text-ink-950 transition-all duration-300 ${t.done ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                  />
                </button>

                {editingId === t.id ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    aria-label="Editar ação"
                    className="h-8 min-w-0 flex-1 rounded-md border border-[var(--acc)] bg-ink-800 px-2 text-sm text-sand-100 outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    className={`min-w-0 flex-1 truncate text-left text-[15px] transition ${
                      t.done ? "text-sand-500 line-through decoration-sand-500/50" : "text-sand-100"
                    }`}
                  >
                    {t.text}
                  </button>
                )}

                <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <button
                    type="button"
                    aria-label="Subir prioridade"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="grid h-7 w-7 place-items-center rounded-md text-sand-500 transition hover:bg-ink-700 hover:text-sand-100 disabled:opacity-25"
                  >
                    <ArrowUpIcon width={13} height={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Descer prioridade"
                    disabled={i === tasks.length - 1}
                    onClick={() => move(i, 1)}
                    className="grid h-7 w-7 place-items-center rounded-md text-sand-500 transition hover:bg-ink-700 hover:text-sand-100 disabled:opacity-25"
                  >
                    <ArrowDownIcon width={13} height={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Editar ação"
                    onClick={() => startEdit(t)}
                    className="grid h-7 w-7 place-items-center rounded-md text-sand-500 transition hover:bg-ink-700 hover:text-sand-100"
                  >
                    <PencilIcon width={13} height={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remover ação"
                    onClick={() => remove(t.id)}
                    className="grid h-7 w-7 place-items-center rounded-md text-sand-500 transition hover:bg-tomato-600/20 hover:text-tomato-300"
                  >
                    <TrashIcon width={13} height={13} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}

        {tasks.length > 0 && (
          <p className="mt-4 border-t border-ink-700/70 pt-3 text-xs text-sand-500">
            <span className="font-mono font-semibold text-sand-300 tabular-nums">{done}</span> de{" "}
            <span className="font-mono font-semibold text-sand-300 tabular-nums">{tasks.length}</span> ações
            concluídas · o planner é salvo por semana neste dispositivo
          </p>
        )}
      </Card>
    </div>
  );
}
