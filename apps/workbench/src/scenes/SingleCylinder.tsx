import * as React from "react";
import { Cylinder, Group } from "skewed";
import { Color, Vector3 } from "skewed";

export function SingleCylinderScene({ now }: { now: number }) {
  return (
    <Group rotation={Vector3(90, now * 30, 0)}>
      <Cylinder
        id="cylinder"
        radius={80}
        height={200}
        fill={Color(180, 120, 180)}
        stroke={Color(0, 0, 0)}
        strokeWidth={3}
      />
    </Group>
  );
}


