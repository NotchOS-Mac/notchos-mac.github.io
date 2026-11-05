import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AppIcon, type IconName } from "./AppIcon";

/** The demo display is drawn on a 1000-unit-wide canvas and scaled to fit; 1 pt of a real notch ≈ 1.43 units. */
const BASE_WIDTH = 1000;
const BASE_HEIGHT = 360;
const PT = 1.43;

type StateID = "idle" | "music" | "musicOpen" | "timer" | "glance" | "airpods" | "library" | "drop";

const states: Record<StateID, { label: string; width: number; height: number; top: number; bottom: number }> = {
  idle: { label: "Resting", width: 184, height: 31, top: 3, bottom: 9 },
  music: { label: "Music", width: 261, height: 32, top: 6, bottom: 16 },
  musicOpen: { label: "Expanded", width: 420, height: 120, top: 18, bottom: 34 },
  timer: { label: "Timer", width: 300, height: 32, top: 6, bottom: 16 },
  glance: { label: "Glance", width: 230, height: 52, top: 6, bottom: 16 },
  airpods: { label: "AirPods", width: 300, height: 32, top: 6, bottom: 16 },
  library: { label: "Library", width: 260, height: 105, top: 18, bottom: 34 },
  drop: { label: "Drop files", width: 420, height: 140, top: 18, bottom: 34 },
};

const tour: StateID[] = ["music", "musicOpen", "timer", "glance", "airpods", "library", "drop", "idle"];
const spring = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 } as const;

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

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => setState((current) => tour[(tour.indexOf(current) + 1) % tour.length]), 3400);
    return () => window.clearTimeout(timer);
  }, [state, paused]);

  const shape = states[state];

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* MacBook lid: a thin dark bezel around the top of the display. */}
      <div className="rounded-t-[34px] bg-[#1b1a18] p-[10px] pb-0 shadow-[0_40px_80px_-40px_rgba(40,28,10,0.45)]">
        <div ref={wrapper} className="relative overflow-hidden rounded-t-[24px]" style={{ height: BASE_HEIGHT * scale }}>
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}>
            <Wallpaper />
            <MenuBar />
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
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <motion.div
                className="relative bg-black"
                initial={false}
                animate={{
                  width: shape.width * PT,
                  height: shape.height * PT,
                  borderBottomLeftRadius: shape.bottom * PT,
                  borderBottomRightRadius: shape.bottom * PT,
                }}
                transition={spring}
                onHoverStart={() => setPaused(true)}
                onHoverEnd={() => setPaused(false)}
              >
                <Ear side="left" radius={shape.top * PT} />
                <Ear side="right" radius={shape.top * PT} />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={state}
                    className="absolute inset-0 overflow-hidden"
                    style={{ borderRadius: "inherit" }}
                    initial={{ opacity: 0, filter: "blur(6px)", scale: 0.92 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1, transition: { delay: 0.12, duration: 0.32 } }}
                    exit={{ opacity: 0, filter: "blur(6px)", scale: 0.96, transition: { duration: 0.14 } }}
                  >
                    <NotchContent state={state} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
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
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
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

/** The concave corner where the notch meets the top edge of the screen. */
function Ear({ side, radius }: { side: "left" | "right"; radius: number }) {
  return (
    <motion.span
      className="absolute top-0"
      initial={false}
      animate={{ width: radius, height: radius, [side]: -radius + 0.5 }}
      transition={spring}
      style={{
        background: `radial-gradient(circle at ${side === "left" ? "0 100%" : "100% 100%"}, transparent 70%, #000 71%)`,
      }}
    />
  );
}

function NotchContent({ state }: { state: StateID }) {
  switch (state) {
    case "idle":
      return null;
    case "music":
      return (
        <Row>
          <AlbumArt size={28} />
          <Equalizer />
        </Row>
      );
    case "musicOpen":
      return <ExpandedMusic />;
    case "timer":
      return (
        <Row>
          <AppIcon name="timer" size={24} color="#f0a04b" />
          <Countdown />
        </Row>
      );
    case "glance":
      return <GlanceRow />;
    case "airpods":
      return (
        <Row>
          <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 }}>
            <AirPodsGlyph />
          </motion.div>
          <BatteryRing percent={82} />
        </Row>
      );
    case "library":
      return <Library />;
    case "drop":
      return <DropZone />;
  }
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
      </motion.div>
    </div>
  );
}

/** AirPods, drawn for the site (Apple's symbols can't be used on the web). */
function AirPodsGlyph() {
  return (
    <svg viewBox="0 0 40 28" className="h-[30px] w-[42px]" aria-label="AirPods">
      {[{ head: 12, stem: 13.2, grille: 9.6 }, { head: 28, stem: 22.8, grille: 30.4 }].map((bud) => (
        <g key={bud.head}>
          <ellipse cx={bud.head} cy="9" rx="7" ry="6.4" fill="#f5f5f7" />
          <rect x={bud.stem} y="10" width="4" height="15.5" rx="2" fill="#f5f5f7" />
          <ellipse cx={bud.grille} cy="8.6" rx="2" ry="1.3" fill="#b9b9be" />
        </g>
      ))}
    </svg>
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
  return <div className="flex h-full items-center justify-between px-[22px]">{children}</div>;
}

/** Album art: a warm sunset. */
function AlbumArt({ size }: { size: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: size, height: size, borderRadius: size * 0.22, background: "linear-gradient(180deg,#f7c58b 0%,#ef8c62 55%,#7d4b6b 100%)" }}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full">
        <circle cx="24" cy="24" r="9" fill="#fff4d6" />
        <path d="M0 33 Q12 27 24 32 T48 31 V48 H0 Z" fill="#4b2d45" opacity="0.55" />
        <path d="M0 38 Q14 33 28 37 T48 36 V48 H0 Z" fill="#3a2236" opacity="0.75" />
      </svg>
    </div>
  );
}

