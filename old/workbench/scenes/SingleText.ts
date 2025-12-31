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
  Text,
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
  const lightDistance = 200;
  const lightSphere = Sphere({
    // id: "light",
    radius: 5,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
    strokeWidth: 10,
  });

  const position = Vector3(0, 200, 0);
  const text = Text({
    id: "text",
    text: "Hello",
    position,
    fontSize: 270,
    scale: 1,
    // radius: referenceRadius,
    fill: Color(255, 0, 0),
    stroke: Color(0, 0, 0),
    strokeWidth: 10,
  });

  const referenceBox = Box({
    id: "reference",
    position: position.clone().add(Vector3(400, 0, 0)),
    width: 430,
    height: 130,
    depth: 2,
    // radius: referenceRadius,
    fill: text.fill,
    stroke: text.stroke,
    strokeWidth: 0,
  });

  const fakeShadow = Box({
    id: "reference",
    width: 400,
    height: 1,
    depth: 3,
    // radius: referenceRadius,
    fill: Color(64, 64, 64, 0.5),
    stroke: Color(0, 0, 0),
    strokeWidth: 0,
  });

  const lighting = getLighting("moonlit");
  lighting.ambientLightColor = Color(128, 128, 128);
  const scene: Scene = {
    ...lighting,
    shapes: [
      getEnvironment("white floor"),
      // Axii(Vector3(-referenceRadius * 3, 0, 0)),
      // Group({
      //   position: Vector3(0, 0, 0),
      //   rotation: Vector3(45, 0, 0),
      //   scale: 3,
      //   children: [
      text,
      // fakeShadow,
      // referenceBox,
      // lightSphere,
    ],
  };

  lightSphere.position = Vector3(1, 1, -1);

  lightSphere.fill = scene.directionalLight.color;

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

  const overallSpeed = 1;
  const rotationSpeed = 1 * overallSpeed;

  onUpdate(({ now, deltaTime }) => {
    // const cameraSpeed = 0.1 * overallSpeed;
    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    // updateCamera(45, 20);

    // text.rotation.y = 90;
    text.rotation.x = (now * 180 * rotationSpeed) % 360;
    text.rotation.z = (now * 90 * rotationSpeed) % 360;
    // text.rotation.z = 45;

    // Amount to make it fully invisible when in isometric view and the camera
    // isn't rotated
    text.rotation.y = 135;

    // text.rotation.y = (now * 90 * rotationSpeed) % 360;
    // text.rotation.x = 20;
    referenceBox.rotation = text.rotation.clone();

    // fakeShadow.position = text.position.clone().setY(0);
    // fakeShadow.rotation.y = text.rotation.y;
    // fakeShadow.scale = text.scale;
    // text.rotation.y = (now * 120 * rotationSpeed) % 360;
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
