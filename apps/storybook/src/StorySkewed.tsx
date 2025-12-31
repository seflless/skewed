import * as React from "react";
import { Camera, Vector3 } from "@skewed/core";
import type { Viewport } from "@skewed/core";
import { Skewed } from "@skewed/react";

export function StorySkewed(props: { children: React.ReactNode; width?: number; height?: number }) {
  const width = props.width ?? 600;
  const height = props.height ?? 400;
  const viewport: Viewport = { left: 0, top: 0, width, height };

  const camera = React.useMemo(() => {
    const c = Camera();
    c.projectionMatrix.makeOrthographic(0, width, 0, height, 0, 10000);
    const eye = Vector3(20, 20, 20);
    c.matrix.elements[3] = eye.x;
    c.matrix.elements[7] = eye.y;
    c.matrix.elements[11] = eye.z;
    c.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
    return c;
  }, [width, height]);

  return (
    <Skewed
      camera={camera}
      viewport={viewport}
      style={{ width, height, border: "1px solid #ddd", background: "#e1e1e1" }}
    >
      {props.children}
    </Skewed>
  );
}