function Equalizer({ height = 20, color = "#f06b8b" }: { height?: number; color?: string }) {
  return (
    <div className="flex items-center gap-[3px]" style={{ height }}>
      {[0, 0.25, 0.5, 0.15].map((delay, index) => (
        <motion.span
          key={index}
          className="w-[4px] rounded-full"
          style={{ background: color }}
          animate={{ height: [height * 0.3, height, height * 0.45, height * 0.85, height * 0.3] }}
          transition={{ duration: 1.1 + index * 0.13, repeat: Infinity, ease: "easeInOut", delay }}
        />
      ))}
    </div>
  );
}

function ExpandedMusic() {
  return (
    <div className="flex h-full flex-col justify-end px-[34px] pb-[24px]">
      <div className="flex items-center gap-[18px]">
        <AlbumArt size={64} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[19px] font-semibold text-white">Golden Hour Loop</p>
          <p className="truncate text-[15px] text-white/50">Mira Vale</p>
        </div>
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="#f4c542">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.3 6.1 20.5l1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
        <div className="flex items-center gap-[20px] pl-[10px] text-white">
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor"><path d="M11 6v12L2 12zm11 0v12l-9-6z" /></svg>
          <svg viewBox="0 0 24 24" className="h-[28px] w-[28px]" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor"><path d="M13 6v12l9-6zM2 6v12l9-6z" /></svg>
        </div>
      </div>
      <div className="mt-[16px] h-[6px] w-full overflow-hidden rounded-full bg-white/20">
        <motion.div className="h-full rounded-full bg-white/90" initial={{ width: "34%" }} animate={{ width: "62%" }} transition={{ duration: 3.2, ease: "linear" }} />
      </div>
    </div>
  );
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

const libraryApps: { glyph: IconName; color: string }[] = [
  { glyph: "alarm", color: "#f0a04b" },
  { glyph: "timer", color: "#ec8b3a" },
  { glyph: "tomato", color: "#e5534b" },
  { glyph: "note", color: "#e8607f" },
  { glyph: "bolt", color: "#6f63e6" },
];

function Library() {
  return (
    <div className="flex h-full items-end justify-center gap-[16px] pb-[30px]">
      {libraryApps.map((app, index) => {
        const centre = index === 2;
        const size = centre ? 66 : 52;
        return (
          <motion.div
            key={app.glyph}
            className="flex items-center justify-center rounded-full"
            style={{ width: size, height: size, background: app.color, opacity: centre ? 1 : 0.55, filter: centre ? "none" : "blur(0.6px)" }}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: centre ? 1 : 0.55 }}
            transition={{ delay: 0.15 + index * 0.04, ...spring }}
          >
            <AppIcon name={app.glyph} size={centre ? 30 : 24} color="#fff" />
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
        initial={{ top: 240, opacity: 0, rotate: -8 }}
        animate={{ top: [240, 150, 108], opacity: [0, 1, 0], rotate: [-8, -3, 0], scale: [1, 1, 0.7] }}
        transition={{ duration: 1.8, delay: 0.2, times: [0, 0.6, 1], ease: "easeOut" }}
      >
        <AppIcon name="file" size={26} color="#17150f" />
      </motion.div>
    </div>
  );
}

/** A calm desktop: layered sand dunes in cream and clay. */
function Wallpaper() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8efe2" />
          <stop offset="1" stopColor="#efd9c0" />
        </linearGradient>
      </defs>
      <rect width="1000" height="360" fill="url(#sky)" />
      <circle cx="770" cy="150" r="46" fill="#fbe7c6" />
      <path d="M0 230 C 180 180, 320 250, 520 215 S 860 170, 1000 210 L1000 360 L0 360Z" fill="#e8c8a6" />
      <path d="M0 270 C 220 240, 380 300, 600 268 S 880 236, 1000 262 L1000 360 L0 360Z" fill="#ddb48f" />
      <path d="M0 312 C 260 292, 460 340, 700 310 S 920 296, 1000 306 L1000 360 L0 360Z" fill="#cf9e78" />
    </svg>
  );
}

function MenuBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[44px] items-center justify-between bg-white/35 px-[26px] text-[15px] text-ink backdrop-blur-md">
      <div className="flex items-center gap-[22px]">
        <span className="font-semibold">NotchOS</span>
        <span className="text-ink-soft">File</span>
        <span className="text-ink-soft">Edit</span>
        <span className="text-ink-soft">View</span>
      </div>
      <div className="flex items-center text-ink-soft">
        <span className="tabular-nums">Tue 4 Nov 9:41</span>
      </div>
    </div>
  );
}
