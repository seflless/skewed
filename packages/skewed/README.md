# Skewed

Skewed is a **React-first SVG 3D renderer**. It lets you build a small “scene graph” of 3D-ish primitives (boxes, spheres, cylinders, text, meshes, etc.) and renders it into **SVG** with simple lighting + orthographic projection.

It also supports rendering real React DOM “inside” the scene via an `<Html>` component (implemented with SVG `<foreignObject>`), so DOM content can participate in the draw order.

<p>
  <img width="49%" src="https://raw.githubusercontent.com/seflless/skewed/main/old/docs/images/octopus.gif" />
  <img width="49%" src="https://raw.githubusercontent.com/seflless/skewed/main/old/docs/images/worm.gif" />
</p>
<p>
  <img width="49%" src="https://raw.githubusercontent.com/seflless/skewed/main/old/docs/images/rotating-text.gif" />
  <img width="49%" src="https://raw.githubusercontent.com/seflless/skewed/main/old/docs/images/light-spinning-around-shapes.gif" />
</p>

## Install

```bash
npm install skewed
```

`skewed` has **peer dependencies** on `react` and `react-dom`.

## Quickstart (React)

```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  Skewed,
  AmbientLight,
  DirectionalLight,
  Box,
  Axii,
  Camera,
  Vector3,
  Color,
} from "skewed";
import type { Viewport } from "skewed";

function App() {
  const viewport: Viewport = { left: 0, top: 0, width: 900, height: 600 };

  const camera = React.useMemo(() => {
    const c = Camera();
    c.projectionMatrix.makeOrthographic(0, viewport.width, 0, viewport.height, 0, 10000);
    const eye = Vector3(20, 20, 20);
    c.matrix.makeTranslation(eye.x, eye.y, eye.z);
    c.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
    return c;
  }, []);

  return (
    <Skewed camera={camera} viewport={viewport} style={{ width: viewport.width, height: viewport.height }}>
      <AmbientLight color={Color(64, 64, 64)} />
      <DirectionalLight direction={Vector3(-0.25, -1, -0.25).normalize()} color={Color(255, 252, 255)} />

      <Axii />

      <Box
        position={Vector3(40, 0, 0)}
        width={120}
        height={80}
        depth={80}
        fill={Color(255, 180, 0)}
        stroke={Color(0, 0, 0)}
        strokeWidth={2}
      />
    </Skewed>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
```

## `<Html>` (DOM in the scene)

```tsx
import { Html, Vector3 } from "skewed";

export function Label() {
  return (
    <Html position={Vector3(0, 40, 0)} width={220} height={80}>
      <div style={{ background: "white", border: "2px solid black", borderRadius: 8, padding: 8 }}>
        Hello from &lt;Html&gt;
      </div>
    </Html>
  );
}
```

## Core API (optional)

The package also exposes the “core” (math/meshes/renderer/etc.) under a namespace:

```ts
import { core } from "skewed";

const v = core.Vector3(1, 2, 3);
```


