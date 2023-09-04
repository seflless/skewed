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
  const referenceRadius = 75;

  const lightSpeed = 0.3;
  const lightDistance = 400;
  const lightSphere = Sphere({
    radius: 10,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
  });

  const scene: Scene = {
    ...getLighting("reference"),
    shapes: [
      getEnvironment("grid"),
      Sphere({
        radius: referenceRadius,
        stroke: Color(0, 0, 0),
        strokeWidth: 0,
        position: Vector3(0, referenceRadius / 2, 0),
      }),
    ],
  };

  const { viewport, camera, updateCamera } = getCamera("top");

  onUpdate(({ now, deltaTime }) => {
    updateCamera(0);

    lightSphere.position.x =
      Math.sin(now * Math.PI * 2 * lightSpeed) * lightDistance;
    lightSphere.position.y = 0;
    lightSphere.position.z =
      Math.cos(now * Math.PI * 2 * lightSpeed) * lightDistance;

    scene.directionalLight.direction = lightSphere.position
      .clone()
      .normalize()
      .multiply(-1);

    render(document.getElementById("root")!, scene, viewport, camera);
  });
}
