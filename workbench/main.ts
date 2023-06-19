import "./index.css";
import {
  Scene,
  Vector3,
  Box,
  Cylinder,
  Viewport,
  render,
  Sphere,
} from "../src/index";
import { Blue, Green, Red, Color } from "../src/colors/Color";

const scene: Scene = {
  shapes: [
    Box(Vector3(0, 50, 0), Red),
    Box(Vector3(150, 50, 0), Green),
    Box(Vector3(300, 50, 0), Blue),
    Cylinder(Vector3(0, 100, 300), Color(255, 0, 255)),
    Sphere(Vector3(300, 100, 300), 75, Color(255, 255, 0)),
  ],
};

const viewport: Viewport = {
  left: 0,
  top: 0,
  width: window.innerWidth,
  height: window.innerHeight,
};

render(document.body, scene, viewport);
