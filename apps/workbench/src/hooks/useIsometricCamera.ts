import * as React from "react";
import { Camera, Vector3 } from "@skewed/core";
import type { Viewport } from "@skewed/core";

export function useIsometricCamera(viewport: Viewport, zoom: number = 1) {
  const camera = React.useMemo(() => Camera(), []);

  React.useEffect(() => {
    camera.projectionMatrix.makeOrthographic(
      0,
      viewport.width / zoom,
      0,
      viewport.height / zoom,
      0,
      10000
    );
  }, [camera, viewport.width, viewport.height, zoom]);

  const updateCamera = React.useCallback(
    (rotationDegrees: number, distance: number = 20) => {
      const x = Math.sin((rotationDegrees / 180) * Math.PI) * distance;
      const z = Math.cos((rotationDegrees / 180) * Math.PI) * distance;
      camera.matrix.makeTranslation(x, 20, z);
      const eye = Vector3(x, 20, z);
      camera.matrix.elements[3] = eye.x;
      camera.matrix.elements[7] = eye.y;
      camera.matrix.elements[11] = eye.z;
      camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
    },
    [camera]
  );

  return { camera, updateCamera };
}


