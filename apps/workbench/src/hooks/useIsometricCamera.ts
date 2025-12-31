import * as React from "react";
import { Camera, Vector3 } from "@skewed/core";
import type { Viewport } from "@skewed/core";

export function useIsometricCamera(viewport: Viewport, zoom: number = 1) {
  const camera = React.useMemo(() => Camera(), []);

  // Keep projection matrix always up-to-date *synchronously* (old workbench behavior),
  // so we never render with an uninitialized/degenerate projection.
  camera.projectionMatrix.makeOrthographic(
    0,
    Math.max(1, viewport.width) / zoom,
    0,
    Math.max(1, viewport.height) / zoom,
    0,
    10000
  );

  const updateCamera = React.useCallback(
    (rotationDegrees: number, distance: number = 20) => {
      const x = Math.sin((rotationDegrees / 180) * Math.PI) * distance;
      const z = Math.cos((rotationDegrees / 180) * Math.PI) * distance;
      camera.matrix.makeTranslation(x, 20, z);
      const eye = Vector3(x, 20, z);
      camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
    },
    [camera]
  );

  return { camera, updateCamera };
}


