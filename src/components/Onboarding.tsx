import { useEffect, type ReactNode } from "react";
import { MODE_META } from "../lib/core";
import {
  BookIcon,
  CalendarIcon,
  GearIcon,
  OfflineIcon,
  PlayIcon,
  TomatoIcon,
} from "./icons";

function Step({
  n,
  color,
  icon,
  title,
  desc,
  delay,
}: {
  n: number;
  color: string;
  icon: ReactNode;
  title: string;
  desc: ReactNode;
  delay: string;
}) {
  return (
    <li className={`anim-rise flex items-start gap-4 ${delay}`}>
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border font-display text-sm font-extrabold"
        style={{
          color,
          borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
        }}
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-display text-[15px] font-bold text-sand-100">
          {icon}
          {title}
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-sand-400">{desc}</p>
      </div>
    </li>
  );
}

export function Onboarding({
  onDismiss,
  onManual,
}: {
  onDismiss: () => void;
  onManual: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink-950/85 p-4 backdrop-blur-sm"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Boas-vindas ao PomoFoco"
    >
      <div
        className="anim-pop relative w-full max-w-md overflow-hidden rounded-xl border border-ink-600 bg-ink-800 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* faixa com as cores dos três modos */}
        <div
          className="h-1.5"
          style={{
            background: `linear-gradient(90deg, ${MODE_META.focus.color}, ${MODE_META.short.color} 55%, ${MODE_META.long.color})`,
          }}
        />

        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-2xl border border-ink-600 bg-ink-900 transition-transform duration-500 hover:rotate-12"
              aria-hidden
            >
              <TomatoIcon width={26} height={26} />
            </span>
            <div>
              <p className="font-display text-xl leading-tight font-extrabold text-sand-100">
                Bem-vindo ao Pomo<span style={{ color: MODE_META.focus.color }}>Foco</span>
              </p>
              <p className="text-xs font-semibold tracking-[0.18em] text-sand-500 uppercase">
                pronto em 3 passos
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-5">
            <Step
              n={1}
              color={MODE_META.focus.color}
              delay="delay-1"
              icon={<GearIcon width={15} height={15} className="text-sand-400" />}
              title="Deixe do seu ritmo"
              desc={
                <>
                  Foco de <strong className="text-sand-200">25 min</strong> e pausas de{" "}
                  <strong className="text-sand-200">5</strong> e{" "}
                  <strong className="text-sand-200">15 min</strong> já vêm prontos. Quer mudar? É
                  só abrir <em>“Durações & ajustes”</em>, ao lado do timer.
                </>
              }
            />
            <Step
              n={2}
              color={MODE_META.short.color}
              delay="delay-2"
              icon={<CalendarIcon width={15} height={15} className="text-sand-400" />}
              title="Liste suas prioridades"
              desc={
                <>
                  Na aba <strong className="text-sand-200">Planner</strong>, escreva pelo menos{" "}
                  <strong className="text-sand-200">7 ações</strong> para a semana — tem até
                  sugestões prontas de um clique.
                </>
              }
            />
            <Step
              n={3}
              color={MODE_META.long.color}
              delay="delay-3"
              icon={<PlayIcon width={15} height={15} className="text-sand-400" />}
              title="Dê o play e esqueça o resto"
              desc={
                <>
                  A tecla <strong className="text-sand-200">Espaço</strong> inicia e pausa; um sino
                  avisa quando a sessão termina e a próxima já fica preparada.
                </>
              }
            />
          </ul>

          <p className="mt-6 flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/70 px-3.5 py-2.5 text-xs text-sand-400">
            <OfflineIcon width={15} height={15} className="shrink-0 text-mint-400" />
            Funciona sem internet. Seus dados ficam guardados apenas neste aparelho.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onDismiss}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-display text-sm font-bold text-ink-950 transition hover:scale-[1.02] active:scale-95"
              style={{ background: MODE_META.focus.color }}
            >
              <PlayIcon width={16} height={16} />
              Começar agora
            </button>
            <button
              type="button"
              onClick={onManual}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-900 font-display text-sm font-bold text-sand-200 transition hover:border-ink-500 hover:text-sand-100 active:scale-95"
            >
              <BookIcon width={16} height={16} />
              Ler o manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
