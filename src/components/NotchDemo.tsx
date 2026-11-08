import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AppIcon } from "./AppIcon";
import { Player } from "./Features";
import { AlbumArt, Ear, Equalizer, GooFilter } from "./NotchParts";

/**
 * The hero's MacBook screen with the notch running through what it does. Sizes, corner radii and the
 * black-into-glass look are the app's own (in points, ×PT for the demo's 1000-unit canvas).
 */
const BASE_WIDTH = 1000;
const BASE_HEIGHT = 360;
const PT = 1.43;
/** The camera's height: the notch is solid black down to here, then eases into glass. */
const CAMERA = 32;

type StateID = "music" | "musicOpen" | "timer" | "two" | "swap" | "glance" | "headphones" | "notes" | "library" | "drop" | "idle";

type Shape = { label: string; width: number; height: number; top: number; bottom: number };
// Compact pills use the collapsed size's grown radii capped at half the height (16 / 16), expanded layouts 31 / 40.
const states: Record<StateID, Shape> = {
  music: { label: "Music", width: 261, height: 32, top: 16, bottom: 16 },
  musicOpen: { label: "Player", width: 440, height: 180, top: 31, bottom: 40 },
  timer: { label: "Timer", width: 280, height: 32, top: 16, bottom: 16 },
  two: { label: "Two at once", width: 280, height: 32, top: 16, bottom: 16 },
  swap: { label: "Swap", width: 261, height: 32, top: 16, bottom: 16 },
  glance: { label: "Glance", width: 300, height: 52, top: 26, bottom: 26 },
  headphones: { label: "Headphones", width: 280, height: 32, top: 16, bottom: 16 },
  notes: { label: "Quick Notes", width: 400, height: 112, top: 31, bottom: 40 },
  library: { label: "Library", width: 300, height: 110, top: 31, bottom: 40 },
  drop: { label: "Drop files", width: 420, height: 140, top: 31, bottom: 40 },
  idle: { label: "Resting", width: 184, height: 31, top: 3, bottom: 9 },
};

/** What the bubble beside the notch shows in each state (none: no bubble). */
const bubbleFor: Partial<Record<StateID, "music" | "timer">> = { two: "music", swap: "timer" };

/** The bubble: 34 × 24 pt with the notch's corner radius (up to half its height), 10 pt right of the pill. */
const BUBBLE = { width: 34, height: 24, radius: 12, gap: 10 };
/** Tucked into the notch's right edge, shrunk, as in the app's swap. */
const TUCK = -(BUBBLE.gap + BUBBLE.width + 2) * PT;

const tour: StateID[] = ["music", "musicOpen", "timer", "two", "swap", "glance", "headphones", "notes", "library", "drop", "idle"];
const spring = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 } as const;
const bubbleSpring = { type: "spring", stiffness: 210, damping: 19, mass: 0.9 } as const;

