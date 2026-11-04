import { motion } from "motion/react";
import type { ReactNode } from "react";
import { NotchDemo } from "./components/NotchDemo";
import { PixelIcon, type GlyphName } from "./components/PixelIcon";
import { site } from "./site";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const;

export default function App() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Keyboard />
        <Privacy />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
        <a href="#" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">{site.name}</span>
        </a>
        <div className="hidden items-center gap-7 text-[14px] text-ink-soft md:flex">
          <a href="#features" className="transition-colors hover:text-ink">Features</a>
          <a href="#keyboard" className="transition-colors hover:text-ink">Keyboard</a>
          <a href="#pricing" className="transition-colors hover:text-ink">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-ink">FAQ</a>
        </div>
        <a href={site.downloadURL} className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-cream transition-transform hover:scale-[1.03]">
          Download
        </a>
      </nav>
    </header>
  );
}

function Logo() {
  // The app icon has transparent padding around its squircle; scale it up so the squircle fills the slot.
  return (
    <span className="relative block h-7 w-7 overflow-visible" aria-hidden="true">
      <img src="/notchos-icon.svg" alt="" className="absolute -inset-[3px] h-[calc(100%+6px)] w-[calc(100%+6px)] max-w-none" />
    </span>
  );
}

function Hero() {
  return (
    <section className="px-5 pb-24 pt-16 md:pt-24">
      <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
        <span className="pixel glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] text-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" /> for MacBooks with a notch
        </span>
        <h1 className="mt-7 text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[76px]">
          The notch,
          <br />
          <span className="text-ink-soft">finally useful.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft md:text-[19px]">
          NotchOS turns the black cut-out at the top of your MacBook into a live surface for music, timers, files and
          shortcuts. It springs open when you need it and disappears when you don't.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href={site.downloadURL} className="rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-cream shadow-[0_12px_30px_-12px_rgba(23,21,15,0.7)] transition-transform hover:scale-[1.03]">
            Download for Mac
          </a>
          <a href="#pricing" className="glass rounded-full px-7 py-3.5 text-[15px] font-medium transition-transform hover:scale-[1.03]">
            Get Pro · {site.proPrice}
          </a>
        </div>
        <p className="pixel mt-5 text-[10px] text-muted">Free · {site.trialDays}-day Pro trial · {site.requirements}</p>
      </motion.div>

      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="mt-16">
        <NotchDemo />
      </motion.div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.div {...reveal} className="mx-auto mb-12 max-w-2xl text-center">
      <p className="pixel text-[10px] text-muted">{eyebrow}</p>
      <h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.03em] md:text-[48px]">{title}</h2>
      {children && <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{children}</p>}
    </motion.div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div {...reveal} className={`glass overflow-hidden rounded-[30px] p-7 ${className}`}>
      {children}
    </motion.div>
  );
}

function CardText({ glyph, title, children }: { glyph: GlyphName; title: string; children: ReactNode }) {
  return (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink">
        <PixelIcon name={glyph} size={18} color="#f6f1e8" />
      </div>
      <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{children}</p>
    </>
  );
}

/** A small black notch used inside feature cards. */
function MiniNotch({ width, height, children }: { width: number; height: number; children?: ReactNode }) {
  return (
    <div className="mx-auto flex justify-center">
      <div className="flex items-center justify-between bg-black px-4" style={{ width, height, borderRadius: `0 0 ${Math.min(height / 2, 26)}px ${Math.min(height / 2, 26)}px` }}>
        {children}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-28 px-5 py-24">
      <SectionHeading eyebrow="What it does" title={<>Everything lives<br />where you already look.</>}>
        One engine decides what the notch shows, so a song, a timer and a volume change never collide.
      </SectionHeading>

      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-6">
        <Card className="md:col-span-4">
          <div className="-mx-7 -mt-7 mb-7 bg-gradient-to-b from-[#efe3d1] to-transparent pb-6">
            <MiniNotch width={250} height={34}>
              <PixelIcon name="timer" size={16} color="#f0a04b" />
              <span className="font-mono text-[14px] font-bold text-[#f0a04b]">12:04</span>
            </MiniNotch>
          </div>
          <CardText glyph="timer" title="Live Activities">
            A running timer, a song or a snoozed alarm stays live beside the camera. Two at once share the notch, and a
            tap expands either one.
          </CardText>
        </Card>

        <Card className="md:col-span-2">
          <CardText glyph="note" title="Now Playing">
            Real album art that flips on a new song, a progress bar you can drag, and a two-finger swipe to skip.
          </CardText>
        </Card>

        <Card className="md:col-span-2">
          <CardText glyph="tray" title="Tray & AirDrop">
            Drag a file up to the notch. Keep it in the Tray for later, or AirDrop it in one move.
          </CardText>
        </Card>

        <Card className="md:col-span-2">
          <CardText glyph="bolt" title="Apple Shortcuts">
            Your shortcuts one click away, grouped in their own app or pinned to the Library.
          </CardText>
        </Card>

        <Card className="md:col-span-2">
          <CardText glyph="tomato" title="Pomodoro">
            Focus and break cycles with a quiet chime, counting down right at the top of your screen.
          </CardText>
        </Card>

        <Card className="md:col-span-3">
          <CardText glyph="sun" title="Volume & brightness">
            A clean notch HUD replaces the big system overlay, so changes never cover what you're reading.
          </CardText>
        </Card>

        <Card className="md:col-span-3">
          <CardText glyph="lock" title="Lock screen">
            A lock and unlock moment of its own, and the notch stays glued to the top edge through the animation.
          </CardText>
        </Card>
      </div>
    </section>
  );
}

