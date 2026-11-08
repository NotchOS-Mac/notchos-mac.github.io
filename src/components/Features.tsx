import type { CSSProperties, ReactNode } from "react";
import { AppIcon, AppIconTile, type IconName } from "./AppIcon";
import { AirPlay, AlbumArt, Equalizer, GooFilter, MiniNotch, PlayPause, SkipArrows, Star } from "./NotchParts";

/**
 * The feature grid: cards of five sizes packed densely (12 columns on desktop, 6 on tablets, 2 on phones).
 * Cards rise into place as they scroll in (`.reveal`, pure CSS); their little notches loop only while on
 * screen (`data-loop`).
 */
type Size = "xl" | "l" | "m" | "mw" | "t" | "s";

const spans: Record<Size, string> = {
  xl: "col-span-2 md:col-span-6 md:row-span-3",
  l: "col-span-2 md:col-span-6 md:row-span-2",
  m: "col-span-2 md:col-span-3 md:row-span-2",
  mw: "col-span-2 md:col-span-3 lg:col-span-4 md:row-span-2",
  t: "col-span-2 md:col-span-3 md:row-span-3",
  s: "col-span-1 md:col-span-3 md:row-span-1",
};

function Tile({ size, d = 0, className = "", children }: { size: Size; d?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`reveal glass relative overflow-clip rounded-[26px] ${spans[size]} ${className}`} style={{ "--d": d } as CSSProperties}>
      {children}
    </div>
  );
}

/** A small card: the app's icon, a name and one line. */
function Small({ glyph, title, d, children }: { glyph: IconName; title: string; d?: number; children: ReactNode }) {
  return (
    <Tile size="s" d={d} className="flex flex-col justify-between p-4 md:flex-row md:items-center md:justify-start md:gap-3.5 md:p-5">
      <AppIconTile name={glyph} size={34} />
      <div className="mt-3 md:mt-0">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h3>
        <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{children}</p>
      </div>
    </Tile>
  );
}

/** Name and description under (or beside) a card's picture. */
function Caption({ title, glyph, children, className = "" }: { title: string; glyph?: IconName; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.02em]">
        {glyph && <AppIconTile name={glyph} size={26} />}
        {title}
      </h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

/** The top of a little screen: a tinted wash with the notch hanging from its edge. */
function Screen({ tint, className = "", children }: { tint: string; className?: string; children: ReactNode }) {
  return (
    <div data-loop className={`relative ${className}`} style={{ background: `linear-gradient(180deg, ${tint}, transparent)` }}>
      {children}
    </div>
  );
}

function Keycap({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <span
      className={`inline-flex h-8 items-center justify-center rounded-[9px] border border-white bg-gradient-to-b from-white to-[#efe8dc] text-[13px] font-medium text-ink shadow-[0_1.5px_0_#d9cfbf,0_6px_12px_-8px_rgba(60,45,20,0.4)] ${wide ? "w-20" : "w-8"}`}
    >
      {children}
    </span>
  );
}

/* The cards with pictures. */

/** Two live activities: the second pops out of the notch into its own bubble as the card scrolls in. */
function LiveActivities() {
  // The app's sizes ×1.4: a 32 pt pill, its 34 × 24 pt bubble 10 pt away, corner radius 12 pt.
  const k = 1.4;
  const pill = { width: 220 * k, height: 32 * k };
  const bubble = { width: 34 * k, height: 24 * k };
  const gap = 10 * k;
  // The bubble starts tucked inside the notch's right edge, shrunk, as in the app's swap.
  const tuck = `${-(gap + bubble.width + 2 * k)}px`;
  const bubbleStyle: CSSProperties = {
    position: "absolute",
    top: (pill.height - bubble.height) / 2,
    left: `calc(50% + ${pill.width / 2 + gap}px)`,
    width: bubble.width,
    height: bubble.height,
    borderRadius: 12 * k,
    ["--tuck" as string]: tuck,
  };
  return (
    <Tile size="xl" d={0} className="flex flex-col">
      <div data-loop className="relative mx-4 mt-4 flex-1 overflow-clip rounded-[20px] md:mx-5 md:mt-5"
        style={{ background: "linear-gradient(180deg,#2a2347 0%,#7a4d76 62%,#c9775c 100%)" }}>
        <GooFilter id="goo-card" blur={5} />
        <div className="relative mx-auto" style={{ width: pill.width + 2 * (gap + bubble.width) + 24, height: pill.height }}>
          {/* Underneath, blurred together: the bridge of "liquid" between the notch and the bubble. */}
          <div className="absolute -inset-x-6 inset-y-0" style={{ filter: "url(#goo-card)" }} aria-hidden="true">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-black" style={{ ...pill, borderRadius: `0 0 ${16 * k}px ${16 * k}px` }} />
            <div className="bubble-out bg-black" style={bubbleStyle} />
          </div>
          <MiniNotch width={pill.width} height={pill.height} top={16 * k} bottom={16 * k} centered={false}
            style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)" }}>
            <div className="flex h-full items-center justify-between px-5">
              <AppIcon name="timer" size={22} color="#f0a04b" />
              <span className="font-mono text-[19px] font-bold tabular-nums text-[#f0a04b]">12:04</span>
            </div>
          </MiniNotch>
          <div className="bubble-out flex items-center justify-center bg-black" style={bubbleStyle}>
            <Equalizer height={16} bar={3.2} />
          </div>
        </div>
        {/* Dunes, like the desktop under the notch. */}
        <svg className="absolute inset-x-0 bottom-0 h-[45%] w-full" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C 80 20, 150 55, 240 38 S 360 22, 400 34 L400 100 L0 100Z" fill="#8a4f62" />
          <path d="M0 66 C 100 52, 180 80, 280 64 S 380 54, 400 60 L400 100 L0 100Z" fill="#5e3550" />
          <path d="M0 88 C 120 80, 220 98, 320 86 S 390 82, 400 84 L400 100 L0 100Z" fill="#3b2339" />
        </svg>
        <div className="absolute inset-x-0 top-[42%] flex items-center justify-center gap-2.5 px-4 text-[12px] font-medium text-white/85">
          <span className="rounded-full bg-black/25 px-3 py-1.5">Two at once</span>
        </div>
      </div>
      <Caption title="Live Activities" glyph="timer" className="p-7 pt-5">
        Two things live at once: one in the notch, one in a bubble beside it.
      </Caption>
    </Tile>
  );
}