export function NotchDemo() {
  const [scale, setScale] = useState(1);
  const [state, setState] = useState<StateID>("music");
  const [paused, setPaused] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / BASE_WIDTH));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The tour only runs while the demo is on screen.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    const timer = window.setTimeout(() => setState((current) => tour[(tour.indexOf(current) + 1) % tour.length]), 3400);
    return () => window.clearTimeout(timer);
  }, [state, paused, visible]);

  const shape = states[state];
  const bubble = bubbleFor[state];
  const size = { width: shape.width * PT, height: shape.height * PT };
  const radius = { borderBottomLeftRadius: shape.bottom * PT, borderBottomRightRadius: shape.bottom * PT };
  // The bubble's spot beside the pill, from the notch's centre line.
  const bubbleLeft = (shape.width / 2 + BUBBLE.gap) * PT;
  const bubbleTop = ((shape.height - BUBBLE.height) / 2) * PT;
  const bubbleBox = { width: BUBBLE.width * PT, height: BUBBLE.height * PT, borderRadius: BUBBLE.radius * PT, top: bubbleTop };
  const bubbleMotion = {
    initial: { x: TUCK, scale: 0.65, opacity: 0, left: bubbleLeft },
    animate: { x: 0, scale: 1, opacity: 1, left: bubbleLeft },
    exit: { x: TUCK, scale: 0.65, opacity: 0, transition: { ...bubbleSpring, opacity: { delay: 0.12, duration: 0.15 } } },
    transition: { ...bubbleSpring, left: spring, opacity: { duration: 0.15 } },
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* MacBook lid: a thin dark bezel around the top of the display. */}
      <div id="hero-lid" className="rounded-t-[34px] bg-[#1b1a18] p-[10px] pb-0 shadow-[0_40px_80px_-40px_rgba(40,28,10,0.45)]">
        <div ref={wrapper} className="relative overflow-hidden rounded-t-[24px]" style={{ height: BASE_HEIGHT * scale }}>
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}>
            <Wallpaper />
            <MenuBar />
            <GooFilter id="goo-demo" blur={7} />
            <AnimatePresence>
              {state === "glance" && (
                <motion.div
                  key="pointer"
                  className="absolute left-1/2 top-[10px] z-10 ml-[40px]"
                  initial={{ opacity: 0, x: 60, y: 90 }}
                  animate={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <Cursor />
                </motion.div>
              )}
            </AnimatePresence>

            {/* A zero-width anchor on the screen's centre line; the notch is centred on it. */}
            <div className="absolute left-1/2 top-0 flex w-0 justify-center">
              {/* Underneath, melted together: the liquid bridge as the bubble leaves or rejoins the notch. */}
              {/* (A filter needs a box of its own to draw in, so this layer spans the whole screen.) The pill
                  under the notch is only there while the notch is compact, when the notch is solid black anyway:
                  under the glass of an open notch it would show through. */}
              <div className="absolute top-0" style={{ left: -BASE_WIDTH / 2, width: BASE_WIDTH, height: BASE_HEIGHT, filter: "url(#goo-demo)" }} aria-hidden="true">
                <div className="absolute top-0" style={{ left: BASE_WIDTH / 2 }}>
                  <motion.div className="absolute top-0 bg-black" initial={false}
                    animate={{ ...size, x: -size.width / 2, ...radius, opacity: shape.height <= CAMERA ? 1 : 0 }}
                    transition={{ ...spring, opacity: { duration: 0.12 } }} />
                  <AnimatePresence mode="wait">
                    {bubble && <motion.div key={bubble} className="absolute bg-black" style={bubbleBox} {...bubbleMotion} />}
                  </AnimatePresence>
                </div>
              </div>

              <motion.div
                className="notch-glass relative shrink-0"
                style={{ ["--solid" as string]: `${CAMERA * PT}px` }}
                initial={false}
                animate={{ ...size, ...radius }}
                transition={spring}
                onHoverStart={() => setPaused(true)}
                onHoverEnd={() => setPaused(false)}
              >
                <Ear side="left" radius={shape.top * PT} />
                <Ear side="right" radius={shape.top * PT} />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={state === "two" ? "timer" : state === "swap" ? "music" : state}
                    className="absolute inset-0 overflow-hidden"
                    style={{ borderRadius: "inherit" }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.12, duration: 0.3 } }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
                  >
                    <NotchContent state={state} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <AnimatePresence mode="wait">
                {bubble && (
                  <motion.div key={bubble} className="absolute flex items-center justify-center bg-black" style={bubbleBox} {...bubbleMotion}>
                    {bubble === "music" ? <Equalizer height={15} bar={3.4} /> : <MiniRing percent={64} color="#f0a04b" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="NotchOS states">
        {tour.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={state === id}
            onClick={() => {
              setState(id);
              setPaused(true);
            }}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
              state === id ? "bg-ink text-cream shadow-[0_6px_20px_-8px_rgba(23,21,15,0.6)]" : "glass text-ink-soft hover:text-ink"
            }`}
          >
            {states[id].label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NotchContent({ state }: { state: StateID }) {
  switch (state) {
    case "idle":
      return null;
    case "music":
    case "swap":
      return (
        <Row>
          <AlbumArt size={28} />
          <Equalizer height={20} />
        </Row>
      );
    case "musicOpen":
      return (
        <div className="flex h-full items-end justify-center pb-[23px]">
          <Player scale={PT} />
        </div>
      );
    case "timer":
    case "two":
      return (
        <Row>
          <AppIcon name="timer" size={24} color="#f0a04b" />
          <Countdown />
        </Row>
      );
    case "glance":
      return <GlanceRow />;
    case "headphones":
      return (
        <Row>
          <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 }}>
            <AppIcon name="headphones" size={26} color="#f5f5f7" />
          </motion.div>
          <BatteryRing percent={82} />
        </Row>
      );
    case "notes":
      return <NoteTaking />;
    case "library":
      return <Library />;
    case "drop":
      return <DropZone />;
  }
}

/** Quick Notes: listening, and the words arriving as you speak. */
function NoteTaking() {
  return (
    <div className="flex h-full flex-col justify-end px-[34px] pb-[24px]">
      <span className="flex items-center gap-[9px] text-[15px] font-semibold text-white/60">
        <span className="pulse-dot h-[11px] w-[11px] rounded-full bg-[#ff453a]" /> Listening · hold ⌃ Space
      </span>
      <p className="mt-[10px] flex items-center text-[20px] text-white">
        <span className="typing whitespace-nowrap">Call Sam about the launch</span>
        <span className="caret ml-[2px] inline-block h-[22px] w-[2px] bg-[#ffcc00]" />
      </p>
    </div>
  );
}

/** The glance: rest the pointer on the notch and a quiet row grows out under it. */
function GlanceRow() {
  return (
    <div className="flex h-full items-end justify-center pb-[10px]">
      <motion.div
        className="flex items-center gap-[22px] text-[15px] font-semibold text-white/85"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <span className="flex items-center gap-[7px]">
          <MiniRing percent={64} color="#f0a04b" />
          <Countdown small />
        </span>
        <span className="flex items-center gap-[7px]">
          <AlbumArt size={19} />
          Golden Hour
        </span>
        <span className="flex items-center gap-[7px]">
          <AppIcon name="globe" size={17} color="#64d2ff" />
          Ana 9:41
        </span>
      </motion.div>
    </div>
  );
}

/** The battery, filling up as the device lands. */
function BatteryRing({ percent }: { percent: number }) {
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  return (
    <span className="flex items-center gap-[10px] text-[19px] font-semibold tabular-nums text-[#30d158]">
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>{percent}%</motion.span>
      <svg viewBox="0 0 28 28" className="h-[26px] w-[26px] -rotate-90">
        <circle cx="14" cy="14" r={radius} fill="none" stroke="rgba(48,209,88,0.25)" strokeWidth="3.4" />
        <motion.circle
          cx="14" cy="14" r={radius} fill="none" stroke="#30d158" strokeWidth="3.4" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percent / 100) }}
          transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

function MiniRing({ percent, color }: { percent: number; color: string }) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 18 18" className="h-[19px] w-[19px] -rotate-90">
      <circle cx="9" cy="9" r={radius} fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="2.6" />
      <circle cx="9" cy="9" r={radius} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percent / 100)} />
    </svg>
  );
}

/** The macOS pointer, resting on the notch. */
function Cursor() {
  return (
    <svg viewBox="0 0 24 24" className="h-[30px] w-[30px] drop-shadow-md" aria-hidden="true">
      <path d="M5 3l14 8.5-6.2 1.3L16 20l-2.6 1.1-3.2-7.2L5 18z" fill="#000" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex h-full items-center justify-between px-[24px]">{children}</div>;
}

function Countdown({ small = false }: { small?: boolean }) {
  const [seconds, setSeconds] = useState(4 * 60 + 53);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => (value > 0 ? value - 1 : 293)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const text = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  if (small) return <span className="tabular-nums">{text}</span>;
  return <span className="font-mono text-[22px] font-bold tabular-nums text-[#f0a04b]">{text}</span>;
}

const libraryApps = ["alarm", "timer", "tomato", "note", "bolt"] as const;
const libraryColors = ["#f0a04b", "#ec8b3a", "#e5534b", "#e8607f", "#6f63e6"];

function Library() {
  return (
    <div className="flex h-full items-end justify-center gap-[16px] pb-[30px]">
      {libraryApps.map((glyph, index) => {
        const centre = index === 2;
        const size = centre ? 66 : 52;
        return (
          <motion.div
            key={glyph}
            className="flex items-center justify-center rounded-full"
            style={{ width: size, height: size, background: libraryColors[index] }}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: centre ? 1 : 0.55 }}
            transition={{ delay: 0.15 + index * 0.04, ...spring }}
          >
            <AppIcon name={glyph} size={centre ? 30 : 24} color="#fff" />
          </motion.div>
        );
      })}
    </div>
  );
}

function DropZone() {
  return (
    <div className="relative grid h-full grid-cols-2 gap-[16px] px-[24px] pb-[24px] pt-[58px]">
      {([
        { label: "Tray", glyph: "tray", tint: "#5ec8e5" },
        { label: "AirDrop", glyph: "airdrop", tint: "#6f8cff" },
      ] as const).map((box, index) => (
        <motion.div
          key={box.label}
          className="flex flex-col items-center justify-center gap-[10px] rounded-[22px] border-[2px] border-dashed"
          initial={false}
          animate={index === 0 ? { borderColor: ["rgba(255,255,255,0.3)", box.tint, box.tint], backgroundColor: ["rgba(255,255,255,0.04)", "rgba(94,200,229,0.22)", "rgba(94,200,229,0.22)"] } : {}}
          transition={{ duration: 1.6, delay: 0.9, times: [0, 0.4, 1] }}
          style={{ borderColor: "rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          <AppIcon name={box.glyph} size={30} color="#fff" />
          <span className="text-[17px] font-semibold text-white">{box.label}</span>
        </motion.div>
      ))}
      {/* A file being dragged up into the Tray. */}
      <motion.div
        className="absolute left-[22%] flex h-[56px] w-[46px] items-center justify-center rounded-[8px] bg-white shadow-xl"
        initial={{ y: 240, opacity: 0, rotate: -8 }}
        animate={{ y: [240, 150, 108], opacity: [0, 1, 0], rotate: [-8, -3, 0], scale: [1, 1, 0.7] }}
        transition={{ duration: 1.8, delay: 0.2, times: [0, 0.6, 1], ease: "easeOut" }}
        style={{ top: 0 }}
      >
        <AppIcon name="file" size={26} color="#17150f" />
      </motion.div>
    </div>
  );
}

/** A dusk desktop, like macOS's own: an indigo sky warming to the horizon over plum dunes. */
export const wallpaperSky = ["#2a2347", "#c9775c"] as const;

function Wallpaper() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={wallpaperSky[0]} />
          <stop offset="0.55" stopColor="#7a4d76" />
          <stop offset="1" stopColor={wallpaperSky[1]} />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd9a0" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="360" fill="url(#sky)" />
      <circle cx="760" cy="215" r="120" fill="url(#sun)" opacity="0.55" />
      <circle cx="760" cy="215" r="34" fill="#ffe2b8" />
      <path d="M0 230 C 180 190, 320 250, 520 222 S 860 182, 1000 214 L1000 360 L0 360Z" fill="#8a4f62" />
      <path d="M0 272 C 220 246, 380 300, 600 272 S 880 244, 1000 266 L1000 360 L0 360Z" fill="#5e3550" />
      <path d="M0 314 C 260 296, 460 340, 700 312 S 920 300, 1000 308 L1000 360 L0 360Z" fill="#3b2339" />
    </svg>
  );
}

function MenuBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[44px] items-center justify-between bg-[#1a1328]/25 px-[26px] text-[15px] text-white">
      <div className="flex items-center gap-[22px]">
        <span className="font-semibold">NotchOS</span>
        <span className="text-white/75">File</span>
        <span className="text-white/75">Edit</span>
        <span className="text-white/75">View</span>
      </div>
      <div className="flex items-center text-white/80">
        <span className="tabular-nums">Sun 8 Nov 9:41</span>
      </div>
    </div>
  );
}
