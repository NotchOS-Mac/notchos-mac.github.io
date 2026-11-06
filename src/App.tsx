import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";
import { NotchDemo } from "./components/NotchDemo";
import { AppIcon, AppIconTile, type IconName } from "./components/AppIcon";
import { DownloadCount } from "./components/DownloadCount";
import { Intro } from "./components/Intro";
import { ScaleWords, ScrollNotch, TiltOnScroll, WakeNotch, useRecede, wake } from "./components/Motion";
import { introPlays, useHandoff, useIntroDone } from "./lib/intro";
import { site } from "./site";

const reveal = {
  initial: { opacity: 0, y: 28, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { type: "spring", stiffness: 170, damping: 24 },
} as const;

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="overflow-x-hidden">
      <Intro />
      <ScrollNotch />
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
    </MotionConfig>
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
  // The hero wakes up as the intro flies into the screen, then recedes gently as you scroll on.
  const ready = useIntroDone();
  const landed = useHandoff();
  // With the opening film, the title and MacBook arrive from the film itself and take over in place.
  const filmed = introPlays();
  const recede = useRecede();
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 18, scale: 0.96 },
    animate: ready ? { opacity: 1, y: 0, scale: 1 } : undefined,
    transition: { ...wake, delay },
  });

  return (
    <section ref={recede.ref} className="px-5 pb-24 pt-16 md:pt-24">
      <motion.div style={recede.style} className="mx-auto max-w-3xl text-center">
        {/* The badge pops like the Dynamic Island: a dot that springs open into a pill. */}
        <motion.span
          className="label glass inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-3.5 py-1.5 text-[10px] text-ink-soft"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber" /> for MacBooks with a notch
        </motion.span>
        <h1 id="hero-title" className="mt-7 text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[76px]">
          {filmed ? (
            // The film's title glides here and lands exactly on these words; they appear the instant it does.
            <span style={{ opacity: landed ? 1 : 0 }}>
              The notch
              <br />
              <span className="text-ink-soft">just woke up.</span>
            </span>
          ) : (
            <>
              <ScaleWords text="The notch" start={ready} delay={0.15} />
              <br />
              <ScaleWords text="just woke up." start={ready} delay={0.4} className="text-ink-soft" />
            </>
          )}
        </h1>
        <motion.p {...show(0.75)} className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft md:text-[19px]">
          NotchOS turns the black cut-out at the top of your MacBook into a live surface for music, timers, files and
          shortcuts. It springs open when you need it and disappears when you don't.
        </motion.p>
        <motion.div {...show(0.9)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href={site.downloadURL} className="rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-cream shadow-[0_12px_30px_-12px_rgba(23,21,15,0.7)] transition-transform hover:scale-[1.03]">
            Download for Mac
          </a>
          <a href="#pricing" className="glass rounded-full px-7 py-3.5 text-[15px] font-medium transition-transform hover:scale-[1.03]">
            Get Pro · {site.proPrice}
          </a>
        </motion.div>
        <motion.p {...show(1.05)} className="pixel mt-5 text-[10px] text-muted">Free · {site.trialDays}-day Pro trial · {site.requirements}</motion.p>
        <motion.p {...show(1.15)} className="mt-3 text-[13px] font-medium text-ink-soft">🎁 {site.launchOffer}</motion.p>
      </motion.div>

      {/* The MacBook rises in last, then tilts up to face you as you scroll to it. */}
      <motion.div
        id="hero-demo"
        className="mt-16"
        initial={filmed ? { opacity: 0 } : { opacity: 0, y: 70 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        // Filmed: a crossfade with the film's MacBook as it settles here. Otherwise it rises in last.
        transition={filmed ? { delay: 0.6, duration: 0.55 } : { ...wake, delay: 1.1 }}
      >
        <TiltOnScroll>
          <NotchDemo />
        </TiltOnScroll>
      </motion.div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.div {...reveal} className="mx-auto mb-12 max-w-2xl text-center">
      <p className="label text-[10px] text-muted">{eyebrow}</p>
      <motion.h2
        className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.03em] md:text-[48px]"
        initial={{ opacity: 0, scale: 0.86, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ ...wake, delay: 0.08 }}
      >
        {title}
      </motion.h2>
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

function CardText({ glyph, title, children }: { glyph: IconName; title: string; children: ReactNode }) {
  return (
    <>
      <AppIconTile name={glyph} size={38} />
      <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{children}</p>
    </>
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
            <WakeNotch width={250} height={34}>
              <AppIcon name="timer" size={16} color="#f0a04b" />
              <span className="font-mono text-[14px] font-bold text-[#f0a04b]">12:04</span>
            </WakeNotch>
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
            Focus and break cycles counting down at the top of your screen, with optional brown, pink or white noise to
            focus by.
          </CardText>
        </Card>

        <Card className="md:col-span-3">
          <div className="-mx-7 -mt-7 mb-7 bg-gradient-to-b from-[#ebe1f2] to-transparent pb-6">
            <WakeNotch width={210} height={50}>
              <span className="mb-2 flex w-full items-center justify-center gap-4 self-end text-[12px] font-semibold text-white/85">
                <span className="flex items-center gap-1.5"><AppIcon name="timer" size={13} color="#f0a04b" />04:12</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-gradient-to-b from-[#f7c58b] to-[#7d4b6b]" />Golden Hour</span>
              </span>
            </WakeNotch>
          </div>
          <CardText glyph="glance" title="Glance">
            Rest the pointer on the notch and a quiet row grows out under it: your timer counting down, the song playing,
            your team's local time. It only shows. Clicking still opens the Library.
          </CardText>
        </Card>

        <Card className="md:col-span-3">
          <div className="-mx-7 -mt-7 mb-7 bg-gradient-to-b from-[#dff1e3] to-transparent pb-6">
            <WakeNotch width={250} height={34}>
              <AppIcon name="headphones" size={16} color="#f5f5f7" />
              <span className="text-[14px] font-semibold text-[#30d158]">82%</span>
            </WakeNotch>
          </div>
          <CardText glyph="headphones" title="Device animations">
            Plug in the charger, or connect AirPods, earbuds or a speaker, and the notch greets it once with its logo and
            battery. It waits its turn and never covers what you're doing.
          </CardText>
        </Card>

        <Card className="md:col-span-2">
          <CardText glyph="globe" title="Team clocks">
            Add the people you work with and their local time sits in the glance, so you know when to message.
          </CardText>
        </Card>

        <Card className="md:col-span-2">
          <CardText glyph="haptics" title="A notch you can feel">
            A light tap from the trackpad when the glance opens, a song flicks by or a device connects.
          </CardText>
        </Card>

        <Card className="md:col-span-2">
          <CardText glyph="present" title="Presentation mode">
            Mirroring to a projector or TV? The glance and album art step aside until you're done.
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

function Keycap({ children, wide = false, press = 0 }: { children: ReactNode; wide?: boolean; press?: number }) {
  return (
    <motion.span
      initial={{ y: 0 }}
      whileInView={{ y: [0, 5, 0] }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ delay: 0.5 + press * 0.32, duration: 0.32, times: [0, 0.35, 1] }}
      className={`inline-flex h-16 items-center justify-center rounded-2xl border border-white bg-gradient-to-b from-white to-[#efe8dc] text-[22px] font-medium text-ink shadow-[0_2px_0_#d9cfbf,0_10px_20px_-10px_rgba(60,45,20,0.35)] ${wide ? "w-44" : "w-16"}`}
    >
      {children}
    </motion.span>
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
        <Keycap press={0}>⌃</Keycap>
        <span className="text-[22px] text-muted">+</span>
        <Keycap wide press={0.15}>space</Keycap>
        <span className="text-[22px] text-muted">→</span>
        <Keycap press={1.2}>T</Keycap>
        <div className="w-full" />
        <div className="label mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-muted">
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
          <AppIcon name="lock" size={30} color="#f6f1e8" />
        </div>
        <div>
          <h3 className="text-[26px] font-semibold tracking-[-0.02em]">Runs on your Mac. Sends nothing.</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-cream/65">
            No account, no analytics, no servers. NotchOS asks only for what a feature needs, like Accessibility for the
            volume keys, and works without the rest. Presentation mode keeps your songs out of sight while you mirror
            your screen.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

const free = ["The notch and volume / brightness HUD", "Lock screen moments", "Library with Alarms and Timer", "Haptics and presentation mode", "Liquid Glass or solid look"];
const pro = ["Now Playing with album art and controls", "Glance with team clocks", "Device animations: charger, AirPods, speakers", "Pomodoro with focus sounds", "Tray & AirDrop", "Apple Shortcuts", "Keyboard shortcuts"];

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-28 px-5 py-24">
      <SectionHeading eyebrow="Pricing" title="Free to keep. Pro to go further.">
        Try every Pro feature free for {site.trialDays} days. One payment, no subscription.
      </SectionHeading>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
        <PriceCard name="Free" price="$0" note="Forever" items={free} cta="Download" href={site.downloadURL} />
        <PriceCard name="Pro" price={site.proPrice} note="One-time" items={pro} cta="Request a licence" href={site.buyURL} highlight
          offer={site.launchOffer}
          footnote="Easiest from the app: Settings → License → Email Licence Request. Your Mac ID is filled in for you." />
      </div>
    </section>
  );
}

function PriceCard({ name, price, note, items, cta, href, highlight = false, footnote, offer }: {
  name: string;
  price: string;
  note: string;
  items: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  footnote?: string;
  offer?: string;
}) {
  return (
    <motion.div {...reveal} className={`glass relative flex flex-col rounded-[32px] p-8 ${highlight ? "ring-2 ring-ink/80" : ""}`}>
      {highlight && <span className="pixel absolute right-6 top-6 rounded-full bg-ink px-3 py-1 text-[9px] text-cream">{site.trialDays}-day trial</span>}
      <p className="text-[15px] font-medium text-ink-soft">{name}</p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-[52px] font-semibold tracking-[-0.04em]">{price}</span>
        <span className="label text-[10px] text-muted">{note}</span>
      </p>
      {offer && (
        <p className="mt-4 rounded-2xl bg-[#e9973c]/15 px-4 py-3 text-[14px] font-medium leading-snug text-ink">
          🎁 {offer}
        </p>
      )}
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
  { q: "What permissions does it need?", a: "Accessibility, to show the volume and brightness HUD; permission to read Music or Spotify for album art; and Bluetooth, to greet your headphones with their battery. Everything else works without them." },
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
        <p className="label text-[10px]">Made for the top of your screen</p>
        <a href={`mailto:${site.supportEmail}`} className="hover:text-ink">Support</a>
      </div>
      <DownloadCount />
    </footer>
  );
}
