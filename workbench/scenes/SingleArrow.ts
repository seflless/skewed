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
  Arrow,
} from "../../src/index";
import {
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";
import { Axii } from "../Axii";
import { type } from "os";

export default function () {
  const referenceRadius = 75;

  const lightSpeed = 0.3;
  const lightDistance = 100;
  const lightSphere = Sphere({
    // id: "light",
    radius: 5,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
    strokeWidth: 10,
  });

  const position = Vector3(0, referenceRadius / 2, 0);

  const scale = 1.3;
  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [
      getEnvironment("white floor"),
      // Axii(Vector3(-referenceRadius * 3, 0, 0)),
      // Group({
      //   position: Vector3(0, 0, 0),
      //   rotation: Vector3(45, 0, 0),
      //   scale: 3,
      //   children: [
      Arrow({
        id: "reference",
        start: Vector3(0, 0, 0),
        middleOffset: 80,
        end: Vector3(200, 200, 0),
        stroke: Color(0, 0, 0),
        strokeWidth: 10,
        scale: scale,
      }),
      Box({
        position: Vector3((100 - 5) * scale, -2, 0),
        height: 1,
        fill: Color(0, 0, 0, 0.5),
        stroke: Color(0, 0, 0, 0.1),
        width: 200,
        depth: 10,
        scale: scale,
      }),
      //   ],
      // }),
      // lightSphere,
    ],
  };

  document.body.style.backgroundColor = "rgb(128,128,128)";

  lightSphere.position = Vector3(0.5, 1, 0);

  const { viewport, camera, updateCamera } = getCamera("isometric");

  onUpdate(({ now, deltaTime }) => {
    const cameraSpeed = 0.18;
    // const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);
    // updateCamera(45, 20);

    // lightSphere.position.x =
    //   Math.sin(now * Math.PI * 2 * lightSpeed) * lightDistance;
    // lightSphere.position.y = 0;
    // lightSphere.position.z =
    //   Math.cos(now * Math.PI * 2 * lightSpeed) * lightDistance;

    scene.directionalLight.direction = lightSphere.position
      .clone()
      .normalize()
      .multiply(-1);

    render(document.getElementById("root")!, scene, viewport, camera);
  });
}
