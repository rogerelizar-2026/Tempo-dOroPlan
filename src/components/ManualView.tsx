import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DEFAULT_SETTINGS as DEFAULTS,
  LIMITS,
  MODE_META,
  type Mode,
} from "../lib/core";
import {
  BookIcon,
  CalendarIcon,
  CheckIcon,
  CoffeeIcon,
  FlameIcon,
  GearIcon,
  ListIcon,
  OfflineIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  SkipIcon,
  SparkIcon,
  StopwatchIcon,
  TargetIcon,
  TomatoIcon,
} from "./icons";

/* ---------------- infraestrutura do manual ---------------- */

const TOC = [
  { id: "inicio", label: "Visão geral" },
  { id: "modos", label: "Os três modos" },
  { id: "comandos", label: "Comandos do timer" },
  { id: "atalhos", label: "Atalhos de teclado" },
  { id: "ciclo", label: "Ciclo e pausa longa" },
  { id: "ajustes", label: "Durações e ajustes" },
  { id: "stats", label: "Estatísticas" },
  { id: "planner", label: "Planner semanal" },
  { id: "som", label: "Som e alertas" },
  { id: "offline", label: "Offline e portabilidade" },
  { id: "tecnica", label: "A técnica Pomodoro" },
  { id: "faq", label: "Perguntas frequentes" },
];

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "opacity .65s ease, transform .65s cubic-bezier(.2,.7,.2,1)",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(22px)",
      }}
    >
      {children}
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section
        id={id}
        className="scroll-mt-32 rounded-xl border border-ink-700 bg-ink-800/80 p-5 sm:scroll-mt-28 sm:p-7"
      >
        <h2 className="mb-4 flex items-center gap-3 font-display text-lg font-bold text-sand-100 sm:text-xl">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-900"
            style={{ color: "var(--acc)" }}
          >
            {icon}
          </span>
          {title}
        </h2>
        <div className="space-y-3 text-[15px] leading-relaxed text-sand-300">{children}</div>
      </section>
    </Reveal>
  );
}

function Callout({
  title,
  children,
  tone = "tip",
}: {
  title: string;
  children: ReactNode;
  tone?: "tip" | "warn";
}) {
  const color = tone === "tip" ? "var(--color-mint-500)" : "var(--color-tomato-500)";
  return (
    <div
      className="rounded-lg border p-4"
      style={{ borderColor: `color-mix(in srgb, ${color} 35%, transparent)`, background: `color-mix(in srgb, ${color} 8%, transparent)` }}
    >
      <p className="mb-1 flex items-center gap-2 text-sm font-bold" style={{ color: tone === "tip" ? "var(--color-mint-300)" : "var(--color-tomato-300)" }}>
        {tone === "tip" ? <SparkIcon width={14} height={14} /> : <FlameIcon width={14} height={14} />}
        {title}
      </p>
      <div className="text-sm leading-relaxed text-sand-300">{children}</div>
    </div>
  );
}

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="rounded-md border border-ink-500 bg-ink-900 px-2 py-0.5 font-mono text-xs font-semibold text-sand-200 shadow-[0_2px_0_var(--color-ink-500)]">
    {children}
  </kbd>
);

function CommandRow({
  icon,
  name,
  desc,
}: {
  icon: ReactNode;
  name: string;
  desc: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900/60 p-3.5 transition hover:border-ink-500">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-600 bg-ink-800" style={{ color: "var(--acc)" }}>
        {icon}
      </span>
      <div>
        <p className="font-semibold text-sand-100">{name}</p>
        <p className="text-sm text-sand-400">{desc}</p>
      </div>
    </div>
  );
}

function ModeChip({ mode }: { mode: Mode }) {
  const meta = MODE_META[mode];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900 px-3 py-1 text-sm font-semibold text-sand-200">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
      {meta.label}
    </span>
  );
}

