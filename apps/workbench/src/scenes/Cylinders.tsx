import * as React from "react";
import { Cylinder, Group } from "@skewed/react";
import { Color, Vector3 } from "@skewed/core";

export function CylindersScene({ now }: { now: number }) {
  const count = 5;
  return (
    <Group position={Vector3(0, 60, 0)}>
      {Array.from({ length: count }).map((_, i) => (
        <Group key={i} position={Vector3((i - (count - 1) / 2) * 160, 0, 0)} rotation={Vector3(90, now * 20 + i * 20, 0)}>
          <Cylinder radius={50} height={200} fill={Color(180, 120, 180)} stroke={Color(0, 0, 0)} strokeWidth={2} />
        </Group>
      ))}
    </Group>
  );
}


