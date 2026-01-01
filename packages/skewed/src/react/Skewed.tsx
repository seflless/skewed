import * as React from "react";
import type { SkewedRootProps } from "./types";
import { createSkewedContainer } from "./reconciler/SkewedReconciler";

export function Skewed(props: SkewedRootProps) {
  const { camera, viewport, style, className, children } = props;
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const reconcilerRef = React.useRef<ReturnType<
    typeof createSkewedContainer
  > | null>(null);

  React.useEffect(() => {
    if (!hostRef.current) return;
    reconcilerRef.current = createSkewedContainer(
      hostRef.current,
      camera,
      viewport,
    );
    return () => {
      const rec = reconcilerRef.current;
      if (rec) {
        rec.reconciler.updateContainer(null, rec.root, null, () => {});
      }
      reconcilerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const rec = reconcilerRef.current;
    if (!rec) return;
    if (camera) rec.hostContainer.camera = camera;
    if (viewport) rec.hostContainer.viewport = viewport;
    rec.reconciler.updateContainer(children, rec.root, null, () => {});
  }, [children, camera, viewport]);

  return <div ref={hostRef} className={className} style={style} />;
}
