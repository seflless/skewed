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
import { Axii } from "../Axii";
import { type } from "os";

export default function () {
  const referenceRadius = 75;

  const lightSpeed = 0.3;
  const lightDistance = 400;
  const lightSphere = Sphere({
    // id: "light",
    radius: 10,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
  });

  const scene: Scene = {
    ...getLighting("reference"),
    shapes: [
      getEnvironment("grid"),
      Axii(Vector3(-referenceRadius * 2, 0, 0)),
      Sphere({
        id: "reference",
        radius: referenceRadius,
        stroke: Color(0, 0, 0),
        strokeWidth: 0,
        position: Vector3(0, 0, 0),
      }),
      lightSphere,
    ],
  };

  const { viewport, camera, updateCamera } = getCamera("front");

  const onPointerEvent = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const diffX = event.clientX - centerX;
    const diffY = event.clientY - centerY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    const distanceNormalized = distance / referenceRadius;
    let degrees = distanceNormalized * 90;

    //Math.cos(((distanceNormalized * 90) / 180) * Math.PI);
    // console.log(
    //   degrees,
    //   event.clientX,
    //   event.clientY,
    //   centerX,
    //   centerY,
    //   diffX,
    //   diffY,
    //   distance,
    //   distanceNormalized
    // );

    const spinMode: string = "z";

    if (spinMode === "y") {
      if (diffX < 0) {
        degrees *= -1;
      }
      lightSphere.position.x = Math.sin((degrees / 180) * Math.PI);
      lightSphere.position.y = 0.0;
      // lightSphere.position.y = 0.5;
      lightSphere.position.z = Math.cos((degrees / 180) * Math.PI);

      if (event.buttons === 1) {
        console.log();
        lightSphere.position.z *= -1;
      }
    } else if (spinMode === "z") {
      lightSphere.position.x = Math.sin((degrees / 180) * Math.PI);
      lightSphere.position.y = Math.cos((degrees / 180) * Math.PI);
      // lightSphere.position.z = 0; //
      lightSphere.position.z = -0.5; //
    }

    lightSphere.position.normalize().multiply(referenceRadius);

    // const x = event.clientX;
    // const z = event.clientY;
    // lightSphere.position.y = 0;
    // const x = event.clientX;
    // const y = event.clientY;
  };
  document.addEventListener("pointerdown", onPointerEvent);
  document.addEventListener("pointermove", onPointerEvent);
  document.addEventListener("pointerup", onPointerEvent);

  onUpdate(({ now, deltaTime }) => {
    updateCamera(45, 20);

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
