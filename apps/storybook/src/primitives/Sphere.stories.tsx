import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AmbientLight, DirectionalLight, Sphere } from "skewed";
import { Color, Vector3 } from "skewed";
import { StorySkewed } from "../StorySkewed";

const meta: Meta = {
  title: "Primitives/Sphere",
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <StorySkewed>
      <AmbientLight color={Color(64, 64, 64)} />
      <DirectionalLight direction={Vector3(-0.25, -1, -0.25).normalize()} color={Color(255, 252, 255)} />
      <Sphere radius={120} fill={Color(120, 190, 255)} stroke={Color(0, 0, 0)} strokeWidth={2} />
    </StorySkewed>
  ),
};