function Keycap({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <span
      className={`inline-flex h-16 items-center justify-center rounded-2xl border border-white bg-gradient-to-b from-white to-[#efe8dc] text-[22px] font-medium text-ink shadow-[0_2px_0_#d9cfbf,0_10px_20px_-10px_rgba(60,45,20,0.35)] ${wide ? "w-44" : "w-16"}`}
    >
      {children}
    </span>
  );
}

function Keyboard() {
  return (
    <section id="keyboard" className="scroll-mt-28 px-5 py-24">
      <SectionHeading eyebrow="Fast" title="Two keys to anything.">
        Press ⌃ Space from any app to open the Library, then one letter to jump straight in. Rebind every key in
        Settings.
      </SectionHeading>
      <motion.div {...reveal} className="glass mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 rounded-[34px] px-6 py-12">
        <Keycap>⌃</Keycap>
        <span className="text-[22px] text-muted">+</span>
        <Keycap wide>space</Keycap>
        <span className="text-[22px] text-muted">→</span>
        <Keycap>T</Keycap>
        <div className="w-full" />
        <div className="pixel mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-muted">
          <span>T · Timer</span>
          <span>A · Alarms</span>
          <span>P · Pomodoro</span>
          <span>M · Music</span>
          <span>S · Shortcuts</span>
        </div>
      </motion.div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="px-5 py-12">
      <motion.div {...reveal} className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[34px] bg-ink px-8 py-14 text-center text-cream md:flex-row md:text-left">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <PixelIcon name="lock" size={30} color="#f6f1e8" />
        </div>
        <div>
          <h3 className="text-[26px] font-semibold tracking-[-0.02em]">Runs on your Mac. Sends nothing.</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-cream/65">
            No account, no analytics, no servers. NotchOS asks only for what a feature needs, like Accessibility for the
            volume keys, and works without the rest.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

const free = ["The notch and volume / brightness HUD", "Lock screen moments", "Library with Alarms and Timer", "Liquid Glass or solid look"];
const pro = ["Now Playing with album art and controls", "Pomodoro", "Tray & AirDrop", "Apple Shortcuts", "Keyboard shortcuts"];

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-28 px-5 py-24">
      <SectionHeading eyebrow="Pricing" title="Free to keep. Pro to go further.">
        Try every Pro feature free for {site.trialDays} days. One payment, no subscription.
      </SectionHeading>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
        <PriceCard name="Free" price="$0" note="Forever" items={free} cta="Download" href={site.downloadURL} />
        <PriceCard name="Pro" price={site.proPrice} note="One-time" items={pro} cta="Request a licence" href={site.buyURL} highlight
          footnote="Easiest from the app: Settings → License → Email Licence Request. Your Mac ID is filled in for you." />
      </div>
    </section>
  );
}

function PriceCard({ name, price, note, items, cta, href, highlight = false, footnote }: {
  name: string;
  price: string;
  note: string;
  items: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  footnote?: string;
}) {
  return (
    <motion.div {...reveal} className={`glass relative flex flex-col rounded-[32px] p-8 ${highlight ? "ring-2 ring-ink/80" : ""}`}>
      {highlight && <span className="pixel absolute right-6 top-6 rounded-full bg-ink px-3 py-1 text-[9px] text-cream">{site.trialDays}-day trial</span>}
      <p className="text-[15px] font-medium text-ink-soft">{name}</p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-[52px] font-semibold tracking-[-0.04em]">{price}</span>
        <span className="pixel text-[10px] text-muted">{note}</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] text-ink-soft">
            <span className="mt-[7px] h-2 w-2 shrink-0 bg-ink" />
            {item}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={`mt-8 rounded-full py-3.5 text-center text-[15px] font-medium transition-transform hover:scale-[1.02] ${
          highlight ? "bg-ink text-cream" : "border border-ink/15 bg-white/60"
        }`}
      >
        {cta}
      </a>
      {footnote && <p className="mt-3 text-center text-[12.5px] leading-relaxed text-muted">{footnote}</p>}
    </motion.div>
  );
}

const faqs: { q: string; a: string }[] = [
  { q: "macOS says it can’t verify the developer. Is that OK?", a: "Yes. NotchOS isn’t notarized by Apple yet, so the first time you open it, go to System Settings → Privacy & Security and click Open Anyway next to NotchOS. After that it opens normally." },
  { q: "Which Macs does it work on?", a: `MacBooks with a notch running macOS 14 or later. On other displays NotchOS draws a virtual notch.` },
  { q: "How do I open it the first time?", a: "Right-click NotchOS in Applications and choose Open, or allow it in System Settings → Privacy & Security. You only do this once." },
  { q: "What permissions does it need?", a: "Accessibility, to show the volume and brightness HUD, and permission to read Music or Spotify for album art. Everything else works without them." },
  { q: "How does the Pro licence work?", a: `Every Pro feature is free for ${site.trialDays} days. To get Pro, open Settings → License and click Email Licence Request: it sends your Mac ID to ${site.licenseEmail}. Your licence key comes back by reply; paste it in Settings → License.` },
];

function FAQ() {
  return (
    <section id="faq" className="scroll-mt-28 px-5 py-24">
      <SectionHeading eyebrow="Questions" title="Good to know." />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((item) => (
          <motion.details key={item.q} {...reveal} className="glass group rounded-[24px] px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-medium">
              {item.q}
              <span className="ml-4 text-[22px] text-muted transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
          </motion.details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 pb-12 pt-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 border-t border-line pt-8 text-[13px] text-muted md:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span>© 2026 {site.name}</span>
        </div>
        <p className="pixel text-[10px]">Made for the top of your screen</p>
        <a href={`mailto:${site.supportEmail}`} className="hover:text-ink">Support</a>
      </div>
    </footer>
  );
}
