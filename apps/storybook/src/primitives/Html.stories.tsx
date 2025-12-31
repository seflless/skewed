import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AmbientLight, DirectionalLight, Html, Sphere } from "@skewed/react";
import { Color, Vector3 } from "@skewed/core";
import { StorySkewed } from "../StorySkewed";

const meta: Meta = {
  title: "Primitives/Html",
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <StorySkewed>
      <AmbientLight color={Color(64, 64, 64)} />
      <DirectionalLight direction={Vector3(-0.25, -1, -0.25).normalize()} color={Color(255, 252, 255)} />
      <Sphere radius={120} fill={Color(120, 190, 255)} stroke={Color(0, 0, 0)} strokeWidth={2} />
      <Html id="html-story" position={Vector3(0, 120, 0)} width={240} height={90}>
        <div style={{ background: "white", border: "2px solid black", padding: 12 }}>
          <strong>foreignObject Html</strong>
          <div style={{ fontSize: 12 }}>This is regular React DOM</div>
        </div>
      </Html>
    </StorySkewed>
  ),
};


