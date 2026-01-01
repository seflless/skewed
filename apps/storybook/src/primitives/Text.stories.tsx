import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AmbientLight, DirectionalLight, Text } from "skewed";
import { Color, Vector3 } from "skewed";
import { StorySkewed } from "../StorySkewed";

const meta: Meta = {
  title: "Primitives/Text",
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <StorySkewed width={800} height={400}>
      <AmbientLight color={Color(128, 128, 128)} />
      <DirectionalLight
        direction={Vector3(-0.25, -1, -0.25).normalize()}
        color={Color(255, 252, 255)}
      />
      <Text
        text="Hello"
        position={Vector3(0, 200, 0)}
        fontSize={220}
        fill={Color(255, 0, 0)}
        stroke={Color(0, 0, 0)}
        strokeWidth={8}
        rotation={Vector3(15, 135, 15)}
      />
    </StorySkewed>
  ),
};