/** The expanded player, as the app draws it: art and title, the seek bar, and ★ ⏮ ⏯ ⏭ AirPlay. */
export function Player({ scale = 1 }: { scale?: number }) {
  const u = (value: number) => value * scale;
  return (
    <div className="flex flex-col" style={{ width: u(392) }}>
      <div className="flex items-center" style={{ height: u(52), gap: u(14) }}>
        <AlbumArt size={u(52)} flip />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white" style={{ fontSize: u(15) }}>Golden Hour Loop</p>
          <p className="truncate text-white/55" style={{ fontSize: u(13) }}>Mira Vale</p>
        </div>
        <Equalizer height={u(14)} bar={u(3)} />
      </div>
      <div className="flex items-center font-medium tabular-nums text-white/50" style={{ marginTop: u(13), height: u(14), gap: u(10), fontSize: u(11) }}>
        <span style={{ minWidth: u(34) }}>1:09</span>
        <span className="relative flex-1 overflow-hidden rounded-full bg-white/20" style={{ height: u(4) }}>
          <span className="absolute inset-y-0 left-0 w-[34%] rounded-full bg-white/90" />
        </span>
        <span className="text-right" style={{ minWidth: u(34) }}>-2:11</span>
      </div>
      <div className="flex items-center justify-between text-white" style={{ marginTop: u(15), height: u(32) }}>
        <span className="flex items-center justify-center" style={{ width: u(32) }}><Star size={u(18)} /></span>
        <span className="flex items-center" style={{ gap: u(30) }}>
          <SkipArrows size={u(15)} forward={false} />
          <PlayPause size={u(26)} />
          <SkipArrows size={u(15)} loop />
        </span>
        <span className="flex items-center justify-center" style={{ width: u(32) }}><AirPlay size={u(19)} /></span>
      </div>
    </div>
  );
}

function NowPlaying() {
  return (
    <Tile size="l" d={1} className="flex flex-col md:flex-row">
      <Caption title="Now Playing" glyph="note" className="order-2 p-7 md:order-1 md:w-[42%] md:self-end">
        Album art, controls and AirPlay, right under the camera.
      </Caption>
      <Screen tint="#f3dde3" className="order-1 flex flex-1 justify-center md:order-2 md:items-start">
        <MiniNotch width={300} height={150} top={22} bottom={30} solid={0.24} centered={false} className="md:mr-6">
          <div className="flex h-full items-end justify-center pb-[13px]">
            <Player scale={0.68} />
          </div>
        </MiniNotch>
      </Screen>
    </Tile>
  );
}

