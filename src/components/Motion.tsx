import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { introPlays, useHandoff, useIntroDone } from "../lib/intro";

/** The site's one spring: the notch waking up. */
export const wake = { type: "spring", stiffness: 210, damping: 22, mass: 0.9 } as const;

/**
 * Words that scale up out of a blur, one after another, like the notch springing open. They start the moment
 * `start` turns true (in the hero: as the intro flies into the screen).
 */
export function ScaleWords({ text, start, delay = 0, className = "" }: {
  text: string;
  start: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block whitespace-pre will-change-transform"
          initial={{ opacity: 0, scale: 0.55, y: 18, filter: "blur(14px)" }}
          animate={start ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ ...wake, delay: delay + index * 0.09 }}
        >
          {word}
          {index < text.split(" ").length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * The notch that follows you: a small black notch at the top edge of the browser with a thin amber line that
 * fills as you read down the page. It pops in with the page, after the intro.
 */
export function ScrollNotch() {
  const ready = useIntroDone();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });

  return (
    <motion.div
      className="pointer-events-none fixed left-1/2 top-0 z-[60] -translate-x-1/2"
      initial={{ opacity: 0, scale: 0.4, y: -10 }}
      animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ ...wake, delay: 0.9 }}
      aria-hidden="true"
    >
      <div className="relative h-[13px] w-[128px] rounded-b-[10px] bg-black shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)]">
        <motion.div
          className="absolute bottom-[3px] left-[16px] right-[16px] h-[2px] origin-left rounded-full bg-amber"
          style={{ scaleX: progress }}
        />
      </div>
    </motion.div>
  );
}

/**
 * The MacBook tilting up to face you as it scrolls into view, the way product pages present hardware.
 */
export function TiltOnScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  // With the opening film, the MacBook waits flat for the film's MacBook to land on it, then settles back
  // into its tilted pose, like a camera coming to rest.
  const filmed = introPlays();
  const landed = useHandoff();
  const settle = useMotionValue(filmed ? 0 : 1);
  useEffect(() => {
    if (!filmed || !landed) return;
    const controls = animate(settle, 1, { delay: 0.35, duration: 1.4, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [filmed, landed, settle]);
  const rotateX = useTransform(() => 18 * (1 - eased.get()) * settle.get());
  const scale = useTransform(() => 1 - 0.1 * (1 - eased.get()) * settle.get());
  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX, scale, transformOrigin: "50% 100%" }}>{children}</motion.div>
    </div>
  );
}

/** The hero text gently receding as you scroll past it. */
export function useRecede() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.25]);
  return { ref, style: { scale, opacity } };
}
