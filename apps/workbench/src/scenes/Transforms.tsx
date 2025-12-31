import * as React from "react";
import { Box, Group, Sphere, Text } from "@skewed/react";
import { Color, Vector3 } from "@skewed/core";

export function TransformsScene({ now }: { now: number }) {
  return (
    <Group position={Vector3(0, 60, 0)}>
      <Group rotation={Vector3(0, now * 30, 0)}>
        <Box width={120} height={120} depth={120} fill={Color(255, 180, 0)} stroke={Color(0, 0, 0)} strokeWidth={2} />
        <Group position={Vector3(160, 0, 0)} rotation={Vector3(0, now * 60, 0)} scale={0.8}>
          <Sphere radius={60} fill={Color(120, 190, 255)} stroke={Color(0, 0, 0)} strokeWidth={2} />
          <Group position={Vector3(90, 0, 0)} rotation={Vector3(0, 0, now * 90)} scale={0.6}>
            <Box width={80} height={80} depth={80} fill={Color(180, 255, 180)} stroke={Color(0, 0, 0)} strokeWidth={2} />
          </Group>
        </Group>
      </Group>
      <Text
        text="Transforms"
        position={Vector3(-220, 240, 0)}
        fontSize={100}
        fill={Color(255, 0, 0)}
        stroke={Color(0, 0, 0)}
        strokeWidth={4}
        rotation={Vector3(0, 135, 0)}
      />
    </Group>
  );
}