function QuickNotes() {
  return (
    <Tile size="l" d={0} className="flex flex-col md:flex-row">
      <Screen tint="#f6edc8" className="flex flex-1 flex-col items-center md:items-start md:pl-6">
        <MiniNotch width={300} height={112} top={22} bottom={28} solid={0.3} centered={false}>
          <div className="flex h-full flex-col justify-end px-5 pb-4">
            <span className="flex items-center gap-2 text-[11px] font-semibold text-white/60">
              <span className="pulse-dot h-2 w-2 rounded-full bg-[#ff453a]" /> Listening
            </span>
            <p className="mt-1.5 flex items-center text-[13.5px] leading-snug text-white">
              <span className="typing whitespace-nowrap">Call Sam about the launch</span>
              <span className="caret ml-0.5 inline-block h-[15px] w-[1.5px] bg-[#ffcc00]" />
            </p>
          </div>
        </MiniNotch>
        <div className="mt-5 flex items-center gap-1.5 pb-5 text-[12px] text-muted">
          hold <Keycap>⌃</Keycap><Keycap wide>space</Keycap>
        </div>
      </Screen>
      <Caption title="Quick Notes" glyph="mic" className="p-7 md:w-[42%] md:self-end">
        Hold ⌃ Space, talk or type. Saved to Apple Notes.
      </Caption>
    </Tile>
  );
}

function VoiceMemos() {
  const bars = [0.35, 0.7, 0.5, 1, 0.6, 0.85, 0.4, 0.75, 0.55, 0.9, 0.45, 0.65];
  return (
    <Tile size="m" d={2} className="flex flex-col">
      <Screen tint="#f6dcd6" className="flex-1 pb-4">
        <MiniNotch width={220} height={34} top={16} bottom={16}>
          <div className="flex h-full items-center justify-between px-3.5">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[#ff453a]" />
            <span className="flex h-4 items-center gap-[2.5px]">
              {bars.map((height, index) => (
                <span key={index} className="eq-bar w-[2.5px] rounded-full bg-[#ff6961]"
                  style={{ height: 16 * height, animationDelay: `${index * 0.09}s` }} />
              ))}
            </span>
            <span className="text-[12.5px] font-semibold tabular-nums text-white/85">0:07</span>
          </div>
        </MiniNotch>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-muted">
          <Keycap>⌃</Keycap><Keycap wide>space</Keycap> then <Keycap>V</Keycap>
        </div>
      </Screen>
      <Caption title="Voice Memos" glyph="memo" className="px-6 pb-6">
        Record straight into Apple's Voice Memos.
      </Caption>
    </Tile>
  );
}

function Pomodoro() {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  return (
    <Tile size="t" d={3} className="flex flex-col">
      <Screen tint="#f7dcd2" className="flex flex-1 flex-col items-center justify-center gap-4 py-6">
        <div className="relative h-[120px] w-[120px]">
          <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
            <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(229,83,75,0.18)" strokeWidth="9" />
            <circle cx="55" cy="55" r={radius} fill="none" stroke="#e5534b" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * 0.38} />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[22px] font-bold tabular-nums">15:32</span>
            <span className="label text-[9px] text-muted">Focus</span>
          </span>
        </div>
        <div className="flex gap-1.5 text-[11.5px] font-medium text-ink-soft">
          {["Brown", "Pink", "White"].map((noise, index) => (
            <span key={noise} className={`rounded-full px-2.5 py-1 ${index === 0 ? "bg-ink text-cream" : "bg-white/70"}`}>{noise}</span>
          ))}
        </div>
      </Screen>
      <Caption title="Pomodoro" glyph="tomato" className="px-6 pb-6">
        Focus sessions at the top of your screen.
      </Caption>
    </Tile>
  );
}

function Glance() {
  return (
    <Tile size="mw" d={0} className="flex flex-col">
      <Screen tint="#ebe1f2" className="flex-1">
        <MiniNotch width={272} height={52} top={16} bottom={20} solid={0.6}>
          <div className="flex h-full items-end justify-center gap-3.5 whitespace-nowrap pb-2 text-[11.5px] font-semibold text-white/85">
            <span className="flex items-center gap-1.5"><AppIcon name="timer" size={13} color="#f0a04b" />04:12</span>
            <span className="flex items-center gap-1.5"><AlbumArt size={13} />Golden Hour</span>
            <span className="flex items-center gap-1.5"><AppIcon name="globe" size={13} color="#64d2ff" />Ana 9:41</span>
          </div>
        </MiniNotch>
      </Screen>
      <Caption title="Glance" glyph="glance" className="px-6 pb-6">
        Hover the notch for what's happening now.
      </Caption>
    </Tile>
  );
}

