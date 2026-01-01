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
  const Axii_Thickness = 4;
  const Axii_Length = 100;
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

    camera.matrix.makeTranslation(x, 20, z);
    const eye = Vector3(x, 20, z);
    camera.matrix[3] = eye.x;
    camera.matrix[7] = eye.y;
    camera.matrix[11] = eye.z;
    camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
  }

  resize();
  updateCamera();

  return { camera, viewport, updateCamera, resize };
}

export function SkewedStarterScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scene = useMemo<Scene>(() => {
    const directionalLight = DirectionalLight({
      direction: Vector3(-0.25, -1, -0.25).normalize(),
      color: Color(255, 252, 181),
    });

    const spacing = 260;

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

        // origin reference
        Axii(Vector3(0, 0, 0)),

        Box({
          id: "box",
          position: Vector3(-spacing, 60, 0),
          width: 120,
          height: 120,
          depth: 120,
          fill: Color(255, 96, 96),
          stroke: Color(0, 0, 0, 1),
          strokeWidth: 3,
        }),

        Sphere({
          id: "sphere",
          position: Vector3(0, 70, 0),
          radius: 70,
          fill: Color(255, 180, 64),
          stroke: Color(0, 0, 0, 1),
          strokeWidth: 3,
        }),

        Cylinder({
          id: "cylinder",
          position: Vector3(spacing, 80, 0),
          radius: 60,
          height: 160,
          fill: Color(140, 160, 255),
          stroke: Color(0, 0, 0, 1),
          strokeWidth: 3,
        }),

        Text({
          id: "text",
          text: "Skewed",
          position: Vector3(0, 230, -spacing),
          fontSize: 110,
          scale: 1,
          fill: Color(220, 255, 220),
          stroke: Color(0, 0, 0, 1),
          strokeWidth: 3,
        }),

        // a small group example (optional, but useful for showcasing hierarchy)
        Group({
          id: "group",
          position: Vector3(-spacing, 0, -spacing),
          children: [
            Sphere({
              id: "group-sphere",
              position: Vector3(0, 40, 0),
              radius: 40,
              fill: Color(255, 255, 255),
              stroke: Color(0, 0, 0, 1),
              strokeWidth: 2,
            }),
            Box({
              id: "group-box",
              position: Vector3(90, 30, 0),
              width: 60,
              height: 60,
              depth: 60,
              fill: Color(255, 255, 255),
              stroke: Color(0, 0, 0, 1),
              strokeWidth: 2,
            }),
          ],
        }),
      ],
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { camera, viewport, updateCamera, resize } = createIsometricCamera(1);

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
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute left-4 top-4 rounded border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-300 backdrop-blur">
        Dragging is not wired in this starter; the camera is default isometric.
      </div>
    </div>
  );
}


