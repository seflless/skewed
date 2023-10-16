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
  const referenceRadius = 50;

  const lightSpeed = 0.3;
  const lightDistance = 100;
  const lightSphere = Sphere({
    // id: "light",
    radius: 5,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
    strokeWidth: 10,
  });

  const height = referenceRadius * 4;
  // const position = Vector3(0, height / 2, 0);
  const position = Vector3(0, 0, 0);
  const cylinder = Cylinder({
    id: "reference",
    position,
    radius: referenceRadius,
    height,
    // radius: referenceRadius,
    fill: Color(255, 255, 255),
    stroke: Color(0, 0, 0),
    strokeWidth: 0,
  });

  // const cylinder = Box({
  //   id: "reference",
  //   position,
  //   width: referenceRadius * 2,
  //   height,
  //   // radius: referenceRadius,
  //   fill: Color(255, 255, 255),
  //   stroke: Color(0, 0, 0),
  //   strokeWidth: 0,
  // });

  const scene: Scene = {
    ...getLighting("black and white"),
    shapes: [
      getEnvironment("grid"),
      Axii(Vector3(-referenceRadius * 3, 0, 0)),
      // Group({
      //   position: Vector3(0, 0, 0),
      //   rotation: Vector3(45, 0, 0),
      //   scale: 3,
      //   children: [
      cylinder,
      //   ],
      // }),
      lightSphere,
    ],
  };

  lightSphere.position = Vector3(1, 1, -1);

  const { viewport, camera, updateCamera } = getCamera("isometric");

  const onPointerEvent = (event: PointerEvent) => {
    // return;
    event.preventDefault();
    event.stopPropagation();

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const diffX = event.clientX - centerX;
    const diffY = event.clientY - centerY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const lightSpeed = 2;

    const distanceNormalized = distance / referenceRadius;
    let degrees = distanceNormalized * 90;

    const spinMode: string = "z";

    if (spinMode === "y") {
      if (diffX < 0) {
        degrees *= -1;
      }
      lightSphere.position.x = Math.sin((degrees / 180) * Math.PI * lightSpeed);
      lightSphere.position.y = 0.0;
      lightSphere.position.z = Math.cos((degrees / 180) * Math.PI * lightSpeed);

      if (event.buttons === 1) {
        console.log();
        lightSphere.position.z *= -1;
      }
    } else if (spinMode === "z") {
      lightSphere.position.x = Math.sin((degrees / 180) * Math.PI * lightSpeed);
      lightSphere.position.y = Math.cos((degrees / 180) * Math.PI * lightSpeed);
      lightSphere.position.z = 0;
    }

    lightSphere.position.normalize().multiply(lightDistance).add(position);
  };
  document.addEventListener("pointerdown", onPointerEvent);
  document.addEventListener("pointermove", onPointerEvent);
  document.addEventListener("pointerup", onPointerEvent);

  const rotationSpeed = 0.3;

  onUpdate(({ now, deltaTime }) => {
    // const cameraSpeed = 0.1;
    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    // updateCamera(45, 20);

    cylinder.rotation.x = (now * 90 * rotationSpeed) % 360;
    // cylinder.rotation.x = 45;
    // cylinder.rotation.x = 90;
    // cylinder.rotation.y = now * 90;

    // cylinder.rotation.x = now * 90;

    // lightSphere.position.x =
    //   Math.sin(now * Math.PI * 2 * lightSpeed) * lightDistance;
    // lightSphere.position.y = 0;
    // lightSphere.position.z =
    //   Math.cos(now * Math.PI * 2 * lightSpeed) * lightDistance;

    // lightSphere.position = Vector3(1, 0, 1).multiply(lightDistance);

    scene.directionalLight.direction = lightSphere.position
      .clone()
      .normalize()
      .multiply(-1);

    // lightSphere.position.y = height / 2;

    render(document.getElementById("root")!, scene, viewport, camera);
  });
}
