import { useEffect } from "react";

/**
 * The page's scroll effects, with as little work per frame as possible:
 * - Browsers with scroll-driven animations reveal cards in CSS alone (`.reveal` in index.css). The rest get
 *   `.no-sda` on <html> and one IntersectionObserver that adds `.in` the first time a card shows.
 * - Looping animations inside cards (`[data-loop]`) pause while off screen, so the page idles when you're
 *   reading something else.
 */
export function useScrollEffects() {
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    if (!CSS.supports("animation-timeline: view()")) {
      document.documentElement.classList.add("no-sda");
      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("in");
            reveal.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      document.querySelectorAll(".reveal").forEach((element) => reveal.observe(element));
      observers.push(reveal);
    }

    const loops = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle("idle", !entry.isIntersecting);
    });
    document.querySelectorAll("[data-loop]").forEach((element) => {
      element.classList.add("idle");
      loops.observe(element);
    });
    observers.push(loops);

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);
}
