import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Grid } from "@skewed/react";
import { Color, Vector3 } from "@skewed/core";
import { StorySkewed } from "../StorySkewed";

const meta: Meta = {
  title: "Primitives/Grid",
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <StorySkewed>
      <Grid
        id="background"
        rotation={Vector3(0, 0, 0)}
        cellCount={10}
        cellSize={80}
        fill={Color(0, 0, 0, 0)}
        stroke={Color(0, 0, 0)}
        strokeWidth={3}
      />
    </StorySkewed>
  ),
};


