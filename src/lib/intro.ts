import { useEffect, useState } from "react";

/**
 * Signals shared by the opening film and the page, so the two play as one continuous shot:
 * - `plays`: whether the film runs this visit (decided before the page first renders).
 * - `ready`: the camera starts pulling back; the page's chrome fades in around the scene.
 * - `handoff`: the film's title and MacBook have landed on the page's own; the film is gone.
 * When the film doesn't play (seen this visit, or reduced motion), `ready` and `handoff` fire at once.
 */
function signal() {
  let fired = false;
  const listeners = new Set<() => void>();
  return {
    fire() {
      if (fired) return;
      fired = true;
      listeners.forEach((listener) => listener());
      listeners.clear();
    },
    use(): boolean {
      const [isFired, setFired] = useState(fired);
      useEffect(() => {
        if (fired) return setFired(true);
        const listener = () => setFired(true);
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      }, []);
      return isFired;
    },
  };
}

const ready = signal();
const handoff = signal();
let plays = false;

export const setIntroPlays = (value: boolean) => {
  plays = value;
};
export const introPlays = () => plays;

export const markIntroDone = () => ready.fire();
export const useIntroDone = () => ready.use();

export const markHandoff = () => {
  ready.fire();
  handoff.fire();
};
export const useHandoff = () => handoff.use();
