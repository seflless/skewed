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
import { getCamera, getGrid, getLighting } from "../Settings";

export default function () {
  const lightBall = Sphere({ radius: 10 });
  const box = Box({});
  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [
      // getGrid(),
      box,
      lightBall,
      // Sphere({
      //   radius: 75,
      //   stroke: Color(0, 0, 0),
      //   strokeWidth: 4,
      //   position: Vector3(0, 35 + 100, 0),
      // }),
      // // Fake shadow
      // Cylinder({
      //   height: 1,
      //   radius: 60,
      //   fill: Color(0, 0, 0, 0.6),
      //   stroke: Color(0, 0, 0, 0),
      // }),
    ],
  };

  const { viewport, camera, updateCamera } = getCamera("isometric");

  let lastRenderTime = performance.now() / 1000;

  function renderLoop() {
    const now = performance.now() / 1000;
    const deltaTime = Math.max(0.0001, now - lastRenderTime);
    lastRenderTime = now;

    const sphereSpeed = 0.1;

    const sphereRotationOffsetDegrees = 65;

    const spherePathRadius = 520;
    lightBall.position.x =
      Math.sin(
        now * Math.PI * 2 * sphereSpeed +
          (sphereRotationOffsetDegrees / 180) * Math.PI
      ) * spherePathRadius;
    lightBall.position.y = 100;
    lightBall.position.z =
      Math.cos(
        now * Math.PI * 2 * sphereSpeed +
          (sphereRotationOffsetDegrees / 180) * Math.PI
      ) * spherePathRadius;

    scene.directionalLight.direction.x = Math.sin(
      now * Math.PI * 2 * sphereSpeed +
        (sphereRotationOffsetDegrees / 180) * Math.PI
    );
    // scene.directionalLight.direction.y = 0.75;
    scene.directionalLight.direction.z = Math.cos(
      now * Math.PI * 2 * sphereSpeed +
        (sphereRotationOffsetDegrees / 180) * Math.PI
    );
    scene.directionalLight.direction.normalize();

    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    render(document.getElementById("root")!, scene, viewport, camera);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}
