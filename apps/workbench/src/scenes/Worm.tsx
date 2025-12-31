import * as React from "react";
import { Group, Sphere } from "@skewed/react";
import { Color, Vector3 } from "@skewed/core";

export function WormScene({ now }: { now: number }) {
  const segments = 14;
  const spacing = 55;
  const amplitude = 40;

  return (
    <Group position={Vector3(-segments * spacing * 0.25, 80, 0)}>
      {Array.from({ length: segments }).map((_, i) => {
        const phase = now * 2 + i * 0.6;
        return (
          <Sphere
            key={i}
            radius={35 - i * 0.8}
            position={Vector3(i * spacing, Math.sin(phase) * amplitude + 40, Math.cos(phase) * amplitude)}
            fill={Color(180, 120, 180)}
            stroke={Color(0, 0, 0)}
            strokeWidth={2}
          />
        );
      })}
    </Group>
  );
}


