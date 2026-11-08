import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { markHandoff, markIntroDone, setIntroPlays } from "../lib/intro";
import { ScaleWords } from "./Motion";

/**
 * The opening, shot as one continuous take:
 *  1. Black. A white pill pops up like the Dynamic Island.
 *  2. It rises into the notch while a MacBook draws itself around it.
 *  3. The screen lights up and the title appears on it, word by word.
 *  4. The camera pulls back: black turns into the page's cream, the title lifts off the screen and glides
 *     to the page's headline, and the MacBook settles into the page's own MacBook, which takes over in
 *     place. The page's chrome fades in around them.
 * No cut: the moving title and MacBook land exactly on the real ones. Once per visit; a click or key skips
 * straight to the page; never for people who ask their system for reduced motion.
 */
const SEEN_KEY = "notchos.intro.seen";
// When each beat starts (ms): pill, notch + drawing, screen lights, title, pull back, handoff.
const timeline = [300, 1100, 2000, 2350, 3500, 4750];
const VIEW = { width: 720, height: 500, screenX: 40, screenY: 20, screenWidth: 640, screenHeight: 410 };

type Rect = { left: number; top: number; width: number; height: number };

/** Where an element sits in the page, ignoring its own animation transforms. */
function layoutRect(element: HTMLElement): Rect {
  let left = 0;
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    left += node.offsetLeft;
    top += node.offsetTop;
  }
  return { left: left - window.scrollX, top: top - window.scrollY, width: element.offsetWidth, height: element.offsetHeight };
}

export function Intro() {
  const [phase, setPhase] = useState(() => {
    const plays = shouldPlay();
    setIntroPlays(plays);
    return plays ? 0 : -1;
  });
  const stage = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState<{ stage: Rect; title: Rect; demo: Rect } | null>(null);

  useEffect(() => {
    // The HTML ships with a black cover so the page never flashes first; the film takes over from it.
    document.getElementById("boot")?.remove();
    if (phase < 0) return markHandoff();
    document.documentElement.style.overflow = "hidden";
    const timers = timeline.map((at, index) => window.setTimeout(() => setPhase(index + 1), at));
    const skip = () => setPhase(6);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // Runs once: the beats advance on their own timers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Measure the page as it is laid out, so the camera lands exactly on the real headline and MacBook.
    if (phase === 4) {
      const title = document.getElementById("hero-title");
      // The page's MacBook lid itself (it waits flat for the film, so its box is exactly where it sits).
      const lid = document.getElementById("hero-lid");
      if (stage.current && title && lid) {
        const box = stage.current.getBoundingClientRect();
        const target = lid.getBoundingClientRect();
        setShot({
          stage: { left: box.left, top: box.top, width: box.width, height: box.height },
          title: layoutRect(title),
          demo: { left: target.left, top: target.top, width: target.width, height: target.height },
        });
      }
    }
    if (phase === 5) markIntroDone();
    if (phase >= 6) {
      markHandoff();
      document.documentElement.style.overflow = "";
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private windows can refuse storage; the film just plays again next time.
      }
    }
  }, [phase]);

  if (phase < 0 || phase >= 6) return null;
  const pulling = phase >= 5;

  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: pulling ? "none" : "auto" }}
      initial={{ backgroundColor: "rgba(0,0,0,1)" }}
      animate={{ backgroundColor: pulling ? "rgba(246,241,232,0)" : "rgba(0,0,0,1)" }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      aria-hidden="true"
    >
      <div className="flex h-full w-full items-center justify-center">
        <motion.div
          ref={stage}
          className="w-[min(86vw,720px)]"
          style={{ transformOrigin: "0 0" }}
          initial={false}
          animate={pulling && shot ? cameraTarget(shot) : { x: 0, y: 0, scale: 1, opacity: 1 }}
          transition={{
            default: { duration: 1.1, ease: [0.65, 0, 0.35, 1] },
            opacity: { delay: 0.65, duration: 0.45 },
          }}
        >
          <Stage phase={phase} />
        </motion.div>
      </div>
      {shot && phase >= 4 && <TitleCard shot={shot} pulling={pulling} />}
    </motion.div>
  );
}

/** Moves the MacBook so its lid lands on the page's MacBook (top-left anchored), fading as the real one takes over. */
function cameraTarget(shot: { stage: Rect; demo: Rect }) {
  const lidWidth = (VIEW.screenWidth / VIEW.width) * shot.stage.width;
  const scale = shot.demo.width / lidWidth;
  const lidLeft = (VIEW.screenX / VIEW.width) * shot.stage.width * scale;
  const lidTop = (VIEW.screenY / VIEW.height) * shot.stage.height * scale;
  return { x: shot.demo.left - shot.stage.left - lidLeft, y: shot.demo.top - shot.stage.top - lidTop, scale, opacity: 0 };
}

/** The title on the MacBook's screen, which then lifts off and lands on the page's headline. */
function TitleCard({ shot, pulling }: { shot: { stage: Rect; title: Rect }; pulling: boolean }) {
  const { stage, title } = shot;
  const screen = {
    x: stage.left + (VIEW.screenX / VIEW.width) * stage.width,
    y: stage.top + (VIEW.screenY / VIEW.height) * stage.height,
    width: (VIEW.screenWidth / VIEW.width) * stage.width,
    height: (VIEW.screenHeight / VIEW.height) * stage.height,
  };
  const onScreen = {
    x: screen.x + screen.width / 2 - (title.left + title.width / 2),
    y: screen.y + screen.height * 0.46 - (title.top + title.height / 2),
    scale: Math.min(0.62, (screen.width * 0.7) / title.width),
  };
  return (
    <motion.h1
      className="pointer-events-none fixed m-0 text-center text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-[76px]"
      style={{ left: title.left, top: title.top, width: title.width, height: title.height }}
      initial={onScreen}
      animate={pulling ? { x: 0, y: 0, scale: 1 } : onScreen}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      <ScaleWords text="The notch" start delay={0.05} />
      <br />
      <ScaleWords text="just woke up." start delay={0.3} className="text-ink-soft" />
    </motion.h1>
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
          <stop offset="0" stopColor="#2a2347" />
          <stop offset="0.55" stopColor="#7a4d76" />
          <stop offset="1" stopColor="#c9775c" />
        </linearGradient>
      </defs>

      {/* The screen lighting up: the demo's dusk wallpaper. */}
      <motion.rect
        x="46" y="26" width="628" height="398" rx="14" fill="url(#intro-screen)"
        initial={{ opacity: 0 }}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Lid and base, drawn as one white line each; the lid darkens to the real bezel as the camera pulls back. */}
      <motion.rect
        x="40" y="20" width="640" height="410" rx="20" fill="none" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0, stroke: "#ffffff" }}
        animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0, stroke: phase >= 5 ? "#1b1a18" : "#ffffff" }}
        transition={draw}
      />
      <motion.path
        d="M8 440 H712 Q708 462 682 468 H38 Q12 462 8 440 Z" fill="none" stroke="#fff" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: drawn ? 1 : 0, opacity: drawn && phase < 5 ? 1 : 0 }}
        transition={{ ...draw, delay: phase >= 5 ? 0 : 0.25 }}
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
