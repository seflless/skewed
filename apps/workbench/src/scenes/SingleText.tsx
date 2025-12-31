import * as React from "react";
import { Group, Html, Text } from "@skewed/react";
import { Color, Vector3 } from "@skewed/core";

export function SingleTextScene({ now }: { now: number }) {
  const position = Vector3(0, 200, 0);
  return (
    <>
      <Group>
        <Text
          id="text"
          text="Hello"
          position={position}
          fontSize={270}
          fill={Color(255, 0, 0)}
          stroke={Color(0, 0, 0)}
          strokeWidth={10}
          rotation={Vector3((now * 180) % 360, 135, (now * 90) % 360)}
        />
      </Group>
      <Html position={Vector3(200, 40, 0)} width={260} height={90}>
        <div style={{ background: "rgba(255,255,255,0.9)", border: "2px solid black", padding: 12 }}>
          <strong>SingleText</strong>
          <div style={{ fontSize: 12 }}>Rotating Text + Html</div>
        </div>
      </Html>
    </>
  );
}


