import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AmbientLight, Cylinder, DirectionalLight, Group } from "skewed";
import { Color, Vector3 } from "skewed";
import { StorySkewed } from "../StorySkewed";

const meta: Meta = {
  title: "Primitives/Cylinder",
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <StorySkewed>
      <AmbientLight color={Color(64, 64, 64)} />
      <DirectionalLight
        direction={Vector3(-0.25, -1, -0.25).normalize()}
        color={Color(255, 252, 255)}
      />
      <Group rotation={Vector3(90, 30, 0)}>
        <Cylinder
          radius={80}
          height={200}
          fill={Color(180, 120, 180)}
          stroke={Color(0, 0, 0)}
          strokeWidth={2}
        />
      </Group>
    </StorySkewed>
  ),
};
