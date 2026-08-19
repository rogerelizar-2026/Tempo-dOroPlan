/* Sino de sessão via WebAudio — nenhum arquivo externo, 100% offline */

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = ctx ?? new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function note(
  ac: AudioContext,
  freq: number,
  at: number,
  dur: number,
  peak: number
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

/** finished === "focus" → sino ascendente de pausa; senão → retorno ao foco */
export function playChime(finished: "focus" | "break"): void {
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime + 0.03;
  const seq =
    finished === "focus"
      ? [523.25, 659.25, 783.99] // C5 E5 G5
      : [659.25, 880.0]; // E5 A5
  seq.forEach((f, i) => note(ac, f, t + i * 0.16, 0.55, 0.2));
}

/** Clique discreto de interface (primeiro gesto do usuário libera o áudio) */
export function playTick(): void {
  const ac = ensureCtx();
  if (!ac) return;
  note(ac, 1180, ac.currentTime + 0.01, 0.07, 0.05);
}
