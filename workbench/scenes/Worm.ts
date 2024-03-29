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
    shapes: [getEnvironment("white floor")],
  };

  const scale = 1.5;
  const spheres: SphereShape[] = [];
  const sphereCount = 100;
  for (let i = 0; i < sphereCount; i++) {
    const sphere = Sphere({
      radius: 30 * scale,
      fill: Color(255, 128, 255),
      position: Vector3(i * 100, 0, 0),
      strokeWidth: 0,
    });
    spheres.push(sphere);
    scene.shapes.push(sphere);
  }

  const { viewport, camera, updateCamera } = getCamera("isometric");

  onUpdate(({ now, deltaTime }) => {
    spheres.forEach((sphere, index) => {
      const percent = now / 1.5;

      const degreeOffet = (index / sphereCount) * 360;
      const finalDegree = degreeOffet + percent * 360;

      sphere.position.x = Math.sin((finalDegree / 180) * Math.PI) * 40 - 50;
      sphere.position.x *= scale;
      sphere.position.y = sphere.radius / 2;
      sphere.position.y *= scale;
      sphere.position.z = (index * 300) / (sphereCount - 1) - 200;
      sphere.position.z *= scale;
    });

    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    render(document.getElementById("root")!, scene, viewport, camera);
  });
}
