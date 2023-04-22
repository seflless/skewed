import { useRef, useEffect } from "react";
import { Box } from "../src/index";
import React from "react";

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export default function App() {
  const onSVGPointerDown = (e: PointerEvent) => {};

  const onCanvasPointerDown = (e: PointerEvent) => {};

  return (
    <Box
      x={0}
      y={0}
      z={0}
      width={100}
      height={100}
      depth={100}
      fill={randomColor()}
      stroke={randomColor()}
    />
  );
}
