import {
  Scene,
  Vector3,
  Box,
  Sphere,
  Cylinder,
  render,
  Group,
  Grid,
  Color,
} from "../../src/index";
import {
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";

export default function () {
  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [
      getEnvironment("white floor"),

      Group({
        position: Vector3(-450, 50, -450),
        rotation: Vector3(0, 0, 0),
        scale: 1,
        children: [
          Box({
            rotation: Vector3(0, 0, 0),
            fill: Color(255, 255, 255),
          }),
          Group({
            position: Vector3(200, 0, 0),
            rotation: Vector3(0, 0, 0),
            scale: 1,
            children: [
              Box({
                fill: Color(255, 0, 0),
              }),
              Group({
                position: Vector3(200, 0, 0),
                rotation: Vector3(0, 0, 0),
                scale: 1,
                children: [
                  Box({
                    fill: Color(0, 255, 0),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  };

  const { viewport, camera, updateCamera } = getCamera("isometric");

  onUpdate(({ now, deltaTime }) => {
    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    render(document.getElementById("root")!, scene, viewport, camera);
  });
}
