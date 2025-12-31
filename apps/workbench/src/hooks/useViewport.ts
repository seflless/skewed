import * as React from "react";
import type { Viewport } from "@skewed/core";

export function useViewport(): Viewport {
  const [vp, setVp] = React.useState<Viewport>(() => ({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  React.useEffect(() => {
    const onResize = () => {
      setVp({
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return vp;
}


