import { useRef, useEffect } from "react";
import { Axii, Box } from "../src/index";
import { Grid } from "../src/index";
import React from "react";

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export default function App() {
  const onSVGPointerDown = (e: PointerEvent) => {};

  const onCanvasPointerDown = (e: PointerEvent) => {};

  return (
    <div>
      <Grid x={0} y={0} z={0} width={4000} depth={4000} />
      <Box
        x={0}
        y={50}
        z={0}
        width={100}
        height={100}
        depth={100}
        fill={"rgba(100,100,255,1.0)"}
        stroke={randomColor()}
      />
      <Axii x={0} y={0} z={0} scale={50} />
    </div>
  );
}
