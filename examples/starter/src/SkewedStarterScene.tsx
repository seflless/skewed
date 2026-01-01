import { useEffect, useMemo, useState } from "react";
import {
  AmbientLight,
  Axii,
  Box,
  Camera,
  Color,
  Cylinder,
  DirectionalLight,
  Grid,
  Skewed,
  Sphere,
  Text,
  Vector3,
} from "skewed";

function useViewport() {
  const [viewport, setViewport] = useState(() => ({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () => {
      setViewport({
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewport;
}

export function SkewedStarterScene() {
  const viewport = useViewport();

  const camera = useMemo(() => {
    // Default isometric camera.
    const camera = Camera();
    camera.projectionMatrix.makeOrthographic(0, 1, 0, 1, 0, 10000);
    const rotationDegrees = 45;
    const distance = 20;
    const x = Math.sin((rotationDegrees / 180) * Math.PI) * distance;
    const z = Math.cos((rotationDegrees / 180) * Math.PI) * distance;
    const eye = Vector3(x, 20, z);
    camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
    camera.matrix.setPosition(eye.x, eye.y, eye.z);
    return camera;
  }, []);

  useEffect(() => {
    // Keep projection matrix in sync with the viewport.
    const zoom = 0.85; // slight zoom-out so content fits comfortably
    camera.projectionMatrix.makeOrthographic(
      0,
      viewport.width / zoom,
      0,
      viewport.height / zoom,
      0,
      10000,
    );
  }, [camera, viewport.height, viewport.width]);

  const shapes = useMemo(() => {
    // Half-size spacing for the "behind it on -Z" stacking.
    const zOffsets = [0, -110, -190];
    const scales = [1, 0.5, 0.25] as const;

    const stroke = Color(0, 0, 0, 1);
    const strokeWidth = 3;

    return (
      <>
        <DirectionalLight
          direction={Vector3(-1, -1, -1).normalize()}
          color={Color(255, 244, 214)}
        />
        <AmbientLight color={Color(64, 64, 120)} />

        <Grid
          id="background"
          rotation={Vector3(0, 0, 0)}
          cellCount={12}
          cellSize={100}
          fill={Color(0, 0, 0, 0)}
          stroke={Color(255, 255, 255, 0.15)}
          strokeWidth={2}
        />

        <Axii
          id="axii"
          position={Vector3(0, 0, 0)}
          rotation={Vector3(0, 0, 0)}
          scale={0.5}
          stroke={Color(0, 0, 0, 1)}
          strokeWidth={0.5}
        />

        {/* Boxes (1:1:2 ratio, axis varies per variant) */}
        {(() => {
          const unit = 60;
          const widths = [unit, unit * 2, unit];
          const heights = [unit * 2, unit, unit];
          const depths = [unit, unit, unit * 2];
          const x = -260;

          return scales.map((scale, i) => (
            <Box
              key={`box-${scale}`}
              id={`box-${scale}`}
              position={Vector3(x, (heights[i] * scale) / 2, zOffsets[i])}
              width={widths[i]}
              height={heights[i]}
              depth={depths[i]}
              scale={scale}
              fill={Color(255, 96, 96)}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          ));
        })()}

        {/* Spheres */}
        {(() => {
          const radius = 35;
          const x = -110;
          return scales.map((scale, i) => (
            <Sphere
              key={`sphere-${scale}`}
              id={`sphere-${scale}`}
              position={Vector3(x, radius * scale, zOffsets[i])}
              radius={radius}
              scale={scale}
              fill={Color(255, 180, 64)}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          ));
        })()}

        {/* Cylinders (orientation varies per variant) */}
        {(() => {
          const radius = 30;
          const height = 80;
          const x = 110;
          const rotations = [
            Vector3(0, 0, 0), // up (Y axis)
            Vector3(0, 0, -90), // axis along +X
            Vector3(90, 0, 0), // axis along +Z
          ];

          return scales.map((scale, i) => {
            const isUpright = i === 0;
            const y = isUpright ? (height * scale) / 2 : radius * scale;
            return (
              <Cylinder
                key={`cylinder-${scale}`}
                id={`cylinder-${scale}`}
                position={Vector3(x, y, zOffsets[i])}
                radius={radius}
                height={height}
                scale={scale}
                rotation={rotations[i]}
                fill={Color(140, 160, 255)}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          });
        })()}

        {/* Text */}
        {(() => {
          const fontSize = 60;
          const x = 260;
          return scales.map((scale, i) => (
            <Text
              key={`text-${scale}`}
              id={`text-${scale}`}
              text="TEXT"
              position={Vector3(x, fontSize * 0.7 * scale, zOffsets[i])}
              fontSize={fontSize}
              scale={scale}
              fill={Color(220, 255, 220)}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          ));
        })()}
      </>
    );
  }, []);

  return (
    <div className="absolute inset-0">
      <Skewed viewport={viewport} camera={camera} className="h-full w-full">
        {shapes}
      </Skewed>
      <div className="pointer-events-none absolute left-4 top-4 rounded border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-300 backdrop-blur">
        Dragging is not wired in this starter; the camera is default isometric.
      </div>
    </div>
  );
}
