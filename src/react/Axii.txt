import React from "react";
import { Box } from "./Box";

export type AxiiProps = {
  x: number;
  y: number;
  z: number;
  scale: number;
};

export function Axii(props: AxiiProps) {
  const thickness = props.scale / 20.0;

  return (
    <g>
      <Box
        x={props.x}
        y={props.y + props.scale / 2 + thickness / 2}
        z={props.z}
        width={thickness}
        height={props.scale}
        depth={thickness}
        fill={"green"}
        stroke={"black"}
      />
      <Box
        x={props.x}
        y={props.y}
        z={props.z + props.scale / 2 + thickness / 2}
        width={thickness}
        height={thickness}
        depth={props.scale}
        fill={"blue"}
        stroke={"black"}
      />
      <Box
        x={props.x + props.scale / 2 + thickness / 2}
        y={props.y}
        z={props.z}
        width={props.scale}
        height={thickness}
        depth={thickness}
        fill={"red"}
        stroke={"black"}
      />
    </g>
  );
}
