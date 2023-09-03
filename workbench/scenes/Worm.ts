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
  SphereShape,
} from "../../src/index";
import { getCamera, getEnvironment, getLighting, getPaused } from "../Settings";

export default function () {
  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [getEnvironment("white-floor")],
  };

  const spheres: SphereShape[] = [];
  const sphereCount = 100;
  for (let i = 0; i < sphereCount; i++) {
    const sphere = Sphere({
      radius: 30,
      fill: Color(255, 128, 255),
      position: Vector3(i * 100, 0, 0),
      strokeWidth: 0,
    });
    spheres.push(sphere);
    scene.shapes.push(sphere);
  }

  const { viewport, camera, updateCamera } = getCamera("isometric");

  let lastRenderTime = performance.now() / 1000;

  function renderLoop() {
    if (getPaused()) {
      requestAnimationFrame(renderLoop);
      return;
    }
    const now = performance.now() / 1000;
    const deltaTime = Math.max(0.0001, now - lastRenderTime);
    lastRenderTime = now;

    spheres.forEach((sphere, index) => {
      const percent = now / 1.5;

      const degreeOffet = (index / sphereCount) * 360;
      const finalDegree = degreeOffet + percent * 360;

      sphere.position.x = Math.sin((finalDegree / 180) * Math.PI) * 40;
      sphere.position.y = sphere.radius;
      sphere.position.z = (index * 400) / (sphereCount - 1) - 200;
    });

    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    render(document.getElementById("root")!, scene, viewport, camera);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}
