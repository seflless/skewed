import { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Camera,
  Color,
  Cylinder,
  DirectionalLight,
  Grid,
  Group,
  Scene,
  Sphere,
  Text,
  Vector3,
  Viewport,
  render,
} from "skewed";

function Axii(position: Vector3 = Vector3(0, 0, 0)) {
  // Half-size starter scene: keep the axii readable but smaller.
  const Axii_Thickness = 2;
  const Axii_Length = 50;
  const strokeWidth = 0.5;
  const Red = Color(255, 0, 0);
  const Green = Color(0, 255, 0);
  const Blue = Color(0, 0, 255);

  return Group({
    children: [
      Box({
        position: Vector3(Axii_Thickness / 2 + Axii_Length / 2, 0, 0).add(
          position
        ),
        width: Axii_Length,
        height: Axii_Thickness,
        depth: Axii_Thickness,
        fill: Red,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
      Box({
        position: Vector3(0, Axii_Thickness / 2 + Axii_Length / 2, 0).add(
          position
        ),
        width: Axii_Thickness,
        height: Axii_Length,
        depth: Axii_Thickness,
        fill: Green,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
      Box({
        position: Vector3(0, 0, Axii_Thickness / 2 + Axii_Length / 2).add(
          position
        ),
        width: Axii_Thickness,
        height: Axii_Thickness,
        depth: Axii_Length,
        fill: Blue,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
    ],
  });
}

function createIsometricCamera(zoom: number = 1) {
  const camera = Camera();
  const viewport: Viewport = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  function resize() {
    viewport.left = 0;
    viewport.top = 0;
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;

    camera.projectionMatrix.makeOrthographic(
      0,
      viewport.width / zoom,
      0,
      viewport.height / zoom,
      0,
      10000
    );
  }

  function updateCamera(rotationDegrees: number = 45, distance: number = 20) {
    const x = Math.sin((rotationDegrees / 180) * Math.PI) * distance;
    const z = Math.cos((rotationDegrees / 180) * Math.PI) * distance;

    const eye = Vector3(x, 20, z);
    camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
    camera.matrix.setPosition(eye.x, eye.y, eye.z);
  }

  resize();
  updateCamera();

  return { camera, viewport, updateCamera, resize };
}

export function SkewedStarterScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scene = useMemo<Scene>(() => {
    const directionalLight = DirectionalLight({
      // "Sun-like": from -X, from above, toward -Z.
      direction: Vector3(-1, -1, -1).normalize(),
      color: Color(255, 244, 214),
    });

    // Half-size spacing for the "behind it on -Z" stacking.
    const zOffsets = [0, -110, -190];
    const scales = [1, 0.5, 0.25] as const;

    const stroke = Color(0, 0, 0, 1);
    const strokeWidth = 3;

    // Put half of the shape groups on each side of the axii so everything fits in view.
    // (All 3 size variants share the same X; they step back along -Z.)
    const gap = 80;

    const shapes = [];

    // origin reference
    shapes.push(Axii(Vector3(0, 0, 0)));

    // --- Box (default size) ---
    {
      // Keep a 1:1:2 ratio for all variants (just pick which axis is the "2").
      // - biggest: tall (Y is 2x)
      // - next: long in X
      // - last: long in Z
      const unit = 60;
      const widths = [unit, unit * 2, unit];
      const heights = [unit * 2, unit, unit];
      const depths = [unit, unit, unit * 2];

      const x = -260;

      scales.forEach((scale, i) => {
        shapes.push(
          Box({
            id: `box-${scale}`,
            position: Vector3(x, (heights[i] * scale) / 2, zOffsets[i]),
            width: widths[i],
            height: heights[i],
            depth: depths[i],
            scale,
            fill: Color(255, 96, 96),
            stroke,
            strokeWidth,
          })
        );
      });
    }

    // --- Sphere (default size) ---
    {
      const radius = 35;
      const x = -110;

      scales.forEach((scale, i) => {
        shapes.push(
          Sphere({
            id: `sphere-${scale}`,
            position: Vector3(x, radius * scale, zOffsets[i]),
            radius,
            scale,
            fill: Color(255, 180, 64),
            stroke,
            strokeWidth,
          })
        );
      });
    }

    // --- Cylinder (default size) ---
    {
      const radius = 30;
      const height = 80;
      const x = 110;

      const rotations = [
        Vector3(0, 0, 0), // up (Y axis)
        Vector3(0, 0, -90), // axis along +X
        Vector3(90, 0, 0), // axis along +Z
      ];

      scales.forEach((scale, i) => {
        const isUpright = i === 0;
        const y = isUpright ? (height * scale) / 2 : radius * scale;

        shapes.push(
          Cylinder({
            id: `cylinder-${scale}`,
            position: Vector3(x, y, zOffsets[i]),
            radius,
            height,
            scale,
            rotation: rotations[i],
            fill: Color(140, 160, 255),
            stroke,
            strokeWidth,
          })
        );
      });
    }

    // --- Text (default size) ---
    {
      const fontSize = 60;
      const x = 260;

      scales.forEach((scale, i) => {
        shapes.push(
          Text({
            id: `text-${scale}`,
            text: "TEXT",
            position: Vector3(x, fontSize * 0.7 * scale, zOffsets[i]),
            fontSize,
            scale,
            fill: Color(220, 255, 220),
            stroke,
            strokeWidth,
          })
        );
      });
    }

    return {
      directionalLight,
      ambientLightColor: Color(64, 64, 120),
      shapes: [
        Grid({
          id: "background",
          rotation: Vector3(0, 0, 0),
          cellCount: 12,
          cellSize: 100,
          fill: Color(0, 0, 0, 0),
          stroke: Color(255, 255, 255, 0.15),
          strokeWidth: 2,
        }),
        ...shapes,
      ],
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Slight zoom-out so the full lineup fits comfortably across viewports.
    const { camera, viewport, updateCamera, resize } = createIsometricCamera(0.85);

    // Ensure a stable baseline view.
    updateCamera(45, 20);

    const paint = () => {
      render(container, scene, viewport, camera);
    };

    const onResize = () => {
      resize();
      paint();
    };

    paint();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [scene]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full overflow-hidden" />
      <div className="pointer-events-none absolute left-4 top-4 rounded border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-300 backdrop-blur">
        Dragging is not wired in this starter; the camera is default isometric.
      </div>
    </div>
  );
}


