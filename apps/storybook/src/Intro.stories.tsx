import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Skewed/Intro",
};

export default meta;
type Story = StoryObj;

export const ComingSoon: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h2>Skewed React renderer</h2>
      <p>
        Stories will be added for each primitive once the reconciler is wired up.
      </p>
    </div>
  ),
};


