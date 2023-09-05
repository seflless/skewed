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
        position: Vector3(0, 0, 0),
      }),
      lightSphere,
    ],
  };

  const { viewport, camera, updateCamera } = getCamera("front");

  document.addEventListener("pointermove", (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const diffX = event.clientX - centerX;
    const diffY = event.clientY - centerY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    const distanceNormalized = distance / referenceRadius;
    const degrees = distanceNormalized * 90;
    //Math.cos(((distanceNormalized * 90) / 180) * Math.PI);
    console.log(
      degrees,
      event.clientX,
      event.clientY,
      centerX,
      centerY,
      diffX,
      diffY,
      distance,
      distanceNormalized
    );

    lightSphere.position.x =
      Math.sin((degrees / 180) * Math.PI) * referenceRadius;
    lightSphere.position.y = 0;
    lightSphere.position.z =
      Math.cos((degrees / 180) * Math.PI) * referenceRadius;

    // const x = event.clientX;
    // const z = event.clientY;
    // lightSphere.position.y = 0;
    // const x = event.clientX;
    // const y = event.clientY;
  });

  onUpdate(({ now, deltaTime }) => {
    updateCamera(0);

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
