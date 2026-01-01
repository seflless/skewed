import * as React from "react";

export function useRafTime(paused: boolean) {
  const [now, setNow] = React.useState(0);
  const lastRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    let raf = 0;
    const loop = (tMs: number) => {
      raf = requestAnimationFrame(loop);
      if (paused) {
        lastRef.current = null;
        return;
      }
      const t = tMs / 1000;
      if (lastRef.current == null) lastRef.current = t;
      const delta = t - lastRef.current;
      lastRef.current = t;
      setNow((prev) => prev + delta);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return now;
}
