import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Box, Cylinder, Html, Mesh, Sphere, Text } from "skewed";
import { AmbientLight, DirectionalLight } from "skewed";
import { BoxMesh, Color, Vector3 } from "skewed";
import { StorySkewed } from "../StorySkewed";

const meta: Meta = {
  title: "Scenes/KitchenSink",
};
export default meta;
type Story = StoryObj;

export const Static: Story = {
  render: () => {
    const mesh = BoxMesh(120, 80, 60);
    return (
      <StorySkewed width={900} height={500}>
        <AmbientLight color={Color(64, 64, 64)} />
        <DirectionalLight
          direction={Vector3(-0.25, -1, -0.25).normalize()}
          color={Color(255, 252, 255)}
        />

        <Box
          width={160}
          height={120}
          depth={80}
          fill={Color(255, 180, 0)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
          position={Vector3(-260, 60, 0)}
        />
        <Sphere
          radius={90}
          fill={Color(120, 190, 255)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
          position={Vector3(0, 100, 0)}
        />
        <Cylinder
          radius={70}
          height={180}
          fill={Color(180, 120, 180)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
          position={Vector3(260, 90, 0)}
          rotation={Vector3(90, 30, 0)}
        />
        <Mesh
          mesh={mesh}
          fill={Color(180, 255, 180)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
          position={Vector3(0, 40, -180)}
        />
        <Text
          text="Skewed"
          position={Vector3(-120, 250, 0)}
          fontSize={160}
          fill={Color(255, 0, 0)}
          stroke={Color(0, 0, 0)}
          strokeWidth={6}
          rotation={Vector3(0, 135, 0)}
        />

        <Html
          id="kitchen-sink-story"
          position={Vector3(300, 40, 0)}
          width={260}
          height={110}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "2px solid black",
              padding: 12,
            }}
          >
            <strong>KitchenSink</strong>
            <div style={{ fontSize: 12 }}>All primitives together</div>
          </div>
        </Html>
      </StorySkewed>
    );
  },
};
