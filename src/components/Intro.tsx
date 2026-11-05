import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * The opening, staged like a product film: from black, a white pill pops up like the Dynamic Island,
 * rises to become the notch while a MacBook draws itself around it, the screen lights up, and the camera
 * flies into the screen to reveal the page. Once per visit; any click or key skips it; skipped entirely for
 * people who ask their system for reduced motion.
 */
const SEEN_KEY = "notchos.intro.seen";
// Phase timings in ms: 1 pill pops, 2 becomes the notch and the MacBook draws, 3 screen lights, 4 fly in.
const timeline = [300, 1100, 2000, 2700, 3300];

export function Intro() {
  const [phase, setPhase] = useState(() => (shouldPlay() ? 0 : -1));

  useEffect(() => {
    // The HTML ships with a black cover so the page never flashes before the intro; hand over to React.
    document.getElementById("boot")?.remove();
    if (phase < 0) return;
    document.documentElement.style.overflow = "hidden";
    const timers = timeline.map((at, index) => window.setTimeout(() => setPhase(index + 1), at));
    const skip = () => setPhase(5);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // Runs once: the phases advance on their own timers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 5) return;
    document.documentElement.style.overflow = "";
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private windows can refuse storage; the intro just plays again next time.
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase >= 0 && phase < 5 && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
          aria-hidden="true"
        >
          <motion.div
            className="w-[min(86vw,720px)]"
            initial={false}
            animate={phase >= 4 ? { scale: 3.2, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: "50% 42%" }}
          >
            <Stage phase={phase} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function shouldPlay(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

/** The MacBook, drawn on a 720 × 500 canvas. */
function Stage({ phase }: { phase: number }) {
  const drawn = phase >= 2;
  const lit = phase >= 3;
  const draw = { duration: 0.9, ease: [0.65, 0, 0.35, 1] } as const;

  return (
    <svg viewBox="0 0 720 500" className="block h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="intro-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#ece4d6" />
        </linearGradient>
      </defs>

      {/* The screen lighting up: the site's own cream. */}
      <motion.rect
        x="46" y="26" width="628" height="398" rx="14" fill="url(#intro-screen)"
        initial={{ opacity: 0 }}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Lid and base, drawn as one white line each. */}
      <motion.rect
        x="40" y="20" width="640" height="410" rx="20" fill="none" stroke="#fff" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
        transition={draw}
      />
      <motion.path
        d="M8 440 H712 Q708 462 682 468 H38 Q12 462 8 440 Z" fill="none" stroke="#fff" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
        transition={{ ...draw, delay: 0.25 }}
      />

      {/* The pill: pops up mid-screen, then rises to become the notch, flush with the top edge. */}
      <motion.rect
        fill={lit ? "#000" : "#fff"}
        initial={{ x: 360 - 6, y: 236, width: 12, height: 12, rx: 6, opacity: 0 }}
        animate={
          phase < 1
            ? { x: 360 - 6, y: 236, width: 12, height: 12, rx: 6, opacity: 0 }
            : phase < 2
              ? { x: 360 - 62, y: 228, width: 124, height: 34, rx: 17, opacity: 1 }
              : { x: 360 - 46, y: 20, width: 92, height: 22, rx: 9, opacity: 1 }
        }
        transition={phase < 2 ? { type: "spring", stiffness: 320, damping: 18 } : { type: "spring", stiffness: 140, damping: 20 }}
        style={{ transition: "fill 0.5s ease" }}
      />
      {/* Squares off the notch's top corners once it meets the edge. */}
      <motion.rect
        x={360 - 46} y="20" width="92" height="10" fill={lit ? "#000" : "#fff"}
        initial={{ opacity: 0 }}
        animate={{ opacity: drawn ? 1 : 0 }}
        transition={{ delay: drawn ? 0.55 : 0, duration: 0.2 }}
        style={{ transition: "fill 0.5s ease" }}
      />
    </svg>
  );
}
