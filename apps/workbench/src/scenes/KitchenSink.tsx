import * as React from "react";
import { Box, Cylinder, Group, Html, Mesh, Sphere, Text } from "@skewed/react";
import { BoxMesh, Color, Vector3 } from "@skewed/core";

export function KitchenSinkScene({ now }: { now: number }) {
  const mesh = React.useMemo(() => BoxMesh(120, 80, 60), []);

  return (
    <>
      <Group>
        <Box
          id="box"
          width={160}
          height={120}
          depth={80}
          fill={Color(255, 180, 0)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
          position={Vector3(-220, 60, 0)}
          rotation={Vector3(0, now * 20, 0)}
        />

        <Sphere
          id="sphere"
          radius={90}
          fill={Color(120, 190, 255)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
          position={Vector3(0, 100, 0)}
        />

        <Group position={Vector3(220, 90, 0)} rotation={Vector3(90, now * 30, 0)}>
          <Cylinder
            id="cylinder"
            radius={70}
            height={180}
            fill={Color(180, 120, 180)}
            stroke={Color(0, 0, 0)}
            strokeWidth={2}
          />
        </Group>

        <Mesh
          id="mesh"
          mesh={mesh}
          fill={Color(180, 255, 180)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
          position={Vector3(0, 40, -180)}
          rotation={Vector3(0, now * 25, 0)}
        />

        <Text
          text="Skewed"
          position={Vector3(-100, 250, 0)}
          fontSize={160}
          fill={Color(255, 0, 0)}
          stroke={Color(0, 0, 0)}
          strokeWidth={6}
          rotation={Vector3(0, 135, 0)}
        />
      </Group>

      <Html id="kitchen-sink-hint" position={Vector3(260, 40, 0)} width={260} height={110}>
        <div style={{ background: "rgba(255,255,255,0.9)", border: "2px solid black", padding: 12 }}>
          <strong>KitchenSink</strong>
          <div style={{ fontSize: 12 }}>Box, Sphere, Cylinder, Mesh, Text, Html</div>
        </div>
      </Html>
    </>
  );
}


