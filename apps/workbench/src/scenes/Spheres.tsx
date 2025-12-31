import * as React from "react";
import { Group, Sphere } from "@skewed/react";
import { Color, Vector3 } from "@skewed/core";

export function SpheresScene({ now }: { now: number }) {
  const count = 6;
  const radius = 60;
  const ring = 220;

  return (
    <Group position={Vector3(0, 80, 0)}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + now * 0.5;
        return (
          <Sphere
            key={i}
            radius={radius}
            position={Vector3(Math.cos(a) * ring, 0, Math.sin(a) * ring)}
            fill={Color(120, 190, 255)}
            stroke={Color(0, 0, 0)}
            strokeWidth={2}
          />
        );
      })}
    </Group>
  );
}


