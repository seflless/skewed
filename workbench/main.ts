import "./index.css";
import { Scene, Vector3, Box, Viewport, render } from "../src/index";
import { Blue, Green, Red } from "../src/colors/Color";

const scene: Scene = {
  shapes: [
    Box(Vector3(0, 0, 0), Red),
    Box(Vector3(150, 0, 0), Green),
    Box(Vector3(300, 0, 0), Blue),
  ],
};
const viewport: Viewport = {
  left: 0,
  top: 0,
  width: window.innerWidth,
  height: window.innerHeight,
};

render(document.body, scene, viewport);
