import * as React from "react";
import { Group, Sphere } from "skewed";
import { Color, Vector3 } from "skewed";

export function SingleSphereScene({ now }: { now: number }) {
  return (
    <Group rotation={Vector3(now * 30, now * 20, 0)}>
      <Sphere
        id="sphere"
        radius={120}
        fill={Color(120, 190, 255)}
        stroke={Color(0, 0, 0)}
        strokeWidth={3}
      />
    </Group>
  );
}
