import { AlarmClock, AudioLines, Brain, Droplet, Eye, FileText, FlipHorizontal, Globe, Headphones, Inbox, KeyRound, LayoutGrid, Lightbulb, Lock, Mic, Music, Presentation, Radio, RefreshCw, Sparkle, Sparkles, Sun, Timer, Vibrate, Zap, type LucideIcon } from "lucide-react";

/**
 * The app's icons. In NotchOS they are SF Symbols in a circle of the app's colour (Pomodoro is
 * `brain.head.profile` in red, Shortcuts `bolt.fill` in indigo…). SF Symbols may only be used inside apps on
 * Apple platforms, so the site uses the closest open-source (MIT) Lucide symbol with the same colour.
 */
const icons = {
  alarm: { icon: AlarmClock, tint: "#FF9500" }, // Alarms: alarm.fill, orange
  timer: { icon: Timer, tint: "#FF9500" }, // Timer: timer, orange
  tomato: { icon: Brain, tint: "#FF3B30" }, // Pomodoro: brain.head.profile, red
  note: { icon: Music, tint: "#FF2D55" }, // Music: music.note, pink
  bolt: { icon: Zap, tint: "#5856D6" }, // Shortcuts: bolt.fill, indigo
  tray: { icon: Inbox, tint: "#32ADE6" }, // Tray: tray.and.arrow.down
  airdrop: { icon: Radio, tint: "#007AFF" }, // AirDrop: dot.radiowaves
  sun: { icon: Sun, tint: "#007AFF" }, // Volume & brightness HUD
  lock: { icon: Lock, tint: "#1C1C1E" }, // Lock screen
  file: { icon: FileText, tint: "#8E8E93" },
  key: { icon: KeyRound, tint: "#8E8E93" },
  headphones: { icon: Headphones, tint: "#34C759" }, // Device animations
  glance: { icon: Eye, tint: "#AF52DE" }, // Glance
  globe: { icon: Globe, tint: "#30B0C7" }, // Team clocks
  haptics: { icon: Vibrate, tint: "#8E8E93" }, // Haptic feedback
  present: { icon: Presentation, tint: "#1C1C1E" }, // Presentation mode
  mic: { icon: Mic, tint: "#FFCC00" }, // Quick Notes: mic, yellow like Notes
  memo: { icon: AudioLines, tint: "#FF3B30" }, // Voice Memos: waveform, red
  mirror: { icon: FlipHorizontal, tint: "#5AC8FA" }, // Mirror
  light: { icon: Lightbulb, tint: "#FFB340" }, // Edge Light
  sparkles: { icon: Sparkles, tint: "#AF52DE" }, // Welcome tour
  droplet: { icon: Droplet, tint: "#64D2FF" }, // Liquid Glass look
  grid: { icon: LayoutGrid, tint: "#8E8E93" }, // Library
  update: { icon: RefreshCw, tint: "#34C759" }, // Updates
  claude: { icon: Sparkle, tint: "#D97757" }, // Claude Code sessions
} satisfies Record<string, { icon: LucideIcon; tint: string }>;

export type IconName = keyof typeof icons;

export const iconTint = (name: IconName) => icons[name].tint;

/** The bare symbol. */
export function AppIcon({ name, size = 16, color = "currentColor", className = "" }: {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}) {
  const Icon = icons[name].icon;
  return <Icon size={size} color={color} strokeWidth={2.2} className={className} aria-hidden="true" />;
}

/** The symbol in a circle of its app colour, as the app shows it in the Library. */
export function AppIconTile({ name, size = 36 }: { name: IconName; size?: number }) {
  const tint = icons[name].tint;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: `linear-gradient(180deg, ${tint}, color-mix(in srgb, ${tint} 78%, black))` }}
    >
      <AppIcon name={name} size={Math.round(size * 0.5)} color="#fff" />
    </div>
  );
}
