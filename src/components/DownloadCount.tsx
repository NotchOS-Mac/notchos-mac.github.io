import { useEffect, useState } from "react";

/** Releases repo whose DMG downloads are counted (GitHub counts every asset download). */
const RELEASES_API = "https://api.github.com/repos/NotchOS-Mac/NotchOS-releases/releases?per_page=100";

type Release = { assets?: { download_count?: number }[] };

/** "1,234 downloads so far", quietly; renders nothing until GitHub answers, or if it can't. */
export function DownloadCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(RELEASES_API, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((releases: Release[]) => {
        const total = releases.reduce(
          (sum, release) => sum + (release.assets ?? []).reduce((s, asset) => s + (asset.download_count ?? 0), 0),
          0,
        );
        if (total > 0) setCount(total);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (count === null) return null;
  return (
    <p className="mt-6 text-center text-[11px] tracking-wide text-muted/70">
      {count.toLocaleString("en-US")} downloads so far
    </p>
  );
}