function Devices() {
  return (
    <Tile size="mw" d={1} className="flex flex-col">
      <Screen tint="#dff1e3" className="flex-1">
        <MiniNotch width={230} height={34} top={16} bottom={16}>
          <div className="flex h-full items-center justify-between px-4">
            <AppIcon name="headphones" size={17} color="#f5f5f7" />
            <span className="flex items-center gap-1.5 text-[14px] font-semibold tabular-nums text-[#30d158]">
              82%
              <svg viewBox="0 0 20 20" className="h-4 w-4 -rotate-90" aria-hidden="true">
                <circle cx="10" cy="10" r="7.5" fill="none" stroke="rgba(48,209,88,0.25)" strokeWidth="2.6" />
                <circle cx="10" cy="10" r="7.5" fill="none" stroke="#30d158" strokeWidth="2.6" strokeLinecap="round"
                  strokeDasharray={47.1} strokeDashoffset={47.1 * 0.18} />
              </svg>
            </span>
          </div>
        </MiniNotch>
      </Screen>
      <Caption title="Device animations" glyph="headphones" className="px-6 pb-6">
        Your charger and headphones, greeted with their battery.
      </Caption>
    </Tile>
  );
}

function Tray() {
  return (
    <Tile size="mw" d={2} className="flex flex-col">
      <Screen tint="#dcedf5" className="flex-1">
        <MiniNotch width={250} height={64} top={16} bottom={22} solid={0.3}>
          <div className="grid h-full grid-cols-2 gap-2 px-3 pb-2.5 pt-5">
            {([["Tray", "tray"], ["AirDrop", "airdrop"]] as const).map(([label, glyph], index) => (
              <span key={label} className={`flex items-center justify-center gap-1.5 rounded-[10px] border border-dashed text-[11.5px] font-semibold text-white ${index === 0 ? "border-[#5ec8e5] bg-[#5ec8e5]/20" : "border-white/30"}`}>
                <AppIcon name={glyph} size={13} color="#fff" />{label}
              </span>
            ))}
          </div>
        </MiniNotch>
      </Screen>
      <Caption title="Tray & AirDrop" glyph="tray" className="px-6 pb-6">
        Drop files on the notch. Keep them or AirDrop them.
      </Caption>
    </Tile>
  );
}

export function Features() {
  return (
    <div className="mx-auto grid max-w-6xl grid-flow-row-dense grid-cols-2 gap-3 md:auto-rows-[124px] md:grid-cols-6 md:gap-4 lg:grid-cols-12">
      <LiveActivities />
      <NowPlaying />
      <Small glyph="grid" title="Library" d={1}>Every app, two keys away.</Small>
      <Small glyph="bolt" title="Apple Shortcuts" d={2}>Your shortcuts, one click away.</Small>
      <QuickNotes />
      <VoiceMemos />
      <Pomodoro />
      <Small glyph="mirror" title="Mirror" d={0}>Check yourself before a call.</Small>
      <Small glyph="light" title="Edge Light" d={1}>A soft light for video calls.</Small>
      <Small glyph="alarm" title="Alarms & Timer" d={2}>Right in the notch.</Small>
      <Glance />
      <Devices />
      <Tray />
      <Small glyph="sun" title="Volume & brightness" d={0}>A cleaner HUD.</Small>
      <Small glyph="lock" title="Lock screen" d={1}>Its own lock and unlock moment.</Small>
      <Small glyph="globe" title="Team clocks" d={2}>Your team's time at a glance.</Small>
      <Small glyph="haptics" title="Haptics" d={3}>Feel it on the trackpad.</Small>
      <Small glyph="present" title="Presentation mode" d={0}>Stays out of sight while you present.</Small>
      <Small glyph="sparkles" title="Welcome tour" d={1}>Set up in a minute.</Small>
      <Small glyph="droplet" title="Liquid Glass or solid" d={2}>Pick your look.</Small>
      <Small glyph="update" title="Updates itself" d={3}>Always the latest version.</Small>
    </div>
  );
}