function Faq({ q, children }: { q: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900/60 transition hover:border-ink-500">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="font-semibold text-sand-100">{q}</span>
        <span
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink-600 text-sand-400 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 text-sm leading-relaxed text-sand-400">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- o manual em si ---------------- */

export function ManualView() {
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const els = TOC.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="anim-rise">
      {/* navegação rápida no celular */}
      <div className="sticky top-[3.3rem] z-20 -mx-1 mb-5 overflow-x-auto border-b border-ink-800 bg-ink-950/85 px-1 py-2 backdrop-blur-sm lg:hidden">
        <div className="flex w-max gap-1.5">
          {TOC.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active === t.id
                  ? "border-transparent text-ink-950"
                  : "border-ink-600 text-sand-400 hover:text-sand-100"
              }`}
              style={active === t.id ? { background: "var(--acc)" } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-10">
        {/* sumário fixo no desktop */}
        <nav className="hidden lg:block" aria-label="Sumário do manual">
          <div className="sticky top-24">
            <p className="mb-3 font-display text-[11px] font-bold tracking-[0.18em] text-sand-500 uppercase">
              Sumário
            </p>
            <ul className="space-y-0.5 border-l border-ink-700">
              {TOC.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => go(t.id)}
                    className={`-ml-px block w-full border-l-2 py-1.5 pl-4 text-left text-[13px] transition-all ${
                      active === t.id
                        ? "font-bold text-sand-100"
                        : "border-transparent text-sand-500 hover:text-sand-200"
                    }`}
                    style={active === t.id ? { borderColor: "var(--acc)" } : undefined}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] leading-relaxed text-sand-500">
              Manual da versão instalada neste dispositivo — funciona sem internet.
            </p>
          </div>
        </nav>

        {/* conteúdo */}
        <div className="min-w-0 space-y-5">
          <Reveal>
            <header className="pt-1 pb-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-3xl font-bold text-sand-100 sm:text-4xl">
                  Manual do PomoFoco
                </h1>
                <span className="rounded-full border border-ink-600 bg-ink-900 px-2.5 py-1 font-mono text-[11px] font-semibold text-sand-400">
                  v1.0 · offline
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-sand-400">
                Guia completo de cada recurso: timer, modos, estatísticas, planner e como levar
                o app no pendrive ou no celular. Tudo o que você faz fica salvo{" "}
                <strong className="text-sand-200">neste navegador</strong> — sem conta, sem nuvem.
              </p>
            </header>
          </Reveal>

          <Section id="inicio" title="Visão geral" icon={<BookIcon width={17} height={17} />}>
            <p>
              O PomoFoco reúne duas áreas de trabalho — o <strong className="text-sand-100">Timer</strong> e o{" "}
              <strong className="text-sand-100">Planner</strong> — mais este manual. A lógica é simples:
              você alterna sessões de foco total com pausas programadas e, ao fim de um ciclo de
              sessões, ganha uma pausa longa.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-sand-200">Timer</strong> — cronômetro Pomodoro com anel de progresso,
                modos, controles, estatísticas de hoje e painel de ajustes.
              </li>
              <li>
                <strong className="text-sand-200">Planner</strong> — suas ações prioritárias da semana
                (mínimo de 7), na ordem de importância.
              </li>
              <li>
                <strong className="text-sand-200">Manual</strong> — esta página, com a orientação de cada recurso.
              </li>
            </ul>
            <Callout title="Primeiros passos">
              <p className="mb-1.5">
                Na primeira vez que você abre o app, uma tela de boas-vindas resume estes mesmos
                passos — depois ela nunca mais aparece.
              </p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Abra “Durações & ajustes” no Timer e defina seus tempos e a meta diária.</li>
                <li>No Planner, registre pelo menos 7 prioridades para a semana.</li>
                <li>Volte ao Timer, escolha o modo Foco e pressione Iniciar.</li>
                <li>Ao ouvir o sino, respeite a pausa — o app já prepara a próxima sessão.</li>
              </ol>
            </Callout>
          </Section>

          <Section id="modos" title="Os três modos" icon={<StopwatchIcon width={17} height={17} />}>
            <p>
              Cada modo tem uma cor que toma conta da interface inteira — um lembrete visual do
              estado em que você está.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-tomato-500/30 bg-tomato-500/[0.07] p-4">
                <ModeChip mode="focus" />
                <p className="mt-3 text-sm text-sand-300">
                  Trabalho de concentração total. Padrão:{" "}
                  <strong className="text-sand-100">{DEFAULTS.focus} min</strong>. Somente sessões de foco
                  concluídas contam nas estatísticas.
                </p>
              </div>
              <div className="rounded-lg border border-mint-500/30 bg-mint-500/[0.07] p-4">
                <ModeChip mode="short" />
                <p className="mt-3 text-sm text-sand-300">
                  Respirar entre um pomodoro e outro. Padrão:{" "}
                  <strong className="text-sand-100">{DEFAULTS.short} min</strong>. Levante, hidrate-se,
                  olhe para longe da tela.
                </p>
              </div>
              <div className="rounded-lg border border-cobalt-500/30 bg-cobalt-500/[0.07] p-4">
                <ModeChip mode="long" />
                <p className="mt-3 text-sm text-sand-300">
                  Recuperação profunda ao fim do ciclo. Padrão:{" "}
                  <strong className="text-sand-100">{DEFAULTS.long} min</strong>, após 4 pomodoros.
                </p>
              </div>
            </div>
            <p className="text-sm text-sand-400">
              Você pode trocar de modo a qualquer momento pelos botões acima do anel. A troca
              prepara a nova sessão com a duração cheia — <em>nada é contabilizado</em> quando a
              mudança é manual; só o ciclo automático conta.
            </p>
          </Section>

          <Section id="comandos" title="Comandos do timer" icon={<PlayIcon width={17} height={17} />}>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <CommandRow
                icon={<PlayIcon width={15} height={15} />}
                name="Iniciar / Continuar"
                desc={
                  <>
                    Dispara a contagem. O título da aba vira{" "}
                    <span className="font-mono text-sand-300">MM:SS · Modo</span> — dá para acompanhar o
                    tempo até trabalhando em outra aba.
                  </>
                }
              />
              <CommandRow
                icon={<PauseIcon width={15} height={15} />}
                name="Pausar"
                desc="Congela a contagem exatamente onde está. Pressione Continuar para retomar do mesmo ponto."
              />
              <CommandRow
                icon={<ResetIcon width={15} height={15} />}
                name="Reiniciar"
                desc="Devolve a sessão atual à duração cheia. Útil se o foco foi interrompido — pela técnica, pomodoro interrompido recomeça."
              />
              <CommandRow
                icon={<SkipIcon width={15} height={15} />}
                name="Pular"
                desc="Avança direto para a próxima sessão do ciclo, sem contar a atual nas estatísticas."
              />
            </div>
            <p>
              Os <strong className="text-sand-200">pontos luminosos</strong> abaixo do anel mostram sua posição no
              ciclo: cada foco concluído acende um ponto; ao completar o ciclo, a próxima pausa é a longa.
            </p>
            <p>
              Quando o contador chega a <span className="font-mono text-sand-100">00:00</span>, o app toca o sino,
              mostra um aviso e prepara a próxima sessão automaticamente (iniciando-a, se você
              ativou essa opção nos ajustes).
            </p>
            <Callout tone="warn" title="Se a aba fechar no meio da sessão">
              O timer é ancorado no relógio do aparelho, não na aba. Ao reabrir o PomoFoco, a
              contagem <strong className="text-sand-200">retoma com o tempo correto</strong>. E se a sessão terminou
              enquanto você estava fora, o pomodoro é creditado nas estatísticas — você verá o
              aviso da conclusão.
            </Callout>
          </Section>

          <Section id="atalhos" title="Atalhos de teclado" icon={<SparkIcon width={17} height={17} />}>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <p className="flex items-center gap-3">
                <Kbd>Espaço</Kbd> <span className="text-sm">iniciar / pausar</span>
              </p>
              <p className="flex items-center gap-3">
                <Kbd>R</Kbd> <span className="text-sm">reiniciar a sessão atual</span>
              </p>
            </div>
            <p className="text-sm text-sand-400">
              Os atalhos são ignorados enquanto você digita em um campo (como no Planner), para
              nunca atrapalhar a escrita.
            </p>
          </Section>

          <Section id="ciclo" title="Ciclo e pausa longa" icon={<TargetIcon width={17} height={17} />}>
            <p>
              O ciclo clássico funciona assim: <ModeChip mode="focus" /> → <ModeChip mode="short" /> →{" "}
              <ModeChip mode="focus" /> → <ModeChip mode="short" /> … e, ao atingir o número definido em
              “Pausa longa a cada” (padrão: <strong className="text-sand-100">4</strong>), a pausa seguinte é a{" "}
              <ModeChip mode="long" />. Depois dela, o ciclo zera e recomeça.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Só sessões de foco <em>concluídas</em> fazem o ciclo avançar.</li>
              <li>
                Com <strong className="text-sand-200">“Iniciar próxima sessão”</strong> ligado, o app encadeia foco e
                pausas sozinho; desligado, a próxima sessão fica pronta esperando seu clique.
              </li>
              <li>Usar Pular ou trocar de modo manualmente não alimenta os pontos do ciclo.</li>
            </ul>
          </Section>

          <Section id="ajustes" title="Durações e ajustes" icon={<GearIcon width={17} height={17} />}>
            <p>
              O painel <strong className="text-sand-100">“Durações & ajustes”</strong>, no Timer, personaliza o ritmo
              inteiro do método. Use as setas ou digite o valor — ele é sempre limitado à faixa
              segura.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-600 text-[11px] tracking-wider text-sand-500 uppercase">
                    <th className="py-2 pr-3 font-bold">Ajuste</th>
                    <th className="py-2 pr-3 font-bold">Faixa</th>
                    <th className="py-2 pr-3 font-bold">Padrão</th>
                    <th className="py-2 font-bold">O que faz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/70">
                  {[
                    { n: "Foco", r: LIMITS.focus, u: "min", d: `${DEFAULTS.focus} min`, x: "Duração de cada sessão de concentração." },
                    { n: "Pausa curta", r: LIMITS.short, u: "min", d: `${DEFAULTS.short} min`, x: "Descanso entre pomodoros." },
                    { n: "Pausa longa", r: LIMITS.long, u: "min", d: `${DEFAULTS.long} min`, x: "Descanso maior ao fim de cada ciclo." },
                    { n: "Pausa longa a cada", r: LIMITS.longEvery, u: "pom.", d: `${DEFAULTS.longEvery} pom.`, x: "Quantos focos concluídos ativam a pausa longa." },
                    { n: "Meta diária", r: LIMITS.dailyGoal, u: "pom.", d: `${DEFAULTS.dailyGoal} pom.`, x: "Alvo de pomodoros por dia — alimenta a barra de progresso." },
                  ].map((row) => (
                    <tr key={row.n} className="transition hover:bg-ink-900/50">
                      <td className="py-2.5 pr-3 font-semibold text-sand-200">{row.n}</td>
                      <td className="py-2.5 pr-3 font-mono text-xs text-sand-400 tabular-nums">
                        {row.r[0]}–{row.r[1]} {row.u}
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-xs text-sand-300">{row.d}</td>
                      <td className="py-2.5 text-sand-400">{row.x}</td>
                    </tr>
                  ))}
                  <tr className="transition hover:bg-ink-900/50">
                    <td className="py-2.5 pr-3 font-semibold text-sand-200">Som ao concluir</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-sand-400">liga/desliga</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-sand-300">ligado</td>
                    <td className="py-2.5 text-sand-400">Toca o sino quando uma sessão chega ao fim.</td>
                  </tr>
                  <tr className="transition hover:bg-ink-900/50">
                    <td className="py-2.5 pr-3 font-semibold text-sand-200">Iniciar próxima sessão</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-sand-400">liga/desliga</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-sand-300">desligado</td>
                    <td className="py-2.5 text-sand-400">Encadeia as sessões automaticamente, sem clique.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Callout tone="warn" title="Quando o novo valor passa a valer?">
              Mudar uma duração <strong className="text-sand-200">não interrompe</strong> a sessão em andamento: ela
              vale a partir da próxima. Se o timer estiver parado, o mostrador é atualizado na hora.
            </Callout>
          </Section>

          <Section id="stats" title="Estatísticas" icon={<FlameIcon width={17} height={17} />}>
            <p>O painel “Hoje” registra seu esforço do dia, atualizado em tempo real:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-sand-200">Pomodoros</strong> — sessões de foco concluídas hoje, comparadas com a
                meta diária na barra de progresso. Ao bater a meta, a barra fica verde.
              </li>
              <li>
                <strong className="text-sand-200">Foco profundo</strong> — minutos totais de concentração somados hoje.
              </li>
              <li>
                <strong className="text-sand-200">Últimos 7 dias</strong> — barras por dia; a de hoje usa a cor do modo
                ativo. Passe o mouse (ou toque) para ver o valor exato.
              </li>
              <li>
                <strong className="text-sand-200">Sequência</strong> — dias consecutivos com pelo menos 1 pomodoro; o
                recorde histórico aparece ao lado.
              </li>
              <li>
                <strong className="text-sand-200">Total</strong> — pomodoros e minutos acumulados desde o primeiro uso
                neste navegador.
              </li>
            </ul>
            <p className="text-sm text-sand-400">
              Regras de contagem: só valem sessões concluídas até o fim (pausar e retomar não
              atrapalha; reiniciar, pular ou trocar de modo, não conta). O “hoje” vira à meia-noite
              do aparelho; o histórico completo fica guardado para o gráfico e os recordes.
            </p>
          </Section>

          <Section id="planner" title="Planner semanal" icon={<CalendarIcon width={17} height={17} />}>
            <p>
              A aba <strong className="text-sand-100">Planner</strong> guarda as ações prioritárias da semana atual
              (segunda a domingo). A regra de ouro: definir{" "}
              <strong className="text-sand-100">pelo menos 7 ações</strong> — sem plano, a semana escolhe por você.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-sand-200">Adicionar</strong> — digite e pressione Enter ou “Adicionar”. O
                medidor mostra quantas faltam para chegar a 7; ao completar, aparece o selo
                “semana priorizada”.
              </li>
              <li>
                <strong className="text-sand-200">Sugestões</strong> — enquanto houver menos de 7 ações, o app oferece
                ideias prontas que entram com um clique.
              </li>
              <li>
                <strong className="text-sand-200">Ordem = prioridade</strong> — a ação nº 01 é a mais importante.
                Reordene com as setas ▲ ▼ que aparecem em cada item.
              </li>
              <li>
                <strong className="text-sand-200">Editar</strong> — clique no texto (ou no lápis);{" "}
                <Kbd>Enter</Kbd> confirma e <Kbd>Esc</Kbd> cancela.
              </li>
              <li>
                <strong className="text-sand-200">Concluir</strong> — o quadrado de verificação risca a ação. Todas
                concluídas? O app celebra com um aviso.
              </li>
              <li>
                <strong className="text-sand-200">Remover</strong> — o ícone de lixeira apaga a ação.
              </li>
            </ul>
            <p className="text-sm text-sand-400">
              O planner é salvo por semana: na virada de segunda-feira uma lista nova começa, e as
              semanas anteriores ficam arquivadas no dispositivo por algumas semanas.
            </p>
            <Callout title="Como usar junto com o timer">
              Antes de dar Iniciar, escolha a ação nº 01 (ou a próxima não concluída) e dedique o
              pomodoro inteiro a ela — um pomodoro, uma tarefa.
            </Callout>
          </Section>

          <Section id="som" title="Som e alertas" icon={<CoffeeIcon width={17} height={17} />}>
            <p>
              O sino de conclusão é <strong className="text-sand-100">sintetizado no próprio navegador</strong>{" "}
              (WebAudio): não existe arquivo de áudio para baixar, o que mantém o app 100%
              portátil. Fim de foco toca um acorde ascendente; fim de pausa, um toque de retorno.
            </p>
            <p className="text-sm text-sand-400">
              Os navegadores só liberam som depois de uma interação sua na página — como você
              clica em Iniciar, o sino sempre estará liberado quando precisar. Para silenciar,
              desligue “Som ao concluir” nos ajustes.
            </p>
          </Section>

          <Section id="offline" title="Offline e portabilidade" icon={<OfflineIcon width={17} height={17} />}>
            <p>
              O PomoFoco foi feito para viver fora da internet: <strong className="text-sand-100">fontes, sons,
              código e dados ficam todos no seu aparelho</strong>. Nenhuma requisição externa é feita.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-sand-200">Primeira visita</strong> — o app instala um cache silencioso
                (service worker). Daí em diante abre até em modo avião, instantaneamente.
              </li>
              <li>
                <strong className="text-sand-200">No pendrive</strong> — copie a pasta do app pronto (a pasta{" "}
                <span className="font-mono text-sand-300">dist</span>) para o pen drive. Em qualquer computador, dê
                dois cliques no abridor do sistema —{" "}
                <span className="font-mono text-sand-300">ABRIR-Windows.bat</span>,{" "}
                <span className="font-mono text-sand-300">ABRIR-Mac.command</span> ou{" "}
                <span className="font-mono text-sand-300">ABRIR-Linux.sh</span>. Uma janela de texto aparece (é o
                motorzinho do app — deixe aberta enquanto usa) e o navegador abre sozinho. Não instala nada; o
                arquivo <span className="font-mono text-sand-300">LEIA-ME.txt</span> que vai junto repete as
                instruções.
              </li>
              <li>
                <strong className="text-sand-200">No celular</strong> — use a opção{" "}
                <em>“Adicionar à tela de início”</em> do navegador: o app abre em tela cheia, com cara
                de aplicativo instalado.
              </li>
              <li>
                <strong className="text-sand-200">Onde ficam os dados</strong> — no localStorage do navegador de cada
                dispositivo. Outro computador, outro navegador ou a limpeza de dados do navegador
                começam do zero.
              </li>
            </ul>
            <Callout tone="warn" title="Atenção ao trocar de máquina">
              Como tudo é local por propósito (privacidade total), estatísticas e planner{" "}
              <strong className="text-sand-200">não sincronizam entre dispositivos</strong>. No pendrive, o app viaja
              junto, mas cada computador guarda seu próprio histórico.
            </Callout>
          </Section>

          <Section id="tecnica" title="A técnica Pomodoro" icon={<TomatoIcon width={17} height={17} />}>
            <p>
              Criada por Francesco Cirillo no fim dos anos 1980, a técnica leva o nome do timer de
              cozinha em formato de tomate. A ideia: trabalhar <em>com</em> o tempo, não contra ele.
            </p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Escolha uma tarefa (o Planner existe para isso).</li>
              <li>Trabalhe nela com atenção exclusiva até o sino tocar.</li>
              <li>Faça uma pausa curta, longe da tela.</li>
              <li>A cada 4 pomodoros, uma pausa longa para recuperar fôlego.</li>
            </ol>
            <Callout title="Boas práticas">
              <ul className="list-disc space-y-1 pl-4">
                <li>Se o foco for interrompido de verdade, reinicie o pomodoro — recomeçar faz parte.</li>
                <li>Use as pausas para o corpo: alongar, água, janela. Evite trocar de tela.</li>
                <li>Ajuste as durações ao seu ritmo: blocos de 50/10 funcionam bem para trabalho profundo.</li>
                <li>Anote distrações num papel e volte a elas depois — o pomodoro é sagrado.</li>
              </ul>
            </Callout>
          </Section>

          <Section id="faq" title="Perguntas frequentes" icon={<ListIcon width={17} height={17} />}>
            <div className="space-y-2.5">
              <Faq q="Fechei a aba no meio do foco. Perdi a sessão?">
                Não. O timer usa o relógio do aparelho: ao reabrir o app, a contagem volta com o
                tempo exato. Se a sessão chegou ao fim com a aba fechada, o pomodoro é creditado
                nas estatísticas e você recebe o aviso da conclusão.
              </Faq>
              <Faq q="Posso mudar a duração com o timer rodando?">
                Sim, sem medo. A alteração vale a partir da próxima sessão — a atual segue
                intocada até o fim.
              </Faq>
              <Faq q="Pausar e retomar desconta do pomodoro?">
                Não. Pausar e continuar é permitido; a sessão conta normalmente quando chega ao
                fim. O que não conta é reiniciar, pular ou trocar de modo manualmente.
              </Faq>
              <Faq q="Meus dados aparecem em outro computador?">
                Não — e isso é de propósito. Estatísticas, planner, ajustes e estado do timer
                ficam no localStorage de cada navegador/dispositivo, garantindo privacidade total.
              </Faq>
              <Faq q="Como zerar tudo e recomeçar?">
                Limpe os dados do site nas configurações do navegador, ou execute{" "}
                <span className="font-mono text-sand-300">localStorage.clear()</span> no console do
                desenvolvedor. Todas as chaves do app começam com{" "}
                <span className="font-mono text-sand-300">pomofoco:v1:</span>{" "}
                (settings, stats, planner e timer).
              </Faq>
              <Faq q="O som não tocou. O que verificar?">
                Três pontos: (1) “Som ao concluir” está ligado nos ajustes; (2) o volume do
                sistema não está mudo; (3) você já interagiu com a página — navegadores bloqueiam
                áudio antes do primeiro clique.
              </Faq>
              <Faq q="Posso abrir em duas abas ao mesmo tempo?">
                O app funciona, mas cada aba grava seu próprio estado no armazenamento. Prefira
                uma aba por vez para manter timer e dados consistentes.
              </Faq>
              <Faq q="Quando o “hoje” e a “semana” viram?">
                As estatísticas diárias viram à meia-noite (horário do aparelho); o Planner vira na
                segunda-feira, abrindo uma lista nova para a semana.
              </Faq>
            </div>
            <div className="flex items-center gap-2 border-t border-ink-700 pt-4 text-sm text-sand-500">
              <CheckIcon width={14} height={14} className="text-mint-400" />
              Fim do manual. Agora escolha sua primeira prioridade e dê o play.
            </div>
          </Section>

          <div className="flex justify-end pb-4">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/80 px-4 py-2 text-xs font-semibold text-sand-400 transition hover:border-[var(--acc)] hover:text-sand-100"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              Voltar ao topo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
