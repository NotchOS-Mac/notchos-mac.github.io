import type { CSSProperties, ReactNode } from "react";

/**
 * Pieces of the notch drawn the way the app draws them, shared by the hero demo and the feature cards.
 * Everything that moves here moves by CSS transform/opacity (see index.css), never by layout.
 */

/** Album art: a warm sunset (`alt` is the next song's, a night sky). */
export function AlbumArt({ size, alt = false, flip = false }: { size: number; alt?: boolean; flip?: boolean }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${flip ? "art-flip" : ""}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: alt
          ? "linear-gradient(180deg,#27305e 0%,#5a4b8c 60%,#d58ba0 100%)"
          : "linear-gradient(180deg,#f7c58b 0%,#ef8c62 55%,#7d4b6b 100%)",
      }}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full">
        <circle cx={alt ? 32 : 24} cy={alt ? 15 : 24} r={alt ? 6 : 9} fill="#fff4d6" />
        <path d="M0 33 Q12 27 24 32 T48 31 V48 H0 Z" fill="#4b2d45" opacity="0.55" />
        <path d="M0 38 Q14 33 28 37 T48 36 V48 H0 Z" fill="#3a2236" opacity="0.75" />
      </svg>
    </div>
  );
}

/** Four bars dancing to the music (scaled, not resized, so they cost nothing to draw). */
export function Equalizer({ height = 20, color = "#f06b8b", bar = 4 }: { height?: number; color?: string; bar?: number }) {
  return (
    <div className="flex items-center" style={{ height, gap: bar * 0.8 }}>
      {[0, 0.25, 0.5, 0.15].map((delay, index) => (
        <span
          key={index}
          className="eq-bar rounded-full"
          style={{ width: bar, height, background: color, animationDelay: `${delay}s`, animationDuration: `${1.1 + index * 0.13}s` }}
        />
      ))}
    </div>
  );
}

/** ⏭ / ⏮ that slide like Apple Music's when a song is skipped (`loop`: every few seconds). */
export function SkipArrows({ size, forward = true, loop = false }: { size: number; forward?: boolean; loop?: boolean }) {
  const width = size * 0.78;
  const triangle: CSSProperties = {
    position: "absolute",
    top: 0,
    width,
    height: size,
    background: "currentColor",
    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
  };
  return (
    <span
      className={`relative inline-block ${loop ? "skip-loop" : ""}`}
      style={{ width: width * 1.62, height: size, transform: forward ? undefined : "scaleX(-1)" }}
      aria-hidden="true"
    >
      <span style={{ ...triangle, left: -width * 0.62, opacity: 0 }} />
      <span style={{ ...triangle, left: 0 }} />
      <span style={{ ...triangle, left: width * 0.62 }} />
    </span>
  );
}

export function PlayPause({ size, playing = true }: { size: number; playing?: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <rect x="5" y="3.5" width="4.6" height="17" rx="1.4" />
      <rect x="14.4" y="3.5" width="4.6" height="17" rx="1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M6 3.8v16.4a1 1 0 0 0 1.5.86l13.2-8.2a1 1 0 0 0 0-1.72L7.5 2.94A1 1 0 0 0 6 3.8z" />
    </svg>
  );
}

/** The favourite star (filled: in your favourites). */
export function Star({ size, filled = true }: { size: number; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4-4.7-4.4 6.4-.8z"
        fill={filled ? "#f4c542" : "none"}
        stroke={filled ? "#f4c542" : "rgba(255,255,255,0.85)"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** AirPlay for audio: rings above a triangle. */
export function AirPlay({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6.3 15.6a7.5 7.5 0 1 1 11.4 0" />
      <path d="M9.2 12.9a3.6 3.6 0 1 1 5.6 0" />
      <path d="M12 15.2l4.6 5.8H7.4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** The concave corner where the notch meets the top of the screen. */
export function Ear({ side, radius }: { side: "left" | "right"; radius: number }) {
  return (
    <span
      className="absolute top-0"
      style={{
        width: radius,
        height: radius,
        [side]: -radius + 0.5,
        background: `radial-gradient(circle at ${side === "left" ? "0 100%" : "100% 100%"}, transparent 70%, #000 71%)`,
      }}
    />
  );
}

/**
 * A small notch hanging from the top edge of whatever holds it, in the app's black-into-glass look.
 * `solid` is how far down (0…1) it stays fully black, like the camera's height in the app.
 */
export function MiniNotch({ width, height, top = 10, bottom = 14, solid = 1, centered = true, children, className = "", style }: {
  width: number;
  height: number;
  top?: number;
  bottom?: number;
  solid?: number;
  /** Centred in its row (off: placed by `className`/`style`). */
  centered?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`notch-glass relative ${centered ? "mx-auto" : ""} ${className}`}
      style={{
        width,
        height,
        borderBottomLeftRadius: bottom,
        borderBottomRightRadius: bottom,
        boxShadow: "0 12px 26px -14px rgba(0,0,0,0.55)",
        ["--solid" as string]: `${solid * 100}%`,
        ...style,
      }}
    >
      <Ear side="left" radius={top} />
      <Ear side="right" radius={top} />
      {children}
    </div>
  );
}

/**
 * The SVG filter that makes two black shapes melt together when they're close, like drops of liquid: blur,
 * then sharpen the alpha back to a hard edge. Used under the notch and its bubble.
 */
export function GooFilter({ id, blur = 5 }: { id: string; blur?: number }) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id={id} x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
      </filter>
    </svg>
  );
}
